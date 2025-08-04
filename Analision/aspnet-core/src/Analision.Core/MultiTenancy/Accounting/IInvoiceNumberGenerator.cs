using System.Threading.Tasks;
using Abp.Dependency;

namespace Analision.MultiTenancy.Accounting;

public interface IInvoiceNumberGenerator : ITransientDependency
{
    Task<string> GetNewInvoiceNumber();
}

