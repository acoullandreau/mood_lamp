import BluetoothService from './BluetoothService.js';
import MaiaUtils from '../classes/MaiaUtils';


class MaiaService {

	getInitSetting() {
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
				resolve({'modes':results[0], 'rules':results[1], 'config':results[2]})
			})
		});
		
		return p;

	}

	getModes() {
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
		//get the list of saved modes
		return BluetoothService.getModes();

	}

	getSelectedMode() {
		//get the index of the currently selected mode
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
		BluetoothService.setMode(modeConfig);
	}

	saveModes(modesObject) {
		//modesObject contains the array of saved modes and the currently selected mode 
		BluetoothService.saveModes(modesObject);
	}

	updateMode(modesObject, updateObject) {
		BluetoothService.updateMode(modesObject, updateObject);
	}

	deleteMode(modeConfig) {
		BluetoothService.deleteMode(modeConfig);
	}

	discardChanges() {
		BluetoothService.discardChanges();
	}

	getReadings() {
		// this method is in charge of collecting the measurements from the micro-controller (through BluetoothService)
		return BluetoothService.getSensorValues();
	}

	getRules() {
		//get the rules config object
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
		//set the rules config object
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
		return BluetoothService.setCurrentTime();
	}

}

const MaiaServiceInstance = new MaiaService();
export default MaiaServiceInstance;

