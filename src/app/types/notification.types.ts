// src/app/types/notification.types.ts
export interface NotificationData {
  type: string;
  staffId?: string;
  staffName?: string;
  staffEmail?: string;
  staffRole?: string;
  timestamp?: string;
  action?: string;
  url?: string;
  [key: string]: string | undefined; // Index signature for additional properties
}

export interface FirebaseMessage {
  notification?: {
    title: string;
    body: string;
    image?: string;
  };
  data?: NotificationData;
}