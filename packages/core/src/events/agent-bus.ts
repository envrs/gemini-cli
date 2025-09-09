/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export class AgentBus {
  private static instance: AgentBus;
  private subscriptions: Map<string, Array<(message: unknown) => void>> =
    new Map();

  private constructor() {}

  static getInstance(): AgentBus {
    if (!AgentBus.instance) {
      AgentBus.instance = new AgentBus();
    }
    return AgentBus.instance;
  }

  publish(topic: string, message: unknown): void {
    const subscribers = this.subscriptions.get(topic);
    if (subscribers) {
      for (const subscriber of subscribers) {
        subscriber(message);
      }
    }
  }

  subscribe(topic: string, callback: (message: unknown) => void): void {
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, []);
    }
    this.subscriptions.get(topic)?.push(callback);
  }
}
