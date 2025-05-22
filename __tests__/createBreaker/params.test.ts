import { Logger } from '../../src';
import { createBreaker } from '../../src/createBreaker';
import { createLoggerMock } from '../setupTests';

describe('createBreaker - parameters and return', () => {
  let loggerMock: Logger;

  beforeEach(() => {
    loggerMock = createLoggerMock();
  });

  it('correctly forwards the arguments to the original function', async () => {
    const fn = jest.fn((a: number, b: number) => Promise.resolve(a + b));
    const breaker = createBreaker(fn, {
      name: 'paramsTest',
      logger: loggerMock,
    });

    const result = await breaker(3, 4);

    expect(result).toBe(7);
    expect(fn).toHaveBeenCalledWith(3, 4);
  });

  it('supports varied parameters and returns the expected result', async () => {
    const fn = jest.fn((obj: { x: number }, flag: boolean) =>
      Promise.resolve(flag ? obj.x : 0),
    );
    const breaker = createBreaker(fn, {
      name: 'variedParamsTest',
      logger: loggerMock,
    });

    expect(await breaker({ x: 5 }, true)).toBe(5);
    expect(await breaker({ x: 5 }, false)).toBe(0);
  });
});
