using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Analision;

public class AnalisionCoreSharedModule : AbpModule
{
    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(AnalisionCoreSharedModule).GetAssembly());
    }
}

