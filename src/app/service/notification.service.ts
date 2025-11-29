// src/app/services/notification.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface NotificationRequest {
  adminId?: number;
  role?: string;
  roles?: string[];
  title: string;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);

  constructor() { }

  // Send notification to specific admin
  sendToAdmin(adminId: number, title: string, message: string, data?: any): Observable<any> {
    const request: NotificationRequest = {
      adminId,
      title,
      message,
      data
    };
    return this.http.post(`${environment.apiUrl}/send-notification-to-admin`, request);
  }

  // Send notification to role
  sendToRole(role: string, title: string, message: string, data?: any): Observable<any> {
    const request: NotificationRequest = {
      role,
      title,
      message,
      data
    };
    return this.http.post(`${environment.apiUrl}/send-notification-to-role`, request);
  }

  // Send notification to multiple roles
  sendToRoles(roles: string[], title: string, message: string, data?: any): Observable<any> {
    const request: NotificationRequest = {
      roles,
      title,
      message,
      data
    };
    return this.http.post(`${environment.apiUrl}/send-notification-to-roles`, request);
  }

  // Update FCM token (for manual update)
  updateFcmToken(token: string): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/update-fcm-token`,
      { fcmToken: token }
    );
  }
}