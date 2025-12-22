import { HttpClient } from '@angular/common/http';
import { Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { API_URL, ENDPOINTS } from '../../core/const';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { ColumnDef, CommonTableComponent } from '../../shared/common-table/common-table.component';

@Component({
  selector: 'app-gps-live-monitoring',
  imports: [CommonTableComponent,
  ],
  templateUrl: './gps-live-monitoring.html',
  styleUrl: './gps-live-monitoring.scss'
})
export class GPSLiveMonitoring {
  http = inject(HttpClient);
  dataSource = new MatTableDataSource<any>();

  // New columns based on the provided data structure
  columnsToDisplay: ColumnDef[] = [
    { key: 'bookingId', header: 'Booking&nbsp;Id' },
    { key: 'userName', header: 'User&nbsp;Name' },
    { key: 'userPhoneNumber', header: 'User&nbsp;Phone&nbsp;Number' },
    { key: 'userLatitude', header: 'User&nbsp;Latitude' },
    { key: 'userLongitude', header: 'User&nbsp;Longitude' },
    { key: 'userAddress', header: 'User&nbsp;Address' },
    { key: 'staffName', header: 'Staff&nbsp;Name' },
    { key: 'staffPhoneNumber', header: 'Staff&nbsp;Phone&nbsp;Number' },
    { key: 'staffCategory', header: 'Staff&nbsp;Category' },
    { key: 'staffSubCategory', header: 'Staff&nbsp;SubCategory' },
    { key: 'staffLatitude', header: 'Staff&nbsp;Latitude' },
    { key: 'staffLongitude', header: 'Staff&nbsp;Longitude' },
    { key: 'staffAddress', header: 'Staff&nbsp;Address' },
    { key: 'distanceKm', header: 'Distance(km)' }
  ];

  isLoading = false;

  @ViewChild('sidenav') sidenav!: MatSidenav;
  selectedStaff: any;
  constructor() { }

  ngOnInit(): void {
    this.fetchData();
  }


  fetchData(): void {
    this.isLoading = true;

    // Use a mock endpoint for demonstration. Replace with your actual endpoint.
    const endpoint = ENDPOINTS.GET_GPS_MONITORING;

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
