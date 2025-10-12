import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-pharmaceuticals',
  imports: [MatSelectModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatPaginatorModule,
    MatSortModule

  ],
  templateUrl: './pharmaceuticals.html',
  styleUrl: './pharmaceuticals.scss'
})
export class Pharmaceuticals {
  displayedColumns: string[] = [
    'id', 'orderDate', 'customer', 'status', 'total', 'actions'
  ];
  dataSource = new MatTableDataSource<any>([]);

  selectedOrderType: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  allOrders: any[] = [];

  ngOnInit() {
    this.loadOrders();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadOrders() {
    // In real app, fetch from your API. Here is dummy data:
    this.allOrders = [
      { id: 1, orderDate: new Date('2025-10-01'), customer: 'Alice', status: 'past', total: 100.50 },
      { id: 2, orderDate: new Date('2025-10-05'), customer: 'Bob', status: 'in-process', total: 75.00 },
      { id: 3, orderDate: new Date('2025-10-07'), customer: 'in-cart', status: 'in-cart', total: 20.00 },
      { id: 4, orderDate: new Date('2025-09-28'), customer: 'Carol', status: 'returned', total: 50.25 },
      // ... more
    ];

    this.applyFilterAndRefresh();
  }

  onOrderTypeChange(newType: string) {
    this.selectedOrderType = newType;
    this.applyFilterAndRefresh();
  }

  applyFilterAndRefresh() {
    let filtered = this.allOrders;
    if (this.selectedOrderType) {
      filtered = filtered.filter(o => o.status === this.selectedOrderType);
    }
    this.dataSource.data = filtered;
  }

  refreshData() {
    // re-fetch / re-load
    this.loadOrders();
  }

  onEdit(order: any) {
    console.log('Edit', order);
  }

  onDelete(order: any) {
    console.log('Delete', order);
    this.allOrders = this.allOrders.filter(o => o.id !== order.id);
    this.applyFilterAndRefresh();
  }


}