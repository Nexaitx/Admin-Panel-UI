import { HttpClient } from '@angular/common/http';
import { Component, inject, ViewChild, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { API_URL, ENDPOINTS } from '../../../core/const';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexLegend,
  ApexPlotOptions,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  plotOptions: {
    radialBar?: {
      dataLabels?: {
        name?: {
          fontSize?: string;
        };
        value?: {
          fontSize?: string;
          formatter?: (val: number, opts?: any) => string;
        };
        total?: {
          show?: boolean;
          label?: string;
          formatter?: () => string;
        };
      };
    };
  };
};

@Component({
  selector: 'app-dietician-dashboard',
  standalone: true,
  imports: [MatIconModule, MatCardModule, NgApexchartsModule],
  templateUrl: './dietician-dashboard.html',
  styleUrl: './dietician-dashboard.scss',
})
export class DieticianDashboard implements OnInit {
  userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  role = this.userProfile?.role?.roleType;
  http = inject(HttpClient);
  onBoardUsers: any[] = [];
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: ChartOptions;

  constructor() {
    this.chartOptions = {
      series: [],
      chart: {
        height: 280,
        type: 'radialBar', // Consider switching to 'pie' or 'donut' if raw counts are used
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: '22px',
            },
            value: {
              fontSize: '16px',
              formatter: function (val: number, opts: any) {
                const raw = opts?.w?.globals?.series?.[opts.seriesIndex] ?? val;
                return raw !== undefined && raw !== null ? raw.toString() : val.toString();
              },
            },
            total: {
              show: true,
              label: 'Total',
              formatter: () => '0',
            },
          },
        },
      },
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      fill: {
        opacity: 0.8,
      },
      legend: {
        show: true,
        position: 'bottom',
      },
      dataLabels: {
        enabled: true,
      },
    };
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.http.get(API_URL + ENDPOINTS.GET_USERS_ONBOARD_DIET).subscribe({
      next: (res: any) => {
        this.onBoardUsers = res;
        // Process gender counts
        const maleCount = this.onBoardUsers.filter((user) => user.gender === 'male').length;
        const femaleCount = this.onBoardUsers.filter((user) => user.gender === 'female').length;
        const total = maleCount + femaleCount;

        // Update chartOptions
        this.chartOptions = {
          ...this.chartOptions,
          series: [maleCount, femaleCount],
          labels: ['Male', 'Female'],
          plotOptions: {
            ...this.chartOptions.plotOptions,
            radialBar: {
              ...this.chartOptions.plotOptions.radialBar,
              dataLabels: {
                ...this.chartOptions.plotOptions.radialBar?.dataLabels,
                total: {
                  ...this.chartOptions.plotOptions.radialBar?.dataLabels?.total,
                  formatter: () => total.toString(),
                },
              },
            },
          },
        };

        // Optionally, force chart update if necessary
        if (this.chart) {
          this.chart.updateOptions(this.chartOptions);
        }
      },
      error: (error: any) => {
        console.error('Error fetching onboard users:', error);
      },
    });
  }
}