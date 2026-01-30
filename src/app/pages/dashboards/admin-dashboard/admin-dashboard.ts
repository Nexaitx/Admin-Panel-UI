import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { API_URL, ENDPOINTS } from '../../../core/const';
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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

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
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    NgApexchartsModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    CommonModule
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})

export class AdminDashboard {
  http = inject(HttpClient)
  role = localStorage.getItem('role');
  clients: any;
  staffs: any;
  dietPlans: any;
  doctors: any;
  dieticians: any;
  pharmacist: any;
  userProfile = JSON.parse(localStorage.getItem('permissions') || '{}');
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: ChartOptions;
  public chartOptionClientStaff!: ChartOptionClientStaff;
  public chartOptionsBooking!: ChartOptionsBooking;
  public chartOptionsStaffType!: ChartOptionsStaffType;

  columns = [
    {
      columnDef: 'staffId',
      header: 'Staff Id',
      cell: (element: any) => `${element.staff?.staffId}`,
    },
    {
      columnDef: 'staff',
      header: 'Staff',
      cell: (element: any) => `${element.staff?.name}`,
    },
    {
      columnDef: 'user',
      header: 'User',
      cell: (element: any) => `${element.user?.name}`,
    },
    {
      columnDef: 'location',
      header: 'Location',
      cell: (element: any) => `${element.latitude}, ${element.longitude}`,
    },
    {
      columnDef: 'status',
      header: 'Status',
      cell: (element: any) => `${element.status}`,
    },
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  displayedColumns = this.columns.map(c => c.columnDef);
  showAll: boolean = false;
  ongoingBookings: any;
  roles: [] = [];
  accounts: [] = [];
  showAllDietPlans = false;
  clientStaff: any;

  constructor() {
    this.chartOptions = {
      series: [],
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
              fontSize: "16px",
              formatter: function (val: number) {
                const opts: any = (arguments as any)[1];
                const raw = opts && opts.w && opts.w.globals && opts.w.globals.series
                  ? opts.w.globals.series[opts.seriesIndex]
                  : val;
                return (raw !== undefined && raw !== null) ? raw.toString() : val.toString();
              }
            },
            total: {
              show: true,
              label: "Total",
              formatter: function (w) {
                return "0";
              }
            }
          }
        }
      },
      labels: []
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
        width: 280,
        type: "pie"
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

    this.chartOptionsStaffType = {
      series: [],
      chart: {
        type: "polarArea",
        width: "300"
      },
      labels: [],
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
    this.updateDataSource();
  }

  updateDataSource() {
    this.dataSource.data = this.showAll ? this.dataSource.data : this.dataSource.data.slice(0, 5);
  }

  toggleView() {
    this.showAll = !this.showAll;
    this.updateDataSource();
  }

  getStatusBackgroundColor(status: string): string {
    switch (status) {
      case 'In Complete':
        return '#f7e1de'; // A light blue
      case 'ACTIVE':
        return '#dcf8d5ff'; // A light pink
      default:
        return '';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'In Complete':
        return '#C2185B'; // A dark pink
      case 'ACTIVE':
        return '#2E7D32'; // A dark green
      default:
        return '';
    }
  }

  currentUser: any;
  jwt = localStorage.getItem('token');
  getData() {

   const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.jwt}`
    });

    // 2. Pass the headers in the options argument
    this.http.get(API_URL + ENDPOINTS.GET_LOGGED_IN_USER_DETAILS, { headers })
      .subscribe((res: any) => {
        this.currentUser = res;
      });

    this.http.get(API_URL + ENDPOINTS.GET_ONGOING_BOOKINGS).subscribe((res: any) => {
      this.dataSource.data = res;
    });

    // get ROLES COUNT
    this.http.get(API_URL + ENDPOINTS.GET_ROLES_COUNT).subscribe((res: any) => {
      this.roles = res;

      const memberCounts = this.roles.map((r: any) => r.memberCount);
      const roleTypes = this.roles.map((r: any) => r.roleType);
      const total = memberCounts.reduce((acc, val) => acc + val, 0);

      // update the options
      this.chartOptions.series = memberCounts;
      this.chartOptions.labels = roleTypes;
      if (
        this.chartOptions &&
        this.chartOptions.plotOptions &&
        this.chartOptions.plotOptions.radialBar &&
        this.chartOptions.plotOptions.radialBar.dataLabels &&
        this.chartOptions.plotOptions.radialBar.dataLabels.total
      ) {
        this.chartOptions.plotOptions.radialBar.dataLabels.total.formatter = () => total.toString();
      }
    });

    // get counts for dashboards
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
    // get active diet plans
    this.http.get(API_URL + ENDPOINTS.GET_ACTIVE_DIET_PLANS).subscribe((res: any) => {
      this.dietPlans = res;
    });

    // get clients and staff count
    this.http.get(API_URL + ENDPOINTS.GET_CLIENT_STAFF_COUNT).subscribe((res: any) => {
      this.clientStaff = res;
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

  toggleViewAll() {
    this.showAllDietPlans = !this.showAllDietPlans;
  }

  dietPlansToShow(): any[] {
    if (!this.dietPlans) {
      return [];
    }
    return this.showAllDietPlans ? this.dietPlans : this.dietPlans.slice(0, 5);
  }
}
