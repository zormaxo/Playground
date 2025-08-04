import { Component, Injector, inject, output, viewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    NameValueDto,
    OrganizationUnitServiceProxy,
    OrganizationUnitDto,
} from '@shared/service-proxies/service-proxies';
import {
    IOrganizationUnitsTreeComponentData,
    OrganizationUnitsTreeComponent,
} from '../shared/organization-unit-tree.component';
import { AppBsModalDirective } from '../../../shared/common/appBsModal/app-bs-modal.directive';
import { ButtonBusyDirective } from '../../../shared/utils/button-busy.directive';
import { LocalizePipe } from '@shared/common/pipes/localize.pipe';

@Component({
    selector: 'organization-unit-lookup-table-modal',
    templateUrl: './organization-unit-lookup-table-modal.component.html',
    imports: [AppBsModalDirective, OrganizationUnitsTreeComponent, ButtonBusyDirective, LocalizePipe],
})
export class OrganizationUnitLookupTableModalComponent extends AppComponentBase {
    private _organizationUnitServiceProxy = inject(OrganizationUnitServiceProxy);

    readonly modal = viewChild<ModalDirective>('organizationUnitLookupTableModal');
    readonly organizationUnitTree = viewChild<OrganizationUnitsTreeComponent>('organizationUnitTree');

    readonly modalSave = output<NameValueDto[]>();

    filterText = '';
    active = false;
    saving = false;
    allOrganizationUnits: OrganizationUnitDto[];

    constructor(...args: unknown[]);

    constructor() {
        const injector = inject(Injector);

        super(injector);
    }

    show(): void {
        this.active = true;
        this.modal().show();
        this.getOrganizationUnits();
    }

    getOrganizationUnits(): void {
        this._organizationUnitServiceProxy.getAll().subscribe((result) => {
            this.allOrganizationUnits = result;
        });
    }

    onShown(): void {
        this.organizationUnitTree().data = <IOrganizationUnitsTreeComponentData>{
            allOrganizationUnits: this.allOrganizationUnits,
            selectedOrganizationUnits: [],
        };
    }

    save() {
        this.active = false;
        this.modal().hide();
        this.modalSave.emit(this.organizationUnitTree().getSelectedOrganizations());
    }

    close(): void {
        this.active = false;
        this.modal().hide();
    }
}
