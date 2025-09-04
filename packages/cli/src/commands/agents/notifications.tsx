/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule } from 'yargs';
import { render } from 'ink';
import { NotificationUI } from '../../ui/components/NotificationUI.js';

export const notificationsCommand: CommandModule = {
  command: 'notifications',
  describe: 'View and respond to agent notifications',
  handler: () => {
    render(<NotificationUI />);
  },
};
