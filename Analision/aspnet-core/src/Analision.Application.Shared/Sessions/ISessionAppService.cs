using System.Threading.Tasks;
using Abp.Application.Services;
using Analision.Sessions.Dto;

namespace Analision.Sessions;

public interface ISessionAppService : IApplicationService
{
    Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();

    Task<UpdateUserSignInTokenOutput> UpdateUserSignInToken();
}

