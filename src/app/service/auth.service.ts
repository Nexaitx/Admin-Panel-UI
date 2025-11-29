// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { FirebaseService } from './firebase.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  profile: {
    admin_id: number;
    fullName: string;
    pan: boolean;
    documentVerification: string;
    role: {
      roleid: number;
      roleType: string;
      permissions: string[];
    };
    fcmToken?: string;
  };
  message: string;
  status: boolean;
  token: string;
  fcmToken?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private firebaseService = inject(FirebaseService);
  
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Load user from localStorage on service initialization
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/login`,
      credentials
    ).pipe(
      tap(response => {
        if (response.status) {
          // Save user data with token
          const userData = {
            ...response,
            token: response.token
          };
          
          // Store in localStorage
          localStorage.setItem('currentUser', JSON.stringify(userData));
          localStorage.setItem('authToken', response.token);
          
          // Update BehaviorSubject
          this.currentUserSubject.next(userData);
          
          // Initialize FCM after successful login
          this.initializeFCM();
        }
      })
    );
  }

 private initializeFCM(): void {
    console.log('🔧 AuthService: Initializing FCM after login...');
    
    // Wait for auth to be fully set up
    setTimeout(() => {
      console.log('🔄 AuthService: Triggering FCM token sending...');
      
      // Method 1: Send existing token immediately
      this.firebaseService.sendFCMTokenAfterLogin();
      
      // Method 2: Also try to send any pending tokens
      this.firebaseService.sendPendingToken();
      
      // Method 3: Request new permission if needed
      this.firebaseService.requestPermission().then(success => {
        if (success) {
          console.log('✅ AuthService: FCM setup completed successfully');
        }
      });
      
    }, 1500); // Increased delay to ensure auth is fully set
  }

  logout(): void {
    // Clear all stored data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('pending_fcm_token');
    
    // Update BehaviorSubject
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}