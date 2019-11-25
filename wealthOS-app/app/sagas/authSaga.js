import { put, call } from 'redux-saga/effects';
import { actions } from '../redux/actions/auth';
import api from '../services/api';

/**
 * A saga can contain multiple functions.
 *
 * This example saga contains only one to fetch fake user informations.
 * Feel free to remove it.
 */
export function* fetchUser({ payload }) {
  // Dispatch a redux action using `put()`
  // @see https://redux-saga.js.org/docs/basics/DispatchingActions.html
  yield put(actions.fetchUserLoading());

  const response = yield call(api.fetchUser, payload.email, payload.password);
  if (response) {
    yield put(actions.fetchUserSuccess(response.token));
  } else {
    yield put(actions.fetchUserFailure('There was an error while fetching user informations.'));
  }
}
