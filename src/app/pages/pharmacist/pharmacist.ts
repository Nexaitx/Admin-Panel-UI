import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { API_URL, ENDPOINTS } from '../../core/const';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
import { MatTabsModule } from '@angular/material/tabs';
import { AddressDialogComponent } from '../../shared/address-dialog/address-dialog';

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
  imports: [
    MatCardModule, MatTableModule, MatSortModule, MatPaginatorModule,
    MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule,
    CommonModule, MatMenuModule, MatSidenavModule, MatSelectModule,
    ReactiveFormsModule, MatSlideToggleModule, FormsModule,
    MatProgressSpinnerModule, MatDialogModule, MatRadioModule,
    MatTabsModule
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
  fullDetails: any = null;              //  full details for view mode
  loadingFullDetails = false;
  permission: boolean = false;

  displayedColumns: string[] = [
    's_no', 'pharmaId', 'pharmacyName', 'name', 'phone', 'email',
    'address', 'city', 'rating', 'verified', 'createdOn', 'actions'
  ];

  dataSource: MatTableDataSource<any>;
  userForm: FormGroup;
  isEdit: boolean = false;
  submittingVerification: boolean = false;
  toggleChecked: any = '';
  verification: boolean = false;
  dialog = inject(MatDialog);

  @ViewChild('discountDialog') discountDialog!: TemplateRef<any>;
  @ViewChild('verificationDialog') verificationDialog!: TemplateRef<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  sortBy = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

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
    if (charCode > 31 && (charCode < 48 || charCode > 57)) event.preventDefault();
    if (phoneNumberControl?.value?.length >= 10 && charCode > 31) event.preventDefault();
  }

  ngOnInit(): void {
    this.getAccounts();
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const dataStr = `${data.name} ${data.email} ${data.phone}`.toLowerCase();
      return dataStr.includes(filter.toLowerCase());
    };
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe((s: any) => {
      this.sortBy = s.active || 'name';
      this.sortDirection = (s.direction || 'asc') as 'asc' | 'desc';
      this.pageIndex = 0;
      if (this.paginator) this.paginator.firstPage();
      this.getAccounts();
    });

    this.paginator.page.subscribe((page: PageEvent) => {
      this.pageIndex = page.pageIndex;
      this.pageSize = page.pageSize;
      this.getAccounts();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  getAccounts(): void {
    const params = new HttpParams()
      .set('page', String(this.pageIndex))
      .set('size', String(this.pageSize))
      .set('sortBy', this.sortBy)
      .set('direction', this.sortDirection);

    const url = `${API_URL}${ENDPOINTS.GET_ACCOUNT_BY_ROLE_PAGINATED}/pharmacist`;

    this.http.get<any>(url, { params }).subscribe({
      next: (res: any) => {
        const admins = res?.admins ?? res?.content ?? res?.data ?? [];
        const total = res?.totalElements ?? res?.total ?? res?.totalCount ?? admins.length;
        this.accounts = admins;
        this.mapAndSetDataSource(admins);
        this.totalElements = total;
        if (this.paginator) {
          this.paginator.length = total;
          this.paginator.pageIndex = this.pageIndex;
          this.paginator.pageSize = this.pageSize;
        }
      },
      error: (err) => {
        console.error('Error fetching pharmacists:', err);
        this.dataSource.data = [];
        this.totalElements = 0;
      }
    });
  }

  /**
   *  Fetch full details for View / Verification mode
   * GET /getAdminFullDetails/{adminId}
   */
  getAdminFullDetails(adminId: number): void {
    if (!adminId) return;
    this.loadingFullDetails = true;

    this.http.get<any>(`${API_URL}${ENDPOINTS.GET_ADMIN_FULL_DETAILS}/${adminId}`).subscribe({
      next: (res: any) => {
        this.fullDetails = res;
        this.selectedUser = res;    // drawar bindings ke liye
        this.toggleChecked = res?.documentVerification ?? 'PENDING';
        this.loadingFullDetails = false;
      },
      error: (err) => {
        this.loadingFullDetails = false;
        console.error('Error fetching full details:', err);
        this.snackBar.open('Failed to load full details', 'Close',
          { duration: 3000, panelClass: ['snackbar-error'] });
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formData = { ...this.userForm.value };
      delete formData.confirmPassword;

      if (this.isEdit) {
        this.http.put(`${API_URL}${ENDPOINTS.UPDATE_ACCOUNT}/${this.selectedUser.admin_id}`, formData).subscribe({
          next: () => {
            this.snackBar.open('Update successful!', 'Close',
              { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top' });
            this.getAccounts();
          },
          error: () => {
            this.snackBar.open('Update failed. Please try again.', 'Close',
              { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top' });
          }
        });
      } else {
        this.http.post(API_URL + ENDPOINTS.SIGNUP, formData).subscribe({
          next: () => {
            this.snackBar.open('Registration successful!', 'Close',
              { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top' });
            this.getAccounts();
          },
          error: () => {
            this.snackBar.open('Registration failed. Please try again.', 'Close',
              { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top' });
          }
        });
      }
    }
  }

  deleteElement(element: any) {
    alert(`Deleting: ${element.name} (User ID: ${element.user_id})`);
  }

  /**
   *  Open drawer. If `view` OR `verification` → fetch full details.
   */
  openUserDrawer() {
    if (this.isEdit || this.view || this.verification) {
      const adminId = this.selectedUser?.user_id ?? this.selectedUser?.id;
      if (!adminId) {
        this.snackBar.open('Admin ID missing', 'Close', { duration: 3000 });
        return;
      }

      if (this.view || this.verification) {
        //  Use full-details API for view & verification
        this.getAdminFullDetails(adminId);

        //  Also patch form for edit-mode safety
        this.userForm.patchValue({
          name: this.selectedUser?.name,
          email: this.selectedUser?.email,
          phoneNumber: this.selectedUser?.phone
        });
      } else {
        //  Edit mode → keep existing getAdminById
        this.http.get(`${API_URL}${ENDPOINTS.GET_ADMIN_BY_ID}${adminId}`).subscribe((res: any) => {
          this.selectedUser = res;
          this.userForm.patchValue(this.selectedUser);
          this.toggleChecked = res.active;
        });
      }
    } else {
      this.userForm.reset();
      this.fullDetails = null;
    }
    this.isDrawerOpen = true;
  }

  closeUserDrawer() {
    this.isDrawerOpen = false;
    this.selectedUser = null;
    this.fullDetails = null;
    this.verification = false;
    this.view = false;
  }

  mapAndSetDataSource(users: any[]): void {
    const mappedUsers: any[] = users.map(user => ({
      user_id: user.id,
      admin_id: user.id,
      pharmaId: user.pharmaId ?? user.id,
      name: user.name,
      email: user.email,
      phone: user.phoneNumber ?? user.phone_number,
      contact: user.email,
      pharmacyName: user.pharmacyName ?? null,
      rating: user.rating ?? null,
      verified: user.verified ?? false,
      createdOn: user.createdOn ?? user.created_on ?? null,
      aadhaar: user.aadhaar_verified ? 'Verified' : 'Not Verified',
      address: user.address,
      city: user.city,
      aadhaarUrl: user.aadhaar_card_attachment || null,
      originalUser: user
    }));

    this.dataSource.data = mappedUsers;
  }

 /**
 *  Bulk-update document verification
 * PUT /documentverification/bulk-update?adminIds={id}&status={status}
 */
submitVerification(): void {
  const adminId = this.selectedUser?.admin_id ?? this.selectedUser?.id;

  if (!adminId) {
    this.snackBar.open('Admin ID is missing. Cannot proceed.', 'Close',
      { duration: 3000, panelClass: ['snackbar-error'] });
    return;
  }

  const newStatus = this.toggleChecked;
  if (!newStatus) {
    this.snackBar.open('Please select a verification status.', 'Close',
      { duration: 3000, panelClass: ['snackbar-error'] });
    return;
  }

  const token = localStorage.getItem('token');
  let headers = new HttpHeaders();
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const params = new HttpParams()
    .set('adminIds', String(adminId))
    .set('status', newStatus);

  const url = `${API_URL}${ENDPOINTS.DOCUMENT_VERIFICATION_BULK}`;

  this.submittingVerification = true;

  this.http.put(url, null, { headers, params }).subscribe({
    next: (res: any) => {
      this.submittingVerification = false;
      this.snackBar.open(
        `${this.selectedUser?.name || 'Pharmacist'} status updated to ${newStatus}.`,
        'Close',
        { duration: 3000, panelClass: ['snackbar-success'] }
      );

      //  Refresh list + refresh drawer details
      this.getAccounts();
      this.getAdminFullDetails(adminId);
    },
    error: (err: any) => {
      this.submittingVerification = false;
      const errorMessage = err?.error?.message
        || err?.message
        || 'Failed to update verification status. Try again later.';
      this.snackBar.open(errorMessage, 'Close',
        { duration: 5000, panelClass: ['snackbar-error'] });
    }
  });
}
  openDialog(m: any) {
    this.http.get(`${API_URL}${ENDPOINTS.GET_ADMIN_BY_ID}${this.selectedUser?.user_id}`).subscribe((res: any) => {
      this.permission = res.canAddMedicine;
    });
    this.dialog.open(this.discountDialog, { width: '400px', data: {} });
  }

  openVerificationDialog(m: any) {
    this.dialog.open(this.verificationDialog, {
      width: '800px', minWidth: '800px', data: {}
    });
  }

  updateMedicinePermission() {
    const url = `${API_URL}${ENDPOINTS.UPDATE_MEDICINE_PERMISSION}${this.selectedUser.user_id}/toggle-medicine-permission`;
    this.http.put(url, null).subscribe({
      next: (res: any) => {
        this.snackBar.open(
          res.canAddMedicine === true ? 'Permission Granted' : 'Permission Denied',
          'Close', { duration: 3000, panelClass: ['snackbar-success'] });
      },
      error: () => {
        this.snackBar.open('Failed to give permission. Try again later.', 'Close',
          { duration: 4000, panelClass: ['snackbar-error'] });
      }
    });
  }

  openAddressDialog(element: any): void {
    this.dialog.open(AddressDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: {
        name: element?.name || 'Pharmacist',
        address: element?.address || 'No address available'
      }
    });
  }

  /**  helper: status chip color */
  statusColor(status: string): string {
    switch ((status || '').toUpperCase()) {
      case 'APPROVED':
      case 'VERIFIED': return 'status-approved';
      case 'PENDING': return 'status-pending';
      case 'REJECTED':
      case 'CANCELLED': return 'status-rejected';
      case 'UNDER_REVIEW': return 'status-review';
      default: return 'status-pending';
    }
  }
}