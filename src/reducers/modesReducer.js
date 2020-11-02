
export default (state = [], action) => {
	switch(action.type) {
		case 'FETCH_MODES':
			return action.payload.list;
			//break;
		case 'ADD_MODE':
			return [...state, action.payload];
			//break;
		case 'EDIT_MODE':
			var newState = [...state];
			var refMode = action.payload.refMode;
			var editedMode = action.payload.mode;
			for (var i = 0 ; i < newState.length ; i++ ) {
				if (newState[i] === refMode) {
					newState[i] = editedMode
				}
			} 
			return newState;
			//break;
		case 'DELETE_MODE':
			return state.filter(mode => mode !== action.payload);
			//break;
		default:
			return state;
	}
}