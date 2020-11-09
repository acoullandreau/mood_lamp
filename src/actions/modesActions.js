import MaiaService from '../components/MaiaService.js';
import ModeModel from '../components/ModeModel.js';

export const fetchModes = () => {
	return (dispatch) => {
		//fetch JSON of modes and selected mode

		MaiaService.getModes().then(modesObject => {
			const modesArray = modesObject['modesArray'];
			const selectedMode = modesObject['selectedMode'];
			var modesList = []
			for (let i=0 ; i < modesArray.length ; i++) {
				const mode = ModeModel.deserialize(modesArray[i]);
				modesList.push(mode);
			}

			dispatch({type:'FETCH_MODES', payload:{'list':modesList, 'selectedMode':selectedMode} })
		});
	}

};

export const addMode = (mode) => {
	return {
		type:'ADD_MODE',
		payload:mode
	}
}

export const editMode = (mode, refMode) => {
	return {
		type:'EDIT_MODE',
		payload:{'mode':mode, 'refMode':refMode}
	}
}

export const deleteMode = (mode) => {
	return {
		type:'DELETE_MODE',
		payload:mode
	}
}

export const selectMode = (mode) => {
	return {
		type:'SELECT_MODE',
		payload:mode
	}
}

export const getFactorySettings = (jsonFile) => {
	return {
		type:'GET_FACTORY_SETTINGS',
		payload:jsonFile
	}
}




