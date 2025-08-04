import { Component, Injector, inject, output, viewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    CreateUserDelegationDto,
    NameValueDto,
    FindUsersInput,
    CommonLookupServiceProxy,
    UserDelegationServiceProxy,
    FindUsersOutputDto,
} from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CommonLookupModalComponent } from '@app/shared/common/lookup/common-lookup-modal.component';
import { finalize } from 'rxjs/operators';
import { DateTime } from 'luxon';
import { DateTimeService } from '../common/timing/date-time.service';
import { AppBsModalDirective } from '../../../shared/common/appBsModal/app-bs-modal.directive';

import { FormsModule } from '@angular/forms';
import { BsDatepickerInputDirective, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { DatePickerLuxonModifierDirective } from '../../../shared/utils/date-time/date-picker-luxon-modifier.directive';
import { ButtonBusyDirective } from '../../../shared/utils/button-busy.directive';
import { CommonLookupModalComponent as CommonLookupModalComponent_1 } from '../common/lookup/common-lookup-modal.component';
import { LocalizePipe } from '@shared/common/pipes/localize.pipe';

@Component({
    selector: 'createNewUserDelegation',
    templateUrl: './create-new-user-delegation-modal.component.html',
    imports: [
        AppBsModalDirective,
        FormsModule,
        BsDatepickerInputDirective,
        BsDatepickerDirective,
        DatePickerLuxonModifierDirective,
        ButtonBusyDirective,
        CommonLookupModalComponent_1,
        LocalizePipe,
    ],
})
export class CreateNewUserDelegationModalComponent extends AppComponentBase {
    private _userDelegationService = inject(UserDelegationServiceProxy);
    private _commonLookupService = inject(CommonLookupServiceProxy);
    private _dateTimeService = inject(DateTimeService);

    readonly modal = viewChild<ModalDirective>('userDelegationModal');
    readonly userLookupModal = viewChild<CommonLookupModalComponent>('userLookupModal');
    readonly modalSave = output<any>();

    active = false;
    saving = false;
    selectedUsername = '';

    userDelegation: CreateUserDelegationDto = new CreateUserDelegationDto();

    constructor(...args: unknown[]);

    constructor() {
        const injector = inject(Injector);

        super(injector);
    }

    show(): void {
        this.active = true;
        this.userDelegation = new CreateUserDelegationDto();

        this.userLookupModal().configure({
            title: this.l('SelectAUser'),
            dataSource: (skipCount: number, maxResultCount: number, filter: string, tenantId?: number) => {
                let input = new FindUsersInput();
                input.filter = filter;
                input.excludeCurrentUser = true;
                input.maxResultCount = maxResultCount;
                input.skipCount = skipCount;
                input.tenantId = tenantId;
                return this._commonLookupService.findUsers(input);
            },
        });

        this.modal().show();
    }

    showCommonLookupModal(): void {
        this.userLookupModal().show();
    }

    userSelected(user: FindUsersOutputDto): void {
        this.userDelegation.targetUserId = user.id;
        this.selectedUsername = user.name;
    }

    setUserIdNull() {
        this.userDelegation.targetUserId = null;
        this.selectedUsername = null;
    }

    save(): void {
        this.saving = true;

        let input = new CreateUserDelegationDto();
        input.targetUserId = this.userDelegation.targetUserId;
        input.startTime = this._dateTimeService.getStartOfDayForDate(this.userDelegation.startTime);
        input.endTime = this._dateTimeService.getEndOfDayForDate(this.userDelegation.endTime);

        this._userDelegationService
            .delegateNewUser(input)
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.selectedUsername = '';
        this.modal().hide();
    }
}
