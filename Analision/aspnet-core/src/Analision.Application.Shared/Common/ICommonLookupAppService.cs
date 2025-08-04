using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Analision.Common.Dto;
using Analision.Editions.Dto;

namespace Analision.Common;

public interface ICommonLookupAppService : IApplicationService
{
    Task<ListResultDto<SubscribableEditionComboboxItemDto>> GetEditionsForCombobox(bool onlyFreeItems = false);

    Task<PagedResultDto<FindUsersOutputDto>> FindUsers(FindUsersInput input);

    GetDefaultEditionNameOutput GetDefaultEditionName();
}

