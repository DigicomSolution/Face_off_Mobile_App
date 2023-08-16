import {createStore, applyMiddleware} from 'redux';
import logger from 'redux-logger';
// import inputReducer from './reducers/inputReducer';
import rootReducer from './reducers';

const ConfigureStore = () => {
  return createStore(rootReducer, applyMiddleware(logger));
  // return createStore(rootReducer);
};
export default ConfigureStore;
