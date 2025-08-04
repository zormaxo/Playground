using Abp.Auditing;
using Analision.Configuration.Dto;

namespace Analision.Configuration.Tenants.Dto;

public class TenantEmailSettingsEditDto : EmailSettingsEditDto
{
    public bool UseHostDefaultEmailSettings { get; set; }
}

