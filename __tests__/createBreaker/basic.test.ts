import { createBreaker } from '../../src/createBreaker';
import { createLoggerMock } from '../setupTests';

describe('createBreaker - basic behavior', () => {
  let loggerMock = createLoggerMock();

  beforeEach(() => {
    loggerMock = createLoggerMock();
  });

  it('successfully executes the function on the first attempt', async () => {
    const stableFn = jest.fn().mockResolvedValue('success');
    const breaker = createBreaker(stableFn, {
      name: 'basic',
      logger: loggerMock,
    });

    const result = await breaker();

    expect(result).toBe('success');
    expect(stableFn).toHaveBeenCalledTimes(1);
  });

  it('retries the configured number of times in case of failure', async () => {
    const unstableFn = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockResolvedValue('success');
    const breaker = createBreaker(unstableFn, {
      name: 'retry',
      maxRetries: 1,
      logger: loggerMock,
    });

    const result = await breaker();

    expect(result).toBe('success');
    expect(unstableFn).toHaveBeenCalledTimes(2);
  });
});
