import BluetoothService from './BluetoothService.js';

class MaiaService {
	
	getModes() {
		
	}

	executeMode() {

	}

	saveModes() {

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

	}

	saveRules() {

	}



}

const MaiaServiceInstance = new MaiaService();
export default MaiaServiceInstance;
