import { createBreaker, fallbackWrapper } from '../../src/createBreaker';
import { createLoggerMock } from '../setupTests';

describe('createBreaker - fallback', () => {
  let loggerMock = createLoggerMock();

  beforeEach(() => {
    loggerMock = createLoggerMock();
  });

  it('calls fallback after all attempts fail', async () => {
    const unstableFn = jest.fn().mockRejectedValue(new Error('fail'));
    const fallbackFn = jest.fn().mockReturnValue('fallback');

    const breaker = createBreaker(unstableFn, {
      name: 'fallback',
      fallback: fallbackFn,
      maxRetries: 2,
      logger: loggerMock,
    });

    const result = await breaker();

    expect(result).toBe('fallback');
    expect(unstableFn).toHaveBeenCalledTimes(3);
    expect(fallbackFn).toHaveBeenCalled();
  });

  it('does not call fallback if function succeeds before retries are exhausted', async () => {
    const unstableFn = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockResolvedValue('success');
    const fallbackFn = jest.fn();

    const breaker = createBreaker(unstableFn, {
      name: 'fallbackSkip',
      fallback: fallbackFn,
      maxRetries: 1,
      logger: loggerMock,
    });

    const result = await breaker();

    expect(result).toBe('success');
    expect(unstableFn).toHaveBeenCalledTimes(2);
    expect(fallbackFn).not.toHaveBeenCalled();
  });

  it('passes original arguments to fallback', async () => {
    const unstableFn = jest.fn().mockRejectedValue(new Error('fail'));
    const fallbackFn = jest.fn().mockReturnValue('fallback');

    const breaker = createBreaker(unstableFn, {
      name: 'fallbackArgs',
      fallback: fallbackFn,
      maxRetries: 1,
      logger: loggerMock,
    });

    await breaker('param1', 42);

    expect(fallbackFn).toHaveBeenCalledWith('param1', 42);
  });

  it('fallbackWrapper calls fallback with arguments without final Error', async () => {
    const fallbackFn = jest.fn().mockResolvedValue('fallback value');

    const result = await fallbackWrapper(fallbackFn, 'param1', 123);

    expect(result).toBe('fallback value');
    expect(fallbackFn).toHaveBeenCalledWith('param1', 123);
    expect(fallbackFn.mock.calls[0].length).toBe(2);
  });
});
