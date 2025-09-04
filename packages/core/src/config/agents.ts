/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

const GEMINI_DIR = '.gemini';
const AGENTS_CONFIG_FILENAME = 'agents.json';

export interface Agent {
  name: string;
  model: string;
  temperature: number;
}

function getAgentsConfigPath(): string {
  return path.join(os.homedir(), GEMINI_DIR, AGENTS_CONFIG_FILENAME);
}

export function loadAgents(): Agent[] {
  const configPath = getAgentsConfigPath();
  if (!fs.existsSync(configPath)) {
    return [];
  }
  const configContent = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(configContent);
}

export function saveAgents(agents: Agent[]): void {
  const configPath = getAgentsConfigPath();
  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  fs.writeFileSync(configPath, JSON.stringify(agents, null, 2));
}
