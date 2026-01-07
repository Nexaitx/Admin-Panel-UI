import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { ColumnDef, CommonTableComponent } from '../../shared/common-table/common-table.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { API_URL, ENDPOINTS } from '../../core/const';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-requested-sub-categories',
  imports: [CommonTableComponent,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './requested-sub-categories.html',
  styleUrl: './requested-sub-categories.scss',
})
export class RequestedSubCategories {
  selectedRecord: any;
  http = inject(HttpClient);
  router = inject(Router);
  dataSource = new MatTableDataSource<any>();
  dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  @ViewChild('otherSubcategory') otherSubcategory!: TemplateRef<any>;

  columns: ColumnDef[] = [
    { key: 'subCategoryId', header: 'Sub&nbsp;Category&nbsp;ID', sortable: true },
    { key: 'phoneNo', header: 'Phone&nbsp;Number', sortable: true },
    { key: 'category', header: 'Category', sortable: true },
    { key: 'subCategory', header: 'Sub&nbsp;Category', sortable: true },
    { key: 'createdAt', header: 'Created&nbsp;At', sortable: true, type: 'date' },
    { key: 'updatedAt', header: 'Updated&nbsp;At', sortable: true, type: 'date' },
    { key: 'actions', header: 'Actions', type: 'actionApproveReject' }
  ];

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.http.get(API_URL + ENDPOINTS.GET_OTHER_SUBCATEGORY).subscribe((data: any) => {
      this.dataSource.data = data.reverse();
    });
  }

  onRowView(row: any) {
    this.selectedRecord = row;
    this.dialog.open(this.otherSubcategory, { width: '700px', minWidth: '600px' });
  }

  saveRequest() {
    this.snackBar.open('Sub Category Successfully Created', 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}