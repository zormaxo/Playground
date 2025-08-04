using Analision.Auditing.Dto;
using Analision.Dto;
using Analision.EntityChanges.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Analision.Auditing.Exporting;

public interface IAuditLogListExcelExporter
{
    Task<FileDto> ExportToFile(List<AuditLogListDto> auditLogListDtos);

    Task<FileDto> ExportToFile(List<EntityChangeListDto> entityChangeListDtos);
}
