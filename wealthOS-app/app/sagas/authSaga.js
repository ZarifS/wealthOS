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
    const response = yield call(
      APIService.registerUser,
      payload.firstName,
      payload.lastName,
      payload.email,
      payload.password,
      payload.password2
    );
    if (response.status === 200) {
      yield put(actions.registerUserSuccess());
    }
  } catch (error) {
    console.log(error.response);
    let message = '';
    if (error.response !== undefined) message = error.response.data.message;
    else message = 'There was an error while registering your account. Please try again later.';
    yield put(actions.registerUserFailure(message));
  }
}

export function* authUserSuccess() {
  NavigationService.navigate('Main');
}
