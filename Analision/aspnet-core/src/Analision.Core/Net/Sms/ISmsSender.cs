using System.Threading.Tasks;

namespace Analision.Net.Sms;

public interface ISmsSender
{
    Task SendAsync(string number, string message);
}

