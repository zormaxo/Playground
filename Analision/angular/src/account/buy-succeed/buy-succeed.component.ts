import { Component, Injector, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TenantRegistrationServiceProxy } from '@shared/service-proxies/service-proxies';
import { LocalizePipe } from '@shared/common/pipes/localize.pipe';

@Component({
    selector: 'payment-completed',
    templateUrl: './buy-succeed.component.html',
    imports: [LocalizePipe],
})
export class BuySucceedComponent extends AppComponentBase implements OnInit {
    private _router = inject(Router);
    private _activatedRoute = inject(ActivatedRoute);
    private _tenantRegistrationService = inject(TenantRegistrationServiceProxy);

    constructor(...args: unknown[]);

    constructor() {
        const _injector = inject(Injector);

        super(_injector);
    }

    ngOnInit(): void {
        let paymentId = this._activatedRoute.snapshot.queryParams['paymentId'];
        this._tenantRegistrationService.buyNowSucceed(paymentId).subscribe(() => {
            this._router.navigate([abp.appPath + 'app/admin/subscription-management']);
        });
    }
}
