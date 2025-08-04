using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Analision.Authorization.Permissions.Dto;

namespace Analision.Authorization.Permissions;

public interface IPermissionAppService : IApplicationService
{
    ListResultDto<FlatPermissionWithLevelDto> GetAllPermissions();
}

