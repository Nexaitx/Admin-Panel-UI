import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { API_URL, ENDPOINTS } from '../../core/const';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { ColumnDef, CommonTableComponent } from '../../shared/common-table/common-table.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common'; // Import CommonModule for @if and ng-container

@Component({
  selector: 'app-override-duties',
  standalone: true,
  imports: [
    CommonTableComponent,
    MatDialogModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './override-duties.html',
  styleUrl: './override-duties.scss'
})
export class OverrideDuties {
  http = inject(HttpClient);
  dataSource = new MatTableDataSource<any>();
  dialog = inject(MatDialog);
  @ViewChild('viewDialog') viewDialog!: TemplateRef<any>;
  selectedRecord: any;

  columns: ColumnDef[] = [
    { key: 'bookingId', header: 'Booking&nbsp;ID' },
    { key: 'user', header: 'User', type: 'actionUser' },
    { key: 'staff', header: 'Staff', type: 'actionStaff' },
    { key: 'distanceKm', header: 'Distance&nbsp;Km' },
    { key: 'preferredTimeSlot', header: 'Preferred&nbsp;Time&nbsp;Slot' },
    { key: 'totalDays', header: 'Total&nbsp;Days' },
    { key: 'timeSlot', header: 'Time&nbsp;Slot' },
    { key: 'startDate', header: 'Start&nbsp;Date' },
    { key: 'endDate', header: 'End&nbsp;Date' },
    { key: 'createdAt', header: 'Created&nbsp;At' },
    { key: 'paymentStatus', header: 'Payment&nbsp;Status' },
    { key: 'status', header: 'Status' }
  ]

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.http.get(API_URL + ENDPOINTS.GET_OVERRIDE_DUTY).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.reverse();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

 onRowClick(event: any) {

  // 🔥 USER COLUMN CLICKED
  if (event.columnType === 'actionUser') {
    this.selectedRecord = {
      type: 'User',
      userId: event.row.userId,
      name: event.row.userName,
      email: event.row.userEmail,
      phone: event.row.userPhoneNumber,
      address: event.row.userAddress
    };
    this.onViewAction();
  }

  // 🔥 STAFF COLUMN CLICKED
  else if (event.columnType === 'actionStaff') {
    this.selectedRecord = {
      type: 'Staff',
      staffId: event.row.staffId,
      name: event.row.staffName,
      email: event.row.staffEmail,
      phone: event.row.staffPhoneNumber,
      address: event.row.staffAddress,
      category: event.row.category,
      subCategory: event.row.subCategory
    };
    this.onViewAction();
  }
}

  onViewAction() {
    this.dialog.open(this.viewDialog, { width: '900px', minWidth: '800px' });
  }

}