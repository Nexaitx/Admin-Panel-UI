import { Component, ViewChild, inject, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  MatDialog,
  MatDialogModule
} from '@angular/material/dialog';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { API_URL, ENDPOINTS } from '../../../core/const';

interface Medicine {
  discountRecordId: number;
  productId: string;
  productName: string;
  productType: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  discountAppliedAt: string;
  isActive: boolean;
  isAvailable: boolean;
  adminId: number;
  adminName: string;
  adminEmail: string;
  adminPhoneNumber: string;
  adminActive: boolean;
  adminDocumentVerified: boolean;
  adminCanAddMedicine: boolean;
  adminRole: string;
}

@Component({
  selector: 'app-all-medicine',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './all-medicine.html',
  styleUrl: './all-medicine.scss'
})
export class AllMedicine {

  http = inject(HttpClient);

  displayedColumns: string[] = [
    's_no',
    'productId',
    'productName',
    'productType',
    'originalPrice',
    'discountPrice',
    'discountPercentage',
    'isAvailable',
    'isActive',
    'adminName',
    'adminEmail',
    'adminPhoneNumber'
  ];

  dataSource = new MatTableDataSource<Medicine>([]);

  pageIndex = 0;
  pageSize = 10;
  totalItems = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dialog = inject(MatDialog);

    selectedMedicine: any = null;
    isMedicineLoading = false;

    @ViewChild('detailsDialog')
    detailsDialog!: TemplateRef<any>;

  ngOnInit(): void {
    this.getAllMedicines();

    this.dataSource.filterPredicate = (data: Medicine, filter: string) => {
      filter = filter.trim().toLowerCase();

      return (
        data.productName?.toLowerCase().includes(filter) ||
        data.productId?.toLowerCase().includes(filter) ||
        data.productType?.toLowerCase().includes(filter) ||
        data.adminName?.toLowerCase().includes(filter) ||
        data.adminEmail?.toLowerCase().includes(filter)
      );
    };
  }

  getAllMedicines(): void {

    const url =
      `${API_URL}${ENDPOINTS.GET_ALL_MEDICINES_BY_AVAILABILITY}` +
      `?page=${this.pageIndex}&size=${this.pageSize}`;

    this.http.get<any>(url).subscribe({

      next: (res) => {

        if (res?.success) {
          this.dataSource.data = res.discountRecords || [];
          this.totalItems = res.totalRecords || 0;
        } else {
          this.dataSource.data = [];
          this.totalItems = 0;
        }

      },

      error: (err) => {
        console.error('Error fetching all medicines:', err);
        this.dataSource.data = [];
        this.totalItems = 0;
      }

    });
  }

  openMedicineDetails(productId: string): void {

  this.selectedMedicine = null;
  this.isMedicineLoading = true;

  this.dialog.open(this.detailsDialog, {
    width: '900px',
    maxWidth: '95vw',
    maxHeight: '90vh'
  });

  const url =
    `${API_URL}${ENDPOINTS.GET_MEDICINE_DETAILS_BY_ID}${productId}`;

  this.http.get<any>(url).subscribe({

    next: (res) => {
      this.selectedMedicine = res;
      this.isMedicineLoading = false;
    },

    error: (err) => {
      console.error('Error fetching medicine details:', err);
      this.isMedicineLoading = false;
      this.selectedMedicine = null;
    }

  });
}

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.getAllMedicines();
  }

  applyFilter(event: Event): void {

    const filterValue =
      (event.target as HTMLInputElement).value;

    this.dataSource.filter =
      filterValue.trim().toLowerCase();

  }
}