using System.Threading.Tasks;
using Abp.Webhooks;

namespace Analision.WebHooks;

public interface IWebhookEventAppService
{
    Task<WebhookEvent> Get(string id);
}

