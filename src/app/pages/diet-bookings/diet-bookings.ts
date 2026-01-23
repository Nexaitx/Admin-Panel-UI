import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { API_URL, ENDPOINTS } from '../../core/const';
import { HttpClient } from '@angular/common/http';
import { ColumnDef, CommonTableComponent, PaginationEvent } from '../../shared/common-table/common-table.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-diet-bookings',
  imports: [
    CommonTableComponent,
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule
  ],

  templateUrl: './diet-bookings.html',
  styleUrl: './diet-bookings.scss'
})
export class DietBookings {
  http = inject(HttpClient);
  selectedRecord: any;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(CommonTableComponent) commonTable!: CommonTableComponent;
  dialog = inject(MatDialog);
  @ViewChild('viewDialog') viewDialog!: TemplateRef<any>;
  statuses: any[] = ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'];
  selectedStatus: any;
  currentPageIndex = 0;
  currentPageSize = 10;
  totalElements = 0;

  columns: ColumnDef[] = [
    { key: 'userId', header: 'User&nbsp;ID' },
    { key: 'userName', header: 'User&nbsp;Name' },
    { key: 'email', header: 'Email' },
    { key: 'phoneNumber', header: 'Phone&nbsp;Number' },
    { key: 'activeSubscriptionsCount', header: 'Active&nbsp;Subscriptions&nbsp;Count' },
    { key: 'totalSubscriptions', header: 'Total&nbsp;Subscriptions' },
    { key: 'action', header: 'Subscriptions', type: 'action' }
  ];

  subscriptionColumns: ColumnDef[] = [
    { key: 'subscriptionId', header: 'Subscription ID' },
    { key: 'title', header: 'Title' },
    { key: 'tenure', header: 'Tenure' },
    { key: 'planId', header: 'Plan ID' },
    { key: 'planType', header: 'Plan Type' },
    { key: 'amountPaid', header: 'Amount Paid' },
    { key: 'transactionId', header: 'Transaction ID' },
    { key: 'startDate', header: 'Start Date', type: 'date' },
    { key: 'endDate', header: 'End Date', type: 'date' },
    { key: 'paymentStatus', header: 'Payment Status' },
    { key: 'price', header: 'Price' },
    { key: 'amountPaid', header: 'Amount Paid' },
    { key: 'active', header: 'Status' }
  ]

  ngOnInit(): void {
    this.getDietUsers();
  }

  onRowClick(event: any) {
    this.selectedRecord = event.row.subscriptions;
    this.onViewAction();
  }

  onViewAction() {
    this.dialog.open(this.viewDialog, { width: '700px', minWidth: '700px' });
  }

  onPageChange(event: PaginationEvent): void {
    this.currentPageIndex = event.pageIndex;
    this.currentPageSize = event.pageSize;
    this.getDietUsers();
  }
  getDietUsers() {
    const pageSize = this.commonTable?.paginator?.pageSize || 10;
    const params = {
      page: this.currentPageIndex,
      size: this.currentPageSize,
      sortDir: 'desc'
    }
    this.http.get(API_URL + ENDPOINTS.GET_DIET_USERS, { params }).subscribe((res: any) => {
      this.dataSource.data = res.content;
       this.totalElements = res.totalElements || 0;
    })
  }

  filterData(status: string | null) {
    this.selectedStatus = status;

    // Create params object
    const params: any = {
      page: this.currentPageIndex,
      size: this.currentPageSize,
      sortDir: 'desc'
    };
    this.http.get(API_URL + ENDPOINTS.GET_DIET_USERS_BY_PAYMENT_STATUS + status, { params })
      .subscribe((res: any) => {
        this.dataSource.data = res.content;
        this.totalElements = res.totalElements || 0;
      });
  }

}
