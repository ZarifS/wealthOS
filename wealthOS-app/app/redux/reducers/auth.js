/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { types } from '../actions/auth';

// TO-DO: Change "fetch" to login/authenticate

export const fetchUserLoading = (state) => ({
  ...state,
  userIsLoading: true,
  userErrorMessage: null,
});

export const fetchUserSuccess = (state, { token }) => ({
  ...state,
  token: token,
  userIsLoading: false,
  userErrorMessage: null,
});

export const fetchUserFailure = (state, { errorMessage }) => ({
  ...state,
  user: {},
  token: null,
  userIsLoading: false,
  userErrorMessage: errorMessage,
});

/**
 * The initial values for the redux state.
 */
const INITIAL_STATE = {
  user: {},
  token: null,
  userIsLoading: false,
  userErrorMessage: null,
};

const reducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case types.FETCH_USER_LOADING:
      return {
        ...state,
        userIsLoading: true,
        userErrorMessage: null,
      };
    case types.FETCH_USER_SUCCESS:
      return {
        ...state,
        token: payload.token,
        userIsLoading: false,
        userErrorMessage: null,
      };
    case types.FETCH_USER_FAILURE:
      return {
        ...state,
        token: null,
        userIsLoading: false,
        userErrorMessage: payload.error,
      };
    default:
      return state;
  }
};

export default reducer;
