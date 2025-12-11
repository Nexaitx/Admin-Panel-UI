import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, Input, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { API_URL, ENDPOINTS } from '../../../core/const';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { pushMessages$ } from '../../../core/services/push-notification';
import { Subscription } from 'rxjs';
import { ColumnDef, CommonTableComponent } from '../../../shared/common-table/common-table.component';

@Component({
  selector: 'app-previous',
  imports: [CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    CommonTableComponent
  ],
  templateUrl: './previous.html',
  styleUrl: './previous.scss'
})
export class Previous implements OnDestroy {
  private _pushSub: Subscription | any;
  @Input() booking: any;
  http = inject(HttpClient);
  isLoading = false;
  dataSource = new MatTableDataSource<any>();

  columnsToDisplay : ColumnDef[]= [
    { key: 'staffId', header: 'Staff Id', sortable: true, type: 'text' },
    { key: 'staffName', header: 'Staff Name', sortable: true, type: 'text' },
    { key: 'userId', header: 'User Id', type: 'text' },
    { key: 'userName', header: 'User Name', type: 'text' },
    { key: 'dutyStart', header: 'Duty Start', sortable: true, type: 'date' },
    { key: 'dutyEnd', header: 'Duty End', sortable: true, type: 'date' }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('viewDialog') viewDialog!: TemplateRef<any>;
  dialog = inject(MatDialog);

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