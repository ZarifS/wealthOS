import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '../store';
import { Inter as FontSans } from "next/font/google"
import { cn } from '../../@shadcn/lib/utils';

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <div className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}

export default MyApp;
