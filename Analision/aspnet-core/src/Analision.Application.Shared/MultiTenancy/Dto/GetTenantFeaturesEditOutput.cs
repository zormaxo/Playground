using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Analision.Editions.Dto;

namespace Analision.MultiTenancy.Dto;

public class GetTenantFeaturesEditOutput
{
    public List<NameValueDto> FeatureValues { get; set; }

    public List<FlatFeatureDto> Features { get; set; }
}

