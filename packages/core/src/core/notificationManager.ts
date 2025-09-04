/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Notification } from './subagent.js';

export class NotificationManager {
  private static instance: NotificationManager;
  private notifications: Map<string, Notification> = new Map();
  private notificationResolvers: Map<string, (response: string) => void> =
    new Map();

  private constructor() {}

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  showNotification(notification: Notification): Promise<string> {
    this.notifications.set(notification.id, notification);
    return new Promise((resolve) => {
      this.notificationResolvers.set(notification.id, resolve);
    });
  }

  listNotifications(): Notification[] {
    return Array.from(this.notifications.values());
  }

  respondToNotification(notificationId: string, response: string) {
    const resolver = this.notificationResolvers.get(notificationId);
    if (resolver) {
      resolver(response);
      this.notifications.delete(notificationId);
      this.notificationResolvers.delete(notificationId);
    }
  }
}
