import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { API_URL, ENDPOINTS } from '../const';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  readonly VAPID_PUBLIC_KEY = 'BAEAUYqNSS3-NMydIBTWSuH2he2YId_m78Y-mHcBQyBVjxVsbXXnLp-P55_rtCF_BmsOXjzmy7DcgjdYAflfYbs';
  

  constructor(private swPush: SwPush, private http: HttpClient) {}

subscribeToNotifications() {
     if (!this.swPush.isEnabled) {
       console.log("Service Worker is not enabled");
       return;
     }
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then(pushSubscription => {
 const subJson = pushSubscription.toJSON();

        const payload = {
          endpoint: subJson.endpoint,
          keys: {
          p256dh: subJson.keys?.['p256dh'] || '',
            auth: subJson.keys?.['auth'] || '',
          },
        };

        console.log('Sending Payload to API:', payload);

        this.http.post(`${API_URL}${ENDPOINTS.SUBSCRIBEAPI}`, payload).subscribe({
          next: (res) => console.log('Subscription saved!', res),
          error: (err) => console.error('Error sending subscription', err)
        });

      })
      .catch(err => console.error('Could not subscribe to notifications', err));
  }
}
