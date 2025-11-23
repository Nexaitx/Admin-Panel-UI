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
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-top-discounted-medicines',
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
    MatTooltipModule
  ],
  templateUrl: './top-discounted-medicines.html',
  styleUrl: './top-discounted-medicines.scss'
})
export class TopDiscountedMedicines {
 http = inject(HttpClient);
  displayedColumns: string[] = ['select', 's_no', 'id', 'name', 'category', 'stockQty', 'price', 'discount', 'vitoxyzPrice', 'status', 'active', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  @ViewChild('availabilityDialog') availabilityDialog!: TemplateRef<any>;
  dialog = inject(MatDialog);
  dialogBulkDiscount: number | null = null;
  dialogSelectedCount: number = 0;
  dialogBulkStatus: boolean | null = null;
  editingRow: any = null;
  selectedMedicine: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.getTopDiscounts();
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
      this.paginator.page.subscribe(() => this.getTopDiscounts());
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      this.getTopDiscounts();
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

  onToggleChange(row: any, checked: boolean) {
    row._editedAvailable = !!checked;
  }

  onEdit(row: any) {
    this.dataSource.data.forEach(r => {
      if (r !== row) {
        r._editing = false;
        delete r._editedDiscount;
        delete r._editedAvailable;
      }
    });

    this.editingRow = row;
    this.selectedMedicine = row;
    row._editing = true;
    row._editedDiscount = row.discountPercentage ?? 0;
    row._editedAvailable = (row.showInApp ?? row.active) ?? false;
  }

  onSave(row: any) {
    const productId = row.productId ?? row.medicineId ?? row.id;
    const isAvailable = typeof row._editedAvailable === 'boolean' ? row._editedAvailable : !!(row.showInApp ?? row.active);
    const discountPercentage = Number(row._editedDiscount ?? row.discountPercentage ?? 0);

    const payload = { medicines: [{ productId: String(productId), isAvailable, discountPercentage }] };
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) { headers = headers.set('Authorization', `Bearer ${token}`); }

    this.http.post(API_URL + ENDPOINTS.UPDATE_BULK_AVAILABILITY_DISCOUNT, payload, { headers })
      .subscribe({
        next: () => {
          row.discountPercentage = discountPercentage;
          const avail = isAvailable;
          if ('showInApp' in row) { row.showInApp = avail; }
          if ('active' in row) { row.active = avail; }
          row._editing = false;
          delete row._editedDiscount;
          delete row._editedAvailable;
          this.dataSource.data = [...this.dataSource.data];
          this.editingRow = null;
          this.showSuccess('Medicine updated successfully');
        },
        error: (err) => {
          console.error('Update failed', err);
          this.showError('Failed to update medicine');
        }
      });
  }

  onCancel(row: any) {
    if (!row) { return; }
    delete row._editedDiscount;
    delete row._editedAvailable;
    row._editing = false;
    if (this.editingRow === row) { this.editingRow = null; }
    this.dataSource.data = [...this.dataSource.data];
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
  getTopDiscounts() {
    const page = this.paginator ? this.paginator.pageSize : 10;
    const params = new HttpParams()
      .set('count', String(page));

    this.http.get(API_URL + ENDPOINTS.TOP_DISCOUNTED_MEDICINES, { params }).subscribe((res: any) => {
      if (res && Array.isArray(res.discountRecords)) {
        this.dataSource.data = res.discountRecords.reverse();
        if (this.paginator) { this.paginator.length = res.length; }
      } else if (res && res.discountRecords) {
        this.dataSource.data = Array.isArray(res.discountRecords) ? res.discountRecords.reverse() : [];
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
