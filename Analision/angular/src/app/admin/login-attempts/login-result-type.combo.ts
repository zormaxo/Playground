import { Component, forwardRef, Injector, OnInit, inject, input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SettingScopes, NameValueDto, NullableOfAbpLoginResultType } from '@shared/service-proxies/service-proxies';
import {
    ControlValueAccessor,
    UntypedFormControl,
    NG_VALUE_ACCESSOR,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';

@Component({
    selector: 'login-result-type-combo',
    template: `
        <select class="form-select" [formControl]="selectedLoginResultType">
            @for (loginResultType of loginResultTypes; track loginResultType) {
                <option [value]="loginResultType.value">
                    {{ loginResultType.name }}
                </option>
            }
        </select>
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => LoginResultTypeComboComponent),
            multi: true,
        },
    ],
    imports: [FormsModule, ReactiveFormsModule],
})
export class LoginResultTypeComboComponent extends AppComponentBase implements OnInit, ControlValueAccessor {
    readonly defaultTimezoneScope = input<SettingScopes>(undefined);

    loginResultTypes: NameValueDto[] = [];
    selectedLoginResultType = new UntypedFormControl('');

    loginResultType: NullableOfAbpLoginResultType;

    constructor(...args: unknown[]);

    constructor() {
        const injector = inject(Injector);

        super(injector);
    }

    onTouched: any = () => {};

    ngOnInit(): void {
        this.loginResultTypes.push(new NameValueDto({ name: this.l('All'), value: '' }));
        for (const value in NullableOfAbpLoginResultType) {
            if (typeof NullableOfAbpLoginResultType[value] === 'string') {
                continue;
            }

            this.loginResultTypes.push(new NameValueDto({ name: this.l('AbpLoginResultType_' + value), value: value }));
        }
    }

    writeValue(obj: any): void {
        if (this.selectedLoginResultType) {
            this.selectedLoginResultType.setValue(obj);
        }
    }

    registerOnChange(fn: any): void {
        this.selectedLoginResultType.valueChanges.subscribe(fn);
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (isDisabled) {
            this.selectedLoginResultType.disable();
        } else {
            this.selectedLoginResultType.enable();
        }
    }
}
