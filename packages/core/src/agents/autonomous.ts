/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Agent } from '../config/agents.js';
import type { Config } from '../config/config.js'; // Changed to import type

export interface Task {
  name: string;
  description: string;
  execute(): Promise<void>;
  toolName?: string;
  args?: Record<string, unknown>;
}

const PLAN_SCHEMA = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'A short, descriptive name for the task.',
      },
      description: {
        type: 'string',
        description:
          'A detailed description of the task, including its purpose and expected outcome.',
      },
      toolName: {
        type: 'string',
        description: 'Optional: The name of the tool to execute for this task.',
      },
      args: {
        type: 'object',
        description:
          'Optional: A dictionary of arguments to pass to the tool, if toolName is specified.',
      },
    },
    required: ['name', 'description'],
  },
};

interface PlanTaskJson {
  // Added interface for type safety
  name: string;
  description: string;
  toolName?: string;
  args?: Record<string, unknown>;
}

export class AutonomousAgent extends Agent {
  private config: Config; // Added config property

  constructor(
    name: string,
    model: string,
    temperature: number,
    config: Config,
  ) {
    // Modified constructor
    super(name, model, temperature);
    this.config = config; // Assign config
  }

  async plan(): Promise<Task[]> {
    const geminiClient = this.config.getGeminiClient();
    const availableTools = this.config
      .getToolRegistry()
      .getFunctionDeclarations();

    const prompt = `You are an autonomous agent. Your goal is to break down complex problems into a series of smaller, actionable tasks.
You have access to the following tools:
${JSON.stringify(availableTools, null, 2)}

Based on the user's request, generate a plan as a JSON array of tasks. Each task should have a 'name' and 'description'. If a task requires using a tool, include 'toolName' and 'args' properties.

User's Request: Implement intelligent agents that can look up commands, execute tasks, fix bugs, and adapt to workflows.

Your Plan:`;

    const response = await geminiClient.generateJson(
      [{ parts: [{ text: prompt }], role: 'user' }],
      PLAN_SCHEMA,
      new AbortController().signal, // TODO: Pass a proper AbortSignal
      this.model,
    );

    // Map the raw JSON response to Task objects
    return (response as unknown as PlanTaskJson[]).map(
      (taskJson: PlanTaskJson) => ({
        name: taskJson.name,
        description: taskJson.description,
        toolName: taskJson.toolName,
        args: taskJson.args,
        execute: async () => {
          console.log(
            `Executing task: ${taskJson.name} - ${taskJson.description}`,
          );
          if (taskJson.toolName) {
            console.log(
              `  Tool: ${taskJson.toolName}, Args: ${JSON.stringify(taskJson.args)}`,
            );
            // Get the toolRegistry from the class instance
            const tool = this.config
              .getToolRegistry()
              .getTool(taskJson.toolName);
            if (tool) {
              try {
                // Ensure args is an object, even if undefined
                const toolArgs = taskJson.args || {};
                const toolResult = await tool.buildAndExecute(
                  toolArgs,
                  new AbortController().signal,
                );
                console.log(
                  `Tool ${taskJson.toolName} executed successfully:`,
                  toolResult,
                );
              } catch (toolError) {
                console.error(
                  `Error executing tool ${taskJson.toolName}:`,
                  toolError,
                );
              }
            } else {
              console.warn(`Tool ${taskJson.toolName} not found.`);
            }
          }
        },
      }),
    );
  }

  async execute(tasks: Task[]): Promise<void> {
    for (const task of tasks) {
      await task.execute();
    }
  }

  async run(): Promise<void> {
    const tasks = await this.plan();
    await this.execute(tasks);
  }
}
