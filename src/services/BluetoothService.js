import MaiaUtils from '../classes/MaiaUtils'
import Message from '../classes/Message';
import MessageUtils from '../classes/MessageUtils'
import Stream from '../classes/Stream'
import { v4 as uuidv4 } from 'uuid';

const Commands = Object.freeze({
	"SUCCESS":0, 
	"GET_ACTIVE_MODE":1, 
	"SET_ACTIVE_MODE":2, 
	"GET_MODE_LIST":3, 
	"SET_MODE_LIST":4, 
	"GET_MODE":5, 
	"UPDATE_MODE_COLOR":6, 
	"UPDATE_MODE_SPEED":7, 
	"GET_READINGS":8, 
	"GET_SETTINGS":9, 
	"SET_SETTINGS":10, 
	"SET_TIME":11,
	"ERROR":90,
	"NOT_IMPLEMENTED":80
});

class BluetoothService {

	constructor() {
		this.bleNusServiceUUID  = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
		this.bleNusCharRXUUID   = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
		this.bleNusCharTXUUID   = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

		if ('clientId' in localStorage == false) {
			localStorage['clientId'] = uuidv4();
		}

		this.clientId = localStorage['clientId'];

		this.connected = false;
		this.bleDevice = undefined;
		this.nusService = undefined;
		this.rxCharacteristic = undefined;
		this.txCharacteristic = undefined;

		this.stream = new Stream(this.onMessage);
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
			console.log(this.bleDevice.name + ' Connected.');
			this.stream.findMTU().then((result) => {
				this.stream.mtu = result;
				this.connected = true;
				this.onConnected();
			});
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
		let command = message.getCommand();
		let payload = message.getPayload();

		if (req_uuid in this.request_map) {
			this.request_map[req_uuid]([command, payload]);
			delete this.request_map[req_uuid];
		}

		if (this.onMessageCallback) {
			this.onMessageCallback(command, payload);
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
		let message = MessageUtils.buildMessage();
		message.setCommand(Commands.GET_MODE_LIST);
		let modesPromise = new Promise((resolve, reject) => {
			this.sendMessage(message).then((result) => {
				let modesArray = [
					{'id':0, 'isOriginMode':true, 'isEditable':false, 'colors':[{r: 255, g: 0, b: 0}], 'speed':0},
					{'id':8, 'isOriginMode':true, 'isEditable':false, 'colors':[{r: 255, g: 0, b: 0}], 'speed':0},
					{'id':10, 'isOriginMode':true, 'isEditable':false, 'colors':[{r: 255, g: 0, b: 0}], 'speed':0},
					{'id':14, 'isOriginMode':true, 'isEditable':false, 'colors':[{r: 255, g: 0, b: 0}], 'speed':0},
					{'id':19, 'isOriginMode':true, 'isEditable':false, 'colors':[{r: 255, g: 0, b: 0}], 'speed':0},
					{'id':21, 'isOriginMode':true, 'isEditable':false, 'colors':[{r: 255, g: 0, b: 0}], 'speed':0},
					{'id':23, 'isOriginMode':true, 'isEditable':false, 'colors':[{r: 255, g: 0, b: 0}], 'speed':0},
					{'id':24, 'isOriginMode':true, 'isEditable':false, 'colors':[{r: 255, g: 0, b: 0}], 'speed':0},
					{'id':25, 'isOriginMode':true, 'isEditable':false, 'colors':[{r: 255, g: 0, b: 0}], 'speed':0}
				];

				// editable modes for testing
				var modeBubbles = {'id':22, 'isOriginMode':true, 'isEditable':true, 'colors':[{ "r": 10, "g": 10, "b": 22 }, { "r": 52, "g": 90, "b": 122 }], 'speed':0};
				var modeTemp = {'id':3, 'isOriginMode':true, 'isEditable':true, 'colors':[{ r: 67, g: 138, b: 168 }, { r: 204, g: 219, b: 254 }, { r: 245, g: 160, b: 64 }], 'speed':0};
				var modeNationalDay = {
					'id':12, 
					'isOriginMode':true, 
					'isEditable':true, 
					'colors':[
						{"r": 179, "g": 60, "b": 60 },
						{ "r": 179, "g": 60, "b": 60 },
						{ "r": 246, "g": 232, "b": 224 },
						{ "r": 48, "g": 71, "b": 115 },
						{ "r": 48, "g": 71, "b": 115 },
						{ "r": 246, "g": 232, "b": 224 }], 
					'speed':0
				};
				modesArray.push(modeBubbles);
				// modesArray.push(modeTemp);
				modesArray.push(modeNationalDay);

				var testModesHardCoded = [0, 8, 10, 12, 14, 19, 21, 22, 23, 24, 25];


				let command = result[0];
				let payload = result[1];
				if(payload.length > 0) {
					let modes_list = MaiaUtils.unpackModesList(payload);
					let pb_modes_list = modes_list.getModesList();
					for (let index in pb_modes_list) {
						let mode = MaiaUtils.unpackMode(pb_modes_list[index]);
						// modesArray.push(mode);

						// check added for testing
						if (!testModesHardCoded.includes(mode.id)) {
							modesArray.push(mode);
						}
					}
				}
				else {
					console.log('list empty');
				}

				// MaiaUtils.fillNames(modesArray);
				console.log(modesArray);
				resolve(modesArray);
			});
		});
		return modesPromise;


		// 	//fake request
		// 	const modesArray = [
		// 		{'name':'Éteindre', 'isOriginMode':true, 'isEditable':false, 'category':'off', 'colors':[{ r: 0, g: 0, b: 0 }], 'speed':0},
		// 		{'name':'Fête', 'isOriginMode':true, 'isEditable':false, 'category':'sound', 'colors':[{ r: 10, g: 241, b: 135 }], 'speed':0},
		// 		{'name':'Discussion', 'isOriginMode':true, 'isEditable':false, 'category':'sound', 'colors':[{ r: 125, g: 125, b: 125 }], 'speed':0},
		// 		{'name':'Temperature Ambiance', 'isOriginMode':true, 'isEditable':true, 'category':'temperature', 'colors':[{ r: 67, g: 138, b: 168 }, { r: 204, g: 219, b: 254 }, { r: 245, g: 160, b: 64 }], 'speed':0},
		// 		{'name':'Humidity Ambiance', 'isOriginMode':true, 'isEditable':true, 'category':'humidity', 'colors':[{ r: 46, g: 113, b: 8 }, { r: 246, g: 215, b: 176 }], 'speed':0},
		// 		{'name':'Saved Mode', 'isOriginMode':false, 'isEditable':true, 'category':'gradient', 'colors':[{ r: 255, g: 40, b: 50 }, { r: 255, g: 120, b: 140 }, { r: 100, g: 220, b: 240 }], 'speed':80},
		// 		{'name':'Saved Mode', 'isOriginMode':false, 'isEditable':true, 'category':'gradient', 'colors':[{ r: 100, g: 40, b: 50 }, { r: 200, g: 120, b: 140 }, { r: 200, g: 100, b: 240 }], 'speed':80},
		// 		{'name':'Saved Mode', 'isOriginMode':false, 'isEditable':true, 'category':'gradient', 'colors':[{ r: 30, g: 40, b: 100 }, { r: 30, g: 120, b: 140 }, { r: 150, g: 220, b: 240 }], 'speed':80},
		// 		{'name':'Saved Mode', 'isOriginMode':false, 'isEditable':true, 'category':'gradient', 'colors':[{ r: 30, g: 255, b: 50 }, { r: 100, g: 0, b: 140 }, { r: 200, g: 220, b: 0 }], 'speed':80},
		// 		{'name':'Saved Mode with a super long name', 'isOriginMode':false, 'isEditable':true, 'category':'gradient', 'colors':[{ r: 30, g: 40, b: 50 }, { r: 100, g: 120, b: 140 }, { r: 200, g: 220, b: 240 }], 'speed':80}
		// 	];

		// 	resolve(modesArray);
		// });
	}

	getSelectedMode() {
		let selectedModePromise = new Promise((resolve, reject) => {
			let message = MessageUtils.buildMessage();
			message.setCommand(Commands.GET_ACTIVE_MODE);
			this.sendMessage(message).then((result) => {
				let command = result[0];
				let payload = result[1];
				let mode_id = MaiaUtils.unpackModeId(payload);
				let id = mode_id.getId();
				resolve(id);
			});
		});
		return selectedModePromise;
		// var selectedModePromise = new Promise((resolve, reject) => {
		// 	//fake request
		// 	resolve((Math.floor(Math.random() * 5) + 1));
		// });

		// return selectedModePromise;
	}

	saveModes(modesObject) {
		// modesObject contains the array of saved modes and the currently selected mode
		// save the object on the micro-controller

		let modesPromise = new Promise((resolve, reject) => {
			console.log('Saving Modes to micro-controller');
			let message = MessageUtils.buildMessage();
			message.setCommand(Commands.SET_MODE_LIST);
			message.setObjectPayload(MaiaUtils.packModesList(modesObject));
			this.sendMessage(message).then((result) => {
				let command = result[0];
				let payload = result[1];
				console.log(command);
			});
		});
		return modesPromise;
	}

	setMode(modeConfig) {
		// send config of the mode to execute to the micro-controller
		console.log('Executing mode ', modeConfig);
		let selectedModePromise = new Promise((resolve, reject) => {
			let message = MessageUtils.buildMessage();
			message.setCommand(Commands.SET_ACTIVE_MODE);
			console.log(modeConfig);
			message.setObjectPayload(MaiaUtils.packModeId(modeConfig));
			this.sendMessage(message).then((result) => {
				let command = result[0];
				let payload = result[1];
				console.log(command);
			});
		});
		return selectedModePromise;
		//Observation: modeConfig may be the config of a saved mode, but not necessarily, that's why the whole config is passed instead of just an index
	}

	updateMode(modesObject, updateObject) {
		console.log('Updating mode ', modesObject, updateObject)
		//add logic to request update to the microcontroller
	}

	deleteMode(modeConfig) {
		console.log('Deleting mode ', modeConfig);
		//add logic to request delete to the microcontroller
	}

	discardChanges() {
		console.log('Discarding changes');
		//add logic to request discard of changes to the microcontroller
	}

	getSensorValues() {
		let sensorPromise = new Promise((resolve, reject) => {
			let message = MessageUtils.buildMessage();
			message.setCommand(Commands.GET_READINGS);
			this.sendMessage(message).then((result) => {
				let command = result[0];
				let payload = result[1];
				let readings = MaiaUtils.unpackReadings(payload);
				resolve(readings);
			});
		});
		return sensorPromise;
	}

	getRules() {
		let message = MessageUtils.buildMessage();
		message.setCommand(Commands.GET_SETTINGS);
		let rulesPromise = new Promise((resolve, reject) => {
			this.sendMessage(message).then((result) => {
				let command = result[0];
				let payload = result[1];
				let settings = MaiaUtils.unpackSettings(payload);
				console.log(settings);
				resolve(settings);
			});
		});

		return rulesPromise;
		// var rulesPromise = new Promise((resolve, reject) => {
		// 	//fake request
		// 	const rulesConfig = {
		// 		'dayTimeAuto': {'active':false},
		// 		'silentAutoOff': {'active':false, 'duration':12},
		// 		'autoOn':{
		// 			'active':false,
		// 			'onLightLevel':{
		// 				'startTime':'20:00',
		// 				'withStartTime':false,
		// 				'active':true
		// 			},
		// 			'onSchedule':{
		// 				'startTime':'20:00',
		// 				'withStartDimmingTime':false,
		// 				'startDimmingTime':'19:45',
		// 				'active':false
		// 			},
		// 		},
		// 		'autoOff':{
		// 			'active':true,
		// 			'onLightLevel':{
		// 				'startTime':'23:00',
		// 				'withStartTime':false,
		// 				'active':false
		// 			},
		// 			'onSchedule':{
		// 				'startTime':'23:00',
		// 				'withStartDimmingTime':false,
		// 				'startDimmingTime':'22:30',
		// 				'active':true
		// 			},
		// 		},
		// 	}

		// 	resolve(rulesConfig);
		// });

		// return rulesPromise;
	}

	saveRules(rulesObject) {
		console.log('Saving Rules to micro-controller');
		let message = MessageUtils.buildMessage();
		message.setCommand(Commands.SET_SETTINGS);
		message.setObjectPayload(MaiaUtils.packRules(rulesObject));
		let rulesPromise = new Promise((resolve, reject) => {
			this.sendMessage(message).then((result) => {
				let command = result[0];
				let payload = result[1];
				console.log(command);
			});
		});
		return rulesPromise;
	}

	setCurrentTime() {
		console.log('Saving Time to micro-controller');
		let message = MessageUtils.buildMessage();
		message.setCommand(Commands.SET_TIME);
		let now = new Date();
		message.setObjectPayload(MaiaUtils.packTime(now));
		let rulesPromise = new Promise((resolve, reject) => {
			this.sendMessage(message).then((result) => {
				let command = result[0];
				let payload = result[1];
				console.log(command, payload);
			});
		});
		return rulesPromise;
	}

}

const BluetoothServiceInstance = new BluetoothService();
export default BluetoothServiceInstance;