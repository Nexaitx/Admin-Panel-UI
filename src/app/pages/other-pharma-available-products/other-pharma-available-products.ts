import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { API_URL, ENDPOINTS } from '../../core/const';
import { HttpClient } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-other-pharma-available-products',
  imports: [MatIconModule,
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
    MatButtonModule],
  templateUrl: './other-pharma-available-products.html',
  styleUrl: './other-pharma-available-products.scss',
  providers: [DatePipe]
})
export class OtherPharmaAvailableProducts {
  displayedColumns: string[] = ['select', 's_no', 'id', 'name', 'category', 'stockQty', 'otherPharmacistDiscPercentage', 'price', 'discount','vitoxyzPrice', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  http = inject(HttpClient);
  selection = new SelectionModel<any>(true, []);
  @ViewChild('availabilityDialog') availabilityDialog!: TemplateRef<any>;
  dialog = inject(MatDialog);
  dialogBulkDiscount: number | null = null;
  dialogSelectedCount: number = 0;
  dialogBulkStatus: boolean | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getOtherPharmacistAvaialbleMedicine();
    // this.dataSource = new MatTableDataSource(products);
  }

  ngAfterViewInit(): void {
    // 1. Initial sort on 'addedDate' descending
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.sort.sort({ id: 'addedDate', start: 'desc', disableClear: true });

    // 2. Disable sorting on the 's_no' column
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 's_no') {
        return 0; // Return a constant value or handle as needed
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
    // your logic to view details of product
    console.log('Viewing', product);
  }

  getOtherPharmacistAvaialbleMedicine() {
    this.http.get(API_URL + ENDPOINTS.GET_OTHER_PHARMACIST_AVAILABLE_MEDICINES).subscribe((res: any) => {
      this.dataSource.data = res;
      console.log(this.dataSource.data);
    })
  }

  openAvailabilityDialog() {
    const dialogRef = this.dialog.open(this.availabilityDialog, {
      width: '800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      // result will be true (Yes) or false (No) or undefined (dismiss)
      if (result === true || result === false) {
      }
    });
  }
}
