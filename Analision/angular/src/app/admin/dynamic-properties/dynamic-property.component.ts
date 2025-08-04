import { Component, Injector, inject, viewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DynamicPropertyDto, DynamicPropertyServiceProxy } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateOrEditDynamicPropertyModalComponent } from './create-or-edit-dynamic-property-modal.component';
import { InputTypeConfigurationService } from '@app/shared/common/input-types/input-type-configuration.service';
import { DynamicPropertyValueModalComponent } from '@app/admin/dynamic-properties/dynamic-property-value/dynamic-property-value-modal.component';
import { SubHeaderComponent } from '../../shared/common/sub-header/sub-header.component';
import { TabsetComponent, TabDirective } from 'ngx-bootstrap/tabs';
import { BusyIfDirective } from '../../../shared/utils/busy-if.directive';
import { TableModule } from 'primeng/table';
import { BsDropdownDirective, BsDropdownToggleDirective, BsDropdownMenuDirective } from 'ngx-bootstrap/dropdown';
import { DynamicEntityPropertyListComponent } from './dynamic-entity-properties/dynamic-entity-property-list.component';
import { DynamicPropertyValueModalComponent as DynamicPropertyValueModalComponent_1 } from './dynamic-property-value/dynamic-property-value-modal.component';
import { LocalizePipe } from '@shared/common/pipes/localize.pipe';
import { PermissionPipe } from '@shared/common/pipes/permission.pipe';

@Component({
    templateUrl: './dynamic-property.component.html',
    animations: [appModuleAnimation()],
    imports: [
        SubHeaderComponent,
        TabsetComponent,
        TabDirective,
        BusyIfDirective,
        TableModule,
        BsDropdownDirective,
        BsDropdownToggleDirective,
        BsDropdownMenuDirective,
        DynamicEntityPropertyListComponent,
        DynamicPropertyValueModalComponent_1,
        CreateOrEditDynamicPropertyModalComponent,
        LocalizePipe,
        PermissionPipe,
    ],
})
export class DynamicPropertyComponent extends AppComponentBase {
    private _dynamicPropertyService = inject(DynamicPropertyServiceProxy);
    private _inputTypeConfigurationService = inject(InputTypeConfigurationService);

    readonly createOrEditDynamicPropertyModal =
        viewChild<CreateOrEditDynamicPropertyModalComponent>('createOrEditDynamicProperty');
    readonly dynamicPropertyValueModal = viewChild<DynamicPropertyValueModalComponent>('dynamicPropertyValueModal');

    constructor(...args: unknown[]);

    constructor() {
        const injector = inject(Injector);

        super(injector);
    }

    getDynamicProperties(): void {
        this.primengTableHelper.showLoadingIndicator();
        this._dynamicPropertyService.getAll().subscribe(
            (result) => {
                this.primengTableHelper.totalRecordsCount = result.items.length;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            },
            (err) => {
                this.primengTableHelper.hideLoadingIndicator();
            }
        );
    }

    addNewDynamicProperty(): void {
        this.createOrEditDynamicPropertyModal().show();
    }

    editDynamicProperty(dynamicPropertyId: number): void {
        this.createOrEditDynamicPropertyModal().show(dynamicPropertyId);
    }

    deleteDynamicProperty(dynamicPropertyId: number): void {
        this.message.confirm(this.l('DeleteDynamicPropertyMessage'), this.l('AreYouSure'), (isConfirmed) => {
            if (isConfirmed) {
                this._dynamicPropertyService.delete(dynamicPropertyId).subscribe(() => {
                    abp.notify.success(this.l('SuccessfullyDeleted'));
                    this.getDynamicProperties();
                });
            }
        });
    }

    editValues(dynamicProperty: DynamicPropertyDto): void {
        this.dynamicPropertyValueModal().show(dynamicProperty.id);
    }

    hasValues(inputType: string): boolean {
        return this._inputTypeConfigurationService.getByName(inputType).hasValues;
    }
}
