import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import '@/styles/cover.css';

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <Component {...pageProps} />
);

export default App;
