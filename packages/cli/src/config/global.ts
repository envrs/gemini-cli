/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Config } from '@google/gemini-cli-core';

let config: Config | undefined;

export function setGlobalConfig(newConfig: Config) {
  config = newConfig;
}

export function getGlobalConfig(): Config {
  if (!config) {
    throw new Error('Global config not set');
  }
  return config;
}
