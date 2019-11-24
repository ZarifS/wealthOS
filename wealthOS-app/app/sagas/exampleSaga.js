import { put } from 'redux-saga/effects';
import { actions } from '../redux/actions/example';

/**
 * A saga can contain multiple functions.
 *
 * This example saga contains only one to fetch fake user informations.
 * Feel free to remove it.
 */
export function* fetchUser() {
  // Dispatch a redux action using `put()`
  // @see https://redux-saga.js.org/docs/basics/DispatchingActions.html
  yield put(actions.fetchUserLoading());

  // Fetch user informations from an API - faked
  // const user = yield call(userService.fetchUser)

  const user = {
    _id: '5dd5ef2b028f11180ef067f2',
    firstName: 'Jon',
    lastName: 'Snow',
    email: 'jon.snow@gmail.com',
  };

  if (user) {
    yield put(actions.fetchUserSuccess(user));
  } else {
    yield put(actions.fetchUserFailure('There was an error while fetching user informations.'));
  }
}
