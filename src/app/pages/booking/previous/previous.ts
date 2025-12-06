import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, Input, SimpleChanges, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { API_URL, ENDPOINTS } from '../../../core/const';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { pushMessages$ } from '../../../core/services/push-notification';
import { Subscription } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-previous',
  imports: [CommonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    DatePipe,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatMenuModule,
    MatTooltipModule
  ],
  templateUrl: './previous.html',
  styleUrl: './previous.scss'
})
export class Previous implements OnDestroy {
  @Input() booking: any;
  http = inject(HttpClient);
  dataSource = new MatTableDataSource<any>();
  columnsToDisplay = [
    'serial_no', 'booking_no', 'shift_date', 'shift_start', 'shift_end',
    'login_time', 'logout_time', 'login_selfie', 'logout_selfie',
    'user_name', 'staff_name', 'shift_total_price', 'rating', 'payout_status', 'status', 'actions'];
  isLoading = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<any>(true, []);
  @ViewChild('viewDialog') viewDialog!: TemplateRef<any>;
  dialog = inject(MatDialog);
  private _pushSub: Subscription | any;

  constructor() { }

  ngOnInit(): void {
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onViewAction(): void {
    const dialogRef = this.dialog.open(this.viewDialog, {
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  fetchData(): void {
    let endpoint = '';
    this.isLoading = true;
    const page = this.paginator ? this.paginator.pageIndex : 0;
    const size = this.paginator ? (this.paginator.pageSize || 10) : 10;
    let params = new HttpParams().set('page', String(page)).set('size', String(size))
      endpoint = `${ENDPOINTS.GET_PREVIOUS_BOOKINGS}?${params.toString()}`;

    if (endpoint) {
      this.http.get<any[]>(API_URL + endpoint).subscribe({
        next: (res: any) => {
          this.dataSource.data = Array.isArray(res.content) ? [...res.content] : res.content;
          this.isLoading = false;
        },
        error: (err) => {
          this.dataSource.data = [];
          this.isLoading = false;
        }
      });
    }
  }

  // Function to open image in a new tab
  openImage(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  ngOnDestroy(): void {
    try {
      if (this._pushSub && typeof this._pushSub.unsubscribe === 'function') {
        this._pushSub.unsubscribe();
      }
    } catch (e) { }
  }
}