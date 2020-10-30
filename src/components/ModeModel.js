
class ModeModel {

	static deserialize(obj) {
		return new ModeModel(obj);
	}

	static createNewModeModel(obj) {
		return new ModeModel(obj);
	}

	constructor(properties) {
		if (properties.name === undefined) {
			this.name = ""
		} else {
			this.name = properties.name;
		}
		this.category = properties.category;
		this.isOriginMode = properties.isOriginMode;
		this.isEditable=properties.isEditable;
		this.colors = properties.colors;
		this.speed = String(properties.speed);
	}
 
	serialize() {
		var modeDetails = {
			'name':this.name,
			'isOriginMode':this.isOriginMode, 
			'isEditable':this.isEditable,
			'category':this.category, 
			'color':this.colors, 
			'speed':this.speed
		};

		return modeDetails;
	}

	setColors = (colors) => {
		this.colors = colors;
	}

	setSpeed = (speed) => {
		this.speed = speed;
	}

	setName = (name) => {
		this.name = name;
	}

}

export default ModeModel;