
"use client";

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, AlertTriangle, Info, Star, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { lifeStagesData, type LifeStage, getLifeStageFromAge } from '@/lib/lifeStagesData';
import { answerWomensHealthQuestion, type AnswerWomensHealthQuestionInput, type AnswerWomensHealthQuestionOutput } from '@/ai/flows/answer-womens-health-questions';
import { submitQnaReview, type SubmitQnaReviewInput, type SubmitQnaReviewOutput } from '@/ai/flows/submit-qna-review-flow';

const qnaFormSchema = z.object({
  username: z.string().min(1, { message: "الرجاء إدخال اسمكِ" }),
  lifeStage: z.coerce 
    .number({ invalid_type_error: "الرجاء إدخال العمر كأرقام." })
    .min(10, { message: "العمر يجب أن يكون 10 سنوات على الأقل." })
    .max(120, { message: "الرجاء إدخال عمر صحيح (حتى 120 سنة)." })
    .positive({ message: "يجب أن يكون العمر رقمًا موجبًا."}),
  question: z.string().min(10, { message: "الرجاء إدخال سؤال واضح (10 أحرف على الأقل)" }),
});

type QnaFormValues = z.infer<typeof qnaFormSchema>;

// Review form schema is not used with react-hook-form for this simple implementation
// const reviewFormSchema = z.object({
//     rating: z.number().min(1).max(5).optional(),
//     reviewText: z.string().optional(),
// });
// type ReviewFormValues = z.infer<typeof reviewFormSchema>;


export function QnaForm() {
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStageInfo, setSelectedStageInfo] = useState<LifeStage | null>(null);
  const { toast } = useToast();

  const [qnaRecordId, setQnaRecordId] = useState<number | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [currentRating, setCurrentRating] = useState<number | undefined>(undefined);
  const [reviewText, setReviewText] = useState<string>("");


  const qnaForm = useForm<QnaFormValues>({
    resolver: zodResolver(qnaFormSchema),
    defaultValues: {
      username: '',
      lifeStage: '' as unknown as number, // Initialize for number input
      question: '',
    },
  });

  const watchedAge = qnaForm.watch('lifeStage');

  useEffect(() => {
    let numericWatchedAge: number | undefined = undefined;
    if (typeof watchedAge === 'string' && watchedAge !== '') {
        numericWatchedAge = Number(watchedAge);
    } else if (typeof watchedAge === 'number') {
        numericWatchedAge = watchedAge;
    }

    if (numericWatchedAge !== undefined && !isNaN(numericWatchedAge)) {
      const stage = getLifeStageFromAge(numericWatchedAge);
      setSelectedStageInfo(stage);
    } else {
      setSelectedStageInfo(null);
    }
  }, [watchedAge]);

  const onQnaSubmit: SubmitHandler<QnaFormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setAiResponse(null);
    setShowReviewForm(false);
    setReviewSubmitted(false);
    setQnaRecordId(null);
    setCurrentRating(undefined);
    setReviewText("");


    const { username, question, lifeStage: ageValueNumber } = data; 
    const matchedStage = getLifeStageFromAge(ageValueNumber);
    const textualAgeLabel = matchedStage ? matchedStage.label : "مرحلة عمرية غير محددة";

    const inputPayload: AnswerWomensHealthQuestionInput = {
      question,
      userName: username,
      numericAgeForAI: ageValueNumber, 
      textualAgeLabel: textualAgeLabel, 
    };
    
    try {
      const responseOutput: AnswerWomensHealthQuestionOutput = await answerWomensHealthQuestion(inputPayload);
      
      if (responseOutput && responseOutput.answer) {
        setAiResponse(responseOutput.answer);
        if (responseOutput.qnaId) {
          setQnaRecordId(responseOutput.qnaId);
          setShowReviewForm(true); 
        } else {
            console.warn("QnA ID not returned from flow, review cannot be submitted for this entry.");
        }
      } else {
        throw new Error("لم يتمكن الذكاء الاصطناعي من إنشاء إجابة.");
      }

    } catch (e) {
      console.error("Error fetching AI response:", e);
      const errorMessage = e instanceof Error ? e.message : "حدث خطأ أثناء معالجة طلبك. الرجاء المحاولة مرة أخرى.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qnaRecordId) {
      toast({ variant: "destructive", title: "خطأ", description: "لا يمكن إرسال التقييم بدون معرف السؤال." });
      return;
    }
    if (currentRating === undefined && reviewText.trim() === "") {
        toast({ variant: "destructive", title: "خطأ", description: "الرجاء تقديم تقييم نجوم أو كتابة تعليق." });
        return;
    }

    setIsSubmittingReview(true);
    const reviewPayload: SubmitQnaReviewInput = {
      qnaId: qnaRecordId,
      rating: currentRating,
      reviewText: reviewText.trim() === "" ? undefined : reviewText,
    };

    try {
      const result: SubmitQnaReviewOutput = await submitQnaReview(reviewPayload);
      if (result.success) {
        toast({ title: "شكراً لك!", description: result.message || "تم إرسال تقييمك بنجاح." });
        setReviewSubmitted(true);
        setShowReviewForm(false);
      } else {
        throw new Error(result.message || "فشل إرسال التقييم.");
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "حدث خطأ أثناء إرسال التقييم.";
      setError(errorMessage); // Consider if this error should be separate from QnA error
      toast({
        variant: "destructive",
        title: "خطأ في التقييم",
        description: errorMessage,
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };


  return (
    <Card className="w-full shadow-xl bg-card text-right" dir="rtl">
      <CardContent className="p-6">
        <Form {...qnaForm}>
          <form onSubmit={qnaForm.handleSubmit(onQnaSubmit)} className="space-y-6">
            <FormField
              control={qnaForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="username" className="block text-right">اسمكِ</FormLabel>
                  <FormControl>
                    <Input id="username" placeholder="اكتبي اسمكِ" {...field} className="shadow-inner text-right" />
                  </FormControl>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />

            <FormField
              control={qnaForm.control}
              name="lifeStage" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="lifeStage" className="block text-right">عمركِ (بالسنوات)</FormLabel>
                  <FormControl>
                    <Input
                      id="lifeStage"
                      type="number"
                      placeholder="مثال: 25"
                      {...field}
                      onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                      className="shadow-inner text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </FormControl>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />

            <FormField
              control={qnaForm.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="question" className="block text-right">سؤالكِ المحدد</FormLabel>
                  <FormControl>
                    <Textarea
                      id="question"
                      placeholder="بعد الاطلاع على المعلومات، ما هو سؤالكِ المحدد؟"
                      rows={4}
                      {...field}
                      className="shadow-inner min-h-[100px] text-right"
                    />
                  </FormControl>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading || showReviewForm} className="w-full font-bold text-lg py-3 h-auto">
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                'اسألي الآن'
              )}
            </Button>
          </form>
        </Form>

        {error && (
          <div className="mt-6 p-4 bg-destructive/10 text-destructive border-r-4 border-destructive rounded flex items-start gap-3 text-right" dir="rtl">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 ml-2" />
            <div>
              <p className="font-semibold">خطأ في الاتصال</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {aiResponse && !error && (
          <div className="mt-8 transition-opacity duration-500 ease-in-out opacity-100">
            <Card className="bg-background border-r-[6px] border-primary shadow-md text-right" dir="rtl">
              <CardHeader>
                <CardTitle className="font-headline text-primary text-2xl text-right">الإجابة:</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed text-right whitespace-pre-line">
                  {aiResponse}
                </p>
              </CardContent>
            </Card>

            {showReviewForm && !reviewSubmitted && qnaRecordId && (
              <Card className="mt-6 shadow-lg bg-card border-t-4 border-accent">
                <CardHeader>
                  <CardTitle className="text-xl font-headline text-accent-foreground flex items-center gap-2">
                    <Star className="text-accent" />
                    ما هو تقييمكِ لهذه الإجابة؟
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    ساعدينا على تحسين الخدمة بتقديم تقييمكِ.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-right mb-2 text-sm font-medium leading-none">التقييم (اختياري)</label>
                      <div className="flex justify-center gap-1 mb-2" dir="ltr">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <Button
                            key={star}
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setCurrentRating(star)}
                            className={`p-1 ${currentRating !== undefined && currentRating >= star ? 'text-yellow-400' : 'text-muted-foreground hover:text-yellow-300'}`}
                          >
                            <Star fill={currentRating !== undefined && currentRating >= star ? 'currentColor' : 'none'} className="h-7 w-7" />
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="reviewText" className="block text-right text-sm font-medium leading-none">تعليقكِ (اختياري)</label>
                        <Textarea
                            id="reviewText"
                            placeholder="اكتبي تعليقكِ هنا..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="min-h-[80px] text-right shadow-inner"
                        />
                    </div>
                    <Button type="submit" disabled={isSubmittingReview} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                      {isSubmittingReview ? (
                        <>
                          <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                          جاري إرسال التقييم...
                        </>
                      ) : (
                        <>
                         <MessageSquare className="ml-2 h-5 w-5" />
                          إرسال التقييم
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
            {reviewSubmitted && (
                 <div className="mt-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-r-4 border-green-500 rounded flex items-center gap-3 text-right" dir="rtl">
                    <Info className="h-5 w-5 flex-shrink-0" />
                    <p className="font-semibold">شكراً لكِ، تم استلام تقييمك!</p>
                </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

