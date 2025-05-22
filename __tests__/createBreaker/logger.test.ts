import { Logger } from '../../src';
import { createBreaker } from '../../src/createBreaker';
import { createLoggerMock } from '../setupTests';

describe('createBreaker - logger', () => {
  let loggerMock: Logger;

  beforeEach(() => {
    loggerMock = createLoggerMock();
  });

  it('calls logger.error when it fails after retries', async () => {
    const unstableFn = jest.fn().mockRejectedValue(new Error('fail'));

    const breaker = createBreaker(unstableFn, {
      name: 'logError',
      maxRetries: 1,
      logger: loggerMock,
    });

    await expect(breaker()).rejects.toThrow('fail');
    expect(loggerMock.error).toHaveBeenCalled();
  });

  it('calls logger.warn during retry attempts', async () => {
    const unstableFn = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockResolvedValue('success');

    const breaker = createBreaker(unstableFn, {
      name: 'logRetry',
      maxRetries: 1,
      logger: loggerMock,
    });

    await breaker();
    expect(loggerMock.warn).toHaveBeenCalled();
  });
});
