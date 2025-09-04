/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule } from 'yargs';
import { loadAgents, saveAgents } from '@google/gemini-cli-core';

export const removeCommand: CommandModule = {
  command: 'remove <name>',
  describe: 'Remove an agent',
  builder: (yargs) =>
    yargs.positional('name', {
      describe: 'Name of the agent to remove',
      type: 'string',
    }),
  handler: (argv) => {
    const agents = loadAgents();
    const newAgents = agents.filter((agent) => agent.name !== argv['name']);
    if (agents.length === newAgents.length) {
      console.log(`Agent "${argv['name']}" not found.`);
      return;
    }
    saveAgents(newAgents);
    console.log(`Agent "${argv['name']}" removed successfully.`);
  },
};
