using Abp.Extensions;
using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using Analision.Auditing.Dto;
using Analision.DataExporting.Excel.MiniExcel;
using Analision.Dto;
using Analision.EntityChanges.Dto;
using Analision.Storage;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Analision.Auditing.Exporting;

public class AuditLogListExcelExporter : MiniExcelExcelExporterBase, IAuditLogListExcelExporter
{
    private readonly ITimeZoneConverter _timeZoneConverter;
    private readonly IAbpSession _abpSession;

    public AuditLogListExcelExporter(
        ITimeZoneConverter timeZoneConverter,
        IAbpSession abpSession,
        ITempFileCacheManager tempFileCacheManager)
        : base(tempFileCacheManager)
    {
        _timeZoneConverter = timeZoneConverter;
        _abpSession = abpSession;
    }

    public async Task<FileDto> ExportToFile(List<AuditLogListDto> auditLogList)
    {
        var items = new List<Dictionary<string, object>>();

        foreach (var auditLog in auditLogList)
        {
            items.Add(new Dictionary<string, object>()
            {
                {L("Time"), _timeZoneConverter.Convert(auditLog.ExecutionTime, _abpSession.TenantId, _abpSession.GetUserId())},
                {L("UserName"), auditLog.UserName},
                {L("Service"), auditLog.ServiceName},
                {L("Action"), auditLog.MethodName},
                {L("Parameters"), auditLog.Parameters},
                {L("Duration"), auditLog.ExecutionDuration},
                {L("IpAddress"), auditLog.ClientIpAddress},
                {L("Client"), auditLog.ClientName},
                {L("Browser"), auditLog.BrowserInfo},
                {L("ErrorState"), auditLog.Exception.IsNullOrEmpty() ? L("Success") : auditLog.Exception},
            });
        }

        return await CreateExcelPackageAsync("AuditLogs.xlsx", items);
    }

    public async Task<FileDto> ExportToFile(List<EntityChangeListDto> entityChangeList)
    {
        var items = new List<Dictionary<string, object>>();

        foreach (var entityChange in entityChangeList)
        {
            items.Add(new Dictionary<string, object>()
            {
                {L("Action"), entityChange.ChangeType.ToString()},
                {L("Object"), entityChange.EntityTypeFullName},
                {L("UserName"), entityChange.UserName},
                {L("ImpersonatorUserName"), entityChange.ImpersonatorUserName},
                {L("Time"), _timeZoneConverter.Convert(entityChange.ChangeTime, _abpSession.TenantId, _abpSession.GetUserId())},
            });
        }

        return await CreateExcelPackageAsync("DetailedLogs.xlsx", items);
    }
}
