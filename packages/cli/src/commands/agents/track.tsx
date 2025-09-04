/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule } from 'yargs';
import { render } from 'ink';
import { AgentTrackerUI } from '../../ui/components/AgentTrackerUI.js';

export const trackCommand: CommandModule = {
  command: 'track',
  describe: 'Track the status of all running agents',
  handler: () => {
    render(<AgentTrackerUI />);
  },
};
