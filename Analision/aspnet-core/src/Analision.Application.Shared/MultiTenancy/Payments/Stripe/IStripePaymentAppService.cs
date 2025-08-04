using System.Threading.Tasks;
using Abp.Application.Services;
using Analision.MultiTenancy.Payments.Dto;
using Analision.MultiTenancy.Payments.Stripe.Dto;

namespace Analision.MultiTenancy.Payments.Stripe;

public interface IStripePaymentAppService : IApplicationService
{
    Task ConfirmPayment(StripeConfirmPaymentInput input);

    StripeConfigurationDto GetConfiguration();

    Task<string> CreatePaymentSession(StripeCreatePaymentSessionInput input);
}

