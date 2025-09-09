/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule } from 'yargs';
import {
  AgentTracker,
  AutonomousAgent,
  BackgroundAgent,
  loadAgents,
} from '@google/gemini-cli-core';
import { loadCliConfig, type CliArgs } from '../../config/config.js'; // Corrected import path
import type { Settings } from '../../config/settings.js'; // Added import
import { v4 as uuidv4 } from 'uuid'; // Added import

export const startCommand: CommandModule = {
  command: 'start <agentName>',
  describe: 'Start a new agent',
  builder: (yargs) =>
    yargs
      .positional('agentName', {
        describe: 'The name of the agent to start',
        type: 'string',
      })
      .option('autonomous', {
        describe: 'Start the agent in autonomous mode',
        type: 'boolean',
        default: false,
      })
      .option('background', {
        describe: 'Run the agent in the background',
        type: 'boolean',
        default: false,
      })
      .option('schedule', {
        describe: 'Schedule the agent to run at a specific cron expression',
        type: 'string',
      }),
  handler: async (args) => {
    const agentName = args['agentName'] as string;

    // For now, we'll use a default empty settings object.
    // In a real CLI, this would be loaded from user settings files.
    const settings: Settings = {};
    const sessionId = uuidv4();
    const cwd = process.cwd();
    const cliArgs: CliArgs = args as unknown as CliArgs; // Cast args to CliArgs

    const config = await loadCliConfig(settings, [], sessionId, cliArgs, cwd);

    const agentTracker = AgentTracker.getInstance();
    const agents = loadAgents();
    const agentConfig = agents.find((a) => a.name === agentName);
    if (!agentConfig) {
      throw new Error(`Agent with name "${agentName}" not found.`);
    }

    if (args['background']) {
      const agent = new BackgroundAgent(
        agentConfig.name,
        agentConfig.model,
        agentConfig.temperature,
        config,
      );
      if (args['schedule']) {
        agent.schedule(args['schedule'] as string);
        console.log(`Agent "${agentName}" scheduled to run.`);
      } else {
        console.log(`Agent "${agentName}" started in the background.`);
        agent.run();
      }
    } else if (args['autonomous']) {
      const agent = new AutonomousAgent(
        agentConfig.name,
        agentConfig.model,
        agentConfig.temperature,
        config,
      );
      // This is a placeholder for where the autonomous agent would be started.
      // The actual implementation will require more work.
      console.log(`Autonomous agent "${agentName}" started.`);
      await agent.run();
    } else {
      const agentId = await agentTracker.startAgent(agentName, {}, config);
      console.log(`Agent started with ID: ${agentId}`);
    }
  },
};
