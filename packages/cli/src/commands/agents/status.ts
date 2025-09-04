/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule } from 'yargs';
import { AgentTracker } from '@google/gemini-cli-core';

export const statusCommand: CommandModule = {
  command: 'status <agentId>',
  describe: 'Get the status of an agent',
  builder: (yargs) =>
    yargs.positional('agentId', {
      describe: 'The ID of the agent',
      type: 'string',
    }),
  handler: (args) => {
    const agentId = args['agentId'] as string;
    const agentTracker = AgentTracker.getInstance();
    const status = agentTracker.getAgentStatus(agentId);
    if (status) {
      console.log(status);
    } else {
      console.log(`Agent with ID "${agentId}" not found.`);
    }
  },
};
