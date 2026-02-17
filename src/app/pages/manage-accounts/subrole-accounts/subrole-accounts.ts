import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { API_URL, ENDPOINTS } from '../../../core/const';
import { ColumnDef, CommonTableComponent } from '../../../shared/common-table/common-table.component';
import { ConfirmationDialog } from '../../confirmation-dialog/confirmation-dialog';

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-subrole-accounts',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,
    MatIconModule, CommonTableComponent
  ],
  templateUrl: './subrole-accounts.html',
  styleUrl: './subrole-accounts.scss',
})
export class SubroleAccounts implements OnInit {
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  @ViewChild('userDialogTemplate') userDialogTemplate!: TemplateRef<any>;

  dataSource = new MatTableDataSource<any>([]);
  userForm!: FormGroup;
  subRoles: any[] = [];
  selectedUser: any = null;
  isEdit = false;

  columns: ColumnDef[] = [
    { key: 'subRoleId', header: 'Subrole&nbsp;ID', sortable: true },
    { key: 'roleType', header: 'Subrole&nbsp;Type', sortable: true },
    { key: 'adminId', header: 'SubAdmin&nbsp;ID', sortable: true },
    { key: 'subRoleName', header: 'Subrole&nbsp;Name', sortable: true },
    { key: 'name', header: 'Full&nbsp;Name', sortable: true },
    { key: 'email', header: 'Email&nbsp;Address', sortable: true },
    { key: 'phoneNumber', header: 'Phone&nbsp;Number', sortable: true }
  ];

  formFields: ColumnDef[] = [
    { key: 'name', header: 'Full Name', type: 'text' },
    { key: 'phoneNumber', header: 'Phone Number', type: 'text' },
    { key: 'email', header: 'Email Address', type: 'text', disabledInEdit: true },
    { key: 'subRoleId', header: 'Assign Subrole', type: 'select', options: [] },
    { key: 'password', header: 'Password', type: 'password' },
    { key: 'confirmPassword', header: 'Confirm Password', type: 'confirmPassword' }
  ];

  ngOnInit(): void {
    this.fetchSubRoles();
    this.getAccounts();
  }

  fetchSubRoles() {
    this.http.get(API_URL + ENDPOINTS.GET_SUBROLES).subscribe((res: any) => {
      this.subRoles = res;
      const idx = this.formFields.findIndex(f => f.key === 'subRoleId');
      if (idx !== -1) {
        this.formFields[idx].options = (res || []).map((r: any) => ({ value: r.subRoleId, label: r.subRoleName }));
      }
    });
  }

  onTableSave(event: { row: any, isNew: boolean }) {
    const payload = { ...event.row };
    if (event.isNew) {
      this.http.post(API_URL + ENDPOINTS.CREATE_SUBROLE_ACCOUNT, payload).subscribe({
        next: () => this.handleSuccess('Sub role account created successfully'),
        error: () => this.snackBar.open('Signup failed', 'Close')
      });
    } else {
      const id = payload.adminId;
      if (!id) { this.snackBar.open('Missing identifier for update', 'Close'); return; }
      this.http.put(`${API_URL}${ENDPOINTS.UPDATE_SUBROLE_ACCOUNT}/${id}`, payload).subscribe({
        next: () => this.handleSuccess('Sub role account updated successfully'),
        error: () => this.snackBar.open('Update failed', 'Close')
      });
    }
  }

  onTableDelete(row: any) {
    const id = row.adminId;
    if (!id) {
      this.snackBar.open('Missing identifier for deletion', 'Close');
      return;
    }

    const confirmRef = this.dialog.open(ConfirmationDialog, {
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete this sub-role account?`,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete'
      }
    });

    confirmRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`${API_URL}${ENDPOINTS.DELETE_SUBROLE_ACCOUNT}/${id}`).subscribe({
          next: () => this.handleSuccess('Sub role account deleted successfully'),
          error: () => this.snackBar.open('Delete failed', 'Close')
        });
      }
    });
  }

  getAccounts() {
    this.http.get(API_URL + ENDPOINTS.GET_SUBROLE_ACCOUNTS).subscribe((res: any) => {
      this.dataSource.data = res;
    });
  }

  handleSuccess(msg: string) {
    this.snackBar.open(msg, 'Close', { duration: 3000 });
    this.dialog.closeAll();
    this.getAccounts();
  }

}