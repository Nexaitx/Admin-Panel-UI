import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { ColumnDef, CommonTableComponent } from '../../shared/common-table/common-table.component';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { API_URL, ENDPOINTS } from '../../core/const';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { pushMessages$ } from '../../core/services/push-notification';


@Component({
  selector: 'app-cancel-booking',
  imports: [
    CommonTableComponent,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './cancel-booking.html',
  styleUrl: './cancel-booking.scss'
})
export class CancelBooking {
  http = inject(HttpClient);
  router = inject(Router);
  dataSource = new MatTableDataSource<any>();
  dialog = inject(MatDialog);
  @ViewChild(CommonTableComponent) commonTable!: CommonTableComponent;
  @ViewChild('viewDialog') viewDialog!: TemplateRef<any>;
  selectedRecord: any;
  private _snackBar = inject(MatSnackBar);
  selectedAction: 'user' | 'staff' | 're-assign' | null = null;
  private _pushSub: any;

  columnsStaff: ColumnDef[] = [
    { key: 'bookingId', header: 'Booking&nbsp;ID' },
    { key: 'user', header: 'User', type: 'actionUser' },
    { key: 'staff', header: 'Staff', type: 'actionStaff' },
    { key: 'paymentAmount', header: 'Payment&nbsp;Amount' },
    { key: 'totalHours', header: 'Total&nbsp;Hours' },
    { key: 'totalDays', header: 'Total&nbsp;Days' },
    { key: 'timeSlot', header: 'Time&nbsp;Slot' },
    { key: 'hoursPerDay', header: 'Hours&nbsp;Per&nbsp;Day' },
    { key: 'startDate', header: 'Start&nbsp;Date' },
    { key: 'startTime', header: 'Start&nbsp;Time' },
    { key: 'endDate', header: 'End&nbsp;Date' },
    { key: 'endTime', header: 'End&nbsp;Time' },
    { key: 'createdAt', header: 'Created&nbsp;At' },
    { key: 'paymentStatus', header: 'Payment&nbsp;Status' },
    { key: 'action', header: 'Action', type: 'actionReAssign' },
  ];

  columnsClient: ColumnDef[] = [
    { key: 'bookingAmount', header: 'Booking&nbsp;Amount' },
    { key: 'bookingId', header: 'Booking&nbsp;Id' },
    { key: 'cancellationId', header: 'Cancellation&nbsp;Id' },
    { key: 'cancellationReason', header: 'Cancellation&nbsp;Reason' },
    { key: 'cancellationType', header: 'Cancellation&nbsp;Type' },
    { key: 'cancelledAt', header: 'Cancelled&nbsp;At', type: 'date' },
    { key: 'endDate', header: 'End&nbsp;Date' },
    { key: 'endTime', header: 'End&nbsp;Time' },
    { key: 'hoursBeforeStart', header: 'Hours&nbsp;Before&nbsp;Start' },
    { key: 'isEligibleForRefund', header: 'Is&nbsp;Eligible&nbsp;For&nbsp;Refund' },
    { key: 'refundAmount', header: 'Refund&nbsp;Amount' },
    { key: 'refundStatus', header: 'Refund&nbsp;Status' },
    { key: 'staffId', header: 'Staff&nbsp;ID' },
    { key: 'staffName', header: 'Staff&nbsp;Name' },
    { key: 'staffPhoneNumber', header: 'Staff&nbsp;Phone&nbsp;Number' },
    { key: 'startDate', header: 'Start&nbsp;Date' },
    { key: 'startTime', header: 'Start&nbsp;Time' },
    { key: 'userDisplayName', header: 'User&nbsp;Display&nbsp;Name' },
    { key: 'userName', header: 'User&nbsp;Name' },
    { key: 'userOrganizationName', header: 'User&nbsp;Organization&nbsp;Name' },
    { key: 'userPhoneNumber', header: 'User&nbsp;Phone&nbsp;Number' }
  ];

  ngOnInit(): void {
    this.fetchData();
    try {
      this._pushSub = pushMessages$.subscribe((msg: any) => {
        const payload = msg && msg.payload ? msg.payload : msg;
        const title = payload?.notification?.title || payload?.data?.title || payload?.title;
        if (title === 'SOS' || title === 'SOS alert') {
          this.fetchData();
        }
      });
    } catch (e) {
      console.warn('Failed to subscribe to push messages', e);
    }
  }

  ngOnDestroy() {
    try {
      if (this._pushSub && typeof this._pushSub.unsubscribe === 'function') {
        this._pushSub.unsubscribe();
      }
    } catch (e) { }
  }

  fetchData(): void {
    if (this.router.url.includes('cancel-staff-booking')) {
      const pageSize = this.commonTable?.paginator?.pageSize || 10;
      const params = {
        page: 0,
        size: pageSize,
        sortDirection: 'desc'
      }
      this.http.get(API_URL + ENDPOINTS.BOOKINGS_CANCELLED_BY_STAFF, { params }).subscribe((res: any) => {
        this.dataSource.data = res.data;
        this.commonTable?.resetPagination();

      });
    } else {
      this.http.get(API_URL + ENDPOINTS.BOOKINGS_CANCELLED_BY_USER).subscribe((res: any) => {
        this.dataSource.data = res.data.reverse();
      });
    }
  }

  onSubmit(): void {
    const bookingId = this.selectedRecord.bookingId;
    const url = `${API_URL}${ENDPOINTS.GET_REASSIGN_DUTY}${bookingId}/recreate-booking-direct`;

    this.http.post(url, {}).subscribe({
      next: (res: any) => {
        this._snackBar.open(`Duty is Re-Assigned to ${res.notifiedStaff?.length} Staffs`, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
      },
      error: (err) => {
        this._snackBar.open('Unable to Assign Duty', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      }
    });
  }

  onRowClick(event: any) {
    this.selectedRecord = event.row;
    if (event.columnType === 'actionUser') {
      this.selectedAction = 'user';
    } else if (event.columnType === 'actionStaff') {
      this.selectedAction = 'staff';
    } else if (event.columnType === 'actionReAssign') {
      this.selectedAction = 're-assign'
    }
    this.onViewAction();
  }

  onViewAction() {
    this.dialog.open(this.viewDialog, { width: '600px', minWidth: '600px' });
  }

}