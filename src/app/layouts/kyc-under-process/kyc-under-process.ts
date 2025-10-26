import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-kyc-under-process',
  imports: [MatCardModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './kyc-under-process.html',
  styleUrl: './kyc-under-process.scss'
})
export class KycUnderProcess {
  private router = inject(Router)
  private auth = inject(Auth)
  logout() {
    this.auth.logout();
    this.router.navigate(['']);
  }
}
