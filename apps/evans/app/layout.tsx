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
      <link
        rel="icon"
        href={`/images/icons/favicon-32x32.${LANG}.png`}
        type="image/png"
      />
      {[48, 72, 96, 144, 192, 256, 384, 512].map((size) => (
        <link
          key={size}
          rel="apple-touch-icon"
          sizes={`${size}x${size}`}
          href={`/images/icons/icon-${size}x${size}.${LANG}.png`}
        />
      ))}
    </head>
    <body>
      <Chrome>
        <div className="pt-[70px] min-h-screen flex flex-col">
          <main className="grow flex flex-col">{children}</main>
          <Footer />
        </div>
      </Chrome>
    </body>
  </html>
);

export default RootLayout;
