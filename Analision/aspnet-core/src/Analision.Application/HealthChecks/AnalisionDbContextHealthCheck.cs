using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Analision.EntityFrameworkCore;

namespace Analision.HealthChecks;

public class AnalisionDbContextHealthCheck : IHealthCheck
{
    private readonly DatabaseCheckHelper _checkHelper;

    public AnalisionDbContextHealthCheck(DatabaseCheckHelper checkHelper)
    {
        _checkHelper = checkHelper;
    }

    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = new CancellationToken())
    {
        if (_checkHelper.Exist("db"))
        {
            return Task.FromResult(HealthCheckResult.Healthy("AnalisionDbContext connected to database."));
        }

        return Task.FromResult(HealthCheckResult.Unhealthy("AnalisionDbContext could not connect to database"));
    }
}
