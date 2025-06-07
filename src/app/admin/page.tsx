
"use client";

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogOut, ListChecks } from 'lucide-react';

export default function AdminPage() {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FCE4EC] to-[#F8BBD0]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // This should ideally be handled by the AuthContext redirect, but as a safeguard.
    // router.push('/login'); // Can cause infinite loop if AuthContext is still determining state.
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
      <header className="w-full max-w-4xl mb-8 flex justify-between items-center">
        <h1 className="text-3xl sm:text-4xl font-headline text-primary">لوحة تحكم الإدارة</h1>
        <Button onClick={logout} variant="outline" className="bg-white/80 hover:bg-white">
          <LogOut className="ml-2 h-5 w-5" />
          تسجيل الخروج
        </Button>
      </header>

      <main className="w-full max-w-4xl space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center gap-2">
              <ListChecks />
              عرض سجل الأسئلة والأجوبة
            </CardTitle>
            <CardDescription>
              هنا سيتم عرض جميع الأسئلة التي طرحها المستخدمون والإجابات المقدمة من النظام.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 border border-dashed border-border rounded-lg text-center">
              <p className="text-muted-foreground">
                ميزة عرض سجل الأسئلة والأجوبة قيد التطوير حاليًا.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                يتطلب ذلك ربط التطبيق بقاعدة بيانات لتخزين البيانات واسترجاعها.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Add more admin sections/cards here as needed */}
        {/* Example:
        <Card>
          <CardHeader><CardTitle>إدارة المستخدمين (مثال)</CardTitle></CardHeader>
          <CardContent><p>قيد التطوير.</p></CardContent>
        </Card>
        */}
      </main>
       <footer className="mt-12 pt-8 border-t border-border/50 text-center w-full max-w-4xl">
          <p className="text-sm text-muted-foreground/80">
            &copy; {new Date().getFullYear()} لوحة تحكم صحتكِ تهمنا
          </p>
        </footer>
    </div>
  );
}
