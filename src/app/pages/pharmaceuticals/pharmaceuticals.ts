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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    MatCardModule,
    MatListModule,
    MatSidenavModule
  ],
  providers: [DatePipe],
  templateUrl: './pharmaceuticals.html',
  styleUrl: './pharmaceuticals.scss'
})
export class Pharmaceuticals implements AfterViewInit {
  processedColumns: string[] = [
    's_no',
    'orderNumber', 'orderItems', 'orderValue', 'status', 'userName', 'userPhone',
    'userEmail', 'paymentStatus', 'orderDate', 'expectedDeliveryDate',
    'packingStatus', 'dispatchStatus', 'orderStatus', 'deliveryStatus', 'returnStatus',
    'returnConfirmationStatus',
    // 'generic', 'ethical', 'otc',
    // 'finalAmount',  'taxAmount', 'totalAmount', 'actions' 
  ];

  cartColumns: string[] = [
    's_no',
    'id', 'productName', 'productType', 'adminName', 'adminEmail', 'productForm',
    'quantity', 'price', 'totalPrice', 'userName', 'userEmail', 'addedDate', 'actions'
  ];

  cartOrders = new MatTableDataSource<any>([]);
  processedOrders = new MatTableDataSource<any>([]);

  selectedOrderType: string = 'PENDING';
  selectedItem: any = null;
  activeTabIndex: number = 0;
  orderStatuses: any[] = [];
  isDrawerOpen = false;
  user = JSON.parse(localStorage.getItem('userProfile') || '{}');

  @ViewChild('drawer') drawer!: MatDrawer;
  @ViewChild('cartPaginator') cartPaginator!: MatPaginator;
  @ViewChild('processedPaginator') processedPaginator!: MatPaginator;
  @ViewChild('cartSort') cartSort!: MatSort;
  @ViewChild('processedSort') processedSort!: MatSort;
  snackBar = inject(MatSnackBar);


  http = inject(HttpClient);
  datePipe = inject(DatePipe);

  packingStatuses = [
    { value: 'PENDING', viewValue: 'Pending' },
    { value: 'PACKED', viewValue: 'Packed' },
  ];

  dispatchStatuses = [
    { value: 'PENDING', viewValue: 'Pending' },
    { value: 'DISPATCHED', viewValue: 'Dispatched' },
  ];

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

  onPackingStatusChange(item: any) {
    // Call your service/API to update status e.g.:
    // this.http.put(`${API_URL}${ENDPOINTS.UPDATE_PRESCRIPTION_STATUS}${item.prescriptionId}/packing-status`, { packingStatus: item.packingStatus }, { headers }).subscribe(
    //   res => {
    this.snackBar.open('Packing status updated successfully', 'Close', { duration: 3000, panelClass: ['snackbar-success'] });
    // },
    // err => {
    //   this.snackBar.open('Failed to update packing status','Close',{duration:3000, panelClass:['snackbar-error']});
    // }
    // );
  }

  onDispatchStatusChange(item: any) {
    // Call your service/API to update status e.g.:
    // this.http.put(`${API_URL}${ENDPOINTS.UPDATE_PRESCRIPTION_STATUS}${item.prescriptionId}/packing-status`, { packingStatus: item.packingStatus }, { headers }).subscribe(
    //   res => {
    this.snackBar.open('Dispatch status updated successfully', 'Close', { duration: 3000, panelClass: ['snackbar-success'] });
    // },
    // err => {
    //   this.snackBar.open('Failed to update packing status','Close',{duration:3000, panelClass:['snackbar-error']});
    // }
    // );
  }


  getOrderStatuses() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    if (!this.user.pan) {
      this.http.get(`${API_URL}${ENDPOINTS.GET_ORDER_STATUSES}`, { headers }).subscribe((data: any) => {
        this.orderStatuses = data.statuses;
      });
    }
    else {
      this.http.get(`${API_URL}${ENDPOINTS.GET_ALL_ORDER_STATUS}`, { headers }).subscribe((data: any) => {
        this.orderStatuses = data.statuses;
      });
    }
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
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    if (!this.user.pan) {
      this.http.get(`${API_URL}${ENDPOINTS.GET_ORDERS_IN_CART}`, { headers }).subscribe((data: any) => {
        this.cartOrders.data = data.cartItems;
      }, error => {
        console.error('Error loading cart orders:', error);
      });
    }
    else {
      this.http.get(API_URL + ENDPOINTS.GET_ALL_CART).subscribe((data: any) => {
        this.cartOrders.data = data;
      }, error => {
        console.error('Error loading cart orders:', error);
      });
    }
  }

  onOrderTypeChange(newType: string) {
    this.selectedOrderType = newType;
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    if (!this.user.pan) {
      const params = { orderStatus: newType };
      this.http.get(API_URL + ENDPOINTS.GET_ORDERS_BY_STATUS, { params, headers }).subscribe((data: any) => {
        this.processedOrders.data = data.map((item: any) => ({
          ...item,
          packingStatus: item.packingStatus || 'PENDING'
        }));
      });
    }
    else {
      this.selectedOrderType = newType;
      const url = `${API_URL}${ENDPOINTS.GET_ORDERS_BY_STATUS_ADMIN}${encodeURIComponent(newType)}`;
      this.http.get(url)
        .subscribe((data: any) => {
          this.processedOrders.data = data.map((item: any) => ({
            ...item,
            packingStatus: item.packingStatus || 'PENDING'
          }));
        });
    }
  }

  onView(item: any) {
    this.selectedItem = { ...item }; // Create a copy to avoid reference issues

    // If it's a processed order and doesn't have orderItems, fetch detailed data
    if (!this.isCartItem() && (!item.orderItems || item.orderItems.length === 0)) {
      this.loadOrderDetails(item.orderId || item.id);
    }

    this.isDrawerOpen = true;
    console.log('Opening drawer for item:', this.selectedItem);
  }
  loadOrderDetails(orderId: string) {
    // Replace with your actual API endpoint to get order details
    this.http.get(`${API_URL}/orders/${orderId}/details`).subscribe({
      next: (detailedOrder: any) => {
        this.selectedItem = { ...this.selectedItem, ...detailedOrder };
      },
      error: (error) => {
        console.error('Error loading order details:', error);
        // Still open drawer with available data
      }
    });
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    this.selectedItem = null;
  }

  formatAddedDate(date: string): string {
    return this.datePipe.transform(date, 'medium') || date;
  }

  isCartItem() {
    return this.activeTabIndex === 0;
  }

  onDrawerClosed() {
    this.selectedItem = null;
  }

  getDrawerTitle() {
    return this.isCartItem() ? 'Cart Item Details' : 'Order Details';
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