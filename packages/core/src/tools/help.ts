/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ToolResult, ToolInvocation } from './tools.js';
import { BaseDeclarativeTool, BaseToolInvocation, Kind } from './tools.js';
import type { ToolRegistry } from './tool-registry.js';

class HelpToolInvocation extends BaseToolInvocation<
  Record<string, unknown>,
  ToolResult
> {
  constructor(private readonly toolRegistry: ToolRegistry) {
    super({});
  }

  getDescription(): string {
    return 'Lists all available tools.';
  }

  async execute(): Promise<ToolResult> {
    const tools = this.toolRegistry.getAllTools();
    const toolList = tools
      .map((tool) => `* ${tool.name}: ${tool.description}`)
      .join('\n');
    return {
      llmContent: `Available tools:\n${toolList}`,
      returnDisplay: `Available tools:\n${toolList}`,
    };
  }
}

export class HelpTool extends BaseDeclarativeTool<
  Record<string, unknown>,
  ToolResult
> {
  static Name = 'help';

  constructor(private readonly toolRegistry: ToolRegistry) {
    super(
      HelpTool.Name,
      'Help',
      'Lists all available tools.',
      Kind.Other,
      {},
      true,
      false,
    );
  }

  protected createInvocation(): ToolInvocation<
    Record<string, unknown>,
    ToolResult
  > {
    return new HelpToolInvocation(this.toolRegistry);
  }
}
