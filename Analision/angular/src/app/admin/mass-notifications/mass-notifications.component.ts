import { Component, Injector, ViewEncapsulation, inject, viewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    NotificationServiceProxy,
    NotificationSeverity,
    TokenAuthServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table, TableModule } from 'primeng/table';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/api';
import { filter as _filter } from 'lodash-es';
import { DateTime } from 'luxon';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { CreateMassNotificationModalComponent } from './create-mass-notification-modal.component';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SubHeaderComponent } from '../../shared/common/sub-header/sub-header.component';

import { FormsModule } from '@angular/forms';
import { BsDaterangepickerInputDirective, BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { DateRangePickerLuxonModifierDirective } from '../../../shared/utils/date-time/date-range-picker-luxon-modifier.directive';
import { BusyIfDirective } from '../../../shared/utils/busy-if.directive';
import { LuxonFormatPipe } from '../../../shared/utils/luxon-format.pipe';
import { LocalizePipe } from '@shared/common/pipes/localize.pipe';

@Component({
    templateUrl: './mass-notifications.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
    imports: [
        SubHeaderComponent,
        FormsModule,
        BsDaterangepickerInputDirective,
        BsDaterangepickerDirective,
        DateRangePickerLuxonModifierDirective,
        BusyIfDirective,
        TableModule,
        PaginatorModule,
        CreateMassNotificationModalComponent,
        ModalDirective,
        LuxonFormatPipe,
        LocalizePipe,
    ],
})
export class MassNotificationsComponent extends AppComponentBase {
    private _notificationServiceProxy = inject(NotificationServiceProxy);
    private _dateTimeService = inject(DateTimeService);

    readonly createMassNotificationModalComponent = viewChild<CreateMassNotificationModalComponent>(
        'createMassNotificationModalComponent'
    );

    readonly messageDetailModal = viewChild<ModalDirective>('messageDetailModal');
    readonly dataTable = viewChild<Table>('dataTable');
    readonly paginator = viewChild<Paginator>('paginator');

    dateRange: DateTime[] = [this._dateTimeService.getStartOfDayMinusDays(7), this._dateTimeService.getEndOfDay()];

    notificationSeverity = NotificationSeverity;

    messageDetailString: string;
    messageMaxLength = 50;

    constructor() {
        const injector = inject(Injector);

        super(injector);
    }

    getPublishedNotifications(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator().changePage(0);
            if (this.primengTableHelper.records && this.primengTableHelper.records.length > 0) {
                return;
            }
        }

        this.primengTableHelper.showLoadingIndicator();

        this._notificationServiceProxy
            .getNotificationsPublishedByUser(
                this._dateTimeService.getStartOfDayForDate(this.dateRange[0]),
                this._dateTimeService.getEndOfDayForDate(this.dateRange[1])
            )
            .subscribe((result) => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    reloadPage(): void {
        this.paginator().changePage(this.paginator().getPage());
    }

    createMassNotification(): void {
        this.createMassNotificationModalComponent().show();
    }

    isHTMLMessage(str): boolean {
        let message = this.getMessageData(str);
        let doc = new DOMParser().parseFromString(message, 'text/html');
        return [].slice.call(doc.body.childNodes).some((node) => node.nodeType === 1);
    }

    getMessageDataString(str): string {
        let message = this.getMessageData(str);
        if (message.length <= this.messageMaxLength) {
            return message;
        }

        return message.substring(0, this.messageMaxLength) + '...';
    }

    shouldAddMessageDetailButton(str): boolean {
        let message = this.getMessageData(str);
        return message.length > this.messageMaxLength;
    }

    showMessageDetailModal(str: string): void {
        let message = this.getMessageData(str);
        this.messageDetailString = message;
        this.messageDetailModal().show();
    }

    closeMessageDetailModal(): void {
        this.messageDetailModal().hide();
    }

    getSeverityClass(severity: number): string {
        if (severity === NotificationSeverity.Warn) {
            return 'badge badge-warning';
        }

        if (severity === NotificationSeverity.Success) {
            return 'badge badge-success';
        }

        if (severity === NotificationSeverity.Error) {
            return 'badge badge-danger';
        }

        if (severity === NotificationSeverity.Fatal) {
            return 'badge badge-danger';
        }

        return 'badge badge-info';
    }

    private getMessageData(message: string): string {
        return JSON.parse(message).Properties['Message'];
    }
}
