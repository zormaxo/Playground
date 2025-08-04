using Abp.Domain.Uow;
using Abp.EntityFrameworkCore;
using Abp.OpenIddict.EntityFrameworkCore.Authorizations;
using Analision.EntityFrameworkCore;

namespace Analision.OpenIddict.Authorizations;

public class OpenIddictAuthorizationRepository : EfCoreOpenIddictAuthorizationRepository<AnalisionDbContext>
{
    public OpenIddictAuthorizationRepository(
        IDbContextProvider<AnalisionDbContext> dbContextProvider,
        IUnitOfWorkManager unitOfWorkManager) : base(dbContextProvider, unitOfWorkManager)
    {
    }
}

