# Table of Contents
- [Wealth-X](#wealth-x)
  * [Main Idea](#main-idea)
  * [WIKI](#wiki)
  * [Installation and Deployment Instructions (Getting Started)](#installation-and-deployment-instructions--getting-started-)
  * [Running the App](#running-the-app)
  * [Debugging App](#debugging-app)
  * [VSCode and ESLint/Prettier Setup](#vscode-and-eslint-prettier-setup)
- [Technical Overview (Client)](#technical-overview--client-)
  * [Overview](#overview)
  * [android/](#android-)
  * [ios/](#ios-)
  * [app/](#app-)
    + [app.js](#appjs)
    + [assets](#assets)
    + [components](#components)
    + [containers](#containers)
    + [navigators](#navigators)
    + [redux](#redux)
    + [actions](#actions)
    + [reducers](#reducers)
    + [store.js](#storejs)
    + [index.js](#indexjs)
    + [sagas](#sagas)
    + [services](#services)
    + [theme](#theme)

# WealthOS React Native App (Discontinued)

## WIKI 
More information on the project archeticture can be found on the Wiki. Progress on RN app is on pause until a MVP version is released via a web app. These docs are outdated.

## Installation and Deployment Instructions (Getting Started)

- Install watchman, react-native and cocopods
    - `brew install watchman`
    - `sudo npm install -g react-native-cli`
    - `sudo gem install cocoapods`
- If you are on Windows download and install Android studio,
- If you are on Mac download and install Xcode, and install the command line tools
    - `xcode-select --install`
- Go into xcode preferences -> Locations and make sure xcode version is shown beside command line tools
- `cd` into wealth-OS-server (needed for local development server).
    - `npm install`
    - `npm start`
- `cd` into wealth-OS-app,
    - `npm install`
    - `npm start`
- `cd` into ios,
    - `pod update`
    - `pod install`
- `cd` into wealth-OS-app,
    - `react-native run-ios` or `react-native run-android`

## Running the App

- Make sure you have a simulator installed from XCode - you need a Mac.
- Let Metro Bundler run to build the project
- If bundler is stuck just swipe up to leave the app and then return to it, it should begin rebuilding. Sometimes just clicking reload also does it.
- Once the app starts on the iPhone simulator and the local server is running for the backend you can login to the app using the credentials: email: jon.snow@gmail.com, password: testing.
- You will see the app login, fetch the users data from the database and showcase their current balances and bank accounts as stored in the server. This demonstrates the apps connection to the express server and database and basic app functionality.

## Debugging App

- Download React Native Debugger: [https://github.com/jhen0409/react-native-debugger](https://github.com/jhen0409/react-native-debugger)
- Once the app is running you can enable debug mode on the react-native app by pulling the developer menu on the simulator
- You will be able to see the redux actions and console for the app

## VSCode and ESLint/Prettier Setup

- Make sure eslint is installed on VSCode
- Do not install prettier on VSCode
- Once `npm install` runs both prettier and eslint should work out of the box since prettier is a terminal based command
- To run lint run `npm lint` and to fix linting problems run `npm run lint-fix`
- To run prettier (run before linting) run `npm run prettier-fix` to write to files.

# Technical Overview (Client)

- The application is built on React Native
- Uses Redux and Redux Saga to manage async actions
- Uses react-navigation for navigating between pages
- Uses styled-components for styling
- Uses ESLINT for linting and code-style management
- Uses axios to connect/send to http requests
- Built using a boilerplate for react-native: [https://github.com/thecodingmachine/react-native-boilerplate](https://github.com/thecodingmachine/react-native-boilerplate)

## Overview
```
    wealthOS-app/
    	__tests__/
    	android/
    	app/
    		assets/
    		components/
    		containers/
    		navigators
    		redux/
    		sagas/
    		services/
    		theme/
    		App.js
    	ios/
    	.buckconfig
    	.eslintignore
    	.eslintrc.json
    	.gitignore
    	.prettierrc
    	app.json
    	babel.config.js
    	index.js
    	metro.config.js
    	package.json
    	..other config files.
```
## android/

- holds all the code for the android codebase
- has the gradle file which sometimes needs to be changed
- will need to open this folder with android studio to make android specific changes, otherwise do not edit.

## ios/

- holds all the code for the ios codebase
- includes the xcode files which need to be changed when adding new dependencies, otherwise do not edit.
- includes the `Pods/` directory which handles linking most of the time

## app/

- This is the directory for the source code of the application.
- All ios and Android code is generated from this folder.
- This folder contains all javascript code.

### app.js

- This is the file that sets up the application, the redux store, redux-persist and react-navigation.
```
    import React, { Component } from 'react';
    // other imports from 
    
    const { store, persistor } = createStore();
    
    export default class App extends Component {
      render() {
        return (
          <Provider store={store}>
    ~~**~~       <PersistGate loading={<SplashScreen />} persistor={persistor}>
              <IconRegistry icons={EvaIconsPack} />
                <RootScreen />
              </ApplicationProvider>
            </PersistGate>
          </Provider>
        );
      }
    }
```
### assets

- This directory contains all the assets files (i.e. images, audio files or videos...) used by the application.

### components

- This directory contains all the dumb components
- These include all components which can be reused throughout the app and which do not have any access to the store.
- Components here should only act upon props
- Input component for example
```
    input.js
    import React, { Component } from 'react';
    import { Icon, Input as KittenInput } from 'react-native-ui-kitten';
    
    export default class Input extends Component {
      renderIcon = (style) => {
        return <Icon {...style} name={this.props.iconName} />;
      };
    
      render() {
        return (
          <KittenInput
            value={this.props.value}
            placeholder={this.props.placeholder}
            icon={this.props.renderIconFunction ? this.props.renderIconFunction : this.renderIcon}
            onChangeText={(val) => this.props.onChange(this.props.name, val)}
            onIconPress={this.props.onIconPress}
            secureTextEntry={this.props.secureTextEntry}
          />
        );
      }
    }
```
### containers

- This contains the screens of the application
- A screen can connect to the redux store
- Screens have more logic embedded in them and can also dispatch actions
- There is a root screen which basically sets up the navigation and application
```
    rootScreen.js
    import React, { Component } from 'react';
    import NavigationService from '../services/navigation';
    import AppNavigator from '../navigators/appNavigator';
    import { StyleSheet } from 'react-native';
    import { Layout } from 'react-native-ui-kitten';
    import { connect } from 'react-redux';
    import { actions as StartupActions } from '../redux/actions/startUp';
    import { ApplicationStyles } from '../theme';
    
    class RootScreen extends Component {
      componentDidMount() {
        // Run the startup saga when the application is starting
        console.log('App has started! Running startup actions..');
        this.props.startup();
      }
    
      render() {
        return (
          <Layout style={styles.container}>
            <AppNavigator
              // Initialize the NavigationService (see https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html)
              ref={(navigatorRef) => {
                NavigationService.setTopLevelNavigator(navigatorRef);
              }}
            />
          </Layout>
        );
      }
    }
    
    const styles = StyleSheet.create({
      container: {
        ...ApplicationStyles.screen.container,
      },
    });
    
    const mapDispatchToProps = (dispatch) => ({
      startup: () => dispatch(StartupActions.startUp()),
    });
    
    export default connect(null, mapDispatchToProps)(RootScreen);
```
- What this screen does is initialize the navigation so all other screens can be navigated to using the navigation service

### navigators

- This folder holds the appNavigator.js which sets up the navigation scheme for `react-navigation`
- The application uses a stack navigation
```
    appNavigator.js
    import { createAppContainer } from 'react-navigation';
    import { createStackNavigator } from 'react-navigation-stack';
    
    import AuthScreen from '../containers/authScreen';
    import SplashScreen from '../containers/splashScreen';
    import HomeScreen from '../containers/homeScreen';
    
    /**
     * The root screen contains the application's navigation.
     *
     * @see https://reactnavigation.org/docs/en/hello-react-navigation.html#creating-a-stack-navigator
     */
    const StackNavigator = createStackNavigator(
      {
        // Create the application routes here (the key is the route name, the value is the target screen)
        // See https://reactnavigation.org/docs/en/stack-navigator.html#routeconfigs
        SplashScreen: SplashScreen,
        AuthScreen: AuthScreen,
        HomeScreen: HomeScreen,
      },
      {
        // By default the application will show the splash screen
        initialRouteName: 'SplashScreen',
        // See https://reactnavigation.org/docs/en/stack-navigator.html#stacknavigatorconfig
        headerMode: 'none',
      }
    );
    
    export default createAppContainer(StackNavigator);
```
- This navigator is then referenced in the rootScreen in components to setup the navigation routes. The navigatorRef object is something that `createAppContainer` provides to the component.
```
    rootScreen.js
    ...
            <AppNavigator
              // Initialize the NavigationService
              ref={(navigatorRef) => {
                NavigationService.setTopLevelNavigator(navigatorRef);
              }}
            />
    ...
```
### redux

- This folder is broken down into `actions/` and `reducers/`  an `index.js` file to combine our reducers and configure our final store, and a `store.js` file to create our store.

### actions

- Within actions we define the action types and action creators, we then export them as objects `types` and `actions`
```
    actions/auth.js
    
    // Types
    export const AUTH_USER = 'AUTH_USER';
    export const AUTH_USER_LOADING = 'AUTH_USER_LOADING';
    export const AUTH_USER_SUCCESS = 'AUTH_USER_SUCCESS';
    export const AUTH_USER_FAILURE = 'AUTH_USER_FAILURE';
    
    // Action Creators
    // TO-DO: Change "auth" to login/auth
    export const authUser = (email, password) => {
      return {
        type: AUTH_USER,
        payload: { email, password },
      };
    };
    
    export const authUserLoading = () => {
      return { type: AUTH_USER_LOADING, payload: {} };
    };
    
    export const authUserSuccess = (token) => {
      return { type: AUTH_USER_SUCCESS, payload: { token } };
    };
    
    export const authUserFailure = (error) => {
      return { type: AUTH_USER_FAILURE, payload: { error } };
    };
    
    export const types = {
      AUTH_USER,
      AUTH_USER_LOADING,
      AUTH_USER_SUCCESS,
      AUTH_USER_FAILURE,
    };
    
    export const actions = {
      authUser,
      authUserLoading,
      authUserSuccess,
      authUserFailure,
    };
```
### reducers

- Within the reducers folder we create a reducer for each store object we need. For auth for example we create the reducers and then export it.
```
    reducers/auth.js
    import { types } from '../actions/auth';
    
    /**
     * The initial values for the redux state.
     */
    const INITIAL_STATE = {
      token: null,
      authIsLoading: false,
      authErrorMessage: null,
    };
    
    const reducer = (state = INITIAL_STATE, { type, payload }) => {
      switch (type) {
        case types.AUTH_USER_LOADING:
          return {
            ...state,
            authIsLoading: true,
            authErrorMessage: null,
          };
        case types.AUTH_USER_SUCCESS:
          return {
            ...state,
            token: payload.token,
            authIsLoading: false,
            authErrorMessage: null,
          };
        case types.AUTH_USER_FAILURE:
          return {
            ...state,
            token: null,
            authIsLoading: false,
            authErrorMessage: payload.error,
          };
        default:
          return state;
      }
    };
    
    export default reducer;
```
### store.js

- In our `store.js` file we begin by creating a presist config which works with our redux-persist package to keep a cache of our data. We can choose to blacklist certain items if we want to.
```
    store.js
    import { applyMiddleware, createStore } from 'redux';
    import { composeWithDevTools } from 'redux-devtools-extension';
    import createSagaMiddleware from 'redux-saga';
    import { persistReducer, persistStore } from 'redux-persist';
    
    import storage from 'redux-persist/lib/storage';
    
    const persistConfig = {
      key: 'root',
      storage: storage,
      /**
       * Blacklist state that we do not need/want to persist
       */
      blacklist: ['auth'],
    };
    
    export default (rootReducer, rootSaga) => {
      const middleware = [];
      const enhancers = [];
    
      // Connect the sagas to the redux store
      const sagaMiddleware = createSagaMiddleware();
      middleware.push(sagaMiddleware);
      enhancers.push(applyMiddleware(...middleware));
    
      // Redux persist
      const persistedReducer = persistReducer(persistConfig, rootReducer);
    
      const store = createStore(persistedReducer, composeWithDevTools(...enhancers));
      const persistor = persistStore(store);
    
      // Kick off the root saga
      sagaMiddleware.run(rootSaga);
    
      return { store, persistor };
    };
```
- In the exported function we take a rootReducer and rootSaga (both of which is provided when this function is called in the `index.js` file.
- The function basically sets up the reducers, redux-sage and you can also add any other middleware like loggers etc. into this function.
- We then create the store, the persister for redux-persist and start the saga to begin running.
- We then return a object containing the store and persister which the function will make.

### index.js

- In the index we combine our reducers together and configure the store. This is the default function which basically creates the store for us by calling the function created in `store.js` which returns the `{store, persistor}` object
```
    import { combineReducers } from 'redux';
    import configureStore from './store';
    import rootSaga from '../sagas';
    import authReducer from './reducers/auth';
    
    export default () => {
      const rootReducer = combineReducers({
        /**
         * Register your reducers here.
         * @see https://redux.js.org/api-reference/combinereducers
         */
        auth: authReducer,
      });
    
      return configureStore(rootReducer, rootSaga);
    };
```
- This function is then referenced in the `App.js` file to pass the store into the `<Provider store={store}>` component and pass in the persistor in the `<PersistGate loading={<SplashScreen />} persistor={persistor}>` component.

### sagas

- This directory contains the sagas of the application. Sagas will for example connect to an API to fetch data, perform actions, etc.
- Sagas are a redux extension which basically allows the application to do async calls using dispatch in a clean and predictable manner
- A example saga is the startUp saga which handles actions that should occur when the application starts up
```
    startUpSaga.js
    import NavigationService from '../services/navigation';
    import { select } from 'redux-saga/effects';
    
    // Gets a slice of the state using saga
    const getAuthToken = (state) => {
      return state.auth.token;
    };
    
    /**
     * The startup saga is the place to define behavior to execute when the application starts.
     */
    export function* startup() {
      // Dispatch a redux action using `put()`
      // @see https://redux-saga.js.org/docs/basics/DispatchingActions.html
    
      // Add more operations you need to do at startup here
      // ...
    
      const token = yield select(getAuthToken);
      if (token) {
        // User is already logged in. - Also do some check to see if token is valid etc.
        NavigationService.navigateAndReset('HomeScreen');
      }
      // User isn't logged in yet, ask for authentication
      else NavigationService.navigateAndReset('AuthScreen');
    }
```
- This saga is then added into the rootSaga in the `index.js` file alongside other sagas, similar to a redux reducer which will take any actionType defined by the `redux/actions` and then call a appropriate saga for it
```
    import { takeLatest, all } from 'redux-saga/effects';
    import { types as AuthTypes } from '../redux/actions/auth';
    import { types as StartupTypes } from '../redux/actions/startUp';
    import { authUser, authUserSuccess } from './authSaga';
    import { startup } from './startUpSaga';
    
    export default function* root() {
      yield all([
        /**
         * @see https://redux-saga.js.org/docs/basics/UsingSagaHelpers.html
         */
        // Run the startup saga when the application starts
        takeLatest(StartupTypes.START_UP, startup),
        // Call `authUser()` when a `AUTH_USER` action is triggered
        takeLatest(AuthTypes.AUTH_USER, authUser),
        takeLatest(AuthTypes.AUTH_USER_SUCCESS, authUserSuccess),
      ]);
    }
```
- For example when the type defined in `redux/actions/startUp` called `START_UP` is sent to the root, the function will call the startup saga function

### services

- This directory contains application services, for example services to connect the application to APIs
- Having the services directory helps define all API calls and connections to a the API service and allows other places in the app to use it easily without having to import any other packages
- An example for the API service
```
    api.js
    import axios from 'axios';
    
    const api = axios.create({
      /**
       * Import the config from the App/Config/index.js file later
       */
      baseURL: 'http://localhost:5000',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    const authUser = async (email, password) => {
      console.log('Calling /auth/login with:', email, password);
      const result = await api.post('/auth/login', { email, password });
      return result.data;
    };
    
    export default {
      authUser,
    };
```
- This service can be referenced elsewhere in the app easily like in the `authSaga` functions
```
    import { put, call } from 'redux-saga/effects';
    import { actions } from '../redux/actions/auth';
    import APIService from '../services/api';
    import NavigationService from '../services/navigation';
    
    
    export function* authUser({ payload }) {
     ...
     try {
     const response = yield call(APIService.authUser, payload.email, payload.password);
    ...
```
- Here the call function call the `authUser` api function available from the service with email and password, the service does the api call and then returns the response/error to the saga.

### theme

- This folder holds the styling and theming components for the app
- An example is the `colors.js` file which includes the color scheme for the app
```
    colors.js
    /**
     * This file contains the application's colors.
     *
     * Define color here instead of duplicating them throughout the components.
     * That allows to change them more easily later on.
     */
    
    export default {
      // Dark Color Scheme
      transparent: 'rgba(0,0,0,0)',
      // Main app background color
      background: '#1e2329',
      // Text that are directly ontop of background
      onBackground: '#fcfcfc',
      // surface - content, cards ontop of background
      surface: '#393e46',
      // Text that are directly ontop of a surface
      onSurface: '#eeeeee',
      // The two accent colors
      primary: '#4ecca3',
      secondary: '#e3b04b',
      // Error colors
      error: '#dc3545',
    };
```
- The files are all made available through the `index.js` file
```
    index.js
    import Colors from './colors';
    import Fonts from './fonts';
    import Metrics from './metrics';
    import Images from './images';
    import ApplicationStyles from './applicationStyles';
    import Helpers from './helpers';
    
    export { Colors, Fonts, Images, Metrics, ApplicationStyles, Helpers };
```
- These can then be referenced easily in other parts of the app with something like `import { Colors, Fonts } from '../theme';` and then used like `background-color: ${Colors.surface};`
