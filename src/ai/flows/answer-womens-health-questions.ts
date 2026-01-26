
'use server';

/**
 * @fileOverview This file defines a function for answering women's health questions using a direct HTTPS call.
 *
 * - answerWomensHealthQuestion - A function that accepts a question and returns an answer and Q&A record ID.
 * - AnswerWomensHealthQuestionInput - The input type for the answerWomensHealthQuestion function.
 * - AnswerWomensHealthQuestionOutput - The return type for the answerWomensHealthQuestion function.
 */
import { createSupabaseServiceRoleClient } from '@/lib/supabaseClient';
import { z } from 'zod';

const AnswerWomensHealthQuestionInputSchema = z.object({
  question: z.string(),
  userName: z.string().optional(),
  numericAgeForAI: z.number().optional(),
  textualAgeLabel: z.string().optional(),
});

const AnswerWomensHealthQuestionOutputSchema = z.object({
  answer: z.string(),
  qnaId: z.number().optional(),
});

export type AnswerWomensHealthQuestionInput = z.infer<typeof AnswerWomensHealthQuestionInputSchema>;
export type AnswerWomensHealthQuestionOutput = z.infer<typeof AnswerWomensHealthQuestionOutputSchema>;

const buildPrompt = (input: AnswerWomensHealthQuestionInput): string => {
    let prompt = `You are a supportive and informative AI assistant specializing in women's health, including topics related to pregnancy, childbirth, family planning, and general female healthcare. Your goal is to provide scientifically-grounded general information and context, like a knowledgeable guide. ALL RESPONSES MUST BE IN ARABIC.

When a user asks a health-related question, such as "ما هو انواع الاجهاض؟" (What are the types of miscarriage?) or "Is it normal to feel X during pregnancy?":
1.  Acknowledge the user's concern in Arabic.
2.  Provide comprehensive yet general scientific information related to the question in Arabic. This includes discussing definitions, common types, general physiological aspects, or widely accepted preventative measures, if applicable. For example, if asked about types of miscarriage, you should describe them factually.
3.  Crucially, you MUST ALWAYS include a clear disclaimer IN ARABIC stating that your information is for general informational purposes only, is not medical advice, and does not replace a consultation with a qualified healthcare professional. Emphasize that this information should not be used for self-diagnosis or treatment.
4.  You MUST ALWAYS advise the user IN ARABIC to consult their doctor or a qualified healthcare provider for any personal health concerns, diagnosis, or before making any health-related decisions, including questions about specific conditions or treatments.

An example of a good disclaimer structure (ensure it's naturally integrated into the Arabic response): "من المهم أن تتذكري أن هذه المعلومات هي للمعرفة العامة فقط ولا تغني عن استشارة الطبيب. لأي مخاوف صحية شخصية أو للحصول على تشخيص دقيق وخطة علاج، أو لطرح أسئلة حول حالات أو علاجات محددة، من الضروري مراجعة طبيبك أو مقدم رعاية صحية مؤهل. هذه المعلومات لا ينبغي استخدامها للتشخيص الذاتي أو العلاج الذاتي."

If a question is completely unrelated to women's health, pregnancy, childbirth, family planning, or general healthcare, then you should politely decline in Arabic, explaining that your expertise is limited to these health topics.

If a user's name is provided, address them personally in your Arabic response.
Consider the user's age and life stage information to tailor the tone and detail of your Arabic response appropriately.

User's Question: ${input.question}`;

    if (input.userName) {
        prompt += `\nUser's name: ${input.userName}`;
    }
    if (input.numericAgeForAI) {
        prompt += `\nUser's approximate age: ${input.numericAgeForAI} years old.`;
    }
    if (input.textualAgeLabel) {
        prompt += `\nUser's life stage category: ${input.textualAgeLabel}`;
    }
    return prompt;
};


export async function answerWomensHealthQuestion(input: AnswerWomensHealthQuestionInput): Promise<AnswerWomensHealthQuestionOutput> {
  if (!input.question) {
    return { answer: "حدث خطأ: لم يتم تقديم أي سؤال." };
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("GOOGLE_API_KEY is not set.");
    return { answer: "حدث خطأ: مفتاح الواجهة البرمجية غير مهيأ." };
  }

  const promptText = buildPrompt(input);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  let generatedAnswer: string;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: promptText
          }]
        }],
        safetySettings: [
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ]
      })
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: response.statusText }));
        console.error("API Error Response:", errorBody);
        throw new Error(`فشلت استجابة الواجهة البرمجية: ${errorBody.error?.message || response.statusText}`);
    }

    const responseData = await response.json();

    if (responseData.candidates && responseData.candidates.length > 0 && responseData.candidates[0].content) {
      generatedAnswer = responseData.candidates[0].content.parts[0].text;
    } else {
      console.warn("API response blocked or empty:", responseData);
      let blockReason = responseData.promptFeedback?.blockReason;
      if(blockReason) {
         return { answer: `لم يتمكن الذكاء الاصطناعي من الإجابة على هذا السؤال لأنه قد يخالف سياسات السلامة. السبب: ${blockReason}` };
      }
      return { answer: "لم يتمكن الذكاء الاصطناعي من الإجابة على هذا السؤال لأنه قد يخالف سياسات السلامة. يرجى إعادة صياغة سؤالك." };
    }

  } catch (apiError: any) {
      console.error("Error calling Google AI API:", apiError);
      return { answer: "حدث خطأ أثناء التواصل مع خدمة الذكاء الاصطناعي. الرجاء المحاولة مرة أخرى." };
  }

  const supabase = createSupabaseServiceRoleClient();
  
  if (generatedAnswer && supabase) {
    try {
      const { data: insertedData, error: insertError } = await supabase
        .from('qnaHistory')
        .insert([
          { 
            question: input.question,
            userName: input.userName || null, 
            age_label: input.textualAgeLabel || null, 
            answer: generatedAnswer,
          }
        ])
        .select('id') 
        .single();

      if (insertError) {
        console.error("Error saving Q&A history to Supabase:", insertError);
        // Still return the answer even if saving fails.
        return { answer: generatedAnswer, qnaId: undefined };
      }
      
      if (insertedData) {
        console.log("Q&A history saved to Supabase with ID:", insertedData.id);
        return { answer: generatedAnswer, qnaId: insertedData.id };
      }

    } catch (e) {
      console.error("Exception saving Q&A history to Supabase:", e);
      // Still return the answer even if saving fails.
      return { answer: generatedAnswer, qnaId: undefined };
    }
  }

  // Fallback return if Supabase isn't configured or something else goes wrong.
  return { answer: generatedAnswer, qnaId: undefined };
}
