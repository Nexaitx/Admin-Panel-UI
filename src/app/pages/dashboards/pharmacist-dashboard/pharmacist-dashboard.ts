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
  ApexAxisChartSeries,
  ApexXAxis,
  ApexDataLabels,
  ApexLegend,
  NgApexchartsModule,
  ChartComponent,
} from 'ng-apexcharts';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';

export type RadialChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
};

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
};

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
};

@Component({
  selector: 'app-pharmacist-dashboard',
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    NgApexchartsModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    CommonModule,
  ],
  templateUrl: './pharmacist-dashboard.html',
  styleUrl: './pharmacist-dashboard.scss',
})
export class PharmacistDashboard {
  http = inject(HttpClient);
  router = inject(Router);
  userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  @ViewChild('radialChart') radialChart!: ChartComponent;
  @ViewChild('pieChart') pieChart!: ChartComponent;
  @ViewChild('barChart') barChart!: ChartComponent;

  public radialChartOptions!: RadialChartOptions;
  public pieChartOptions!: PieChartOptions;
  public barChartOptions!: BarChartOptions;

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
    },
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  displayedColumns = this.columns.map((c) => c.columnDef);
  showAll: boolean = false;
  allMedicineCount: any;
  medicineCountOfMyProduct: any;
  myAccount: any;
  myOrders: any;
  showAllDietPlans: boolean = false;
  dietPlans: any;

  constructor() {
    // Radial Bar Chart for Medicine Counts
    this.radialChartOptions = {
      series: [],
      chart: {
        height: 280,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: { fontSize: '22px' },
            value: {
              fontSize: '16px',
              formatter: (val: number) => {
              const seriesValue = Number(val); // Convert val to number
              console.log('Formatter - val:', val, 'seriesValue:', seriesValue); // Debug formatter
              return Number.isFinite(seriesValue) ? seriesValue.toFixed(0) : '0';
            },
            },
            total: {
              show: true,
              label: 'Total',
              formatter: () => {
              const total = Number(this.allMedicineCount?.totalProducts) || 0;
              return Number.isFinite(total) ? total.toFixed(0) : '0';
            },
            },
          },
        },
      },
      labels: [],
    };

    // Pie Chart and Bar Chart configurations remain unchanged
    this.pieChartOptions = {
      series: [],
      chart: {
        height: 280,
        type: 'pie',
      },
      labels: [],
      dataLabels: {
        enabled: true,
      },
      legend: {
        position: 'bottom',
      },
    };

    this.barChartOptions = {
      series: [],
      chart: {
        height: 280,
        type: 'bar',
      },
      xaxis: {
        categories: [],
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
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

    this.http.get(API_URL + ENDPOINTS.GET_ALL_MEDICINES_COUNT, { headers }).subscribe((res: any) => {
      this.allMedicineCount = res;
      this.updateRadialChart();
    });
    

    this.http.get(API_URL + ENDPOINTS.GET_COUNT_OF_MY_PRODUCTS, { headers }).subscribe((res: any) => {
      this.medicineCountOfMyProduct = res;
      this.updatePieChart();
    });

    this.http.get(API_URL + ENDPOINTS.GET_MY_ORDERS, { headers }).subscribe((res: any) => {
      this.myOrders = res;
      this.updateBarChart();
    });
  }

 updateRadialChart() {
    if (this.allMedicineCount) {
      const series = [
        Number(this.allMedicineCount.medicineCount) || 0,
        Number(this.allMedicineCount.otcCount) || 0,
        Number(this.allMedicineCount.totalProducts) || 0,
      ];
      console.log('updateRadialChart - series:', series); // Debug series values
      this.radialChartOptions = {
        ...this.radialChartOptions,
        series: series,
        labels: ['Prescribed Medicines', 'OTC Medicines', 'Total Products'],
      };
      console.log('Updating chart with options:', this.radialChartOptions); // Debug chart update
      if (this.radialChart) {
        this.radialChart.updateSeries(series, true); // Update series directly
        this.radialChart.updateOptions(
          {
            labels: ['Prescribed Medicines', 'OTC Medicines', 'Total Products'],
          },
          true,
          true
        );
      }
    } else {
      console.warn('allMedicineCount is undefined or null');
      const series = [0, 0, 0];
      this.radialChartOptions = {
        ...this.radialChartOptions,
        series: series,
        labels: ['Prescribed Medicines', 'OTC Medicines', 'Total Products'],
      };
      if (this.radialChart) {
        this.radialChart.updateSeries(series, true);
        this.radialChart.updateOptions(
          {
            labels: ['Prescribed Medicines', 'OTC Medicines', 'Total Products'],
          },
          true,
          true
        );
      }
    }
  }
  updatePieChart() {
    if (this.medicineCountOfMyProduct) {
      this.pieChartOptions = {
        ...this.pieChartOptions,
        series: [
          this.medicineCountOfMyProduct.totalProducts || 0,
          this.medicineCountOfMyProduct.availableProducts || 0,
          this.medicineCountOfMyProduct.unavailableProducts || 0,
          this.medicineCountOfMyProduct.discountedProducts || 0,
        ],
        labels: ['Total Products', 'Available Products', 'Unavailable Products', 'Discounted Products'],
      };
    }
  }

  updateBarChart() {
    if (this.myOrders) {
      this.barChartOptions = {
        ...this.barChartOptions,
        series: [
          {
            name: 'Order Counts',
            data: [
              this.myOrders.totalOrders || 0,
              this.myOrders.pendingOrders || 0,
              this.myOrders.confirmedOrders || 0,
              this.myOrders.shippedOrders || 0,
              this.myOrders.deliveredOrders || 0,
              this.myOrders.cancelledOrders || 0,
            ],
          },
        ],
        xaxis: {
          categories: [
            'Total Orders',
            'Pending Orders',
            'Confirmed Orders',
            'Shipped Orders',
            'Delivered Orders',
            'Cancelled Orders',
          ],
        },
      };
    }
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