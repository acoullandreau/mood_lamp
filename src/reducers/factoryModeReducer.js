let factoryModeReducer = (state = {}, action) => {
	switch(action.type) {
		case 'GET_FACTORY_SETTINGS':
			return action.payload;
			//break;
		default:
			return state;
	}
}

export default factoryModeReducer;