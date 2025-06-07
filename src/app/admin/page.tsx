
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogOut, ListChecks, AlertTriangle, Heart } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient'; // Using the anon key client for browser
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QnaEntry {
  id: number;
  question: string;
  userName?: string;
  age?: number;
  answer: string;
  timestamp: string; // Supabase timestamp is typically an ISO string
}


export default function AdminPage() {
  const { isAuthenticated, logout, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const [qnaHistory, setQnaHistory] = useState<QnaEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    if (!authIsLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authIsLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && !authIsLoading) {
      const fetchHistory = async () => {
        setHistoryLoading(true);
        setHistoryError(null);
        
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
          setQnaHistory(data as QnaEntry[]);
        } catch (err: any) {
          console.error("Error fetching Q&A history from Supabase:", err);
          setHistoryError(`فشل في تحميل سجل الأسئلة والأجوبة: ${err.message || 'خطأ غير معروف'}`);
        } finally {
          setHistoryLoading(false);
        }
      };
      fetchHistory();
    } else if (!authIsLoading && !isAuthenticated) {
      setQnaHistory([]);
      setHistoryLoading(false);
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

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-[#FCE4EC] to-[#F8BBD0] p-4 sm:p-8">
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
          <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center gap-2">
              <ListChecks />
              عرض سجل الأسئلة والأجوبة
            </CardTitle>
            <CardDescription>
              جميع الأسئلة التي طرحها المستخدمون والإجابات المقدمة من النظام، محفوظة في قاعدة البيانات.
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
                      <TableHead className="w-[150px] text-right">الوقت</TableHead>
                      <TableHead className="w-[120px] text-right">المستخدم</TableHead>
                      <TableHead className="w-[70px] text-right">العمر</TableHead>
                      <TableHead className="text-right">السؤال</TableHead>
                      <TableHead className="text-right">الإجابة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {qnaHistory.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="text-right">{entry.timestamp ? new Date(entry.timestamp).toLocaleString('ar-EG', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}</TableCell>
                        <TableCell className="text-right">{entry.userName || '-'}</TableCell>
                        <TableCell className="text-right">{entry.age || '-'}</TableCell>
                        <TableCell className="whitespace-pre-wrap max-w-sm break-words text-right">{entry.question}</TableCell>
                        <TableCell className="whitespace-pre-wrap max-w-md break-words text-right">{entry.answer}</TableCell>
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
