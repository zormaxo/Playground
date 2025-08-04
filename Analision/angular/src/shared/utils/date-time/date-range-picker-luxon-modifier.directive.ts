import { Directive, SimpleChanges, OnDestroy, OnChanges, inject, input, output, EventEmitter } from '@angular/core';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import compare from 'just-compare';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { DateTime } from 'luxon';

///this directive ensures that date values will always be the luxon.
@Directive({ selector: '[dateRangePickerLuxonModifier]' })
export class DateRangePickerLuxonModifierDirective implements OnDestroy, OnChanges {
    private bsDateRangepicker = inject(BsDaterangepickerDirective, { self: true });
    private _dateTimeService = inject(DateTimeService);

    readonly date = input(new EventEmitter());
    readonly dateChange = output<DateTime[]>();

    subscribe: Subscription;
    lastDates: Date[] = null;

    constructor(...args: unknown[]);

    constructor() {
        const bsDateRangepicker = this.bsDateRangepicker;

        this.subscribe = bsDateRangepicker.bsValueChange
            .pipe(
                filter(
                    (dates) =>
                        !!(
                            dates &&
                            dates[0] instanceof Date &&
                            dates[1] instanceof Date &&
                            !compare(this.lastDates, dates) &&
                            dates[0].toString() !== 'Invalid Date' &&
                            dates[1].toString() !== 'Invalid Date'
                        )
                )
            )
            .subscribe((dates: Date[]) => {
                // clear time info of given dates because DateRangePicker doesn't support selecting time
                dates[0] = this.clearTime(dates[0]);
                dates[1] = this.clearTime(dates[1]);

                this.lastDates = dates;

                if (abp.clock.provider.supportsMultipleTimezone) {
                    this.lastDates = [
                        this._dateTimeService.changeTimeZone(dates[0], abp.timing.timeZoneInfo.iana.timeZoneId),
                        this._dateTimeService.changeTimeZone(dates[1], abp.timing.timeZoneInfo.iana.timeZoneId),
                    ];
                }

                let startDate = this._dateTimeService.fromJSDate(this.lastDates[0]);
                let endDate = this._dateTimeService.fromJSDate(this.lastDates[1]);
                this.dateChange.emit([startDate, endDate]);
            });
    }

    ngOnDestroy() {
        this.subscribe.unsubscribe();
    }

    ngOnChanges({ date }: SimpleChanges) {
        if (date && date.currentValue && !compare(date.currentValue, date.previousValue)) {
            setTimeout(() => {
                this.bsDateRangepicker.bsValue = [
                    date.currentValue[0] == null ? null : new Date(date.currentValue[0]),
                    date.currentValue[1] == null ? null : new Date(date.currentValue[1]),
                ];
            }, 0);
        }
    }

    clearTime(date: Date): Date {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    }
}
