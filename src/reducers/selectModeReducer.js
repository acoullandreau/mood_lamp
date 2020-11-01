
export default (state = '', action) => {
	switch(action.type) {
		case 'SELECT_MODE':
			return action.payload;
			//break;
		default:
			return state;
	}
}