# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Local Development

1.  Ensure you have Node.js and npm installed.
2.  Create a `.env` file in the root of the project and populate it with your API keys:
    ```env
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL_HERE"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY_HERE"
    SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE"
    GOOGLE_API_KEY="YOUR_GOOGLE_GENERATIVE_AI_API_KEY_HERE"
    ```
3.  Install dependencies: `npm install`
4.  Run the development server: `npm run dev`
    This will typically start the Next.js app on `http://localhost:9002` and the Genkit development server.

## Deployment to Vercel

This Next.js application is ready to be deployed to [Vercel](https://vercel.com/).

### Environment Variables

For the application to function correctly on Vercel, you **must** configure the following environment variables in your Vercel project settings:

*   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase public anonymous key.
*   `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (this is a secret).
*   `GOOGLE_API_KEY`: Your Google Generative AI API key (this is a secret).

These are the same variables found in your local `.env` file. Vercel uses its own system for managing environment variables for deployed applications; it typically does not use the `.env` file directly from your repository for production builds.

### Notes

*   The `apphosting.yaml` file in this project is specifically for Firebase App Hosting and is not used by Vercel.
*   Vercel should automatically detect that this is a Next.js project and configure the build settings appropriately.
