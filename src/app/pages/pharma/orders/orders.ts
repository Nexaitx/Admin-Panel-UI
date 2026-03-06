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
  displayedColumns: string[] = ['orderId', 'customer', 'distance', 'amount', 'status', 'actions'];
  dataSource = new MatTableDataSource([]);
  selectedStatus: string = 'ACCEPTED';
  private http = inject(HttpClient);

  ngOnInit() {
    this.fetchBookings();
  }

  fetchBookings() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    this.http.get(PHARMA_API_URL + ENDPOINTS.GET_ALL_RUNNING_ORDERS, { headers }).subscribe((res: any) => {
      this.dataSource.data = res;
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
