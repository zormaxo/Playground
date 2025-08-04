﻿using Analision.Maui.Core.Components;
using Analision.Maui.Pages.Layout;
using Analision.Maui.Services.Account;
using Analision.Maui.Services.Navigation;

namespace Analision.Maui.Pages.MySettings;

public partial class Settings : AnalisionMainLayoutPageComponentBase
{
    protected IAccountService AccountService { get; set; }
    protected NavMenu NavMenu { get; set; }

    protected INavigationService navigationService { get; set; }
    ChangePasswordModal changePasswordModal;

    public Settings()
    {
        AccountService = Resolve<IAccountService>();
        navigationService = Resolve<INavigationService>();
    }

    protected override async Task OnInitializedAsync()
    {
        await SetPageHeader(L("MySettings"));
    }

    private async Task LogOut()
    {
        await AccountService.LogoutAsync();
        navigationService.NavigateTo(NavigationUrlConsts.Login);
    }

    private async Task OnChangePasswordAsync()
    {
        await changePasswordModal.Hide();
        await Task.Delay(300);
        await LogOut();
    }

    private async Task OnLanguageSwitchAsync()
    {
        await SetPageHeader(L("MySettings"));
        StateHasChanged();
    }

    private async Task ChangePassword()
    {
        await changePasswordModal.Show();
    }

}