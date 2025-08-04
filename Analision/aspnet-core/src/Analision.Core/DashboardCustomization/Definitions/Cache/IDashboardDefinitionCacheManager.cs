using Abp.Dependency;

namespace Analision.DashboardCustomization.Definitions.Cache;

public interface IDashboardDefinitionCacheManager : ITransientDependency
{
    DashboardDefinition Get(string name);

    void Set(DashboardDefinition definition);
}

