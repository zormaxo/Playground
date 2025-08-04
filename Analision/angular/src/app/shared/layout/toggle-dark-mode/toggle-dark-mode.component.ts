import { Component, inject, input } from '@angular/core';
import { UiCustomizationSettingsServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'toggle-dark-mode',
    templateUrl: './toggle-dark-mode.component.html',
    imports: [],
})
export class ToggleDarkModeComponent {
    private _uiCustomizationAppService = inject(UiCustomizationSettingsServiceProxy);

    readonly isDarkModeActive = input(false);
    readonly customStyle = input(
        'btn btn-icon btn-icon-muted btn-active-light btn-active-color-primary w-30px h-30px w-md-40px h-md-40px'
    );

    constructor(...args: unknown[]);

    constructor() {}

    toggleDarkMode(isDarkModeActive: boolean): void {
        this._uiCustomizationAppService.changeDarkModeOfCurrentTheme(isDarkModeActive).subscribe(() => {
            window.location.reload();
        });
    }
}
