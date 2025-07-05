'use server';
/**
 * @fileOverview Fetches a list of recent, positive reviews.
 *
 * - getReviews - A function that retrieves reviews from the database.
 * - Review - The type for a single review object.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { createSupabaseServiceRoleClient } from '@/lib/supabaseClient';

const ReviewSchema = z.object({
  userName: z.string().nullable().describe('The name of the user who left the review.'),
  rating: z.number().describe('The star rating from 1 to 5.'),
  reviewText: z.string().describe('The text content of the review.'),
});
export type Review = z.infer<typeof ReviewSchema>;

const GetReviewsOutputSchema = z.array(ReviewSchema);
export type GetReviewsOutput = z.infer<typeof GetReviewsOutputSchema>;

export async function getReviews(): Promise<GetReviewsOutput> {
  return getReviewsFlow();
}

const getReviewsFlow = ai.defineFlow(
  {
    name: 'getReviewsFlow',
    inputSchema: z.void(),
    outputSchema: GetReviewsOutputSchema,
  },
  async () => {
    const supabase = createSupabaseServiceRoleClient();
    if (!supabase) {
      console.error('Supabase client (service role) not initialized. Cannot fetch reviews.');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('qnaHistory')
        .select('userName, rating, review_text')
        .not('review_text', 'is', null)
        .neq('review_text', '')
        .gte('rating', 4)
        .order('timestamp', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching reviews from Supabase:', error);
        throw new Error(`Failed to fetch reviews: ${error.message}`);
      }
      
      const reviews = data.map(item => ({
        userName: item.userName,
        rating: item.rating!,
        reviewText: item.review_text!,
      }));

      return reviews;

    } catch (e: any) {
      console.error('Exception fetching reviews:', e);
      return [];
    }
  }
);
