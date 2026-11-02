
import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {
  MatSortModule,
  MatSort,
  Sort,
  SortDirection
} from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { API_URL, ENDPOINTS } from '../../core/const';

interface Medicine {
  id: number;
  productId: string;
  productType: string;
  isAvailable: boolean;
  discountPrice: number;
  originalPrice: number;
  discountPercentage: number;
  adminName: string;
  createdAt: string;
  updatedAt: string;
  adminId: number;
  productName: string;
  productForm: string;
  packaging: string;
  packageInfo: string;
  manufacturer: string;
  brandName: string;
  category: string | null;
  saltComposition: string | null;
  medicineType: string | null;
  prescriptionRequired: boolean | null;
  howToUse: string;
  safetyAdvise: string;
  marketer: string;
  countryOfOrigin: string;
  expiration: string;
}

interface MedicineApiResponse {
  content: Medicine[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

@Component({
  selector: 'app-my-medicine',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './my-medicine.html',
  styleUrl: './my-medicine.scss',
  providers: [DatePipe]
})
export class MyMedicine implements OnInit {
  private http = inject(HttpClient);

  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<Medicine>([]);

  displayedColumns: string[] = [
    'productId',
    'productName',
    'productType',
    'productForm',
    'packaging',
    'originalPrice',
    'discountPrice',
    'discountPercentage',
    'isAvailable',
    'createdAt'
  ];

  totalElements = 0;
  pageIndex = 0;
  pageSize = 10;

  sortBy = 'productName';
  direction: SortDirection = 'asc';

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    // Search filters the records currently loaded from the API.
    this.dataSource.filterPredicate = (medicine, filter) => {
      const searchableText = [
        medicine.productId,
        medicine.productName,
        medicine.productType,
        medicine.productForm,
        medicine.packaging,
        medicine.brandName,
        medicine.manufacturer
      ].join(' ').toLowerCase();

      return searchableText.includes(filter);
    };

    this.getMyMedicines();
  }

  getMyMedicines(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const params = new HttpParams()
      .set('page', this.pageIndex.toString())
      .set('size', this.pageSize.toString())
      .set('sortBy', this.sortBy)
      .set('direction', this.direction);

    this.http
      .get<MedicineApiResponse>(
        API_URL + ENDPOINTS.GET_MY_MANAGED_MEDICINES,
        { params }
      )
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.content ?? [];
          this.totalElements = response.totalElements ?? 0;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching my medicines:', error);
          this.dataSource.data = [];
          this.totalElements = 0;
          this.errorMessage =
            'Unable to load medicines. Please try again.';
          this.isLoading = false;
        }
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (
      event.target as HTMLInputElement
    ).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getMyMedicines();
  }

 onSortChange(sort: Sort): void {
  this.sortBy = sort.active || 'productName';
  this.direction = sort.direction || 'asc';
  this.pageIndex = 0;
  this.getMyMedicines();
}

  trackByMedicineId(index: number, medicine: Medicine): number {
    return medicine.id;
  }
}
