
class ModeModel {

	static deserialize(obj) {
		/**
			This function receives an object and creates a new instance of ModeModel with its properties.
			obj is of the following format
			{
				'id':id,
				'name':name,
				'orderIndex':orderIndex,
				'isOriginMode':isOriginMode, 
				'isEditable':isEditable,
				'colors':colors, 
				'speed':speed
			}

		*/

		return new ModeModel(obj);
	}

	static createNewModeModel(obj) {
		/**
			This function initializes a new instance of ModeModel with the properties of obj.
			obj is of the following format
			{
				'id':id,
				'name':name,
				'orderIndex':orderIndex,
				'isOriginMode':isOriginMode, 
				'isEditable':isEditable,
				'colors':colors, 
				'speed':speed
			}

		*/
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
		/**
			This function returns a JS object with all the attributes of the mode model instance.
			The object returned is of the following format
			{
				'id':id,
				'name':name,
				'orderIndex':orderIndex,
				'isOriginMode':isOriginMode, 
				'isEditable':isEditable,
				'colors':colors, 
				'speed':speed
			}
		*/

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
		/**
			This function clones the mode model instance. To do so, it serializes the mode instance and creates a new instance
			with the properties object obtained. It returns the new mode model instance.
		*/

		var modeDetails = this.serialize();
		var clone = ModeModel.createNewModeModel(modeDetails);
		return clone;
	}

	setColors = (colors) => {
		/**
			This function sets the colors array received as an argument as the colors attribute of the mode mode instance.
		*/
		this.colors = colors;
	}

	setSpeed = (speed) => {
		/**
			This function sets the speed integer received as an argument as the speed attribute of the mode mode instance.
		*/
		this.speed = speed;
	}

	setName = (name) => {
		/**
			This function sets the name string received as an argument as the name attribute of the mode mode instance.
		*/
		this.name = name;
	}

	setId = (id) => {
		/**
			This function sets the id integer received as an argument as the id attribute of the mode mode instance.
		*/
		this.id = id;
	}

	setOrderIndex = (idx) => {
		/**
			This function sets the index integer received as an argument as the orderIndex attribute of the mode mode instance.
		*/
		this.orderIndex = idx;
	}

}

export default ModeModel;