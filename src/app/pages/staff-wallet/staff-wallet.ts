import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { ColumnDef, CommonTableComponent } from '../../shared/common-table/common-table.component';
import { HttpClient } from '@angular/common/http';
import { API_URL, ENDPOINTS } from '../../core/const';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-staff-wallet',
  imports: [
    CommonTableComponent,
    MatDialogModule,
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './staff-wallet.html',
  styleUrl: './staff-wallet.scss',
})
export class StaffWallet {

  http = inject(HttpClient);
  dialog = inject(MatDialog);
  @ViewChild('walletDialog') walletDialog!: TemplateRef<any>;

  dataSource = new MatTableDataSource<any>();
  selectedTransactionDetails: any[] = [];

  columnsToDisplay: ColumnDef[] = [
    { key: 'staffId', header: 'Staff&nbsp;Id', sortable: true },
    { key: 'name', header: 'Staff&nbsp;Name', sortable: true },
    { key: 'phoneNumber', header: 'Staff&nbsp;Phone&nbsp;Number', sortable: true },
    { key: 'gender', header: 'Gender', sortable: true },
    { key: 'subCategory', header: 'SubCategory', sortable: true },
    { key: 'currentBalance', header: 'Current&nbsp;Balance', sortable: true },
    { key: 'walletTransactions', header: 'Wallet&nbsp;Transactions', type: 'action' }
  ];
  childTable: ColumnDef[] = [
    {key : 'transactionId', header: 'Transaction Id'},
    {key: 'amount', header: 'Amount', type: 'number'},
    {key: 'paymentMode', header: 'Payment Mode'},
    {key: 'transactionDate', header: 'Transaction Date', type: 'date'},
    {key: 'type', header: 'Type'},
    {key: 'description', header: 'Description'},
    {key: 'status', header: 'Status'}
  ];

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    const params = {
      page: 0,
      size: 10,
      sortBy: 'staffId',
      sortDirection: 'desc'
    }
    this.http.get(API_URL + ENDPOINTS.GET_STAFF_WALLET, { params }).subscribe((res: any) => {
      this.dataSource.data = res.staffList;
    })
  }

  onWalletTransaction(row: any) {
    this.selectedTransactionDetails = row.row.walletTransactions;
    console.log(this.selectedTransactionDetails);
    this.dialog.open(this.walletDialog, { width: '900px', minWidth: '800px' });
  }
}
