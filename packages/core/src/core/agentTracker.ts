/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { NotificationManager } from './notificationManager.js';
import type { SubagentTerminateMode } from './subagent.js';
import { SubAgentScope } from './subagent.js';
import { loadAgents } from '../config/agents.js';
import type { Config } from '../config/config.js';

export interface AgentStatus {
  agentId: string;
  agentName: string;
  status: 'RUNNING' | 'COMPLETED' | 'ERROR' | 'STOPPED';
  terminateReason?: SubagentTerminateMode;
}

export interface AgentHistory {
  message: string;
  timestamp: number;
}

export class AgentTracker {
  private static instance: AgentTracker;
  private activeAgents: Map<
    string,
    { scope: SubAgentScope; abortController: AbortController }
  > = new Map();
  private agentHistory: Map<string, AgentHistory[]> = new Map();
  private agentStatus: Map<string, AgentStatus> = new Map();

  private constructor() {}

  static getInstance(): AgentTracker {
    if (!AgentTracker.instance) {
      AgentTracker.instance = new AgentTracker();
    }
    return AgentTracker.instance;
  }

  async startAgent(
    agentName: string,
    context: Record<string, unknown>,
    runtimeContext: Config,
  ): Promise<string> {
    const agents = loadAgents();
    const agentConfig = agents.find((a) => a.name === agentName);
    if (!agentConfig) {
      throw new Error(`Agent with name "${agentName}" not found.`);
    }

    const agentId = `${agentName}-${Date.now()}`;
    const abortController = new AbortController();
    const subagent = await SubAgentScope.create(
      agentName,
      runtimeContext,
      { systemPrompt: 'You are a helpful assistant.' },
      { model: agentConfig.model, temp: agentConfig.temperature, top_p: 1 },
      { max_time_minutes: 10 },
      abortController,
      {
        onMessage: (message) => {
          this.addHistory(agentId, message);
        },
        onNotification: (notification) => {
          const notificationManager = NotificationManager.getInstance();
          return notificationManager.showNotification(notification);
        },
      },
    );

    this.activeAgents.set(agentId, { scope: subagent, abortController });
    this.agentStatus.set(agentId, {
      agentId,
      agentName,
      status: 'RUNNING',
    });

    subagent
      .runNonInteractive(new ContextState())
      .then(() => {
        const status = this.agentStatus.get(agentId);
        if (status) {
          status.status = 'COMPLETED';
          status.terminateReason = subagent.output.terminate_reason;
        }
      })
      .catch(() => {
        const status = this.agentStatus.get(agentId);
        if (status) {
          status.status = 'ERROR';
        }
      });

    return agentId;
  }

  getAgentStatus(agentId: string): AgentStatus | undefined {
    return this.agentStatus.get(agentId);
  }

  getAgentHistory(agentId: string): AgentHistory[] | undefined {
    return this.agentHistory.get(agentId);
  }

  stopAgent(agentId: string): void {
    const agentData = this.activeAgents.get(agentId);
    if (agentData) {
      agentData.abortController.abort();
      const status = this.agentStatus.get(agentId);
      if (status) {
        status.status = 'STOPPED';
      }
    }
  }

  listAgents(): AgentStatus[] {
    return Array.from(this.agentStatus.values());
  }

  private addHistory(agentId: string, message: string) {
    if (!this.agentHistory.has(agentId)) {
      this.agentHistory.set(agentId, []);
    }
    this.agentHistory.get(agentId)?.push({
      message,
      timestamp: Date.now(),
    });
  }
}
