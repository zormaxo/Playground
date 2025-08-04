using Abp.Application.Services.Dto;

namespace Analision.Common.Dto;

public class FindUsersOutputDto : EntityDto<long>
{
    public string Name { get; set; }

    public string Surname { get; set; }

    public string EmailAddress { get; set; }
}

