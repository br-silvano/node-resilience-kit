# node-resilience-kit

[![npm version](https://img.shields.io/npm/v/node-resilience-kit.svg)](https://www.npmjs.com/package/node-resilience-kit)
[![build status](https://img.shields.io/github/actions/workflow/status/br-silvano/node-resilience-kit/ci.yml?branch=main)](https://github.com/br-silvano/node-resilience-kit/actions)
[![license](https://img.shields.io/npm/l/node-resilience-kit)](LICENSE)

> Pluggable resilience kit for Node.js with Circuit Breaker, Retry, and Fallback to make your async calls more robust.

---

## Installation

```bash
npm install node-resilience-kit
````

---

## Overview

`node-resilience-kit` simplifies creating resilient calls to external services or potentially failing functions by combining these patterns:

* **Circuit Breaker**: prevents excessive calls to unstable services after consecutive failures.
* **Retry**: automatically retries calls that fail temporarily.
* **Fallback**: provides an alternative response when the main function is unavailable.

---

## Basic Usage

```ts
import { createBreaker } from 'node-resilience-kit';

const myService = async (param: string) => {
  // main logic (e.g., API call)
  return `Result for ${param}`;
};

const safeCall = createBreaker(myService, {
  name: 'MyService',
  maxRetries: 2,
  fallback: async (param: string) => `Fallback for ${param}`,
  logger: console,
});

(async () => {
  try {
    const result = await safeCall('test');
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
})();
```

---

## Configuration

| Option                     | Type                      | Description                                                    | Default |
| -------------------------- | ------------------------- | -------------------------------------------------------------- | ------- |
| `name`                     | `string`                  | Circuit identifier name for logging and metrics                | —       |
| `fallback`                 | `(...args: any[]) => any` | Fallback function providing an alternative response on failure | —       |
| `maxRetries`               | `number`                  | Maximum retry attempts on failure                              | 0       |
| `logger`                   | `Logger`                  | Logging object (e.g., `console`, `winston`)                    | —       |
| `timeout`                  | `number`                  | Timeout in milliseconds for function execution                 | 10000   |
| `errorThresholdPercentage` | `number`                  | Error percentage threshold to open the circuit                 | 50      |
| `resetTimeout`             | `number`                  | Time in ms before circuit attempts to close and resume         | 30000   |

---

## How It Works

1. The function executes normally with automatic retries on failure.
2. If the error rate exceeds the configured threshold, the circuit opens.
3. While open, calls are blocked and fallback is invoked.
4. After the configured timeout, the circuit attempts to close and resume calls.

---

## Real-World Examples

See full examples in the [`examples/`](./examples) folder:

* OpenAI integration
* Usage with Supabase
* Redis Vector Search

---

## FAQ

**Can the fallback be synchronous or asynchronous?**
Only asynchronous fallback functions are supported.

**How to customize logs?**
Pass an object with `info`, `warn`, and `error` methods, like `console` or a logging library.

**What if the fallback fails?**
The error will be propagated to the caller.

---

## Contribution

Contributions are very welcome!
Open issues to report bugs or suggest features.
Send pull requests for improvements.

---

## License

MIT © Silvano Souza
