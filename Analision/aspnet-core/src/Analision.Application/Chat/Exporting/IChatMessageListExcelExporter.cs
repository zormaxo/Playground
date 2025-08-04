using System.Collections.Generic;
using System.Threading.Tasks;
using Abp;
using Analision.Chat.Dto;
using Analision.Dto;

namespace Analision.Chat.Exporting;

public interface IChatMessageListExcelExporter
{
    Task<FileDto> ExportToFile(UserIdentifier user, List<ChatMessageExportDto> messages);
}