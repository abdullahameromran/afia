
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogOut, ListChecks, AlertTriangle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, Timestamp as FirestoreTimestamp } from 'firebase/firestore'; // Renamed Timestamp to avoid conflict
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QnaEntry {
  id: string;
  question: string;
  userName?: string;
  age?: number;
  answer: string;
  timestamp: FirestoreTimestamp; // Firebase Timestamp
}


export default function AdminPage() {
  const { isAuthenticated, logout, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const [qnaHistory, setQnaHistory] = useState<QnaEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    // This effect handles initial auth check and redirection if not authenticated
    if (!authIsLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authIsLoading, isAuthenticated, router]);

  useEffect(() => {
    // This effect fetches data once authenticated and auth is no longer loading
    if (isAuthenticated && !authIsLoading) {
      const fetchHistory = async () => {
        setHistoryLoading(true);
        setHistoryError(null);
        // Check if db and db.collection are available (Firebase initialized)
        if (!db || typeof db.collection !== 'function') {
            console.warn("Firestore is not initialized. Cannot fetch Q&A history.");
            setHistoryError("فشل الاتصال بقاعدة البيانات. يرجى التحقق من إعدادات Firebase.");
            setHistoryLoading(false);
            setQnaHistory([]); // Ensure history is empty if DB is not available
            return;
        }
        try {
          const qnaCollection = collection(db, 'qnaHistory');
          const qnaQuery = query(qnaCollection, orderBy('timestamp', 'desc'));
          const querySnapshot = await getDocs(qnaQuery);
          const history: QnaEntry[] = [];
          querySnapshot.forEach((doc) => {
            history.push({ id: doc.id, ...doc.data() } as QnaEntry);
          });
          setQnaHistory(history);
        } catch (err) {
          console.error("Error fetching Q&A history:", err);
          setHistoryError("فشل في تحميل سجل الأسئلة والأجوبة. الرجاء المحاولة مرة أخرى.");
        } finally {
          setHistoryLoading(false);
        }
      };
      fetchHistory();
    } else if (!authIsLoading && !isAuthenticated) {
      // If somehow not authenticated and not loading, ensure history is cleared and not loading.
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
    // This case should ideally be rare due to the useEffect redirect,
    // but it's a fallback.
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
        <h1 className="text-3xl sm:text-4xl font-headline text-primary">لوحة تحكم الإدارة</h1>
        <Button onClick={logout} variant="outline" className="bg-white/80 hover:bg-white">
          <LogOut className="ml-2 h-5 w-5" />
          تسجيل الخروج
        </Button>
      </header>

      <main className="w-full max-w-6xl space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center gap-2">
              <ListChecks />
              عرض سجل الأسئلة والأجوبة
            </CardTitle>
            <CardDescription>
              جميع الأسئلة التي طرحها المستخدمون والإجابات المقدمة من النظام.
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
                  لا يوجد سجل أسئلة وأجوبة لعرضه حتى الآن.
                </p>
              </div>
            )}
            {!historyLoading && !historyError && qnaHistory.length > 0 && (
              <ScrollArea className="h-[500px] w-full border rounded-md">
                <Table>
                  <TableHeader className="sticky top-0 bg-card z-10">
                    <TableRow>
                      <TableHead className="w-[150px]">الوقت</TableHead>
                      <TableHead className="w-[120px]">المستخدم</TableHead>
                      <TableHead className="w-[70px]">العمر</TableHead>
                      <TableHead>السؤال</TableHead>
                      <TableHead>الإجابة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {qnaHistory.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.timestamp ? new Date(entry.timestamp.seconds * 1000).toLocaleString('ar-EG', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}</TableCell>
                        <TableCell>{entry.userName || '-'}</TableCell>
                        <TableCell>{entry.age || '-'}</TableCell>
                        <TableCell className="whitespace-pre-wrap max-w-sm break-words">{entry.question}</TableCell>
                        <TableCell className="whitespace-pre-wrap max-w-md break-words">{entry.answer}</TableCell>
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
