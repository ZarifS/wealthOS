import { combineReducers } from 'redux';
import configureStore from './store';
import rootSaga from '../sagas';
import authReducer from './reducers/auth';

export default () => {
  const rootReducer = combineReducers({
    /**
     * Register your reducers here.
     * @see https://redux.js.org/api-reference/combinereducers
     */
    auth: authReducer,
  });

  return configureStore(rootReducer, rootSaga);
};
