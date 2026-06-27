import { env } from '../config/env';

type LogLevel = 'info' | 'warn' | 'error';

const formatMessage = (level: LogLevel, message: string): string => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
};

export const logger = {
  info: (message: string, ...args: any[]) => {
    console.info(formatMessage('info', message), ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(formatMessage('warn', message), ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(formatMessage('error', message), ...args);
  },
};
