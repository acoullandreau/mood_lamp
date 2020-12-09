let selectModeReducer = (state = '', action) => {
	switch(action.type) {
		case 'FETCH_MODES':
			return action.payload.selectedMode;
		case 'SELECT_MODE':
			return action.payload;
		default:
			return state;
	}
}

export default selectModeReducer;