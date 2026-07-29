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

interface TableOwner {
  ownerId: number;
  ownerName: string;
  roleType: string;
  email: string;
  phoneNumber: string;
  isVerified: boolean;
  city: string;
  originalUser: any;
}
@Component({
  selector:'app-riders-owners',
  imports: [ MatCardModule,
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
  templateUrl:'./riders-owners.html',
  styleUrl:'./riders-owners.scss',
  providers: [DatePipe]
})
export class RidersOwners {
  @Input() client: any;
  http = inject(HttpClient);
  users: any[] = [];
  isDrawerOpen: boolean = false;
  selectedUser: TableOwner | null = null;
  displayedColumns: string[] = ['s_no', 'ownerId', 'ownerName', 'roleType', 'email',  'phoneNumber', 'isVerified','actions'];
  dataSource: MatTableDataSource<TableOwner>;
  cities: string[] = [];
  selectedCity: string = '';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private datePipe: DatePipe) {
    this.dataSource = new MatTableDataSource<TableOwner>([]);
  }

  ngOnInit(): void {
    this.getOrganizations();
    this.dataSource.filterPredicate = (data: TableOwner,filter: string): boolean => {
      if (!filter) {
        return true;
      }

      return data.city?.toLowerCase() === filter;
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

  filterByCity() {
    this.dataSource.filter = this.selectedCity.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editElement(element: TableOwner) {
    alert(`Editing: ${element.ownerName} (Owner ID: ${element.ownerId})`);
  }

  deleteElement(element: TableOwner) {
    console.log(`Delete ${element.ownerName} (ID: ${element.ownerId})`);
    alert(`Deleting: ${element.ownerName} (Owner ID: ${element.ownerId})`);
  }

  openUserDrawer(element: TableOwner) {
    this.selectedUser = element;
    this.isDrawerOpen = true;
  }

  closeUserDrawer() {
    this.isDrawerOpen = false;
    this.selectedUser = null;
  }

  mapAndSetDataSource(users: any[]): void {
    const mappedUsers: TableOwner[] = users.map(user => ({
      ownerId: user.ownerId,
      ownerName: user.ownerName,
      roleType: user.roleType,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isVerified: user.isVerified,
      city: user.city,
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

  getOrganizations() {
    this.http.get(API_URL + ENDPOINTS.GET_ORGANIZATIONS).subscribe({
      next: (res: any) => {
        this.users = res;

        this.cities = [
          ...new Set(
            this.users
              .map(user => user.city?.trim())
              .filter(city => city)
          )
        ].sort();

        this.mapAndSetDataSource(this.users);
      },
        error: (err) => {
          console.error('Error fetching users:', err);
        }
    })
  }
}
