import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Renderer2,
    forwardRef,
    inject,
    input,
    viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateTime } from 'luxon';
import { formatDate } from 'ngx-bootstrap/chronos';
import {
    BsDatepickerConfig,
    BsLocaleService,
    BsDatepickerInputDirective,
    BsDatepickerDirective,
} from 'ngx-bootstrap/datepicker';
import { AbstractNgModelComponent } from '../../ng-model.component';
import { DateTimeService } from '../date-time.service';
import compare from 'just-compare';
import { NgxBootstrapDatePickerConfigService } from 'assets/ngx-bootstrap/ngx-bootstrap-datepicker-config.service';

@Component({
    selector: 'abp-datetime-picker',
    templateUrl: './abp-datetime-picker.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AbpDateTimePickerComponent),
            multi: true,
        },
        { provide: DateTimeService, useClass: DateTimeService },
    ],
    imports: [BsDatepickerInputDirective, BsDatepickerDirective],
})
export class AbpDateTimePickerComponent extends AbstractNgModelComponent {
    private _dateTimeService = inject(DateTimeService);
    private _renderer = inject(Renderer2);
    private _localeService = inject(BsLocaleService);

    readonly datePicker = viewChild<ElementRef>('datePicker');
    readonly bsConfig = input<BsDatepickerConfig>(null);
    readonly isUtc = input(false);

    date: DateTime | null | undefined;
    lastDate: Date = null;

    setDate(date: Date) {
        if (!date) {
            this.writeValue(null);
        } else if (date instanceof Date && !compare(this.lastDate, date) && date.toString() !== 'Invalid Date') {
            // clear hour, minute, seconds and milliseconds since this is a date
            date = this.clearTime(date);

            if (this.isUtc()) {
                // using UTC date regardless of timing configuration
                let utcDateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
                date = this._dateTimeService.fromISODateString(utcDateString).toJSDate();
            } else if (abp.clock.provider.supportsMultipleTimezone) {
                date = this._dateTimeService.changeTimeZone(date, abp.timing.timeZoneInfo.iana.timeZoneId);
            }

            this.writeValue(this._dateTimeService.fromJSDate(date));
        }
    }

    writeValue(value: DateTime) {
        this.date = value;
        if (!value) {
            this.cleanValue();
            return;
        }

        this.lastDate = this._dateTimeService.toJSDate(value);
        super.writeValue(value);
        this.change();
    }

    change() {
        if (!this.date) {
            return;
        }

        this.value = this.date;
        this.setInputValue(this.lastDate);
    }

    setInputValue(value?: Date): void {
        const initialDate = !value
            ? ''
            : formatDate(value, this.getConfig().dateInputFormat, this._localeService.currentLocale);

        this._renderer.setProperty(this.datePicker().nativeElement, 'value', initialDate);
    }

    cleanValue() {
        this.date = null;
        this.value = null;
        this.lastDate = null;
    }

    clearTime(date: Date): Date {
        if (!this.getConfig().withTimepicker) {
            date.setHours(0);
            date.setMinutes(0);
        }

        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    }

    getConfig(): BsDatepickerConfig {
        const bsConfig = this.bsConfig();
        if (bsConfig) {
            return bsConfig;
        }

        return NgxBootstrapDatePickerConfigService.getDatepickerConfig();
    }
}
