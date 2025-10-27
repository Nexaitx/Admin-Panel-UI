import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { API_URL, ENDPOINTS } from '../../core/const';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { 'passwordMismatch': true };
  }
  return null;
};

@Component({
  selector: 'app-pharmacist',
  imports: [MatCardModule,
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
    ReactiveFormsModule,
    MatSlideToggleModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatRadioModule,
    FormsModule
  ],
  templateUrl: './pharmacist.html',
  styleUrl: './pharmacist.scss'
})
export class Pharmacist {
  http = inject(HttpClient);
  fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  accounts: any[] = [];
  selectedRecord: any;
  view: boolean = false;
  isDrawerOpen: boolean = false;
  selectedUser: any | null = null;
  permission: boolean = false;
  displayedColumns: string[] = ['name', 'email', 'actions'];

  dataSource: MatTableDataSource<any>;
  userForm: FormGroup;
  isEdit: boolean = false;
  submittingVerification: boolean = false;
  toggleChecked: boolean = false;
  verification: boolean = false;
  dialog = inject(MatDialog);
  @ViewChild('discountDialog') discountDialog!: TemplateRef<any>;
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
      role: ['pharmacist', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  onKeyPress(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    const phoneNumberControl = this.userForm.get('phoneNumber');
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
      const dataStr = `${data.name} ${data.email}`.toLowerCase();
      return dataStr.includes(filter.toLowerCase());
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAccounts() {
    this.http.get(API_URL + ENDPOINTS.GET_ACCOUNT_BY_ROLE + '/pharmacist').subscribe((res: any) => {
      this.accounts = res;
      this.mapAndSetDataSource(this.accounts);
    })
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      // Create a temporary object without confirmPassword for the API call
      const formData = { ...this.userForm.value };
      delete formData.confirmPassword;
      if (this.isEdit) {
        this.http.put(`${API_URL}${ENDPOINTS.UPDATE_ACCOUNT}/${this.selectedUser.admin_id}`, formData).subscribe({
          next: (res: any) => {
            this.snackBar.open('Update successful!', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
            console.log('API Response:', res);
          },
          error: (error: any) => {
            this.snackBar.open('Update failed. Please try again.', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
            console.error('API Error:', error);
          }
        });
      } else {
        this.http.post(API_URL + ENDPOINTS.SIGNUP, formData).subscribe({
          next: (res: any) => {
            this.snackBar.open('Registration successful!', 'Close', {
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
    console.log(this.selectedUser);
    if (this.isEdit || this.view || this.verification) {
      this.http.get(`${API_URL}${ENDPOINTS.GET_ADMIN_BY_ID}${this.selectedUser?.user_id}`).subscribe((res: any) => {
        this.selectedUser = res;
        this.userForm.patchValue(this.selectedUser);
        this.toggleChecked = res.active
      });
    }
    else {
      this.userForm.reset();
    }
    this.isDrawerOpen = true;
  }

  closeUserDrawer() {
    this.isDrawerOpen = false;
    this.selectedUser = null;
    this.verification = false
  }

  mapAndSetDataSource(users: any[]): void {
    const mappedUsers: any[] = users.map(user => ({
      user_id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone_number,
      contact: user.email,
      aadhaar: user.aadhaar_verified ? 'Verified' : 'Not Verified',
      address: user.address,
      city: user.city,
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

  submitVerification() {
    console.log(this.selectedUser)
    if (!this.selectedUser || !this.selectedUser?.admin_id) {
      this.snackBar.open('Admin id missing.', 'Close', { duration: 3000, panelClass: ['snackbar-error'] });
      return;
    }
    const adminId = this.selectedUser?.admin_id;
    const url = `${API_URL}${ENDPOINTS.UPDATE_VERIFICATION_ACCESS}/${adminId}/toggle-status`;
    this.submittingVerification = true;

    this.http.put(url, null).subscribe({
      next: (res: any) => {
        this.submittingVerification = false;
        if (res.active === false) {
          this.snackBar.open(`${this.selectedUser.name} not Verified.`, 'Close', { duration: 3000, panelClass: ['snackbar-success'] });
        }
        else {
          this.snackBar.open(`${this.selectedUser.name} Verified successfully.`, 'Close', { duration: 3000, panelClass: ['snackbar-success'] });
        }
      },
      error: (err: any) => {
        console.error(err);
        this.submittingVerification = false;
        this.snackBar.open('Failed to verified. Try again later.', 'Close', { duration: 4000, panelClass: ['snackbar-error'] });
      }
    });
  }


  openDialog(m: any) {
    this.http.get(`${API_URL}${ENDPOINTS.GET_ADMIN_BY_ID}${this.selectedUser?.user_id}`).subscribe((res: any) => {
      this.permission = res.canAddMedicine
    });
    const dialogRef = this.dialog.open(this.discountDialog, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  updateMedicinePermission() {
    let url = `${API_URL}${ENDPOINTS.UPDATE_MEDICINE_PERMISSION}${this.selectedUser.user_id}/toggle-medicine-permission`;
    this.http.put(url, null).subscribe((res: any) => {
      if (res.canAddMedicine === true) {
        this.snackBar.open('Permission Granted', 'Close', { duration: 3000, panelClass: ['snackbar-success'] });
      }
      else {
        this.snackBar.open('Permission Denied', 'Close', { duration: 3000, panelClass: ['snackbar-success'] });
      }
    },
      (err: any) => {
        console.error(err);
        this.snackBar.open('Failed to give permission. Try again later.', 'Close', { duration: 4000, panelClass: ['snackbar-error'] });
      })
  }
}