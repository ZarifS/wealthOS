import { put, call } from 'redux-saga/effects';
import { actions } from '../redux/actions/user';
import APIService from '../services/api';

export function* fetchUser({ payload }) {
  // Dispatch a redux action using `put()`
  // @see https://redux-saga.js.org/docs/basics/DispatchingActions.html
  yield put(actions.fetchUserLoading());
  try {
    const response = yield call(APIService.fetchUser, payload.token);
    yield put(actions.fetchUserSuccess(response.user));
  } catch (error) {
    let message = '';
    if (error.response !== undefined) message = error.response.data.message;
    else message = 'There was an error while retrieving user information.';
    console.log(message);
    yield put(actions.fetchUserFailure(message));
  }
}
