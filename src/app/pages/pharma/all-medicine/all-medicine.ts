import { Component, ViewChild, inject, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  MatDialog,
  MatDialogModule
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

import { MatTableDataSource, MatTableModule, } from '@angular/material/table';
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
    MatDialogModule,
    MatSelectModule   
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

  // ✅ NEW: availability filter — 'all' | 'true' | 'false'
  availabilityFilter: 'all' | 'true' | 'false' = 'true';

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

  /**
   * ✅ Updated API call using new endpoint
   * GET /api/medicines/checkmedicineavailibility/bypharmacistmedicine
   *     ?isAvailable=true|false&page=0&size=10
   */
 getAllMedicines(): void {

  let url =
    `${API_URL}${ENDPOINTS.GET_MEDICINES_BY_PHARMACIST_AVAILABILITY}`;

  // Only send isAvailable when filter is true or false
  if (this.availabilityFilter !== 'all') {
    url += `?isAvailable=${this.availabilityFilter}`;
    url += `&page=${this.pageIndex}`;
    url += `&size=${this.pageSize}`;
  } else {
    // For "all", don't send isAvailable
    url += `?page=${this.pageIndex}`;
    url += `&size=${this.pageSize}`;
  }

  console.log('Medicine API URL:', url);

  this.http.get<any>(url).subscribe({

    next: (res) => {
      console.log('Medicine API Response:', res);

      if (res?.success) {
        this.dataSource.data = res.discountRecords || [];
        this.totalItems =
          res.totalRecords ||
          res.discountRecords?.length ||
          0;
      } else {
        this.dataSource.data = [];
        this.totalItems = 0;
      }
    },

    error: (err) => {
      console.error('Error fetching medicines:', err);
      this.dataSource.data = [];
      this.totalItems = 0;
    }

  });
}

  /** ✅ NEW: availability change handler */
  onAvailabilityChange(value: 'all' | 'true' | 'false'): void {
    this.availabilityFilter = value;
    this.pageIndex = 0;                 // reset to first page
    if (this.paginator) {
      this.paginator.pageIndex = 0;     // keep paginator in sync
    }
    this.dataSource.filter = '';        // optional: clear local search
    this.getAllMedicines();
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
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}