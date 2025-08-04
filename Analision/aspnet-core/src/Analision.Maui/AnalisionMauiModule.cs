using Abp.AutoMapper;
using Abp.Configuration.Startup;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Analision.ApiClient;
using Analision.Maui.Core;

namespace Analision.Maui;

[DependsOn(typeof(AnalisionClientModule), typeof(AbpAutoMapperModule))]
public class AnalisionMauiModule : AbpModule
{
    public override void PreInitialize()
    {
        Configuration.Localization.IsEnabled = false;
        Configuration.BackgroundJobs.IsJobExecutionEnabled = false;

        Configuration.ReplaceService<IApplicationContext, MauiApplicationContext>();
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(AnalisionMauiModule).GetAssembly());
    }
}