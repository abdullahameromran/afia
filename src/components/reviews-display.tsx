"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, MessageSquareQuote } from 'lucide-react';
import { getReviews, type Review } from '@/ai/flows/get-reviews-flow';

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`inline-block h-5 w-5 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    );
  }
  return <div className="flex justify-center gap-1">{stars}</div>;
};


export function ReviewsDisplay() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedReviews = await getReviews();
        setReviews(fetchedReviews);
      } catch (err: any) {
        setError("فشل في تحميل المراجعات. الرجاء المحاولة مرة أخرى لاحقًا.");
        console.error("Failed to fetch reviews:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (isLoading) {
    return (
      <section className="mt-12 mb-8 text-center" dir="rtl">
        <h2 className="font-headline text-2xl sm:text-3xl font-bold text-primary mb-6">
          آراء المستخدمين
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
             <Card key={i} className="bg-card shadow-lg flex flex-col items-center text-center p-6">
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-5 w-32 mb-4" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
             </Card>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    // Optionally render an error message, for now we render nothing on error
    return null;
  }
  
  if (reviews.length === 0) {
    // Don't render the section if there are no reviews to show
    return null;
  }

  return (
    <section className="mt-12 mb-8 text-center" dir="rtl">
      <h2 className="font-headline text-2xl sm:text-3xl font-bold text-primary mb-6 flex items-center justify-center gap-2">
        <MessageSquareQuote className="h-8 w-8" />
        آراء المستخدمين
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review, index) => (
          <Card key={index} className="bg-card shadow-lg flex flex-col items-center text-center p-6 transform transition-transform duration-300 hover:scale-105">
            <CardHeader className="p-0 mb-4">
              {renderStars(review.rating)}
            </CardHeader>
            <CardContent className="p-0 flex-grow">
              <p className="italic text-muted-foreground mb-4">"{review.reviewText}"</p>
              <p className="font-semibold text-primary">- {review.userName || 'مستخدم'}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
