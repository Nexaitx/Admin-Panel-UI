import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';

// Subject that emits messages posted from the service worker.
// Components can import `pushMessages$` and subscribe to it.
export const pushMessages$ = new Subject<any>();

/**
 * Initialize Firebase Messaging, register the service worker,
 * request notification permission and obtain the FCM token.
 *
 * This function uses the modular Firebase SDK. It does not rely on
 * Angular DI so it can be invoked from `main.ts` after bootstrap.
 */
export async function initPushNotifications(): Promise<void> {
  try {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications.');
      return;
    }

    // initialize firebase app using environment.firebase
    const app = initializeApp(environment.firebase as any);
    const messaging = getMessaging(app);

    if ('serviceWorker' in navigator) {
      // register the firebase service worker at the root
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      await navigator.serviceWorker.ready;

      // Listen for messages posted from the service worker (e.g. push payloads)
      try {
        navigator.serviceWorker.addEventListener('message', (event) => {
          try {
            console.log('[client] Message from service worker:', event.data);
            // Emit into the shared Subject so any component can react
            pushMessages$.next(event.data);
          } catch (e) {
            console.log('[client] Message from service worker (raw):', event);
            pushMessages$.next(event);
          }
        });
      } catch (e) {
        // navigator.serviceWorker may be unavailable in some environments
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission not granted.');
        return;
      }

      // get FCM token. Make sure to set `environment.vapidKey`.
      // Skip if vapidKey is not configured (still a placeholder)
      if (environment.vapidKey && !environment.vapidKey.includes('<YOUR')) {
        try {
          const token = await getToken(messaging, {
            vapidKey: environment.vapidKey,
            serviceWorkerRegistration: registration
          } as any);

          console.log('FCM token:', token);
        } catch (tokenErr) {
          console.warn('Failed to get FCM token. Ensure vapidKey is correctly set in environment.', tokenErr);
        }
      } else {
        console.warn('FCM vapidKey not configured. Please add your Firebase VAPID key to environment.ts');
      }

      // handle messages when app is in the foreground
            onMessage(messaging, (payload) => {
        console.log('Foreground message received:', payload);
        pushMessages$.next(payload);
        // Show a visual notification even in foreground
        if (payload.notification) {
          const { title, body } = payload.notification;
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title || 'Message', { body });
          }
        }
      });
      // messaging, (payload) => {
      //   console.log('Foreground message received: ', payload);
      // });
    } else {
      console.warn('Service workers are not supported in this browser.');
    }
  } catch (err) {
    console.error('Failed to initialize push notifications', err);
  }
}
