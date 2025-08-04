using Abp.Dependency;
using Castle.MicroKernel.Registration;
using Castle.Windsor.MsDependencyInjection;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Analision.EntityFrameworkCore;
using Analision.Identity;

namespace Analision.Test.Base.DependencyInjection;

public static class ServiceCollectionRegistrar
{
    public static void Register(IIocManager iocManager)
    {
        RegisterIdentity(iocManager);

        var builder = new DbContextOptionsBuilder<AnalisionDbContext>();

        var inMemorySqlite = new SqliteConnection("Data Source=:memory:");
        builder.UseSqlite(inMemorySqlite);

        iocManager.IocContainer.Register(
            Component
                .For<DbContextOptions<AnalisionDbContext>>()
                .Instance(builder.Options)
                .LifestyleSingleton()
        );

        inMemorySqlite.Open();

        new AnalisionDbContext(builder.Options).Database.EnsureCreated();
    }

    private static void RegisterIdentity(IIocManager iocManager)
    {
        var services = new ServiceCollection();

        IdentityRegistrar.Register(services);

        WindsorRegistrationHelper.CreateServiceProvider(iocManager.IocContainer, services);
    }
}
