import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { API_URL, ENDPOINTS } from '../../core/const';
import { ColumnDef, CommonTableComponent } from '../../shared/common-table/common-table.component';

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
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  @ViewChild('userDialogTemplate') userDialogTemplate!: TemplateRef<any>;

  dataSource = new MatTableDataSource<any>([]);
  userForm!: FormGroup;
  subRoles: any[] = []; // List of roles from API
  selectedUser: any = null;
  isEdit = false;

  columns: ColumnDef[] = [
    { key: 'staffName', header: 'Staff Name', sortable: true },
    { key: 'staffEmail', header: 'Email', sortable: true },
    { key: 'staffPhoneNumber', header: 'Phone', sortable: true },
    { key: 'roleName', header: 'Subrole', sortable: true }
  ];

  formFields: ColumnDef[] = [
    { key: 'name', header: 'Full Name', type: 'text' },
    { key: 'phoneNumber', header: 'Phone Number', type: 'text' },
    { key: 'email', header: 'Email Address', type: 'text' },
    { key: 'subRoleId', header: 'Assign Subrole', type: 'select', options: [] },
    { key: 'password', header: 'Password', type: 'password' },
    { key: 'confirmPassword', header: 'Confirm Password', type: 'confirmPassword' }
  ];

  ngOnInit(): void {
    // this.initForm();
    this.fetchSubRoles();
    this.getAccounts();
  }

  initForm() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      subRoleId: ['', Validators.required],
      password: [''],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    
    // If both fields are empty, no error
    if (!password && !confirmPassword) {
      return null;
    }
    
    // If both fields have value, check if they match
    if (password && confirmPassword) {
      return password === confirmPassword ? null : { 'passwordMismatch': true };
    }
    
    // If only one field has value, it's a mismatch
    return { 'passwordMismatch': true };
  }

  fetchSubRoles() {
    // Replace with your actual endpoint for getting the sub-roles list
    this.http.get(API_URL + ENDPOINTS.GET_SUBROLES).subscribe((res: any) => {
      this.subRoles = res;
      // populate select options for formFields
      const idx = this.formFields.findIndex(f => f.key === 'subRoleId');
      if (idx !== -1) {
        this.formFields[idx].options = (res || []).map((r: any) => ({ value: r.subRoleId, label: r.subRoleName }));
      }
    });
  }

  onTableSave(event: { row: any, isNew: boolean }) {
    const payload = { ...event.row };
    delete payload.confirmPassword;

    if (event.isNew) {
      this.http.post(API_URL + ENDPOINTS.SIGNUP, payload).subscribe({
        next: () => this.handleSuccess('Account created successfully'),
        error: () => this.snackBar.open('Signup failed', 'Close')
      });
    } else {
      // assume row has admin_id or some identifier
      const id = payload.admin_id || payload.id || this.selectedUser?.admin_id;
      if (!id) { this.snackBar.open('Missing identifier for update', 'Close'); return; }
      this.http.put(`${API_URL}${ENDPOINTS.UPDATE_ACCOUNT}/${id}`, payload).subscribe({
        next: () => this.handleSuccess('Account updated successfully'),
        error: () => this.snackBar.open('Update failed', 'Close')
      });
    }
  }

  getAccounts() {
    this.http.get(API_URL + ENDPOINTS.GET_ACCOUNT_BY_ROLE + '/all').subscribe((res: any) => {
      this.dataSource.data = res;
    });
  }

  openUserDialog(user: any = null) {
    this.isEdit = !!user;
    this.selectedUser = user;

    if (this.isEdit) {
      this.userForm.patchValue({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        subRoleId: user.subRoleId,
        password: '',
        confirmPassword: ''
      });
      // Remove password validation for editing
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('confirmPassword')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
      this.userForm.get('confirmPassword')?.updateValueAndValidity();
    } else {
      this.userForm.reset();
      // Set validators for creating new account
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
      this.userForm.get('confirmPassword')?.setValidators([Validators.required]);
      this.userForm.get('password')?.updateValueAndValidity();
      this.userForm.get('confirmPassword')?.updateValueAndValidity();
    }
    
    this.userForm.updateValueAndValidity();
    this.dialog.open(this.userDialogTemplate, { width: '600px' });
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    const payload = { ...this.userForm.value };
    delete payload.confirmPassword;

    if (this.isEdit) {
      this.http.put(`${API_URL}${ENDPOINTS.UPDATE_ACCOUNT}/${this.selectedUser.admin_id}`, payload).subscribe({
        next: () => this.handleSuccess('Account updated successfully'),
        error: () => this.snackBar.open('Update failed', 'Close')
      });
    } else {
      this.http.post(API_URL + ENDPOINTS.SIGNUP, payload).subscribe({
        next: () => this.handleSuccess('Account created successfully'),
        error: () => this.snackBar.open('Signup failed', 'Close')
      });
    }
  }

  handleSuccess(msg: string) {
    this.snackBar.open(msg, 'Close', { duration: 3000 });
    this.dialog.closeAll();
    this.getAccounts();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}