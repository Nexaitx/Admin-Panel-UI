import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { API_URL, ENDPOINTS } from '../../../core/const';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  NgApexchartsModule,
  ChartComponent,
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

@Component({
  selector: 'app-pharmacist-dashboard',
  imports: [RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    NgApexchartsModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    CommonModule],
  templateUrl: './pharmacist-dashboard.html',
  styleUrl: './pharmacist-dashboard.scss'
})
export class PharmacistDashboard {
  http = inject(HttpClient)
  clients: any;
  staffs: any;
  dietPlans: any;
  doctors: any;
  dieticians: any;
  pharmacist: any;
  userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: ChartOptions;

  columns = [
    {
      columnDef: 'medicineId',
      header: 'Medicine Id',
      cell: (element: any) => `${element.medicineId}`,
    },
    {
      columnDef: 'name',
      header: 'Medicine Name',
      cell: (element: any) => `${element.name}`,
    },
    {
      columnDef: 'price',
      header: 'Price',
      cell: (element: any) => `${element.price}`,
    },
    {
      columnDef: 'discountPercentage',
      header: 'Discount',
      cell: (element: any) => element.discountPercentage || 0,
    },
    {
      columnDef: 'quantityInStock',
      header: 'Quantity',
      cell: (element: any) => `${element.quantityInStock}`,
    },
    {
      columnDef: 'showInApp',
      header: 'Show in App',
      cell: (element: any) => `${element.showInApp}`,
    }
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  displayedColumns = this.columns.map(c => c.columnDef);
  showAll: boolean = false;
  ongoingBookings: any;
  accounts: [] = [];
  showAllDietPlans = false;
  allMedicineCount: any;
  medicineStatusCount: any;
  medicineCountOfMyProduct: any;
  myAccount: any;
  myOrders: any;
  router = inject(Router);

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
  }

  ngOnInit() {
    this.getData();
    this.updateDataSource();
  }

  updateDataSource() {
    this.dataSource.data = this.showAll ? this.dataSource.data : this.dataSource.data.slice(0, 5);
  }

  toggleView() {
    this.router.navigate(['/app/pharmaceutical/medicines']);
  }

  getData() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    this.http.get(API_URL + ENDPOINTS.GET_LOGGED_IN_USER_DETAILS, { headers }).subscribe((res: any) => {
      this.myAccount = res;
    });
    this.http.get(API_URL + ENDPOINTS.GET_MY_MEDICINES, { headers }).subscribe((res: any) => {
      this.dataSource.data = res.medicines;
    });

    this.http.get(API_URL + ENDPOINTS.GET_ALL_MEDICINES_COUNT).subscribe((res: any) => {
      this.allMedicineCount = res;
    });

    this.http.get(API_URL + ENDPOINTS.GET_ORDERS_COUNT, { headers }).subscribe((res: any) => {
      this.medicineStatusCount = res;
    });

    this.http.get(API_URL + ENDPOINTS.GET_COUNT_OF_MY_PRODUCTS, { headers }).subscribe((res: any) => {
      this.medicineCountOfMyProduct = res;
    });
    this.http.get(API_URL + ENDPOINTS.GET_MY_ORDERS, { headers }).subscribe((res: any) => {
      this.myOrders = res;
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
