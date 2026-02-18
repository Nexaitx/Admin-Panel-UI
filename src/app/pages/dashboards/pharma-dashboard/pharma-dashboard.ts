import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from "@angular/router";
import { interval, Subscription } from 'rxjs';

interface Order {
  orderId: string;
  medication: string;
  status: 'Pending' | 'Ready' | 'Accepted'; // Added specific statuses
  timerId?: number;
  timer?: string;
  extensionCount: number; // Track if the 1-min extension was used
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
    RouterLink,
    MatTooltipModule],
  templateUrl: './pharma-dashboard.html',
  styleUrl: './pharma-dashboard.scss',
})
export class PharmaDashboard implements OnInit, OnDestroy {
  displayedColumns = ['orderId', 'actions'];
  dataSource = new MatTableDataSource<Order>([]);
  ordersSignal = signal<Order[]>([]);
  private timerSubscription: Subscription | null = null;
  private readonly NEW_ORDER_TIME = 60;      // 1 Minute
  private readonly RUNNING_ORDER_TIME = 120; // 2 Minutes
  private readonly EXTENSION_TIME = 60;     // 1 Minute extension
  private readonly MAX_EXTENSIONS = 3;

  ngOnInit() {
    const initialOrders: Order[] = [
      {
        orderId: '1101',
        medication: 'Paracetamol',
        status: 'Pending',
        timerId: this.NEW_ORDER_TIME,
        timer: this.formatTime(this.NEW_ORDER_TIME),
        extensionCount: 0 // Initialized for new orders
      },
      {
        orderId: '1102',
        medication: 'Amoxicillin',
        status: 'Accepted',
        timerId: this.RUNNING_ORDER_TIME,
        timer: this.formatTime(this.RUNNING_ORDER_TIME),
        extensionCount: 0 // Pharmacist can extend this 3 times
      },
      {
        orderId: '1103',
        medication: 'Ibuprofen',
        status: 'Accepted',
        timerId: 45, // Example: Order nearing expiration
        timer: this.formatTime(45),
        extensionCount: 2 // Example: Already extended twice
      }
    ];

    this.ordersSignal.set(initialOrders);
    this.dataSource.data = initialOrders;
    this.startTimer();
  }
  onExtend(order: Order) {
    if (order.extensionCount >= this.MAX_EXTENSIONS) return;

    const updated = this.ordersSignal().map(o => {
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

  private updateData(orders: Order[]) {
    this.ordersSignal.set(orders);
    this.dataSource.data = orders;
  }
  onAccept(order: Order) {
  const updated = this.ordersSignal().map(o => {
    if (o.orderId === order.orderId) {
      return { 
        ...o, 
        status: 'Accepted' as const, 
        timerId: this.RUNNING_ORDER_TIME, 
        timer: this.formatTime(this.RUNNING_ORDER_TIME),
        extensionCount: 0 // Resetting count for the new phase
      };
    }
    return o;
  });
  this.updateData(updated);
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