/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule } from 'yargs';
import { AgentTracker } from '@google/gemini-cli-core';

export const historyCommand: CommandModule = {
  command: 'history <agentId>',
  describe: 'Get the history of an agent',
  builder: (yargs) =>
    yargs.positional('agentId', {
      describe: 'The ID of the agent',
      type: 'string',
    }),
  handler: (args) => {
    const agentId = args['agentId'] as string;
    const agentTracker = AgentTracker.getInstance();
    const history = agentTracker.getAgentHistory(agentId);
    if (history) {
      console.log(history);
    } else {
      console.log(`Agent with ID "${agentId}" not found.`);
    }
  },
};
