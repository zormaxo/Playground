﻿using Analision.Common;
using Analision.Editions.Dto;
using Analision.Maui.Core.Components;
using Analision.Maui.Core.Threading;
using Analision.Maui.Models.Tenants;
using Analision.MultiTenancy;

namespace Analision.Maui.Pages.Tenant;

public partial class CreateTenantModal : AnalisionMainLayoutPageComponentBase
{
    private readonly ITenantAppService _tenantAppService;
    private readonly ICommonLookupAppService _commonLookupAppService;

    public CreateTenantModal()
    {
        _tenantAppService = Resolve<ITenantAppService>();
        _commonLookupAppService = Resolve<ICommonLookupAppService>();
    }

    private CreateTenantModel CreateTenantModel { get; set; } = new()
    {
        IsActive = true
    };

    protected override async Task OnInitializedAsync()
    {
        CreateTenantModel = new CreateTenantModel
        {
            IsActive = true
        };

        await PopulateEditionsCombobox();

        await SetPageHeader(L("CreateNewTenant"));
    }

    private async Task CreateTenantAsync()
    {
        await SetBusyAsync(async () =>
        {
            await WebRequestExecuter.Execute(async () =>
            {
                CreateTenantModel.NormalizeCreateTenantInputModel();

                await _tenantAppService.CreateTenant(CreateTenantModel);
            }, async () => { await UserDialogsService.AlertSuccess(L("SuccessfullySaved")); });
        });
    }

    private async Task PopulateEditionsCombobox()
    {
        var editions = await _commonLookupAppService.GetEditionsForCombobox();
        CreateTenantModel.Editions = editions.Items.ToList();

        CreateTenantModel.Editions.Insert(0, new SubscribableEditionComboboxItemDto(CreateTenantModel.NotAssignedValue,
            $"- {L("NotAssigned")} -", null));
    }
}