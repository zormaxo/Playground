using Abp.AutoMapper;
using Analision.ApiClient;

namespace Analision.Maui.Models.Common;

[AutoMapFrom(typeof(TenantInformation)),
 AutoMapTo(typeof(TenantInformation))]
public class TenantInformationPersistanceModel
{
    public string TenancyName { get; set; }

    public int TenantId { get; set; }
}