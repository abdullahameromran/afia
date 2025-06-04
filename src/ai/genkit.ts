import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Attempt to use GOOGLE_API_KEY from environment variables (e.g., .env file).
// If not found, use the fallback key provided by the user for local development.
// IMPORTANT: For production, ensure GOOGLE_API_KEY is set in your environment
// and ideally remove the fallback key from this code.
const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyBvXb9JJblkFSq5hG2VRDuQ3jkLuiSVAH4';

export const ai = genkit({
  plugins: [googleAI(apiKey ? { apiKey: apiKey } : undefined)].filter(Boolean) as any, // Pass the key directly if available
  model: 'googleai/gemini-1.5-flash-latest',
});
