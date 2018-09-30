import { combineReducers } from 'redux';
import recurso from './recurso';
import messenger from './messenger';

const rootReducer = combineReducers({
  recurso,
  messenger
});

export default rootReducer;
