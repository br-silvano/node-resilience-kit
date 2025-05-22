import { Logger } from '../src';

export function createLoggerMock(): Logger {
  return {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  };
}
