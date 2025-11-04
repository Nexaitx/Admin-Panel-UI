import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, ViewChild } from '@angular/core';
import { API_URL, ENDPOINTS } from '../../core/const';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-accounts-address',
  imports: [MatTableModule,
    CommonModule,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatFormFieldModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  providers: [DatePipe],
  templateUrl: './accounts-address.html',
  styleUrl: './accounts-address.scss'
})
export class AccountsAddress {
  http = inject(HttpClient);
  fb = inject(FormBuilder)
  addresses = new MatTableDataSource<any>([]);
  @ViewChild('drawer') drawer!: MatDrawer;
  addAddressForm!: FormGroup;
  isDrawerOpen = false;
  selectedRecord: any;
  snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);
  addressTypes: any;
  isEdit: boolean = false;
  userDetails: any;

  cartColumns: string[] = [
    'companyName', 'companyAddress', 'pincode', 'addressType', 'adminName', 'createdAt', 'actions'
  ];

  constructor() {
    this.addAddressForm = this.fb.group({
      companyName: ['', Validators.required],
      companyAddress: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{5,10}$')]],
      isPrimary: [false],
      addressType: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.getUserDetails();
    this.getAddresses();
  }

  getUserDetails() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    this.http.get(API_URL + ENDPOINTS.GET_LOGGED_IN_USER_DETAILS, { headers }).subscribe((res: any) => {
      this.userDetails = res.data;
    });
  }
  getAddresses() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    this.http.get(API_URL + ENDPOINTS.GET_ADDRESSES, { headers }).subscribe((res: any) => {
      this.addresses.data = res.data;
    })
  }

  applyCartFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.addresses.filter = filterValue.trim().toLowerCase();

    if (this.addresses.paginator) {
      this.addresses.paginator.firstPage();
    }
  }

  onOpen() {
    if(this.isEdit)
    {
      this.addAddressForm.patchValue(this.selectedRecord);
    }
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
  }

  onDrawerClosed() {
    this.selectedRecord = null;
  }

  onSubmit() {
    console.log(this.selectedRecord)
    if (this.addAddressForm.valid) {
      const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

      if (this.isEdit) {
        this.http.put(`${API_URL}${ENDPOINTS.UPDATE_ADDRESS}${this.selectedRecord?.id}`, this.addAddressForm.value, {headers}).subscribe((res: any) => {
          this.getAddresses();
          this.snackBar.open('Address succesfully Updated', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
        },
          err =>
            this.snackBar.open('Failed to update Address', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error']

            })
        );
      }
      else {
        this.http.post(API_URL + ENDPOINTS.ADD_ADDRESS, this.addAddressForm.value, {headers}).subscribe((res: any) => {
          this.addAddressForm.reset();
          this.getAddresses();
          this.snackBar.open('Company Address added successfully', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
        });
      }
    }
    else {
      this.snackBar.open('Failed to add Address', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    }
  }

  deleteElement(m: any) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete Address?`,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const token = localStorage.getItem('token');
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        this.http.delete(`${API_URL + ENDPOINTS.DELETE_ADDRESS}${m?.id}`, { headers })
          .subscribe(() => {
            this.addresses.data = this.addresses.data.filter(x => x?.medicineId !== m?.medicineId);
            this.snackBar.open('Company Address deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
          }, error => {
            this.snackBar.open('Failed to Address', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          });
      }
    });
  }
}
