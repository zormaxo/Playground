using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Analision.MultiTenancy.HostDashboard.Dto;

namespace Analision.MultiTenancy.HostDashboard;

public interface IIncomeStatisticsService
{
    Task<List<IncomeStastistic>> GetIncomeStatisticsData(DateTime startDate, DateTime endDate,
        ChartDateInterval dateInterval);
}
