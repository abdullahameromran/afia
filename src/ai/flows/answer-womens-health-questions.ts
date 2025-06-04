// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview This file defines a Genkit flow for answering women's health questions.
 *
 * - answerWomensHealthQuestion - A function that accepts a question and returns an answer.
 * - AnswerWomensHealthQuestionInput - The input type for the answerWomensHealthQuestion function.
 * - AnswerWomensHealthQuestionOutput - The return type for the answerWomensHealthQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerWomensHealthQuestionInputSchema = z.object({
  question: z.string().describe('The question about women\'s health.'),
  userName: z.string().optional().describe('The name of the user asking the question.')
});

export type AnswerWomensHealthQuestionInput = z.infer<typeof AnswerWomensHealthQuestionInputSchema>;

const AnswerWomensHealthQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about women\'s health.'),
});

export type AnswerWomensHealthQuestionOutput = z.infer<typeof AnswerWomensHealthQuestionOutputSchema>;

const filterUnwantedTextTool = ai.defineTool({
  name: 'filterUnwantedText',
  description: 'Filter unwanted text from a given input string. Remove anything that would violate company policy for medical advice.',
  inputSchema: z.object({
    text: z.string().describe('The text to filter.'),
  }),
  outputSchema: z.string(),
},
async (input) => {
  // TODO: Replace this with actual filtering logic.
  // For now, just return the input text.
  return input.text;
});

export async function answerWomensHealthQuestion(input: AnswerWomensHealthQuestionInput): Promise<AnswerWomensHealthQuestionOutput> {
  return answerWomensHealthQuestionFlow(input);
}

const answerWomensHealthQuestionPrompt = ai.definePrompt({
  name: 'answerWomensHealthQuestionPrompt',
  input: {schema: AnswerWomensHealthQuestionInputSchema},
  output: {schema: AnswerWomensHealthQuestionOutputSchema},
  tools: [filterUnwantedTextTool],
  prompt: `You are a helpful AI assistant specialized in providing information and guidance on women's health.

  Answer the following question accurately and helpfully. If a name is provided, respond to the user directly.

  Question: {{{question}}}
  {{#if userName}}
  The user's name is: {{{userName}}}
  {{/if}}`,
});

const answerWomensHealthQuestionFlow = ai.defineFlow(
  {
    name: 'answerWomensHealthQuestionFlow',
    inputSchema: AnswerWomensHealthQuestionInputSchema,
    outputSchema: AnswerWomensHealthQuestionOutputSchema,
  },
  async input => {
    const {output} = await answerWomensHealthQuestionPrompt(input);
    const filteredAnswer = await filterUnwantedTextTool({
      text: output!.answer,
    });
    return {
      answer: filteredAnswer,
    };
  }
);
