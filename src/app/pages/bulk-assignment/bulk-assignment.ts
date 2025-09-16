import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { API_URL, ENDPOINTS } from '../../core/const';

interface User {
  userId: string;
  userName: string;
  userPhoneNumber: string;
  staffs?: Staff[];
}

interface Staff {
  staffId: string;
  name: string;
  phoneNumber: string;
  category: string;
  status: 'ACCEPTED' | 'PENDING' | string;
}

@Component({
  selector: 'app-bulk-assignment',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './bulk-assignment.html',
  styleUrl: './bulk-assignment.scss'
})
export class BulkAssignment {
  http = inject(HttpClient);
  dataSource = new MatTableDataSource<User>([]);
  columnsToDisplay = ['userId', 'userName', 'userPhone'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  // Track expanded row by userId for stability when table recreates row objects
  expandedUserId: string | null = null;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.fetchData();
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      return (
        data.userName.toLowerCase().includes(filter) ||
        data.userPhoneNumber.toLowerCase().includes(filter)
      );
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  fetchData(): void {
    this.http.get<User[]>(API_URL + ENDPOINTS.GET_BULK_BOOKINGS).subscribe({
      next: (res: User[]) => {
        this.dataSource.data = res || [];
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      }
    });
  }

  isExpanded(element: User): boolean {
  return this.expandedUserId === element.userId;
  }

  toggle(element: User): void {
  this.expandedUserId = this.isExpanded(element) ? null : element.userId;
  }
}