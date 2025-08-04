using Abp.Application.Services;
using Analision.Dto;
using Analision.Logging.Dto;

namespace Analision.Logging;

public interface IWebLogAppService : IApplicationService
{
    GetLatestWebLogsOutput GetLatestWebLogs();

    FileDto DownloadWebLogs();
}

