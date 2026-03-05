import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ENDPOINTS, PHARMA_API_URL } from '../../../core/const';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-order-view',
  imports: [MatButtonModule,
    MatTableModule,
    CommonModule
  ],
  templateUrl: './new-order-view.html',
  styleUrl: './new-order-view.scss',
})
export class NewOrderView {
  detailColumns: string[] = ['medicine', 'qty', 'price', 'offerPrice', 'availableQuantity', 'quantity', 'productType'];
  private route = inject(ActivatedRoute)
  orderId = this.route.snapshot.paramMap.get('id');
  private http = inject(HttpClient);
  detailsSource = new MatTableDataSource([]);
  private snackBar = inject(MatSnackBar);
  result: any;

  ngOnInit() {
    this.getNewOrderById();
  }

  getNewOrderById() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    this.http.get(PHARMA_API_URL + ENDPOINTS.GET_NEW_BOOKING_BY_ID + this.orderId + '/items', { headers }).subscribe((res: any) => {
      this.result = res;
      this.detailsSource.data = res.items;
    })
  }

  onReject() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post(PHARMA_API_URL + ENDPOINTS.ACCEPT_NEW_BOOKING + this.orderId + '/reject', {}, { headers }).subscribe((res: any) => {
      console.log('rejected order successfully');
    })
  }

  onAccept() {
    // 1. Remove from New Orders
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post(`${PHARMA_API_URL}${ENDPOINTS.ACCEPT_NEW_BOOKING}${this.orderId}${'/accept'}`, {}, { headers }).subscribe((res: any) => {
      this.snackBar.open('Order Accepted', 'Close', { duration: 2000 });
    });
  }
}
