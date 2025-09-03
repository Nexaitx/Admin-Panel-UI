import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { API_URL, ENDPOINTS } from '../../core/const';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-gps-live-deviatian',
  standalone: true, // Assuming this is a standalone component
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './gps-live-deviatian.html',
  styleUrl: './gps-live-deviatian.scss'
})
export class GpsLiveDeviatian {
  http = inject(HttpClient);
  dataSource = new MatTableDataSource<any>();

  // New columns based on the provided data structure
  columnsToDisplay = ['alert', 'userId', 'userName', 'staffId', 'staffName', 'distance'];

  isLoading = false;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() { }

  ngOnInit(): void {
    this.fetchData();
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

    // Use a mock endpoint for demonstration. Replace with your actual endpoint.
    const endpoint = ENDPOINTS.GET_GPS_DEVIATION_ALERTS;

    this.http.get<any[]>(API_URL + endpoint).subscribe({
      next: (res: any) => {
        this.dataSource.data = res; // Assuming the API returns a property like 'deviationAlerts'
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching GPS deviation alerts:', err);
        this.dataSource.data = [];
        this.isLoading = false;
      }
    });
  }
}