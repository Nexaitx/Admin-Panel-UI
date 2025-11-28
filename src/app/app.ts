import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loader } from './loader/loader';
import { PushNotificationService } from './core/services/push-notification.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    Loader
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'admin-panel';
  constructor(private pushService: PushNotificationService) {}

  subscribe() {
    this.pushService.subscribeToNotifications();
  }
}
