import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../core/services/auth';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { Support } from '../../pages/support/support';
import { pushMessages$ } from '../../core/services/push-notification';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
 
interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read?: boolean;
  data?: any;
}
 
@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    Sidebar,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
    CommonModule,
    Support
  ],
  standalone: true,
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout implements OnInit, OnDestroy {
  private auth = inject(Auth);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
 
  notifications: Notification[] = [];
  notificationCount = 0;
 
  ngOnInit() {
    this.listenForFCMMessages();
  }
 
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
 
  listenForFCMMessages() {
    // Subscribe to foreground messages from FCM service only
    // (Don't subscribe to fcmListener.message$ to avoid duplicate notifications)
    pushMessages$
      .pipe(takeUntil(this.destroy$))
      .subscribe((message: any) => {
        this.handleIncomingNotification(message);
      });
  }
 
  handleIncomingNotification(message: any) {
    // Extract notification data from FCM message
    const data = message.data || message.notification || {};
   
    const notification: Notification = {
      id: message.messageId || Date.now().toString(),
      title: data.title || 'New Notification',
      message: data.body || data.subCategory || '',
      timestamp: new Date(),
      read: false,
      data: data
    };
 
    // Add notification to the beginning of the array
    this.notifications.unshift(notification);
   
    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }
 
    this.updateNotificationCount();
    console.log('Notification added to bell:', notification);
  }
 
  updateNotificationCount() {
    this.notificationCount = this.notifications.filter(n => !n.read).length;
  }
 
  markAsRead(notification: Notification) {
    notification.read = true;
    this.updateNotificationCount();
  }
 
  clearNotifications() {
    this.notifications = [];
    this.notificationCount = 0;
  }
 
  logout() {
    this.auth.logout();
    this.router.navigate(['']);
  }
}
 
 
 
 
 