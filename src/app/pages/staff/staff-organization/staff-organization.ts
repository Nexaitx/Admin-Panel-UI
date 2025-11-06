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
import { CommonModule, DatePipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-staff-organization',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatTooltipModule,
    MatSelectModule
  ],
  templateUrl: './staff-organization.html',
  styleUrl: './staff-organization.scss'
})
export class StaffOrganization {
  title = 'Staff List';
  http = inject(HttpClient);
  staffs: any[] = [];
  isDrawerOpen = false;
  selectedStaff: any = null;
  @Input() staff: any;

  displayedColumns: string[] = [
    's_no',
    'staffId',
    'name',
    'phoneNumber',
    'email',
    'address',
    'city',
    'gender',
    'experience',
    'category',
    'subcategory',
    'shiftType',
    'price',
    'rating',
    'verified',
    'actions'
  ];

  dataSource: MatTableDataSource<any>;
  cities: any[] = [
    { value: 'chandigarh', viewValue: 'Chandigarh' },
    { value: 'delhi', viewValue: 'Delhi' },
    { value: 'jaipur', viewValue: 'Jaipur' },
    { value: 'other', viewValue: 'Other' }
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit() {
    this.getStaffs();
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const dataStr = `${data.staffId} ${data.name} ${data.category} ${data.experience} ${data.price} ${data.gender} ${data.shiftType} ${data.profession} ${data.email} ${data.phoneNumber} ${data.rating} ${data.verified}`.toLowerCase();
      return dataStr.includes(filter.toLowerCase());
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.sort.sort({ id: 'addedDate', start: 'desc', disableClear: true });
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
    console.log('Selected Staff:', this.selectedStaff);
    this.isDrawerOpen = true;
  }

  closeStaffDrawer() {
    this.isDrawerOpen = false;
  }

  deleteElement(element: any) {
    console.log(`Delete ${element.name} (ID: ${element.staffId})`);
    alert(`Deleting: ${element.name} (Staff ID: ${element.staffId})`);
    // Implement your delete logic here
  }

  getStaffs() {
    // Assuming ENDPOINTS.GET_STAFFS is the correct endpoint for staff data
    this.http.get(API_URL + ENDPOINTS.GET_STAFFS).subscribe({
      next: (res: any) => {
        this.staffs = res;
        this.mapAndSetDataSource(this.staffs);
      },
      error: (err) => {
        console.error('Error fetching staffs:', err);
        // Handle error display
      }
    });
  }

  mapAndSetDataSource(staffs: any[]): void {
    const mappedStaffs: any[] = staffs.map(staff => ({
      staffId: staff.staffId,
      name: staff.name,
      category: staff.category,
      experience: staff.experience,
      price: staff.price, // Directly using price
      gender: staff.gender,
      shiftType: staff.shiftType,
      profession: staff.profession,
      email: staff.email,
      phoneNumber: staff.phoneNumber,
      rating: staff.rating,
      verified: staff.verified,
      originalStaff: staff // Keep the original object
    }));

    this.dataSource.data = mappedStaffs;

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  refreshData() {
    this.ngOnInit();
  }

}
