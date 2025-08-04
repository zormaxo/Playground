using Abp.Application.Services.Dto;

namespace Analision.Authorization.Users.Dto;

public interface IGetLoginAttemptsInput : ISortedResultRequest
{
    string Filter { get; set; }
}

