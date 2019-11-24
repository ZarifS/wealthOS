import { combineReducers } from 'redux';
import configureStore from './store';
import rootSaga from '../sagas';
import exampleReducer from './reducers/example';

export default () => {
  const rootReducer = combineReducers({
    /**
     * Register your reducers here.
     * @see https://redux.js.org/api-reference/combinereducers
     */
    example: exampleReducer,
  });

  return configureStore(rootReducer, rootSaga);
};
