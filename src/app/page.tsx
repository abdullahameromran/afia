
import {
  Baby, Stethoscope, BedDouble, HelpingHand, HeartPulse, BookOpenCheck, Activity,
  Flower2, Heart, Phone, Sparkles, CalendarDays, CalendarHeart, Bell, Users2, Leaf, Utensils, Bike, Droplets, BookOpen, ClipboardCheck, Milk, Sunrise, Replace, ShieldAlert, Pill, ListChecks, Route, Milestone, Brain, CheckCircle, ShieldCheck, GitMerge, Zap, Flame, Apple, GraduationCap, Dumbbell, WashingMachine, CalendarPlus, HeartHandshake, ThermometerSun, Waves, Info, Newspaper, AlignJustify, CalendarCheck,
} from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ShadcnCardDescription } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter,
} from '@/components/ui/dialog';
import { PeriodTracker } from '@/components/period-tracker';
import { OvulationTracker } from '@/components/ovulation-tracker';
import { RemindersDisplay } from '@/components/reminders-display';
import { ReviewsDisplay } from '@/components/reviews-display';
import { Button } from '@/components/ui/button';
import type { HealthTip, Subsection, StageSection } from '@/lib/lifeStagesData';
import { lifeStagesData as originalLifeStageSectionsData } from '@/lib/lifeStagesData';
import { cn } from '@/lib/utils';
import { ClientQnaFormWrapper } from '@/components/client-qna-form-wrapper';


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


export default function HomePage() {
  // Prepare data for the 3x2 grid
  const displayCardsData = [
    {
      id: originalLifeStageSectionsData?.[0]?.id || 'puberty',
      type: 'dialog' as const,
      title: (originalLifeStageSectionsData?.[0]?.label)?.replace(/\s*\(.*?\)\s*/g, '') || 'مرحلة المراهقة',
      Icon: Activity,
      cardClasses: "bg-rose-50 border-rose-200",
      headerClasses: "bg-rose-100",
      titleTextClass: "text-rose-700",
      buttonClasses: "text-rose-600 border-rose-300 hover:bg-rose-100",
      dialogTitleTextClass: "text-rose-700",
      shortDescriptionOnCard: "نظرة عامة حول التغيرات الصحية والاحتياجات خلال مرحلة المراهقة.",
      dialogDescriptionText: "معلومات شاملة حول هذه المرحلة الهامة في حياة المرأة.",
      dialogInfo: originalLifeStageSectionsData?.[0]?.info || [],
    },
    {
      id: 'duringPregnancyCare',
      type: 'dialog' as const,
      title: 'العناية أثناء الحمل',
      Icon: Stethoscope,
      cardClasses: "bg-sky-50 border-sky-200",
      headerClasses: "bg-sky-100",
      titleTextClass: "text-sky-700",
      buttonClasses: "text-sky-600 border-sky-300 hover:bg-sky-100",
      dialogTitleTextClass: "text-sky-700",
      shortDescriptionOnCard: "معلومات وتوصيات لمتابعة الحمل بشكل صحي.",
      dialogDescriptionText: "نصائح وإرشادات للعناية بصحتك خلال فترة الحمل.",
      dialogInfo: originalLifeStageSectionsData?.[1]?.info?.[0] ? [originalLifeStageSectionsData[1].info[0]] : [],
    },
    {
      id: 'childbirthCare',
      type: 'dialog' as const,
      title: 'العناية أثناء الولادة',
      Icon: BedDouble,
      cardClasses: "bg-teal-50 border-teal-200",
      headerClasses: "bg-teal-100",
      titleTextClass: "text-teal-700",
      buttonClasses: "text-teal-600 border-teal-300 hover:bg-teal-100",
      dialogTitleTextClass: "text-teal-700",
      shortDescriptionOnCard: "استعدادات ومعلومات هامة لمرحلة الولادة.",
      dialogDescriptionText: "معلومات حول علامات الولادة وخياراتها المتاحة.",
      dialogInfo: originalLifeStageSectionsData?.[1]?.info?.[1] ? [originalLifeStageSectionsData[1].info[1]] : [],
    },
    {
      id: 'postnatalCare',
      type: 'dialog' as const,
      title: 'العناية بعد الولادة',
      Icon: HelpingHand,
      cardClasses: "bg-amber-50 border-amber-200",
      headerClasses: "bg-amber-100",
      titleTextClass: "text-amber-700",
      buttonClasses: "text-amber-600 border-amber-300 hover:bg-amber-100",
      dialogTitleTextClass: "text-amber-700",
      shortDescriptionOnCard: "إرشادات للتعافي ورعاية المولود الجديد.",
      dialogDescriptionText: "إرشادات هامة للعناية بنفسكِ وبمولودكِ في فترة النفاس.",
      dialogInfo: originalLifeStageSectionsData?.[1]?.info?.[2] ? [originalLifeStageSectionsData[1].info[2]] : [],
    },
    {
      id: originalLifeStageSectionsData?.[2]?.id || 'menopause',
      type: 'dialog' as const,
      title: (originalLifeStageSectionsData?.[2]?.label)?.replace(/\s*\(.*?\)\s*/g, '') || 'مرحلة سن الأمل',
      Icon: HeartPulse,
      cardClasses: "bg-purple-50 border-purple-200",
      headerClasses: "bg-purple-100",
      titleTextClass: "text-purple-700",
      buttonClasses: "text-purple-600 border-purple-300 hover:bg-purple-100",
      dialogTitleTextClass: "text-purple-700",
      shortDescriptionOnCard: "نظرة عامة حول التغيرات الصحية والاحتياجات خلال مرحلة سن الأمل.",
      dialogDescriptionText: "معلومات شاملة حول هذه المرحلة المتقدمة في حياة المرأة.",
      dialogInfo: originalLifeStageSectionsData?.[2]?.info || [],
    },
    {
      id: 'keyPoints',
      type: 'infoCard' as const,
      title: 'نقاط رئيسية للتثقيف الصحي',
      Icon: BookOpenCheck,
      cardClasses: "bg-emerald-50 border-emerald-200",
      headerClasses: "bg-emerald-100",
      titleTextClass: "text-emerald-700",
      descriptionText: "ملخص لأهم الإرشادات الصحية العامة التي يجب مراعاتها في مختلف مراحل حياة المرأة.",
      contentPoints: originalLifeStageSectionsData.reduce((acc, stage) => {
        if (stage.generalSummaryPoints) {
          acc.push(...stage.generalSummaryPoints);
        }
        return acc;
      }, [] as string[]),
    }
  ];


  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 text-foreground">
      <div className="w-full max-w-5xl">
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
            إعداد: أ.د/ عايدة عبدالرازق
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
              إعداد: الأستاذة الدكتورة عايدة عبدالرازق أستاذ صحة المرأة - كلية التمريض، جامعة المنوفية
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {displayCardsData.map((card) => {
              const CardIcon = card.Icon;
              if (card.type === 'infoCard') {
                return (
                    <Card key={card.id} className={cn("shadow-lg overflow-hidden h-full flex flex-col", card.cardClasses)}>
                        <CardHeader className={cn("py-4 px-4 md:px-6 md:py-5 flex-col items-center text-center", card.headerClasses)}>
                            <CardIcon size={32} className={cn("mb-2", card.titleTextClass)} />
                            <CardTitle className={cn("text-xl font-headline", card.titleTextClass)}>
                                <span>{card.title}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 md:p-6 text-emerald-800/90 flex-grow flex flex-col justify-between">
                            <div>
                                <ShadcnCardDescription className="text-sm text-muted-foreground/90 mb-4 leading-relaxed text-center">
                                    {card.descriptionText}
                                </ShadcnCardDescription>
                                <ul className="space-y-2 list-none">
                                    {(card.contentPoints || []).map((point, idx) => <ListItem key={idx}>{point}</ListItem>)}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                );
              }

              // Dialog card type
              return (
                <Dialog key={card.id}>
                  <Card className={cn("shadow-lg overflow-hidden h-full flex flex-col", card.cardClasses)}>
                    <CardHeader className={cn("py-4 px-4 md:px-6 md:py-5 flex-col items-center text-center", card.headerClasses)}>
                       <CardIcon size={32} className={cn("mb-2", card.titleTextClass)} />
                      <CardTitle className={cn("text-xl font-headline", card.titleTextClass)}>
                          <span>{card.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 flex-grow flex flex-col justify-between">
                        <ShadcnCardDescription className="text-sm text-muted-foreground/90 mb-4 leading-relaxed text-center">
                            {card.shortDescriptionOnCard}
                        </ShadcnCardDescription>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className={cn("w-full mt-auto", card.buttonClasses, "hover:" + card.buttonClasses?.replace("text-", "bg-").replace(/-(600|700)/, "-100"))}>
                             <AlignJustify size={18} />
                             <span className="mr-1">عرض التفاصيل</span>
                          </Button>
                        </DialogTrigger>
                    </CardContent>
                  </Card>

                  <DialogContent className="sm:max-w-2xl max-h-[85vh] bg-card text-right flex flex-col" dir="rtl">
                    <DialogHeader className="border-b pb-3 mb-1 sticky top-0 bg-card z-10 pt-2">
                      <DialogTitle className={cn("font-headline text-2xl text-right flex items-center gap-2", card.dialogTitleTextClass)}>
                        <CardIcon size={32} />
                        تفاصيل: {card.title}
                      </DialogTitle>
                      <DialogDescription className="text-right text-muted-foreground">
                        {card.dialogDescriptionText}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="py-2 space-y-6 overflow-y-auto flex-grow pr-1">
                      {card.dialogInfo?.map((section, index) => {
                        const SectionIcon = section.Icon; // Keep Icon if it exists for subsections in data
                        return (
                          <div key={index} className="mb-4 p-3 rounded-lg border bg-background/50 shadow-sm">
                            <h3 className={cn("text-xl font-semibold mb-3 flex items-center gap-2", card.dialogTitleTextClass)}>
                              {SectionIcon && <SectionIcon size={22} />}
                              {section.title}
                            </h3>
                            {section.description && <p className="text-sm text-muted-foreground mb-2">{section.description}</p>}
                            {section.subsections && renderSubsections(section.subsections, card.dialogTitleTextClass || "text-primary")}
                            {section.points && renderPoints(section.points)}
                            {section.tips && section.tips.map((tipCategory, tipIdx) => {
                              // const TipIcon = tipCategory.Icon; // Assuming tips might have icons
                              return (
                                  <div key={tipIdx} className="mt-2">
                                    <h4 className={cn("font-semibold flex items-center gap-1 mb-1", card.dialogTitleTextClass || "text-primary")}>
                                      {/* {TipIcon && <TipIcon size={18} />} */}
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
          </div>
        </section>

        <ClientQnaFormWrapper />

        <ReviewsDisplay />

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
                    <ShadcnCardDescription className="text-sm text-muted-foreground leading-relaxed">
                      سجلي دورتك الشهرية وتوقعي مواعيدها القادمة بدقة.
                    </ShadcnCardDescription>
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
                 <DialogFooter className="border-t pt-2 mt-auto bg-card">
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
                    <ShadcnCardDescription className="text-sm text-muted-foreground leading-relaxed">
                      اعرفي أيام التبويض لزيادة فرص الحمل أو لتجنبه.
                    </ShadcnCardDescription>
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
                <DialogFooter className="border-t pt-2 mt-auto bg-card">
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
                    <ShadcnCardDescription className="text-sm text-muted-foreground leading-relaxed">
                      عرض تذكيرات لمواعيد دورتكِ وفترة التبويض المحفوظة.
                    </ShadcnCardDescription>
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
                <DialogFooter className="border-t pt-2 mt-auto bg-card">
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
