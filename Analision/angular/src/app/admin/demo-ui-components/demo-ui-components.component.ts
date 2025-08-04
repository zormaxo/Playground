import { Component, Injector, OnInit, inject } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SubHeaderComponent } from '../../shared/common/sub-header/sub-header.component';

import { DemoUiDateTimeComponent } from './demo-ui-date-time.component';
import { DemoUiFileUploadComponent } from './demo-ui-file-upload.component';
import { DemoUiSelectionComponent } from './demo-ui-selection.component';
import { DemoUiInputMaskComponent } from './demo-ui-input-mask.component';
import { DemoUiEditorComponent } from './demo-ui-editor.component';
import { LocalizePipe } from '@shared/common/pipes/localize.pipe';

@Component({
    templateUrl: './demo-ui-components.component.html',
    animations: [appModuleAnimation()],
    imports: [
        SubHeaderComponent,
        DemoUiDateTimeComponent,
        DemoUiFileUploadComponent,
        DemoUiSelectionComponent,
        DemoUiInputMaskComponent,
        DemoUiEditorComponent,
        LocalizePipe,
    ],
})
export class DemoUiComponentsComponent extends AppComponentBase {
    alertVisible = true;

    constructor(...args: unknown[]);

    constructor() {
        const injector = inject(Injector);

        super(injector);
    }

    hideAlert(): void {
        this.alertVisible = false;
    }
}
