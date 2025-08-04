using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Analision;

[DependsOn(typeof(AnalisionCoreSharedModule))]
public class AnalisionApplicationSharedModule : AbpModule
{
    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(AnalisionApplicationSharedModule).GetAssembly());
    }
}

