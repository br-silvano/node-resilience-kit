import { createBreaker } from '../src/createBreaker';

const callSupabase = async (): Promise<string> => {
  // Simulates an asynchronous call to Supabase
  return 'supabase response';
};

const safeCall = createBreaker(callSupabase, {
  name: 'SupabaseService',
  maxRetries: 3,
  fallback: async () => {
    // asynchronous fallback that may return default data or cache
    return 'default supabase data';
  },
  logger: console,
  timeout: 8000, // Timeout to limit the call duration
  errorThresholdPercentage: 50, // Open circuit after 50% errors
  resetTimeout: 15000, // Time to attempt reopening the circuit
});

(async () => {
  try {
    const result = await safeCall();
    console.log('Result:', result);
  } catch (error) {
    console.error('Error in breaker call:', error);
  }
})();
