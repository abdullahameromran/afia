
"use client";

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label'; // Not directly used, but FormLabel depends on it
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// Select components are no longer needed for age
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, AlertTriangle, Info, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { lifeStagesData, type LifeStage, type StageSection, type HealthTip, type Subsection, getLifeStageFromAge } from '@/lib/lifeStagesData';
import { answerWomensHealthQuestion, type AnswerWomensHealthQuestionInput, type AnswerWomensHealthQuestionOutput } from '@/ai/flows/answer-womens-health-questions';

const formSchema = z.object({
  username: z.string().min(1, { message: "الرجاء إدخال اسمكِ" }),
  lifeStage: z.coerce // This field now represents numeric age
    .number({ invalid_type_error: "الرجاء إدخال العمر كأرقام." })
    .min(10, { message: "العمر يجب أن يكون 10 سنوات على الأقل." })
    .max(120, { message: "الرجاء إدخال عمر صحيح (حتى 120 سنة)." })
    .positive({ message: "يجب أن يكون العمر رقمًا موجبًا."}),
  question: z.string().min(10, { message: "الرجاء إدخال سؤال واضح (10 أحرف على الأقل)" }),
});

type FormValues = z.infer<typeof formSchema>;

export function QnaForm() {
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStageInfo, setSelectedStageInfo] = useState<LifeStage | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      lifeStage: '', // Changed from undefined to empty string
      question: '',
    },
  });

  const watchedAge = form.watch('lifeStage');

  useEffect(() => {
    // watchedAge will be a string from the form input, or a number if coerced by RHF internally
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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    // data.lifeStage will be a number here due to Zod coercion by react-hook-form's handleSubmit
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
      const aiResponse: AnswerWomensHealthQuestionOutput = await answerWomensHealthQuestion(inputPayload);
      
      if (aiResponse && aiResponse.answer) {
        setResponse(aiResponse.answer); 
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
  
  const renderHealthTips = (tips: HealthTip[]) => (
    <ul className="space-y-3 list-inside text-right pr-4">
      {tips.map(tip => (
        <li key={tip.title}>
          <strong className="text-primary">{tip.title}:</strong>
          <ul className="mr-4 mt-1 space-y-1 list-disc list-inside text-right">
            {tip.points.map((point, i) => <li key={i} className="text-sm">{point}</li>)}
          </ul>
        </li>
      ))}
    </ul>
  );

  const renderSubsections = (subsections: Subsection[]) => (
     <ul className="space-y-3 list-inside text-right pr-4">
      {subsections.map(subsection => (
        <li key={subsection.title}>
          <strong className="text-primary">{subsection.title}:</strong>
          <ul className="mr-4 mt-1 space-y-1 list-disc list-inside text-right">
            {subsection.details.map((detail, i) => <li key={i} className="text-sm">{detail}</li>)}
          </ul>
        </li>
      ))}
    </ul>
  );
  
  const renderPoints = (points: string[]) => (
    <ul className="mr-0 mt-1 space-y-1 list-disc list-inside text-right pr-4">
        {points.map((point, i) => <li key={i} className="text-sm">{point}</li>)}
    </ul>
  );


  return (
    <Card className="w-full shadow-xl bg-card text-right" dir="rtl">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
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
              control={form.control}
              name="lifeStage" // This field now represents numeric age
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="lifeStage" className="block text-right">عمركِ (بالسنوات)</FormLabel>
                  <FormControl>
                    <Input
                      id="lifeStage"
                      type="number"
                      placeholder="مثال: 25"
                      {...field}
                      // value will be managed by react-hook-form, initially ''
                      className="shadow-inner text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </FormControl>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />

            {/* 
            {selectedStageInfo && (
              <Card className="mt-4 bg-background border-primary/30 shadow-md" dir="rtl">
                <CardHeader className="w-full pb-2 flex flex-col items-start">
                  <CardTitle className="w-full text-xl font-headline text-primary flex items-center gap-2 justify-start">
                     <Info size={20}/> <span className="text-right">معلومات حول: {selectedStageInfo.label}</span>
                  </CardTitle>
                  <CardDescription className="w-full text-right">
                    هذه معلومات عامة تناسب العمر الذي أدخلتيه. يمكنكِ طرح أسئلة أكثر تحديدًا أدناه.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full" dir="rtl">
                    {selectedStageInfo.info.map((section, index) => (
                      <AccordionItem value={`item-${index}`} key={section.title}>
                        <AccordionTrigger className="font-semibold hover:no-underline text-primary/90 text-right justify-between w-full">
                          <span className="text-right flex-grow">{section.title}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-right space-y-2 pt-2 pr-2">
                          {section.description && <p className="text-sm text-muted-foreground text-right">{section.description}</p>}
                          {section.subsections && renderSubsections(section.subsections)}
                          {section.points && renderPoints(section.points)}
                          {section.tips && renderHealthTips(section.tips)}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                    {selectedStageInfo.generalSummaryPoints && selectedStageInfo.generalSummaryPoints.length > 0 && (
                       <AccordionItem value="general-summary">
                         <AccordionTrigger className="font-semibold hover:no-underline text-primary/90 text-right justify-between w-full">
                           <span className="text-right flex-grow">نقاط رئيسية للتثقيف الصحي</span>
                           </AccordionTrigger>
                         <AccordionContent className="text-right space-y-1 pt-2 pr-2">
                           {renderPoints(selectedStageInfo.generalSummaryPoints)}
                         </AccordionContent>
                       </AccordionItem>
                    )}
                  </Accordion>
                </CardContent>
              </Card>
            )}
            */}

            <FormField
              control={form.control}
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

            <Button type="submit" disabled={isLoading} className="w-full font-bold text-lg py-3 h-auto">
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

        {response && !error && (
          <div className="mt-8 transition-opacity duration-500 ease-in-out opacity-100">
            <Card className="bg-background border-r-[6px] border-primary shadow-md text-right" dir="rtl">
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

