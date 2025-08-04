import { Component, Injector, inject, output, viewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    DynamicEntityPropertyDto,
    DynamicEntityPropertyServiceProxy,
    DynamicPropertyServiceProxy,
    DynamicEntityPropertyDefinitionServiceProxy,
    DynamicPropertyDto,
} from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import { AppBsModalDirective } from '../../../../shared/common/appBsModal/app-bs-modal.directive';

import { FormsModule } from '@angular/forms';
import { ButtonBusyDirective } from '../../../../shared/utils/button-busy.directive';
import { LocalizePipe } from '@shared/common/pipes/localize.pipe';

@Component({
    selector: 'create-dynamic-entity-property-modal',
    templateUrl: './create-dynamic-entity-property-modal.component.html',
    imports: [AppBsModalDirective, FormsModule, ButtonBusyDirective, LocalizePipe],
})
export class CreateDynamicEntityPropertyModalComponent extends AppComponentBase {
    private _dynamicEntityPropertyService = inject(DynamicEntityPropertyServiceProxy);
    private _dynamicPropertyService = inject(DynamicPropertyServiceProxy);
    private _dynamicEntityParameterDefinitionService = inject(DynamicEntityPropertyDefinitionServiceProxy);

    private entityFullName: string;

    readonly modalSave = output<any>();
    readonly modal = viewChild<ModalDirective>('createModal');
    dynamicEntityProperty = new DynamicEntityPropertyDto();
    allDynamicProperties: DynamicPropertyDto[];
    initialized = false;
    saving = false;

    constructor(...args: unknown[]);

    constructor() {
        const injector = inject(Injector);

        super(injector);
    }

    show(entityFullName: string): void {
        this.entityFullName = entityFullName;
        this.initialize();
        this.dynamicEntityProperty = new DynamicEntityPropertyDto();
        this.dynamicEntityProperty.entityFullName = this.entityFullName;
        this.modal().show();
    }

    save(): void {
        this.saving = true;
        this.showMainSpinner();

        this.dynamicEntityProperty.tenantId = abp.session.tenantId; // remove that
        this._dynamicEntityPropertyService.add(this.dynamicEntityProperty).subscribe(
            () => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.hideMainSpinner();
                this.modalSave.emit(null);
                this.modal().hide();
                this.saving = false;
            },
            (e) => {
                this.hideMainSpinner();
                this.saving = false;
            }
        );
    }

    close(): void {
        this.modal().hide();
    }

    private initialize() {
        this.initialized = false;
        let definedParametersObservable = this._dynamicEntityPropertyService.getAllPropertiesOfAnEntity(
            this.entityFullName
        );
        let allParametersObservable = this._dynamicPropertyService.getAll();
        this.showMainSpinner();
        forkJoin([allParametersObservable, definedParametersObservable]).subscribe(
            ([dynamicProperties, definedParameters]) => {
                this.allDynamicProperties = dynamicProperties.items.filter(function (element) {
                    return definedParameters.items.map((item) => item.dynamicPropertyId).indexOf(element.id) === -1;
                });
                this.hideMainSpinner();
                this.initialized = true;
            },
            (err) => {
                this.hideMainSpinner();
            }
        );
    }
}
