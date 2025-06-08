
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Script from 'next/script'; // Import the Script component

export const metadata: Metadata = {
  title: 'Afia Balsemak - صحتكِ تهمنا',
  description: 'تطبيق للإجابة على أسئلة صحة المرأة بإشراف أ.د/ عايدة عبدالرازق',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning={true} className="font-body antialiased bg-gradient-to-br from-[#FCE4EC] to-[#F8BBD0]">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "rwabuhk9fl");
          `}
        </Script>
      </body>
    </html>
  );
}
