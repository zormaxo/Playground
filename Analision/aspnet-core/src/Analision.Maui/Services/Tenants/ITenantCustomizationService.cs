﻿namespace Analision.Maui.Services.Tenants;

public interface ITenantCustomizationService
{
    Task<string> GetTenantLogo();
}