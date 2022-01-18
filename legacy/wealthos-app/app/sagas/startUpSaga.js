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
    console.log('User is logged in, navigating to Dashboard.');
    // User is already logged in. - Also do some check to see if token is valid etc.
    NavigationService.navigate('Main');
  }
  // User isn't logged in yet, ask for authentication
  else NavigationService.navigate('AuthScreen');
}
