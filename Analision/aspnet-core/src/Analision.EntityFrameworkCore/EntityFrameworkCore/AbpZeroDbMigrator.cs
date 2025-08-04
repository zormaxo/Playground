using Abp.Domain.Uow;
using Abp.EntityFrameworkCore;
using Abp.MultiTenancy;
using Abp.Zero.EntityFrameworkCore;

namespace Analision.EntityFrameworkCore;

public class AbpZeroDbMigrator : AbpZeroDbMigrator<AnalisionDbContext>
{
    public AbpZeroDbMigrator(
        IUnitOfWorkManager unitOfWorkManager,
        IDbPerTenantConnectionStringResolver connectionStringResolver,
        IDbContextResolver dbContextResolver) :
        base(
            unitOfWorkManager,
            connectionStringResolver,
            dbContextResolver)
    {

    }
}

