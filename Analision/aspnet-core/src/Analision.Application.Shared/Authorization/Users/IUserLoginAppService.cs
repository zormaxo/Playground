using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Analision.Authorization.Users.Dto;

namespace Analision.Authorization.Users;

public interface IUserLoginAppService : IApplicationService
{
    Task<PagedResultDto<UserLoginAttemptDto>> GetUserLoginAttempts(GetLoginAttemptsInput input);
    Task<string> GetExternalLoginProviderNameByUser(long userId);
}

