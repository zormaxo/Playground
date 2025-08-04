using Abp.Application.Services.Dto;

namespace Analision.Notifications.Dto;

public class GetAllForLookupTableInput : PagedAndSortedResultRequestDto
{
    public string Filter { get; set; }
}

