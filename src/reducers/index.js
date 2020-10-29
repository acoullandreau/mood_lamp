import { combineReducers } from 'redux';
import modesReducer from './modesReducer.js';

export default combineReducers({
	modes: modesReducer
});