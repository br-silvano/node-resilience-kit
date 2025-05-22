import { createBreaker } from '../src/createBreaker';

const callOpenAI = async (): Promise<string> => {
  // Simulates an asynchronous call to OpenAI that may fail
  // Could be a fetch, axios, or official SDK call
  return 'openai response';
};

const safeCall = createBreaker(callOpenAI, {
  name: 'OpenAIService',
  maxRetries: 2,
  fallback: async () => {
    // asynchronous fallback that can have its own logic
    return 'fallback response';
  },
  logger: console, // Consider adapting to a structured logger in production
  timeout: 5000, // Example timeout to avoid waiting too long
  errorThresholdPercentage: 50, // Defines when the circuit opens
  resetTimeout: 10000, // Time to attempt closing the circuit after opening
});

(async () => {
  try {
    const response = await safeCall();
    console.log('Response:', response);
  } catch (error) {
    console.error('Error in safe call:', error);
  }
})();
