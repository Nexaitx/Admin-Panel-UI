// firebase-messaging-sw.js
// Service worker to handle background notifications from Firebase Cloud Messaging.
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Replace with your config; these values are placeholders and should match
// the `environment.firebase` you set in your Angular environment files.
const firebaseConfig = {
  apiKey: "AIzaSyA7T4I991z3Cl-5tlPyz79igpLkKWaNzDI",
  authDomain: "nexaitxclient.firebaseapp.com",
  projectId: "nexaitxclient",
  storageBucket: "nexaitxclient.firebasestorage.app",
  messagingSenderId: "377640293333",
  appId: "1:377640293333:web:47b6b851d7f3e842bde35c",
  measurementId: "G-RGQFPXFWB0"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  // Log full payload in the service worker console for debugging
  try {
    console.log('[firebase-messaging-sw] onBackgroundMessage payload:', payload);
  } catch (e) {
    // Some browsers may restrict console in certain worker contexts
  }

  const notification = payload.notification || {};
  const title = notification.title || 'New Notification';
 const options = {
  body: notification.body || '',
  icon: notification.icon || '/icons/icon-192.png',  // Updated path
  data: payload.data || {}
};

  // show the notification
  self.registration.showNotification(title, options);
});

self.addEventListener('push', event => {
  // Safely parse push payload
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (err) {
    // If payload is not JSON, fallback to text
    try {
      const text = event.data ? event.data.text() : '';
      data = { notification: { title: 'Message', body: text }, data: {} };
    } catch (e) {
      data = { notification: { title: 'Message', body: '' }, data: {} };
    }
  }

  // Log the received push message in the service worker console
  try {
    console.log('[firebase-messaging-sw] push event received:', data);
  } catch (e) {}

  // Send message to all client pages (Angular app)
  self.clients.matchAll({ includeUncontrolled: true }).then(clients => {
    clients.forEach(client => {
      // Post the entire payload so the app can inspect notification + custom data
      try {
        client.postMessage({ from: 'service-worker', payload: data });
      } catch (e) {}
    });
  });

  // Show Notification (use payload.notification if present)
  const notif = data.notification || { title: 'New Notification', body: '' };
  event.waitUntil(
    self.registration.showNotification(notif.title, {
      body: notif.body,
      data: data.data || {}
    })
  );
});

