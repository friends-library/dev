import '@/styles/globals.css';
import '@/styles/cover.css';
import '@/styles/fontawesome.css';
import { NextBgStaticCss } from 'next-bg-image';
import Chrome from '@/components/chrome/Chrome';
import Footer from '@/components/chrome/Footer';
import { LANG } from '@/lib/env';

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <html lang={LANG} className="scroll-pt-[70px] scroll-smooth">
    <head>
      <NextBgStaticCss />
    </head>
    <body>
      <Chrome>
        <div className="pt-[70px] min-h-screen flex flex-col">
          <main>{children}</main>
          <Footer />
        </div>
      </Chrome>
    </body>
  </html>
);

export default RootLayout;
