import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { API_URL, ENDPOINTS } from '../../core/const';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-all-pharma-available-products',
  imports: [
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatMenuModule,
    CommonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatRadioModule,
    FormsModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSelectModule
  ],
  templateUrl: './all-pharma-available-products.html',
  styleUrl: './all-pharma-available-products.scss'
})
export class AllPharmaAvailableProducts {
  http = inject(HttpClient);
  displayedColumns: string[] = ['select', 's_no', 'id', 'name', 'category', 'stockQty', 'price', 'discount', 'vitoxyzPrice', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  @ViewChild('availabilityDialog') availabilityDialog!: TemplateRef<any>;
  dialog = inject(MatDialog);
  dialogBulkDiscount: number | null = null;
  dialogSelectedCount: number = 0;
  dialogBulkStatus: boolean | null = null;
  editingRow: any = null;
  selectedMedicine: any = null;
  // pharmacist filter + toggle state
  pharmacists: any[] = [];
  selectedPharmacist: number | null = null;
  showPharmacistToggle = false;
  pharmacistToggleChecked = false; // default unchecked -> isActive = false
  // medicines select
  medicines: any[] = [];
  selectedMedicineId: string | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  snackBar = inject(MatSnackBar);
  


  ngOnInit() {
    this.getPharmacists();
    this.getAllAvailableProducts();
    this.getAllMedicines();
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

    if (this.paginator) {
      this.paginator.page.subscribe(() => this.getAllAvailableProducts());
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      this.getAllAvailableProducts();
    }
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  onView(product: any) {
    console.log('Viewing', product);
  }

  openAvailabilityDialog() {
    const dialogRef = this.dialog.open(this.availabilityDialog, {
      width: '800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true || result === false) {
      }
    });
  }

  onPharmacistChange(pharmacistId: any) {
    this.selectedPharmacist = pharmacistId ? Number(pharmacistId) : null;
    this.showPharmacistToggle = !!this.selectedPharmacist;
    // default to unchecked when a pharmacist is chosen
    this.pharmacistToggleChecked = false;
    // fetch products for this pharmacist with isActive = false by default
    this.fetchByPharmacist(false);
  }

  onPharmacistToggleChange(event: any) {
    const isActive = !!event.checked;
    this.pharmacistToggleChecked = isActive;
    this.fetchByPharmacist(isActive);
  }

  fetchByPharmacist(isActive: boolean) {
    if (!this.selectedPharmacist) { return; }
    const page = this.paginator ? this.paginator.pageIndex : 0;
    const size = this.paginator ? (this.paginator.pageSize || 10) : 10;
    let params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('isActive', String(isActive));

    this.http.get(API_URL + ENDPOINTS.GET_PHARMACIST_MEDICINE + this.selectedPharmacist + '/togglestatus', { params }).subscribe((res: any) => {
      if (res) {
        this.dataSource.data = res.discountRecords;
        if (this.paginator) { this.paginator.length = res.length; }
      } else if (res && res.discountRecords) {
        this.dataSource.data = Array.isArray(res.discountRecords) ? res.discountRecords : [];
        if (this.paginator && typeof res.totalElements === 'number') {
          this.paginator.length = res.totalElements;
        }
      } else {
        this.dataSource.data = [];
      }
    }, err => {
      console.error('Failed to fetch products by pharmacist', err);
      this.showError('Failed to fetch products for selected pharmacist');
    });
  }

  onDisableMedicine() {
    // Build ids array from either selected rows or the single selectedMedicine
    let ids: string[] = [];
    if (this.selection && this.selection.selected && this.selection.selected.length > 0) {
      ids = this.selection.selected.map((it: any) => String(it.productId ?? it.medicineId ?? it.id));
    } else if (this.selectedMedicine) {
      ids = [String(this.selectedMedicine.productId ?? this.selectedMedicine.medicineId ?? this.selectedMedicine.id)];
    }

    if (!ids.length) {
      this.showError('No products selected to disable');
      return;
    }

    const body = { ids, deleted: true };
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) { headers = headers.set('Authorization', `Bearer ${token}`); }

    this.http.post(API_URL + ENDPOINTS.DISABLE_MEDICINE_PERMANENTLY, body, { headers }).subscribe((res: any) => {
      // Close any open dialogs, clear selection and refresh table from server
      try { this.dialog.closeAll(); } catch (e) { /* ignore */ }
      this.selection.clear();
      this.selectedMedicine = null;
      this.getAllAvailableProducts();
      this.showSuccess('Selected products disabled successfully');
    }, err => {
      console.error('Disable failed', err);
      this.showError('Failed to disable selected products');
    });
  }


  getPharmacists() {
    this.http.get(API_URL + ENDPOINTS.GET_ACCOUNT_BY_ROLE + '/pharmacist').subscribe((res: any) => {
      this.pharmacists = res
    })
  }

  getAllMedicines() {
    // this.http.get(API_URL + ENDPOINTS.GET_OTC_MEDICINES).subscribe((res: any) => {
    //   if (Array.isArray(res)) {
    //     this.medicines = res;
    //   } else if (res && res.discountRecords) {
    //     this.medicines = res.discountRecords;
    //   } else {
    //     this.medicines = [];
    //   }
    // }, err => {
    //   console.error('Failed to load medicines for selector', err);
    //   this.medicines = [];
    // });
  }

  onMedicineChange(productId: any) {
    if (!productId) { return; }
    const page = this.paginator ? this.paginator.pageIndex : 0;
    const size = this.paginator ? (this.paginator.pageSize || 10) : 10;
    const params = new HttpParams().set('page', String(page)).set('size', String(size));

    const url = API_URL + ENDPOINTS.GET_PHARMACISTS_MEDICINE + String(productId);
    this.http.get(url, { params }).subscribe((res: any) => {
      if (res && Array.isArray(res)) {
        this.dataSource.data = res;
        if (this.paginator) { this.paginator.length = res.length; }
      } else if (res && res.content) {
        this.dataSource.data = Array.isArray(res.content) ? res.content : [];
        if (this.paginator && typeof res.totalElements === 'number') { this.paginator.length = res.totalElements; }
      } else {
        this.dataSource.data = [];
      }
    }, err => {
      console.error('Failed to fetch pharmacists by product id', err);
      this.showError('Failed to fetch pharmacists for the selected product');
    });
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error']
    });
  }
  getAllAvailableProducts() {
    const page = this.paginator ? this.paginator.pageIndex : 0;
    const size = this.paginator ? (this.paginator.pageSize || 10) : 10;
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('sortDirection', String('desc'));

    this.http.get(API_URL + ENDPOINTS.ALL_AVAILABLE_MEDICINE, { params }).subscribe((res: any) => {
      // support both paged responses (res.content) or plain arrays
      if (res && Array.isArray(res)) {
        this.dataSource.data = res;
        if (this.paginator) { this.paginator.length = res.length; }
      } else if (res && res.content) {
        this.dataSource.data = Array.isArray(res.content) ? res.content : [];
        if (this.paginator && typeof res.totalElements === 'number') {
          this.paginator.length = res.totalElements;
        }
      } else {
        this.dataSource.data = [];
      }
    }, err => {
      console.error('Failed to fetch available products', err);
    });
  }
}
