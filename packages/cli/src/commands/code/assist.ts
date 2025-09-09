/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule } from 'yargs';
import { getGlobalConfig } from '../../config/global.js';
import { GeminiClient } from '@google/gemini-cli-core';

export const assistCommand: CommandModule = {
  command: 'assist',
  describe: 'Assist with code-related tasks',
  builder: (yargs) =>
    yargs.option('fix-lint-errors', {
      describe: 'Fix lint errors in a project',
      type: 'boolean',
    }),
  handler: async (args) => {
    const config = getGlobalConfig();
    const client = new GeminiClient(config);
    if (args['fix-lint-errors']) {
      // This is a placeholder for where the lint error fixing would happen.
      // The actual implementation will require more work.
      console.log('Fixing lint errors...');
      const response = await client.generateContent(
        [
          {
            role: 'user',
            parts: [{ text: 'Fix all lint errors in the current project' }],
          },
        ],
        {},
        new AbortController().signal,
        config.getModel(),
      );
      console.log(response);
    }
  },
};
