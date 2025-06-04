
import { ClientQnaFormWrapper } from '@/components/client-qna-form-wrapper';
import { Feather } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 text-foreground">
      <div className="w-full max-w-2xl">
        <header className="mb-8 text-center">
          <div 
            className="inline-flex items-center justify-center gap-x-4 bg-white/80 text-primary py-4 px-6 rounded-2xl shadow-lg"
          >
            {/* This will appear on the far left visually in RTL (end of flex row) */}
            <Feather size={36} className="text-primary" /> 
            
            {/* This will be in the middle */}
            <h1 className="font-headline text-3xl sm:text-4xl font-bold text-center">
              صحتكِ تهمنا – إشراف أ.د/ عايدة عبدالرازق
            </h1>

            {/* This will appear on the far right visually in RTL (start of flex row) */}
            <Image
              src="https://be13a6bfb72b1843b287a4c59c4f4174.cdn.bubble.io/f1749070664202x663207571008088400/8624f5b1-c5a3-438a-bbfa-4c1deda79052.jpg"
              alt="أ.د/ عايدة عبدالرازق"
              width={72}
              height={72}
              className="rounded-full border-2 border-white shadow-sm object-cover"
              data-ai-hint="doctor portrait"
              priority
            />
          </div>
        </header>
        <ClientQnaFormWrapper />
      </div>
    </main>
  );
}
