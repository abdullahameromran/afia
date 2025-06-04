
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { answerWomensHealthQuestion, type AnswerWomensHealthQuestionInput, type AnswerWomensHealthQuestionOutput } from '@/ai/flows/answer-womens-health-questions';

const formSchema = z.object({
  username: z.string().min(1, { message: "الرجاء إدخال اسمكِ" }),
  age: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    z.coerce.number({invalid_type_error: "الرجاء إدخال عمر صحيح"}).positive({ message: "الرجاء إدخال عمر صحيح" }).optional()
  ),
  question: z.string().min(10, { message: "الرجاء إدخال سؤال واضح (10 أحرف على الأقل)" }),
});

type FormValues = z.infer<typeof formSchema>;

export function QnaForm() {
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      age: '' as unknown as undefined, // Initialize as empty string to make it controlled
      question: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const input: AnswerWomensHealthQuestionInput = {
        question: data.question,
        userName: data.username,
        // Pass age only if it's defined after Zod validation
        ...(data.age !== undefined && { age: data.age })
      };
      const aiResponse: AnswerWomensHealthQuestionOutput = await answerWomensHealthQuestion(input);
      
      if (aiResponse && aiResponse.answer) {
        setResponse(`${data.username}، ${aiResponse.answer}`);
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

  // When passing data to the AI, ensure age is correctly handled if it's undefined.
  // The form data for 'age' will be a number if valid, or undefined if empty/optional.
  const currentAge = form.watch('age');


  return (
    <Card className="w-full shadow-xl bg-card">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-right">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="username">اسمكِ</FormLabel>
                  <FormControl>
                    <Input id="username" placeholder="اكتبي اسمكِ" {...field} className="text-right shadow-inner" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="age">عمركِ (اختياري)</FormLabel>
                  <FormControl>
                    <Input 
                      id="age" 
                      type="number" 
                      placeholder="اكتبي عمركِ" 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                      value={field.value === undefined || field.value === null ? '' : String(field.value)}
                      className="text-right shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="question">سؤالكِ</FormLabel>
                  <FormControl>
                    <Textarea
                      id="question"
                      placeholder="ما هو سؤالكِ؟"
                      rows={4}
                      {...field}
                      className="text-right shadow-inner min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full font-bold text-lg py-3 h-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                'اسألي الآن'
              )}
            </Button>
          </form>
        </Form>

        {error && (
          <div className="mt-6 p-4 bg-destructive/10 text-destructive border-r-4 border-destructive rounded flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-semibold">خطأ في الاتصال</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {response && !error && (
          <div className="mt-8 transition-opacity duration-500 ease-in-out opacity-100">
            <Card className="bg-background border-r-[6px] border-primary shadow-md">
              <CardHeader>
                <CardTitle className="font-headline text-primary text-2xl text-right">الإجابة:</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed text-right whitespace-pre-line">
                  {response}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
