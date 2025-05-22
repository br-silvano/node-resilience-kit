import CircuitBreaker from 'opossum';
import { retry } from './retry';
import { Logger } from './logger';

export interface BreakerOptions {
  name: string;
  fallback?: (...args: any[]) => any;
  maxRetries?: number;
  logger?: Logger;
  resetTimeout?: number;
  timeout?: number;
  errorThresholdPercentage?: number;
}

export function fallbackWrapper(
  fallbackFn: (...args: any[]) => any,
  ...args: any[]
): any {
  const lastArg = args[args.length - 1];
  if (lastArg instanceof Error) {
    return fallbackFn(...args.slice(0, -1));
  }
  return fallbackFn(...args);
}

export function createBreaker<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: BreakerOptions,
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  const wrappedFn = async (
    ...args: Parameters<T>
  ): Promise<Awaited<ReturnType<T>>> => {
    return retry(() => fn(...args), {
      retries: options.maxRetries ?? 0,
      logger: options.logger,
    });
  };

  const breaker = new CircuitBreaker(wrappedFn, {
    timeout: options.timeout ?? 10000,
    errorThresholdPercentage: options.errorThresholdPercentage ?? 50,
    resetTimeout: options.resetTimeout ?? 30000,
  });

  if (options.fallback) {
    breaker.fallback((...args: any[]) =>
      fallbackWrapper(options.fallback!, ...args),
    );
  }

  return (...args: Parameters<T>) => breaker.fire(...args);
}
