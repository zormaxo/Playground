using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Analision.Startup;

[DependsOn(typeof(AnalisionCoreModule))]
public class AnalisionGraphQLModule : AbpModule
{
    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(AnalisionGraphQLModule).GetAssembly());
    }

    public override void PreInitialize()
    {
        base.PreInitialize();

        //Adding custom AutoMapper configuration
        Configuration.Modules.AbpAutoMapper().Configurators.Add(CustomDtoMapper.CreateMappings);
    }
}

