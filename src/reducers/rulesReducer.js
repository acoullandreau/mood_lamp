
export default (state = {}, action) => {
	switch(action.type) {
		case 'FETCH_RULES':
			return action.payload;
			//break;
		case 'EDIT_RULE':
			console.log(action.payload)
			return state;
			//break;
		default:
			return state;
	}
}