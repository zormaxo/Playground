﻿using Abp.Application.Services.Dto;
using Abp.Auditing;
using Abp.Authorization;
using Abp.Configuration.Startup;
using Abp.Domain.Repositories;
using Abp.EntityHistory;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Microsoft.EntityFrameworkCore;
using Analision.Auditing.Dto;
using Analision.Auditing.Exporting;
using Analision.Authorization;
using Analision.Authorization.Users;
using Analision.Dto;
using Analision.EntityChanges.Dto;
using Analision.EntityHistory;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using EntityHistoryHelper = Analision.EntityHistory.EntityHistoryHelper;

namespace Analision.Auditing;

[DisableAuditing]
[AbpAuthorize(AppPermissions.Pages_Administration_AuditLogs)]
public class AuditLogAppService : AnalisionAppServiceBase, IAuditLogAppService
{
    private readonly IRepository<AuditLog, long> _auditLogRepository;
    private readonly IRepository<EntityChange, long> _entityChangeRepository;
    private readonly IRepository<EntityChangeSet, long> _entityChangeSetRepository;
    private readonly IRepository<EntityPropertyChange, long> _entityPropertyChangeRepository;
    private readonly IRepository<User, long> _userRepository;
    private readonly IAuditLogListExcelExporter _auditLogListExcelExporter;
    private readonly INamespaceStripper _namespaceStripper;
    private readonly IAbpStartupConfiguration _abpStartupConfiguration;

    public AuditLogAppService(
        IRepository<AuditLog, long> auditLogRepository,
        IRepository<User, long> userRepository,
        IAuditLogListExcelExporter auditLogListExcelExporter,
        INamespaceStripper namespaceStripper,
        IRepository<EntityChange, long> entityChangeRepository,
        IRepository<EntityChangeSet, long> entityChangeSetRepository,
        IRepository<EntityPropertyChange, long> entityPropertyChangeRepository,
        IAbpStartupConfiguration abpStartupConfiguration)
    {
        _auditLogRepository = auditLogRepository;
        _userRepository = userRepository;
        _auditLogListExcelExporter = auditLogListExcelExporter;
        _namespaceStripper = namespaceStripper;
        _entityChangeRepository = entityChangeRepository;
        _entityChangeSetRepository = entityChangeSetRepository;
        _entityPropertyChangeRepository = entityPropertyChangeRepository;
        _abpStartupConfiguration = abpStartupConfiguration;
    }

    #region audit logs

    public async Task<PagedResultDto<AuditLogListDto>> GetAuditLogs(GetAuditLogsInput input)
    {
        var query = CreateAuditLogAndUsersQuery(input);

        var resultCount = await query.CountAsync();
        var results = await query
            .OrderBy(input.Sorting)
            .PageBy(input)
            .ToListAsync();

        var auditLogListDtos = ConvertToAuditLogListDtos(results);

        return new PagedResultDto<AuditLogListDto>(resultCount, auditLogListDtos);
    }

    public async Task<FileDto> GetAuditLogsToExcel(GetAuditLogsInput input)
    {
        var auditLogs = await CreateAuditLogAndUsersQuery(input)
            .OrderByDescending(al => al.AuditLog.ExecutionTime)
            .ToListAsync();

        var auditLogListDtos = ConvertToAuditLogListDtos(auditLogs);

        return await _auditLogListExcelExporter.ExportToFile(auditLogListDtos);
    }

    private List<AuditLogListDto> ConvertToAuditLogListDtos(List<AuditLogAndUser> results)
    {
        return results.Select(
            result =>
            {
                var auditLogListDto = ObjectMapper.Map<AuditLogListDto>(result.AuditLog);
                auditLogListDto.UserName = result.User?.UserName;
                auditLogListDto.ServiceName = _namespaceStripper.StripNameSpace(auditLogListDto.ServiceName);
                return auditLogListDto;
            }).ToList();
    }

    private IQueryable<AuditLogAndUser> CreateAuditLogAndUsersQuery(GetAuditLogsInput input)
    {
        var query = from auditLog in _auditLogRepository.GetAllReadonly()
                    join user in _userRepository.GetAll() on auditLog.UserId equals user.Id into userJoin
                    from joinedUser in userJoin.DefaultIfEmpty()
                    where auditLog.ExecutionTime >= input.StartDate && auditLog.ExecutionTime <= input.EndDate
                    select new AuditLogAndUser { AuditLog = auditLog, User = joinedUser };

        query = query
            .WhereIf(!input.UserName.IsNullOrWhiteSpace(), item => item.User.UserName.Contains(input.UserName))
            .WhereIf(!input.ServiceName.IsNullOrWhiteSpace(), item => item.AuditLog.ServiceName.Contains(input.ServiceName))
            .WhereIf(!input.MethodName.IsNullOrWhiteSpace(), item => item.AuditLog.MethodName.Contains(input.MethodName))
            .WhereIf(!input.BrowserInfo.IsNullOrWhiteSpace(), item => item.AuditLog.BrowserInfo.Contains(input.BrowserInfo))
            .WhereIf(input.MinExecutionDuration.HasValue && input.MinExecutionDuration > 0, item => item.AuditLog.ExecutionDuration >= input.MinExecutionDuration.Value)
            .WhereIf(input.MaxExecutionDuration.HasValue && input.MaxExecutionDuration < int.MaxValue, item => item.AuditLog.ExecutionDuration <= input.MaxExecutionDuration.Value)
            .WhereIf(input.HasException == true, item => item.AuditLog.Exception != null && item.AuditLog.Exception != "")
            .WhereIf(input.HasException == false, item => item.AuditLog.Exception == null || item.AuditLog.Exception == "");
        return query;
    }

    #endregion

    #region entity changes 
    public List<NameValueDto> GetEntityHistoryObjectTypes()
    {
        var entityHistoryObjectTypes = new List<NameValueDto>();
        var enabledEntities = (_abpStartupConfiguration.GetCustomConfig()
            .FirstOrDefault(x => x.Key == EntityHistoryHelper.EntityHistoryConfigurationName)
            .Value as EntityHistoryUiSetting)?.EnabledEntities ?? new List<string>();

        if (AbpSession.TenantId == null)
        {
            enabledEntities = EntityHistoryHelper.HostSideTrackedTypes.Select(t => t.FullName).Intersect(enabledEntities).ToList();
        }
        else
        {
            enabledEntities = EntityHistoryHelper.TenantSideTrackedTypes.Select(t => t.FullName).Intersect(enabledEntities).ToList();
        }

        foreach (var enabledEntity in enabledEntities)
        {
            entityHistoryObjectTypes.Add(new NameValueDto(L(enabledEntity), enabledEntity));
        }

        return entityHistoryObjectTypes;
    }

    public async Task<PagedResultDto<EntityChangeListDto>> GetEntityChanges(GetEntityChangeInput input)
    {
        var query = CreateEntityChangesAndUsersQuery(input);

        var resultCount = await query.CountAsync();
        var results = await query
            .OrderBy(input.Sorting)
            .PageBy(input)
            .ToListAsync();

        var entityChangeListDtos = ConvertToEntityChangeListDtos(results);

        return new PagedResultDto<EntityChangeListDto>(resultCount, entityChangeListDtos);
    }

    public async Task<PagedResultDto<EntityChangeListDto>> GetEntityTypeChanges(GetEntityTypeChangeInput input)
    {
        // Fix for: https://github.com/aspnetzero/aspnet-zero-core/issues/2101
        var entityId = "\"" + input.EntityId + "\"";

        var query = from entityChangeSet in _entityChangeSetRepository.GetAll()
                    join entityChange in _entityChangeRepository.GetAll() on entityChangeSet.Id equals entityChange.EntityChangeSetId
                    join user in _userRepository.GetAll() on entityChangeSet.UserId equals user.Id
                    where entityChange.EntityTypeFullName == input.EntityTypeFullName &&
                          (entityChange.EntityId == input.EntityId || entityChange.EntityId == entityId)
                    select new EntityChangeAndUser
                    {
                        EntityChange = entityChange,
                        User = user
                    };

        var resultCount = await query.CountAsync();
        var results = await query
            .OrderBy(input.Sorting)
            .PageBy(input)
            .ToListAsync();

        var entityChangeListDtos = ConvertToEntityChangeListDtos(results);

        return new PagedResultDto<EntityChangeListDto>(resultCount, entityChangeListDtos);
    }

    public async Task<FileDto> GetEntityChangesToExcel(GetEntityChangeInput input)
    {
        var entityChanges = await CreateEntityChangesAndUsersQuery(input)
            .AsNoTracking()
            .OrderByDescending(ec => ec.EntityChange.EntityChangeSetId)
            .ThenByDescending(ec => ec.EntityChange.ChangeTime)
            .ToListAsync();

        var entityChangeListDtos = ConvertToEntityChangeListDtos(entityChanges);

        return await _auditLogListExcelExporter.ExportToFile(entityChangeListDtos);
    }

    public async Task<List<EntityPropertyChangeDto>> GetEntityPropertyChanges(long entityChangeId)
    {
        var entityPropertyChanges = await _entityPropertyChangeRepository.GetAllListAsync(epc => epc.EntityChangeId == entityChangeId);

        return ObjectMapper.Map<List<EntityPropertyChangeDto>>(entityPropertyChanges);
    }

    private List<EntityChangeListDto> ConvertToEntityChangeListDtos(List<EntityChangeAndUser> results)
    {
        var impersonatedEntityChanges = results
            .Where(e => e.EntityChangeSet.ImpersonatorUserId.HasValue)
            .ToList();

        var impersonatorUsers = GetImpersonatorUserNames(impersonatedEntityChanges);

        return results.Select(result =>
        {
            var entityChangeListDto = ObjectMapper.Map<EntityChangeListDto>(result.EntityChange);
            entityChangeListDto.UserName = result.User?.UserName;

            entityChangeListDto.ImpersonatorUserName = result.EntityChangeSet.ImpersonatorUserId.HasValue
                ? impersonatorUsers.GetValueOrDefault(result.EntityChangeSet.ImpersonatorUserId.Value)
                : null;

            return entityChangeListDto;
        }).ToList();
    }

    private IQueryable<EntityChangeAndUser> CreateEntityChangesAndUsersQuery(GetEntityChangeInput input)
    {
        var baseQuery = from entityChangeSet in _entityChangeSetRepository.GetAll()
                        join entityChange in _entityChangeRepository.GetAll()
                            on entityChangeSet.Id equals entityChange.EntityChangeSetId
                        join user in _userRepository.GetAll()
                            on entityChangeSet.UserId equals user.Id into userJoin
                        from user in userJoin.DefaultIfEmpty()
                        select new EntityChangeAndUser
                        {
                            EntityChange = entityChange,
                            User = user,
                            EntityChangeSet = entityChangeSet
                        };

        var filteredQuery = baseQuery
            .Where(item => item.EntityChange.ChangeTime >= input.StartDate &&
                           item.EntityChange.ChangeTime <= input.EndDate)
            .WhereIf(!input.UserName.IsNullOrWhiteSpace(), item => item.User.UserName.Contains(input.UserName))
            .WhereIf(!input.EntityTypeFullName.IsNullOrWhiteSpace(), item => item.EntityChange.EntityTypeFullName.Contains(input.EntityTypeFullName));

        return filteredQuery;
    }

    private Dictionary<long, string> GetImpersonatorUserNames(List<EntityChangeAndUser> impersonatedEntityChanges)
    {
        var tenantSpecificUserIds = impersonatedEntityChanges
            .Where(e => e.EntityChangeSet.ImpersonatorTenantId.HasValue)
            .Select(e => e.EntityChangeSet.ImpersonatorUserId!.Value)
            .Distinct()
            .ToList();

        var crossTenantUserIds = impersonatedEntityChanges
            .Where(e => !e.EntityChangeSet.ImpersonatorTenantId.HasValue)
            .Select(e => e.EntityChangeSet.ImpersonatorUserId!.Value)
            .Distinct()
            .ToList();

        Dictionary<long, string> impersonatorUsers = new();

        if (tenantSpecificUserIds.Any())
        {
            var tenantUsers = _userRepository.GetAll()
                .Where(u => tenantSpecificUserIds.Contains(u.Id))
                .Select(u => new { u.Id, u.UserName })
                .ToDictionary(u => u.Id, u => u.UserName);

            foreach (var user in tenantUsers)
            {
                impersonatorUsers[user.Key] = user.Value;
            }
        }

        if (crossTenantUserIds.Any())
        {
            using (CurrentUnitOfWork.SetTenantId(null))
            {
                var crossTenantUsers = _userRepository.GetAll()
                    .Where(u => crossTenantUserIds.Contains(u.Id))
                    .Select(u => new { u.Id, u.UserName })
                    .ToDictionary(u => u.Id, u => $"Host/{u.UserName}");

                foreach (var user in crossTenantUsers)
                {
                    impersonatorUsers[user.Key] = user.Value;
                }
            }
        }

        return impersonatorUsers;
    }
    #endregion
}