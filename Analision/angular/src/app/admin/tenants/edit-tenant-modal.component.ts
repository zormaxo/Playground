import { Component, ElementRef, Injector, inject, output, viewChild } from '@angular/core';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    CommonLookupServiceProxy,
    SubscribableEditionComboboxItemDto,
    TenantEditDto,
    TenantServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { filter as _filter } from 'lodash-es';
import { DateTime } from 'luxon';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { AppBsModalDirective } from '../../../shared/common/appBsModal/app-bs-modal.directive';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ValidationMessagesComponent } from '../../../shared/utils/validation-messages.component';
import { BsDatepickerInputDirective, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { DatePickerLuxonModifierDirective } from '../../../shared/utils/date-time/date-picker-luxon-modifier.directive';
import { ButtonBusyDirective } from '../../../shared/utils/button-busy.directive';
import { LocalizePipe } from '@shared/common/pipes/localize.pipe';

@Component({
    selector: 'editTenantModal',
    templateUrl: './edit-tenant-modal.component.html',
    imports: [
        AppBsModalDirective,
        FormsModule,
        NgClass,
        ValidationMessagesComponent,
        BsDatepickerInputDirective,
        BsDatepickerDirective,
        DatePickerLuxonModifierDirective,
        ButtonBusyDirective,
        LocalizePipe,
    ],
})
export class EditTenantModalComponent extends AppComponentBase {
    private _tenantService = inject(TenantServiceProxy);
    private _commonLookupService = inject(CommonLookupServiceProxy);
    private _dateTimeService = inject(DateTimeService);

    readonly nameInput = viewChild<ElementRef>('nameInput');
    readonly modal = viewChild<ModalDirective>('editModal');
    readonly subscriptionEndDateUtc = viewChild<ElementRef>('SubscriptionEndDateUtc');

    readonly modalSave = output<any>();

    active = false;
    saving = false;
    isUnlimited = false;
    subscriptionEndDateUtcIsValid = false;

    tenant: TenantEditDto = undefined;
    currentConnectionString: string;
    editions: SubscribableEditionComboboxItemDto[] = [];
    isSubscriptionFieldsVisible = false;

    constructor(...args: unknown[]);

    constructor() {
        const injector = inject(Injector);

        super(injector);
    }

    show(tenantId: number): void {
        this.active = true;

        this._commonLookupService.getEditionsForCombobox(false).subscribe((editionsResult) => {
            this.editions = editionsResult.items;
            let notSelectedEdition = new SubscribableEditionComboboxItemDto();
            notSelectedEdition.displayText = this.l('NotAssigned');
            notSelectedEdition.value = '';
            this.editions.unshift(notSelectedEdition);

            this._tenantService.getTenantForEdit(tenantId).subscribe((tenantResult) => {
                this.tenant = tenantResult;
                this.currentConnectionString = tenantResult.connectionString;
                this.tenant.editionId = this.tenant.editionId || 0;
                this.isUnlimited = !this.tenant.subscriptionEndDateUtc;
                this.subscriptionEndDateUtcIsValid =
                    this.isUnlimited || this.tenant.subscriptionEndDateUtc !== undefined;
                this.modal().show();
                this.toggleSubscriptionFields();
            });
        });
    }

    onShown(): void {
        document.getElementById('Name').focus();
    }

    subscriptionEndDateChange(e): void {
        this.subscriptionEndDateUtcIsValid = (e && e.date !== false) || this.isUnlimited;
    }

    selectedEditionIsFree(): boolean {
        if (!this.tenant.editionId) {
            return true;
        }

        let selectedEditions = _filter(this.editions, { value: this.tenant.editionId + '' });
        if (selectedEditions.length !== 1) {
            return true;
        }

        let selectedEdition = selectedEditions[0];
        return selectedEdition.isFree;
    }

    save(): void {
        this.saving = true;
        if (this.tenant.editionId === 0) {
            this.tenant.editionId = null;
        }

        if (this.isUnlimited) {
            this.tenant.isInTrialPeriod = false;
        }

        // take selected date as UTC
        if (this.isUnlimited || !this.tenant.editionId) {
            this.tenant.subscriptionEndDateUtc = null;
        } else {
            this.tenant.subscriptionEndDateUtc = this.tenant.subscriptionEndDateUtc.toLocal();
        }

        this._tenantService
            .updateTenant(this.tenant)
            .pipe(finalize(() => (this.saving = false)))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.modal().hide();
    }

    onEditionChange(): void {
        if (this.selectedEditionIsFree()) {
            this.tenant.isInTrialPeriod = false;
        }

        this.toggleSubscriptionFields();
    }

    onUnlimitedChange(): void {
        if (this.isUnlimited) {
            this.tenant.subscriptionEndDateUtc = null;
            this.subscriptionEndDateUtcIsValid = true;
            this.tenant.isInTrialPeriod = false;
        } else {
            if (!this.tenant.subscriptionEndDateUtc) {
                this.subscriptionEndDateUtcIsValid = false;
            }
        }
    }

    toggleSubscriptionFields() {
        if (this.tenant.editionId > 0) {
            this.isSubscriptionFieldsVisible = true;
        } else {
            this.isSubscriptionFieldsVisible = false;
        }
    }
}
