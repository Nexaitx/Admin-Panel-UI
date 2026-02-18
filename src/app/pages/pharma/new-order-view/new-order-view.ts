import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-new-order-view',
  imports: [MatButtonModule,
    MatTableModule,
    CommonModule
  ],
  templateUrl: './new-order-view.html',
  styleUrl: './new-order-view.scss',
})
export class NewOrderView {
detailColumns: string[] = ['medicine', 'batch', 'qty', 'price', 'total'];
  
  detailsSource = [
    { 
      name: 'Amoxicillin + Clavulanate', 
      dosage: '625mg', 
      type: 'Tablet', 
      batchNo: 'AMX24091', 
      qty: 10, 
      price: 120.00 
    },
    { 
      name: 'Paracetamol', 
      dosage: '500mg', 
      type: 'Capsule', 
      batchNo: 'PCM99210', 
      qty: 2, 
      price: 20.00 
    }
  ];
}
