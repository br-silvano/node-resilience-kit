import { createBreaker } from '../../src/createBreaker';
import { createLoggerMock } from '../setupTests';

jest.useFakeTimers();

describe('createBreaker - timeout and circuit breaker', () => {
  let loggerMock = createLoggerMock();

  beforeEach(() => {
    loggerMock = createLoggerMock();
  });

  it('respects the default timeout of the circuit breaker', async () => {
    const longFn = jest.fn(
      () => new Promise((res) => setTimeout(() => res('done'), 11000)),
    );
    const breaker = createBreaker(longFn, {
      name: 'timeoutTest',
      maxRetries: 0,
      logger: loggerMock,
    });

    const promise = breaker();
    jest.advanceTimersByTime(11000);

    await expect(promise).rejects.toThrow(/Timed out/);
  });

  it('resetTimeout allows a new attempt after the defined interval', async () => {
    const errorFn = jest.fn().mockRejectedValue(new Error('fail'));
    const breaker = createBreaker(errorFn, {
      name: 'resetTimeoutTest',
      maxRetries: 0,
      logger: loggerMock,
      resetTimeout: 3000, // short timeout for testing
    });

    await expect(breaker()).rejects.toThrow();
    await expect(breaker()).rejects.toThrow(/Breaker is open/);

    jest.advanceTimersByTime(3100);

    errorFn.mockResolvedValue('success');
    const result = await breaker();

    expect(result).toBe('success');
  });
});
