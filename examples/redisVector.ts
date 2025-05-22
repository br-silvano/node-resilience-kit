import { createBreaker } from '../src/createBreaker';

const callRedisVector = async (): Promise<string> => {
  // Simulates an asynchronous call to Redis Vector Search
  return 'redis vector search result';
};

const safeCall = createBreaker(callRedisVector, {
  name: 'RedisVectorService',
  maxRetries: 1,
  fallback: async () => {
    // asynchronous fallback that may return a cached result
    return 'cached result';
  },
  logger: console,
  timeout: 5000, // Timeout to avoid long-running calls
  errorThresholdPercentage: 50, // Open circuit after 50% errors
  resetTimeout: 10000, // Attempt to close the circuit after 10s
});

(async () => {
  try {
    const result = await safeCall();
    console.log('Result:', result);
  } catch (error) {
    console.error('Error in breaker call:', error);
  }
})();
