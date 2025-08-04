using System.Threading.Tasks;
using Analision.Security.Recaptcha;

namespace Analision.Test.Base.Web;

public class FakeRecaptchaValidator : IRecaptchaValidator
{
    public Task ValidateAsync(string captchaResponse)
    {
        return Task.CompletedTask;
    }
}
