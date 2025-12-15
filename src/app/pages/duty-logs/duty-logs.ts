import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { API_URL, ENDPOINTS } from '../../core/const';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonTableComponent, ColumnDef } from '../../shared/common-table/common-table.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-duty-logs',
  imports: [CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatDialogModule,
    CommonTableComponent],
  templateUrl: './duty-logs.html',
  styleUrl: './duty-logs.scss'
})
export class DutyLogs {
  activeTab: string = 'previous';
  http = inject(HttpClient);
  dataSource = new MatTableDataSource<any>();
  dialog = inject(MatDialog);
  @ViewChild('viewDialog') viewDialog!: TemplateRef<any>;
  selectedStaff: any;
  isLoading: boolean = false;

  commonColumnsPreviouslyAssignedDuty: ColumnDef[] = [
    { key: 'bookingId', header: 'Booking&nbsp;Id', sortable: true },
    { key: 'userName', header: 'User&nbsp;Name' },
    { key: 'userPhoneNumber', header: 'User&nbsp;Phone&nbsp;Number' },
    { key: 'staffName', header: 'Staff&nbsp;Name', sortable: true },
    { key: 'staffPhoneNumber', header: 'Staff&nbsp;Phone&nbsp;Number' },
    { key: 'category', header: 'Category', sortable: true },
    { key: 'subCategory', header: 'Sub&nbsp;Category', sortable: true },
    { key: 'startDate', header: 'Start&nbsp;Date', sortable: true, type: 'date' },
    { key: 'endDate', header: 'End&nbsp;Date', sortable: true, type: 'date' },
    { key: 'dutyDate', header: 'Duty Date', sortable: true, type: 'date' },
    { key: 'loginTime', header: 'Login&nbsp;Time', sortable: true, type: 'time' },
    { key: 'logoutTime', header: 'Logout&nbsp;Time', sortable: true, type: 'time' },
    { key: 'loginSelfiePath', header: 'Login&nbsp;Selfie', type: 'action' },
    { key: 'logoutSelfiePath', header: 'Logout&nbsp;Selfie', type: 'action' },
    { key: 'amount', header: 'Amount', sortable: true, type: 'number' },
    { key: 'fineType', header: 'Fine&nbsp;Type', sortable: true },
    { key: 'payoutStatus', header: 'Payout&nbsp;Status', sortable: true },
    { key: 'status', header: 'Status', sortable: true },
  ];

  commonColumnsOngoingAssignedDuty: ColumnDef[] = [
    { key: 'staffId', header: 'Staff Id', sortable: true },
    { key: 'staffName', header: 'Staff Name', sortable: true },
    { key: 'userId', header: 'User Id' },
    { key: 'userName', header: 'User Name' },
    { key: 'dutyStart', header: 'Duty Start', sortable: true, type: 'date' },
    { key: 'dutyEnd', header: 'Duty End', sortable: true, type: 'date' }
  ];

  commonColumnsUpcomingAssignedDuty: ColumnDef[] = [
    { key: 'staffId', header: 'Staff Id', sortable: true },
    { key: 'staffName', header: 'Staff Name', sortable: true },
    { key: 'userId', header: 'User Id' },
    { key: 'userName', header: 'User Name' },
    { key: 'bookingDate', header: 'Booking Date', sortable: true, type: 'date' }
  ];

  constructor() { }

  ngOnInit(): void {
    this.fetchData();
  }

  onTabChange(index: number) {
    if (index === 0) {
      this.activeTab = 'previous';
      this.fetchData();
    } else if (index === 1) {
      this.activeTab = 'onGoing';
      this.fetchData();
    } else if (index === 2) {
      this.activeTab = 'upComing';
      this.fetchData();
    }
  }

  fetchData(): void {
    this.isLoading = true;
    let endpoint = '';
    if (this.activeTab === 'previous') {
      endpoint = ENDPOINTS.GET_BULK_PREVIOUS_BOOKINGS;
    } else if (this.activeTab === 'onGoing') {
      endpoint = ENDPOINTS.GET_BULK_ONGOING_BOOKINGS;
    } else if (this.activeTab === 'upComing') {
      endpoint = ENDPOINTS.GET_BULK_UPCOMING_BOOKINGS;
    }
    this.http.get<any[]>(API_URL + endpoint).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data.reverse() || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching duty logs:', err);
        this.dataSource.data = [];
        this.isLoading = false;
      }
    });
  }

  // handlers from common-table
  onRowView(row: any) {
    this.selectedStaff = row;
    this.onViewAction();
  }

  onViewAction() {
    this.dialog.open(this.viewDialog, { width: '900px', minWidth: '800px' });
  }

}