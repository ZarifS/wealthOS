// Types
export const FETCH_USER = 'FETCH_USER';
export const FETCH_USER_LOADING = 'FETCH_USER_LOADING';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

// Action Creators
// TO-DO: Change "fetch" to login/auth
export const fetchUser = (email, password) => {
  return {
    type: FETCH_USER,
    payload: { email, password },
  };
};

export const fetchUserLoading = () => {
  return { type: FETCH_USER_LOADING, payload: {} };
};

export const fetchUserSuccess = (token) => {
  return { type: FETCH_USER_SUCCESS, payload: { token } };
};

export const fetchUserFailure = (error) => {
  return { type: FETCH_USER_FAILURE, payload: { error } };
};

export const types = {
  FETCH_USER,
  FETCH_USER_LOADING,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
};

export const actions = {
  fetchUser,
  fetchUserLoading,
  fetchUserSuccess,
  fetchUserFailure,
};
