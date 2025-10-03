import { HttpClient } from '@angular/common/http';
import { Component, inject, ViewChild, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { API_URL, ENDPOINTS } from '../../../core/const';

import {
  ChartComponent,
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexLegend,
  ApexPlotOptions,
  ApexYAxis,
  ApexXAxis,
  ApexTitleSubtitle,
} from 'ng-apexcharts';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

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

export type ChartCall = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};


@Component({
  selector: 'app-dietician-dashboard',
  standalone: true,
  imports: [MatIconModule,
    MatCardModule,
    NgApexchartsModule,
    MatButtonModule,
    MatTableModule],
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
  public chartCall!: ChartCall;

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['name', 'email', 'phone'];
  showAll: boolean = false;

  constructor() {
    this.chartOptions = {
      series: [],
      chart: {
        height: 280,
        type: 'radialBar',
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

    this.chartCall = {
      series: [
        {
          name: "Scheduled Calls",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: "top" // top, center, bottom
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return val + "%";
        },
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#304758"]
        }
      },

      xaxis: {
        categories: [
          
        ],
        position: "top",
        labels: {
          offsetY: -18
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5
            }
          }
        },
        tooltip: {
          enabled: true,
          offsetY: -35
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100]
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false,
          formatter: function(val) {
            return val + "%";
          }
        }
      },
      title: {
        text: "Monthly Inflation in Argentina, 2002",
        // floating: 0,
        offsetY: 320,
        align: "center",
        style: {
          color: "#444"
        }
      }
    };
  }

  ngOnInit(): void {
    this.getData();
    this.updateDataSource();
  }

  getData(): void {
    // get gender
    this.http.get(API_URL + ENDPOINTS.GET_USERS_ONBOARD_DIET).subscribe({
      next: (res: any) => {
        this.onBoardUsers = res;
        this.dataSource.data = this.onBoardUsers;
        //  this.dataSource.data = this.showAll ? this.onBoardUsers : this.onBoardUsers.slice(0, 5);
        const maleCount = this.onBoardUsers.filter((user) => user.gender === 'male').length;
        const femaleCount = this.onBoardUsers.filter((user) => user.gender === 'female').length;
        const total = maleCount + femaleCount;

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

        if (this.chart) {
          this.chart.updateOptions(this.chartOptions);
        }
      },
      error: (error: any) => {
        console.error('Error fetching onboard users:', error);
      },
    });

    // get schedule call count
    this.http.get(API_URL + ENDPOINTS.GET_SCHEDULED_CALL).subscribe({
      next: (res:any)=>{
       if (!Array.isArray(res)) {
        console.error("Expected array from scheduled calls API", res);
        return;
      }

      // Step 1: define helper to get month name
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];

      // Step 2: count per month
      const countsByMonth: { [monthName: string]: number } = {};

      for (const item of res) {
        if (!item.date) continue;
        const dt = new Date(item.date);
        if (isNaN(dt.getTime())) {
          console.warn("Invalid date:", item.date);
          continue;
        }
        const monthIndex = dt.getMonth();
        const monthName = monthNames[monthIndex];

        if (!countsByMonth[monthName]) {
          countsByMonth[monthName] = 1;
        } else {
          countsByMonth[monthName]++;
        }
      }

      // Step 3: sort by month order (using your predefined list)
      const sortedMonths = monthNames.filter(m => countsByMonth[m] !== undefined);
      // Filter preserves order of monthNames so Jan->Dec

      const data = sortedMonths.map(m => countsByMonth[m]);

      // Step 4: update the chartCall
      this.chartCall = {
        ...this.chartCall,
        series: [
          {
            name: "Scheduled Calls",
            data: data
          }
        ],
        xaxis: {
          ...this.chartCall.xaxis,
          categories: monthNames
        },
        title: {
          ...this.chartCall.title,
          text: "Scheduled Calls by Month"
        }
      };

      }
    })

  }
  updateDataSource() {
    this.dataSource.data = this.showAll ? this.dataSource.data : this.dataSource.data.slice(0, 5);
  }
  toggleView() {
    this.showAll = !this.showAll;
    this.updateDataSource();
  }

}