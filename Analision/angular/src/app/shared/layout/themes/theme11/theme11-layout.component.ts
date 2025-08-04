import { Injector, ElementRef, Component, OnInit, DOCUMENT, inject } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ThemesLayoutBaseComponent } from '@app/shared/layout/themes/themes-layout-base.component';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { AppConsts } from '@shared/AppConsts';

import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { Theme11BrandComponent } from './theme11-brand.component';
import { ActiveDelegatedUsersComboComponent } from '../../topbar/active-delegated-users-combo.component';
import { SubscriptionNotificationBarComponent } from '../../topbar/subscription-notification-bar.component';
import { QuickThemeSelectionComponent } from '../../topbar/quick-theme-selection.component';
import { LanguageSwitchDropdownComponent } from '../../topbar/language-switch-dropdown.component';
import { HeaderNotificationsComponent } from '../../notifications/header-notifications.component';
import { ChatToggleButtonComponent } from '../../topbar/chat-toggle-button.component';
import { ToggleDarkModeComponent } from '../../toggle-dark-mode/toggle-dark-mode.component';
import { UserMenuComponent } from '../../topbar/user-menu.component';
import { TopBarMenuComponent } from '../../nav/top-bar-menu.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../footer.component';

@Component({
    templateUrl: './theme11-layout.component.html',
    selector: 'theme11-layout',
    animations: [appModuleAnimation()],
    imports: [
        Theme11BrandComponent,
        ActiveDelegatedUsersComboComponent,
        SubscriptionNotificationBarComponent,
        QuickThemeSelectionComponent,
        LanguageSwitchDropdownComponent,
        HeaderNotificationsComponent,
        ChatToggleButtonComponent,
        ToggleDarkModeComponent,
        UserMenuComponent,
        TopBarMenuComponent,
        RouterOutlet,
        FooterComponent,
    ],
})
export class Theme11LayoutComponent extends ThemesLayoutBaseComponent implements OnInit {
    private document = inject<Document>(DOCUMENT);

    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;

    constructor(...args: unknown[]);

    constructor() {
        const injector = inject(Injector);
        const _dateTimeService = inject(DateTimeService);

        super(injector, _dateTimeService);
    }

    ngOnInit() {
        this.installationMode = UrlHelper.isInstallUrl(location.href);
        this.defaultLogo = AppConsts.appBaseUrl + '/assets/common/images/app-logo-on-light.svg';
    }
}
