using Abp.Application.Services.Dto;

namespace Analision.Organizations.Dto;

public class FindOrganizationUnitUsersOutputDto : EntityDto<long>
{
    public string Name { get; set; }

    public string Surname { get; set; }

    public string EmailAddress { get; set; }
}

