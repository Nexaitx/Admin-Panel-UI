import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FcmListenerService {

  private fcmMessage = new Subject<any>();
  message$ = this.fcmMessage.asObservable();

  constructor() {
    navigator.serviceWorker.addEventListener('message', (event: any) => {
      this.fcmMessage.next(event.data);  // 👈 pass data to components
    });
  }
}
