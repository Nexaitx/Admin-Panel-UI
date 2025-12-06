import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, Input, SimpleChanges, ViewChild, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { API_URL, ENDPOINTS } from '../../../core/const';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { pushMessages$ } from '../../../core/services/push-notification';
import { Subscription } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';

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
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule
  ],
  templateUrl: './on-going-booking.html',
  styleUrl: './on-going-booking.scss'
})
export class OnGoingBooking implements OnDestroy {
  @Input() booking: any;
  http = inject(HttpClient);
  dataSource = new MatTableDataSource<any>;

  // Updated: Include all new fields in the columns to display
  columnsToDisplay = [
    'serial_no', 'booking_no', 'shift_start', 'shift_end',
    'login_time', 'login_selfie', 'staff_ip_address', 'staff_latitude', 'staff_longitude',
    'user_name', 'staff_name', 'shift_total_price', 'status', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isLoading = false;
  private _pushSub: Subscription | any;

  ngOnInit() {
    this.fetchData();
    try {
      this._pushSub = pushMessages$.subscribe((msg: any) => {
        const payload = msg && msg.payload ? msg.payload : msg;
        const title = payload?.notification?.title || payload?.data?.title || payload?.title || '';
        const t = String(title).toLowerCase();
        if (title || title === 'booking' || t.includes('booking') || t.includes('new')) {
          this.fetchData();
        }
      });
    } catch (e) {
      console.warn('Failed to subscribe to push messages', e);
    }
  }
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

  fetchData(): void {
    let endpoint = '';
    this.isLoading = true;

    const page = this.paginator ? this.paginator.pageIndex : 0;
    const size = this.paginator ? (this.paginator.pageSize || 10) : 10;
    let params = new HttpParams().set('page', String(page)).set('size', String(size))
    endpoint = `${ENDPOINTS.GET_ONGOING_BOOKINGS}?${params.toString()}`;

    if (endpoint) {
      this.http.get<any[]>(API_URL + endpoint).subscribe({
        next: (res: any) => {
          this.dataSource.data = Array.isArray(res.content) ? [...res.content] : res.content;
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

  ngOnDestroy(): void {
    try {
      if (this._pushSub && typeof this._pushSub.unsubscribe === 'function') {
        this._pushSub.unsubscribe();
      }
    } catch (e) { }
  }
}
