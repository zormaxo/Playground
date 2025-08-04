using Abp.Domain.Uow;
using Abp.EntityFrameworkCore;
using Abp.OpenIddict.EntityFrameworkCore.Applications;
using Analision.EntityFrameworkCore;

namespace Analision.OpenIddict.Applications;

public class OpenIddictApplicationRepository : EfCoreOpenIddictApplicationRepository<AnalisionDbContext>
{
    public OpenIddictApplicationRepository(
        IDbContextProvider<AnalisionDbContext> dbContextProvider,
        IUnitOfWorkManager unitOfWorkManager) : base(dbContextProvider, unitOfWorkManager)
    {
    }
}

