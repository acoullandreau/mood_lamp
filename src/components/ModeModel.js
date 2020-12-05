
class ModeModel {

	static deserialize(obj) {
		return new ModeModel(obj);
	}

	static createNewModeModel(obj) {
		return new ModeModel(obj);
	}

	constructor(properties) {
		this.id = properties.id;
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
			'id':this.id,
			'name':this.name,
			'isOriginMode':this.isOriginMode, 
			'isEditable':this.isEditable,
			'category':this.category, 
			'colors':this.colors, 
			'speed':this.speed
		};

		return modeDetails;
	}

	cloneInstance() {
		var modeDetails = this.serialize();
		var clone = ModeModel.createNewModeModel(modeDetails);
		return clone;
	}

	setColors = (colors) => {
		this.colors = colors;
		if (colors.length > 1 && this.category === 'single') {
			this.category = 'gradient';
		} else if (colors.length === 1 && this.category === 'gradient') {
			this.category = 'single';
		}
	}

	setSpeed = (speed) => {
		this.speed = speed;
	}

	setName = (name) => {
		this.name = name;
	}

}

export default ModeModel;