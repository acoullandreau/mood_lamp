
export default (state = [], action) => {
	switch(action.type) {
		case 'FETCH_MODES':
			return action.payload;
			break;
		case 'ADD_MODE':
			return [...state, action.payload];
			break;
		case 'EDIT_MODE':
			console.log(action.payload);
			//edit a mode
			return state;
			break;
		case 'DELETE_MODE':
			return state.filter(mode => mode !== action.payload);
			break;
		default:
			return state;
			break;
	}
}