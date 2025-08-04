import { Component, OnInit, Injector, inject } from '@angular/core';
import { forEach as _forEach } from 'lodash-es';
import { SalesSummaryDatePeriod, TenantDashboardServiceProxy } from '@shared/service-proxies/service-proxies';
import { DashboardChartBase } from '../dashboard-chart-base';
import { WidgetComponentBaseComponent } from '../widget-component-base';
import { NgClass } from '@angular/common';
import { NgScrollbar } from 'ngx-scrollbar';
import { BusyIfDirective } from '../../../../../../shared/utils/busy-if.directive';
import { Angular2CountoModule } from '@awaismirza/angular2-counto';
import { AreaChartModule } from '@swimlane/ngx-charts';
import { LocalizePipe } from '@shared/common/pipes/localize.pipe';

class SalesSummaryChart extends DashboardChartBase {
    totalSales = 0;
    totalSalesCounter = 0;
    revenue = 0;
    revenuesCounter = 0;
    expenses = 0;
    expensesCounter = 0;
    growth = 0;
    growthCounter = 0;

    selectedDatePeriod: SalesSummaryDatePeriod;

    data = [];

    constructor(private _dashboardService: TenantDashboardServiceProxy) {
        super();
    }

    init(salesSummaryData, totalSales, revenue, expenses, growth) {
        this.totalSales = totalSales;
        this.totalSalesCounter = totalSales;

        this.revenue = revenue;
        this.expenses = expenses;
        this.growth = growth;

        this.setChartData(salesSummaryData);

        this.hideLoading();
    }

    setChartData(items): void {
        let sales = [];
        let profit = [];

        _forEach(items, (item) => {
            sales.push({
                name: item['period'],
                value: item['sales'],
            });

            profit.push({
                name: item['period'],
                value: item['profit'],
            });
        });

        this.data = [
            {
                name: 'Sales',
                series: sales,
            },
            {
                name: 'Profit',
                series: profit,
            },
        ];
    }

    reload(datePeriod) {
        if (this.selectedDatePeriod === datePeriod) {
            this.hideLoading();
            return;
        }

        this.selectedDatePeriod = datePeriod;

        this.showLoading();
        this._dashboardService.getSalesSummary(datePeriod).subscribe((result) => {
            this.setChartData(result.salesSummary);
            this.hideLoading();
        });
    }
}

@Component({
    selector: 'app-widget-sales-summary',
    templateUrl: './widget-sales-summary.component.html',
    styleUrls: ['./widget-sales-summary.component.css'],
    imports: [NgClass, NgScrollbar, BusyIfDirective, Angular2CountoModule, AreaChartModule, LocalizePipe],
})
export class WidgetSalesSummaryComponent extends WidgetComponentBaseComponent implements OnInit {
    private _tenantDashboardServiceProxy = inject(TenantDashboardServiceProxy);

    salesSummaryChart: SalesSummaryChart;
    appSalesSummaryDateInterval = SalesSummaryDatePeriod;

    constructor(...args: unknown[]);

    constructor() {
        const injector = inject(Injector);

        super(injector);
        this.salesSummaryChart = new SalesSummaryChart(this._tenantDashboardServiceProxy);
    }

    ngOnInit(): void {
        this.subDateRangeFilter();

        this.runDelayed(() => {
            this.salesSummaryChart.reload(SalesSummaryDatePeriod.Daily);
        });
    }

    onDateRangeFilterChange = (dateRange) => {
        this.runDelayed(() => {
            this.salesSummaryChart.reload(SalesSummaryDatePeriod.Daily);
        });
    };

    subDateRangeFilter() {
        this.subscribeToEvent('app.dashboardFilters.dateRangePicker.onDateChange', this.onDateRangeFilterChange);
    }
}
