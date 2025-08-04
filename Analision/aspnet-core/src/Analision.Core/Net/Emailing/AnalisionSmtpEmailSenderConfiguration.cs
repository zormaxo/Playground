using Abp.Configuration;
using Abp.Net.Mail;
using Abp.Net.Mail.Smtp;
using Abp.Runtime.Security;

namespace Analision.Net.Emailing;

public class AnalisionSmtpEmailSenderConfiguration : SmtpEmailSenderConfiguration
{
    public AnalisionSmtpEmailSenderConfiguration(ISettingManager settingManager) : base(settingManager)
    {

    }

    public override string Password => SimpleStringCipher.Instance.Decrypt(GetNotEmptySettingValue(EmailSettingNames.Smtp.Password));
}

