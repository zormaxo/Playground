using Analision.MultiTenancy.Payments.Stripe;

namespace Analision.Web.Controllers;

public class StripeController : StripeControllerBase
{
    public StripeController(
        StripeGatewayManager stripeGatewayManager,
        StripePaymentGatewayConfiguration stripeConfiguration,
        IStripePaymentAppService stripePaymentAppService)
        : base(stripeGatewayManager, stripeConfiguration, stripePaymentAppService)
    {
    }
}

