import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from 'components/ui/toast';
import { ThemeProvider } from 'components/ui/themeProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (

    <main>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Component {...pageProps} />
        <Toaster />
      </ThemeProvider>
    </main >
  );
}

export default MyApp;
