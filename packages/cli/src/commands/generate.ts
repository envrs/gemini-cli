/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule } from 'yargs';
import { getGlobalConfig } from '../config/global.js';
import { GeminiClient } from '@google/gemini-cli-core';

export const generateCommand: CommandModule = {
  command: 'generate <prompt>',
  describe: 'Generate content from a prompt',
  builder: (yargs) =>
    yargs
      .positional('prompt', {
        describe: 'The prompt to generate content from',
        type: 'string',
      })
      .option('format', {
        describe: 'The format of the output',
        type: 'string',
        choices: ['json', 'md', 'html'],
      }),
  handler: async (args) => {
    const prompt = args['prompt'] as string;
    const format = args['format'] as string | undefined;
    const config = getGlobalConfig();
    const client = new GeminiClient(config);

    let fullPrompt = prompt;
    if (format) {
      fullPrompt = `${prompt} in ${format} format`;
    }

    console.log(`Generating content for prompt: "${fullPrompt}"`);
    const response = await client.generateContent(
      [{ role: 'user', parts: [{ text: fullPrompt }] }],
      {},
      new AbortController().signal,
      config.getModel(),
    );
    console.log(response);
  },
};
