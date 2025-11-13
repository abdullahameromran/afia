
'use server';

/**
 * @fileOverview This file defines a function for answering women's health questions using a direct HTTPS call to the Gemini API.
 *
 * - answerWomensHealthQuestion - A function that accepts a question and returns an answer and Q&A record ID.
 * - AnswerWomensHealthQuestionInput - The input type for the answerWomensHealthQuestion function.
 * - AnswerWomensHealthQuestionOutput - The return type for the answerWomensHealthQuestion function.
 */

import { createSupabaseServiceRoleClient } from '@/lib/supabaseClient'; 

export interface AnswerWomensHealthQuestionInput {
  question: string;
  userName?: string;
  numericAgeForAI?: number;
  textualAgeLabel?: string;
}

export interface AnswerWomensHealthQuestionOutput {
  answer: string;
  qnaId?: number;
}

// This is the prompt that will be sent to the Gemini API.
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
    console.error("answerWomensHealthQuestion called with no question.");
    return { answer: "حدث خطأ: لم يتم تقديم أي سؤال." };
  }

  const apiKey = "AIzaSyCjVO52f_FujMdOn9Z_L8v72wuk6BNtz64";
  
  const promptText = buildPrompt(input);
  
  let generatedAnswer = "لم أتمكن من إنشاء إجابة. يرجى المحاولة مرة أخرى أو إعادة صياغة سؤالك.";

  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: promptText
                }]
            }],
            safetySettings: [
                {
                    category: 'HARM_CATEGORY_HATE_SPEECH',
                    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
                },
                {
                    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
                },
                {
                    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
                },
                {
                    category: 'HARM_CATEGORY_HARASSMENT',
                    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
                },
            ],
        })
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Gemini API request failed:", response.status, errorBody);
        throw new Error(`API request failed with status ${response.status}`);
    }

    const responseData = await response.json();
    
    if (responseData.candidates && responseData.candidates[0] && responseData.candidates[0].content && responseData.candidates[0].content.parts[0]) {
        generatedAnswer = responseData.candidates[0].content.parts[0].text;
    } else {
        console.warn("Unexpected API response structure:", responseData);
    }

  } catch (apiError) {
      console.error("Error calling Gemini API:", apiError);
      // Return a user-friendly error, the actual error is logged for debugging
      return { answer: "حدث خطأ أثناء التواصل مع خدمة الذكاء الاصطناعي. الرجاء المحاولة مرة أخرى." };
  }


  const supabase = createSupabaseServiceRoleClient();
  let qnaIdForOutput: number | undefined = undefined;

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
            // timestamp is handled by DB default NOW()
          }
        ])
        .select('id') 
        .single();

      if (insertError) {
        console.error("Error saving Q&A history to Supabase:", insertError);
      } else if (insertedData) {
        console.log("Q&A history saved to Supabase with ID:", insertedData.id);
        qnaIdForOutput = insertedData.id;
      }
    } catch (e) {
      console.error("Exception saving Q&A history to Supabase:", e);
    }
  } else if (!supabase) {
    console.warn("Supabase client (service role) is not initialized. Skipping save of Q&A history. Please check Supabase configuration in .env.");
  } else if (!generatedAnswer) {
    console.warn("AI did not return an answer. Skipping save of Q&A history.");
  }
  
  return { answer: generatedAnswer, qnaId: qnaIdForOutput };
}
