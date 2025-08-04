using Abp.AutoMapper;
using Analision.Organizations.Dto;

namespace Analision.Maui.Models.User;

[AutoMapFrom(typeof(OrganizationUnitDto))]
public class OrganizationUnitModel : OrganizationUnitDto
{
    public bool IsAssigned { get; set; }
}