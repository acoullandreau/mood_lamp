
class ModeModel {

	static deserialize(obj) {
		return new ModeModel(obj);
	}

	static createNewModeModel(obj) {
		return new ModeModel(obj);
	}

	constructor(properties) {
		this.name = properties.name;
		this.category = properties.category;
		this.isOriginMode = properties.isOriginMode;
		this.colors = properties.color;
		this.speed = properties.speed;
	}
 
	serialize() {
		var modeDetails = {
			'name':this.name,
			'isOriginMode':this.isOriginMode, 
			'category':this.category, 
			'color':this.colors, 
			'speed':this.speed
		};

		return modeDetails;
	}


}

export default ModeModel;