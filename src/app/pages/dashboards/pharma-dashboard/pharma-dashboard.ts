import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from "@angular/router";
import { interval, Subscription } from 'rxjs';
import { ENDPOINTS, PHARMA_API_URL } from '../../../core/const';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pharma-dashboard',
  imports: [MatTableModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    CommonModule,
    RouterLink,
    MatTooltipModule],
  templateUrl: './pharma-dashboard.html',
  styleUrl: './pharma-dashboard.scss',
})
export class PharmaDashboard implements OnInit, OnDestroy {
  displayedColumns = ['orderId', 'actions'];
  dataSourceRunning = new MatTableDataSource([]);
  dataSourceNew = new MatTableDataSource([]);
  runningOrdersSignal = signal([]);
  newOrdersSignal = signal([]);
  private timerSubscription: Subscription | null = null;
  private readonly NEW_ORDER_TIME = 60;
  private readonly RUNNING_ORDER_TIME = 120;
  private readonly EXTENSION_TIME = 60;
  private readonly MAX_EXTENSIONS = 2;
  private router = inject(Router)
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);
  accepted: any;


  ngOnInit() {
    this.getOverView();
    this.getRunningOrders();
    this.getNewOrders();
  }
  onExtend(order: any) {
    if (order.extensionCount >= this.MAX_EXTENSIONS) return;

    const updated = this.runningOrdersSignal().map((o: any) => {
      if (o.orderId === order.orderId) {
        const extraTime = (o.timerId || 0) + this.EXTENSION_TIME;
        return {
          ...o,
          timerId: extraTime,
          timer: this.formatTime(extraTime),
          extensionCount: o.extensionCount + 1 // Increment counter
        };
      }
      return o;
    });
    this.updateData(updated);
  }

  private updateData(orders: any) {
    this.runningOrdersSignal.set(orders);
    this.dataSourceRunning.data = orders;
  }
  onAccept(order: any) {
    // 1. Remove from New Orders
    const updatedNew = this.newOrdersSignal().filter((o: any) => o.orderId !== order.orderId);
    this.newOrdersSignal.set(updatedNew);
    this.dataSourceNew.data = updatedNew;

    // 2. Add to Running Orders with 2-minute timer
    const acceptedOrder = {
      ...order,
      status: 'ACCEPTED',
      timerId: this.RUNNING_ORDER_TIME,
      timer: this.formatTime(this.RUNNING_ORDER_TIME),
      extensionCount: 0
    };

    const updatedRunning: any = [...this.runningOrdersSignal(), acceptedOrder];
    this.runningOrdersSignal.set(updatedRunning);
    this.dataSourceRunning.data = updatedRunning;

    // Optional: Navigate or show success
    this.snackBar.open('Order Accepted', 'Close', { duration: 2000 });
  }

  private startTimer() {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.updateTimers();
    });
  }

  private updateTimers() {
    // Helper to countdown a list of orders
    const countdown = (orders: any) => orders.map((order: any) => {
      if (order.timerId && order.timerId > 0) {
        const newTime = order.timerId - 1;
        return { ...order, timerId: newTime, timer: this.formatTime(newTime) };
      }
      return order;
    });

    // Update Running Orders
    const updatedRunning = countdown(this.runningOrdersSignal());
    this.runningOrdersSignal.set(updatedRunning);
    this.dataSourceRunning.data = updatedRunning;

    // Update New Orders
    const updatedNew = countdown(this.newOrdersSignal());
    this.newOrdersSignal.set(updatedNew);
    this.dataSourceNew.data = updatedNew;
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  onNewView(order: any) {
    console.log('Viewing order:', order.orderId);
    this.router.navigate(['/app/view-new-order']);
  }

  onView(order: any) {
    console.log('Viewing order:', order.orderId);
    this.router.navigate(['/app/view-order', order.orderId]);
  }

  onReject(order: any) {
    console.log('Rejected:', order.orderId);
    this.router.navigate(['/app/new-order']);
  }

  onReturned(order: any) {
    console.log('Returned:', order.orderId);
  }

  onDelivered(order: any) {
    console.log('Delivered:', order.orderId);
  }

  onHandover(order: any) {
    console.log('Handover:', order.orderId);
  }

  onEdit(order: any) {
    this.router.navigate(['/app/edit-order', order.orderId])
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
  getRunningOrders() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(PHARMA_API_URL + ENDPOINTS.GET_ALL_RUNNING_ORDERS, { headers }).subscribe({
      next: (res: any) => {
        const items = Array.isArray(res) ? res : (res?.data || res?.bookingRecords || []);
        const mapped: any = items.map((item: any) => ({
          orderId: item.bookingId || 'N/A',
          status: 'ACCEPTED',
          // Force 120s (2 min) if API doesn't provide remaining_seconds
          timerId: typeof item.remaining_seconds === 'number' ? item.remaining_seconds : this.RUNNING_ORDER_TIME,
          timer: this.formatTime(typeof item.remaining_seconds === 'number' ? item.remaining_seconds : this.RUNNING_ORDER_TIME),
          extensionCount: item.extension_count || 0
        }));

        this.runningOrdersSignal.set(mapped);
        this.dataSourceRunning.data = mapped;
        this.checkTimer();
      }
    });
  }

  getNewOrders() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(PHARMA_API_URL + ENDPOINTS.GET_ALL_NEW_ORDERS, { headers }).subscribe({
      next: (res: any) => {
        const items = Array.isArray(res) ? res : (res?.data || []);
        const mapped = items.map((item: any) => ({
          orderId: item.bookingId || 'N/A',
          timerId: typeof item.remaining_seconds === 'number' ? item.remaining_seconds : this.NEW_ORDER_TIME,
          timer: this.formatTime(typeof item.remaining_seconds === 'number' ? item.remaining_seconds : this.NEW_ORDER_TIME),
          extensionCount: 0
        }));

        this.newOrdersSignal.set(mapped);
        this.dataSourceNew.data = mapped;
        console.log(this.dataSourceNew.data);
        this.checkTimer();
      }
    });
  }

  private checkTimer() {
    if (!this.timerSubscription || this.timerSubscription.closed) {
      this.startTimer();
    }
  }

  getOverView() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get(`${PHARMA_API_URL}${ENDPOINTS.GET_COUNT_OF_ACCEPTED_SUMMARY}`, {headers}).subscribe((res: any) => {
      this.accepted = res;
    })
  }
}