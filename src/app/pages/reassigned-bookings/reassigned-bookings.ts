import { Component, inject } from '@angular/core';
import { ColumnDef, CommonTableComponent } from '../../shared/common-table/common-table.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-reassigned-bookings',
  imports: [
    CommonTableComponent
  ],
  templateUrl: './reassigned-bookings.html',
  styleUrl: './reassigned-bookings.scss',
})
export class ReassignedBookings {
  http = inject(HttpClient);
  router = inject(Router);
  dataSource = new MatTableDataSource<any>();

  columns: ColumnDef[]= [
    { key: 'bookingId', header: 'Booking&nbsp;ID' },
    { key: 'user', header: 'User' },
    { key: 'staff', header: 'Staff' },
  ]
}
