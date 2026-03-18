// firebase.service.ts (Complete Updated Version)
import { Inject, Injectable, inject } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
  isSupported
} from 'firebase/messaging';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { API_URL, ENDPOINTS, PHARMA_API_URL } from '../const';
import { Platform } from '@angular/cdk/platform';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private messaging: Messaging | null = null;
  private currentMessage = new BehaviorSubject<any>(null);
  private http = inject(HttpClient);
  public isSupported = false;
  public fcmToken: string | null = null;
  private tokenRefreshInterval: any;
  private isInitialized = false;
  private tokenRequested = false;

  private staffUpdateCallbacks: ((data: any) => void)[] = [];
  private platform = inject(Platform)


  constructor() {
    this.initializeFirebase();
  }


  public onStaffUpdate(callback: (data: any) => void): void {
    this.staffUpdateCallbacks.push(callback);
  }
  private handleStaffUpdateNotification(data: any): void {
    console.log('🔄 Staff update notification received:', data);

    this.staffUpdateCallbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in staff update callback:', error);
      }
    });
  }

  private handleIncomingMessage(payload: any): void {
    const data = payload.data || {};
    const notification = payload.notification || {};

    console.log('🔔 Handling incoming message type:', data.type || 'GENERAL');

    // Different notification types handle 
    switch (data.type) {
      case 'STAFF_CREATED':
        this.handleStaffCreatedNotification(payload);
        break;
      case 'STAFF_UPDATED':
        this.handleStaffUpdateNotification(data);
        break;
      case 'STAFF_DELETED':
        this.handleStaffUpdateNotification(data); // Same handler for delete
        break;
      default:
        this.showForegroundNotification(notification.title, notification.body, data);
        break;
    }
  }

  private async initializeFirebase() {
    try {
      this.isSupported = await isSupported();

      if (this.isSupported) {
        console.log('✅ Firebase Messaging is supported');
        const app = initializeApp(environment.firebase);
        this.messaging = getMessaging(app);

        this.isInitialized = true;
        console.log('🚀 Firebase Messaging initialized successfully');

        // Auto-request permission only if not already requested
        if (!this.tokenRequested && Notification.permission === 'default') {
          console.log('🔄 Auto-requesting notification permission...');
          this.requestPermission();
        }

      } else {
        console.warn('❌ Firebase Messaging is not supported');
      }
    } catch (error) {
      console.error('❌ Error initializing Firebase:', error);
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!this.messaging || !this.isSupported) {
      console.warn('Firebase messaging not available');
      return false;
    }

    try {
      this.tokenRequested = true;

      // Check current permission status
      if (Notification.permission === 'granted') {
        console.log('✅ Notification permission already granted');
        const token = await this.getFCMToken();
        return !!token;
      }

      if (Notification.permission === 'denied') {
        console.warn('❌ Notification permission denied by user');
        return false;
      }

      // Request permission
      console.log('🔄 Requesting notification permission...');
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        console.log('✅ Notification permission granted');
        const token = await this.getFCMToken();
        return !!token;
      } else {
        console.log('❌ Notification permission denied:', permission);
        return false;
      }
    } catch (error) {
      console.error('❌ Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Request permission and get FCM token directly
   * Returns the token string or null if failed
   */
  async requestPermissionAndGetToken(): Promise<string | null> {
    if (!this.messaging || !this.isSupported) {
      console.warn('Firebase messaging not available');
      return null;
    }

    try {
      this.tokenRequested = true;

      // Check current permission status
      if (Notification.permission === 'granted') {
        console.log('✅ Notification permission already granted');
        const token = await this.getFCMToken();
        return token;
      }

      if (Notification.permission === 'denied') {
        console.warn('❌ Notification permission denied by user');
        return null;
      }

      // Request permission
      console.log('🔄 Requesting notification permission...');
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        console.log('✅ Notification permission granted');
        const token = await this.getFCMToken();
        return token;
      } else {
        console.log('❌ Notification permission denied:', permission);
        return null;
      }
    } catch (error) {
      console.error('❌ Error requesting notification permission:', error);
      return null;
    }
  }

  private async getFCMToken1(): Promise<string | null> {
    if (!this.messaging) {
      console.error('❌ Messaging not available for token generation');
      return null;
    }

    try {
      console.log('🔄 Getting FCM token...');

      // First setup message listener
      this.listenForMessages();

      let serviceWorkerRegistration: ServiceWorkerRegistration | undefined;

      // Try to get existing service worker
      if ('serviceWorker' in navigator) {
        try {
          // Try multiple service worker paths
          serviceWorkerRegistration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');

          if (!serviceWorkerRegistration) {
            serviceWorkerRegistration = await navigator.serviceWorker.getRegistration('/');
          }

          if (!serviceWorkerRegistration) {
            console.log('📝 Service worker not found, registering new one...');
            try {
              serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
                scope: '/',
                type: 'classic'
              });
              console.log('✅ Service Worker registered:', serviceWorkerRegistration);
            } catch (swError) {
              console.error('❌ Service Worker registration failed:', swError);
              // Try fallback registration
              try {
                serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                console.log('✅ Service Worker registered with fallback');
              } catch (fallbackError) {
                console.error('❌ Fallback Service Worker registration failed:', fallbackError);
              }
            }
          } else {
            console.log('✅ Service Worker found:', serviceWorkerRegistration);
          }
        } catch (swError) {
          console.error('❌ Service Worker error:', swError);
        }
      }

      const tokenOptions: any = {
        vapidKey: environment.vapidKey
      };

      if (serviceWorkerRegistration) {
        tokenOptions.serviceWorkerRegistration = serviceWorkerRegistration;
      }

      console.log('🔧 Token options:', tokenOptions);

      const token = await getToken(this.messaging, tokenOptions);

      if (token) {
        console.log('✅ FCM Token obtained:', token);
        this.fcmToken = token;

        // Setup token refresh after getting token
        this.setupTokenRefresh();

        // Send token to backend
        // this.sendTokenToBackend(token);
        return token;
      } else {
        console.log('❌ No FCM token available');
        return null;
      }
    } catch (error: any) {
      console.error('❌ Error getting FCM token:', error);

      // More detailed error logging
      if (error.code) {
        console.error('🔧 Firebase Error Code:', error.code);
      }

      if (error.code === 'messaging/token-subscribe-failed') {
        console.error('🔧 Token subscription failed - check:');
        console.error('1. VAPID key validity');
        console.error('2. Firebase project configuration');
        console.error('3. Service worker registration');
      } else if (error.code === 'messaging/permission-blocked') {
        console.error('🔧 Notification permission blocked');
      } else if (error.code === 'messaging/permission-default') {
        console.error('🔧 Notification permission not granted yet');
      }

      return null;
    }
  }
  public sendFCMTokenAfterLogin(): void {
    if (this.fcmToken) {
      console.log('🔄 Sending existing FCM token after login...');
      // this.sendTokenToBackend(this.fcmToken);
    } else {
      console.log('🔄 No FCM token available, requesting new one...');
      this.requestPermission();
    }
  }
  private async getFCMToken(): Promise<string | null> {
    if (!this.messaging) {
      console.error('❌ Messaging not available for token generation');
      return null;
    }

    try {
      console.log('🔄 Getting FCM token...');

      // Setup message listener first
      this.listenForMessages();

      const token = await getToken(this.messaging, {
        vapidKey: environment.vapidKey
      });

      if (token) {
        console.log('✅ FCM Token obtained:', token.substring(0, 20) + '...');
        this.fcmToken = token;
        const jwtToken = localStorage.getItem('token');
        let headers = new HttpHeaders();
        if (jwtToken) {
          headers = headers.set('Authorization', `Bearer ${jwtToken}`);
        }
        const user = JSON.parse(localStorage.getItem('userProfile') || '{}')
        console.log(this.platform)
        const payload = {
          deviceId: 'browser',
          deviceType: this.platform.isBrowser ? 'browser' : 'safari' ,
          fcmToken: token,
        };
        console.log('fcm token register: ', payload)
        this.http.post(
          PHARMA_API_URL + ENDPOINTS.REGISTER_FCM,
          payload, { headers }
        ).subscribe();

        // Setup token refresh
        this.setupTokenRefresh();

        // Try to send token to backend immediately
        // this.sendTokenToBackend(token);
        return token;
      } else {
        console.log('❌ No FCM token available');
        return null;
      }
    } catch (error: any) {
      console.error('❌ Error getting FCM token:', error);
      return null;
    }
  }


  private setupTokenRefresh(): void {
    // Refresh token every 30 minutes
    this.tokenRefreshInterval = setInterval(() => {
      this.refreshFCMToken();
    }, 30 * 60 * 1000);
  }

  async refreshFCMToken(): Promise<string | null> {
    try {
      if (!this.messaging) return null;

      console.log('🔄 Refreshing FCM token...');
      const token = await getToken(this.messaging, {
        vapidKey: environment.vapidKey
      });

      if (token && token !== this.fcmToken) {
        console.log('🔄 FCM Token refreshed');
        this.fcmToken = token;
        // this.sendTokenToBackend(token);
      }
      return token;
    } catch (error) {
      console.error('❌ Error refreshing FCM token:', error);
      return null;
    }
  }

  private listenForMessages(): void {
    if (!this.messaging) {
      console.error('❌ Messaging not available for listening');
      return;
    }

    console.log('👂 Setting up FCM message listener...');

    onMessage(this.messaging, (payload) => {
      console.log('📨 📨 📨 FOREGROUND MESSAGE RECEIVED:', payload);

      // Log detailed information
      console.log('📊 Notification Title:', payload.notification?.title);
      console.log('📊 Notification Body:', payload.notification?.body);
      console.log('📊 Notification Data:', payload.data);

      // Send to BehaviorSubject for components to listen
      this.currentMessage.next(payload);

      // Handle different notification types
      this.handleIncomingMessage(payload);
    });
  }

  private handleStaffCreatedNotification(payload: any): void {
    const data = payload.data;
    const title = payload.notification?.title || 'New Staff Created 🎉';
    const body = payload.notification?.body || 'A new staff member has been added';

    console.log('👥 STAFF CREATION NOTIFICATION DETAILS:', data);

    // Show both browser and custom notifications
    this.showStaffNotification(title, body, data);
  }

  private showStaffNotification(title: string, body: string, data: any): void {
    // Show browser notification
    this.showBrowserNotification(title, body, data);

    // Also trigger custom UI notification
    this.showCustomUINotification(title, body, data);
  }

  private showBrowserNotification(title: string, body: string, data: any): void {
    if (!('Notification' in window)) {
      console.warn('❌ Browser does not support notifications');
      return;
    }

    if (Notification.permission !== 'granted') {
      console.warn('❌ Notification permission not granted');
      return;
    }

    try {
      const notification = new Notification(title, {
        body: body,
        icon: '/assets/icons/staff-icon.png',
        badge: '/assets/icons/badge-72x72.png',
        tag: 'staff-creation',
        data: data,
        requireInteraction: true
      });

      notification.onclick = () => {
        console.log('🔔 Browser notification clicked');
        window.focus();
        notification.close();
        this.handleNotificationClick(data);
      };

      notification.onclose = () => {
        console.log('🔔 Browser notification closed');
      };

      // Auto close after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);

      console.log('✅ Browser notification shown');

    } catch (error) {
      console.error('❌ Error showing browser notification:', error);
    }
  }

  private showForegroundNotification(title: string, body: string, data: any): void {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    try {
      const notification = new Notification(title, {
        body: body,
        icon: '/assets/icons/icon-72x72.png',
        badge: '/assets/icons/badge-72x72.png',
        data: data
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      setTimeout(() => notification.close(), 5000);
    } catch (error) {
      console.error('❌ Error showing foreground notification:', error);
    }
  }

  private showCustomUINotification(title: string, body: string, data: any): void {
    // This will be handled by the component via the BehaviorSubject
    console.log(`📢 Custom UI Notification: ${title} - ${body}, data`);
  }

  private handleNotificationClick(data: any): void {
    console.log('🔔 Notification clicked with data:', data);

    if (data.staffId) {
      // You can navigate to staff details page here
      this.navigateToStaffDetails(data.staffId);
    }
  }

  private navigateToStaffDetails(staffId: string): void {
    console.log(`📍 Should navigate to staff details: ${staffId}`);
    // Example: this.router.navigate(['/staff', staffId]);
  }

  private storeTokenForRetry(token: string): void {
    console.log('💾 Storing FCM token for retry...');
    localStorage.setItem('pending_fcm_token', token);
    console.log('✅ FCM token stored in localStorage');
  }

  public sendPendingToken(): void {
    console.log('🔄 Checking for pending FCM token...');
    const pendingToken = localStorage.getItem('pending_fcm_token');
    const currentUser = this.getCurrentUser();

    console.log('📊 Pending Token Available:', !!pendingToken);
    console.log('📊 User Logged In:', !!currentUser?.token);

    if (pendingToken && currentUser?.token) {
      console.log('🔄 Sending pending FCM token to backend...');

      this.http.post(
        `${environment.apiUrl}${ENDPOINTS.UPDATE_FCM_TOKEN}`,
        { fcmToken: pendingToken },
        {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          }
        }
      ).subscribe({
        next: (response: any) => {
          console.log('✅ Pending FCM token sent to backend successfully');
          localStorage.removeItem('pending_fcm_token');
        },
        error: (error) => {
          console.error('❌ Error sending pending FCM token to backend:', error);
        }
      });
    } else {
      console.log('ℹ No pending token or user not logged in');
    }
  }


  public async debugFCMSetup(): Promise<any> {
    console.log('🩺 Starting Comprehensive FCM Debug...');

    const debugInfo: any = {
      timestamp: new Date().toISOString(),
      isSupported: this.isSupported,
      isInitialized: this.isInitialized,
      hasMessaging: !!this.messaging,
      notificationPermission: Notification.permission,
      serviceWorkerSupported: 'serviceWorker' in navigator,
      currentFcmToken: this.fcmToken,
      environment: {
        apiUrl: environment.apiUrl,
        firebaseConfig: {
          projectId: environment.firebase.projectId,
          hasVapidKey: !!environment.vapidKey
        }
      }
    };

    // Check service worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
        debugInfo.serviceWorker = {
          registered: !!registration,
          scope: registration?.scope,
          state: registration?.active?.state
        };
      } catch (error) {
        debugInfo.serviceWorkerError = error;
      }
    }

    console.log('📊 FCM Debug Report:', debugInfo);
    return debugInfo;
  }



  private getCurrentUser(): any {
    try {
      // Get token from localStorage (stored by Auth service)
      const token = localStorage.getItem('token');
      if (token) {
        return { token: token };
      }

      // Fallback to currentUser if it exists
      const userData = localStorage.getItem('currentUser');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  getCurrentMessage() {
    return this.currentMessage.asObservable();
  }

  isFCMReady(): boolean {
    return this.isSupported && this.messaging !== null && this.isInitialized;
  }

  // Debug method to check FCM status
  getFCMStatus(): any {
    const status = {
      isSupported: this.isSupported,
      isInitialized: this.isInitialized,
      hasMessaging: !!this.messaging,
      fcmToken: this.fcmToken ? this.fcmToken.substring(0, 20) + '...' : null,
      notificationPermission: Notification.permission,
      serviceWorker: 'serviceWorker' in navigator
    };

    console.log('📊 FCM Status Report:', status);
    return status;
  }


  ngOnDestroy() {
    console.log('🧹 Cleaning up Firebase Service...');
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
      console.log('✅ Token refresh interval cleared');
    }
  }
}