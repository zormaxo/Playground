using Abp.Domain.Services;

namespace Analision;

public abstract class AnalisionDomainServiceBase : DomainService
{
    /* Add your common members for all your domain services. */

    protected AnalisionDomainServiceBase()
    {
        LocalizationSourceName = AnalisionConsts.LocalizationSourceName;
    }
}

