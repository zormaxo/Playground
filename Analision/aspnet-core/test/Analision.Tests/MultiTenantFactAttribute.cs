using Xunit;

namespace Analision.Tests;

public sealed class MultiTenantFactAttribute : FactAttribute
{
    private readonly bool _multiTenancyEnabled = AnalisionConsts.MultiTenancyEnabled;

    public MultiTenantFactAttribute()
    {
        if (!_multiTenancyEnabled)
        {
            Skip = "MultiTenancy is disabled.";
        }
    }
}
