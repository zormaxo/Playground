import { Component, Injector, inject, output, viewChild } from '@angular/core';
import { AppEditionExpireAction } from '@shared/AppEnums';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    ComboboxItemDto,
    CommonLookupServiceProxy,
    CreateEditionDto,
    EditionServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FeatureTreeComponent } from '../shared/feature-tree.component';
import { finalize } from 'rxjs/operators';
import { AppBsModalDirective } from '../../../shared/common/appBsModal/app-bs-modal.directive';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsetComponent, TabDirective } from 'ngx-bootstrap/tabs';
import { ValidationMessagesComponent } from '../../../shared/utils/validation-messages.component';
import { IMaskDirective } from 'angular-imask';
import { ButtonBusyDirective } from '../../../shared/utils/button-busy.directive';
import { LocalizePipe } from '@shared/common/pipes/localize.pipe';

@Component({
    selector: 'createEditionModal',
    templateUrl: './create-edition-modal.component.html',
    imports: [
        AppBsModalDirective,
        FormsModule,
        TabsetComponent,
        TabDirective,
        ValidationMessagesComponent,
        NgClass,
        IMaskDirective,
        FeatureTreeComponent,
        ButtonBusyDirective,
        LocalizePipe,
    ],
})
export class CreateEditionModalComponent extends AppComponentBase {
    private _editionService = inject(EditionServiceProxy);
    private _commonLookupService = inject(CommonLookupServiceProxy);

    readonly modal = viewChild<ModalDirective>('createModal');
    readonly featureTree = viewChild<FeatureTreeComponent>('featureTree');

    readonly modalSave = output<any>();

    active = false;
    saving = false;
    currencyMask = {
        mask: Number,
        scale: 2,
        signed: true,
        radix: '.',
    };

    edition: CreateEditionDto = new CreateEditionDto();
    expiringEditions: ComboboxItemDto[] = [];

    expireAction: AppEditionExpireAction = AppEditionExpireAction.DeactiveTenant;
    expireActionEnum: typeof AppEditionExpireAction = AppEditionExpireAction;
    isFree = true;
    isTrialActive = false;
    isWaitingDayActive = false;

    constructor(...args: unknown[]);

    constructor() {
        const injector = inject(Injector);

        super(injector);
    }

    show(editionId?: number): void {
        this.active = true;

        this._commonLookupService.getEditionsForCombobox(true).subscribe((editionsResult) => {
            this.expiringEditions = editionsResult.items;
            this.expiringEditions.unshift(
                new ComboboxItemDto({ value: null, displayText: this.l('NotAssigned'), isSelected: true })
            );

            this._editionService.getEditionForEdit(editionId).subscribe((editionResult) => {
                this.featureTree().editData = editionResult;
                this.modal().show();
            });
        });
    }

    onShown(): void {
        document.getElementById('EditionDisplayName').focus();
    }

    resetPrices(isFree) {
        this.edition.edition.annualPrice = undefined;
        this.edition.edition.monthlyPrice = undefined;
    }

    removeExpiringEdition(isDeactivateTenant) {
        this.edition.edition.expiringEditionId = null;
    }

    save(): void {
        const featureTree = this.featureTree();
        if (!featureTree.areAllValuesValid()) {
            this.message.warn(this.l('InvalidFeaturesWarning'));
            return;
        }

        const input = new CreateEditionDto();
        input.edition = this.edition.edition;
        input.featureValues = featureTree.getGrantedFeatures();

        if (!this.isTrialActive) {
            this.edition.edition.trialDayCount = null;
        }

        this.saving = true;
        this._editionService
            .createEdition(input)
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
}
