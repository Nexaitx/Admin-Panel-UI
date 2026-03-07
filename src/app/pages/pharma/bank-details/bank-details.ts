import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ENDPOINTS, PHARMA_API_URL } from '../../../core/const';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialog } from '../../confirmation-dialog/confirmation-dialog';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-bank-details',
  imports: [MatFormFieldModule,
    MatTableModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatMenuModule,
    MatRadioModule,
    CommonModule],
  templateUrl: './bank-details.html',
  styleUrl: './bank-details.scss',
})
export class BankDetails {
  displayedColumns: string[] = [
    'id',
    'adminId',
    'accountHolderName',
    'bankName',
    'accountNumber',
    'ifscCode',
    'upiId',
    'isPrimary',
    'createdAt',
    'actions'
  ];

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild('addressDialog') addressDialog!: TemplateRef<any>;
  private dialog = inject(MatDialog);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private _snackBar = inject(MatSnackBar);

  addressForm: FormGroup = this.fb.group({
    accountHolderName: ['', Validators.required],
    bankName: ['', Validators.required],
    accountNumber: ['', Validators.required],
    confirmAccountNumber: ['', Validators.required],
    ifscCode: ['', Validators.required],
    upiId: [''],
    isPrimary: [false],
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
    this.http.get(PHARMA_API_URL + ENDPOINTS.GET_BANK_ACCOUNT, { headers }).subscribe((res: any) => {
      this.dataSource.data = res.accounts;
    })
  }
  openDialog(row?: any) {

    if (row) {
      this.isEdit = true;

      this.addressForm.patchValue({
        accountHolderName: row.accountHolderName,
        bankName: row.bankName,
        accountNumber: row.accountNumber,
        confirmAccountNumber: row.confirmAccountNumber,
        ifscCode: row.ifscCode,
        upiId: row.upiId,
        isPrimary: row.isPrimary,
      });

    } else {
      this.isEdit = false;
      this.addressForm.reset();
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
      this.http.put(PHARMA_API_URL + ENDPOINTS.UPDATE_BANK_ACCOUNT + this.selectedRecord?.id, payload, { headers }).subscribe((res: any) => {
        this.getPharmaAddresses();
        this._snackBar.open('Bank Details Updated.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
      },
        (err) => {
          this._snackBar.open('Bank Details can not be updated', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });
        })
    } else {
      this.http.post(PHARMA_API_URL + ENDPOINTS.ADD_BANK_ACCOUNT, payload, { headers })
        .subscribe(() => {
          this.getPharmaAddresses();
          this._snackBar.open('Bank Details added sucessfully.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
        },
          (err) => {
            this._snackBar.open('Bank Details can not be added', 'Close', {
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
        message: `Are you sure you want to delete Bank Details?`,
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
        this.http.delete(PHARMA_API_URL + ENDPOINTS.DELETE_BANK_ACCOUNT + m?.id, { headers }).subscribe((res: any) => {
          // this.getPharmaAddresses();
          this.dataSource.data = this.dataSource.data.filter(a => a.id !== m?.id);
          this._snackBar.open('Bank Details deleted successfully.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });

        },
          (err) => {
            this._snackBar.open('Bank Details can not be deleted', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error'],
            });
          });
      }
    });

  }
}
