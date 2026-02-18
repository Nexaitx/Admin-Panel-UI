import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-view-order',
  imports: [
    MatTableModule,
    CommonModule],
  templateUrl: './view-order.html',
  styleUrl: './view-order.scss',
})
export class ViewOrder {
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
