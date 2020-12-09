
class ModeModel {

	static deserialize(obj) {
		return new ModeModel(obj);
	}

	static createNewModeModel(obj) {
		return new ModeModel(obj);
	}

	constructor(properties) {
		this.id = properties.id;
		this.orderIndex = properties.orderIndex;
		if (properties.name === undefined) {
			this.name = ""
		} else {
			this.name = properties.name;
		}
		this.isOriginMode = properties.isOriginMode;
		this.isEditable=properties.isEditable;
		this.colors = properties.colors;
		this.speed = String(properties.speed);
	}
 
	serialize() {
		var modeDetails = {
			'id':this.id,
			'name':this.name,
			'orderIndex':this.orderIndex,
			'isOriginMode':this.isOriginMode, 
			'isEditable':this.isEditable,
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
	}

	setSpeed = (speed) => {
		this.speed = speed;
	}

	setName = (name) => {
		this.name = name;
	}

	setId = (id) => {
		this.id = id;
	}

}

export default ModeModel;