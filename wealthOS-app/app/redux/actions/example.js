// Types
export const FETCH_USER = 'FETCH_USER';
export const FETCH_USER_LOADING = 'FETCH_USER_LOADING';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

// Action Creators
export const fetchUser = () => {
  return {
    type: FETCH_USER,
    payload: {},
  };
};

export const fetchUserLoading = () => {
  return { type: FETCH_USER_LOADING, payload: {} };
};

export const fetchUserSuccess = (user) => {
  return { type: FETCH_USER_SUCCESS, payload: { user } };
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
