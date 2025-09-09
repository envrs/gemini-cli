/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Notification {
  title: string;
  message: string;
}

export class NotificationManager {
  private static instance: NotificationManager;

  private constructor() {}

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  showNotification(notification: Notification): void {
    // For now, just log the notification to the console.
    console.log(
      `[Notification] ${notification.title}: ${notification.message}`,
    );
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    // This is a placeholder for sending an email.
    // A real implementation would use a service like SendGrid or Nodemailer.
    console.log(`[Email] To: ${to}, Subject: ${subject}, Body: ${body}`);
  }

  async sendWebhook(url: string, payload: unknown): Promise<void> {
    // This is a placeholder for sending a webhook.
    // A real implementation would use a library like axios or node-fetch.
    console.log(`[Webhook] URL: ${url}, Payload: ${JSON.stringify(payload)}`);
  }
}
