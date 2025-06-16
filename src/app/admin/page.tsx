
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogOut, ListChecks, AlertTriangle, Heart, BarChart2 as BarChartIconLucide, Star, MessageSquare } from 'lucide-react'; // Renamed BarChart2 to avoid conflict
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

interface QnaEntry {
  id: number;
  question: string;
  userName?: string;
  age_label?: string;
  answer: string;
  timestamp: string;
  rating?: number;
  review_text?: string;
}

interface AnalyticsData {
  totalQuestions: number;
  questionsByAgeGroup: Record<string, number>;
  uniqueUsers: number;
  averageRating?: number;
  totalReviewsWithText: number;
  questionsByAgeGroupChartData?: Array<{ name: string; questions: number }>;
}

const chartConfig = {
  questions: {
    label: "عدد الأسئلة",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function AdminPage() {
  const { isAuthenticated, logout, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const [qnaHistory, setQnaHistory] = useState<QnaEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (!authIsLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authIsLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && !authIsLoading) {
      const fetchHistoryAndAnalyze = async () => {
        setHistoryLoading(true);
        setHistoryError(null);
        setAnalytics(null);

        if (!supabase) {
            console.warn("Supabase client is not initialized. Cannot fetch Q&A history. Please check Supabase configuration in .env.");
            setHistoryError("فشل الاتصال بخدمة تخزين البيانات. يرجى التحقق من إعدادات الاتصال وملف .env.");
            setHistoryLoading(false);
            setQnaHistory([]);
            return;
        }
        try {
          const { data, error } = await supabase
            .from('qnaHistory')
            .select('*')
            .order('timestamp', { ascending: false });

          if (error) {
            throw error;
          }

          if (data) {
            const typedData = data as QnaEntry[];
            setQnaHistory(typedData);

            const totalQuestions = typedData.length;

            const ageGroupCounts = typedData.reduce((acc, entry) => {
              const ageLabel = entry.age_label || 'غير محدد';
              acc[ageLabel] = (acc[ageLabel] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);

            const ageGroupChartData = Object.entries(ageGroupCounts)
              .map(([name, count]) => ({ name, questions: count }))
              .sort((a, b) => b.questions - a.questions);

            const uniqueUserNames = new Set(typedData.map(entry => entry.userName).filter(Boolean as (value: string | null | undefined) => value is string));
            const uniqueUsers = uniqueUserNames.size;

            const ratings = typedData.filter(entry => typeof entry.rating === 'number').map(entry => entry.rating as number);
            const averageRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : undefined;
            const totalReviewsWithText = typedData.filter(entry => entry.review_text && entry.review_text.trim() !== '').length;

            setAnalytics({
              totalQuestions,
              questionsByAgeGroup: ageGroupCounts,
              uniqueUsers,
              averageRating,
              totalReviewsWithText,
              questionsByAgeGroupChartData: ageGroupChartData,
            });

          } else {
             setQnaHistory([]);
             setAnalytics({ // Set empty analytics if no data
                totalQuestions: 0,
                questionsByAgeGroup: {},
                uniqueUsers: 0,
                averageRating: undefined,
                totalReviewsWithText: 0,
                questionsByAgeGroupChartData: [],
             });
          }
        } catch (err: any) {
          console.error("Error fetching Q&A history from Supabase:", err);
          setHistoryError(`فشل في تحميل سجل الأسئلة والأجوبة: ${err.message || 'خطأ غير معروف'}`);
        } finally {
          setHistoryLoading(false);
        }
      };
      fetchHistoryAndAnalyze();
    } else if (!authIsLoading && !isAuthenticated) {
      setQnaHistory([]);
      setHistoryLoading(false);
      setAnalytics(null);
    }
  }, [isAuthenticated, authIsLoading]);


  if (authIsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FCE4EC] to-[#F8BBD0]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
     return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FCE4EC] to-[#F8BBD0] p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="text-primary">غير مصرح بالدخول</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>يتم توجيهك لصفحة تسجيل الدخول...</p>
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mt-4" />
                </CardContent>
            </Card>
        </div>
    );
  }

  const renderStars = (rating: number | undefined) => {
    if (rating === undefined || rating === null) return '-';
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`inline-block h-4 w-4 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-[#FCE4EC] to-[#F8BBD0] p-4 sm:p-8 text-right" dir="rtl">
      <header className="w-full max-w-6xl mb-8 flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-4">
           <Image
              src="https://be13a6bfb72b1843b287a4c59c4f4174.cdn.bubble.io/f1749070664202x663207571008088400/8624f5b1-c5a3-438a-bbfa-4c1deda79052.jpg"
              alt="أ.د/ عايدة عبدالرازق"
              width={56}
              height={56}
              className="rounded-full border-2 border-white shadow-sm object-cover"
              data-ai-hint="doctor portrait"
              priority
            />
            <h1 className="font-headline text-2xl sm:text-3xl font-bold text-primary">
              صحتكِ تهمنا
            </h1>
            <Heart size={30} className="text-primary" />
        </div>
        <div className="flex flex-col items-end">
            <h2 className="text-2xl sm:text-3xl font-headline text-primary">لوحة تحكم الإدارة</h2>
            <Button onClick={logout} variant="outline" className="bg-white/80 hover:bg-white mt-2">
              <LogOut className="ml-2 h-5 w-5" />
              تسجيل الخروج
            </Button>
        </div>
      </header>

      <main className="w-full max-w-6xl space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="text-right">
            <CardTitle className="text-2xl text-primary flex items-center justify-end gap-2">
              <BarChartIconLucide />
              إحصائيات الاستخدام
            </CardTitle>
            <CardDescription className="text-right">
              نظرة عامة على تفاعلات المستخدمين مع قسم الأسئلة والأجوبة والتقييمات.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {historyLoading && (
              <div className="flex justify-center items-center py-6">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mr-3">جاري تحميل الإحصائيات...</p>
              </div>
            )}
            {historyError && !historyLoading && (
              <p className="text-destructive text-center py-6">
                  فشل في تحميل بيانات الإحصائيات بسبب خطأ في جلب السجل.
              </p>
            )}
            {!historyLoading && !historyError && analytics && (
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 text-sm">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">الملخص العام:</h3>
                  <p>إجمالي عدد الأسئلة: {analytics.totalQuestions}</p>
                  <p>عدد المستخدمين (حسب الأسماء الفريدة): {analytics.uniqueUsers}</p>
                  <p>إجمالي المراجعات النصية: {analytics.totalReviewsWithText}</p>
                  {analytics.averageRating !== undefined && (
                     <p>متوسط التقييم (بالنجوم): {analytics.averageRating.toFixed(2)} / 5</p>
                  )}
                   {analytics.averageRating === undefined && analytics.totalQuestions > 0 && (
                     <p>متوسط التقييم (بالنجوم): لا توجد تقييمات كافية</p>
                  )}
                   {analytics.totalQuestions === 0 && (
                    <p className="text-muted-foreground mt-2">
                        لا توجد أسئلة مسجلة لعرض ملخص الإحصائيات.
                    </p>
                 )}
                </div>

                {analytics.questionsByAgeGroupChartData && analytics.questionsByAgeGroupChartData.length > 0 ? (
                  <div className="h-[300px] md:h-[350px] mt-4 md:mt-0">
                    <h3 className="font-semibold text-lg mb-2 text-center md:text-right">الأسئلة حسب الفئة العمرية:</h3>
                    <ResponsiveContainer width="100%" height="100%">
                       <ChartContainer config={chartConfig} className="w-full h-full">
                        <BarChart
                            accessibilityLayer
                            data={analytics.questionsByAgeGroupChartData}
                            layout="vertical"
                            margin={{ left: 10, right: 10, top: 5, bottom: 5 }}
                        >
                          <CartesianGrid vertical={false} strokeDasharray="3 3" />
                          <XAxis type="number" dataKey="questions" allowDecimals={false} />
                          <YAxis
                            dataKey="name"
                            type="category"
                            width={110} // Adjusted for potentially longer labels in Arabic
                            interval={0}
                            tick={{ fontSize: 10, fill: 'hsl(var(--foreground))' }}
                          />
                          <Tooltip
                            cursor={{ fill: 'hsl(var(--muted))' }}
                            content={<ChartTooltipContent indicator="dot" />}
                          />
                          <Bar dataKey="questions" fill="var(--color-questions)" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                      </ChartContainer>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  analytics.totalQuestions > 0 && (
                    <div className="flex items-center justify-center h-[300px] md:h-[350px] mt-4 md:mt-0 bg-muted/30 rounded-md">
                        <p className="text-muted-foreground text-center p-4">
                        لا توجد بيانات أسئلة موزعة حسب الفئة العمرية لعرض الرسم البياني.
                        </p>
                    </div>
                  )
                )}
              </div>
            )}
             {!historyLoading && !historyError && (!analytics || analytics.totalQuestions === 0) && (
                <p className="text-muted-foreground text-center py-6">
                    لا توجد بيانات كافية لعرض الإحصائيات.
                </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="text-right">
            <CardTitle className="text-2xl text-primary flex items-center justify-end gap-2">
              <ListChecks />
              عرض سجل الأسئلة والأجوبة والتقييمات
            </CardTitle>
            <CardDescription className="text-right">
              جميع الأسئلة، الإجابات، والتقييمات المدخلة من المستخدمين.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {historyLoading && (
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            )}
            {historyError && (
                <div className="flex flex-col items-center justify-center py-10 text-center bg-destructive/10 p-4 rounded-md">
                    <AlertTriangle className="h-10 w-10 text-destructive mb-3" />
                    <p className="text-destructive text-lg font-semibold">خطأ في تحميل البيانات</p>
                    <p className="text-destructive/80">{historyError}</p>
                </div>
            )}
            {!historyLoading && !historyError && qnaHistory.length === 0 && (
              <div className="p-6 border border-dashed border-border rounded-lg text-center">
                <p className="text-muted-foreground">
                  {supabase ? "لا يوجد سجل أسئلة وأجوبة لعرضه حتى الآن." : "خدمة تخزين البيانات غير مهيأة. يرجى التحقق من الإعدادات في ملف .env."}
                </p>
              </div>
            )}
            {!historyLoading && !historyError && qnaHistory.length > 0 && (
              <ScrollArea className="h-[500px] w-full border rounded-md">
                <Table>
                  <TableHeader className="sticky top-0 bg-card z-10">
                    <TableRow>
                      <TableHead className="w-[130px] text-right">الوقت</TableHead>
                      <TableHead className="w-[100px] text-right">المستخدم</TableHead>
                      <TableHead className="w-[150px] text-right">المرحلة العمرية</TableHead>
                      <TableHead className="text-right min-w-[200px]">السؤال</TableHead>
                      <TableHead className="text-right min-w-[250px]">الإجابة</TableHead>
                      <TableHead className="w-[80px] text-right">التقييم</TableHead>
                      <TableHead className="text-right min-w-[150px]">المراجعة</TableHead>
                      <TableHead className="w-[50px] text-right">م</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {qnaHistory.map((entry, index) => (
                      <TableRow key={entry.id}>
                        <TableCell className="text-right text-xs">{entry.timestamp ? new Date(entry.timestamp).toLocaleString('ar-EG', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}</TableCell>
                        <TableCell className="text-right text-xs">{entry.userName || '-'}</TableCell>
                        <TableCell className="text-right text-xs">{entry.age_label || '-'}</TableCell>
                        <TableCell className="whitespace-pre-wrap max-w-xs break-words text-right text-xs">{entry.question}</TableCell>
                        <TableCell className="whitespace-pre-wrap max-w-sm break-words text-right text-xs">{entry.answer}</TableCell>
                        <TableCell className="text-right text-xs">{renderStars(entry.rating)}</TableCell>
                        <TableCell className="whitespace-pre-wrap max-w-xs break-words text-right text-xs">{entry.review_text || '-'}</TableCell>
                        <TableCell className="text-right text-xs">{index + 1}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </main>
       <footer className="mt-12 pt-8 border-t border-border/50 text-center w-full max-w-6xl">
          <p className="text-sm text-muted-foreground/80">
            &copy; {new Date().getFullYear()} لوحة تحكم صحتكِ تهمنا
          </p>
        </footer>
    </div>
  );
}

    