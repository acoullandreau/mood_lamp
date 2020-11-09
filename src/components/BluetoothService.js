
class BluetoothService {
	
	getModes() {
		var modesPromise = new Promise((resolve, reject) => {
			//fake request
			const modesArray = [
				{'name':'Éteindre', 'isOriginMode':true, 'isEditable':false, 'category':'off', 'colors':[{ r: 0, g: 0, b: 0 }], 'speed':0},
				{'name':'Fête', 'isOriginMode':true, 'isEditable':false, 'category':'sound', 'colors':[{ r: 10, g: 241, b: 135 }], 'speed':0}, 
				{'name':'Discussion', 'isOriginMode':true, 'isEditable':false, 'category':'sound', 'colors':[{ r: 125, g: 125, b: 125 }], 'speed':0},
				{'name':'Temperature Ambiance', 'isOriginMode':true, 'isEditable':true, 'category':'temperature', 'colors':[{ r: 67, g: 138, b: 168 }, { r: 204, g: 219, b: 254 }, { r: 245, g: 160, b: 64 }], 'speed':0},
				{'name':'Humidity Ambiance', 'isOriginMode':true, 'isEditable':true, 'category':'humidity', 'colors':[{ r: 46, g: 113, b: 8 }, { r: 246, g: 215, b: 176 }], 'speed':0},
				{'name':'Saved Mode', 'isOriginMode':false, 'isEditable':true, 'category':'gradient', 'colors':[{ r: 30, g: 40, b: 50 }, { r: 100, g: 120, b: 140 }, { r: 200, g: 220, b: 240 }], 'speed':80}
			];

			resolve(modesArray);
		});

		return modesPromise;
	}


	getSelectedMode() {
		var selectedModePromise = new Promise((resolve, reject) => {
			//fake request
			resolve((Math.floor(Math.random() * 5) + 1));
		});

		return selectedModePromise;
	}

	saveModes(modesObject) {
		// modesObject contains the array of saved modes and the currently selected mode 
		// save the object on the micro-controller
		console.log('Saving Modes to micro-controller')
	}

	setMode(modeConfig) {
		// send config of the mode to execute to the micro-controller
		console.log('Executing mode ', modeConfig);

		//Observation: modeConfig may be the config of a saved mode, but not necessarily, that's why the whole config is passed instead of just an index
	}


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

	getRules() {
		var rulesPromise = new Promise((resolve, reject) => {
			//fake request
			const rulesConfig = {
				'dayTimeAuto': {'active':false},
				'silentAutoOff': {'active':false, 'duration':12},
				'autoOn':{
					'active':false,
					'onLightLevel':{
						'startTime':'20:00',
						'withStartTime':false,
						'active':true
					},
					'onSchedule':{
						'startTime':'20:00',
						'withStartDimmingTime':false,
						'startDimmingTime':'19:45',
						'active':false
					},
				},
				'autoOff':{
					'active':true,
					'onLightLevel':{
						'startTime':'23:00',
						'withStartTime':false,
						'active':false
					},
					'onSchedule':{
						'startTime':'23:00',
						'withStartDimmingTime':false,
						'startDimmingTime':'22:30',
						'active':true
					},
				},
			}

			resolve(rulesConfig);
		});

		return rulesPromise;
	}

	saveRules(rulesObject) {
		// save the object on the micro-controller
		console.log('Saving Rules to micro-controller')
	}

}

const BluetoothServiceInstance = new BluetoothService();
export default BluetoothServiceInstance;