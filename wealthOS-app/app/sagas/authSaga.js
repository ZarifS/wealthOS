import { put, call } from 'redux-saga/effects';
import { actions } from '../redux/actions/auth';
import APIService from '../services/api';
import NavigationService from '../services/navigation';

export function* authUser({ payload }) {
  // Dispatch a redux action using `put()`
  // @see https://redux-saga.js.org/docs/basics/DispatchingActions.html
  yield put(actions.authUserLoading());
  try {
    const response = yield call(APIService.authUser, payload.email, payload.password);
    console.log(response.token);
    yield put(actions.authUserSuccess(response.token));
  } catch (error) {
    let message = '';
    if (error.response !== undefined) message = error.response.data.message;
    else message = 'There was an error while authenticating user informations.';
    console.log(message);
    yield put(actions.authUserFailure(message));
  }
}

export function* authUserSuccess() {
  NavigationService.navigate('Main');
}
