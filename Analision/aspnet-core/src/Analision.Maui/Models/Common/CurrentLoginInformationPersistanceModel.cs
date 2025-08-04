using Abp.AutoMapper;
using Analision.Sessions.Dto;

namespace Analision.Maui.Models.Common;

[AutoMapFrom(typeof(GetCurrentLoginInformationsOutput)),
 AutoMapTo(typeof(GetCurrentLoginInformationsOutput))]
public class CurrentLoginInformationPersistanceModel
{
    public UserLoginInfoPersistanceModel User { get; set; }

    public TenantLoginInfoPersistanceModel Tenant { get; set; }

    public ApplicationInfoPersistanceModel Application { get; set; }
}