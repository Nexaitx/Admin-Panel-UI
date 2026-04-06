import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-details',
  imports: [MatButtonModule],
  templateUrl: './account-details.html',
  styleUrl: './account-details.scss',
})
export class AccountDetails {
  private router = inject(Router);

  navigateToWallet() {
    this.router.navigate(['/app/order-ledgers']);
  }
}
