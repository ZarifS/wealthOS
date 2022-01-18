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
  user: undefined,
  fetchUserIsLoading: false,
  userErrorMessage: null,
  accounts: [],
  transactions: [],
};

const reducer = (state = INITIAL_STATE, { type, payload }) => {
  let userAccounts;
  let accounts;
  switch (type) {
    case types.FETCH_USER_LOADING:
      return {
        ...state,
        fetchUserIsLoading: true,
        userErrorMessage: null,
      };
    case types.FETCH_USER_SUCCESS:
      accounts = [];
      userAccounts = payload.user.accounts;
      for (const institution in userAccounts) {
        userAccounts[institution].map((account) => accounts.push(account));
      }
      return {
        ...state,
        user: {
          id: payload.user.id,
          firstName: payload.user.firstName,
          lastName: payload.user.lastName,
          email: payload.user.email,
          links: payload.user.links,
          balance: payload.user.balance,
        },
        accounts: accounts,
        transactions: payload.user.transactions,
        fetchUserIsLoading: false,
        userErrorMessage: null,
      };
    case types.FETCH_USER_FAILURE:
      return {
        ...state,
        user: undefined,
        accounts: [],
        transactions: [],
        fetchUserIsLoading: false,
        userErrorMessage: payload.error,
      };
    default:
      return state;
  }
};

export default reducer;
