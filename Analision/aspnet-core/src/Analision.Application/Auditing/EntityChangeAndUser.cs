using Abp.EntityHistory;
using Analision.Authorization.Users;

namespace Analision.Auditing;

/// <summary>
/// A helper class to store an <see cref="EntityChange"/> and a <see cref="User"/> object.
/// </summary>
public class EntityChangeAndUser
{
    public EntityChange EntityChange { get; set; }

    public EntityChangeSet EntityChangeSet { get; set; }

    public User User { get; set; }

    public string ImpersonatorUserName { get; set; }
}
