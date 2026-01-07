import { HttpClient } from '@angular/common/http';
import { Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ColumnDef, CommonTableComponent, PaginationEvent } from '../../shared/common-table/common-table.component';
import { API_URL, ENDPOINTS } from '../../core/const';


@Component({
  selector: 'app-devices-and-addresses',
  imports: [
    MatTabsModule,
    CommonTableComponent
  ],
  templateUrl: './devices-and-addresses.html',
  styleUrl: './devices-and-addresses.scss'
})

export class DevicesAndAddresses {
  selectedIndex: number = 0;
  activeTab: string = 'clientDevices';
  http = inject(HttpClient);
  @ViewChild(CommonTableComponent) commonTable!: CommonTableComponent;
  dataSource = new MatTableDataSource<any>();
  currentPageIndex = 0;
  currentPageSize = 10;
  totalElements = 0;
  isLoading = false;

  columnUserToDisplay: ColumnDef[] =
    [{ key: 'id', header: 'ID', sortable: true },
    { key: 'userId', header: 'User&nbsp;ID', sortable: true },
    { key: 'userName', header: 'User&nbsp;Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'phoneNumber', header: 'Phone&nbsp;Number', sortable: true },
    { key: 'ipAddress', header: 'IPAddress', sortable: true },
    { key: 'deviceType', header: 'Device&nbsp;Type', sortable: true },
    { key: 'userAgent', header: 'User&nbsp;Agent', sortable: true },
    { key: 'loginTime', header: 'Login&nbsp;Time', sortable: true },
    { key: 'logoutTime', header: 'Logout&nbsp;Time', sortable: true },
    { key: 'sessionDurationMinutes', header: 'Session&nbsp;Duration' },
    { key: 'isActive', header: 'Active' }];

  columnStaffToDisplay: ColumnDef[] = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'staffId', header: 'Staff&nbsp;ID', sortable: true },
    { key: 'staffName', header: 'Staff&nbsp;Name', sortable: true }, 
    { key: 'email', header: 'Email', sortable: true },
    { key: 'phoneNumber', header: 'Phone&nbsp;Number', sortable: true },
    { key: 'ipAddress', header: 'IPAddress', sortable: true },
    { key: 'deviceType', header: 'Device&nbsp;Type', sortable: true },
    { key: 'userAgent', header: 'User&nbsp;Agent', sortable: true },
    { key: 'loginTime', header: 'Login&nbsp;Time', sortable: true },
    { key: 'logoutTime', header: 'Logout&nbsp;Time', sortable: true },
    { key: 'sessionDurationMinutes', header: 'Session&nbsp;Duration' },
    { key: 'isActive', header: 'Active' }
  ];
  
  onTabChange(index: number) {
    if (index === 0) {
      this.activeTab = 'clientDevices';
      this.currentPageIndex = 0;
      this.currentPageSize = 10;
      this.fetchData();
    } else if (index === 1) {
      this.activeTab = 'staffDevices';
      this.currentPageIndex = 0;
      this.currentPageSize = 10;
      this.fetchData();
    }
  }

  onPageChange(event: PaginationEvent): void {
    this.currentPageIndex = event.pageIndex;
    this.currentPageSize = event.pageSize;
    this.fetchData();
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    const params = {
      page: this.currentPageIndex,
      size: this.currentPageSize,
      sortDirection: 'desc'
    };

    const endpoint = this.activeTab === 'clientDevices'
      ? ENDPOINTS.GET_USER_DEVICES_ADDRESS
      : ENDPOINTS.GET_STAFF_DEVICES_ADDRESS;

    this.http.get(API_URL + endpoint, { params }).subscribe(
      (res: any) => {
        this.dataSource.data = res.content.map((item: any) => ({
          ...item,
          isActive: item && item && item.isActive ? 'Yes' : 'No'
        }));
        this.totalElements = res.totalElements || 0;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.isLoading = false;
      }
    );
  }

}