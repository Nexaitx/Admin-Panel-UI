import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { ColumnDef, CommonTableComponent } from '../../shared/common-table/common-table.component';
import { API_URL, ENDPOINTS } from '../../core/const';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-booking-payments',
  imports: [CommonModule,
    CommonTableComponent,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule],
  templateUrl: './booking-payments.html',
  styleUrl: './booking-payments.scss',
})
export class BookingPayments {
  http = inject(HttpClient);
  dialog = inject(MatDialog);
  dataSource = new MatTableDataSource<any>();
  @ViewChild(CommonTableComponent) commonTable!: CommonTableComponent;
  selectedRecord: any;
  selectedBookingDetails: any[] = [];
  statuses: any[] = [];
  selectedStatus: string | null = null;
  isLoading: boolean = false;
  private allBookingDetailsColumns: ColumnDef[] = [
    { key: 'bookingId', header: 'Booking Id' },
    { key: 'bookingPrice', header: 'Booking Price' },
    { key: 'calculationDetails', header: 'Calculation Details' },
    { key: 'calculationType', header: 'Calculation Type' },
    { key: 'category', header: 'Category' },
    { key: 'distanceKm', header: 'Distance(KM)' },
    { key: 'duties', header: 'Duties' },
    { key: 'endDate', header: 'End Date' },
    { key: 'hoursPerDay', header: 'Hours per Day' },
    { key: 'preferredTimeSlot', header: 'Preferred Time Slot' },
    { key: 'pricePackageUsed', header: 'Price Package Used' },
    { key: 'rating', header: 'Rating' },
    { key: 'staffId', header: 'Staff Id' },
    { key: 'staffName', header: 'Staff Name' },
    { key: 'staffPhone', header: 'Staff Phone' },
    { key: 'staffEmail', header: 'Staff Email' },
    { key: 'staffAddress', header: 'Staff Address' },
    { key: 'startDate', header: 'Start Date' },
    { key: 'status', header: 'Status' },
    { key: 'subCategory', header: 'Sub Category' },
    { key: 'timeSlot', header: 'Timeslot' },
    { key: 'totalDays', header: 'Total Days' },
    { key: 'totalHours', header: 'Total Hours' },
    { key: 'userAddress', header: 'User address' },
  ];
  bookingDetailsColumns: ColumnDef[] = [...this.allBookingDetailsColumns];
  bookingDetailsColumnKeys: string[] = this.bookingDetailsColumns.map(c => c.key);
  @ViewChild('bookingDetailsDialog') bookingDetailsDialog!: TemplateRef<any>;

  commonColumns: ColumnDef[] = [
    { key: 'paymentId', header: 'Payment&nbsp;Id', sortable: true },
    { key: 'totalAmount', header: 'Total&nbsp;Amount', sortable: true },
    { key: 'totalBookings', header: 'Total&nbsp;Bookings', sortable: true },
    { key: 'razorpayOrderId', header: 'RazorPay&nbsp;Order&nbsp;Id', sortable: true },
    { key: 'razorpayPaymentId', header: 'RazorPay&nbsp;Payment&nbsp;Id', sortable: true },
    { key: 'paymentDate', header: 'Payment&nbsp;Date', sortable: true, type: 'date' },
    { key: 'userId', header: 'User&nbsp;Id', sortable: true },
    { key: 'userName', header: 'User&nbsp;Name', sortable: true },
    { key: 'userPhone', header: 'User&nbsp;Phone&nbsp;Number', sortable: true },
    { key: 'userEmail', header: 'User&nbsp;Email', sortable: true },
    { key: 'status', header: 'Status', sortable: true },
    { key: 'viewBookings', header: 'Bookings', type: 'action', sortable: false }
  ];

  ngOnInit(): void {
    this.getPaymentStatuses();
    this.fetchData();
  }

  getPaymentStatuses() {
    this.http.get(API_URL + ENDPOINTS.GET_PAYMENT_STATUSES).subscribe((res: any) => {
      this.statuses = res;
    })
  }

  filterData(status: string | null) {
    this.selectedStatus = status;
    const pageSize = this.commonTable?.paginator?.pageSize || 10;
    const payload = {
      status: status || null,
      page: 0,
      size: pageSize
    }
    this.http.post(API_URL + ENDPOINTS.GET_PAYMENT_BY_FILTER, payload).subscribe((res: any) => {
      this.dataSource.data = res.content;
      this.commonTable?.resetPagination();
    })
  }

  fetchData(): void {
    this.isLoading = true;
    this.http.get(API_URL + ENDPOINTS.GET_BOOKING_PAYMENTS).subscribe((res: any) => {
      this.dataSource.data = res;
      this.isLoading = false;
    });
  }

  onRowView(row: any) {
    this.selectedRecord = row;
    this.selectedBookingDetails = row.row?.bookingDetails;
    this.dialog.open(this.bookingDetailsDialog, { width: '900px', minWidth: '800px' });
  }

  onRowDelete(row: any) {
    console.log('Delete row requested', row);
  }

  onRowSave(payload: any) {
    this.fetchData();
  }

  onViewAction() {
  }
}
