// src/app/login/login.ts (or wherever your Login component is located)

import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Auth } from '../../core/services/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router'; // Import RouterLink
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { API_URL, ENDPOINTS } from '../../core/const';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, // Still needed for general Angular directives if any in template
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatCardModule,
    RouterLink // Import RouterLink for declarative navigation in template
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  http = inject(HttpClient);
  loginForm!: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  // Method for login submission
  onLoginSubmit(): void {
    this.http.post(API_URL + ENDPOINTS.LOGIN, this.loginForm.value).subscribe((res: any) => {
      this.auth.login('Test token set', 'Admin');
      this.router.navigate(['/dashboard']);
    })
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }
}