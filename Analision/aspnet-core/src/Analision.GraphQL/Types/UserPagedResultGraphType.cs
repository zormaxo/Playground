using Abp.Application.Services.Dto;
using GraphQL.Types;
using Analision.Dto;

namespace Analision.Types;

public class UserPagedResultGraphType : ObjectGraphType<PagedResultDto<UserDto>>
{
    public UserPagedResultGraphType()
    {
        Name = "UserPagedResultGraphType";

        Field(x => x.TotalCount);
        Field(x => x.Items, type: typeof(ListGraphType<UserType>));
    }
}

