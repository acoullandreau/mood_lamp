
export default (state = {}, action) => {
	switch(action.type) {
		case 'FETCH_RULES':
			return action.payload;
			//break;
		case 'EDIT_RULES':
			return action.payload;
			//break;
		default:
			return state;
	}
}