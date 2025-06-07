
"use client";

import { useState, useEffect } from 'react';
import { format, addDays, subDays, parseISO, isValid } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CalendarDays, Target, Info, BellRing } from 'lucide-react';

const PERIOD_LOCAL_STORAGE_KEY = 'periodTrackerData';
const OVULATION_LOCAL_STORAGE_KEY = 'ovulationTrackerData';

interface StoredPeriodData {
  lastPeriodDate: string; // ISO string
  cycleLength: number;
}

interface StoredOvulationData {
  lastPeriodDate: string; // ISO string
  cycleLength: number;
}

export function RemindersDisplay() {
  const [nextPeriodDate, setNextPeriodDate] = useState<string | null>(null);
  const [estimatedOvulationDate, setEstimatedOvulationDate] = useState<string | null>(null);
  const [fertileWindow, setFertileWindow] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load Period Data
    try {
      const storedPeriodRaw = localStorage.getItem(PERIOD_LOCAL_STORAGE_KEY);
      if (storedPeriodRaw) {
        const storedPeriod = JSON.parse(storedPeriodRaw) as StoredPeriodData;
        const lastDate = parseISO(storedPeriod.lastPeriodDate);
        if (isValid(lastDate) && storedPeriod.cycleLength) {
          const nextDate = addDays(lastDate, storedPeriod.cycleLength);
          setNextPeriodDate(format(nextDate, 'PPP', { locale: arSA }));
        }
      }
    } catch (error) {
      console.error("Error loading period reminder data:", error);
    }

    // Load Ovulation Data
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
        }
      }
    } catch (error) {
      console.error("Error loading ovulation reminder data:", error);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <p className="text-center text-muted-foreground">جاري تحميل التذكيرات...</p>;
  }

  const hasReminders = nextPeriodDate || estimatedOvulationDate;

  return (
    <div className="space-y-4 text-right">
      {!hasReminders && (
        <Alert variant="default">
          <Info className="h-4 w-4 ml-2" />
          <AlertTitle>لا توجد تذكيرات محفوظة</AlertTitle>
          <AlertDescription>
            قومي باستخدام أداتي "متابعة الدورة" و "متابعة التبويض" أولاً لحفظ بياناتكِ وظهور التذكيرات هنا.
          </AlertDescription>
        </Alert>
      )}

      {nextPeriodDate && (
        <Alert variant="default" className="bg-secondary/30 border-secondary">
          <CalendarDays className="h-5 w-5 text-primary ml-2" />
          <AlertTitle className="font-semibold text-primary">تذكير بموعد الدورة القادمة</AlertTitle>
          <AlertDescription>
            موعد الدورة الشهرية القادمة المتوقع هو: <strong>{nextPeriodDate}</strong>.
          </AlertDescription>
        </Alert>
      )}

      {estimatedOvulationDate && fertileWindow && (
        <Alert variant="default" className="bg-accent/30 border-accent">
          <Target className="h-5 w-5 text-primary ml-2" />
          <AlertTitle className="font-semibold text-primary">تذكير بفترة التبويض</AlertTitle>
          <AlertDescription>
            <p>يوم التبويض المتوقع: <strong>{estimatedOvulationDate}</strong>.</p>
            <p>نافذة الخصوبة المتوقعة: <strong>{fertileWindow}</strong>.</p>
          </AlertDescription>
        </Alert>
      )}

      {hasReminders && (
         <Alert variant="default" className="mt-6">
            <BellRing className="h-4 w-4 ml-2 text-primary" />
            <AlertTitle>ملاحظة حول التنبيهات</AlertTitle>
            <AlertDescription>
                هذه تذكيرات بناءً على البيانات التي أدخلتيها. للحصول على تنبيهات فعالة، تأكدي من مراجعة التطبيق بانتظام.
            </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
