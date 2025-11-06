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
import { MatSelectModule } from '@angular/material/select';

interface TableUser {
  userId: number;
  userName: string;
  email: string;
  phoneNumber: string;
  aadhaar: boolean;
  address: string;
  city: string;
  signupDate: string;
  aadhaarUrl?: string;
  originalUser: any;
}

@Component({
  selector: 'app-client-individual',
  imports: [
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatMenuModule,
    MatSidenavModule,
    MatSelectModule
  ],
  templateUrl: './client-individual.html',
  styleUrl: './client-individual.scss',
  providers: [DatePipe]
})
export class ClientIndividual {
  http = inject(HttpClient);
  @Input() client: any;
  users: any[] = [];
  isDrawerOpen: boolean = false;
  selectedUser: TableUser | null = null;
  displayedColumns: string[] = ['s_no', 'userId', 'userName', 'email', 'phoneNumber', 'address', 'city', 'signupDate', 'aadhaar', 'actions'];
  dataSource: MatTableDataSource<TableUser>;
  cities: any[] = [
    { value: 'chandigarh', viewValue: 'Chandigarh' },
    { value: 'delhi', viewValue: 'Delhi' },
    { value: 'jaipur', viewValue: 'Jaipur' },
    { value: 'other', viewValue: 'Other' }
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private datePipe: DatePipe) {
    this.dataSource = new MatTableDataSource<TableUser>([]);
  }

  ngOnInit(): void {
    this.getUsers();

    this.dataSource.filterPredicate = (data: TableUser, filter: string): boolean => {
      const dataStr = `${data.userId} ${data.userName} ${data.email} ${data.phoneNumber} ${data.aadhaar} ${data.address} ${data.city} ${data.signupDate}`.toLowerCase();
      return dataStr.includes(filter.toLowerCase());
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.sort.sort({ id: 'addedDate', start: 'desc', disableClear: true });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editElement(element: TableUser) {
    alert(`Editing: ${element.userName} (User ID: ${element.userId})`);
  }

  deleteElement(element: TableUser) {
    console.log(`Delete ${element.userName} (ID: ${element.userId})`);
    alert(`Deleting: ${element.userName} (User ID: ${element.userId})`);
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
      userId: user.userId,
      userName: user.userName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      aadhaar: user.aadhaarVerified,
      address: user.address,
      city: user.city,
      signupDate: this.datePipe.transform(user.signupDate, 'mediumDate') || '',
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
    this.http.get(API_URL + ENDPOINTS.GET_USERS).subscribe({
      next: (res: any) => {
        this.dataSource.data = res
        this.users = res;
        this.mapAndSetDataSource(this.users);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }
}
