import ModeModel from '../components/ModeModel.js';

export const fetchModes = () => {
	return (dispatch) => {
		//fetch JSON of modes

		const modesArray = [
			{'name':'Éteindre', 'isOriginMode':true, 'isEditable':false, 'category':'off', 'colors':[{ r: 0, g: 0, b: 0 }], 'speed':0},
			{'name':'Fête', 'isOriginMode':true, 'isEditable':false, 'category':'sound', 'colors':[{ r: 10, g: 241, b: 135 }], 'speed':0}, 
			{'name':'Discussion', 'isOriginMode':true, 'isEditable':false, 'category':'sound', 'colors':[{ r: 125, g: 125, b: 125 }], 'speed':0},
			{'name':'Temperature Ambiance', 'isOriginMode':true, 'isEditable':true, 'category':'temperature', 'colors':[{ r: 67, g: 138, b: 168 }, { r: 204, g: 219, b: 254 }, { r: 245, g: 160, b: 64 }], 'speed':0},
			{'name':'Humidity Ambiance', 'isOriginMode':true, 'isEditable':true, 'category':'humidity', 'colors':[{ r: 46, g: 113, b: 8 }, { r: 246, g: 215, b: 176 }], 'speed':0},
			{'name':'Saved Mode', 'isOriginMode':false, 'isEditable':true, 'category':'gradient', 'colors':[{ r: 30, g: 40, b: 50 }, { r: 100, g: 120, b: 140 }, { r: 200, g: 220, b: 240 }], 'speed':80}
		];

		var modesList = []
		for (let i=0 ; i < modesArray.length ; i++) {
			const mode = ModeModel.deserialize(modesArray[i]);
			modesList.push(mode);
		}

		dispatch({type:'FETCH_MODES', payload:modesList })
	}

};


export const editMode = (mode) => {
	return {
		type:'EDIT_MODE',
		payload:mode
	}
}

export const deleteMode = (mode) => {
	return {
		type:'DELETE_MODE',
		payload:mode
	}
}