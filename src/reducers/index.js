import { combineReducers } from 'redux';
import modesReducer from './modesReducer.js';
import selectModeReducer from './selectModeReducer.js';
import factoryModeReducer from './factoryModeReducer.js';

export default combineReducers({
	modes: modesReducer,
	selectedMode: selectModeReducer,
	factorySettings:factoryModeReducer
});