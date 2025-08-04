using Analision.Dto;

namespace Analision.Organizations.Dto;

public class FindOrganizationUnitRolesInput : PagedAndFilteredInputDto
{
    public long OrganizationUnitId { get; set; }
}

