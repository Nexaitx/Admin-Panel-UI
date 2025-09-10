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
  // onLoginSubmit(): void {
  //   this.http.post(API_URL + ENDPOINTS.LOGIN, this.loginForm.value).subscribe((res: any) => {
  //     if (res) {
  //       this.auth.login(res?.token, res?.profile?.role?.roleType);
  //       this._snackBar.open('Logged In Successful!', 'Successfully', {
  //         horizontalPosition: 'end',
  //         verticalPosition: 'top',
  //         duration: 3000,
  //         panelClass: ['snackbar-success']
  //       });
  //       this.router.navigate(['/app/dashboard']);
  //     }
  //   },
  //     error => {
  //       this._snackBar.open('Login failed. Please check your credentials.', 'Error', {
  //         horizontalPosition: 'end',
  //         verticalPosition: 'top',
  //         duration: 3000,
  //         panelClass: ['snackbar-error']
  //       });
  //     });
  // }
  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this._snackBar.open('Please fill out all required fields correctly.', 'Error', {
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    else {
      this.isLoading = true;
      // Simulate an HTTP call
      setTimeout(() => {
        this.isLoading = false;
        const email = this.loginForm.get('email')?.value;
        const password = this.loginForm.get('password')?.value;

        // if (email === 'test@example.com' && password === 'password123') {
        //   this.auth.login('mock-token-123', 'admin');
        //   this._snackBar.open('Logged In Successfully!', 'Success', {
        //     horizontalPosition: 'end',
        //     verticalPosition: 'top',
        //     duration: 3000,
        //     panelClass: ['snackbar-success']
        //   });
        // } else {
        //   this._snackBar.open('Login failed. Please check your credentials.', 'Error', {
        //     horizontalPosition: 'end',
        //     verticalPosition: 'top',
        //     duration: 3000,
        //     panelClass: ['snackbar-error']
        //   });
        // }
        this.http.post(API_URL + ENDPOINTS.LOGIN, this.loginForm.value).subscribe((res: any) => {
          if (res) {
            this.auth.login(res?.token, res?.profile?.role?.roleType);
            this._snackBar.open('Logged In Successful!', 'Successfully', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: ['snackbar-success']
            });
            this.router.navigate(['/app/dashboard']);
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
      }, 2000); // Simulate network latency
    }
  }
  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }

  onForgotPassword() {
    this.changeAuthUI.emit('reset-password'); // Emit event to show reset password
  }
}