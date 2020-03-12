import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { StatusBar } from 'react-native';
import createStore from './redux';
import RootScreen from './containers/rootScreen';
import SplashScreen from './containers/splashScreen';

const { store, persistor } = createStore();

export default class App extends Component {
  render() {
    StatusBar.setBarStyle('light-content', true);
    return (
      /**
       * @see https://github.com/reduxjs/react-redux/blob/master/docs/api/Provider.md
       */
      <Provider store={store}>
        {/**
         * PersistGate delays the rendering of the app's UI until the persisted state has been retrieved
         * and saved to redux.
         * The `loading` prop can be `null` or any react instance to show during loading (e.g. a splash screen),
         * for example `loading={<SplashScreen />}`.
         * @see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
         */}
        <PersistGate loading={<SplashScreen />} persistor={persistor}>
          <RootScreen />
        </PersistGate>
      </Provider>
    );
  }
}
