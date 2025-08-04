using System.Threading.Tasks;
using Abp.Application.Services;
using Analision.MultiTenancy.Dto;
using Analision.MultiTenancy.Payments.Dto;

namespace Analision.MultiTenancy;

public interface ISubscriptionAppService : IApplicationService
{
    Task DisableRecurringPayments();

    Task EnableRecurringPayments();

    Task<long> StartExtendSubscription(StartExtendSubscriptionInput input);

    Task<StartUpgradeSubscriptionOutput> StartUpgradeSubscription(StartUpgradeSubscriptionInput input);

    Task<long> StartTrialToBuySubscription(StartTrialToBuySubscriptionInput input);
}

