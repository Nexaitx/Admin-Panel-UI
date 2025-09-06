import { HttpClient } from '@angular/common/http';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { API_URL, ENDPOINTS } from '../../core/const';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  NgApexchartsModule,
  ChartComponent,
  ApexAxisChartSeries,
  ApexDataLabels,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexResponsive,
} from "ng-apexcharts";
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
};

export type ChartOptionClientStaff = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

export type ChartOptionsBooking = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

export type ChartOptionsStaffType = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  stroke: ApexStroke;
  fill: ApexFill;
};




@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    NgApexchartsModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})

export class Dashboard {
  http = inject(HttpClient)
  role = localStorage.getItem('role');
  clients: any;
  staffs: any;
  dietPlans: any;
  doctors: any;
  dieticians: any;
  pharmacist: any;
  userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: ChartOptions;
  public chartOptionClientStaff!: ChartOptionClientStaff;
  public chartOptionsBooking!: ChartOptionsBooking;
  public chartOptionsStaffType!: ChartOptionsStaffType;

  constructor() {
    this.chartOptions = {
      series: [4, 5, 7, 8],
      chart: {
        height: 280,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "22px"
            },
            value: {
              fontSize: "16px"
            },
            total: {
              show: true,
              label: "Total",
              formatter: function (w) {
                return "30";
              }
            }
          }
        }
      },
      labels: ["Doctors", "Dieticians", "Physiotherapist", "Psychiatrist"]
    };

    this.chartOptionClientStaff = {
      series: [
        {
          name: "Clients",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        },
        {
          name: "Staffs",
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        }
      ],
      chart: {
        type: "bar",
        height: 300
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left'
      },
      xaxis: {
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct"
        ]
      },
      yaxis: {
        title: {
          text: "$ (thousands)"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands";
          }
        }
      }
    };

    this.chartOptionsBooking = {
      series: [44, 55, 13, 43],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["Previous", "On Going", "Up Coming", "Cancelled"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

    this.chartOptionsStaffType = {
      series: [14, 23, 21, 17, 15],
      chart: {
        type: "polarArea"
      },
      labels: [
        'Nurse', 'Baby Sitter', 'Psychiatrist', 'Physiotherapist', 'Security Guard'
      ],
      stroke: {
        colors: ["#fff"]
      },
      fill: {
        opacity: 0.8
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    // get dietplans
    this.http.get(API_URL + ENDPOINTS.GET_DIETPLAN).subscribe((res: any) => {
      this.dietPlans = res;
    });

    // get dieticians
    this.http.get(API_URL + ENDPOINTS.GET_ACCOUNT_BY_ROLE + '/Dietician').subscribe((res: any) => {
      this.dieticians = res;
    });

    // get Doctors
    this.http.get(API_URL + ENDPOINTS.GET_ACCOUNT_BY_ROLE + '/Admin').subscribe((res: any) => {
      this.doctors = res;
    });

  }
}
