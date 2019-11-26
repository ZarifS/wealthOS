// Types
export const AUTH_USER = 'AUTH_USER';
export const AUTH_USER_LOADING = 'AUTH_USER_LOADING';
export const AUTH_USER_SUCCESS = 'AUTH_USER_SUCCESS';
export const AUTH_USER_FAILURE = 'AUTH_USER_FAILURE';

// Action Creators
// TO-DO: Change "auth" to login/auth
export const authUser = (email, password) => {
  return {
    type: AUTH_USER,
    payload: { email, password },
  };
};

export const authUserLoading = () => {
  return { type: AUTH_USER_LOADING, payload: {} };
};

export const authUserSuccess = (token) => {
  return { type: AUTH_USER_SUCCESS, payload: { token } };
};

export const authUserFailure = (error) => {
  return { type: AUTH_USER_FAILURE, payload: { error } };
};

export const types = {
  AUTH_USER,
  AUTH_USER_LOADING,
  AUTH_USER_SUCCESS,
  AUTH_USER_FAILURE,
};

export const actions = {
  authUser,
  authUserLoading,
  authUserSuccess,
  authUserFailure,
};
