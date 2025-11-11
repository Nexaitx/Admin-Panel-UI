import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { API_URL, ENDPOINTS } from '../../core/const';
import { MatMenuItem, MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-my-available-products',
  imports: [MatIconModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatSelectModule,
    MatMenuItem
  ],
  templateUrl: './my-available-products.html',
  styleUrl: './my-available-products.scss',
  providers: [DatePipe]
})
export class MyAvailableProducts {
  displayedColumns: string[] = ['s_no', 'id', 'name', 'category', 'stockQty', 'price', 'addedDate', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  http = inject(HttpClient);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getMyAvailableProducts();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.sort.sort({ id: 'addedDate', start: 'desc', disableClear: true });

    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 's_no') {
        return 0;
      }
      return item[property];
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getMyAvailableProducts() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    this.http.get(API_URL + ENDPOINTS.GET_MY_AVAILABLE_MEDICINES, { headers }).subscribe((res: any) => {
      this.dataSource.data = res.reverse();
      console.log(this.dataSource.data);
    });
  }
}