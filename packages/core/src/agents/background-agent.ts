/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { AutonomousAgent } from './autonomous.js';
import * as cron from 'node-cron';

export class BackgroundAgent extends AutonomousAgent {
  private task: cron.ScheduledTask | null = null;

  schedule(cronExpression: string): void {
    this.task = cron.schedule(cronExpression, () => {
      this.run();
    });
  }

  stop(): void {
    if (this.task) {
      this.task.stop();
    }
  }
}
