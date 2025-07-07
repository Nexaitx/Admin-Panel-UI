import { Component, inject } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Auth } from '../../core/services/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ENDPOINTS, API_URL } from '../../core/const';

@Component({
  selector: 'app-login',
  imports: [
    MatFormField, 
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private auth = inject(Auth);
private router = inject(Router)
  
  login() {
    this.auth.login('Test token set', 'Admin');
    this.router.navigate(['/dashboard']);
  }
}
