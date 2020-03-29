import { combineReducers } from 'redux';
import configureStore from './store';
import rootSaga from '../sagas';
import authReducer from './reducers/auth';
import userReducer from './reducers/user';

export default () => {
  const rootReducer = combineReducers({
    /**
     * Register your reducers here.
     * @see https://redux.js.org/api-reference/combinereducers
     */
    auth: authReducer,
    user: userReducer,
  });

  return configureStore(rootReducer, rootSaga);
};
