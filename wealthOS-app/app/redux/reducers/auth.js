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
    default:
      return state;
  }
};

export default reducer;
