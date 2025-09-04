/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { useEffect, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import type { Notification } from '@google/gemini-cli-core';
import { NotificationManager } from '@google/gemini-cli-core';

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

const NotificationDetails: React.FC<{ notification: Notification }> = ({
  notification,
}) => {
  const [response, setResponse] = useState('');
  const [focusedButton, setFocusedButton] = useState(0);

  const handleResponse = () => {
    const notificationManager = NotificationManager.getInstance();
    notificationManager.respondToNotification(notification.id, response);
  };

  useInput((input, key) => {
    if (key.leftArrow) {
      setFocusedButton(Math.max(0, focusedButton - 1));
    } else if (key.rightArrow) {
      setFocusedButton(
        Math.min(notification.options.length, focusedButton + 1),
      );
    }
  });

  return (
    <Box flexDirection="column" borderStyle="round" padding={1} margin={1}>
      <Text>{notification.prompt}</Text>
      <Box>
        {notification.options.map((option: string, index: number) => (
          <Box key={option} marginRight={1}>
            <Button
              onPress={() => setResponse(option)}
              isFocused={focusedButton === index}
            >
              {option}
            </Button>
          </Box>
        ))}
      </Box>
      <Box marginTop={1}>
        <Button
          onPress={handleResponse}
          isFocused={focusedButton === notification.options.length}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export const NotificationUI: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const notificationManager = NotificationManager.getInstance();
      setNotifications(notificationManager.listNotifications());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box flexDirection="column">
      <Text bold>Notifications</Text>
      {notifications.map((notification) => (
        <NotificationDetails
          key={notification.id}
          notification={notification}
        />
      ))}
    </Box>
  );
};
