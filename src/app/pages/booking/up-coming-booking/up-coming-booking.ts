import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { API_URL, ENDPOINTS } from '../../../core/const';

@Component({
  selector: 'app-up-coming-booking',
  imports: [CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule],
  templateUrl: './up-coming-booking.html',
  styleUrl: './up-coming-booking.scss'
})
export class UpComingBooking {
  @Input() booking: any;
  http = inject(HttpClient);
  dataSource = new MatTableDataSource<any>();
  columnsToDisplay = ['id', 'loginSelfiePath', 'staffName', 'staffPhoneNumber', 'userName', 'userPhoneNumber', 'loginTime', 'logoutTime', 'latitude', 'longitude', 'status', 'action'];
  isLoading = false;

  ngOnInit() { }

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
