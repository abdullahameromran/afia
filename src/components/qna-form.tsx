
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { answerWomensHealthQuestion, type AnswerWomensHealthQuestionInput, type AnswerWomensHealthQuestionOutput } from '@/ai/flows/answer-womens-health-questions';
import { lifeStagesData, type LifeStage, type StageSection, type HealthTip, type Subsection } from '@/lib/lifeStagesData';

const formSchema = z.object({
  username: z.string().min(1, { message: "الرجاء إدخال اسمكِ" }),
  lifeStage: z.string({ required_error: "الرجاء اختيار مرحلة عمرية" }), // This will be the ID of the stage
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
      lifeStage: undefined,
      question: '',
    },
  });

  const handleStageChange = (stageId: string) => {
    const stage = lifeStagesData.find(s => s.id === stageId) || null;
    setSelectedStageInfo(stage);
    form.setValue('lifeStage', stageId, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    const selectedStage = lifeStagesData.find(s => s.id === data.lifeStage);
    const lifeStageLabelToPass = selectedStage ? selectedStage.label : undefined;

    try {
      const input: AnswerWomensHealthQuestionInput = {
        question: data.question,
        userName: data.username,
        ...(lifeStageLabelToPass !== undefined && { age: lifeStageLabelToPass }) // Pass label as 'age'
      };
      const aiResponse: AnswerWomensHealthQuestionOutput = await answerWomensHealthQuestion(input);
      
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
    <Card className="w-full shadow-xl bg-card">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-right">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="username" className="block text-right">اسمكِ</FormLabel>
                  <FormControl>
                    <Input id="username" placeholder="اكتبي اسمكِ" {...field} className="text-right shadow-inner" />
                  </FormControl>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lifeStage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-right">المرحلة العمرية</FormLabel>
                  <Select onValueChange={handleStageChange} defaultValue={field.value} dir="rtl">
                    <FormControl>
                      <SelectTrigger className="text-right shadow-inner">
                        <SelectValue placeholder="اختاري مرحلتكِ العمرية" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {lifeStagesData.map(stage => (
                        <SelectItem key={stage.id} value={stage.id} className="text-right justify-end">
                          {stage.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />

            {selectedStageInfo && (
              <Card className="mt-4 bg-background border-primary/30 shadow-md text-right">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-headline text-primary flex items-center gap-2 justify-end">
                     معلومات حول: {selectedStageInfo.label} <Info size={20}/>
                  </CardTitle>
                  <CardDescription className="text-right">
                    نقدم لكِ بعض المعلومات العامة حول هذه المرحلة. يمكنكِ طرح أسئلة أكثر تحديدًا أدناه.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full" dir="rtl">
                    {selectedStageInfo.info.map((section, index) => (
                      <AccordionItem value={`item-${index}`} key={section.title}>
                        <AccordionTrigger className="font-semibold hover:no-underline text-primary/90 text-right">
                          <span>{section.title}</span>
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
                         <AccordionTrigger className="font-semibold hover:no-underline text-primary/90 text-right">
                           <span>نقاط رئيسية للتثقيف الصحي</span>
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
                      className="text-right shadow-inner min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full font-bold text-lg py-3 h-auto">
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" /> {/* Adjusted margin for RTL */}
                  جاري المعالجة...
                </>
              ) : (
                'اسألي الآن'
              )}
            </Button>
          </form>
        </Form>

        {error && (
          <div className="mt-6 p-4 bg-destructive/10 text-destructive border-r-4 border-destructive rounded flex items-start gap-3 text-right">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 ml-2" /> {/* Adjusted margin for RTL */}
            <div>
              <p className="font-semibold">خطأ في الاتصال</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {response && !error && (
          <div className="mt-8 transition-opacity duration-500 ease-in-out opacity-100">
            <Card className="bg-background border-r-[6px] border-primary shadow-md text-right">
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
