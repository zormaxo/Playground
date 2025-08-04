﻿using System.Threading.Tasks;
using Abp.Dependency;

namespace Analision.Authorization.QrLogin;

using Microsoft.AspNetCore.SignalR;

public class QrLoginHub : Hub, ITransientDependency
{
    private readonly IQrLoginManager _qrLoginManager;
    private readonly QrLoginImageService _qrLoginImageService;

    public QrLoginHub(IQrLoginManager qrLoginManager, QrLoginImageService qrLoginImageService)
    {
        _qrLoginManager = qrLoginManager;
        _qrLoginImageService = qrLoginImageService;
    }

    public async Task SetSessionId()
    {
        var sessionId = await _qrLoginManager.GenerateSessionId(Context.ConnectionId);

        var qrCodeUrl = _qrLoginImageService.GenerateSetupCode(Context.ConnectionId, sessionId);

        await Clients.Caller.SendAsync("generateQrCode", qrCodeUrl);
    }
}
