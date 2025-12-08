import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Auth } from '../../core/services/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { API_URL, ENDPOINTS } from '../../core/const';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FirebaseService } from '../../core/services/firebase.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatCardModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  http = inject(HttpClient);
  private firebaseService = inject(FirebaseService); // Inject Firebase Service
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

  async onLoginSubmit(): Promise<void> {
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

    this.isLoading = true;

    try {
      // Step 1: Get FCM token before login
      console.log('🔄 Getting FCM token before login...');
      // const fcmToken = await this.getFCMTokenForLogin();

      // Step 2: Perform login
      const loginResponse: any = await this.http.post(API_URL + ENDPOINTS.LOGIN, this.loginForm.value).toPromise();

      if (loginResponse) {
        // Step 3: Save user data and token
        // The JWT token is typically in 'token' or 'accessToken' field
        const authToken = loginResponse?.token;
        this.auth.login(authToken, loginResponse?.profile?.role?.permissions, loginResponse?.profile);
        console.log(authToken);
        // Step 4: If we have FCM token, send it to backend
        const fcmToken = loginResponse?.fcmToken;
        console.log(fcmToken, authToken);
        if (fcmToken && authToken) {
          await this.sendFCMTokenToBackend(fcmToken, authToken);
        } else {
          console.warn('⚠️ Cannot send FCM token:', {
            hasFcmToken: !!fcmToken,
            hasAuthToken: !!authToken
          });
        }

        // Step 4b: Check for any pending FCM token from previous attempts
        const pendingToken = localStorage.getItem('pending_fcm_token');
        if (pendingToken && authToken) {
          console.log('🔄 Found pending FCM token, attempting to send...');
          await this.sendFCMTokenToBackend(pendingToken, authToken);
        }

        this._snackBar.open('Logged In Successful!', 'Successfully', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: ['snackbar-success']
        });

        // Step 5: Navigate based on permissions
        await this.navigateBasedOnPermissions(loginResponse);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      this._snackBar.open(
        error.error?.message || 'Login failed. Please check your credentials.',
        'Error',
        {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: ['snackbar-error']
        }
      );
    } finally {
      this.isLoading = false;
    }
  }

  private async getFCMTokenForLogin(): Promise<string | null> {
    try {
      console.log('🔄 Requesting FCM permission and getting token...');

      // Use the new method that directly returns the token
      const fcmToken = await this.firebaseService.requestPermissionAndGetToken();

      if (fcmToken) {
        console.log('✅ FCM token retrieved successfully:', fcmToken.substring(0, 20) + '...');
        return fcmToken;
      } else {
        console.warn('⚠️ FCM token not available - permission may have been denied or token generation failed');
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting FCM token for login:', error);
      return null;
    }
  }

  private async sendFCMTokenToBackend(fcmToken: string, authToken: string): Promise<void> {
    try {
      if (!authToken) {
        console.error('❌ Auth token is missing, cannot send FCM token');
        localStorage.setItem('pending_fcm_token', fcmToken);
        return;
      }

      if (!fcmToken) {
        console.error('❌ FCM token is missing');
        return;
      }

      const response: any = await this.http.post(
        API_URL + ENDPOINTS.UPDATE_FCM_TOKEN,
        { fcmToken: fcmToken },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      ).toPromise();
      // Remove any pending token since we successfully sent it
      localStorage.removeItem('pending_fcm_token');
    } catch (error: any) {
      console.error('❌ Error sending FCM token to backend:', error);
      console.error('📊 Error Details:', {
        status: error?.status,
        statusText: error?.statusText,
        message: error?.message,
        error: error?.error
      });

      // Store token for retry later
      localStorage.setItem('pending_fcm_token', fcmToken);
      console.log('💾 FCM token stored in localStorage for retry');
    }
  }

  private async navigateBasedOnPermissions(loginResponse: any): Promise<void> {
    const perm = loginResponse?.profile?.role?.permissions;
    const documentVerification = loginResponse?.profile?.documentVerification;

    if (perm.includes('Admin Dashboard')) {
      this.router.navigate(['/app/admin-dashboard']);
    } else if (perm.includes('Pharmacist Dashboard') && documentVerification === 'VERIFIED') {
      this.router.navigate(['/app/pharmacist-dashboard']);
    } else if (perm.includes('Dietician Dashboard')) {
      this.router.navigate(['/app/dietician-dashboard']);
    } else {
      this.router.navigate(['/complete-verification']);
    }
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }

  onForgotPassword() {
    this.changeAuthUI.emit('reset-password');
  }
}