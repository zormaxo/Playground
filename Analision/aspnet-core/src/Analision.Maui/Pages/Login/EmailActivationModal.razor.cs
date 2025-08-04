using Microsoft.AspNetCore.Components;
using Analision.Authorization.Accounts;
using Analision.Authorization.Accounts.Dto;
using Analision.Maui.Core.Components;
using Analision.Maui.Core.Threading;
using Analision.Maui.Models.Login;

namespace Analision.Maui.Pages.Login;

public partial class EmailActivationModal : ModalBase
{
    public override string ModalId => "email-activation-modal";

    [Parameter] public EventCallback OnSave { get; set; }

    public EmailActivationModel emailActivationModel { get; set; } = new EmailActivationModel();

    private readonly IAccountAppService _accountAppService;

    public EmailActivationModal()
    {
        _accountAppService = Resolve<IAccountAppService>();
    }

    protected virtual async Task Save()
    {
        await SetBusyAsync(async () =>
        {
            await WebRequestExecuter.Execute(
                async () =>
                    await _accountAppService.SendEmailActivationLink(new SendEmailActivationLinkInput
                    {
                        EmailAddress = emailActivationModel.EmailAddress
                    }),
                async () =>
                {
                    await OnSave.InvokeAsync();
                }
            );
        });
    }

    protected virtual async Task Cancel()
    {
        await Hide();
    }
}