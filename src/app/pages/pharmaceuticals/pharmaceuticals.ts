import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input'; // Added for search input
import { MatFormFieldModule } from '@angular/material/form-field'; // Added for search form field
import { API_URL, ENDPOINTS } from '../../core/const';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-pharmaceuticals',
  imports: [
    MatTabsModule,
    MatSelectModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule, // Added
    MatFormFieldModule, // Added
    CommonModule
  ],
  providers: [DatePipe],
  templateUrl: './pharmaceuticals.html',
  styleUrl: './pharmaceuticals.scss'
})
export class Pharmaceuticals implements AfterViewInit {
  processedColumns: string[] = [
    'orderId', 'orderNumber', 'userId', 'userName', 'userPhoneNumber',
    'userEmail', 'paymentStatus', 'orderDate', 'expectedDeliveryDate',
    'finalAmount', 'status', 'taxAmount', 'totalAmount', 'actions'
  ];

  cartColumns: string[] = [
    'id', 'productName', 'brandName', 'dosage', 'productForm',
    'quantity', 'price', 'totalPrice', 'userName', 'addedDate', 'actions'
  ];

  cartOrders = new MatTableDataSource<any>([]);
  processedOrders = new MatTableDataSource<any>([]);

  selectedOrderType: string = 'PENDING';
  activeTabIndex: number = 0;
  orderStatuses: any[] = [];

  @ViewChild('cartPaginator') cartPaginator!: MatPaginator;
  @ViewChild('processedPaginator') processedPaginator!: MatPaginator;
  @ViewChild('cartSort') cartSort!: MatSort;
  @ViewChild('processedSort') processedSort!: MatSort;

  http = inject(HttpClient);
  datePipe = inject(DatePipe);

  ngAfterViewInit() {
    this.cartOrders.paginator = this.cartPaginator;
    this.cartOrders.sort = this.cartSort;
    this.processedOrders.paginator = this.processedPaginator;
    this.processedOrders.sort = this.processedSort;

    this.loadCartOrders();
    this.onOrderTypeChange(this.selectedOrderType);
  }

  ngOnInit() {
    this.getOrderStatuses();
  }

  getOrderStatuses() {
    this.http.get(`${API_URL}${ENDPOINTS.GET_ORDER_STATUSES}`).subscribe((data: any) => {
      this.orderStatuses = data;
    });
  }

  onTabChange(event: any) {
    this.activeTabIndex = event.index;
    if (event.index === 0) {
      this.loadCartOrders();
    } else {
      this.onOrderTypeChange(this.selectedOrderType);
    }
  }

  loadCartOrders() {
    this.http.get(`${API_URL}${ENDPOINTS.GET_ORDERS_IN_CART}`).subscribe((data: any) => {
      this.cartOrders.data = data;
      console.log('Cart orders loaded:', data);
    }, error => {
      console.error('Error loading cart orders:', error);
    });
  }

  onOrderTypeChange(newType: string) {
    this.selectedOrderType = newType;
    console.log('Selected Order Type:', this.selectedOrderType);

    this.http.get(`${API_URL}${ENDPOINTS.GET_ORDERS_BY_STATUS}${newType}`).subscribe((data: any) => {
      this.processedOrders.data = data;
    });
  }

  onView(item: any) {
    console.log('View item', item);
  }

  formatAddedDate(date: string): string {
    return this.datePipe.transform(date, 'medium') || date;
  }

  // New filter methods
  applyCartFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.cartOrders.filter = filterValue.trim().toLowerCase();

    if (this.cartOrders.paginator) {
      this.cartOrders.paginator.firstPage();
    }
  }

  applyProcessedFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.processedOrders.filter = filterValue.trim().toLowerCase();

    if (this.processedOrders.paginator) {
      this.processedOrders.paginator.firstPage();
    }
  }
}