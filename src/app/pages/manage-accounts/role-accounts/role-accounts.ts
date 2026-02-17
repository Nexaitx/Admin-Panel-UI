import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { API_URL, ENDPOINTS } from '../../../core/const';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ColumnDef, CommonTableComponent } from '../../../shared/common-table/common-table.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from '../../confirmation-dialog/confirmation-dialog';

interface Account {
  name: string;
  roleName: string;
  email: string;
  phone: string;
}
@Component({
  selector: 'app-role-accounts',
  imports: [
    CommonTableComponent
  ],
  templateUrl: './role-accounts.html',
  styleUrl: './role-accounts.scss',
})
export class RoleAccounts {
  @ViewChild(CommonTableComponent) commonTable!: CommonTableComponent;
  dataSource = new MatTableDataSource<Account>([]);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  selectedRecord: any = null;
  roles: any;

  columns: ColumnDef[] = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'name', header: 'Full&nbsp;Name', sortable: true },
    { key: 'email', header: 'Email&nbsp;Address', sortable: true },
    { key: 'roleName', header: 'Role&nbsp;Type', sortable: true }
  ];

  formFields: ColumnDef[] = [
    { key: 'name', header: 'Full Name', type: 'text' },
    { key: 'phoneNumber', header: 'Phone Number', type: 'text' },
    { key: 'email', header: 'Email Address', type: 'text', disabledInEdit: true },
    { key: 'roleName', header: 'Assign Role', type: 'select', options: [] },
    { key: 'password', header: 'Password', type: 'password' },
    { key: 'confirmPassword', header: 'Confirm Password', type: 'confirmPassword' }
  ];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getRoles();
    this.loadAccounts();
  }

  getRoles() {
    this.http.get(API_URL + ENDPOINTS.GET_ROLES).subscribe((res: any) => {
      this.roles = res;
      const idx = this.formFields.findIndex(f => f.key === 'roleName');
      if (idx !== -1) {
        this.formFields[idx].options = (res || []).map((r: any) => ({ value: r.roleType, label: r.roleType }));
      }
    });
  }

  loadAccounts() {
    this.http.get(API_URL + ENDPOINTS.GET_ACCOUNTS)
      .subscribe((res: any) => {
        this.dataSource.data = res.reverse();
      });
  }

  onTableSave(event: { row: any, isNew: boolean }) {
    const payload = { ...event.row };
    if (event.isNew) {
      this.http.post(API_URL + ENDPOINTS.SIGNUP, payload).subscribe({
        next: () => this.handleSuccess('Main role account created successfully'),
        error: () => this.snackBar.open('Signup failed', 'Close')
      });
    } else {
      const id = payload.id;
      if (!id) {
        this.snackBar.open('Missing identifier for update', 'Close');
        return;
      }
      this.http.put(`${API_URL}${ENDPOINTS.UPDATE_ACCOUNT}/${id}`, payload).subscribe({
        next: () => this.handleSuccess('Sub role account updated successfully'),
        error: () => this.snackBar.open('Update failed', 'Close')
      });
    }
  }

  onTableDelete(row: any) {
    const id = row.id;
    if (!id) {
      this.snackBar.open('Missing identifier for deletion', 'Close');
      return;
    }

    const confirmRef = this.dialog.open(ConfirmationDialog, {
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete this main-role account?`,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete'
      }
    });

    confirmRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`${API_URL}${ENDPOINTS.DELETE_ACCOUNT}${id}`).subscribe({
          next: () => this.handleSuccess('Main role account deleted successfully'),
          error: () => this.snackBar.open('Delete failed', 'Close')
        });
      }
    });
  }

  handleSuccess(msg: string) {
    this.snackBar.open(msg, 'Close', { duration: 3000 });
    this.dialog.closeAll();
    this.loadAccounts();
  }

  onCreate() {
    // open create dialog or navigation
  }
}

