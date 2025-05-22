import { getErrorMessage } from './utils/errorUtils';

export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    retries: number;
    delayMs?: number;
    logger?: {
      log?: (msg: string) => void;
      warn?: (msg: string) => void;
      error?: (msg: string, err?: unknown) => void;
    };
  },
): Promise<T> {
  let attempt = 0;
  const retries = Math.max(0, options.retries);
  const delay = options.delayMs ?? 1000;

  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      const errMsg = getErrorMessage(err);

      if (attempt > retries) {
        options.logger?.error?.(`All ${retries} retry attempts failed.`, err);
        throw err;
      }

      options.logger?.log?.(
        `Attempt ${attempt} failed, will retry in ${delay}ms.`,
      );
      options.logger?.warn?.(`Retry attempt ${attempt}: ${errMsg}`);

      await new Promise((res) => setTimeout(res, delay));
    }
  }
}
