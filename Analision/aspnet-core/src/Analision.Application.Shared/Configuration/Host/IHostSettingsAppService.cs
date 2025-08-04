using System.Threading.Tasks;
using Abp.Application.Services;
using Analision.Configuration.Host.Dto;

namespace Analision.Configuration.Host;

public interface IHostSettingsAppService : IApplicationService
{
    Task<HostSettingsEditDto> GetAllSettings();

    Task UpdateAllSettings(HostSettingsEditDto input);

    Task SendTestEmail(SendTestEmailInput input);
}

