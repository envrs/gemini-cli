/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule } from 'yargs';
import { getGlobalConfig } from '../../config/global.js';
import { GeminiClient } from '@google/gemini-cli-core';

export const generateCommand: CommandModule = {
  command: 'generate <prompt>',
  describe: 'Generate code from a prompt',
  builder: (yargs) =>
    yargs.positional('prompt', {
      describe: 'The prompt to generate code from',
      type: 'string',
    }),
  handler: async (args) => {
    const prompt = args['prompt'] as string;
    const config = getGlobalConfig();
    const client = new GeminiClient(config);
    // This is a placeholder for where the code generation would happen.
    // The actual implementation will require more work.
    console.log(`Generating code for prompt: "${prompt}"`);
    const response = await client.generateContent(
      [{ role: 'user', parts: [{ text: prompt }] }],
      {},
      new AbortController().signal,
      config.getModel(),
    );
    console.log(response);
  },
};
