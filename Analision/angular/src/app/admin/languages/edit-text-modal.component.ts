import { Component, ElementRef, Injector, inject, output, viewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LanguageServiceProxy, UpdateLanguageTextInput } from '@shared/service-proxies/service-proxies';
import { find as _find } from 'lodash-es';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { AppBsModalDirective } from '../../../shared/common/appBsModal/app-bs-modal.directive';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonBusyDirective } from '../../../shared/utils/button-busy.directive';
import { LocalizePipe } from '@shared/common/pipes/localize.pipe';

@Component({
    selector: 'editTextModal',
    templateUrl: './edit-text-modal.component.html',
    imports: [AppBsModalDirective, FormsModule, NgClass, ButtonBusyDirective, LocalizePipe],
})
export class EditTextModalComponent extends AppComponentBase {
    private _languageService = inject(LanguageServiceProxy);

    readonly modal = viewChild<ModalDirective>('modal');

    readonly modalSave = output<any>();

    model: UpdateLanguageTextInput = new UpdateLanguageTextInput();

    baseText: string;
    baseLanguage: abp.localization.ILanguageInfo;
    targetLanguage: abp.localization.ILanguageInfo;

    active = false;
    saving = false;

    constructor(...args: unknown[]);

    constructor() {
        const injector = inject(Injector);

        super(injector);
    }

    show(
        baseLanguageName: string,
        targetLanguageName: string,
        sourceName: string,
        key: string,
        baseText: string,
        targetText: string
    ): void {
        this.model.sourceName = sourceName;
        this.model.key = key;
        this.model.languageName = targetLanguageName;
        this.model.value = targetText;

        this.baseText = baseText;
        this.baseLanguage = _find(abp.localization.languages, (l) => l.name === baseLanguageName);
        this.targetLanguage = _find(abp.localization.languages, (l) => l.name === targetLanguageName);

        this.active = true;

        this.modal().show();
    }

    onShown(): void {
        document.getElementById('TargetLanguageDisplayName').focus();
    }

    save(): void {
        this.saving = true;
        this._languageService
            .updateLanguageText(this.model)
            .pipe(finalize(() => (this.saving = false)))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.modal().hide();
    }

    private findLanguage(name: string): abp.localization.ILanguageInfo {
        return _find(abp.localization.languages, (l) => l.name === name);
    }
}
