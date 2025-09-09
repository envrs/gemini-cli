/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule } from 'yargs';
import { getGlobalConfig } from '../config/global.js';
import { GeminiClient } from '@google/gemini-cli-core';

export const fixCommand: CommandModule = {
  command: 'fix <bugReport>',
  describe: 'Fix a bug',
  builder: (yargs) =>
    yargs.positional('bugReport', {
      describe: 'The bug report',
      type: 'string',
    }),
  handler: async (args) => {
    const bugReport = args['bugReport'] as string;
    const config = getGlobalConfig();
    const client = new GeminiClient(config);

    console.log(`Fixing bug: "${bugReport}"`);

    const prompt = `You are an expert software engineer. You have been asked to fix a bug with the following bug report:\n\n${bugReport}\n\nPlease provide a patch file that fixes the bug.`;

    const response = await client.generateContent(
      [{ role: 'user', parts: [{ text: prompt }] }],
      {},
      new AbortController().signal,
      config.getModel(),
    );

    // TODO: Extract the patch from the response and save it to a file.
    console.log(response);
  },
};
