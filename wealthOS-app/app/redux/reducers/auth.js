/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { types } from '../actions/auth';

/**
 * The initial values for the redux state.
 */
const INITIAL_STATE = {
  token: null,
  authIsLoading: false,
  authErrorMessage: null,
  registrationIsLoading: false,
  registrationErrorMessage: [],
  showRegistration: true,
  registrationSucess: false,
};

const reducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case types.AUTH_USER_LOADING:
      return {
        ...state,
        authIsLoading: true,
        authErrorMessage: null,
      };
    case types.AUTH_USER_SUCCESS:
      return {
        ...state,
        token: payload.token,
        authIsLoading: false,
        authErrorMessage: null,
      };
    case types.AUTH_USER_FAILURE:
      return {
        ...state,
        token: null,
        authIsLoading: false,
        authErrorMessage: payload.error,
      };
    case types.REGISTRATION_BEGIN:
      return {
        ...state,
        registrationIsLoading: false,
        registrationErrorMessage: [],
        showRegistration: true,
        registrationSucess: false,
      };
    case types.REGISTER_USER_LOADING:
      return {
        ...state,
        registrationIsLoading: true,
        registrationErrorMessage: [],
        showRegistration: false,
      };
    case types.REGISTER_USER_SUCCESS:
      return {
        ...state,
        registrationIsLoading: false,
        registrationErrorMessage: [],
        registrationSucess: true,
      };
    case types.REGISTER_USER_FAILURE:
      return {
        ...state,
        registrationIsLoading: false,
        registrationErrorMessage: payload.error,
      };
    default:
      return state;
  }
};

export default reducer;
