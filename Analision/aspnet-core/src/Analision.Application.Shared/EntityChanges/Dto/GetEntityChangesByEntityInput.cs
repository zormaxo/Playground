using Analision.Dto;
using System;

namespace Analision.EntityChanges.Dto;

public class GetEntityChangesByEntityInput
{
    public string EntityTypeFullName { get; set; }
    public string EntityId { get; set; }
}

