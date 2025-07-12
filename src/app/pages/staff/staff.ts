import { Component, inject, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { API_URL, ENDPOINTS } from '../../core/const';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common'; // DatePipe still imported but not used for these columns
import { MatMenuModule } from '@angular/material/menu';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

// Define the interface for your table's data, reflecting the new columns
interface TableStaff {
  staffId: number;
  name: string;
  category: string;
  experience: number;
  price: number | null; // Price can be null in your API response
  gender: string;
  shiftType: string;
  profession: string;
  phone_number: string; // Directly using phone_number from API
  originalStaff: any; // Keep a reference to the original staff object
}

@Component({
  selector: 'app-staff',
  standalone: true,
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
    MatSidenavModule
  ],
  templateUrl: './staff.html',
  styleUrl: './staff.scss',
  providers: [DatePipe]
})
export class Staff {
  title = 'Staff List';
  http = inject(HttpClient);
  staffs: any[] = [];
  isDrawerOpen = false;
  selectedStaff: any = null;

  displayedColumns: string[] = [
    'staffId',
    'name',
    'category',
    'experience',
    'price',
    'gender',
    'shiftType',
    'profession',
    'phone_number',
    'actions'
  ];

  dataSource: MatTableDataSource<TableStaff>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.dataSource = new MatTableDataSource<TableStaff>([]);
  }

  ngOnInit() {
    this.getStaffs();
    this.dataSource.filterPredicate = (data: TableStaff, filter: string): boolean => {
      // Concatenate all relevant string/number properties for searching
      const dataStr = `${data.staffId} ${data.name} ${data.category} ${data.experience} ${data.price} ${data.gender} ${data.shiftType} ${data.profession} ${data.phone_number}`.toLowerCase();
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

  editElement(element: TableStaff) {
    console.log(`Edit ${element.name} (ID: ${element.staffId})`);
    alert(`Editing: ${element.name} (Staff ID: ${element.staffId})`);
    // Implement your edit logic here
  }
  
  openStaffDrawer(element: TableStaff) {
    // You can use a boolean flag and a selectedStaff property to control the drawer
    this.selectedStaff = element;
    this.isDrawerOpen = true;
  }

  closeStaffDrawer() {
    this.isDrawerOpen = false;
  }

  deleteElement(element: TableStaff) {
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
    const mappedStaffs: TableStaff[] = staffs.map(staff => ({
      staffId: staff.staffId,
      name: staff.name,
      category: staff.category,
      experience: staff.experience,
      price: staff.price, // Directly using price
      gender: staff.gender,
      shiftType: staff.shiftType,
      profession: staff.profession,
      phone_number: staff.phone_number, // Directly using phone_number
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
}