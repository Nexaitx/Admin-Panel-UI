import { CommonModule, DatePipe } from '@angular/common';
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
  selector: 'app-previous',
  imports: [CommonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    DatePipe,
    MatButtonModule],
  templateUrl: './previous.html',
  styleUrl: './previous.scss'
})
export class Previous {
  @Input() booking: any;
  http = inject(HttpClient);
  dataSource = new MatTableDataSource<any>();
  columnsToDisplay = ['bookingId', 'startDate', 'endDate', 'status', 'userName', 'userPhone', 'staffName', 'staffPhone', 'duties', 'price'];
  isLoading = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() { }

  ngOnInit(): void {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['booking'] && changes['booking'].currentValue) {
      this.fetchData();
    }
  }

  fetchData(): void {
    let endpoint = '';
    this.isLoading = true;
      endpoint = ENDPOINTS.GET_PREVIOUS_BOOKINGS;
    if (endpoint) {
      this.http.get<any[]>(API_URL + endpoint).subscribe({
        next: (res: any[]) => {
          this.dataSource.data = res;
          this.isLoading = false;
        },
        error: (err) => {
          this.dataSource.data = [];
          this.isLoading = false;
        }
      });
    }
  }
}