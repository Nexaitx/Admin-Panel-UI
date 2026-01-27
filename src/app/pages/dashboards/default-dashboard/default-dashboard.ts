import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { API_URL, ENDPOINTS } from '../../../core/const';
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

export type ChartOptionsStaffType = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  fill: ApexFill;
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

@Component({
  selector: 'app-default-dashboard',
  imports: [MatCardModule,
    MatButtonModule,
    NgApexchartsModule,
    MatIconModule
  ],
  templateUrl: './default-dashboard.html',
  styleUrl: './default-dashboard.scss'
})
export class DefaultDashboard {
  public chartOptionsStaffType!: ChartOptionsStaffType;
  public chartOptionClientStaff!: ChartOptionClientStaff;
  public chartOptionsBooking!: ChartOptionsBooking;
  private http = inject(HttpClient);
  jwt = localStorage.getItem('token');
  currentUser: any;
  constructor() {
    this.chartOptionsStaffType = {
      series: [],
      chart: {
        type: "polarArea",
        width: "300"
      },
      labels: [],
      plotOptions: {},
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

    this.chartOptionClientStaff = {
      series: [
        { name: "Clients", data: [] },
        { name: "Staffs", data: [] }
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
        categories: []
      },
      yaxis: {
        title: {
          text: '' // can put something if needed
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: (val: any) => {
            return val + " records";
          }
        }
      }
    };

    this.chartOptionsBooking = {
      series: [],
      chart: {
        width: 380,
        type: "pie",
        height: 400
      },
      labels: ["Previous", "Up Coming", "Cancelled"],
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
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.jwt}`
    });

    // 2. Pass the headers in the options argument
    this.http.get(API_URL + ENDPOINTS.GET_LOGGED_IN_USER_DETAILS, { headers })
      .subscribe((res: any) => {
        this.currentUser = res;
      });

    // staff type chart data
    this.http.get(API_URL + ENDPOINTS.GET_ACCOUNTS_COUNT).subscribe((res: any) => {
      if (res && Array.isArray(res) && res.every(item => 'staffCount' in item && 'categoryName' in item)) {

        const accountCounts = res.map((a: any) => a.staffCount);
        const accountTypes = res.map((a: any) => a.subcategoryName);

        this.chartOptionsStaffType = {
          ...this.chartOptionsStaffType,
          series: accountCounts,
          labels: accountTypes,
        };
      } else {
        console.error('API response is not in the expected format:', res);
      }
    });


    // client and staff chart data
    this.http.get(API_URL + ENDPOINTS.GET_CLIENT_STAFF_COUNT).subscribe((res: any) => {
      // this.clientStaff = res;
      const clientsCount = res.totalUsers ?? 0;
      const staffCount = res.totalStaff ?? 0;
      const monthLabel = "Current Month"; // or derive from res or date

      // Update series
      this.chartOptionClientStaff.series = [
        { name: "Clients", data: [clientsCount] },
        { name: "Staffs", data: [staffCount] }
      ];

      // Update xaxis categories
      this.chartOptionClientStaff.xaxis = {
        ...this.chartOptionClientStaff.xaxis,
        categories: [monthLabel]
      };

    });

    // Get bookings count
    this.http.get(API_URL + ENDPOINTS.GET_BOOKINGS_STATISTICS).subscribe((res: any) => {
      const total = res.total || 0;
      const ongoing = res.ongoing || 0;
      const accepted = res.accepted || 0;
      const past = res.past || 0;
      const cancelled = res.cancelled || 0;
      const pending = res.pending || 0;
      const completed = res.completed || 0;
      const upcoming = res.upcoming || 0;

      this.chartOptionsBooking.series = [total, accepted, past, upcoming, ongoing, pending, cancelled, completed];
    });
  }

}