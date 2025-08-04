import { Component, Injector, inject, viewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DynamicPropertyValueDto, DynamicPropertyValueServiceProxy } from '@shared/service-proxies/service-proxies';
import { Observable } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppBsModalDirective } from '../../../../shared/common/appBsModal/app-bs-modal.directive';

import { FormsModule } from '@angular/forms';
import { BusyIfDirective } from '../../../../shared/utils/busy-if.directive';
import { TableModule } from 'primeng/table';
import { LocalizePipe } from '@shared/common/pipes/localize.pipe';
import { PermissionPipe } from '@shared/common/pipes/permission.pipe';

@Component({
    selector: 'dynamic-property-value-modal',
    templateUrl: './dynamic-property-value-modal.component.html',
    imports: [AppBsModalDirective, FormsModule, BusyIfDirective, TableModule, LocalizePipe, PermissionPipe],
})
export class DynamicPropertyValueModalComponent extends AppComponentBase {
    private _dynamicPropertyValueAppService = inject(DynamicPropertyValueServiceProxy);

    readonly modal = viewChild<ModalDirective>('createOrEditModal');
    dynamicPropertyValue: DynamicPropertyValueDto;

    createOrEditValueEnabled = false;
    saving = false;
    dynamicPropertyId: number;

    constructor(...args: unknown[]);

    constructor() {
        const injector = inject(Injector);

        super(injector);
    }

    getDynamicProperties(): void {
        this.showMainSpinner();
        this._dynamicPropertyValueAppService.getAllValuesOfDynamicProperty(this.dynamicPropertyId).subscribe(
            (result) => {
                this.primengTableHelper.totalRecordsCount = result.items.length;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
                this.hideMainSpinner();
            },
            (err) => {
                this.hideMainSpinner();
            }
        );
    }

    editDynamicPropertyValue(dynamicPropertyValueId: number): void {
        this._dynamicPropertyValueAppService.get(dynamicPropertyValueId).subscribe(
            (data) => {
                this.dynamicPropertyValue = data;
                this.createOrEditValueEnabled = true;
                this.hideMainSpinner();
            },
            (err) => {
                this.hideMainSpinner();
            }
        );
    }

    deleteDynamicPropertyValue(dynamicPropertyValueId: number): void {
        this.message.confirm(this.l('DeleteDynamicPropertyValueMessage'), this.l('AreYouSure'), (isConfirmed) => {
            if (isConfirmed) {
                this._dynamicPropertyValueAppService.delete(dynamicPropertyValueId).subscribe(() => {
                    abp.notify.success(this.l('SuccessfullyDeleted'));
                    this.getDynamicProperties();
                });
            }
        });
    }

    createDynamicPropertyValue(): void {
        this.dynamicPropertyValue = new DynamicPropertyValueDto();
        this.dynamicPropertyValue.dynamicPropertyId = this.dynamicPropertyId;
        this.createOrEditValueEnabled = true;
    }

    show(dynamicPropertyId?: number) {
        this.dynamicPropertyValue = new DynamicPropertyValueDto();
        this.dynamicPropertyValue.dynamicPropertyId = dynamicPropertyId;
        this.dynamicPropertyId = dynamicPropertyId;
        this.getDynamicProperties();
        this.modal().show();
        return;
    }

    save(): void {
        this.saving = true;
        this.showMainSpinner();

        let observable: Observable<void>;
        if (!this.dynamicPropertyValue.id) {
            observable = this._dynamicPropertyValueAppService.add(this.dynamicPropertyValue);
        } else {
            observable = this._dynamicPropertyValueAppService.update(this.dynamicPropertyValue);
        }

        observable.subscribe(
            () => {
                this.getDynamicProperties();
                this.notify.info(this.l('SavedSuccessfully'));
                this.hideMainSpinner();
                this.saving = false;
                this.createOrEditValueEnabled = false;
            },
            (e) => {
                this.hideMainSpinner();
                this.saving = false;
                this.createOrEditValueEnabled = false;
            }
        );
    }

    close(): void {
        this.modal().hide();
    }
}
