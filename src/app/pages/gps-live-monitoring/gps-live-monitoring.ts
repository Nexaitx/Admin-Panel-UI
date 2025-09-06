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
import { Observable } from 'rxjs';

@Component({
  selector: 'app-gps-live-monitoring',
  imports: [CommonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './gps-live-monitoring.html',
  styleUrl: './gps-live-monitoring.scss'
})
export class GPSLiveMonitoring {
  http = inject(HttpClient);
  dataSource = new MatTableDataSource<any>();

  // New columns based on the provided data structure
  columnsToDisplay = [ 'userName', 'userLocation', 'staffName', 'staffLocation', 'actions'];

  isLoading = false;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() { }

  ngOnInit(): void {
    this.fetchData();
    this.getLocation();
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

  address: string | undefined;
  latitude: number | undefined;
  longitude: number | undefined;
  errorMessage: string | undefined;
  private apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
  private apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  getAddress(latitude: number, longitude: number): Observable<any> {
    const url = `${this.apiUrl}?latlng=${latitude},${longitude}&key=${this.apiKey}`;
    return this.http.get(url);
  }

getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.getAddress(this.latitude, this.longitude).subscribe(
            (response: any) => {
              if (response.results && response.results.length > 0) {
                this.address = response.results[0].formatted_address;
              } else {
                this.address = 'Address not found.';
              }
            },
            (error) => {
              console.error('Error with geocoding API:', error);
              this.errorMessage = 'Error fetching address.';
            }
          );
        },
        (error: GeolocationPositionError) => {
          this.errorMessage = 'Error getting location: ' + error.message;
          console.error('Error getting geolocation:', error);
        }
      );
    } else {
      this.errorMessage = 'Geolocation is not supported by this browser.';
      console.error('Geolocation is not supported by this browser.');
    }
  }
}
