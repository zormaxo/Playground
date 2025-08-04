import { NgModule } from '@angular/core';
import { AdminSharedModule } from '@app/admin/shared/admin-shared.module';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { AuditLogsRoutingModule } from './audit-logs-routing.module';
import { AuditLogsComponent } from './audit-logs.component';
import { AuditLogDetailModalComponent } from './audit-log-detail-modal.component';

@NgModule({
    imports: [
        AppSharedModule,
        AdminSharedModule,
        AuditLogsRoutingModule,
        AuditLogsComponent,
        AuditLogDetailModalComponent,
    ],
})
export class AuditLogsModule {}
