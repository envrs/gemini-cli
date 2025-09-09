/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule } from 'yargs';
import { listenCommand } from './voice/listen.js';
import { commandCommand } from './voice/command.js';

export const voiceCommand: CommandModule = {
  command: 'voice <command>',
  describe: 'Voice commands',
  builder: (yargs) => yargs.command(listenCommand).command(commandCommand),
  handler: () => {},
};
