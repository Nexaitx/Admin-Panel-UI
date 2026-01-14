import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { ColumnDef, CommonTableComponent } from '../../shared/common-table/common-table.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { API_URL, ENDPOINTS } from '../../core/const';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-requested-sub-categories',
  imports: [CommonTableComponent,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    CommonModule
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
  selectedStatus: string = 'ALL';
  private snackBar = inject(MatSnackBar);
  @ViewChild('otherSubcategory') otherSubcategory!: TemplateRef<any>;
  @ViewChild('deleteConfirmation') deleteConfirmation!: TemplateRef<any>;
  actionType: string = '';

  columns: ColumnDef[] = [
    { key: 'subCategoryId', header: 'Sub&nbsp;Category&nbsp;ID', sortable: true },
    { key: 'staffId', header: 'Staff&nbsp;ID', sortable: true },
    { key: 'staffName', header: 'Staff&nbsp;Name', sortable: true },
    { key: 'staffCategory', header: 'Staff&nbsp;Category', sortable: true },
    { key: 'phoneNo', header: 'Phone&nbsp;Number', sortable: true },
    { key: 'category', header: 'Category', sortable: true },
    { key: 'subCategory', header: 'Sub&nbsp;Category', sortable: true },
    { key: 'createdAt', header: 'Created&nbsp;At', sortable: true, type: 'date' },
    { key: 'updatedAt', header: 'Updated&nbsp;At', sortable: true, type: 'date' },
    { key: 'status', header: 'Status', sortable: true },
    { key: 'actions', header: 'Actions', type: 'actionApproveReject' }
  ];

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    const statusParam = this.selectedStatus === 'ALL' ? 'ALL' : this.selectedStatus;
    console.log(statusParam);
    this.http.get(API_URL + ENDPOINTS.GET_OTHER_SUBCATEGORY + statusParam).subscribe((data: any) => {
      this.dataSource.data = data.reverse();
    });
  }

  onRowView(event: any) {
    this.selectedRecord = event;
    const row = event.row || event;
    
    if (event.columnType === 'actionApproveReject' && row.status !== 'PENDING') {
      this.actionType = 'delete';
      this.dialog.open(this.deleteConfirmation, { width: '500px', minWidth: '400px' });
    } else {
      // Open approval dialog for create action
      this.actionType = 'approve';
      this.dialog.open(this.otherSubcategory, { width: '700px', minWidth: '600px' });
    }
  }

  onStatusChange(status: string) {
    this.selectedStatus = status;
    this.fetchData();
  }

  updateStatus(status: string) {
    const payload = {
      action: status,
      categoryName: this.selectedRecord.row.category,
      subcategoryValue: this.selectedRecord.row.subCategory,
      subcategoryLabel: this.selectedRecord.row.subCategory
    };
    this.http.post(API_URL + ENDPOINTS.UPDATE_STATUS_SUB_CATGEORY + this.selectedRecord.row.subCategoryId, payload).subscribe((response: any) => {
      this.snackBar.open('Sub Category Status Updated Successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
      this.fetchData();
      this.dialog.closeAll();
    });
  }

  deleteSubCategory() {
    const row = this.selectedRecord.row || this.selectedRecord;
    this.http.delete(API_URL + ENDPOINTS.DELETE_SUB_CATEGORY + row.subCategoryId).subscribe(
      (response: any) => {
        this.snackBar.open('Sub Category Deleted Successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.fetchData();
        this.dialog.closeAll();
      },
      (error: any) => {
        this.snackBar.open('Failed to delete Sub Category', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error']
        });
      }
    );
  }
}