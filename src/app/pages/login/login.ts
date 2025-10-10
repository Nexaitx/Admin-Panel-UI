// src/app/login/login.ts (or wherever your Login component is located)

import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Auth } from '../../core/services/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router'; // Import RouterLink
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { API_URL, ENDPOINTS } from '../../core/const';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
  showPassword: boolean = false;
  isLoading: boolean = false;
  private _snackBar = inject(MatSnackBar);
  @Output() changeAuthUI = new EventEmitter<'login' | 'signup' | 'reset-password'>();

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this._snackBar.open('Please fill out all required fields correctly.', 'Error', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    else {
      this.isLoading = true;
      this.http.post(API_URL + ENDPOINTS.LOGIN, this.loginForm.value).subscribe((res: any) => {
        if (res) {
          this.auth.login(res?.token, res?.permissions, res?.profile);
          this._snackBar.open('Logged In Successful!', 'Successfully', {
            horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: ['snackbar-success']
            });
            const perm = res?.permissions;
            // console.log(role)
            if (perm.includes('Admin Dashboard')) {
              this.router.navigate(['/app/admin-dashboard']);
            }
            // } else if (role === 'Doctor') {
              // this.router.navigate(['/app/doctor-dashboard']);
            // } else if (role === 'Pharmacist') {
              // this.router.navigate(['/app/pharmacist-dashboard']);
            // } else if (role === 'Dietician') {
              // this.router.navigate(['/app/dietician-dashboard']);
            // } else {
              // this.router.navigate(['/app/default-dashboard']);
            // }
          }
        },
          error => {
            this._snackBar.open('Login failed. Please check your credentials.', 'Error', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          });
      }
  }
  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }

  onForgotPassword() {
    this.changeAuthUI.emit('reset-password');
  }
}