using Abp.Dependency;
using Abp.Reflection.Extensions;
using Microsoft.Extensions.Configuration;
using Analision.Configuration;

namespace Analision.Test.Base.Configuration;

public class TestAppConfigurationAccessor : IAppConfigurationAccessor, ISingletonDependency
{
    public IConfigurationRoot Configuration { get; }

    public TestAppConfigurationAccessor()
    {
        Configuration = AppConfigurations.Get(
            typeof(AnalisionTestBaseModule).GetAssembly().GetDirectoryPathOrNull()
        );
    }
}
