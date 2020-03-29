import { takeLatest, all } from 'redux-saga/effects';
import { types as AuthTypes } from '../redux/actions/auth';
import { types as StartupTypes } from '../redux/actions/startUp';
import { types as UserTypes } from '../redux/actions/user';
import { authUser, authUserSuccess } from './authSaga';
import { fetchUser } from './userSaga';
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
    // Call `fetchUser()` when `FETCH_USER` action is triggered
    takeLatest(UserTypes.FETCH_USER, fetchUser),
  ]);
}
