using Abp.Modules;
using Abp.Reflection.Extensions;
using Castle.Windsor.MsDependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Analision.Configure;
using Analision.Startup;
using Analision.Test.Base;

namespace Analision.GraphQL.Tests;

[DependsOn(
    typeof(AnalisionGraphQLModule),
    typeof(AnalisionTestBaseModule))]
public class AnalisionGraphQLTestModule : AbpModule
{
    public override void PreInitialize()
    {
        IServiceCollection services = new ServiceCollection();

        services.AddAndConfigureGraphQL();

        WindsorRegistrationHelper.CreateServiceProvider(IocManager.IocContainer, services);
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(AnalisionGraphQLTestModule).GetAssembly());
    }
}