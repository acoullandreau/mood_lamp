let selectModeReducer = (state = '', action) => {
	switch(action.type) {
		case 'FETCH_MODES':
			return action.payload.selectedMode;
			//break;
		case 'SELECT_MODE':
			return action.payload;
			//break;
		default:
			return state;
	}
}

export default selectModeReducer;