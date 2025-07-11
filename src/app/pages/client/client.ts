import { Component, inject, QueryList, ViewChildren } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; // For mat-table
import { MatSort, MatSortModule } from '@angular/material/sort';   // For sorting
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; // For pagination
import { MatFormFieldModule } from '@angular/material/form-field'; // For input fields
import { MatInputModule } from '@angular/material/input';     // For input fields
import { MatIconModule } from '@angular/material/icon';     // For icons (e.g., edit, delete)
import { MatButtonModule } from '@angular/material/button';   // For buttons
import { API_URL, ENDPOINTS } from '../../core/const';
import { HttpClient } from '@angular/common/http';

export interface PeriodicElement {
  name: string;
  stafftype: string;
  address: string;
  contact: string;
  aadhaar?: boolean; // Optional for Current tab
  status: 'completed' | 'ongoing' | 'planned'; // Added for filtering/status
  date: string; // Added for date-based data
}

// Dummy data for Previous tab
const PREVIOUS_DATA: PeriodicElement[] = [
  { stafftype: '1', name: 'Nina', address: 'chd', contact: '', status: 'completed', date: '2023-01-15' },
  { stafftype: '2', name: 'Tommy', address: 'chd', contact: '', status: 'completed', date: '2023-02-20' },
  { stafftype: '3', name: 'Alice', address: 'chd', contact: '', status: 'completed', date: '2023-03-01' },
  { stafftype: '4', name: 'Rita', address: 'chd', contact: '', status: 'completed', date: '2023-04-10' },
  { stafftype: '5', name: 'John', address: 'chd', contact: '', status: 'completed', date: '2023-05-05' },
];

// Dummy data for Current tab
const CURRENT_DATA: PeriodicElement[] = [
  { stafftype: '6', name: 'John', address: 'chd', contact: '', aadhaar: false, status: 'ongoing', date: '2024-06-01' },
  { stafftype: '7', name: 'Tommy', address: 'chd', contact: '', aadhaar: false, status: 'ongoing', date: '2024-06-10' },
  { stafftype: '8', name: 'Nina', address: 'pun', contact: '', aadhaar: false, status: 'ongoing', date: '2024-06-15' },
  { stafftype: '9', name: 'Alice', address: 'pun', contact: '', aadhaar: false, status: 'ongoing', date: '2024-06-20' },
  { stafftype: '10', name: 'Rita', address: 'chd', contact: '', aadhaar: false, status: 'ongoing', date: '2024-06-25' },
];

const FUTURE_DATA: PeriodicElement[] = [
  { stafftype: '11', name: 'Tommy', address: 'chd', contact: '', aadhaar: false, status: 'planned', date: '2025-01-01' },
  { stafftype: '12', name: 'John', address: 'pun', contact: '', aadhaar: false, status: 'planned', date: '2025-02-10' },
  { stafftype: '13', name: 'Nina', address: 'del', contact: '', aadhaar: false, status: 'planned', date: '2025-03-05' },
  { stafftype: '14', name: 'Alice', address: 'goa', contact: '', aadhaar: false, status: 'planned', date: '2025-04-20' },
  { stafftype: '15', name: 'Rita', address: 'chd', contact: '', aadhaar: false, status: 'planned', date: '2025-05-15' },
];

@Component({
  selector: 'app-client',
  imports: [
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './client.html',
  styleUrls: ['./client.css']
})
export class Client {
  title = 'Material Tabs with Tables';
  http = inject(HttpClient);

  // Define columns for all tables
  displayedColumns: string[] = ['stafftype', 'name', 'address', 'contact', 'aadhaar', 'status', 'date', 'actions'];

  // Data sources for each table
  dataSourcePrevious: MatTableDataSource<PeriodicElement>;
  dataSourceCurrent: MatTableDataSource<PeriodicElement>;
  dataSourceFuture: MatTableDataSource<PeriodicElement>;

  // ViewChildren for sorting and pagination, as there are multiple instances
  @ViewChildren(MatSort) sort!: QueryList<MatSort>;
  @ViewChildren(MatPaginator) paginator!: QueryList<MatPaginator>;

  constructor() {
    // Initialize data sources with dummy data
    this.dataSourcePrevious = new MatTableDataSource(PREVIOUS_DATA);
    this.dataSourceCurrent = new MatTableDataSource(CURRENT_DATA);
    this.dataSourceFuture = new MatTableDataSource(FUTURE_DATA);
  }

  ngOnInit(): void {
    this.getUsers();
    // Custom filter predicate for all data sources
    const customFilterPredicate = (data: PeriodicElement, filter: string): boolean => {
      const dataStr = Object.values(data).join('').toLowerCase();
      return dataStr.includes(filter.toLowerCase());
    };

    this.dataSourcePrevious.filterPredicate = customFilterPredicate;
    this.dataSourceCurrent.filterPredicate = customFilterPredicate;
    this.dataSourceFuture.filterPredicate = customFilterPredicate;
  }

  ngAfterViewInit(): void {
    // Assign sort and paginator instances to each data source
    // The order in QueryList matches the order in the template
    this.dataSourcePrevious.sort = this.sort.get(0)!;
    this.dataSourcePrevious.paginator = this.paginator.get(0)!;

    this.dataSourceCurrent.sort = this.sort.get(1)!;
    this.dataSourceCurrent.paginator = this.paginator.get(1)!;

    this.dataSourceFuture.sort = this.sort.get(2)!;
    this.dataSourceFuture.paginator = this.paginator.get(2)!;
  }

  // Filter method for each table
  applyFilter(event: Event, dataSource: MatTableDataSource<PeriodicElement>) {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }

  // Action methods (placeholders)
  editElement(element: PeriodicElement, tab: string) {
    console.log(`Edit ${element.name} from ${tab} tab`);
    // Implement your edit logic here (e.g., open a dialog, navigate to an edit page)
    alert(`Editing: ${element.name} (Tab: ${tab})`);
  }

  deleteElement(element: PeriodicElement, tab: string) {
    console.log(`Delete ${element.name} from ${tab} tab`);
    // Implement your delete logic here (e.g., show confirmation, remove from data source)
    alert(`Deleting: ${element.name} (Tab: ${tab})`);
  }

  getUsers() {
    this.http.get(API_URL + ENDPOINTS.GET_USERS, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).subscribe({
      next: (data) => {
        console.log('Users:', data);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }
}
