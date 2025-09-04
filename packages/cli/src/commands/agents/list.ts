/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule } from 'yargs';
import { AgentTracker } from '@google/gemini-cli-core';

export const listCommand: CommandModule = {
  command: 'list',
  describe: 'List all running agents',
  handler: () => {
    const agentTracker = AgentTracker.getInstance();
    const agents = agentTracker.listAgents();
    console.log(agents);
  },
};
