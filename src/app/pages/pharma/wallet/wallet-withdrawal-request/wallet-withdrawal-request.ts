import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ENDPOINTS, PHARMA_API_URL } from '../../../../core/const';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmationDialog } from '../../../confirmation-dialog/confirmation-dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-wallet-withdrawal-request',
  imports: [MatTableModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule],
  templateUrl: './wallet-withdrawal-request.html',
  styleUrl: './wallet-withdrawal-request.scss',
})
export class WalletWithdrawalRequest {
  private router = inject(Router);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'serialNo', 'id', 'name', 'bankName', 'accountNumber', 'ifscCode', 'amount', 'requestedAt', 'processedAt', 'status', 'actions'
  ];
  public dialog = inject(MatDialog);
  @ViewChild('requestDialog') requestDialog!: TemplateRef<any>;

  selectedRecord: any = null;
  isEdit: boolean = false;

  requestForm!: FormGroup;

  ngOnInit() {
    this.requestForm = this.fb.group({
      // bankAccountId: [''],
      amount: [''],
      remarks: ['']
    })
    this.getWithdrawRequests();
  }

  getWithdrawRequests() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    this.http.get(PHARMA_API_URL + ENDPOINTS.GET_WITHDRAW_REQUESTS, { headers }).subscribe((response: any) => {
      this.dataSource.data = response.dataList || [];
    });
  }

  navigateToWallet() {
    this.router.navigate(['/app/order-ledgers']);
  }

  onOpen() {
    if (this.isEdit && this.selectedRecord) {
      this.requestForm.patchValue(this.selectedRecord);
    } else {
      this.requestForm.reset();
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

        this.http.delete(`${PHARMA_API_URL + ENDPOINTS.DELETE_WITHDRAWAL_REQUEST}${m?.id}`, { headers })
          .subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(item => item.id !== m.id);
          }, error => {
            // Handle error if needed
            console.error('Failed to delete withdrawal request', error);
            // Optionally show a notification to the user about the failure
          });
      }
    });
  }

  onSubmit() {
    if (this.requestForm.valid) {
      const formValue = this.requestForm.value;

      const requestData = {
        amount: formValue.amount,
        remarks: formValue.remarks,
        bankAccountId: this.selectedRecord?.bankAccountId
      };
      if (!this.isEdit && !this.selectedRecord) {
        this.http.post(PHARMA_API_URL + ENDPOINTS.CREATE_WITHDRAWAL_REQUEST, requestData, { headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token') || ''}`) })
          .subscribe((response: any) => {
            this.getWithdrawRequests();
            this.dialog.closeAll();
          });
        this.dialog.closeAll();
      }
      else {
        this.http.put(`${PHARMA_API_URL + ENDPOINTS.UPDATE_WITHDRAWAL_REQUEST}${this.selectedRecord?.id}`, requestData, { headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token') || ''}`) })
          .subscribe((response: any) => {
            this.getWithdrawRequests();
            this.dialog.closeAll();
          });
      }
    }
  }

  // onSubmit() {

  //   console.log("Form Value:", this.requestForm.value);
  //   if (this.requestForm.valid) {
  //     const formValue = this.requestForm.value;
  //     const requestData = {
  //       // bankAccountId: formValue.bankAccountId,
  //       amount: formValue.amount,
  //       remarks: formValue.remarks
  //     };
  //     console.log("Request Data to submit:", requestData);
  //     // this.http.post(PHARMA_API_URL + ENDPOINTS.CREATE_WITHDRAWAL_REQUEST, requestData, { headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token') || ''}`) })
  //     //   .subscribe((response: any) => {
  //     //     this.dataSource.data = [...this.dataSource.data, response];
  //     //   });
  //     // this.dialog.closeAll();
  //   }
  // }
}
