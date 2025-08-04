import { AfterViewInit, Directive, ElementRef, EventEmitter, Injector, Output, inject, input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DateTime } from 'luxon';
import { DateTimeService } from './date-time.service';

@Directive({ selector: '[dateRangePickerInitialValue]' })
export class DateRangePickerInitialValueSetterDirective implements AfterViewInit {
    private _element = inject(ElementRef);
    private _dateTimeService = inject(DateTimeService);

    readonly ngModel = input(undefined);
    hostElement: ElementRef;

    constructor(...args: unknown[]);

    constructor() {
        const _element = this._element;

        this.hostElement = _element;
    }

    ngAfterViewInit(): void {
        const ngModel = this.ngModel();
        if (ngModel && ngModel[0] && ngModel[1]) {
            setTimeout(() => {
                let value =
                    this._dateTimeService.formatDate(this.ngModel()[0], 'F') +
                    ' - ' +
                    this._dateTimeService.formatDate(this.ngModel()[1], 'F');
                (this.hostElement.nativeElement as any).value = value;
            });
        }
    }
}
