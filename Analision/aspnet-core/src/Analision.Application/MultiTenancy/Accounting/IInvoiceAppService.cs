using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Analision.MultiTenancy.Accounting.Dto;

namespace Analision.MultiTenancy.Accounting;

public interface IInvoiceAppService
{
    Task<InvoiceDto> GetInvoiceInfo(EntityDto<long> input);

    Task CreateInvoice(CreateInvoiceDto input);
}
