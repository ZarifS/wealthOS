import { takeLatest, all } from 'redux-saga/effects';
import { types as ExampleTypes } from '../redux/actions/example';
import { types as StartupTypes } from '../redux/actions/startUp';
import { fetchUser } from './exampleSaga';
import { startup } from './startUpSaga';

export default function* root() {
  yield all([
    /**
     * @see https://redux-saga.js.org/docs/basics/UsingSagaHelpers.html
     */
    // Run the startup saga when the application starts
    takeLatest(StartupTypes.START_UP, startup),
    // Call `fetchUser()` when a `FETCH_USER` action is triggered
    takeLatest(ExampleTypes.FETCH_USER, fetchUser),
  ]);
}
