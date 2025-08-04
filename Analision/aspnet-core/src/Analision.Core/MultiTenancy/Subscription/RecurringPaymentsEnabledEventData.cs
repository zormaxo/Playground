using Abp.Events.Bus;

namespace Analision.MultiTenancy.Subscription;

public class RecurringPaymentsEnabledEventData : EventData
{
    public int TenantId { get; set; }
}

