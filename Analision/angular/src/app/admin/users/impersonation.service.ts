import { Injectable, inject } from '@angular/core';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { AppUrlService } from '@shared/common/nav/app-url.service';
import {
    AccountServiceProxy,
    ImpersonateUserInput,
    ImpersonateTenantInput,
    ImpersonateOutput,
    DelegatedImpersonateInput,
} from '@shared/service-proxies/service-proxies';

@Injectable()
export class ImpersonationService {
    private _accountService = inject(AccountServiceProxy);
    private _appUrlService = inject(AppUrlService);
    private _authService = inject(AppAuthService);

    constructor(...args: unknown[]);

    constructor() {}

    impersonateTenant(userId: number, tenantId?: number): void {
        const input = new ImpersonateTenantInput();
        input.userId = userId;
        input.tenantId = tenantId;

        this._accountService.impersonateTenant(input).subscribe((result: ImpersonateOutput) => {
            let targetUrl = this.getAppRootUrl(result) + '?impersonationToken=' + result.impersonationToken;
            if (input.tenantId) {
                targetUrl = targetUrl + '&tenantId=' + input.tenantId;
            }

            this._authService.logout(true, targetUrl);
        });
    }

    impersonateUser(userId: number, tenantId: number): void {
        const input = new ImpersonateUserInput();
        input.userId = userId;
        input.tenantId = tenantId;

        this._accountService.impersonateUser(input).subscribe((result: ImpersonateOutput) => {
            let targetUrl = this.getAppRootUrl(result) + '?impersonationToken=' + result.impersonationToken;
            if (input.tenantId) {
                targetUrl = targetUrl + '&tenantId=' + input.tenantId;
            }

            this._authService.logout(true, targetUrl);
        });
    }

    delegatedImpersonate(userDelegationId: number, tenantId?: number): void {
        const input = new DelegatedImpersonateInput();
        input.userDelegationId = userDelegationId;

        this._accountService.delegatedImpersonate(input).subscribe((result: ImpersonateOutput) => {
            let targetUrl = this.getAppRootUrl(result) + '?impersonationToken=' + result.impersonationToken;
            targetUrl = targetUrl + '&userDelegationId=' + userDelegationId;
            if (tenantId) {
                targetUrl = targetUrl + '&tenantId=' + tenantId;
            }

            this._authService.logout(true, targetUrl);
        });
    }

    backToImpersonator(): void {
        this._accountService.backToImpersonator().subscribe((result: ImpersonateOutput) => {
            let targetUrl = this.getAppRootUrl(result) + '?impersonationToken=' + result.impersonationToken;
            if (abp.session.impersonatorTenantId) {
                targetUrl = targetUrl + '&tenantId=' + abp.session.impersonatorTenantId;
            }

            this._authService.logout(true, targetUrl);
        });
    }

    getAppRootUrl(result: ImpersonateOutput): string {
        return this._appUrlService.getAppRootUrlOfTenant(result.tenancyName) + 'index.html';
    }
}
