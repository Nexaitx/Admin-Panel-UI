import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { initPushNotifications } from './app/core/services/push-notification';

bootstrapApplication(App, appConfig)
  .then(() => {
    // Initialize push notifications (non-blocking). Ensure you added
    // Firebase config and `vapidKey` to `src/environments` and installed
    // `firebase` package.
    initPushNotifications().catch((err) => console.error('Push init error', err));
  })
  .catch((err) => console.error(err));
