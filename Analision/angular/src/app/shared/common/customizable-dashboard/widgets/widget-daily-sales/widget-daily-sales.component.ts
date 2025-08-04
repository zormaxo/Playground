import { Component, OnInit, Injector, inject } from '@angular/core';
import { TenantDashboardServiceProxy } from '@shared/service-proxies/service-proxies';
import { DashboardChartBase } from '../dashboard-chart-base';
import { WidgetComponentBaseComponent } from '../widget-component-base';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { BarChartModule } from '@swimlane/ngx-charts';

class DailySalesLineChart extends DashboardChartBase {
    chartData: any[];
    scheme: any = {
        name: 'green',
        selectable: true,
        group: 'Ordinal',
        domain: ['#34bfa3'],
    };

    constructor(private _dashboardService: TenantDashboardServiceProxy) {
        super();
    }

    init(data) {
        this.chartData = [];
        for (let i = 0; i < data.length; i++) {
            this.chartData.push({
                name: i + 1,
                value: data[i],
            });
        }
    }

    reload() {
        this.showLoading();
        this._dashboardService.getDailySales().subscribe((result) => {
            this.init(result.dailySales);
            this.hideLoading();
        });
    }
}

@Component({
    selector: 'app-widget-daily-sales',
    templateUrl: './widget-daily-sales.component.html',
    styleUrls: ['./widget-daily-sales.component.css'],
    imports: [BarChartModule, NgScrollbarModule],
})
export class WidgetDailySalesComponent extends WidgetComponentBaseComponent implements OnInit {
    private _tenantdashboardService = inject(TenantDashboardServiceProxy);

    dailySalesLineChart: DailySalesLineChart;

    constructor(...args: unknown[]);

    constructor() {
        const injector = inject(Injector);

        super(injector);
        this.dailySalesLineChart = new DailySalesLineChart(this._tenantdashboardService);
    }

    ngOnInit() {
        this.dailySalesLineChart.reload();
    }
}
