/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
export interface AgentHistory {
  message: string;
  timestamp: number;
}

const GEMINI_DIR = '.gemini';
const AGENTS_HISTORY_DIR = 'history';

function getAgentsHistoryDir(): string {
  return path.join(os.homedir(), GEMINI_DIR, AGENTS_HISTORY_DIR);
}

export function loadAgentHistory(agentId: string): AgentHistory[] {
  const historyDir = getAgentsHistoryDir();
  const historyFile = path.join(historyDir, `${agentId}.json`);
  if (!fs.existsSync(historyFile)) {
    return [];
  }
  const historyContent = fs.readFileSync(historyFile, 'utf-8');
  return JSON.parse(historyContent);
}

export function saveAgentHistory(
  agentId: string,
  history: AgentHistory[],
): void {
  const historyDir = getAgentsHistoryDir();
  if (!fs.existsSync(historyDir)) {
    fs.mkdirSync(historyDir, { recursive: true });
  }
  const historyFile = path.join(historyDir, `${agentId}.json`);
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
}
