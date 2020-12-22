import BluetoothService from './BluetoothService.js';
import MaiaUtils from '../classes/MaiaUtils';


class MaiaService {

	selectedMode = '';

	getInitSetting() {
		/**
			This function is called once the connection is established with the microcontroller by the App component, to initialize the app.
			It is in charge of
				- fetching the modes and rules from the microcontroller
				- fetching the config file
				- building an object that the App can use to initialize the Redux store, with the list of modes, rules and selected mode

			It returns a promise.
		*/

		// we get the modes, the rules, and the factorySettings
		var modesPromise = this.getModes();
		var rulesPromise = this.getRules();
		var configPromise = fetch('config.json').then(response => {
            return response.json();
        });

		var p = new Promise((resolve, reject) => {
			Promise.all([modesPromise, rulesPromise, configPromise]).then(results => {
				// we decorate the modes list received, adding the name for the preconfigured modes
				var modesArray = MaiaUtils.decorateModes(results[0]['modesArray'], results[2]);
				results[0]['modesArray'] =  modesArray;
				this.selectedMode = results[0]['selectedMode'];
				resolve({'modes':results[0], 'rules':results[1], 'config':results[2]})
			})
		});

		return p;

	}

	getModes() {
		/**
			This function returns a promise that resolves with an object containing the modes list and the selected mode,
			as saved on the microcontroller.
		*/

		var promises = [
			this.getModesArray(),
			this.getSelectedMode()
		]

		var p = new Promise((resolve, reject) => {
			Promise.all(promises).then(results => {
				var modes = {
					'modesArray':results[0],
					'selectedMode':results[1]
				}
				resolve(modes)
			})
		});
		return p;
	}

	getModesArray() {
		/**
			This function requests the list of modes to the BluetoothService.
		*/

		return BluetoothService.getModes();

	}

	getSelectedMode() {
		/**
			This function requests the id of the (last) selected mode to the BluetoothService.
		*/

		var selectedModePromise = new Promise((resolve, reject) => {
			BluetoothService.getSelectedMode()
			.then(modeIndex => {
				resolve(modeIndex);
			})
			.catch((err) => {
				console.warn(err);
				reject(null);
			})
		});

		return selectedModePromise;
	}

	executeMode(modeConfig) {
		/**
			This function receives the config of the mode to launch. It requests to BluetoothService
			to set the mode and updates the Redux store with the id of the currently selected mode.
			The format of the object received as argument is as described in the constructor of ModeModel.js.
		*/

		BluetoothService.setActiveMode(modeConfig);
		this.selectedMode = modeConfig.id;

	}

	saveMode(modeObject) {
		/**
			This function receives the config of a mode to save (and add to the list of modes). This mode is either an existing mode that
			was edited, or a brand new mode.
			It requests to BluetoothService to save this mode.
			The format of the object received as argument is as described in the constructor of ModeModel.js.
		*/
		BluetoothService.saveMode(modeObject);
	}

	saveModes(modesObject) {
		// TODO: review comments
		BluetoothService.saveModes(modesObject);
	}

	updateMode(modesObject, updateObject) {
		/**
			This function receives the config of a mode that is being edited, along with what is being updated.
			The idea is that the lamp can be live updated while the user is editing the config of the mode being executed.

			updateObject can be :
				- {'speed':speed} - when the speed is being edited
				- {'color':colorObject, 'color_index':indexInTheArray} - when a color is being updated
				- {'colors':colorsArray} - when the user resets the colors of a preconfigured mode, or removes a color from a saved mode

			The format of modesObject received as argument is as described in the constructor of ModeModel.js.
		*/
		BluetoothService.updateMode(modesObject, updateObject);
	}

	deleteMode(modeConfig) {
		/**
			This function receives the config of a mode that should be deleted. It requests to BluetoothService to delete this mode.
			The format of modesObject received as argument is as described in the constructor of ModeModel.js.
		*/

		BluetoothService.deleteMode(modeConfig);
	}

	discardChanges() {
		/**
			When this function is called, any of the changes that were executed before (through the updateMode method) should be discarded (i.e. not saved).
			This function requests to BluetoothService to discard the changes.
		*/
		BluetoothService.discardChanges();
	}

	getReadings() {
		/**
			This method is in charge of collecting the measurements from the micro-controller (through BluetoothService).
		*/

		return BluetoothService.getSensorValues();
	}

	getRules() {
		/**
			This function returns a promise that resolves with an object containing the rules, as saved on the microcontroller.
		*/

		var rulesPromise = new Promise((resolve, reject) => {
			BluetoothService.getRules()
			.then(rulesConfig => {
				resolve(rulesConfig);
			})
			.catch((err) => {
				console.warn(err);
				reject({});
			})
		});

		return rulesPromise;
	}

	saveRules(rulesObject) {
		/**
			This function receives a rules config object and requests to BluetoothService to save it to the microcontroller.
			The format of rulesObject received as argument is as described in the state of Rules.js.
		*/

		var rulesPromise = new Promise((resolve, reject) => {
			BluetoothService.saveRules(rulesObject)
			.then(response => {
				resolve(response);
			})
			.catch((err) => {
				console.warn(err);
				reject({});
			})
		});

		return rulesPromise;
	}

	setCurrentTime() {
		/**
			This function request to BluetoothService to set the current time (i.e. sync time with browser).
		*/
		return BluetoothService.setCurrentTime();
	}

}

const MaiaServiceInstance = new MaiaService();
export default MaiaServiceInstance;

