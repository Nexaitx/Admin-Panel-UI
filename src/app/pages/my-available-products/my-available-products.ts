import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
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
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

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
    MatCheckboxModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatRadioModule,
    FormsModule,
    MatSlideToggleModule
  ],
  templateUrl: './my-available-products.html',
  styleUrls: ['./my-available-products.scss'],
  providers: [DatePipe]
})
export class MyAvailableProducts {
  displayedColumns: string[] = ['select', 's_no', 'id', 'name', 'category', 'stockQty', 'price', 'discount', 'vitoxyzPrice', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  http = inject(HttpClient);
  editingRow: any = null;
  selectedMedicine: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('discountDialog') discountDialog!: TemplateRef<any>;
  @ViewChild('availabilityDialog') availabilityDialog!: TemplateRef<any>;
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);
  dialogBulkDiscount: number | null = null;
  dialogSelectedCount: number = 0;
  dialogBulkStatus: boolean | null = null;
  discountForm !: FormGroup;
  availableForm !: FormGroup;
  fb = inject(FormBuilder);

  ngOnInit(): void {
    this.availableForm = this.fb.group({
      isAvailable: [false]
    });
    this.getMyAvailableProducts();
  }

  private showSnackbar(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
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

  saveAvailability(makeUnavailable: boolean) {
    const medIds = this.selection?.selected.map(m => m?.productId || m?.id) || [];
    if (!medIds.length) {
      // nothing selected
      return this.dialog.closeAll();
    }

    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) { headers = headers.set('Authorization', `Bearer ${token}`); }

    const body = {
      productIds: medIds,
      setAvailable: this.dialogBulkStatus
    };
    this.http.post(API_URL + ENDPOINTS.UPDATE_MEDICINE_AVAILABILITY, body, { headers }).subscribe({
      next: (res: any) => {
        if (makeUnavailable) {
          // remove unavailable items from current list
          this.dataSource.data = this.dataSource.data.filter((it: any) => !medIds.includes(it.productId || it.id));
          this.selection.clear();
        } else {
          // if made available, refresh list
          this.getMyAvailableProducts();
        }
        this.showSnackbar('Availability updated successfully');
      },
      error: (err) => {
        console.error('Error updating availability', err);
        this.showSnackbar('Failed to update availability');
      }
    });
  }
  saveDiscount() {
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
    });
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

  openDiscountDialog() {
    const dialogRef = this.dialog.open(this.discountDialog, {
      width: '800px',
      data: { form: this.discountForm }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveDiscount();
      }
    });
  }

  openAvailabilityDialog() {
    const dialogRef = this.dialog.open(this.availabilityDialog, {
      width: '800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      // result will be true (Yes) or false (No) or undefined (dismiss)
      if (result === true || result === false) {
        this.saveAvailability(result as boolean);
      }
    });
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

  onToggleChange(row: any, checked: boolean) {
    row._editedAvailable = !!checked;
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
}