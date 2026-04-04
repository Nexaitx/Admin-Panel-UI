import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatAnchor } from "@angular/material/button";

@Component({
  selector: 'app-wallet-withdrawal-request',
  imports: [MatAnchor],
  templateUrl: './wallet-withdrawal-request.html',
  styleUrl: './wallet-withdrawal-request.scss',
})
export class WalletWithdrawalRequest {
  private router = inject(Router);

  navigateToWallet() {
    this.router.navigate(['/app/order-ledgers']);
  }
}
