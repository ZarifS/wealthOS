import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '../store';
import { Toaster } from 'components/toast';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <main>
        <Component {...pageProps} />
        <Toaster />
      </main>
    </Provider>
  );
}

export default MyApp;
