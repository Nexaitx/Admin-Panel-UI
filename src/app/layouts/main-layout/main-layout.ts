import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../core/services/auth';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { Support } from '../../pages/support/support';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDivider } from "@angular/material/divider";

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
    CommonModule,
    Support,
    MatBadgeModule,
    MatDivider
],
  standalone: true,
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {
  private auth = inject(Auth);
  private router = inject(Router);
  //   unreadCount = 0;
  //    constructor() {
  //   // Example: if you have a NotificationService that returns unread count,
  //   // subscribe here and update unreadCount. Example (pseudo):
  //   // this.notificationService.unreadCount$.subscribe(count => this.unreadCount = count);

  //   // For demonstration, set a static example:
  //   // remove the next line in production and use your real service
  //   this.unreadCount = 3;
  // }
   // reference to MatMenuTrigger if you need programmatic control
  @ViewChild('notifTrigger') notifTrigger!: MatMenuTrigger;

  // sample notifications - replace with real data from backend
  notifications = [
    {
      id: 1,
      title: 'John Doe reacted to your post',
      message: 'Great post!',
      time: '10 mins ago',
      avatar: 'assets/avatars/john.jpg',
      thumb: 'assets/thumbs/post1.jpg',
      read: false
    },
    {
      id: 2,
      title: 'Richard Miles reacted to your post',
      message: 'Nice work',
      time: '1 day ago',
      avatar: 'assets/avatars/richard.jpg',
      thumb: 'assets/thumbs/post2.jpg',
      read: false
    },
    {
      id: 3,
      title: 'Brian Cumin reacted to your post',
      message: 'Love it',
      time: '1 day ago',
      avatar: 'assets/avatars/brian.jpg',
      thumb: 'assets/thumbs/post3.jpg',
      read: true
    }
  ];
    get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }
   goToStaffBooking() {
    // navigate to staff booking page - change the path if your route differs
    this.router.navigate(['/app/bookings']);
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['']);
  }
  // // open menu programmatically (for hover)
  // openNotifications() {
  //   if (this.notifTrigger && !this.notifTrigger.menuOpen) {
  //     this.notifTrigger.openMenu();
  //   }
  // }

  // close menu when leaving area
  closeNotifications() {
    // small timeout to allow mouseenter on menu itself — prevents flicker
    setTimeout(() => {
      if (this.notifTrigger && this.notifTrigger.menuOpen) {
        this.notifTrigger.closeMenu();
      }
    }, 150);
  }

    openNotification(notif: any, event: Event) {
    event.stopPropagation();
    notif.read = true;

    // navigate if required later
    // this.router.navigate(['/post', notif.postId]);
  }

  // mark all as read
 markAllRead(event: Event) {
    event.stopPropagation();
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
  }

  // view all
  viewAll(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/notifications']);
  }
}
