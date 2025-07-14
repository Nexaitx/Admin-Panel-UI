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
import { CommonModule, DatePipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';

interface TableUser {
  userName: string;
  email: string;
  phone: string;
  contact: string;
  aadhaar: string;
  address: string;
  city: string;
  date: string;
  user_id: number;
  aadhaarUrl?: string;
  originalUser: any;
}
@Component({
  selector: 'app-doctor',
  imports: [MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatMenuModule,
    MatSidenavModule],
  templateUrl: './doctor.html',
  styleUrl: './doctor.scss',
  providers: [DatePipe]
})
export class Doctor {
  http = inject(HttpClient);
  users: any[] = [];

  isDrawerOpen: boolean = false;
  selectedUser: TableUser | null = null;

  displayedColumns: string[] = ['userName', 'email', 'phone', 'contact', 'aadhaar', 'address', 'city', 'date', 'actions'];

  dataSource: MatTableDataSource<TableUser>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private datePipe: DatePipe) {
    this.dataSource = new MatTableDataSource<TableUser>([]);
  }

  ngOnInit(): void {
    this.getUsers();

    this.dataSource.filterPredicate = (data: TableUser, filter: string): boolean => {
      const dataStr = `${data.userName} ${data.email} ${data.phone} ${data.contact} ${data.aadhaar} ${data.address} ${data.city} ${data.date}`.toLowerCase();
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

  editElement(element: TableUser) {
    alert(`Editing: ${element.userName} (User ID: ${element.user_id})`);
  }

  deleteElement(element: TableUser) {
    console.log(`Delete ${element.userName} (ID: ${element.user_id})`);
    alert(`Deleting: ${element.userName} (User ID: ${element.user_id})`);
  }

  openUserDrawer(element: TableUser) {
    this.selectedUser = element;
    this.isDrawerOpen = true;
  }

  closeUserDrawer() {
    this.isDrawerOpen = false;
    this.selectedUser = null;
  }

  mapAndSetDataSource(users: any[]): void {
    const mappedUsers: TableUser[] = users.map(user => ({
      user_id: user.user_id,
      userName: user.userName,
      email: user.email,
      phone: user.phone_number,
      contact: user.email,
      aadhaar: user.aadhaar_verified ? 'Verified' : 'Not Verified',
      address: user.address,
      city: user.city,
      date: this.datePipe.transform(user.last_location_update, 'mediumDate') || '',
      aadhaarUrl: user.aadhaar_card_attachment || null,
      originalUser: user
    }));

    this.dataSource.data = mappedUsers;

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  getUsers() {
    this.http.get(API_URL + ENDPOINTS.GET_DOCTORS).subscribe({
      next: (res: any) => {
        this.users = res;
        this.mapAndSetDataSource(this.users);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }
}
