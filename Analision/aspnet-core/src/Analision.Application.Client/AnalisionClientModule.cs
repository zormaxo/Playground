using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Analision;

public class AnalisionClientModule : AbpModule
{
    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(AnalisionClientModule).GetAssembly());
    }
}

