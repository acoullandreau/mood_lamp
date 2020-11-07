
class BluetoothService {
	
	getNoiseLevel() {
		var noisePromise = new Promise((resolve, reject) => {
			//fake request
			resolve((Math.floor(Math.random() * 70) + 20));
		})

		return noisePromise;

	}

	getTemperature() {
		var temperaturePromise = new Promise((resolve, reject) => {
			//fake request
			resolve(Math.floor(Math.random() * 40));
		})

		return temperaturePromise;
	}

	getHumidity() {
		var humidityPromise = new Promise((resolve, reject) => {
			//fake request
			resolve(Math.floor(Math.random() * 100));
		})

		return humidityPromise;
	}

	getPressure() {
		var pressurePromise = new Promise((resolve, reject) => {
			//fake request
			resolve(Math.floor(Math.random() * 200) + 1015);
		})

		return pressurePromise;
	}

	getBatteryLevel() {
		var batteryPromise = new Promise((resolve, reject) => {
			//fake request
			resolve(Math.floor(Math.random() * 100));
		})

		return batteryPromise;
	}

	getModes() {

	}

	getRules() {

	}



}

const BluetoothServiceInstance = new BluetoothService();
export default BluetoothServiceInstance;