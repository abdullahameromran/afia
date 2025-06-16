
'use server';
/**
 * @fileOverview Handles submitting a review (rating and text) for a Q&A entry.
 *
 * - submitQnaReview - A function that saves the review to the database.
 * - SubmitQnaReviewInput - The input type for the submitQnaReview function.
 * - SubmitQnaReviewOutput - The return type for the submitQnaReview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { createSupabaseServiceRoleClient } from '@/lib/supabaseClient';

const SubmitQnaReviewInputSchema = z.object({
  qnaId: z.number().describe('The ID of the Q&A history record to review.'),
  rating: z.number().min(1).max(5).optional().describe('The rating from 1 to 5 stars (optional).'),
  reviewText: z.string().optional().describe('The textual review comment (optional).'),
});
export type SubmitQnaReviewInput = z.infer<typeof SubmitQnaReviewInputSchema>;

const SubmitQnaReviewOutputSchema = z.object({
  success: z.boolean().describe('Whether the review submission was successful.'),
  message: z.string().optional().describe('An optional message regarding the submission status.'),
});
export type SubmitQnaReviewOutput = z.infer<typeof SubmitQnaReviewOutputSchema>;

export async function submitQnaReview(input: SubmitQnaReviewInput): Promise<SubmitQnaReviewOutput> {
  return submitQnaReviewFlow(input);
}

const submitQnaReviewFlow = ai.defineFlow(
  {
    name: 'submitQnaReviewFlow',
    inputSchema: SubmitQnaReviewInputSchema,
    outputSchema: SubmitQnaReviewOutputSchema,
  },
  async (input) => {
    const supabase = createSupabaseServiceRoleClient();
    if (!supabase) {
      console.error('Supabase client (service role) not initialized. Cannot submit review.');
      return { success: false, message: 'فشل الاتصال بالخادم لحفظ التقييم.' };
    }

    if (!input.rating && (!input.reviewText || input.reviewText.trim() === '')) {
        return { success: false, message: 'يجب تقديم تقييم أو نص مراجعة.' };
    }

    try {
      const updateData: { rating?: number; review_text?: string } = {};
      if (input.rating !== undefined) {
        updateData.rating = input.rating;
      }
      if (input.reviewText !== undefined && input.reviewText.trim() !== '') {
        updateData.review_text = input.reviewText;
      }

      const { error } = await supabase
        .from('qnaHistory')
        .update(updateData)
        .eq('id', input.qnaId);

      if (error) {
        console.error('Error updating Q&A history with review:', error);
        return { success: false, message: `فشل في حفظ التقييم: ${error.message}` };
      }

      console.log(`Review submitted for Q&A ID: ${input.qnaId}`);
      return { success: true, message: 'تم حفظ تقييمك بنجاح. شكراً لك!' };
    } catch (e: any) {
      console.error('Exception submitting Q&A review:', e);
      return { success: false, message: `حدث خطأ غير متوقع: ${e.message}` };
    }
  }
);

