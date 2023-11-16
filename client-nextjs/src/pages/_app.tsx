import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '../store';
import { Inter as FontSans } from "next/font/google"
import { cn } from 'utils';
import { Toaster } from 'components/toast';

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <main className={cn(
        "font-sans antialiased",
        fontSans.variable
      )}>
        <Component {...pageProps} />
        <Toaster />
      </main>
    </Provider>
  );
}

export default MyApp;
