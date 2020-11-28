import CryptoUtils from './CryptoUtils'
import Message from './Message';
import MessageUtils from './MessageUtils'
import Stream from './Stream'
import { v4 as uuidv4 } from 'uuid';

class BluetoothService {

	constructor() {
		this.bleNusServiceUUID  = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
		this.bleNusCharRXUUID   = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
		this.bleNusCharTXUUID   = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

		if ('clientId' in localStorage == false) {
			localStorage['clientId'] = uuidv4();
		}

		this.clientId = localStorage['clientId'];

		// android = 20
		// mac = 99
		// chrome = 512
		this.MTU = 512;

		this.connected = false;
		this.bleDevice = undefined;
		this.bleServer = undefined;
		this.nusService = undefined;
		this.rxCharacteristic = undefined;
		this.txCharacteristic = undefined;

		this.stream = new Stream(this.MTU, this.onMessage);
		this.request_map = {};
	}

	connect(onConnected, onDisconnected, onMessage) {
		if (!navigator.bluetooth) {
			console.log('WebBluetooth API is not available.\r\n' +
						'Please make sure the Web Bluetooth flag is enabled.');
			return;
		}
		console.log('Requesting Bluetooth Device...');
		navigator.bluetooth.requestDevice({
			// filters: [{services: [this.bleNusServiceUUID]}],
			optionalServices: [this.bleNusServiceUUID],
			acceptAllDevices: true
		})
		.then(device => {
			this.bleDevice = device;
			console.log('Found ' + device.name);
			console.log('Connecting to GATT Server...');
			this.bleDevice.addEventListener('gattserverdisconnected', this.onDisconnected);
			return device.gatt.connect();
		})
		.then(server => {
			console.log('Locate NUS service');
			return server.getPrimaryService(this.bleNusServiceUUID);
		}).then(service => {
			this.nusService = service;
			console.log('Found NUS service: ' + service.uuid);
		})
		.then(() => {
			console.log('Locate RX characteristic');
			return this.nusService.getCharacteristic(this.bleNusCharRXUUID);
		})
		.then(characteristic => {
			this.rxCharacteristic = characteristic;
			this.stream.setChannel(characteristic.writeValue.bind(characteristic));
			console.log('Found RX characteristic');
		})
		.then(() => {
			console.log('Locate TX characteristic');
			return this.nusService.getCharacteristic(this.bleNusCharTXUUID);
		})
		.then(characteristic => {
			this.txCharacteristic = characteristic;
			console.log('Found TX characteristic');
		})
		.then(() => {
			console.log('Enable notifications');
			return this.txCharacteristic.startNotifications();
		})
		.then(() => {
			console.log('Notifications started');
			this.txCharacteristic.addEventListener(
				'characteristicvaluechanged',
				this.handleNotifications
			);
			this.connected = true;
			//window.term_.io.println('\r\n' + bleDevice.name + ' Connected.');
			console.log(this.bleDevice.name + ' Connected.');
			this.onConnected();
			//nusSendString('\r');
			//setConnButtonState(true);
		})
		.catch(error => {
			console.error('' + error);
			//window.term_.io.println('' + error);
			if(this.bleDevice && this.bleDevice.gatt.connected)
			{
				this.bleDevice.gatt.disconnect();
			}
		});

		this.onConnectedCallback = onConnected;
		this.onDisconnectedCallback = onDisconnected;
		this.onMessageCallback = onMessage;
	}

	handleNotifications = (event) => {
		let buffer = event.target.value.buffer;
	   	this.stream.receive(buffer);
	}

	disconnect() {
		if (this.socket) {
			this.socket.close();
		}
	}

	onConnected = () => {
		if (this.onConnectedCallback) {
			this.onConnectedCallback();
		}
	}

	onDisconnected = () => {
		if (this.onDisconnectedCallback) {
			this.onDisconnectedCallback();
		}
	}

	onSocketMessage = (event) => {
	    event.data.arrayBuffer().then(buffer => {
	    	this.stream.receive(buffer);
	    });
	}

	onMessage = (buffer) => {
		let message = Message.deserializeBinary(buffer);
		let req_uuid = message.getUUID();
		let payload = message.getPayload()

		if (req_uuid in this.request_map) {
			this.request_map[req_uuid](payload);
			delete this.request_map[req_uuid];
		}

		if (this.onMessageCallback) {
			this.onMessageCallback(payload);
		}
	}

	sendMessage(message) {
		let res;
		let p = new Promise((resolve, reject) => {
			res = resolve;
		});
		let uuid = message.getUUID();
		this.request_map[uuid] = res;
		let msg = message.serializeBinary();
		this.stream.send(msg, this.clientId);

		return p;
	}

	getModes() {
		var modesPromise = new Promise((resolve, reject) => {
			//fake request
			const modesArray = [
				{'name':'Éteindre', 'isOriginMode':true, 'isEditable':false, 'category':'off', 'colors':[{ r: 0, g: 0, b: 0 }], 'speed':0},
				{'name':'Fête', 'isOriginMode':true, 'isEditable':false, 'category':'sound', 'colors':[{ r: 10, g: 241, b: 135 }], 'speed':0},
				{'name':'Discussion', 'isOriginMode':true, 'isEditable':false, 'category':'sound', 'colors':[{ r: 125, g: 125, b: 125 }], 'speed':0},
				{'name':'Temperature Ambiance', 'isOriginMode':true, 'isEditable':true, 'category':'temperature', 'colors':[{ r: 67, g: 138, b: 168 }, { r: 204, g: 219, b: 254 }, { r: 245, g: 160, b: 64 }], 'speed':0},
				{'name':'Humidity Ambiance', 'isOriginMode':true, 'isEditable':true, 'category':'humidity', 'colors':[{ r: 46, g: 113, b: 8 }, { r: 246, g: 215, b: 176 }], 'speed':0},
				{'name':'Saved Mode', 'isOriginMode':false, 'isEditable':true, 'category':'gradient', 'colors':[{ r: 255, g: 40, b: 50 }, { r: 255, g: 120, b: 140 }, { r: 100, g: 220, b: 240 }], 'speed':80},
				{'name':'Saved Mode', 'isOriginMode':false, 'isEditable':true, 'category':'gradient', 'colors':[{ r: 100, g: 40, b: 50 }, { r: 200, g: 120, b: 140 }, { r: 200, g: 100, b: 240 }], 'speed':80},
				{'name':'Saved Mode', 'isOriginMode':false, 'isEditable':true, 'category':'gradient', 'colors':[{ r: 30, g: 40, b: 100 }, { r: 30, g: 120, b: 140 }, { r: 150, g: 220, b: 240 }], 'speed':80},
				{'name':'Saved Mode', 'isOriginMode':false, 'isEditable':true, 'category':'gradient', 'colors':[{ r: 30, g: 255, b: 50 }, { r: 100, g: 0, b: 140 }, { r: 200, g: 220, b: 0 }], 'speed':80},
				{'name':'Saved Mode with a super long name', 'isOriginMode':false, 'isEditable':true, 'category':'gradient', 'colors':[{ r: 30, g: 40, b: 50 }, { r: 100, g: 120, b: 140 }, { r: 200, g: 220, b: 240 }], 'speed':80}
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