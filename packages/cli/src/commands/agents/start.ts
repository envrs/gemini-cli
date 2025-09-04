/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule } from 'yargs';
import { AgentTracker } from '@google/gemini-cli-core';
import { getGlobalConfig } from '../../config/global.js';

export const startCommand: CommandModule = {
  command: 'start <agentName>',
  describe: 'Start a new agent',
  builder: (yargs) =>
    yargs.positional('agentName', {
      describe: 'The name of the agent to start',
      type: 'string',
    }),
  handler: async (args) => {
    const agentName = args['agentName'] as string;
    const config = getGlobalConfig();
    const agentTracker = AgentTracker.getInstance();
    const agentId = await agentTracker.startAgent(agentName, {}, config);
    console.log(`Agent started with ID: ${agentId}`);
  },
};
