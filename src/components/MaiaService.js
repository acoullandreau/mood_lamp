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
		var modesPromise = new Promise((resolve, reject) => {
			BluetoothService.getModes()
			.then(modeArray => {
				resolve(modeArray);
			})
			.catch((err) => {
				console.warn(err); 
				reject([]);
			})
		});

		return modesPromise;

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
		var promises = [
			this.getTemperature(),
			this.getHumidity(),
			this.getPressure(),
			this.getNoiseLevel(),
			this.getBatteryLevel(),
		]

		var p = new Promise((resolve, reject) => {
			Promise.all(promises).then(results => {
				var measures = {
					'temperature':results[0],
					'humidity':results[1],
					'pressure':results[2],
					'noise':results[3],
					'battery':results[4],
				}
				resolve(measures)
			})
		});

		return p;

	}

	getNoiseLevel() {
		var noisePromise = new Promise((resolve, reject) => {
			//make request to micro controller
			BluetoothService.getNoiseLevel()
			.then(value => {
				resolve(value.toString());
			})
			.catch(() => {
				resolve('--');
			})

			
		})

		return noisePromise;
	}

	getTemperature() {
		var temperaturePromise = new Promise((resolve, reject) => {
			//make request to micro controller
			BluetoothService.getTemperature()
			.then(value => {
				resolve(value.toString());
			})
			.catch(() => {
				resolve('--');
			})
			
		})

		return temperaturePromise;
	}

	getHumidity() {
		var humidityPromise = new Promise((resolve, reject) => {
			//make request to micro controller
			BluetoothService.getHumidity()
			.then(value => {
				resolve(value.toString());
			})
			.catch(() => {
				resolve('--');
			})
			
		})

		return humidityPromise;
	}

	getPressure() {
		var pressurePromise = new Promise((resolve, reject) => {
			//make request to micro controller
			BluetoothService.getPressure()
			.then(value => {
				resolve(value.toString());
			})
			.catch(() => {
				resolve('--');
			})
			
		})

		return pressurePromise;
	}

	getBatteryLevel() {
		var batteryPromise = new Promise((resolve, reject) => {
			//make request to micro controller
			BluetoothService.getBatteryLevel()
			.then(value => {
				var batteryLevel;
				if (value < 25) {
					batteryLevel = "Faible";
				} else if (value > 75) {
					batteryLevel = "Haut";
				} else {
					batteryLevel = "Normal";
				}
				resolve(batteryLevel);
			})
			.catch(() => {
				resolve('--');
			})
			
		})

		return batteryPromise;
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
		BluetoothService.saveRules(rulesObject);
	}


}

const MaiaServiceInstance = new MaiaService();
export default MaiaServiceInstance;
