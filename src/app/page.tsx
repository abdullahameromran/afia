
import { ClientQnaFormWrapper } from '@/components/client-qna-form-wrapper';
import { Baby, Hospital, Users, Flower2, Heart, Phone, Sparkles, CalendarDays, CalendarHeart, Bell, School, Users2, Activity, Leaf, Utensils, Bike, Droplets, HeartPulse, BookOpenCheck, ClipboardCheck, BedDouble, HelpingHand, Milk, Sunrise, Replace, ShieldAlert, Pill, ListChecks, Route, Milestone, Brain, CheckCircle, ShieldCheck, GitMerge, Zap, Stethoscope, Flame, Apple, GraduationCap, Dumbbell, WashingMachine, CalendarPlus, HeartHandshake, ThermometerSun, Waves, Info, CalendarCheck } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ShadcnCardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { PeriodTracker } from '@/components/period-tracker';
import { OvulationTracker } from '@/components/ovulation-tracker';
import { RemindersDisplay } from '@/components/reminders-display';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Helper component for list items with optional sub-points
const ListItem = ({ children, subPoints }: { children: React.ReactNode; subPoints?: string[] }) => (
  <li className="flex">
    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-1 shrink-0" />
    <div className="flex-1">
      {children}
      {subPoints && (
        <ul className="list-disc list-inside mt-1 pl-4 space-y-0.5 text-sm text-foreground/80">
          {subPoints.map((point, i) => <li key={i}>{point}</li>)}
        </ul>
      )}
    </div>
  </li>
);


export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 text-foreground">
      <div className="w-full max-w-3xl"> {/* Increased max-width for new section */}
        <header className="mb-8 text-center">
          <div
            className="inline-flex items-center justify-center gap-x-2 sm:gap-x-4 bg-card text-primary py-4 px-6 rounded-2xl shadow-lg"
          >
            <Image
              src="https://be13a6bfb72b1843b287a4c59c4f4174.cdn.bubble.io/f1749070664202x663207571008088400/8624f5b1-c5a3-438a-bbfa-4c1deda79052.jpg"
              alt="أ.د/ عايدة عبدالرازق"
              width={72}
              height={72}
              className="rounded-full border-2 border-white shadow-sm object-cover order-first sm:order-last"
              data-ai-hint="doctor portrait"
              priority
            />
            <h1 className="font-headline text-3xl sm:text-4xl font-bold text-center mx-2 sm:mx-0">
              صحتكِ تهمنا
            </h1>
            <Heart size={36} className="text-primary order-last sm:order-first" />
          </div>
        </header>

        <section className="mb-8 p-6 bg-card rounded-xl shadow-lg text-center text-card-foreground">
          <p className="text-2xl leading-relaxed mb-6">
            يهدف هذا التطبيق لتقديم معلومات ودعم في كل ما يخص صحة المرأة، بما في ذلك الحمل والولادة، العناية بعد الولادة، تنظيم الأسرة، وغيرها من المواضيع الهامة. صحتكِ هي أولويتنا.
          </p>
          <p className="text-2xl font-semibold text-primary mb-4">
            تحت إشراف: أ.د/ عايدة عبدالرازق
          </p>
          <p className="text-lg text-muted-foreground mb-6">
            أستاذ صحة المرأة - كلية التمريض، جامعة المنوفية
          </p>
          <div className="flex items-center justify-center gap-2 text-primary font-semibold mb-4 text-lg">
            <Phone size={22} />
            <span>للتواصل: 01205342194</span>
          </div>
        </section>

        {/* New Detailed Section: رحلة صحة المرأة */}
        <section className="my-12 space-y-8" dir="rtl">
          <header className="text-center mb-10">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary">
              رحلة صحة المرأة من المراهقة إلى سن الأمل
            </h2>
            <p className="text-lg text-muted-foreground mt-2">
              – بإشراف الاستاذة الدكتورة عايدة عبدالرازق أستاذ صحة المرأة - كلية التمريض، جامعة المنوفية –
            </p>
          </header>

          {/* 1. مرحلة المراهقة (13–16 سنة) */}
          <Card className="bg-rose-50 border-rose-200 shadow-lg overflow-hidden">
            <CardHeader className="bg-rose-100">
              <CardTitle className="text-2xl font-headline text-rose-700 flex items-center gap-3">
                <School size={28} />
                <span>1. مرحلة المراهقة (13–16 سنة)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="teen-physiological">
                  <AccordionTrigger className="text-lg font-semibold text-rose-600 hover:no-underline">
                    <div className="flex items-center gap-2"><Zap size={20} />التغيرات الفسيولوجية</div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pr-2 space-y-2 text-foreground/90">
                    <ul className="space-y-2">
                      <ListItem subPoints={['بدء الطمث، تغيرات في الهرمونات (الإستروجين والبروجسترون).']}>الحيض (الدورة الشهرية)</ListItem>
                      <ListItem subPoints={['نمو الغدد الثديية تحت تأثير الهرمونات.']}>تطور الثديين</ListItem>
                      <ListItem subPoints={['بسبب زيادة الأندروجينات.']}>نمو شعر العانة والإبط</ListItem>
                      <ListItem subPoints={['زيادة سريعة في الطول والوزن.']}>طفرة النمو</ListItem>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="teen-health-signs">
                  <AccordionTrigger className="text-lg font-semibold text-rose-600 hover:no-underline">
                    <div className="flex items-center gap-2"><HeartPulse size={20} />العلامات الصحية</div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pr-2 space-y-2 text-foreground/90">
                    <ul className="space-y-2">
                      <ListItem>انتظام الدورة الشهرية (28–35 يومًا).</ListItem>
                      <ListItem>عدم وجود آلام شديدة (قد تشير إلى بطانة رحم مهاجرة).</ListItem>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="teen-health-education">
                  <AccordionTrigger className="text-lg font-semibold text-rose-600 hover:no-underline">
                    <div className="flex items-center gap-2"><BookOpenCheck size={20} />التثقيف الصحي</div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pr-2 space-y-3 text-foreground/90">
                    <div>
                      <h4 className="font-semibold flex items-center gap-1 mb-1"><Apple size={18} />التغذية:</h4>
                      <ul className="space-y-1 pl-4">
                        <ListItem subPoints={['مثل السبانخ، اللحوم الحمراء.']}>زيادة الحديد (لتعويض فقدان الدم في الدورة)</ListItem>
                        <ListItem subPoints={['الحليب، البيض، الأسماك.']}>الكالسيوم وفيتامين D (لبناء العظام)</ListItem>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold flex items-center gap-1 mb-1"><Bike size={18} />الرياضة:</h4>
                      <ul className="space-y-1 pl-4">
                        <ListItem>المشي واليوجا لتقليل تقلصات الدورة.</ListItem>
                        <ListItem>تجنب الرياضات العنيفة أثناء الحيض.</ListItem>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold flex items-center gap-1 mb-1"><Droplets size={18} />النظافة الشخصية:</h4>
                      <ul className="space-y-1 pl-4">
                        <ListItem>تغيير الفوط الصحية كل 4–6 ساعات.</ListItem>
                        <ListItem>استخدام منتجات مناسبة (فوط، كؤوس menstruation cups).</ListItem>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* 2. العناية بالحمل والولادة وما بعدها */}
          <Card className="bg-sky-50 border-sky-200 shadow-lg overflow-hidden">
            <CardHeader className="bg-sky-100">
              <CardTitle className="text-2xl font-headline text-sky-700 flex items-center gap-3">
                <HeartHandshake size={28} />
                <span>2. العناية بالحمل والولادة وما بعدها</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="repro-pre-pregnancy">
                  <AccordionTrigger className="text-lg font-semibold text-sky-600 hover:no-underline">
                    <div className="flex items-center gap-2"><CalendarCheck size={20} />أ. قبل الحمل</div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pr-2 space-y-3 text-foreground/90">
                    <div>
                      <h4 className="font-semibold mb-1">التخطيط للحمل:</h4>
                      <ul className="space-y-1 pl-4">
                        <ListItem>تناول حمض الفوليك (400 ميكروغرام يوميًا) قبل الحمل بـ 3 أشهر.</ListItem>
                        <ListItem>تجنب الكحول والتدخين.</ListItem>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">الفحوصات:</h4>
                      <ul className="space-y-1 pl-4">
                        <ListItem>تحاليل الغدة الدرقية، الهيموجلوبين، الأمراض المنقولة جنسيًا.</ListItem>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="repro-during-pregnancy">
                  <AccordionTrigger className="text-lg font-semibold text-sky-600 hover:no-underline">
                     <div className="flex items-center gap-2"><Baby size={20} />ب. أثناء الحمل</div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pr-2 space-y-3 text-foreground/90">
                    <h4 className="font-semibold mb-1">العناية حسب الثلث:</h4>
                    <ul className="space-y-2 pl-4">
                       <ListItem subPoints={['الغثيان الصباحي: تناول وجبات صغيرة متكررة، الزنجبيل.', 'تجنب اللحوم النيئة (خطر التوكسوبلازما).']}>الثلث الأول (1–12 أسبوعًا)</ListItem>
                       <ListItem subPoints={['زيادة الوزن الطبيعية (5–7 كجم).', 'تمارين كيجل لتقوية الحوض.']}>الثلث الثاني (13–28 أسبوعًا)</ListItem>
                       <ListItem subPoints={['مراقبة سكر الحمل وضغط الدم.', 'تحضير حقيبة الولادة.']}>الثلث الثالث (29–40 أسبوعًا)</ListItem>
                    </ul>
                    <h4 className="font-semibold mt-3 mb-1">التثقيف الوقائي:</h4>
                     <ul className="space-y-2 pl-4">
                        <ListItem subPoints={['تقليل السكريات، زيادة الألياف.']}>الوقاية من سكري الحمل</ListItem>
                        <ListItem subPoints={['قياس الضغط بانتظام، تناول البروتين الكافي.']}>الوقاية من تسمم الحمل</ListItem>
                     </ul>
                  </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="repro-birth">
                  <AccordionTrigger className="text-lg font-semibold text-sky-600 hover:no-underline">
                    <div className="flex items-center gap-2"><BedDouble size={20} />ج. الولادة</div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pr-2 space-y-3 text-foreground/90">
                     <div>
                      <h4 className="font-semibold mb-1">علامات الطلق الحقيقي:</h4>
                      <ul className="space-y-1 pl-4">
                        <ListItem>انقباضات منتظمة كل 5 دقائق.</ListItem>
                        <ListItem>نزول ماء الجنين.</ListItem>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">خيارات الولادة:</h4>
                      <ul className="space-y-1 pl-4">
                        <ListItem>طبيعية، قيصرية، ولادة في الماء.</ListItem>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="repro-postpartum">
                  <AccordionTrigger className="text-lg font-semibold text-sky-600 hover:no-underline">
                    <div className="flex items-center gap-2"><HelpingHand size={20} />د. ما بعد الولادة</div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pr-2 space-y-3 text-foreground/90">
                     <div>
                      <h4 className="font-semibold mb-1">العناية بالنفس:</h4>
                      <ul className="space-y-1 pl-4">
                        <ListItem>النزيف الطبيعي (يستمر 4–6 أسابيع).</ListItem>
                        <ListItem>تنظيف منطقة العجان بالماء الدافئ.</ListItem>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 flex items-center gap-1"><Milk size={18}/>الرضاعة الطبيعية:</h4>
                      <ul className="space-y-1 pl-4">
                        <ListItem>فوائدها: تقلص الرحم، تعزيز مناعة الطفل.</ListItem>
                        <ListItem>تغذية الأم: شرب 3 لترات ماء يوميًا، زيادة السعرات 500 سعرة/يوم.</ListItem>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* 3. مرحلة سن الأمل (48–55 سنة) */}
          <Card className="bg-purple-50 border-purple-200 shadow-lg overflow-hidden">
            <CardHeader className="bg-purple-100">
              <CardTitle className="text-2xl font-headline text-purple-700 flex items-center gap-3">
                <Sunrise size={28} />
                <span>3. مرحلة سن الأمل (48–55 سنة)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="meno-physiological">
                  <AccordionTrigger className="text-lg font-semibold text-purple-600 hover:no-underline">
                     <div className="flex items-center gap-2"><Replace size={20} />التغيرات الفسيولوجية</div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pr-2 space-y-3 text-foreground/90">
                    <div>
                      <h4 className="font-semibold mb-1">انقطاع الطمث (Menopause):</h4>
                      <ul className="space-y-1 pl-4">
                        <ListItem>توقف الدورة الشهرية لمدة 12 شهرًا متتاليًا.</ListItem>
                        <ListItem>انخفاض الإستروجين → هبات ساخنة، جفاف المهبل.</ListItem>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">مخاطر صحية:</h4>
                      <ul className="space-y-1 pl-4">
                        <ListItem>هشاشة العظام (نقص الكالسيوم).</ListItem>
                        <ListItem>أمراض القلب (بسبب انخفاض الإستروجين الواقي).</ListItem>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="meno-health-care">
                  <AccordionTrigger className="text-lg font-semibold text-purple-600 hover:no-underline">
                    <div className="flex items-center gap-2"><Activity size={20} />العناية الصحية</div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pr-2 space-y-3 text-foreground/90">
                    <div>
                      <h4 className="font-semibold flex items-center gap-1 mb-1"><Utensils size={18} />التغذية:</h4>
                      <ul className="space-y-1 pl-4">
                        <ListItem>الكالسيوم (1200 مجم/يوم) + فيتامين D.</ListItem>
                        <ListItem>الأوميغا-3 (السلمون) لصحة القلب.</ListItem>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold flex items-center gap-1 mb-1"><Dumbbell size={18} />الرياضة:</h4>
                      <ul className="space-y-1 pl-4">
                        <ListItem>تمارين المقاومة (رفع أثقال خفيفة) لمنع هشاشة العظام.</ListItem>
                        <ListItem>المشي 30 دقيقة يوميًا.</ListItem>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold flex items-center gap-1 mb-1"><Pill size={18} />المتابعة الطبية:</h4>
                      <ul className="space-y-1 pl-4">
                        <ListItem>فحص كثافة العظام (DEXA scan).</ListItem>
                        <ListItem>العلاج الهرموني التعويضي (HRT) بعد استشارة الطبيب.</ListItem>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* نقاط رئيسية للتثقيف الصحي */}
          <Card className="bg-emerald-50 border-emerald-200 shadow-lg overflow-hidden">
            <CardHeader className="bg-emerald-100">
              <CardTitle className="text-2xl font-headline text-emerald-700 flex items-center gap-3">
                <ListChecks size={28} />
                <span>نقاط رئيسية للتثقيف الصحي عبر المراحل</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 text-emerald-800/90">
              <ul className="space-y-3">
                <ListItem>البلوغ: تعليم الفتيات عن الدورة الشهرية والنظافة.</ListItem>
                <ListItem>الإنجاب: التشديد على الرعاية السابقة للحمل والفحوصات الدورية.</ListItem>
                <ListItem>سن الأمل: التركيز على منع هشاشة العظام وأمراض القلب.</ListItem>
              </ul>
            </CardContent>
          </Card>
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
