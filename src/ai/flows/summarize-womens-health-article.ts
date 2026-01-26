
'use server';
/**
 * @fileOverview Summarizes a women's health article from a given URL.
 *
 * - summarizeWomensHealthArticle - A function that summarizes the article.
 * - SummarizeWomensHealthArticleInput - The input type for the summarizeWomensHealthArticle function.
 * - SummarizeWomensHealthArticleOutput - The return type for the summarizeWomensHealthArticle function.
 */

import { z } from 'zod';

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
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error("GOOGLE_API_KEY is not set.");
        throw new Error("Google API Key is not configured.");
    }
    
    const promptText = `You are an expert summarizer of women's health articles. Please provide a concise summary of the article found at the following URL: ${input.articleUrl}. Focus on the main points and key takeaways.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: promptText }]
                }]
            })
        });

        const responseData = await response.json();

        if (!response.ok) {
            const errorMessage = responseData.error?.message || response.statusText;
            console.error("Summarize API Error Response:", JSON.stringify(responseData, null, 2));
            throw new Error(`API response failed (${response.status}): ${errorMessage}`);
        }
        
        if (responseData.candidates && responseData.candidates.length > 0 && responseData.candidates[0].content?.parts[0]?.text) {
            const summary = responseData.candidates[0].content.parts[0].text;
            return { summary };
        } else {
            console.warn("Summarize API response blocked or empty:", responseData);
            let blockReason = responseData.promptFeedback?.blockReason;
            if (blockReason) {
              throw new Error(`Failed to generate summary, it may violate safety policies. Reason: ${blockReason}`);
            }
            throw new Error("Failed to generate a summary from the article. The response was empty or blocked.");
        }

    } catch (e: any) {
        console.error("Error calling summarize article flow:", e);
        throw new Error(`Failed to summarize article: ${e.message}`);
    }
}
