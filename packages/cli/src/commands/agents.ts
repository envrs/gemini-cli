/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule } from 'yargs';
import { addCommand } from './agents/add.js';
import { listCommand } from './agents/list.js';
import { removeCommand } from './agents/remove.js';
import { startCommand } from './agents/start.js';
import { statusCommand } from './agents/status.js';
import { historyCommand } from './agents/history.js';
import { stopCommand } from './agents/stop.js';
import { trackCommand } from './agents/track.js';
import { notificationsCommand } from './agents/notifications.js';

export const agentsCommand: CommandModule = {
  command: 'agents <command>',
  describe: 'Manage multiple agents',
  builder: (yargs) =>
    yargs
      .command(addCommand)
      .command(listCommand)
      .command(removeCommand)
      .command(startCommand)
      .command(statusCommand)
      .command(historyCommand)
      .command(stopCommand)
      .command(trackCommand)
      .command(notificationsCommand),
  handler: () => {},
};
