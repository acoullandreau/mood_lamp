import { combineReducers } from 'redux';
import modesReducer from './modesReducer.js';
import selectModeReducer from './selectModeReducer.js';
import factoryModeReducer from './factoryModeReducer.js';
import rulesReducer from './rulesReducer.js';

export default combineReducers({
	rules:rulesReducer,
	modes: modesReducer,
	selectedMode: selectModeReducer,
	factorySettings:factoryModeReducer
});