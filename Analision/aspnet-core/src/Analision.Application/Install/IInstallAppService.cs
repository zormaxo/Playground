using System.Threading.Tasks;
using Abp.Application.Services;
using Analision.Install.Dto;

namespace Analision.Install;

public interface IInstallAppService : IApplicationService
{
    Task Setup(InstallDto input);

    AppSettingsJsonDto GetAppSettingsJson();

    CheckDatabaseOutput CheckDatabase();
}
