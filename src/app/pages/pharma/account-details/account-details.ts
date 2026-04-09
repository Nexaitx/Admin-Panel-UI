import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ENDPOINTS, PHARMA_API_URL } from '../../../core/const';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmationDialog } from '../../confirmation-dialog/confirmation-dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-account-details',
  imports: [MatTableModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatRadioModule],
  templateUrl: './account-details.html',
  styleUrl: './account-details.scss',
})
export class AccountDetails {
  private router = inject(Router);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'serialNo', 'holder', 'bank', 'account_no', 'ifsc', 'upi', 'primary', 'actions'
  ];
  public dialog = inject(MatDialog);
  @ViewChild('requestDialog') requestDialog!: TemplateRef<any>;

  selectedRecord: any = null;
  isEdit: boolean = false;

  requestForm!: FormGroup;

  ngOnInit() {
    this.requestForm = this.fb.group({
      bankName: [''],
      accountHolderName: ['', Validators.required],
      accountNumber: ['', [Validators.required, Validators.minLength(11), Validators.pattern('^[0-9]+$')]],
      confirmAccountNumber: ['', [Validators.required, Validators.minLength(11)]],
      ifscCode: ['', [Validators.required, Validators.pattern('^[A-Z]{4}0[A-Z0-9]{6}$')]],
      upiId: [''],
      isPrimary: [false]
    }, { validators: this.accountNumberMatchValidator });

    this.getBankAccounts();
  }

  accountNumberMatchValidator(formGroup: FormGroup) {
  const accountNumber = formGroup.get('accountNumber');
  const confirmAccountNumber = formGroup.get('confirmAccountNumber');

  if (!accountNumber || !confirmAccountNumber) return null;

  if (accountNumber.value !== confirmAccountNumber.value) {
    confirmAccountNumber.setErrors({
      ...confirmAccountNumber.errors,
      mismatch: true
    });
  } else {
    if (confirmAccountNumber.hasError('mismatch')) {
      const errors = { ...confirmAccountNumber.errors };
      delete errors['mismatch'];
      confirmAccountNumber.setErrors(Object.keys(errors).length ? errors : null);
    }
  }

  return null;
}

  getBankAccounts() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    this.http.get(PHARMA_API_URL + ENDPOINTS.GET_BANK_ACCOUNT, { headers }).subscribe((response: any) => {
      this.dataSource.data = response.accounts || [];
    });
  }

  onOpen() {
    if (this.isEdit && this.selectedRecord) {
       this.requestForm.patchValue({
      ...this.selectedRecord,
      isPrimary: this.selectedRecord.isPrimary ?? false
    });
    } else {
      this.requestForm.reset({
      isPrimary: false // ✅ always default NO
    });
    }

    this.dialog.open(this.requestDialog, {
      width: '500px'
    });
  }

  deleteElement(m: any) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete withdrawal Request?`,
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

        this.http.delete(`${PHARMA_API_URL + ENDPOINTS.DELETE_BANK_ACCOUNT}${m?.id}`, { headers })
          .subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(item => item.id !== m.id);
          }, error => {
            // Handle error if needed
            console.error('Failed to delete bank account', error);
            // Optionally show a notification to the user about the failure
          });
      }
    });
  }

  onSubmit() {
    console.log(this.requestForm.value);
    // if (this.requestForm.valid) {   
      if (this.isEdit && this.selectedRecord) {
       this.http.put(`${PHARMA_API_URL + ENDPOINTS.UPDATE_BANK_ACCOUNT}${this.selectedRecord?.id}`, this.requestForm.value, { headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token') || ''}`) })
          .subscribe((response: any) => {
            this.getBankAccounts();
            this.dialog.closeAll();
          });
      }
      else {
        const payload = {
          bankName: this.requestForm.value.bankName,
          accountHolderName: this.requestForm.value.accountHolderName,
          accountNumber: this.selectedRecord ? this.selectedRecord.accountNumber : this.requestForm.value.accountNumber,
          confirmAccountNumber: this.selectedRecord ? this.selectedRecord.accountNumber : this.requestForm.value.accountNumber,
          ifscCode: this.requestForm.value.ifscCode,
          upiId: this.requestForm.value.upiId,
          isPrimary: this.requestForm.value.isPrimary
        }
           this.http.post(PHARMA_API_URL + ENDPOINTS.ADD_BANK_ACCOUNT, payload, { headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token') || ''}`) })
          .subscribe((response: any) => {
            this.getBankAccounts();
            this.dialog.closeAll();
          });
      }
    // }
  }
  navigateToWallet() {
    this.router.navigate(['/app/order-ledgers']);
  }

}
