using Analision.MultiTenancy.Payments;

namespace Analision.MultiTenancy.Dto;

public class StartTrialToBuySubscriptionInput
{
    public PaymentPeriodType PaymentPeriodType { get; set; }

    public string SuccessUrl { get; set; }

    public string ErrorUrl { get; set; }
}

