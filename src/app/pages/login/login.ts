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
  private firebaseService = inject(FirebaseService);
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
      // Step 1: Login 
      console.log('Step 1: Performing login...');
      const loginResponse: any = await this.http.post(
        API_URL + ENDPOINTS.LOGIN, 
        this.loginForm.value
      ).toPromise();
      
      if (loginResponse) {
        // Step 2: User data save
        console.log(' Login successful');
        this.auth.login(
          loginResponse?.token, 
          loginResponse?.profile?.role?.permissions, 
          loginResponse?.profile
        );
        
        // Step 3: FCM token handle
        console.log(' Step 3: Handling FCM token...');
        await this.handleFCMToken(loginResponse.token);
        
        // Step 4: Success message show
        this._snackBar.open('Logged In Successfully!', 'Success', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: ['snackbar-success']
        });

        // Step 5: Navigate 
        console.log(' Step 5: Navigating...');
        await this.navigateBasedOnPermissions(loginResponse);
        
        // Step 6: Debug logs show 
        setTimeout(() => {
          this.showFCMDebugInfo();
        }, 1000);
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

  private async handleFCMToken(authToken: string): Promise<void> {
    try {
      // Check current notification permission status
      console.log(` Current notification permission: ${Notification.permission}`);
      
      if (Notification.permission === 'granted') {
        // Permission already granted
        console.log(' Notification permission already granted');
        
        // Check if we already have FCM token
        if (this.firebaseService.fcmToken) {
          console.log(' Already have FCM token, sending to backend...');
          await this.sendFCMTokenToBackend(this.firebaseService.fcmToken, authToken);
        } else {
          // Get token from Firebase Service
          console.log(' No FCM token, getting from Firebase Service...');
          await this.firebaseService.requestPermission();
          
          if (this.firebaseService.fcmToken) {
            console.log(' Got FCM token after permission');
            await this.sendFCMTokenToBackend(this.firebaseService.fcmToken, authToken);
          }
        }
      } else if (Notification.permission === 'default') {
        // Permission not decided yet, ask user
        console.log(' Notification permission not decided, requesting...');
        
        // Show a snackbar to inform user about notification permission
        this._snackBar.open('Please allow notifications for better experience', 'OK', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3000
        });
        
        // Request permission
        const hasPermission = await this.firebaseService.requestPermission();
        
        if (hasPermission && this.firebaseService.fcmToken) {
          console.log(' Permission granted, sending token to backend');
          await this.sendFCMTokenToBackend(this.firebaseService.fcmToken, authToken);
        }
      } else {
        // Permission denied
        console.log(' Notification permission denied by user');
        this._snackBar.open('Notifications are disabled. Enable in browser settings.', 'Info', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3000
        });
      }
      
      // Check for pending tokens
      console.log(' Checking for pending tokens...');
      this.firebaseService.sendPendingToken();
      
    } catch (error) {
      console.error(' Error handling FCM token:', error);
    }
  }

  private async sendFCMTokenToBackend(fcmToken: string, authToken: string): Promise<void> {
    try {
      console.log(' Sending FCM token to backend...');
      console.log(' FCM Token (first 20 chars):', fcmToken.substring(0, 20) + '...');
      console.log(' Full FCM Token for debugging:', fcmToken);
      console.log(' Backend URL:', API_URL + '/update-fcm-token');
      
      const response: any = await this.http.post(
        API_URL + '/update-fcm-token',
        { 
          fcmToken: fcmToken,
          timestamp: new Date().toISOString()
        },
        { 
          headers: { 
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          } 
        }
      ).toPromise();

      console.log(' FCM token sent to backend successfully:', response);
      
      // Remove pending token if exists
      localStorage.removeItem('pending_fcm_token');
      
    } catch (error: any) {
      console.error(' Error sending FCM token to backend:', error);
      console.error(' Status Code:', error.status);
      console.error(' Error Message:', error.message);
      console.error(' Error Details:', error.error);
      
      // Store token for retry later
      localStorage.setItem('pending_fcm_token', fcmToken);
      console.log(' Token stored for retry');
      
      // Show error message to user
      this._snackBar.open('Failed to save notification token. Will retry later.', 'OK', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 3000
      });
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

  private showFCMDebugInfo(): void {
    // Get FCM status from service
    const fcmStatus = this.firebaseService.getFCMStatus();
    
    console.log(' ========== FCM DEBUG INFO ==========');
    console.log('FCM Supported:', fcmStatus.isSupported);
    console.log(' FCM Initialized:', fcmStatus.isInitialized);
    console.log(' Messaging Available:', fcmStatus.hasMessaging);
    console.log('Notification Permission:', fcmStatus.notificationPermission);
    console.log(' Service Worker Supported:', fcmStatus.serviceWorker);
    console.log(' FCM Token Available:', !!fcmStatus.fullToken);
    
    if (fcmStatus.fullToken) {
      console.log(' FCM Token Obtained:', fcmStatus.fullToken);
      console.log(' FCM Token (first 20 chars):', fcmStatus.fullToken.substring(0, 20) + '...');
    } else {
      console.log(' No FCM Token Available');
    }
    
    console.log(' =====================================');
    
    // Also show in snackbar for user info
    if (fcmStatus.fullToken) {
      this._snackBar.open('Notification token saved successfully!', 'OK', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 3000
      });
    }
  }

  // Optional: Add a debug button in template for manual testing
  async testFCMToken(): Promise<void> {
    try {
      console.log(' Manual FCM Token Test');
      
      const hasPermission = await this.firebaseService.requestPermission();
      
      if (hasPermission) {
        const fcmStatus = this.firebaseService.getFCMStatus();
        
        if (fcmStatus.fullToken) {
          console.log(' FCM Token:', fcmStatus.fullToken);
          
          // Send to backend if user is logged in
          const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
          if (currentUser?.token) {
            await this.sendFCMTokenToBackend(fcmStatus.fullToken, currentUser.token);
          }
        }
      }
    } catch (error) {
      console.error(' FCM Test Error:', error);
    }
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }

  onForgotPassword() {
    this.changeAuthUI.emit('reset-password');
  }
}