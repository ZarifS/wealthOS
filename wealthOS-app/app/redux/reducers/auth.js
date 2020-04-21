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
  registrationErrorMessage: null,
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
        registrationErrorMessage: null,
        showRegistration: true,
        registrationSucess: false,
      };
    case types.REGISTER_USER_LOADING:
      return {
        ...state,
        registerIsLoading: true,
        registerErrorMessage: null,
        showRegistration: false,
      };
    case types.REGISTER_USER_SUCCESS:
      return {
        ...state,
        registerIsLoading: false,
        registerErrorMessage: null,
        registrationSucess: true,
      };
    case types.REGISTER_USER_FAILURE:
      return {
        ...state,
        registerIsLoading: false,
        registerErrorMessage: payload.error,
      };
    default:
      return state;
  }
};

export default reducer;
