
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
import { db } from '@/lib/firebase'; // db can now be Firestore | null
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const AnswerWomensHealthQuestionInputSchema = z.object({
  question: z.string().describe('The question about women\'s health.'),
  userName: z.string().optional().describe('The name of the user asking the question.'),
  age: z.number().optional().describe('The age of the user asking the question.')
});

export type AnswerWomensHealthQuestionInput = z.infer<typeof AnswerWomensHealthQuestionInputSchema>;

const AnswerWomensHealthQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about women\'s health, in Arabic. This answer should include general scientific information and a disclaimer to consult a doctor.'),
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
  const flowResult = await answerWomensHealthQuestionFlow(input);

  // Save to Firestore if the answer is generated and db is a valid Firestore instance
  if (flowResult?.answer && db) { // Check if db is not null
    try {
      await addDoc(collection(db, 'qnaHistory'), {
        question: input.question,
        userName: input.userName || null,
        age: input.age || null,
        answer: flowResult.answer,
        timestamp: serverTimestamp(),
      });
      console.log("Q&A history saved to Firestore");
    } catch (e) {
      console.error("Error saving Q&A history to Firestore:", e);
      // Decide if this error should be propagated or just logged
    }
  } else if (!db) { // If db is null
    console.warn("Firestore (db) is not initialized. Skipping save of Q&A history. Please check Firebase configuration in .env.");
  }
  return flowResult;
}

const answerWomensHealthQuestionPrompt = ai.definePrompt({
  name: 'answerWomensHealthQuestionPrompt',
  input: {schema: AnswerWomensHealthQuestionInputSchema},
  output: {schema: AnswerWomensHealthQuestionOutputSchema},
  tools: [filterUnwantedTextTool],
  prompt: `You are a supportive and informative AI assistant specializing in women's health, including topics related to pregnancy, childbirth, family planning, and general female healthcare. Your goal is to provide scientifically-grounded general information and context, like a knowledgeable guide. ALL RESPONSES MUST BE IN ARABIC.

When a user asks a health-related question, such as "ما هو انواع الاجهاض؟" (What are the types of miscarriage?) or "Is it normal to feel X during pregnancy?":
1.  Acknowledge the user's concern in Arabic.
2.  Provide comprehensive yet general scientific information related to the question in Arabic. This includes discussing definitions, common types, general physiological aspects, or widely accepted preventative measures, if applicable. For example, if asked about types of miscarriage, you should describe them factually.
3.  Crucially, you MUST ALWAYS include a clear disclaimer IN ARABIC stating that your information is for general informational purposes only, is not medical advice, and does not replace a consultation with a qualified healthcare professional. Emphasize that this information should not be used for self-diagnosis or treatment.
4.  You MUST ALWAYS advise the user IN ARABIC to consult their doctor or a qualified healthcare provider for any personal health concerns, diagnosis, or before making any health-related decisions, including questions about specific conditions or treatments.

An example of a good disclaimer structure (ensure it's naturally integrated into the Arabic response): "من المهم أن تتذكري أن هذه المعلومات هي للمعرفة العامة فقط ولا تغني عن استشارة الطبيب. لأي مخاوف صحية شخصية أو للحصول على تشخيص دقيق وخطة علاج، أو لطرح أسئلة حول حالات أو علاجات محددة، من الضروري مراجعة طبيبك أو مقدم رعاية صحية مؤهل. هذه المعلومات لا ينبغي استخدامها للتشخيص الذاتي أو العلاج الذاتي."

If a question is completely unrelated to women's health, pregnancy, childbirth, family planning, or general healthcare, then you should politely decline in Arabic, explaining that your expertise is limited to these health topics.

If a user's name is provided, address them personally in your Arabic response.
If age is provided, consider it to tailor the tone and detail of your Arabic response appropriately.

User's Question: {{{question}}}
{{#if userName}}
User's name: {{{userName}}}
{{/if}}
{{#if age}}
User's age: {{{age}}}
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
    // The filterUnwantedTextTool is currently a pass-through. If it had actual filtering,
    // it would need to be aligned with the new prompt's intention of providing general info + disclaimer.
    const filteredAnswer = await filterUnwantedTextTool({
      text: output!.answer,
    });
    return {
      answer: filteredAnswer,
    };
  }
);
