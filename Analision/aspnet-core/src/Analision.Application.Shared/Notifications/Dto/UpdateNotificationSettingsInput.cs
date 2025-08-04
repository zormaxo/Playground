using System.Collections.Generic;

namespace Analision.Notifications.Dto;

public class UpdateNotificationSettingsInput
{
    public bool ReceiveNotifications { get; set; }

    public List<NotificationSubscriptionDto> Notifications { get; set; }
}

