import {combineReducers} from 'redux';
import {globalReducer} from './globalReducer';
import {feedReducer} from './feedReducer';
const rootReducer = combineReducers({
  globalReducer,
  feedReducer,
});
export default rootReducer;
