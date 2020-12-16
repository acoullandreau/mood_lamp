
class ModeModel {
	/**
		This class describes a single mode instance.
		It is used as an abstraction to manipulate the configuration of a mode (id, orderIndex, colors, speed, name...).
	*/


	static deserialize(obj) {
		/**
			This method receives an object and creates a new instance of ModeModel with its properties.
			The format of obj is as described in the serialize method of this class. 
		*/

		return new ModeModel(obj);
	}

	static createNewModeModel(obj) {
		/**
			This method initializes a new instance of ModeModel with the properties of obj.
			The format of obj is as described in the serialize method of this class. 
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
			This method returns a JS object with all the attributes of the mode model instance.
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
			This method clones the mode model instance. To do so, it serializes the mode instance and creates a new instance
			with the properties object obtained. It returns the new mode model instance.
		*/

		var modeDetails = this.serialize();
		var clone = ModeModel.createNewModeModel(modeDetails);
		return clone;
	}

	setColors = (colors) => {
		/**
			This method sets the colors array received as an argument as the colors attribute of the mode mode instance.
		*/
		this.colors = colors;
	}

	setSpeed = (speed) => {
		/**
			This method sets the speed integer received as an argument as the speed attribute of the mode mode instance.
		*/
		this.speed = String(speed);
	}

	setName = (name) => {
		/**
			This method sets the name string received as an argument as the name attribute of the mode mode instance.
		*/
		this.name = name;
	}

	setId = (id) => {
		/**
			This method sets the id integer received as an argument as the id attribute of the mode mode instance.
		*/
		this.id = id;
	}

	setOrderIndex = (idx) => {
		/**
			This method sets the index integer received as an argument as the orderIndex attribute of the mode mode instance.
		*/
		this.orderIndex = idx;
	}

}

export default ModeModel;