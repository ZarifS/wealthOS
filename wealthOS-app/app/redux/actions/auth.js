// Types
export const AUTH_USER = 'AUTH_USER';
export const AUTH_USER_LOADING = 'AUTH_USER_LOADING';
export const AUTH_USER_SUCCESS = 'AUTH_USER_SUCCESS';
export const AUTH_USER_FAILURE = 'AUTH_USER_FAILURE';
export const REGISTRATION_BEGIN = 'REGISTRATION_BEGIN';
export const REGISTER_USER = 'REGISTER_USER';
export const REGISTER_USER_LOADING = 'REGISTER_USER_LOADING';
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_FAILURE = 'REGISTER_USER_FAILURE';

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

export const registrationBegin = () => {
  return {
    type: REGISTRATION_BEGIN,
    payload: {},
  };
};

export const registerUser = (firstName, lastName, email, password, password2) => {
  return {
    type: REGISTER_USER,
    payload: { firstName, lastName, email, password, password2 },
  };
};

export const registerUserLoading = () => {
  return { type: REGISTER_USER_LOADING, payload: {} };
};

export const registerUserSuccess = () => {
  return { type: REGISTER_USER_SUCCESS, payload: {} };
};

export const registerUserFailure = (error) => {
  return { type: REGISTER_USER_FAILURE, payload: { error } };
};

export const types = {
  AUTH_USER,
  AUTH_USER_LOADING,
  AUTH_USER_SUCCESS,
  AUTH_USER_FAILURE,
  REGISTRATION_BEGIN,
  REGISTER_USER,
  REGISTER_USER_LOADING,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILURE,
};

export const actions = {
  authUser,
  authUserLoading,
  authUserSuccess,
  authUserFailure,
  registrationBegin,
  registerUser,
  registerUserLoading,
  registerUserSuccess,
  registerUserFailure,
};
