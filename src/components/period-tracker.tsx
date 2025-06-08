
"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, addDays, parseISO, isValid } from 'date-fns';
import { arSA } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CalendarIcon, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const periodFormSchema = z.object({
  lastPeriodDate: z.date({
    required_error: "الرجاء إدخال تاريخ بدء آخر دورة شهرية.",
    invalid_type_error: "الرجاء إدخال تاريخ صحيح.",
  }),
  cycleLength: z.coerce
    .number({ invalid_type_error: "الرجاء إدخال طول الدورة بالأيام كأرقام." })
    .min(15, { message: "طول الدورة يجب أن يكون 15 يومًا على الأقل." })
    .max(45, { message: "طول الدورة يجب ألا يتجاوز 45 يومًا." })
    .default(28),
});

type PeriodFormValues = z.infer<typeof periodFormSchema>;

const LOCAL_STORAGE_KEY = 'periodTrackerData';

export function PeriodTracker() {
  const [predictedNextPeriod, setPredictedNextPeriod] = useState<string | null>(null);

  const form = useForm<PeriodFormValues>({
    resolver: zodResolver(periodFormSchema),
    defaultValues: {
      lastPeriodDate: undefined,
      cycleLength: 28,
    },
  });

  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData) as Partial<PeriodFormValues & { lastPeriodDate: string }>;
        
        let lastPeriodDateAsDate: Date | undefined = undefined;
        if (parsedData.lastPeriodDate && typeof parsedData.lastPeriodDate === 'string') {
          const parsedDate = parseISO(parsedData.lastPeriodDate);
          if (isValid(parsedDate)) {
            lastPeriodDateAsDate = parsedDate;
          }
        }

        const validatedDefaultValues: Partial<PeriodFormValues> = {};
        if (lastPeriodDateAsDate) {
          validatedDefaultValues.lastPeriodDate = lastPeriodDateAsDate;
        }
        if (typeof parsedData.cycleLength === 'number' && parsedData.cycleLength >= 15 && parsedData.cycleLength <= 45) {
          validatedDefaultValues.cycleLength = parsedData.cycleLength;
        } else if (lastPeriodDateAsDate) { 
            validatedDefaultValues.cycleLength = 28;
        }


        if (Object.keys(validatedDefaultValues).length > 0) {
            const resetValues = {
                lastPeriodDate: validatedDefaultValues.lastPeriodDate,
                cycleLength: validatedDefaultValues.cycleLength || 28,
            };
          form.reset(resetValues);
          if (resetValues.lastPeriodDate) {
            calculateNextPeriod(resetValues.lastPeriodDate, resetValues.cycleLength);
          }
        }

      } catch (error) {
        console.error("Failed to parse period data from localStorage", error);
        localStorage.removeItem(LOCAL_STORAGE_KEY); 
      }
    }
  }, [form]);

  const calculateNextPeriod = (lastDate: Date, length: number) => {
    if (isValid(lastDate) && length) {
      const nextDate = addDays(lastDate, length);
      setPredictedNextPeriod(format(nextDate, 'PPP', { locale: arSA }));
    } else {
      setPredictedNextPeriod(null);
    }
  };

  const onSubmit: SubmitHandler<PeriodFormValues> = (data) => {
    calculateNextPeriod(data.lastPeriodDate, data.cycleLength);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      lastPeriodDate: data.lastPeriodDate.toISOString(), 
      cycleLength: data.cycleLength,
    }));
  };

  return (
    <div className="space-y-6 text-right">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="lastPeriodDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>تاريخ بدء آخر دورة شهرية</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-between pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: arSA })
                        ) : (
                          <span>اختاري تاريخًا</span>
                        )}
                        <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      captionLayout="dropdown-buttons"
                      fromYear={new Date().getFullYear() - 5}
                      toYear={new Date().getFullYear()}
                      locale={arSA}
                      dir="rtl"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cycleLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>متوسط طول الدورة (بالأيام)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="مثال: 28" {...field} className="text-right shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full font-semibold">احسبي وحفظ</Button>
        </form>
      </Form>

      {predictedNextPeriod && (
        <Alert variant="default" className="bg-primary/10 border-primary text-primary text-right">
          <Info className="h-5 w-5 !text-primary ml-2" />
          <AlertTitle className="font-semibold">موعد الدورة القادمة المتوقع</AlertTitle>
          <AlertDescription>
            {predictedNextPeriod}
          </AlertDescription>
        </Alert>
      )}
      
      <Alert variant="default" className="mt-4 text-right">
        <Info className="h-4 w-4 ml-2" />
        <AlertTitle>ملاحظة هامة</AlertTitle>
        <AlertDescription>
          هذه الأداة تقدم تقديرات بناءً على البيانات المدخلة وهي لأغراض إعلامية عامة فقط. قد يختلف طول الدورة الفعلي. لا تعتمدي على هذه التقديرات كوسيلة وحيدة لمنع الحمل أو التشخيص الطبي. استشيري طبيبكِ دائمًا.
        </AlertDescription>
      </Alert>
    </div>
  );
}
