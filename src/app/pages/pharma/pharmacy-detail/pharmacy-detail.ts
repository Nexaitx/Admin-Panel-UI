import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { API_URL, ENDPOINTS } from '../../../core/const';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialog } from '../../confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-pharmacy-detail',
  imports: [MatFormFieldModule,
    MatTableModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatMenuModule
  ],
  templateUrl: './pharmacy-detail.html',
  styleUrl: './pharmacy-detail.scss',
})
export class PharmacyDetail {
  displayedColumns: string[] = [
    'id',
    'pharmacyName',
    'address',
    'city',
    'state',
    'pincode',
    'adminName',
    'latitude',
    'longitude',
    'actions'
  ];

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild('addressDialog') addressDialog!: TemplateRef<any>;
  private dialog = inject(MatDialog);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private _snackBar = inject(MatSnackBar);

  addressForm: FormGroup = this.fb.group({
    companyName: ['', Validators.required],
    companyAddress: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    pincode: ['', Validators.required],
    isPrimary: [false],
    addressType: [''],
    // longitude: [0],
    // latitude: [0]
  });

  isEdit = false;
  selectedRecord: any;

  ngOnInit() {
    this.getPharmaAddresses();
  }

  getPharmaAddresses() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    this.http.get(API_URL + ENDPOINTS.GET_PHARMA_ADDRESS, { headers }).subscribe((res: any) => {
      this.dataSource.data = res.data;
    })
  }
  openDialog(row?: any) {

    if (row) {
      this.isEdit = true;

      this.addressForm.patchValue({
        companyName: row.companyName,
        companyAddress: row.companyAddress,
        city: row.city,
        state: row.state,
        pincode: row.pincode,
        addressType: row.addressType,
        // longitude: row.longitude,
        // latitude: row.latitude,
        isPrimary: row.isPrimary
      });

    } else {
      this.isEdit = false;

      this.addressForm.reset({
        companyName: '',
        companyAddress: '',
        city: '',
        state: '',
        pincode: '',
        addressType: '',
        // longitude: 0,
        // latitude: 0,
        isPrimary: false
      });
    }

    this.dialog.open(this.addressDialog, {
      width: '500px'
    });
  }

  saveAddress() {
    if (this.addressForm.invalid) return;
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    const payload = this.addressForm.value;
    if (this.isEdit) {
      this.http.put(API_URL + ENDPOINTS.UPDATE_PHARMA_ADDRESS + this.selectedRecord?.id, payload, { headers }).subscribe((res: any) => {
        this.getPharmaAddresses();
        this._snackBar.open('Pharmacy Address Updated.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
      },
        (err) => {
          this._snackBar.open('Pharmacy address can not be updated', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });
        })
    } else {
      this.http.post(API_URL + ENDPOINTS.CREATE_PHARMA_ADDRESS, payload, { headers })
        .subscribe(() => {
          this.getPharmaAddresses();
          this._snackBar.open('Pharmacy Address added sucessfully.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
        },
          (err) => {
            this._snackBar.open('Pharmacy address can not be created', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error'],
            });
          });

    }

    this.dialog.closeAll();
  }

  deleteAddress(m: any) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete Pharmacy ${m?.companyName || ''}?`,
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
        this.http.delete(API_URL + ENDPOINTS.DELETE_PHARMA_ADDRESS + m?.id, { headers }).subscribe((res: any) => {
          // this.getPharmaAddresses();
          this.dataSource.data = this.dataSource.data.filter(a => a.id !== m?.id);
          this._snackBar.open('Pharmacy address deleted successfully.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });

        },
          (err) => {
            this._snackBar.open('Pharmacy address can not be deleted', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error'],
            });
          });
      }
    });

  }

}
