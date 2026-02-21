import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

interface OrderRecord {
  orderId: string;
  customer: string;
  medication: string;
  date: string;
  amount: number;
  status: 'Accepted' | 'Delivered' | 'Missed' | 'Rejected';
}
@Component({
  selector: 'app-orders',
  imports: [CommonModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders {
  displayedColumns: string[] = ['orderId', 'customer', 'medication', 'amount', 'date', 'actions'];

  // Data sources for each tab
  acceptedSource = new MatTableDataSource<OrderRecord>([]);
  deliveredSource = new MatTableDataSource<OrderRecord>([]);
  missedSource = new MatTableDataSource<OrderRecord>([]);
  rejectedSource = new MatTableDataSource<OrderRecord>([]);

  ngOnInit() {
    const mockData: OrderRecord[] = [
      { orderId: 'ORD-001', customer: 'John Doe', medication: 'Amoxicillin', amount: 450, date: '2023-10-27', status: 'Accepted' },
      { orderId: 'ORD-002', customer: 'Jane Smith', medication: 'Paracetamol', amount: 120, date: '2023-10-26', status: 'Delivered' },
      { orderId: 'ORD-003', customer: 'Mike Ross', medication: 'Lipitor', amount: 890, date: '2023-10-25', status: 'Missed' },
      { orderId: 'ORD-004', customer: 'Harvey Specter', medication: 'Nexium', amount: 1100, date: '2023-10-24', status: 'Rejected' },
    ];

    this.acceptedSource.data = mockData.filter(o => o.status === 'Accepted');
    this.deliveredSource.data = mockData.filter(o => o.status === 'Delivered');
    this.missedSource.data = mockData.filter(o => o.status === 'Missed');
    this.rejectedSource.data = mockData.filter(o => o.status === 'Rejected');
  }
}
