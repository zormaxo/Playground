import { Component, Injector, OnInit, forwardRef, HostBinding, inject, input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { UserDelegationServiceProxy, UserDelegationDto } from '@shared/service-proxies/service-proxies';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { ImpersonationService } from '@app/admin/users/impersonation.service';

import { LuxonFormatPipe } from '../../../../shared/utils/luxon-format.pipe';
import { LocalizePipe } from '@shared/common/pipes/localize.pipe';

@Component({
    selector: 'active-delegated-users-combo',
    template: `
        @if (delegations?.length) {
            <div class="d-flex align-items-center ms-1 ms-lg-3 active-user-delegations">
                <div [class]="customStyle()">
                    <select
                        class="form-control form-control-sm"
                        (change)="switchToDelegatedUser($event)"
                        [(ngModel)]="selectedUserDelegationId">
                        <option selected="selected" value="0">{{ 'SwitchToUser' | localize }}</option>
                        @for (delegation of delegations; track delegation) {
                            <option [value]="delegation.id" [attr.data-username]="delegation.username">
                                {{ delegation.username }} ({{
                                    'ExpiresAt' | localize: (delegation.endTime | luxonFormat: 'F')
                                }})
                            </option>
                        }
                    </select>
                </div>
            </div>
        }
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ActiveDelegatedUsersComboComponent),
            multi: true,
        },
    ],
    imports: [FormsModule, LuxonFormatPipe, LocalizePipe],
})
export class ActiveDelegatedUsersComboComponent extends AppComponentBase implements OnInit {
    private _userDelegationService = inject(UserDelegationServiceProxy);
    private _impersonationService = inject(ImpersonationService);

    @HostBinding('style.display') public display = 'flex';
    readonly customStyle = input('btn btn-clean btn-lg me-1 mt-2');

    delegations: UserDelegationDto[] = [];
    selectedUserDelegationId = 0;
    currentSelectedUserDelegationId = 0;

    constructor(...args: unknown[]);

    constructor() {
        const injector = inject(Injector);

        super(injector);
    }

    ngOnInit(): void {
        this._userDelegationService.getActiveUserDelegations().subscribe((result) => {
            this.delegations = result;
        });
    }

    switchToDelegatedUser($event): void {
        let username = $event.target.selectedOptions[0].getAttribute('data-username');

        this.message.confirm(
            this.l('SwitchToDelegatedUserWarningMessage', username),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.currentSelectedUserDelegationId = this.selectedUserDelegationId;
                    this._impersonationService.delegatedImpersonate(
                        this.selectedUserDelegationId,
                        this.appSession.tenantId
                    );
                } else {
                    this.selectedUserDelegationId = this.currentSelectedUserDelegationId;
                }
            }
        );
    }
}
