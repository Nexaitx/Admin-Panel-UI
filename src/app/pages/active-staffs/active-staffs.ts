import { HttpClient } from '@angular/common/http';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { API_URL, ENDPOINTS } from '../../core/const';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { ColumnDef, CommonTableComponent } from '../../shared/common-table/common-table.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-active-staffs',
  imports: [
    CommonTableComponent,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule
  ],
  templateUrl: './active-staffs.html',
  styleUrl: './active-staffs.scss'
})
export class ActiveStaffs {
  http = inject(HttpClient);
  dataSource = new MatTableDataSource<any>();
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isLoading = false;
  selectedStaff: any;
  columnsToDisplay: ColumnDef[] =
    [{ key: 'staffId', header: 'Staff&nbsp;ID', sortable: true },
    { key: 'name', header: 'Staff&nbsp;Name', sortable: true },
    { key: 'phoneNumber', header: 'Phone', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'gender', header: 'Gender', sortable: true },
    { key: 'category', header: 'Category', sortable: true },
    { key: 'subCategory', header: 'Sub&nbsp;Category', sortable: true },
    { key: 'duties', header: 'Duties', sortable: true },
    { key: 'price', header: 'Price', sortable: true },
    { key: 'experience', header: 'Experience', sortable: true },
    { key: 'qualification', header: 'Qualification' },
    { key: 'profession', header: 'Profession' }];
  constructor() { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;
    const endpoint = ENDPOINTS.GET_ACTIVE_STAFF;

    const params = {
      isAvailable: true
    };
    this.http.get<any[]>(API_URL + endpoint, { params }).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.reverse();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching duty logs:', err);
        this.dataSource.data = [];
        this.isLoading = false;
      }
    });
  }
}
