
"use client";

import { useState, useEffect } from 'react';
import { format, addDays, subDays, parseISO, isValid } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CalendarDays, Target, Info, BellRing } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const PERIOD_LOCAL_STORAGE_KEY = 'periodTrackerData';
const OVULATION_LOCAL_STORAGE_KEY = 'ovulationTrackerData';

interface StoredPeriodData {
  lastPeriodDate: string; 
  cycleLength: number;
}

interface StoredOvulationData {
  lastPeriodDate: string; 
  cycleLength: number;
}

export function RemindersDisplay() {
  const [nextPeriodDate, setNextPeriodDate] = useState<string | null>(null);
  const [estimatedOvulationDate, setEstimatedOvulationDate] = useState<string | null>(null);
  const [fertileWindow, setFertileWindow] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    let periodDataLoaded = false;
    let ovulationDataLoaded = false;

    try {
      const storedPeriodRaw = localStorage.getItem(PERIOD_LOCAL_STORAGE_KEY);
      if (storedPeriodRaw) {
        const storedPeriod = JSON.parse(storedPeriodRaw) as StoredPeriodData;
        const lastDate = parseISO(storedPeriod.lastPeriodDate);
        if (isValid(lastDate) && storedPeriod.cycleLength) {
          const nextDate = addDays(lastDate, storedPeriod.cycleLength);
          setNextPeriodDate(format(nextDate, 'PPP', { locale: arSA }));
          periodDataLoaded = true;
        }
      }
    } catch (error) {
      console.error("Error loading period reminder data:", error);
    }

    try {
      const storedOvulationRaw = localStorage.getItem(OVULATION_LOCAL_STORAGE_KEY);
      if (storedOvulationRaw) {
        const storedOvulation = JSON.parse(storedOvulationRaw) as StoredOvulationData;
        const lastDate = parseISO(storedOvulation.lastPeriodDate);
        if (isValid(lastDate) && storedOvulation.cycleLength) {
          const nextPeriod = addDays(lastDate, storedOvulation.cycleLength);
          const ovulationDate = subDays(nextPeriod, 14);
          const windowStart = subDays(ovulationDate, 5);
          
          setEstimatedOvulationDate(format(ovulationDate, 'PPP', { locale: arSA }));
          setFertileWindow(`من ${format(windowStart, 'PPP', { locale: arSA })} إلى ${format(ovulationDate, 'PPP', { locale: arSA })}`);
          ovulationDataLoaded = true;
        }
      }
    } catch (error) {
      console.error("Error loading ovulation reminder data:", error);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
        <div className="space-y-4 text-right">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    );
  }

  const hasReminders = nextPeriodDate || estimatedOvulationDate;

  return (
    <div className="space-y-4 text-right">
      {!hasReminders && (
        <Alert variant="default" className="bg-card border-border">
          <Info className="h-5 w-5 text-primary ml-2" />
          <AlertTitle className="font-semibold text-primary">لا توجد تذكيرات محفوظة</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            قومي باستخدام أداتي "متابعة الدورة" و "متابعة التبويض" أولاً لحفظ بياناتكِ وظهور التذكيرات هنا.
          </AlertDescription>
        </Alert>
      )}

      {nextPeriodDate && (
        <Alert variant="default" className="bg-secondary/20 border-secondary text-secondary-foreground">
          <CalendarDays className="h-5 w-5 text-primary ml-2" />
          <AlertTitle className="font-semibold text-primary">تذكير بموعد الدورة القادمة</AlertTitle>
          <AlertDescription>
            موعد الدورة الشهرية القادمة المتوقع هو: <strong>{nextPeriodDate}</strong>.
          </AlertDescription>
        </Alert>
      )}

      {estimatedOvulationDate && fertileWindow && (
        <Alert variant="default" className="bg-accent/20 border-accent text-accent-foreground">
          <Target className="h-5 w-5 text-primary ml-2" />
          <AlertTitle className="font-semibold text-primary">تذكير بفترة التبويض</AlertTitle>
          <AlertDescription>
            <p>يوم التبويض المتوقع: <strong>{estimatedOvulationDate}</strong>.</p>
            <p>نافذة الخصوبة المتوقعة: <strong>{fertileWindow}</strong>.</p>
          </AlertDescription>
        </Alert>
      )}

      {hasReminders && (
         <Alert variant="default" className="mt-6 bg-card border-border">
            <BellRing className="h-5 w-5 text-primary ml-2" />
            <AlertTitle className="font-semibold text-primary">ملاحظة حول التنبيهات</AlertTitle>
            <AlertDescription className="text-muted-foreground">
                هذه تذكيرات بناءً على البيانات التي أدخلتيها. للحصول على تنبيهات فعالة، تأكدي من مراجعة التطبيق بانتظام.
            </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
