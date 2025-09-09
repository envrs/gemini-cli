/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule } from 'yargs';

import { VoiceInput } from '../../voice/voice-input.js';

export const listenCommand: CommandModule = {
  command: 'listen',
  describe: 'Listens for voice commands',
  handler: async () => {
    const voiceInput = new VoiceInput();

    voiceInput.on('data', (data) => {
      console.log(`You said: ${data}`);
    });

    voiceInput.on('error', (error) => {
      console.error('Error listening for voice commands:', error);
    });

    console.log('Listening for voice commands... Press Ctrl+C to stop.');
    voiceInput.start();

    process.on('SIGINT', () => {
      voiceInput.stop();
      process.exit(0);
    });
  },
};
