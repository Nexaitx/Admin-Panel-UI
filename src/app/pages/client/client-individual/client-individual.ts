
import {
  Component,
  inject,
  Input,
  ViewChild,
  OnInit,
  AfterViewInit
} from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { API_URL, ENDPOINTS } from '../../../core/const';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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

interface LoginActivity {
  id: number;
  ipAddress: string;
  deviceType: string;
  userAgent: string;
  loginTime: string;
  logoutTime: string | null;
  isActive: boolean;
  sessionDurationMinutes: number | null;
  logoutReason: string | null;
}

interface UserLoginDetailsResponse {
  userId: number;
  userName: string;
  email: string;
  phoneNumber: string;
  loginActivities: LoginActivity[];
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

@Component({
  selector: 'app-client-individual',
  standalone: true,
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
    MatSelectModule,
    MatProgressSpinnerModule
],
  templateUrl: './client-individual.html',
  styleUrl: './client-individual.scss',
  providers: [DatePipe]
})
export class ClientIndividual implements OnInit, AfterViewInit {

userLoginDetails: UserLoginDetailsResponse | null = null;

isLoginActivityLoading = false;
loginActivityError = '';

  http = inject(HttpClient);

  @Input() client: any;

  users: any[] = [];

  isDrawerOpen = false;
  selectedUser: TableUser | null = null;

  displayedColumns: string[] = [
    's_no',
    'userId',
    'userName',
    'email',
    'phoneNumber',
    'address',
    'city',
    'signupDate',
    'aadhaar',
    'actions'
  ];

  dataSource: MatTableDataSource<TableUser>;

  cities: string[] = [];
  selectedCity = '';
  searchText = '';

  // Server-side pagination
  pageIndex = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  isLoading = false;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private datePipe: DatePipe) {
    this.dataSource = new MatTableDataSource<TableUser>([]);
  }

  ngOnInit(): void {

    this.dataSource.filterPredicate = (
      data: TableUser,
      filter: string
    ): boolean => {

      const search = this.searchText.trim().toLowerCase();
      const city = this.selectedCity.trim().toLowerCase();

      const matchesSearch = !search || [
        data.userName,
        data.email,
        data.phoneNumber,
        data.address,
        data.city,
        String(data.userId)
      ].some(value => value?.toLowerCase().includes(search));

      const matchesCity =
        !city || data.city?.trim().toLowerCase() === city;

      return matchesSearch && matchesCity;
    };

    this.getUsers();
  }

  ngAfterViewInit(): void {
    // Sorting current page data only
    this.dataSource.sort = this.sort;
  }

  // Search functionality
  applyFilter(event: Event): void {

    this.searchText =
      (event.target as HTMLInputElement).value;

    this.dataSource.filter =
      this.searchText + '_' + this.selectedCity;

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  // City filter
  filterByCity(): void {

    this.dataSource.filter =
      this.searchText + '_' + this.selectedCity;

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  // Server-side page change
  onPageChange(event: PageEvent): void {

    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.getUsers(this.pageIndex, this.pageSize);
  }

  // Get paginated users from backend
  getUsers(
    page: number = this.pageIndex,
    size: number = this.pageSize
  ): void {

    this.isLoading = true;

    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'desc');

    this.http.get<PageResponse<any>>(
      API_URL + ENDPOINTS.GET_USERS,
      { params }
    ).subscribe({

      next: (res) => {

        this.users = res.content || [];

        // Pagination details
        this.totalElements = res.totalElements;
        this.totalPages = res.totalPages;
        this.pageIndex = res.number;
        this.pageSize = res.size;

        // Generate unique city list
        this.cities = [
          ...new Set(
            this.users
              .map(user => user.city?.trim())
              .filter((city): city is string => !!city)
          )
        ].sort();

        // Map API response
        this.mapAndSetDataSource(this.users);

        // Reapply existing search/city filter
        this.dataSource.filter =
          this.searchText + '_' + this.selectedCity;

        this.isLoading = false;
      },

      error: (err) => {

        console.error('Error fetching users:', err);

        this.isLoading = false;
      }
    });
  }

  // Map API response to table
  mapAndSetDataSource(users: any[]): void {

    const mappedUsers: TableUser[] = users.map(user => ({

      userId: user.userId,
      userName: user.userName,
      email: user.email,
      phoneNumber: user.phoneNumber,

      aadhaar: user.aadhaarVerified,

      address:
        user.fullAddress ||
        [
          user.addressLine1,
          user.addressLine2,
          user.landmark
        ].filter(Boolean).join(', ') || '',

      city: user.city || '',

      signupDate:
        this.datePipe.transform(
          user.signupDate,
          'mediumDate'
        ) || '',

      aadhaarUrl: user.aadhaar_card_attachment || null,

      originalUser: user

    }));

    this.dataSource.data = mappedUsers;

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  editElement(element: TableUser): void {
    alert(
      `Editing: ${element.userName} (User ID: ${element.userId})`
    );
  }

  deleteElement(element: TableUser): void {
    console.log(
      `Delete ${element.userName} (ID: ${element.userId})`
    );

    alert(
      `Deleting: ${element.userName} (User ID: ${element.userId})`
    );
  }

  openUserDrawer(element: TableUser): void {
  this.selectedUser = element;
  this.isDrawerOpen = true;

  // View click karte hi login activity API call
  this.getUserLoginActivity(element.userId);
}
  // openUserDrawer(element: TableUser): void {
  //   this.selectedUser = element;
  //   this.isDrawerOpen = true;
  // }
closeUserDrawer(): void {
  this.isDrawerOpen = false;
  this.selectedUser = null;
  this.userLoginDetails = null;
  this.loginActivityError = '';
}

  getUserLoginActivity(userId: number): void {
  this.isLoginActivityLoading = true;
  this.loginActivityError = '';
  this.userLoginDetails = null;

  this.http.get<UserLoginDetailsResponse>(
    API_URL + ENDPOINTS.USER_LOGIN_ACTIVITY + userId
  ).subscribe({
    next: (res) => {
      this.userLoginDetails = res;
      this.isLoginActivityLoading = false;
    },
    error: (err) => {
      console.error('Error fetching user login activity:', err);

      this.loginActivityError =
        err.error?.message || 'Unable to load login activity.';

      this.isLoginActivityLoading = false;
    }
  });
}
}
