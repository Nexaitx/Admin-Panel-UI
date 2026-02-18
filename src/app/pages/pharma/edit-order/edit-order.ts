import { Component, inject, OnInit } from '@angular/core'; // Added OnInit
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; // Required for matInput
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Added SnackBarModule
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common'; // Required for [class.text-danger]
import { MatSelectModule } from '@angular/material/select';

interface OrderItem {
  id: string;
  name: string;
  maxDemand: number;
  currentQty: number;
  price: number;
  isOutOfStock: boolean;
  status: 'Available' | 'Non Available' | 'Partial';
}

@Component({
  selector: 'app-edit-order',
  standalone: true, // Assuming Angular 17+
  imports: [
    CommonModule,         // For pipes and class bindings
    MatTableModule,
    MatSlideToggleModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,       // Critical for the input field
    MatButtonModule,
    MatSnackBarModule,    // Critical for the snackbar service
    ReactiveFormsModule,
    MatSelectModule
  ],
  templateUrl: './edit-order.html',
  styleUrl: './edit-order.scss',
})
export class EditOrder implements OnInit {
  private snackBar = inject(MatSnackBar);
  
  // Use the interface instead of any for better intellisense
  editDataSource = new MatTableDataSource<OrderItem>([]);

  ngOnInit() {
    const data: OrderItem[] = [
      { id: '1101', name: 'Paracetamol', maxDemand: 5, currentQty: 3, price: 100, isOutOfStock: false, status: 'Available' }
    ];
    this.editDataSource.data = data;
  }
onStatusChange(item: OrderItem) {
    if (item.status === 'Non Available') {
        item.currentQty = 0;
    } else if (item.status === 'Available') {
        item.currentQty = item.maxDemand;
    }
    // If 'Partial', we keep the currentQty as is for the user to adjust manually
    
    this.snackBar.open(`Status updated to ${item.status}`, 'OK', { duration: 2000 });
}
  onQtyChange(item: OrderItem, newQty: number) {
    if (newQty > item.maxDemand) {
      item.currentQty = item.maxDemand;
      this.snackBar.open(`Cannot exceed client's demand of ${item.maxDemand}`, 'Close', {
        duration: 3000,
        verticalPosition: 'bottom'
      });
    } else if (newQty < 0) {
      item.currentQty = 0;
    }
    
    // Auto-toggle shortage if qty becomes 0
    if (item.currentQty === 0) {
        item.isOutOfStock = true;
    } else {
        item.isOutOfStock = false;
    }
  }

  // Handle the toggle specifically
  onToggleShortage(item: OrderItem) {
    if (item.isOutOfStock) {
      item.currentQty = 0;
    }
  }

  saveChanges() { 
    console.log('Saved data:', this.editDataSource.data);
    this.snackBar.open('Order updated successfully', 'OK', { duration: 2000 });
  }
}