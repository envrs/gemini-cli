/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule } from 'yargs';
import { loadAgents, saveAgents, Agent } from '@google/gemini-cli-core';

export const addCommand: CommandModule = {
  command: 'add <name> <model> [temperature]',
  describe: 'Add a new agent',
  builder: (yargs) =>
    yargs
      .positional('name', { describe: 'Name of the agent', type: 'string' })
      .positional('model', {
        describe: 'Model to use for the agent',
        type: 'string',
      })
      .positional('temperature', {
        describe: 'Temperature to use for the agent',
        type: 'number',
        default: 1.0,
      }),
  handler: (argv) => {
    const agents = loadAgents();
    const newAgent = new Agent(
      argv['name'] as string,
      argv['model'] as string,
      argv['temperature'] as number,
    );
    agents.push(newAgent);
    saveAgents(agents);
    console.log(`Agent "${argv['name']}" added successfully.`);
  },
};
