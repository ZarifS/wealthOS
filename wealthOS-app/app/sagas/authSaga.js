import { put, call } from 'redux-saga/effects';
import { actions } from '../redux/actions/auth';
import APIService from '../services/api';
import NavigationService from '../services/navigation';

/**
 * A saga can contain multiple functions.
 *
 * This example saga contains only one to auth fake user informations.
 * Feel free to remove it.
 */
export function* authUser({ payload }) {
  // Dispatch a redux action using `put()`
  // @see https://redux-saga.js.org/docs/basics/DispatchingActions.html
  yield put(actions.authUserLoading());
  try {
    const response = yield call(APIService.authUser, payload.email, payload.password);
    console.log(response.token);
    yield put(actions.authUserSuccess(response.token));
  } catch (error) {
    const message =
      error.response.data.message || 'There was an error while authing user informations.';
    console.log(message);
    yield put(actions.authUserFailure(message));
  }
}

export function* authUserSuccess() {
  NavigationService.navigate('HomeScreen');
}
