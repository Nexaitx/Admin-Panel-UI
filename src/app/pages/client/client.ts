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
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common'; // Import DatePipe for formatting

// 1. Define an interface for the data that will be displayed in the table,
// matching the new displayedColumns.
interface TableUser {
  name: string;      // maps to user_name
  email: string;     // maps to email
  phone: string;     // maps to phone_number
  contact: string;   // Keeping it for the column, but it might be redundant with 'phone'.
  aadhaar: string;   // No direct mapping, setting to 'N/A' or specific logic.
  address: string;   // maps to address
  city: string;      // maps to city
  date: string;      // maps to last_location_update, formatted
  user_id: number;
  originalUser: any; // Keep a reference to the original user object
}

@Component({
  selector: 'app-client',
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
  ],
  templateUrl: './client.html',
  styleUrls: ['./client.css'],
  providers: [DatePipe] // Provide DatePipe here if you want to use it in TS
})
export class Client {
  title = 'Client List'; // Updated title
  http = inject(HttpClient);
  users: any[] = [];

  // Updated displayedColumns
  displayedColumns: string[] = ['name', 'email', 'phone', 'contact', 'aadhaar', 'address', 'city', 'date', 'actions'];

  dataSource: MatTableDataSource<TableUser>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Inject DatePipe if you plan to use it in TypeScript for formatting dates
  constructor(private datePipe: DatePipe) {
    this.dataSource = new MatTableDataSource<TableUser>([]);
  }

  ngOnInit(): void {
    this.getUsers();

    this.dataSource.filterPredicate = (data: TableUser, filter: string): boolean => {
      // Concatenate all relevant string properties for searching
      const dataStr = `${data.name} ${data.email} ${data.phone} ${data.contact} ${data.aadhaar} ${data.address} ${data.city} ${data.date}`.toLowerCase();
      return dataStr.includes(filter.toLowerCase());
    };
  }

  ngAfterViewInit(): void {
    // These are assigned after the view is initialized.
    // The actual data assignment and re-application of sort/paginator happens in mapAndSetDataSource.
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
    console.log(`Edit ${element.name} (ID: ${element.user_id})`);
    alert(`Editing: ${element.name} (User ID: ${element.user_id})`);
    // Your edit logic here, e.g., open a dialog with element.originalUser
  }

  deleteElement(element: TableUser) {
    console.log(`Delete ${element.name} (ID: ${element.user_id})`);
    alert(`Deleting: ${element.name} (User ID: ${element.user_id})`);
    // Your delete logic here
  }

  

  mapAndSetDataSource(users: any[]): void {
    const mappedUsers: TableUser[] = users.map(user => ({
      user_id: user.user_id,
      name: user.user_name,
      email: user.email,
      phone: user.phone_number,
      contact: user.email, // Mapping 'contact' to 'email' as per your new columns. Adjust if different.
      aadhaar: 'Not Verified', // Assuming a default or derive from actual data if available
      address: user.address,
      city: user.city,
      // Using DatePipe to format the date
      date: this.datePipe.transform(user.last_location_update, 'mediumDate') || '',
      originalUser: user
    }));

    this.dataSource.data = mappedUsers;

    // Re-apply sort and paginator after data is loaded and assigned
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
        this.users = res;
        this.mapAndSetDataSource(this.users);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        // Handle error, e.g., show a toast message to the user
      }
    });
  }

  // Removed getRoleTypeName as 'stafftype' is no longer in displayedColumns.
  // If you still need this for internal logic or categorization, keep it.
}