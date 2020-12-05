import BluetoothService from './BluetoothService.js';

class MaiaService {
	
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
