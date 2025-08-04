import { Component, Injector, inject, viewChild } from '@angular/core';
import { EntityChangeDetailModalComponent } from './entity-change-detail-modal.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AuditLogServiceProxy, EntityChangeListDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { Table, TableModule } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { AppBsModalDirective } from '../../../../shared/common/appBsModal/app-bs-modal.directive';

import { BusyIfDirective } from '../../../../shared/utils/busy-if.directive';
import { LuxonFormatPipe } from '../../../../shared/utils/luxon-format.pipe';
import { LocalizePipe } from '@shared/common/pipes/localize.pipe';

export interface IEntityTypeHistoryModalOptions {
    entityTypeFullName: string;
    entityTypeDescription: string;
    entityId: string;
}

@Component({
    selector: 'entityTypeHistoryModal',
    templateUrl: './entity-type-history-modal.component.html',
    imports: [
        AppBsModalDirective,
        BusyIfDirective,
        TableModule,
        PaginatorModule,
        EntityChangeDetailModalComponent,
        LuxonFormatPipe,
        LocalizePipe,
    ],
})
export class EntityTypeHistoryModalComponent extends AppComponentBase {
    private _auditLogService = inject(AuditLogServiceProxy);

    readonly entityChangeDetailModal = viewChild<EntityChangeDetailModalComponent>('entityChangeDetailModal');
    readonly modal = viewChild<ModalDirective>('modal');
    readonly dataTable = viewChild<Table>('dataTable');
    readonly paginator = viewChild<Paginator>('paginator');

    options: IEntityTypeHistoryModalOptions;
    isShown = false;
    isInitialized = false;
    filterText = '';
    tenantId?: number;
    entityHistoryEnabled: false;

    constructor(...args: unknown[]);

    constructor() {
        const injector = inject(Injector);

        super(injector);
    }

    show(options: IEntityTypeHistoryModalOptions): void {
        this.options = options;
        this.modal().show();
    }

    refreshTable(): void {
        this.paginator().changePage(this.paginator().getPage());
        this.shown();
    }

    close(): void {
        this.modal().hide();
    }

    shown(): void {
        this.isShown = true;
        this.getRecordsIfNeeds(null);
    }

    getRecordsIfNeeds(event?: LazyLoadEvent): void {
        if (!this.isShown) {
            return;
        }

        this.getRecords(event);
        this.isInitialized = true;
    }

    getRecords(event?: LazyLoadEvent): void {
        this.primengTableHelper.showLoadingIndicator();

        this._auditLogService
            .getEntityTypeChanges(
                this.options.entityTypeFullName,
                this.options.entityId,
                this.primengTableHelper.getSorting(this.dataTable()),
                this.primengTableHelper.getMaxResultCount(this.paginator(), event),
                this.primengTableHelper.getSkipCount(this.paginator(), event)
            )
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe((result) => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    showEntityChangeDetails(record: EntityChangeListDto): void {
        this.entityChangeDetailModal().show(record);
    }
}
