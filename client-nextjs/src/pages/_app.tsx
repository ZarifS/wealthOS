import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from 'components/toast';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main>
      <Component {...pageProps} />
      <Toaster />
    </main>
  );
}

export default MyApp;
