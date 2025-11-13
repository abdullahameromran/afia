'use server';
/**
 * @fileOverview Fetches a list of recent, positive reviews.
 *
 * - getReviews - A function that retrieves reviews from the database.
 * - Review - The type for a single review object.
 */
import { createSupabaseServiceRoleClient } from '@/lib/supabaseClient';

export interface Review {
  userName: string | null;
  rating: number;
  reviewText: string;
}

export type GetReviewsOutput = Review[];

export async function getReviews(): Promise<GetReviewsOutput> {
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
