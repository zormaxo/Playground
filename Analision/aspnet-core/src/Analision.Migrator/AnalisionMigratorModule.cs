using Abp.AspNetZeroCore;
using Abp.Events.Bus;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Castle.MicroKernel.Registration;
using Microsoft.Extensions.Configuration;
using Analision.Configuration;
using Analision.EntityFrameworkCore;
using Analision.Migrator.DependencyInjection;

namespace Analision.Migrator;

[DependsOn(typeof(AnalisionEntityFrameworkCoreModule))]
public class AnalisionMigratorModule : AbpModule
{
    private readonly IConfigurationRoot _appConfiguration;

    public AnalisionMigratorModule(AnalisionEntityFrameworkCoreModule abpZeroTemplateEntityFrameworkCoreModule)
    {
        abpZeroTemplateEntityFrameworkCoreModule.SkipDbSeed = true;

        _appConfiguration = AppConfigurations.Get(
            typeof(AnalisionMigratorModule).GetAssembly().GetDirectoryPathOrNull(),
            addUserSecrets: true
        );
    }

    public override void PreInitialize()
    {
        Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
            AnalisionConsts.ConnectionStringName
            );
        Configuration.Modules.AspNetZero().LicenseCode = _appConfiguration["AbpZeroLicenseCode"];

        Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
        Configuration.ReplaceService(typeof(IEventBus), () =>
        {
            IocManager.IocContainer.Register(
                Component.For<IEventBus>().Instance(NullEventBus.Instance)
            );
        });
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(AnalisionMigratorModule).GetAssembly());
        ServiceCollectionRegistrar.Register(IocManager);
    }
}

