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
	"SET_MODE":6,
	"UPDATE_MODE":7,
	"GET_READINGS":8,
	"GET_SETTINGS":9,
	"SET_SETTINGS":10,
	"SET_TIME":11,
	"DISCARD_CHANGES":12,
	"DELETE_MODE":13,
	"ERROR":90,
	"NOT_IMPLEMENTED":80
});

class BluetoothService {

	constructor() {
		this.bleNusServiceUUID  = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
		this.bleNusCharRXUUID   = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
		this.bleNusCharTXUUID   = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

		if ('clientId' in localStorage === false) {
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

	connect(setLoading, onConnected, onDisconnected, onMessage) {
		if (!navigator.bluetooth) {
			console.log('WebBluetooth API is not available.\r\n' +
						'Please make sure the Web Bluetooth flag is enabled.');
			return;
		}
		console.log('Requesting Bluetooth Device...');
		navigator.bluetooth.requestDevice({
			// filters: [{services: [this.bleNusServiceUUID]}]
			filters: [{namePrefix: 'Maia'}]
			// optionalServices: [this.bleNusServiceUUID],
			// acceptAllDevices: true
		})
		.then(device => {
			setLoading(true);
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
		if (this.bleDevice.gatt) {
			this.bleDevice.gatt.disconnect();
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
					{'id':0, 'orderIndex':0, 'isOriginMode':true, 'isEditable':false, 'colors':[], 'speed':0},
					{'id':2, 'orderIndex':2, 'isOriginMode':true, 'isEditable':false, 'colors':[{ "r": 227, "g": 233, "b": 255 }, { "r": 255, "g": 180, "b": 107 }], 'speed':0},
					{'id':1, 'orderIndex':1, 'isOriginMode':true, 'isEditable':false, 'colors':[], 'speed':0},
					{'id':10, 'orderIndex':10, 'isOriginMode':true, 'isEditable':false, 'colors':[], 'speed':0},
					{'id':23, 'orderIndex':23, 'isOriginMode':true, 'isEditable':false, 'colors':[], 'speed':0},
					{'id':12, 'orderIndex':12, 'isOriginMode':true, 'isEditable':false, 'colors':[
						{"r": 255, "g": 0, "b": 0 },
						{ "r": 255, "g": 0, "b": 0 },
						{ "r": 255, "g": 255, "b": 255 },
						{ "r": 0, "g": 0, "b": 255 },
						{ "r": 0, "g": 0, "b": 255 },
						{ "r": 255, "g": 255, "b": 255 }],
					'speed':0},
					{'id':5, 'orderIndex':5, 'isOriginMode':true, 'isEditable':false, 'colors':[
			        	{ "r": 235, "g": 102, "b": 98 },
			            { "r": 230, "g": 133, "b": 171 },
			            { "r": 237, "g": 171, "b": 208 },
			            { "r": 247, "g": 177, "b": 114 },
			            { "r": 247, "g": 211, "b": 126 },
			            { "r": 168, "g": 200, "b": 154 },
			            { "r": 130, "g": 200, "b": 129 },
			            { "r": 32, "g": 143, "b": 148 },
			            { "r": 32, "g": 61, "b": 133 }],
					'speed':0},
					{'id':6, 'orderIndex':6, 'isOriginMode':true, 'isEditable':false, 'colors':[
			        	{ "r": 61, "g": 123, "b": 150 },
			            { "r": 191, "g": 192, "b": 178 },
			            { "r": 212, "g": 212, "b": 204 },
			            { "r": 104, "g": 160, "b": 170 },
			            { "r": 237, "g": 241, "b": 226 },
			            { "r": 213, "g": 222, "b": 238 },
			            { "r": 31, "g": 57, "b": 77 }],
					'speed':0},
					{'id':7, 'orderIndex':7, 'isOriginMode':true, 'isEditable':false, 'colors':[
					    { "r": 97, "g": 64, "b": 78 },
			            { "r": 195, "g": 95, "b": 95 },
			            { "r": 226, "g": 145, "b": 50 },
			            { "r": 191, "g": 154, "b": 115 },
			            { "r": 224, "g": 196, "b": 137 },
			            { "r": 167, "g": 167, "b": 98 },
			            { "r": 131, "g": 117, "b": 25 },
			            { "r": 197, "g": 104, "b": 23 },
			            { "r": 59, "g": 30, "b": 16 }],
					'speed':0},
					{'id':11, 'orderIndex':11, 'isOriginMode':true, 'isEditable':false, 'colors':[
			        	{ "r": 48, "g": 67, "b": 107 },
			            { "r": 93, "g": 86, "b": 127 },
			            { "r": 138, "g": 105, "b": 148 },
			            { "r": 165, "g": 169, "b": 214 },
			            { "r": 232, "g": 221, "b": 229 },
			            { "r": 213, "g": 222, "b": 238 },
			            { "r": 210, "g": 180, "b": 191 },
			            { "r": 211, "g": 188, "b": 217 }],
					'speed':0},
					{'id':13, 'orderIndex':13, 'isOriginMode':true, 'isEditable':false, 'colors':[
			        	{ "r": 251, "g": 173, "b": 37 },
			            { "r": 251, "g": 191, "b": 41 },
			            { "r": 238, "g": 85, "b": 25 },
			            { "r": 200, "g": 32, "b": 15 },
			            { "r": 132, "g": 37, "b": 57 },
			            { "r": 106, "g": 36, "b": 72 },
			            { "r": 107, "g": 99, "b": 123 },
			            { "r": 86, "g": 101, "b": 142 },
			            { "r": 47, "g": 59, "b": 92 }],
					'speed':0},
					{'id':15, 'orderIndex':15, 'isOriginMode':true, 'isEditable':false, 'colors':[
			        	{ "r": 162, "g": 152, "b": 181 },
			            { "r": 162, "g": 114, "b": 141 },
			            { "r": 95, "g": 88, "b": 132 },
			            { "r": 151, "g": 131, "b": 183 },
			            { "r": 107, "g": 87, "b": 117 },
			            { "r": 214, "g": 149, "b": 125 },
			            { "r": 213, "g": 222, "b": 238 }],
					'speed':0},
					{'id':17, 'orderIndex':17, 'isOriginMode':true, 'isEditable':false, 'colors':[
			        	{ "r": 121, "g": 66, "b": 98 },
			            { "r": 238, "g": 130, "b": 127 },
			            { "r": 252, "g": 200, "b": 193 },
			            { "r": 251, "g": 150, "b": 76 }],
					'speed':0},
					{'id':18, 'orderIndex':18, 'isOriginMode':true, 'isEditable':false, 'colors':[
			        	{ "r": 44, "g": 112, "b": 116 },
			            { "r": 61, "g": 124, "b": 119 },
			            { "r": 76, "g": 133, "b": 121 },
			            { "r": 98, "g": 151, "b": 125 },
			            { "r": 147, "g": 172, "b": 131 },
			            { "r": 176, "g": 183, "b": 131 }],
					'speed':0}

				];

				// let command = result[0];
				let payload = result[1];
				if(payload.length > 0) {
					let modes_list = MaiaUtils.unpackModesList(payload);
					let pb_modes_list = modes_list.getModesList();
					for (let index in pb_modes_list) {
						let mode = MaiaUtils.unpackMode(pb_modes_list[index]);
						modesArray.push(mode);
					}
				}
				else {
					console.log('list empty');
				}


				resolve(modesArray);
			});
		});
		return modesPromise;

	}

	getSelectedMode() {
		let selectedModePromise = new Promise((resolve, reject) => {
			let message = MessageUtils.buildMessage();
			message.setCommand(Commands.GET_ACTIVE_MODE);
			this.sendMessage(message).then((result) => {
				// let command = result[0];
				let payload = result[1];
				let mode_id = MaiaUtils.unpackModeId(payload);
				let id = mode_id.getId();
				resolve(id);
			});
		});
		return selectedModePromise;
	}

	saveMode(modeObject) {

		let modePromise = new Promise((resolve, reject) => {
			console.trace('Saving Mode to micro-controller', modeObject);
			let message = MessageUtils.buildMessage();
			message.setCommand(Commands.SET_MODE);
			message.setObjectPayload(MaiaUtils.packMode(modeObject, true));
			this.sendMessage(message).then((result) => {
				let command = result[0];
				let payload = result[1];
				console.log(command, payload);
				resolve(command);
			});
		});
		return modePromise;
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
				console.log(command);
				resolve(command);
			});
		});
		return modesPromise;
	}

	setActiveMode(modeConfig) {
		// send config of the mode to execute to the micro-controller
		console.log('Executing mode ', modeConfig);
		let setActiveModePromise = new Promise((resolve, reject) => {
			let message = MessageUtils.buildMessage();
			message.setCommand(Commands.SET_ACTIVE_MODE);
			console.log(modeConfig);
			message.setObjectPayload(MaiaUtils.packModeId(modeConfig));
			this.sendMessage(message).then((result) => {
				let command = result[0];
				// let payload = result[1];
				console.log(command);
				resolve(command);
			});
		});
		return setActiveModePromise;
	}

	updateMode(modeObject, updateObject) {
		console.log('Updating mode ', modeObject, updateObject);
		let updateModePromise = new Promise((resolve, reject) => {
			let message = MessageUtils.buildMessage();
			message.setCommand(Commands.UPDATE_MODE);
			message.setObjectPayload(MaiaUtils.packModeUpdate(modeObject, updateObject));
			this.sendMessage(message).then((result) => {
				let command = result[0];
				let payload = result[1];
				console.log(payload, command);
				resolve(command);
			});
		});
		return updateModePromise;
	}

	deleteMode(modeConfig) {
		console.log('Deleting mode ', modeConfig);
		let setActiveModePromise = new Promise((resolve, reject) => {
			let message = MessageUtils.buildMessage();
			message.setCommand(Commands.DELETE_MODE);
			console.log(modeConfig);
			message.setObjectPayload(MaiaUtils.packModeId(modeConfig));
			this.sendMessage(message).then((result) => {
				let command = result[0];
				let payload = result[1];
				console.log(command, payload);
				resolve(command);
			});
		});
		return setActiveModePromise;
	}

	discardChanges() {
		console.log('Discarding changes');
		let sensorPromise = new Promise((resolve, reject) => {
			let message = MessageUtils.buildMessage();
			message.setCommand(Commands.DISCARD_CHANGES);
			this.sendMessage(message).then((result) => {
				let command = result[0];
				let payload = result[1];
				console.log(command, payload);
				resolve(command);
			});
		});
		return sensorPromise;
		//add logic to request discard of changes to the microcontroller
	}

	getSensorValues() {
		let sensorPromise = new Promise((resolve, reject) => {
			let message = MessageUtils.buildMessage();
			message.setCommand(Commands.GET_READINGS);
			this.sendMessage(message).then((result) => {
				// let command = result[0];
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
				// let command = result[0];
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
				// let payload = result[1];
				console.log(command);
				resolve(command);
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
				resolve(command);
			});
		});
		return rulesPromise;
	}

}

const BluetoothServiceInstance = new BluetoothService();
export default BluetoothServiceInstance;