
'use server';
/**
 * @fileOverview Handles submitting a review (rating and text) for a Q&A entry.
 *
 * - submitQnaReview - A function that saves the review to the database.
 * - SubmitQnaReviewInput - The input type for the submitQnaReview function.
 * - SubmitQnaReviewOutput - The return type for the submitQnaReview function.
 */

import { createSupabaseServiceRoleClient } from '@/lib/supabaseClient';

export interface SubmitQnaReviewInput {
  qnaId: number;
  rating?: number;
  reviewText?: string;
}

export interface SubmitQnaReviewOutput {
  success: boolean;
  message?: string;
}


export async function submitQnaReview(input: SubmitQnaReviewInput): Promise<SubmitQnaReviewOutput> {
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
