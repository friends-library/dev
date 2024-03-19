import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import '@/styles/cover.css';
import '@/styles/fontawesome.css';
import Chrome from '@/components/chrome/Chrome';
import Footer from '@/components/chrome/Footer';

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <Chrome>
    <div className="pt-[70px] min-h-screen flex flex-col">
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  </Chrome>
);

export default App;
