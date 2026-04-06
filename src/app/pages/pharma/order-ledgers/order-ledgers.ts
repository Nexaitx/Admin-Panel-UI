import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { API_URL, ENDPOINTS, PHARMA_API_URL } from '../../../core/const';

@Component({
  selector: 'app-order-ledgers',
  imports: [MatTableModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './order-ledgers.html',
  styleUrl: './order-ledgers.scss',
})
export class OrderLedgers {
  displayedColumns: string[] = [
    'serialNo', 'id', 'total_amount', 'commision', 'net_amount'
  ];

  dataSource = new MatTableDataSource<any>([]);

  private router = inject(Router);
  private http = inject(HttpClient);
  myWallet: any = {};

  ngOnInit() {
    this.getMyTransactions();
  }

  navigateToWithdraw() {
    this.router.navigate(['/app/withdrawal-requests']);
  }

  navigateToAccounts() {
    this.router.navigate(['/app/account-details']);
  }

  getMyTransactions() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    this.http.get(PHARMA_API_URL + ENDPOINTS.GET_MY_TRANSACTIONS, { headers }).subscribe((response: any) => {
      this.dataSource.data = response.transactions || [];
    });

    this.http.get(PHARMA_API_URL + ENDPOINTS.GET_WALLET_BALANCE, { headers }).subscribe((response: any) => {
      this.myWallet = response.wallet;
    });
  }

}
