
import { ClientQnaFormWrapper } from '@/components/client-qna-form-wrapper';
import { Heart, Phone } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 text-foreground">
      <div className="w-full max-w-2xl">
        <header className="mb-8 text-center">
          <div 
            className="inline-flex items-center justify-center gap-x-4 bg-white/80 text-primary py-4 px-6 rounded-2xl shadow-lg"
          >
            <Image
              src="https://be13a6bfb72b1843b287a4c59c4f4174.cdn.bubble.io/f1749070664202x663207571008088400/8624f5b1-c5a3-438a-bbfa-4c1deda79052.jpg"
              alt="أ.د/ عايدة عبدالرازق"
              width={72}
              height={72}
              className="rounded-full border-2 border-white shadow-sm object-cover"
              data-ai-hint="doctor portrait"
              priority
            />
            
            <h1 className="font-headline text-3xl sm:text-4xl font-bold text-center">
              صحتكِ تهمنا
            </h1>

            <Heart size={36} className="text-primary" /> 
          </div>
        </header>

        <section className="mb-8 p-6 bg-card rounded-xl shadow-lg text-center">
          <p className="text-lg leading-relaxed mb-6">
            يهدف هذا التطبيق لتقديم معلومات ودعم في كل ما يخص صحة المرأة، بما في ذلك الحمل والولادة، العناية بعد الولادة، تنظيم الأسرة، وغيرها من المواضيع الهامة. صحتكِ هي أولويتنا.
          </p>
          <p className="text-md font-semibold text-primary mb-3">
            تحت إشراف: أ.د/ عايدة عبدالرازق
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            أستاذ صحة المرأة - كلية التمريض، جامعة المنوفية
          </p>
          <div className="flex items-center justify-center gap-2 text-primary font-semibold">
            <Phone size={20} />
            <span>للتواصل: 01205342194</span>
          </div>
        </section>

        <ClientQnaFormWrapper />
      </div>
    </main>
  );
}
