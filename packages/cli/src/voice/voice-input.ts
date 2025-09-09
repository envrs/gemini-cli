/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { SpeechClient } from '@google-cloud/speech';
import record from 'node-record-lpcm16';
import { EventEmitter } from 'node:events';
import type { Duplex } from 'node:stream';

export class VoiceInput extends EventEmitter {
  private speechClient: SpeechClient;
  private recognitionStream: Duplex;

  constructor() {
    super();
    this.speechClient = new SpeechClient();
  }

  start() {
    const request = {
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
      },
      interimResults: false,
    };

    this.recognitionStream = this.speechClient
      .streamingRecognize(request)
      .on('error', (error) => {
        this.emit('error', error);
      })
      .on('data', (data) => {
        this.emit('data', data.results[0].alternatives[0].transcript);
      });

    record
      .record({
        sampleRateHertz: 16000,
        threshold: 0,
        verbose: false,
        recordProgram: 'rec',
        silence: '10.0',
      })
      .stream()
      .on('error', (error) => {
        this.emit('error', error);
      })
      .pipe(this.recognitionStream);
  }

  stop() {
    if (this.recognitionStream) {
      this.recognitionStream.end();
    }
    record.stop();
  }
}
