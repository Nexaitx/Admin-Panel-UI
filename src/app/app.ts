import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loader } from './loader/loader';
import { FirebaseService } from './service/firebase.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Loader],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'admin-panel';
  private firebaseService = inject(FirebaseService);

  async ngOnInit() {
    await this.initializeNotifications();
  }

  private async initializeNotifications(): Promise<void> {
    console.log('🔄 Initializing notifications...');
    
    // Wait for Firebase to initialize
    setTimeout(async () => {
      // First request permission and get token
      const hasPermission = await this.firebaseService.requestPermission();
      
      if (hasPermission) {
        console.log('✅ Notification permission granted');
        // Then send pending token if any
        this.firebaseService.sendPendingToken();
      } else {
        console.warn('❌ Notification permission not granted');
      }
    }, 3000);
  }
}