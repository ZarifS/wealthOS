/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { types } from '../actions/user';

/**
 * The initial values for the redux state.
 */
const INITIAL_STATE = {
  user: null,
  fetchUserIsLoading: false,
  fetchUserErrorMessage: null,
};

const reducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case types.FETCH_USER_LOADING:
      return {
        ...state,
        fetchUserIsLoading: true,
        fetchUserErrorMessage: null,
      };
    case types.FETCH_USER_SUCCESS:
      return {
        ...state,
        user: payload.user,
        fetchUserIsLoading: false,
        fetchUserErrorMessage: null,
      };
    case types.FETCH_USER_FAILURE:
      return {
        ...state,
        user: null,
        fetchUserIsLoading: false,
        fetchUserErrorMessage: payload.error,
      };
    default:
      return state;
  }
};

export default reducer;
