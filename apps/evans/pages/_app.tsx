import Script from 'next/script';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import '@/styles/cover.css';
import Chrome from '@/components/chrome/Chrome';

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <Script
      src="https://kit.fontawesome.com/597740db7b.js"
      strategy="beforeInteractive"
    ></Script>
    <Chrome>
      <Component {...pageProps} />
    </Chrome>
  </>
);

export default App;
