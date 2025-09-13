import { Component, inject, Input, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { API_URL, ENDPOINTS } from '../../../core/const';
import { HttpClient } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-staff',
  imports: [MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    DatePipe],
  templateUrl: './staff.html',
  styleUrl: './staff.scss'
})
export class Staff {
  title = 'Staff List';
  http = inject(HttpClient);
  staffs: any[] = [];
  isDrawerOpen = false;
  selectedStaff: any = null;
  @Input() device: string = 'staffDevicesAndAddresses';

  displayedColumns: string[] = [
    'staffId',
    'staffName',
    'ipAddress',
    'deviceType',
    'staffAgent',
    'loginTime',
  ];

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit() {
    this.getDevicesAddress();
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const dataStr = `${data.staffId} ${data.staffName} ${data.ipAddress} ${data.deviceType} ${data.staffAgent} ${data.loginTime}`.toLowerCase();
      return dataStr.includes(filter.toLowerCase());
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

  editElement(element: any) {
    console.log(`Edit ${element.name} (ID: ${element.staffId})`);
    alert(`Editing: ${element.name} (Staff ID: ${element.staffId})`);
    // Implement your edit logic here
  }

  openStaffDrawer(element: any) {
    // You can use a boolean flag and a selectedStaff property to control the drawer
    this.selectedStaff = element;
    this.isDrawerOpen = true;
  }

  closeStaffDrawer() {
    this.isDrawerOpen = false;
  }

  getDevicesAddress() {
    this.http.get(API_URL + ENDPOINTS.GET_STAFF_DEVICES_ADDRESS).subscribe({
      next: (res: any) => {
        this.staffs = res;
        this.mapAndSetDataSource(this.staffs);
      },
      error: (err) => {
        console.error('Error fetching staffs:', err);
      }
    });
  }

  mapAndSetDataSource(devices: any[]): void {
    const mappedDevices: any[] = devices.map(device => ({
      staffId: device.staffId,
      staffName: device.staffName,
      ipAddress: device.ipAddress,
      deviceType: device.deviceType,
      staffAgent: device.staffAgent,
      loginTime: device.loginTime,
    }));
    this.dataSource.data = mappedDevices;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

}