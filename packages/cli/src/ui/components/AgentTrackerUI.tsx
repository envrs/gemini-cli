/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { useEffect, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import type { AgentStatus, AgentHistory } from '@google/gemini-cli-core';
import { AgentTracker } from '@google/gemini-cli-core';

const Button: React.FC<{
  onPress: () => void;
  children: React.ReactNode;
  isFocused: boolean;
}> = ({ onPress, children, isFocused }) => {
  useInput((input, key) => {
    if (isFocused && key.return) {
      onPress();
    }
  });

  return (
    <Box
      borderStyle="round"
      paddingX={1}
      borderColor={isFocused ? 'cyan' : 'gray'}
    >
      <Text>{children}</Text>
    </Box>
  );
};

const AgentDetails: React.FC<{ agent: AgentStatus }> = ({ agent }) => {
  const [history, setHistory] = useState<AgentHistory[] | undefined>([]);
  const [focusedButton, setFocusedButton] = useState(0);

  const handleStop = () => {
    const agentTracker = AgentTracker.getInstance();
    agentTracker.stopAgent(agent.agentId);
  };

  const handleViewHistory = () => {
    const agentTracker = AgentTracker.getInstance();
    setHistory(agentTracker.getAgentHistory(agent.agentId));
  };

  useInput((input, key) => {
    if (key.leftArrow) {
      setFocusedButton(0);
    } else if (key.rightArrow) {
      setFocusedButton(1);
    }
  });

  return (
    <Box flexDirection="column" borderStyle="round" padding={1} margin={1}>
      <Text>Agent ID: {agent.agentId}</Text>
      <Text>Agent Name: {agent.agentName}</Text>
      <Text>Status: {agent.status}</Text>
      {agent.terminateReason && (
        <Text>Termination Reason: {agent.terminateReason}</Text>
      )}
      <Box>
        <Box marginRight={1}>
          <Button onPress={handleStop} isFocused={focusedButton === 0}>
            Stop
          </Button>
        </Box>
        <Box>
          <Button onPress={handleViewHistory} isFocused={focusedButton === 1}>
            View History
          </Button>
        </Box>
      </Box>
      {history && history.length > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text bold>History</Text>
          {history.map((item, index) => (
            <Text key={index}>
              [{new Date(item.timestamp).toLocaleTimeString()}] {item.message}
            </Text>
          ))}
        </Box>
      )}
    </Box>
  );
};

export const AgentTrackerUI: React.FC = () => {
  const [agents, setAgents] = useState<AgentStatus[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const agentTracker = AgentTracker.getInstance();
      setAgents(agentTracker.listAgents());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box flexDirection="column">
      <Text bold>Active Agents</Text>
      {agents.map((agent) => (
        <AgentDetails key={agent.agentId} agent={agent} />
      ))}
    </Box>
  );
};
