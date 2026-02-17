import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from "@angular/router";
import { interval, Subscription } from 'rxjs';

interface Order {
  orderId: string;
  medication: string;
  status: string;
  timerId?: number;
  timer?: string;
}

@Component({
  selector: 'app-pharma-dashboard',
  imports: [MatTableModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    CommonModule,
    RouterLink],
  templateUrl: './pharma-dashboard.html',
  styleUrl: './pharma-dashboard.scss',
})
export class PharmaDashboard implements OnInit, OnDestroy {
  displayedColumns = ['orderId', 'medication', 'status', 'timer', 'action']
  dataSource = new MatTableDataSource<Order>([]);
  ordersSignal = signal<Order[]>([]);
  private timerSubscription: Subscription | null = null;
  private readonly TIMER_DURATION = 165; // 2 minutes 45 seconds

  ngOnInit() {
    const initialOrders: Order[] = [
      { orderId: '1101', medication: 'Paracetamol', status: 'Pending', timerId: this.TIMER_DURATION, timer: this.formatTime(this.TIMER_DURATION) },
      { orderId: '1102', medication: 'Paracetamol', status: 'Ready', timerId: 0, timer: '' },
      { orderId: '1103', medication: 'Paracetamol', status: 'Ready', timerId: 0, timer: '' },
      { orderId: '1104', medication: 'Paracetamol', status: 'Pending', timerId: this.TIMER_DURATION, timer: this.formatTime(this.TIMER_DURATION) },
      { orderId: '1105', medication: 'Paracetamol', status: 'Pending', timerId: this.TIMER_DURATION, timer: this.formatTime(this.TIMER_DURATION) }
    ];
    
    this.ordersSignal.set(initialOrders);
    this.dataSource.data = initialOrders;
    this.startTimer();
  }

  private startTimer() {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.updateTimers();
    });
  }

  private updateTimers() {
    const updatedOrders = this.ordersSignal().map(order => {
      if (order.timerId && order.timerId > 0) {
        const newTimerId = order.timerId - 1;
        return {
          ...order,
          timerId: newTimerId,
          timer: this.formatTime(newTimerId)
        };
      }
      return order;
    });

    this.ordersSignal.set(updatedOrders);
    this.dataSource.data = updatedOrders;
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  onView(order: any) {
    console.log('Viewing order:', order.orderId);
  }

  onAccept(order: any) {
    console.log('Accepted:', order.orderId);
  }

  onReject(order: any) {
    console.log('Rejected:', order.orderId);
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
    console.log('Edit:', order.orderId);
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}