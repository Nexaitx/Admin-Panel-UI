import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, input } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ENDPOINTS, PHARMA_API_URL } from '../../../core/const';
import { ColumnDef, CommonTableComponent } from '../../../shared/common-table/common-table.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-order',
  imports: [
    MatTableModule,
    CommonModule,
    CommonTableComponent],
  templateUrl: './view-order.html',
  styleUrl: './view-order.scss',
})
export class ViewOrder {
  dataSource = new MatTableDataSource([]);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute)
  totalAmount = 0;
  orderId = this.route.snapshot.paramMap.get('id');

  columnsToDisplay: ColumnDef[] = [
    { key: 'itemId', header: 'Item&nbsp;Id', sortable: true },
    { key: 'productId', header: 'Product&nbsp;Id', sortable: true },
    { key: 'productName', header: 'Product&nbsp;Name', sortable: true },
    { key: 'price', header: 'MRP', sortable: true },
    { key: 'offerPrice', header: 'Offer&nbsp;Price', sortable: true },
    { key: 'quantity', header: 'Quantity', sortable: true },
    { key: 'productType', header: 'Product&nbsp;Type', sortable: true },
    { key: 'category', header: 'Category', sortable: true },
    { key: 'commissionPercent', header: 'Commission&nbsp;Percent', sortable: true },
    { key: 'platformCommission', header: 'Platform&nbsp;Commission', sortable: true },
    { key: 'pharmacyPayout', header: 'Pharmacy&nbsp;Payout', sortable: true },
    { key: 'availabilityStatus', header: 'Availability', sortable: true },
    { key: 'availableQuantity', header: 'Available&nbsp;Quantity', sortable: true }
  ];


  ngOnInit() {
    this.getOrderById();
  }

  getOrderById() {
    this.http.get(PHARMA_API_URL + ENDPOINTS.GET_ACCEPTED_BOOKING_BY_ID + this.orderId + '/items').subscribe((res: any) => {
      this.dataSource.data = res.items;
      this.totalAmount = res.totalAmount;
    });
  }

}
