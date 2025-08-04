import { Component, Injector, inject, input } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ThemeSettingsDto, UiCustomizationSettingsServiceProxy } from '@shared/service-proxies/service-proxies';

import { TabsetComponent, TabDirective } from 'ngx-bootstrap/tabs';
import { FormsModule } from '@angular/forms';
import { LocalizePipe } from '@shared/common/pipes/localize.pipe';
import { PermissionPipe } from '@shared/common/pipes/permission.pipe';

@Component({
    templateUrl: './theme11-theme-ui-settings.component.html',
    animations: [appModuleAnimation()],
    selector: 'theme11-theme-ui-settings',
    imports: [TabsetComponent, TabDirective, FormsModule, LocalizePipe, PermissionPipe],
})
export class Theme11ThemeUiSettingsComponent extends AppComponentBase {
    private _uiCustomizationService = inject(UiCustomizationSettingsServiceProxy);

    readonly settings = input<ThemeSettingsDto>(undefined);

    constructor(...args: unknown[]);

    constructor() {
        const injector = inject(Injector);

        super(injector);
    }

    getCustomizedSetting(settings: ThemeSettingsDto) {
        settings.theme = 'theme11';
        return settings;
    }

    updateDefaultUiManagementSettings(): void {
        this._uiCustomizationService
            .updateDefaultUiManagementSettings(this.getCustomizedSetting(this.settings()))
            .subscribe(() => {
                window.location.reload();
            });
    }

    updateUiManagementSettings(): void {
        this._uiCustomizationService
            .updateUiManagementSettings(this.getCustomizedSetting(this.settings()))
            .subscribe(() => {
                window.location.reload();
            });
    }

    useSystemDefaultSettings(): void {
        this._uiCustomizationService.useSystemDefaultSettings().subscribe(() => {
            window.location.reload();
        });
    }
}
