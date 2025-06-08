
import { ClientQnaFormWrapper } from '@/components/client-qna-form-wrapper';
import { Baby, Hospital, Users, Flower2, Heart, Phone, Sparkles, CalendarDays, CalendarHeart, Bell, School, Users2, Activity, Leaf, Utensils, Bike, Droplets, HeartPulse, BookOpenCheck, ClipboardCheck, BedDouble, HelpingHand, Milk, Sunrise, Replace, ShieldAlert, Pill, ListChecks, Route, Milestone, Brain, CheckCircle, ShieldCheck, GitMerge, Zap, Stethoscope, Flame, Apple, GraduationCap, Dumbbell, WashingMachine, CalendarPlus, HeartHandshake, ThermometerSun, Waves, Info, Newspaper, AlignJustify, BookOpen, CalendarCheck } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ShadcnCardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { PeriodTracker } from '@/components/period-tracker';
import { OvulationTracker } from '@/components/ovulation-tracker';
import { RemindersDisplay } from '@/components/reminders-display';
import { Button } from '@/components/ui/button';
import type { HealthTip, Subsection, StageSection } from '@/lib/lifeStagesData'; 
import { cn } from '@/lib/utils';

// Helper component for list items with optional sub-points
const ListItem = ({ children, subPoints }: { children: React.ReactNode; subPoints?: string[] }) => (
  <li className="flex mb-1">
    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-1 shrink-0" />
    <div className="flex-1">
      {children}
      {subPoints && (
        <ul className="list-disc list-inside mt-1 pr-4 space-y-0.5 text-sm text-foreground/80">
          {subPoints.map((point, i) => <li key={i}>{point}</li>)}
        </ul>
      )}
    </div>
  </li>
);

// Helper functions to render details inside Dialog
const renderHealthTips = (tips: HealthTip[], baseColorClass: string) => (
  <ul className="space-y-3 list-inside text-right pr-4">
    {tips.map(tip => (
      <li key={tip.title}>
        <strong className={cn("font-semibold", baseColorClass)}>{tip.title}:</strong>
        <ul className="mr-4 mt-1 space-y-1 list-disc list-inside text-right">
          {tip.points.map((point, i) => <li key={i} className="text-sm text-foreground/90">{point}</li>)}
        </ul>
      </li>
    ))}
  </ul>
);

const renderSubsections = (subsections: Subsection[], baseColorClass: string) => (
   <ul className="space-y-3 list-inside text-right pr-4">
    {subsections.map(subsection => (
      <li key={subsection.title}>
        <strong className={cn("font-semibold", baseColorClass)}>{subsection.title}:</strong>
        <ul className="mr-4 mt-1 space-y-1 list-disc list-inside text-right">
          {subsection.details.map((detail, i) => <li key={i} className="text-sm text-foreground/90">{detail}</li>)}
        </ul>
      </li>
    ))}
  </ul>
);

const renderPoints = (points: string[]) => (
  <ul className="mr-0 mt-1 space-y-2 list-none text-right pr-0">
      {points.map((point, i) => <ListItem key={i}>{point}</ListItem>)}
  </ul>
);

const lifeStageSectionsData = [
  {
    id: 'teen',
    title: '1. مرحلة المراهقة',
    Icon: Activity, 
    cardClasses: "bg-rose-50 border-rose-200",
    headerClasses: "bg-rose-100",
    titleTextClass: "text-rose-700",
    buttonClasses: "text-rose-600 border-rose-300 hover:bg-rose-100",
    dialogTitleTextClass: "text-rose-700",
    info: [
      {
        title: 'التغيرات الفسيولوجية',
        Icon: Zap,
        subsections: [
          { title: 'الحيض (الدورة الشهرية)', details: ['بدء الطمث، تغيرات في الهرمونات (الإستروجين والبروجسترون).'] },
          { title: 'تطور الثديين', details: ['نمو الغدد الثديية تحت تأثير الهرمونات.'] },
          { title: 'نمو شعر العانة والإبط', details: ['بسبب زيادة الأندروجينات.'] },
          { title: 'طفرة النمو', details: ['زيادة سريعة في الطول والوزن.'] },
        ],
      },
      {
        title: 'العلامات الصحية',
        Icon: HeartPulse,
        points: [
          'انتظام الدورة الشهرية (28–35 يومًا).',
          'عدم وجود آلام شديدة (قد تشير إلى بطانة رحم مهاجرة).',
        ],
      },
      {
        title: 'التثقيف الصحي',
        Icon: BookOpenCheck,
        tips: [
          {
            title: 'التغذية',
            Icon: Apple,
            points: [
              'زيادة الحديد (لتعويض فقدان الدم في الدورة) – مثل السبانخ، اللحوم الحمراء.',
              'الكالسيوم وفيتامين D (لبناء العظام) – الحليب، البيض، الأسماك.',
            ],
          },
          {
            title: 'الرياضة',
            Icon: Bike,
            points: [
              'المشي واليوجا لتقليل تقلصات الدورة.',
              'تجنب الرياضات العنيفة أثناء الحيض.',
            ],
          },
          {
            title: 'النظافة الشخصية',
            Icon: Droplets,
            points: [
              'تغيير الفوط الصحية كل 4–6 ساعات.',
              'استخدام منتجات مناسبة (فوط، كؤوس menstruation cups).',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'pregnancy',
    title: '2. العناية بالحمل والولادة وما بعدها',
    Icon: Baby, 
    cardClasses: "bg-sky-50 border-sky-200",
    headerClasses: "bg-sky-100",
    titleTextClass: "text-sky-700",
    buttonClasses: "text-sky-600 border-sky-300 hover:bg-sky-100",
    dialogTitleTextClass: "text-sky-700",
    info: [
      {
        title: 'أ. قبل الحمل',
        Icon: CalendarCheck,
        subsections: [
          {
            title: 'التخطيط للحمل',
            details: [
              'تناول حمض الفوليك (400 ميكروغرام يوميًا) قبل الحمل بـ 3 أشهر.',
              'تجنب الكحول والتدخين.',
            ],
          },
          {
            title: 'الفحوصات',
            details: ['تحاليل الغدة الدرقية، الهيموجلوبين، الأمراض المنقولة جنسيًا.'],
          },
        ],
      },
      {
        title: 'ب. أثناء الحمل',
        Icon: Stethoscope, 
        subsections: [
           {
            title: 'العناية حسب الثلث',
            details: [
                'الثلث الأول (1–12 أسبوعًا): الغثيان الصباحي (تناول وجبات صغيرة متكررة، الزنجبيل)، تجنب اللحوم النيئة (خطر التوكسوبلازما).',
                'الثلث الثاني (13–28 أسبوعًا): زيادة الوزن الطبيعية (5–7 كجم)، تمارين كيجل لتقوية الحوض.',
                'الثلث الثالث (29–40 أسبوعًا): مراقبة سكر الحمل وضغط الدم، تحضير حقيبة الولادة.',
            ]
           },
           {
            title: 'التثقيف الوقائي',
            details: [
                'الوقاية من سكري الحمل: تقليل السكريات، زيادة الألياف.',
                'الوقاية من تسمم الحمل: قياس الضغط بانتظام، تناول البروتين الكافي.',
            ]
           }
        ],
      },
       {
        title: 'ج. الولادة',
        Icon: BedDouble,
        subsections: [
           {
            title: 'علامات الطلق الحقيقي',
            details: [
              'انقباضات منتظمة كل 5 دقائق.',
              'نزول ماء الجنين.',
            ],
          },
          {
            title: 'خيارات الولادة',
            details: ['طبيعية، قيصرية، ولادة في الماء.'],
          },
        ],
      },
      {
        title: 'د. ما بعد الولادة',
        Icon: HelpingHand,
        subsections: [
           {
            title: 'العناية بالنفس',
            details: [
              'النزيف الطبيعي (يستمر 4–6 أسابيع).',
              'تنظيف منطقة العجان بالماء الدافئ.',
            ],
          },
          {
            title: 'الرضاعة الطبيعية',
            Icon: Milk, 
            details: [
              'فوائدها: تقلص الرحم، تعزيز مناعة الطفل.',
              'تغذية الأم: شرب 3 لترات ماء يوميًا، زيادة السعرات 500 سعرة/يوم.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'menopause',
    title: '3. مرحلة سن الأمل',
    Icon: HeartPulse, 
    cardClasses: "bg-purple-50 border-purple-200",
    headerClasses: "bg-purple-100",
    titleTextClass: "text-purple-700",
    buttonClasses: "text-purple-600 border-purple-300 hover:bg-purple-100",
    dialogTitleTextClass: "text-purple-700",
    info: [
      {
        title: 'التغيرات الفسيولوجية',
        Icon: Replace,
        subsections: [
          {
            title: 'انقطاع الطمث (Menopause)',
            details: [
              'توقف الدورة الشهرية لمدة 12 شهرًا متتاليًا.',
              'انخفاض الإستروجين → هبات ساخنة، جفاف المهبل.',
            ],
          },
          {
            title: 'مخاطر صحية',
            details: [
              'هشاشة العظام (نقص الكالسيوم).',
              'أمراض القلب (بسبب انخفاض الإستروجين الواقي).',
            ],
          },
        ],
      },
      {
        title: 'العناية الصحية',
        Icon: ShieldCheck, 
        tips: [
          {
            title: 'التغذية',
            Icon: Utensils,
            points: [
              'الكالسيوم (1200 مجم/يوم) + فيتامين D.',
              'الأوميغا-3 (السلمون) لصحة القلب.',
            ],
          },
          {
            title: 'الرياضة',
            Icon: Dumbbell,
            points: [
              'تمارين المقاومة (رفع أثقال خفيفة) لمنع هشاشة العظام.',
              'المشي 30 دقيقة يوميًا.',
            ],
          },
          {
            title: 'المتابعة الطبية',
            Icon: Pill,
            points: [
              'فحص كثافة العظام (DEXA scan).',
              'العلاج الهرموني التعويضي (HRT) بعد استشارة الطبيب.',
            ],
          },
        ],
      },
    ],
  },
];


export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 text-foreground">
      <div className="w-full max-w-3xl">
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

        <section className="my-12" dir="rtl">
          <header className="text-center mb-10">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary">
              رحلة صحة المرأة من المراهقة إلى سن الأمل
            </h2>
            <p className="text-lg text-muted-foreground mt-2">
              – بإشراف الاستاذة الدكتورة عايدة عبدالرازق أستاذ صحة المرأة - كلية التمريض، جامعة المنوفية –
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {lifeStageSectionsData.map((stage) => {
              const StageIcon = stage.Icon;
              return (
                <Dialog key={stage.id}>
                  <Card className={cn("shadow-lg overflow-hidden h-full flex flex-col", stage.cardClasses)}>
                    <CardHeader className={cn("py-4 px-4 md:px-6 md:py-5", stage.headerClasses)}>
                      <CardTitle className={cn("text-2xl font-headline flex items-center justify-between w-full", stage.titleTextClass)}>
                        <div className="flex items-center gap-3">
                          <StageIcon size={32} />
                          <span>{stage.title.replace(/\s*\(.*?\)\s*/g, '')}</span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 flex-grow flex flex-col justify-between">
                        <p className="text-sm text-muted-foreground/90 mb-4">
                            نظرة عامة حول التغيرات الصحية والاحتياجات خلال {stage.title.substring(stage.title.indexOf(' ') + 1).toLowerCase()}.
                        </p>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className={cn("w-full mt-auto", stage.buttonClasses, "hover:" + stage.buttonClasses.replace("text-", "bg-").replace("-600", "-100"))}>
                             <AlignJustify size={20} />
                             <span className="mr-1">عرض التفاصيل</span>
                          </Button>
                        </DialogTrigger>
                    </CardContent>
                  </Card>

                  <DialogContent className="sm:max-w-2xl max-h-[85vh] bg-card text-right flex flex-col" dir="rtl">
                    <DialogHeader className="border-b pb-3 mb-1 sticky top-0 bg-card z-10 pt-2">
                      <DialogTitle className={cn("font-headline text-2xl text-right flex items-center gap-2", stage.dialogTitleTextClass)}>
                        <StageIcon size={32} />
                        تفاصيل: {stage.title.substring(stage.title.indexOf(' ') + 1).replace(/\s*\(.*?\)\s*/g, '')}
                      </DialogTitle>
                      <DialogDescription className="text-right text-muted-foreground">
                        معلومات شاملة حول هذه المرحلة الهامة في حياة المرأة.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-2 space-y-6 overflow-y-auto flex-grow pr-1">
                      {stage.info.map((section, index) => {
                        const SectionIcon = section.Icon;
                        return (
                          <div key={index} className="mb-4 p-3 rounded-lg border bg-background/50 shadow-sm">
                            <h3 className={cn("text-xl font-semibold mb-3 flex items-center gap-2", stage.dialogTitleTextClass)}>
                              {SectionIcon && <SectionIcon size={22} />}
                              {section.title}
                            </h3>
                            {section.description && <p className="text-sm text-muted-foreground mb-2">{section.description}</p>}
                            {section.subsections && renderSubsections(section.subsections, stage.dialogTitleTextClass)}
                            {section.points && renderPoints(section.points)}
                            {section.tips && section.tips.map((tipCategory, tipIdx) => {
                              const TipIcon = tipCategory.Icon;
                              return (
                                  <div key={tipIdx} className="mt-2">
                                    <h4 className={cn("font-semibold flex items-center gap-1 mb-1", stage.dialogTitleTextClass)}>
                                      {TipIcon && <TipIcon size={18} />}
                                      {tipCategory.title}:
                                    </h4>
                                    <ul className="space-y-1 pr-4 list-none">
                                      {tipCategory.points.map((point, i) => <ListItem key={i}>{point}</ListItem>)}
                                    </ul>
                                  </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                    <DialogFooter className="border-t pt-3 pb-2 mt-auto bg-card">
                      <DialogClose asChild>
                        <Button type="button" variant="outline" className="w-full sm:w-auto">
                          إغلاق
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              );
            })}

            <Card className="bg-emerald-50 border-emerald-200 shadow-lg overflow-hidden h-full flex flex-col">
              <CardHeader className="bg-emerald-100 py-4 px-4 md:px-6 md:py-5">
                <CardTitle className="text-2xl font-headline text-emerald-700 flex items-center gap-3">
                  <BookOpenCheck size={32} />
                  <span>نقاط رئيسية للتثقيف الصحي</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 text-emerald-800/90 flex-grow flex flex-col justify-between">
                <div>
                    <p className="text-sm text-muted-foreground/90 mb-4">
                        ملخص لأهم الإرشادات الصحية العامة التي يجب مراعاتها في مختلف مراحل حياة المرأة.
                    </p>
                    <ul className="space-y-3 list-none">
                        <ListItem>البلوغ: تعليم الفتيات عن الدورة الشهرية والنظافة.</ListItem>
                        <ListItem>الإنجاب: التشديد على الرعاية السابقة للحمل والفحوصات الدورية.</ListItem>
                        <ListItem>سن الأمل: التركيز على منع هشاشة العظام وأمراض القلب.</ListItem>
                    </ul>
                </div>
                {/* Potentially add a button here if this card were to also become a dialog, but per current structure it's direct content */}
                {/* <Button variant="outline" className="w-full mt-auto text-emerald-600 border-emerald-300 hover:bg-emerald-100">
                    اقرئي المزيد (مثال)
                </Button> */}
              </CardContent>
            </Card>
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
                <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col">
                  <CardHeader className="flex-row items-center justify-center gap-3 pb-2">
                    <CalendarDays className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl font-semibold text-primary">متابعة الدورة</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      سجلي دورتك الشهرية وتوقعي مواعيدها القادمة بدقة.
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] text-right bg-card flex flex-col">
                <DialogHeader className="border-b pb-2">
                  <DialogTitle className="font-headline text-primary">متابعة الدورة الشهرية</DialogTitle>
                  <DialogDescription>
                    أدخلي تاريخ بدء آخر دورة شهرية ومتوسط طول دورتكِ لحساب الموعد المتوقع للدورة القادمة.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 flex-grow overflow-y-auto">
                  <PeriodTracker />
                </div>
                 <DialogFooter className="border-t pt-2 mt-auto">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" className="w-full">
                        إغلاق
                        </Button>
                    </DialogClose>
                 </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col">
                  <CardHeader className="flex-row items-center justify-center gap-3 pb-2">
                    <CalendarHeart className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl font-semibold text-primary">متابعة التبويض</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      اعرفي أيام التبويض لزيادة فرص الحمل أو لتجنبه.
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] text-right bg-card flex flex-col">
                <DialogHeader className="border-b pb-2">
                  <DialogTitle className="font-headline text-primary">متابعة فترة التبويض</DialogTitle>
                  <DialogDescription>
                    أدخلي بيانات دورتكِ لتقدير يوم التبويض وفترة الخصوبة.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 flex-grow overflow-y-auto">
                 <OvulationTracker />
                </div>
                <DialogFooter className="border-t pt-2 mt-auto">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" className="w-full">
                      إغلاق
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col">
                  <CardHeader className="flex-row items-center justify-center gap-3 pb-2">
                    <Bell className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl font-semibold text-primary">تذكيرات هامة</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      عرض تذكيرات لمواعيد دورتكِ وفترة التبويض المحفوظة.
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] text-right bg-card flex flex-col">
                <DialogHeader className="border-b pb-2">
                  <DialogTitle className="font-headline text-primary">تذكيراتكِ الصحية</DialogTitle>
                  <DialogDescription>
                    هنا تظهر التواريخ الهامة بناءً على البيانات التي أدخلتيها في الأدوات الأخرى.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 flex-grow overflow-y-auto">
                  <RemindersDisplay />
                </div>
                <DialogFooter className="border-t pt-2 mt-auto">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" className="w-full">
                      إغلاق
                    </Button>
                  </DialogClose>
                </DialogFooter>
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
