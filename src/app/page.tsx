
import { ClientQnaFormWrapper } from '@/components/client-qna-form-wrapper';
import { Heart, Phone, Sparkles, CalendarDays, CalendarHeart, Bell } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { PeriodTracker } from '@/components/period-tracker';
import { OvulationTracker } from '@/components/ovulation-tracker';
import { RemindersDisplay } from '@/components/reminders-display';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 text-foreground">
      <div className="w-full max-w-2xl">
        <header className="mb-8 text-center">
          <div 
            className="inline-flex items-center justify-center gap-x-2 sm:gap-x-4 bg-white/80 text-primary py-4 px-6 rounded-2xl shadow-lg"
          >
            <Heart size={36} className="text-primary order-last sm:order-first" /> 
            <h1 className="font-headline text-3xl sm:text-4xl font-bold text-center mx-2 sm:mx-0">
              صحتكِ تهمنا
            </h1>
            <Image
              src="https://be13a6bfb72b1843b287a4c59c4f4174.cdn.bubble.io/f1749070664202x663207571008088400/8624f5b1-c5a3-438a-bbfa-4c1deda79052.jpg"
              alt="أ.د/ عايدة عبدالرازق"
              width={72}
              height={72}
              className="rounded-full border-2 border-white shadow-sm object-cover order-first sm:order-last"
              data-ai-hint="doctor portrait"
              priority
            />
          </div>
        </header>

        <section className="mb-8 p-6 bg-card rounded-xl shadow-lg text-center text-card-foreground">
          <p className="text-lg leading-relaxed mb-6">
            يهدف هذا التطبيق لتقديم معلومات ودعم في كل ما يخص صحة المرأة، بما في ذلك الحمل والولادة، العناية بعد الولادة، تنظيم الأسرة، وغيرها من المواضيع الهامة. صحتكِ هي أولويتنا.
          </p>
          <p className="text-md font-semibold text-primary mb-3">
            تحت إشراف: أ.د/ عايدة عبدالرازق
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            أستاذ صحة المرأة - كلية التمريض، جامعة المنوفية
          </p>
          <div className="flex items-center justify-center gap-2 text-primary font-semibold mb-4">
            <Phone size={20} />
            <span>للتواصل: 01205342194</span>
          </div>
        </section>

        <ClientQnaFormWrapper />

        <section className="mt-12 mb-8 text-center">
          <h2 className="font-headline text-2xl sm:text-3xl font-bold text-primary mb-6">
            أدوات إضافية لصحتكِ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Dialog>
              <DialogTrigger asChild>
                <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <CardHeader className="flex-row items-center justify-center gap-3 pb-2">
                    <CalendarDays className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl font-semibold text-primary">متابعة الدورة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      سجلي دورتك الشهرية وتوقعي مواعيدها القادمة بدقة.
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] text-right bg-card">
                <DialogHeader>
                  <DialogTitle className="font-headline text-primary">متابعة الدورة الشهرية</DialogTitle>
                  <DialogDescription>
                    أدخلي تاريخ بدء آخر دورة شهرية ومتوسط طول دورتكِ لحساب الموعد المتوقع للدورة القادمة.
                  </DialogDescription>
                </DialogHeader>
                <PeriodTracker />
                 <DialogClose asChild>
                    <Button type="button" variant="outline" className="mt-4 w-full">
                      إغلاق
                    </Button>
                  </DialogClose>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <CardHeader className="flex-row items-center justify-center gap-3 pb-2">
                    <CalendarHeart className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl font-semibold text-primary">متابعة التبويض</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      اعرفي أيام التبويض لزيادة فرص الحمل أو لتجنبه.
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] text-right bg-card">
                <DialogHeader>
                  <DialogTitle className="font-headline text-primary">متابعة فترة التبويض</DialogTitle>
                  <DialogDescription>
                    أدخلي بيانات دورتكِ لتقدير يوم التبويض وفترة الخصوبة.
                  </DialogDescription>
                </DialogHeader>
                <OvulationTracker />
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="mt-4 w-full">
                    إغلاق
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <CardHeader className="flex-row items-center justify-center gap-3 pb-2">
                    <Bell className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl font-semibold text-primary">تذكيرات هامة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      عرض تذكيرات لمواعيد دورتكِ وفترة التبويض المحفوظة.
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] text-right bg-card">
                <DialogHeader>
                  <DialogTitle className="font-headline text-primary">تذكيراتكِ الصحية</DialogTitle>
                  <DialogDescription>
                    هنا تظهر التواريخ الهامة بناءً على البيانات التي أدخلتيها في الأدوات الأخرى.
                  </DialogDescription>
                </DialogHeader>
                <RemindersDisplay />
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="mt-4 w-full">
                    إغلاق
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        <footer className="mt-12 pt-8 border-t border-border/50 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <Sparkles size={20} className="text-primary" />
            <p className="text-md">شكراً لاستخدامكِ تطبيق صحتكِ تهمنا!</p>
          </div>
          <p className="text-sm text-muted-foreground/80">
            نحن هنا دائمًا لمزيد من الأسئلة والدعم.
          </p>
        </footer>
      </div>
    </main>
  );
}
