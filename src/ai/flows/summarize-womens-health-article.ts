'use server';
/**
 * @fileOverview Summarizes a women's health article from a given URL.
 *
 * - summarizeWomensHealthArticle - A function that summarizes the article.
 * - SummarizeWomensHealthArticleInput - The input type for the summarizeWomensHealthArticle function.
 * - SummarizeWomensHealthArticleOutput - The return type for the summarizeWomensHealthArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeWomensHealthArticleInputSchema = z.object({
  articleUrl: z.string().url().describe('The URL of the article to summarize.'),
});
export type SummarizeWomensHealthArticleInput = z.infer<typeof SummarizeWomensHealthArticleInputSchema>;

const SummarizeWomensHealthArticleOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the article.'),
});
export type SummarizeWomensHealthArticleOutput = z.infer<typeof SummarizeWomensHealthArticleOutputSchema>;

export async function summarizeWomensHealthArticle(
  input: SummarizeWomensHealthArticleInput
): Promise<SummarizeWomensHealthArticleOutput> {
  return summarizeWomensHealthArticleFlow(input);
}

const summarizeWomensHealthArticlePrompt = ai.definePrompt({
  name: 'summarizeWomensHealthArticlePrompt',
  input: {schema: SummarizeWomensHealthArticleInputSchema},
  output: {schema: SummarizeWomensHealthArticleOutputSchema},
  prompt: `You are an expert summarizer of women's health articles. Please provide a concise summary of the article found at the following URL: {{{articleUrl}}}. Focus on the main points and key takeaways.`,
});

const summarizeWomensHealthArticleFlow = ai.defineFlow(
  {
    name: 'summarizeWomensHealthArticleFlow',
    inputSchema: SummarizeWomensHealthArticleInputSchema,
    outputSchema: SummarizeWomensHealthArticleOutputSchema,
  },
  async input => {
    const {output} = await summarizeWomensHealthArticlePrompt(input);
    return output!;
  }
);
