
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error(
    "\n**************************************************************************************\n" +
    "ERROR: GOOGLE_API_KEY is not defined in your environment variables. \n" +
    "Please create or update the .env file in the root of your project and add:\n" +
    "GOOGLE_API_KEY=your_actual_google_api_key_here\n\n" +
    "Genkit's Google AI plugin will not be initialized without a valid API key.\n" +
    "The application will likely fail when trying to make AI calls.\n" +
    "**************************************************************************************\n"
  );
}

export const ai = genkit({
  plugins: [
    // Only include the googleAI plugin if an API key is provided
    ...(apiKey ? [googleAI({ apiKey: apiKey })] : [])
  ],
  // The model specified here will only be used if the googleAI plugin is successfully initialized.
  // If no plugin provides this model, calls to it will fail.
  model: 'googleai/gemini-1.5-flash-latest',
});
