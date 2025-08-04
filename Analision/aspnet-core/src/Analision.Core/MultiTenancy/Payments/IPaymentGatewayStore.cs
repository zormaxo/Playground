using System.Collections.Generic;

namespace Analision.MultiTenancy.Payments;

public interface IPaymentGatewayStore
{
    List<PaymentGatewayModel> GetActiveGateways();
}

