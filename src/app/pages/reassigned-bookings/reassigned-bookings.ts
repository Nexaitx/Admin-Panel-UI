import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { ColumnDef, CommonTableComponent, PaginationEvent } from '../../shared/common-table/common-table.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { API_URL, ENDPOINTS } from '../../core/const';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reassigned-bookings',
  imports: [
    CommonTableComponent,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './reassigned-bookings.html',
  styleUrl: './reassigned-bookings.scss',
})
export class ReassignedBookings {
  http = inject(HttpClient);
  router = inject(Router);
  dataSource = new MatTableDataSource<any>();
  currentPageIndex = 0;
  currentPageSize = 10;
  totalElements = 0;
  selectedRecord: any;
  selectedBookingDetails: any[] = [];
  dialog = inject(MatDialog);
  selectedAction: 'oldStaff' | 'newStaff' | null = null;

  @ViewChild('bookingDetailsDialog') bookingDetailsDialog!: TemplateRef<any>;

  columns: ColumnDef[] = [
    { key: 'newBookingId', header: 'Booking&nbsp;ID' },
    { key: 'userId', header: 'User' },
    { key: 'userName', header: 'User&nbsp;Name' },
    { key: 'userEmail', header: 'User&nbsp;Email' },
    { key: 'userPhone', header: 'User&nbsp;Phone' },
    { key: 'oldStaff', header: 'Old&nbsp;Staff', type: 'actionUser' },
    { key: 'newStaff', header: 'New&nbsp;Staff', type: 'actionStaff' },
    { key: 'subCategory', header: 'Subcategory' },
    { key: 'timeSlot', header: 'Time&nbsp;Slot' },
    { key: 'createdAt', header: 'Booking&nbsp;Date' },
    { key: 'originalBookingCreatedAt', header: 'Original&nbsp;Booking&nbsp;Created&nbsp;At' },
    { key: 'originalBookingId', header: 'Original&nbsp;Booking&nbsp;ID' },
    { key: 'originalBookingStatus', header: 'Original&nbsp;Booking&nbsp;Status' },
    { key: 'price', header: 'Price' },
    { key: 'reassignTag', header: 'Reassign&nbsp;Tag' },
    { key: 'reassignedAt', header: 'Reassigned&nbsp;At', type: 'date' },
    { key: 'status', header: 'Status' },

  ];

  ngOnInit() {
    this.fetchData();
  }

  onRowView(row: any) {
    this.selectedRecord = row;
    if (row.columnType === 'actionUser') {
      this.selectedAction = 'oldStaff';
    }
    else if (row.columnType === 'actionStaff') {
      this.selectedAction = 'newStaff';
    }
    this.selectedBookingDetails = row.row?.newStaff;
    console.log(this.selectedBookingDetails);
    this.dialog.open(this.bookingDetailsDialog, { width: '900px', minWidth: '800px' });
  }

  onPageChange(event: PaginationEvent): void {
    this.currentPageIndex = event.pageIndex;
    this.currentPageSize = event.pageSize;
    this.fetchData();
  }

  fetchData() {
    const params = {
      page: this.currentPageIndex,
      size: this.currentPageSize,
      sortDirection: 'desc'
    }
    this.http.get(API_URL + ENDPOINTS.REASSIGNED_BOOKINGS, { params }).subscribe((res: any) => {
      this.dataSource.data = res.data;
      this.totalElements = res.totalItems;
    });
  }
}