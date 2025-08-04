using Analision.Dto;

namespace Analision.Organizations.Dto;

public class FindOrganizationUnitUsersInput : PagedAndFilteredInputDto
{
    public long OrganizationUnitId { get; set; }
}

