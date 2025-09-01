import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, SimpleChanges, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { API_URL, ENDPOINTS } from '../../../core/const';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-on-going-booking',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule
  ],
  templateUrl: './on-going-booking.html',
  styleUrl: './on-going-booking.scss'
})
export class OnGoingBooking {
  @Input() booking: any;
  http = inject(HttpClient);
  dataSource = new MatTableDataSource<any>;

  // Updated: Include all new fields in the columns to display
  columnsToDisplay = ['id', 'loginSelfiePath', 'staffName', 'staffPhoneNumber', 'userName', 'userPhoneNumber', 'loginTime', 'logoutTime', 'latitude', 'longitude', 'status', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isLoading = false;

  ngOnInit() { }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['booking'] && changes['booking'].currentValue) {
      this.fetchData();
    }
  }

  fetchData(): void {
    let endpoint = '';
    this.isLoading = true;

    if (this.booking === 'previous') {
      endpoint = ENDPOINTS.GET_PREVIOUS_BOOKINGS;
    } else if (this.booking === 'onGoing') {
      endpoint = ENDPOINTS.GET_ONGOING_BOOKINGS;
    } else if (this.booking === 'upComing') {
      endpoint = ENDPOINTS.GET_UPCOMING_BOOKINGS;
    }

    if (endpoint) {
      this.http.get<any[]>(API_URL + endpoint).subscribe({
        next: (res: any[]) => {
          this.dataSource.data = res;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching bookings:', err);
          this.dataSource.data = [];
          this.isLoading = false;
        }
      });
    }
  }

  // Function to clean the URL path
  getSelfieUrl(path: string): string {
    return path.replace('uploads/selfies/', '');
  }

  // Function to open image in a new tab
  openImage(url: string): void {
    window.open(url, '_blank');
  }
}
