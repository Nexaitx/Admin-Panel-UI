import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ENDPOINTS, PHARMA_API_URL } from '../../../core/const';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-orders',
  imports: [CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders {
  displayedColumns: string[] = ['orderId', 'customer', 'adminAddressDetails', 'distance', 'amount', 'status', 'actions'];
  dataSource = new MatTableDataSource([]);
  selectedStatus: string = 'DELIVERED';
  private http = inject(HttpClient);
  orderStatuses: any;

  ngOnInit() {
    this.fetchOrderStatuses();
    this.fetchBookings();
  }

  fetchOrderStatuses() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    this.http.get(PHARMA_API_URL + ENDPOINTS.ORDER_STATUSES, { headers }).subscribe((res: any) => {
      this.orderStatuses = res.statuses;
    });
  }

  fetchBookings() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    const options = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      }),
      params: {
        status: this.selectedStatus,
        page: '0',
        size: '100'
      }
    };
    this.http.get(PHARMA_API_URL + ENDPOINTS.ORDER_BY_STATUS, options).subscribe((res: any) => {
      this.dataSource.data = res.bookings;
    });

  }

  viewOrder(element: any) {
    console.log('View order', element);
  }

  printOrder() {
    // console.log('Print order', element);
    window.print()
  }
}
