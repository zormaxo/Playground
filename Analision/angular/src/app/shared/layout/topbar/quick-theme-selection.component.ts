import { Component, Injector, inject, input } from '@angular/core';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { ThemesLayoutBaseComponent } from '../themes/themes-layout-base.component';

@Component({
    selector: 'quick-theme-selection',
    templateUrl: './quick-theme-selection.component.html',
    imports: [],
})
export class QuickThemeSelectionComponent extends ThemesLayoutBaseComponent {
    readonly customStyle = input(
        'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px position-relative'
    );
    readonly iconStyle = input('flaticon-interface-7 fs-4');

    isQuickThemeSelectEnabled: boolean = this.setting.getBoolean('App.UserManagement.IsQuickThemeSelectEnabled');

    constructor(...args: unknown[]);

    public constructor() {
        const injector = inject(Injector);
        const _dateTimeService = inject(DateTimeService);

        super(injector, _dateTimeService);
    }
}
