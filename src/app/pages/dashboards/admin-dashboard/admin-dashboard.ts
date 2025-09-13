import { HttpClient } from '@angular/common/http';
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

const ELEMENT_DATA = [
  { staffId: 1, staff: 'Hydrogen', user: 1.0079, status: 'In Complete', location: 'A1' },
  { staffId: 2, staff: 'Helium', user: 4.0026, status: 'Complete', location: 'A2' },
  { staffId: 3, staff: 'Lithium', user: 6.941, status: 'Complete', location: 'A3' },
  { staffId: 1, staff: 'Hydrogen', user: 1.0079, status: 'In Complete', location: 'A1' },
  { staffId: 4, staff: 'Beryllium', user: 9.0122, status: 'Complete', location: 'A4' },
  { staffId: 2, staff: 'Helium', user: 4.0026, status: 'Complete', location: 'A2' },
  { staffId: 5, staff: 'Boron', user: 10.811, status: 'Complete', location: 'A5' },
  { staffId: 6, staff: 'Carbon', user: 12.0107, status: 'In Complete', location: 'A6' },
  { staffId: 4, staff: 'Beryllium', user: 9.0122, status: 'Complete', location: 'A4' },
  { staffId: 7, staff: 'Nitrogen', user: 14.0067, status: 'Complete', location: 'A7' },
  { staffId: 5, staff: 'Boron', user: 10.811, status: 'Complete', location: 'A5' },
  { staffId: 8, staff: 'Oxygen', user: 15.9994, status: 'Complete', location: 'A8' },
  { staffId: 6, staff: 'Carbon', user: 12.0107, status: 'In Complete', location: 'A6' },
  { staffId: 9, staff: 'Fluorine', user: 18.9984, status: 'In Complete', location: 'A9' },
  { staffId: 10, staff: 'Neon', user: 20.1797, status: 'Complete', location: 'A10' },
  { staffId: 8, staff: 'OxystaffIdgen', user: 15.9994, status: 'Complete', location: 'A8' },
];
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
  userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
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
          // text: "$ (thousands)"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " records";
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

  getData() {
    // get dietplans
    // this.http.get(API_URL + ENDPOINTS.GET_DIETPLAN).subscribe((res: any) => {
    //   this.dietPlans = res;
    // });

    // get dieticians
    // this.http.get(API_URL + ENDPOINTS.GET_ACCOUNT_BY_ROLE + '/Dietician').subscribe((res: any) => {
    //   this.dieticians = res;
    // });

    // get Doctors
    // this.http.get(API_URL + ENDPOINTS.GET_ACCOUNT_BY_ROLE + '/Admin').subscribe((res: any) => {
    //   this.doctors = res;
    // });

    this.http.get(API_URL + ENDPOINTS.GET_ONGOING_BOOKINGS).subscribe((res: any) => {
      this.dataSource.data = res;
    });

  }
}
