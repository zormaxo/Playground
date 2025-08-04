import { Injector, ElementRef, Component, OnInit, AfterViewInit, DOCUMENT, inject, viewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ThemesLayoutBaseComponent } from '@app/shared/layout/themes/themes-layout-base.component';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { AppConsts } from '@shared/AppConsts';

import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { Theme5BrandComponent } from './theme5-brand.component';
import { ActiveDelegatedUsersComboComponent } from '../../topbar/active-delegated-users-combo.component';
import { SubscriptionNotificationBarComponent } from '../../topbar/subscription-notification-bar.component';
import { QuickThemeSelectionComponent } from '../../topbar/quick-theme-selection.component';
import { LanguageSwitchDropdownComponent } from '../../topbar/language-switch-dropdown.component';
import { HeaderNotificationsComponent } from '../../notifications/header-notifications.component';
import { ChatToggleButtonComponent } from '../../topbar/chat-toggle-button.component';
import { ToggleDarkModeComponent } from '../../toggle-dark-mode/toggle-dark-mode.component';
import { UserMenuComponent } from '../../topbar/user-menu.component';
import { SideBarMenuComponent } from '../../nav/side-bar-menu.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../footer.component';

@Component({
    templateUrl: './theme5-layout.component.html',
    selector: 'theme5-layout',
    animations: [appModuleAnimation()],
    imports: [
        Theme5BrandComponent,
        ActiveDelegatedUsersComboComponent,
        SubscriptionNotificationBarComponent,
        QuickThemeSelectionComponent,
        LanguageSwitchDropdownComponent,
        HeaderNotificationsComponent,
        ChatToggleButtonComponent,
        ToggleDarkModeComponent,
        UserMenuComponent,
        SideBarMenuComponent,
        RouterOutlet,
        FooterComponent,
    ],
})
export class Theme5LayoutComponent extends ThemesLayoutBaseComponent implements OnInit {
    private document = inject<Document>(DOCUMENT);

    readonly ktHeader = viewChild<ElementRef>('ktHeader');

    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;

    constructor(...args: unknown[]);

    constructor() {
        const injector = inject(Injector);
        const _dateTimeService = inject(DateTimeService);

        super(injector, _dateTimeService);
    }

    ngOnInit() {
        this.installationMode = UrlHelper.isInstallUrl(location.href);
    }

    getAsideClass(): string {
        let cssClass = 'aside aside-' + this.currentTheme.baseSettings.menu.asideSkin;

        if (this.currentTheme.baseSettings.menu.hoverableAside) {
            return cssClass + ' aside-hoverable';
        }

        return cssClass;
    }
}
