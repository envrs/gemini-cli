/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule } from 'yargs';
import { generateCommand } from './code/generate.js';
import { reviewCommand } from './code/review.js';
import { assistCommand } from './code/assist.js';

export const codeCommand: CommandModule = {
  command: 'code <command>',
  describe: 'Code generation, review, and assistance',
  builder: (yargs) =>
    yargs
      .command(generateCommand)
      .command(reviewCommand)
      .command(assistCommand),
  handler: () => {},
};
