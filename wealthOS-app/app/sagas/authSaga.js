import { put, call } from 'redux-saga/effects';
import { actions } from '../redux/actions/auth';
import APIService from '../services/api';
import NavigationService from '../services/navigation';

export function* authUser({ payload }) {
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

// Add register user
export function* registerUser({ payload }) {
  yield put(actions.registerUserLoading());
  try {
    yield call(
      APIService.registerUser,
      payload.firstName,
      payload.lastName,
      payload.email,
      payload.password,
      payload.password2
    );
    yield put(actions.registerUserSuccess());
  } catch (error) {
    // A list containing error messages.
    const errors = [];
    console.log(error.response);
    if (error.response) {
      error.response.data.map((error) => errors.push(error.message));
    }
    yield put(actions.registerUserFailure(errors));
  }
}

export function* authUserSuccess() {
  NavigationService.navigate('Main');
}
