/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule } from 'yargs';
import { AgentTracker } from '@google/gemini-cli-core';

export const stopCommand: CommandModule = {
  command: 'stop <agentId>',
  describe: 'Stop a running agent',
  builder: (yargs) =>
    yargs.positional('agentId', {
      describe: 'The ID of the agent',
      type: 'string',
    }),
  handler: (args) => {
    const agentId = args['agentId'] as string;
    const agentTracker = AgentTracker.getInstance();
    agentTracker.stopAgent(agentId);
    console.log(`Agent with ID "${agentId}" stopped.`);
  },
};
