
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {next} from '@genkit-ai/next';

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.warn(
    'GOOGLE_API_KEY is not set. AI-related functionality will be disabled.'
  );
}

export const ai = genkit({
  plugins: [
    next(),
    apiKey
      ? googleAI({
          apiKey,
          apiVersion: ['v1', 'v1beta'],
        })
      : undefined,
  ].filter(p => p !== undefined), // Filter out undefined plugins
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
