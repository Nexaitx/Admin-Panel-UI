import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, state, style, transition, trigger } from '@angular/animations';
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
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './bulk-assignment.html',
  styleUrl: './bulk-assignment.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BulkAssignment {
  http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private snackBar = inject(MatSnackBar);
  dataSource = new MatTableDataSource<User>();
  columnsToDisplay = ['userId', 'userName', 'userPhone', 'expand'];
  expandedElement: User | null = null;
  isLoading = false;

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
    this.isLoading = true;
    const endpoint = ENDPOINTS.GET_BULK_BOOKINGS;
    
    this.http.get(API_URL + ENDPOINTS.GET_BULK_BOOKINGS).subscribe((res: any) => {
      console.log(res)
    })
    // this.http.get<User[]>(API_URL + endpoint).subscribe({
    //   next: (res: User[]) => {
    //     this.dataSource.data = res;
    //     this.isLoading = false;
    //     this.cdr.markForCheck();
    //   },
    //   error: (err) => {
    //     console.error('Error fetching data:', err);
    //     this.dataSource.data = [];
    //     this.isLoading = false;
    //     this.snackBar.open('Failed to load data. Please try again.', 'Close', { duration: 3000 });
    //     this.cdr.markForCheck();
    //   }
    // });
  }
}