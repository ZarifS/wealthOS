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
  try {
    const response = yield call(api.fetchUser, payload.email, payload.password);
    console.log(response.token);
    yield put(actions.fetchUserSuccess(response.token));
  } catch (error) {
    const message =
      error.response.data.message || 'There was an error while fetching user informations.';
    console.log(message);
    yield put(actions.fetchUserFailure(message));
  }
}
