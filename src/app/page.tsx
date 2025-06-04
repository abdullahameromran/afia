import { QnaForm } from '@/components/qna-form';
import { Feather } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 text-foreground">
      <div className="w-full max-w-2xl">
        <header className="mb-8 text-center">
          <div 
            className="inline-flex items-center gap-3 bg-white/80 text-primary py-4 px-6 rounded-2xl shadow-lg"
          >
            <Feather size={36} className="text-primary" />
            <h1 className="font-headline text-3xl sm:text-4xl font-bold">
              صحتكِ تهمنا – إشراف أ.د/ عايدة عبدالرازق
            </h1>
          </div>
        </header>
        <QnaForm />
      </div>
    </main>
  );
}
