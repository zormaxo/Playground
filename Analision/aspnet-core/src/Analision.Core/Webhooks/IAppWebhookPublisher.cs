using System.Threading.Tasks;
using Analision.Authorization.Users;

namespace Analision.WebHooks;

public interface IAppWebhookPublisher
{
    Task PublishTestWebhook();
}

