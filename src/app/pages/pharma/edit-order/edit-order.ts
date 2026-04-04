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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ENDPOINTS, PHARMA_API_URL } from '../../../core/const';
import { ActivatedRoute } from '@angular/router';

interface OrderItem {
  id: string;
  name: string;
  maxDemand: number;
  currentQty: number;
  price: number;
  isOutOfStock: boolean;
  status: 'AVAILABLE' | 'NOT_AVAILABLE' | 'PARTIAL_AVAILABLE';
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
  private http = inject(HttpClient);

  editDataSource = new MatTableDataSource<any>([]);
  private route = inject(ActivatedRoute);
  orderId = this.route.snapshot.paramMap.get('id');

  ngOnInit() {
    this.getOrderByOrderId();
  }

  getOrderByOrderId() {
    this.http.get(PHARMA_API_URL + ENDPOINTS.GET_ACCEPTED_BOOKING_BY_ID + this.orderId + '/items').subscribe((res: any) => {
      this.editDataSource.data = res.items.map((item: any) => ({
        ...item,
        allowedQty: item.quantity   // 🔒 store original quantity
      }));
    })
  }

  onQtyChange(item: any, newQty: number) {

    // restrict increase beyond original quantity
    if (newQty > item.allowedQty) {
      this.snackBar.open(
        `Cannot exceed client's demand of ${item.allowedQty}`,
        'Close',
        { duration: 3000 }
      );
      newQty = item.allowedQty;
    }

    if (newQty < 0) {
      newQty = 0;
    }

    item.quantity = newQty;

    // auto-status
    if (item.quantity === 0) {
      item.availabilityStatus = 'NOT_AVAILABLE';
    } else if (item.quantity < item.allowedQty) {
      item.availabilityStatus = 'PARTIAL_AVAILABLE';
    } else {
      item.availabilityStatus = 'AVAILABLE';
    }

    item.isOutOfStock = item.quantity === 0;
  }
  preventManualStatusChange(event: any, item: any) {
    // Revert to auto-calculated status
    event.source.writeValue(item.availabilityStatus);

    this.snackBar.open(
      'Status is auto-calculated based on quantity',
      'Close',
      { duration: 2000 }
    );
  }

  saveChanges() {
    const items = this.editDataSource.data.map((item: any) => {
      return {
        itemId: item.itemId,
        category: item.category || 'OTC',
        offerPrice: item.price || 0,
        availableQuantity: item.quantity,
        availabilityStatus: item.availabilityStatus.toUpperCase()
      };
    });
    const payload = {
      bookingId: Number(this.orderId),
      items: items,
      totalWeight: null,
      isColdChain: false // static value added 
    };
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    this.http.put(PHARMA_API_URL + ENDPOINTS.UPDATE_ACCEPTED_BOOKING, payload, { headers })
      .subscribe({
        next: (res: any) => {
          this.snackBar.open('Order updated successfully', 'OK', { duration: 2000 });
        },
        error: (err) => {
          this.snackBar.open(err.message, 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
  }
}