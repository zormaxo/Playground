using Xunit;

namespace Analision.Tests;

public sealed class MultiTenantTheoryAttribute : TheoryAttribute
{
    private readonly bool _multiTenancyEnabled = AnalisionConsts.MultiTenancyEnabled;

    public MultiTenantTheoryAttribute()
    {
        if (!_multiTenancyEnabled)
        {
            Skip = "MultiTenancy is disabled.";
        }
    }
}