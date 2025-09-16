import { Component, inject, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { API_URL, ENDPOINTS } from '../../../core/const';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { 'passwordMismatch': true };
  }
  return null;
};

@Component({
  selector: 'app-dieticians-list',
  imports: [
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatMenuModule,
    MatSidenavModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './dieticians-list.html',
  styleUrl: './dieticians-list.scss',
})
export class DieticiansList {
http = inject(HttpClient);
  fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  accounts: any[] = [];
  selectedRecord: any;

  isDrawerOpen: boolean = false;
  selectedUser: any | null = null;

  displayedColumns: string[] = ['name', 'email', 'phone', 'contact', 'aadhaar', 'actions'];

  dataSource: MatTableDataSource<any>;
  userForm: FormGroup;
  isEdit: boolean = false;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.dataSource = new MatTableDataSource<any>([]);
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      role: ['doctor', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  onKeyPress(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    const phoneNumberControl = this.userForm.get('phoneNumber');
    // Allow digits (0-9)
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
    if (phoneNumberControl && phoneNumberControl.value && phoneNumberControl.value.length >= 10 && charCode > 31) {
      event.preventDefault();
    }
  }

  ngOnInit(): void {
    this.getAccounts();
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const dataStr = `${data.name} ${data.email} ${data.phone} ${data.contact} ${data.aadhaar} ${data.address} ${data.city}`.toLowerCase();
      return dataStr.includes(filter.toLowerCase());
    };
  }

  // ngAfterViewInit(): void {
  //   this.dataSource.sort = this.sort;
  //   this.dataSource.paginator = this.paginator;
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAccounts() {
    this.http.get(API_URL + ENDPOINTS.GET_ACCOUNT_BY_ROLE + '/dietician').subscribe((res: any) => {
      this.accounts = res;
      this.mapAndSetDataSource(this.accounts);
    })
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      // Create a temporary object without confirmPassword for the API call
      const formData = { ...this.userForm.value };
      if (this.isEdit) {

        this.http.put(`${API_URL}${ENDPOINTS.UPDATE_ACCOUNT}/${this.selectedRecord.user_id}`, formData).subscribe({
          next: (res: any) => {
            this.getAccounts();
            this.snackBar.open('Update successful!', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
          },
          error: (error: any) => {
            this.snackBar.open('Update failed. Please try again.', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
          }
        });
      } else {
        this.http.post(API_URL + ENDPOINTS.SIGNUP, formData).subscribe({
          next: (res: any) => {
            this.getAccounts();
            this.snackBar.open('Dietician Account created successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
          },
          error: (error: any) => {
            this.snackBar.open('Registration failed. Please try again.', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
            console.error('API Error:', error);
          }
        });
      }
    }
  }
  deleteElement(element: any) {
    console.log(`Delete ${element.name} (ID: ${element.user_id})`);
    alert(`Deleting: ${element.name} (User ID: ${element.user_id})`);
  }

  openUserDrawer() {
    console.log(this.selectedRecord)
    if (this.isEdit) {
      this.userForm.patchValue(this.selectedRecord);
    }
    this.isDrawerOpen = true;
  }

  closeUserDrawer() {
    this.isDrawerOpen = false;
    this.selectedUser = null;
  }

  mapAndSetDataSource(users: any[]): void {
    const mappedUsers: any[] = users.map(user => ({
      user_id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone_number,
      contact: user.email,
      aadhaar: user.aadhaar_verified ? 'Verified' : 'Not Verified',
      aadhaarUrl: user.aadhaar_card_attachment || null,
      originalUser: user
    }));
    this.dataSource.data = mappedUsers;
    
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
}