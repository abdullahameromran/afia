
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
import { createSupabaseServiceRoleClient } from '@/lib/supabaseClient'; 

const AnswerWomensHealthQuestionInputSchema = z.object({
  question: z.string().describe("The question about women's health."),
  userName: z.string().optional().describe('The name of the user asking the question.'),
  numericAgeForAI: z.number().optional().describe('The representative numeric age for the life stage, for AI context.'),
  textualAgeLabel: z.string().optional().describe('The textual description of the life stage (e.g., "مرحلة البلوغ (13–16 سنة)"), for AI context and database saving.')
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
  if (!input.question) {
    console.error("answerWomensHealthQuestion called with no question.");
    return { answer: "حدث خطأ: لم يتم تقديم أي سؤال." };
  }

  const flowResult = await answerWomensHealthQuestionFlow(input);
  const supabase = createSupabaseServiceRoleClient();

  if (flowResult?.answer && supabase) {
    try {
      const { error } = await supabase
        .from('qnaHistory')
        .insert([
          { 
            question: input.question,
            userName: input.userName || null, 
            age_label: input.textualAgeLabel || null, // Save the textual label
            answer: flowResult.answer,
            // timestamp is handled by DB default NOW()
          }
        ]);

      if (error) {
        console.error("Error saving Q&A history to Supabase:", error);
      } else {
        console.log("Q&A history saved to Supabase");
      }
    } catch (e) {
      console.error("Exception saving Q&A history to Supabase:", e);
    }
  } else if (!supabase) {
    console.warn("Supabase client (service role) is not initialized. Skipping save of Q&A history. Please check Supabase configuration in .env.");
  } else if (!flowResult?.answer) {
    console.warn("AI flow did not return an answer. Skipping save of Q&A history.");
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
Consider the user's age and life stage information to tailor the tone and detail of your Arabic response appropriately.

User's Question: {{{question}}}
{{#if userName}}
User's name: {{{userName}}}
{{/if}}
{{#if numericAgeForAI}}
User's approximate age: {{{numericAgeForAI}}} years old.
{{/if}}
{{#if textualAgeLabel}}
User's life stage category: {{{textualAgeLabel}}}
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
    if (!output?.answer) {
        // Log or handle cases where the AI doesn't return an answer as expected
        console.warn("answerWomensHealthQuestionPrompt did not return an answer in output object.");
        return { answer: "لم أتمكن من إنشاء إجابة. يرجى المحاولة مرة أخرى أو إعادة صياغة سؤالك." };
    }
    const filteredAnswer = await filterUnwantedTextTool({
      text: output.answer,
    });
    return {
      answer: filteredAnswer,
    };
  }
);
