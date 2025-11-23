import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { API_URL, ENDPOINTS } from '../../core/const';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-active-staffs',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
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
  columnsToDisplay = ['staffId', 'staffName', 'phone', 'email', 'gender', 'category', 'subcategory', 'duties', 'price', 'experience', 'qualification', 'profession', 'actions'];
  isLoading = false;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  selectedStaff: any;
  constructor() { }

  ngOnInit(): void {
    this.fetchData();
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

  fetchData(): void {
    this.isLoading = true;
    const endpoint = ENDPOINTS.GET_ACTIVE_STAFFS;

    this.http.get<any[]>(API_URL + endpoint).subscribe({
      next: (res: any) => {
        this.dataSource.data = res;
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
