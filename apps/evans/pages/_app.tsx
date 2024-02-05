import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import '@/styles/cover.css';
import '@/styles/fontawesome.css';
import Chrome from '@/components/chrome/Chrome';

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <Chrome>
    <Component {...pageProps} />
  </Chrome>
);

export default App;
