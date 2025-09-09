/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule } from 'yargs';
import { getGlobalConfig } from '../../config/global.js';
import { GeminiClient } from '@google/gemini-cli-core';

export const reviewCommand: CommandModule = {
  command: 'review <path>',
  describe: 'Review code at a given path',
  builder: (yargs) =>
    yargs.positional('path', {
      describe: 'The path to the code to review',
      type: 'string',
    }),
  handler: async (args) => {
    const path = args['path'] as string;
    const config = getGlobalConfig();
    const client = new GeminiClient(config);
    // This is a placeholder for where the code review would happen.
    // The actual implementation will require more work.
    console.log(`Reviewing code at path: "${path}"`);
    const response = await client.generateContent(
      [{ role: 'user', parts: [{ text: `Review the code at ${path}` }] }],
      {},
      new AbortController().signal,
      config.getModel(),
    );
    console.log(response);
  },
};
