import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

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
    'serialNo', 'medicine', 'quantity', 'status',
    'mrp', 'offerPrice', 'category', 'companyShare', 'payout'
  ];

  dataSource = [
    {
      name: 'Amoxicillin 500mg',
      qty: 10, maxQty: 20,
      isAvailable: true,
      mrp: 150, offerPrice: 130,
      category: 'Ethical',
      companyShare: 0, payout: 0
    },
    // Add more mock data...
  ];

  constructor() {
    this.dataSource.forEach(item => this.calculatePayouts(item));
  }

  validateQty(element: any) {
    if (element.qty > element.maxQty) {
      element.qty = element.maxQty;
      alert(`Cannot exceed stock limit of ${element.maxQty}`);
    }
  }

  calculatePayouts(element: any) {
    // 1. Validate Offer Price against MRP
    if (element.offerPrice > element.mrp) {
      element.offerPrice = element.mrp;
    }

    // 2. Logic: Company takes 15%, Pharma gets the rest (example formula)
    element.companyShare = element.offerPrice * 0.15;
    element.payout = (element.offerPrice - element.companyShare) * element.qty;
  }
}
