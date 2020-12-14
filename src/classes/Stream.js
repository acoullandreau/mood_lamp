import CryptoUtils from './CryptoUtils'

const States = Object.freeze({"WAITING":1, "RECEIVING":2})

class Stream {
	constructor(messageCallback) {
		this.channel = undefined;
		this.messageCallback = messageCallback;

		this.buffer = undefined;
		this.totalLength = 0;
		this.totalReceived = 0;
		this.currState = States.WAITING;
		this.payloadQueue = [];
		this.writeQueue = [];
		this.messagePrefix = [0xca, 0xfe, 0xba, 0xbe];
		this.ongoingTransfers = false;
	}

	setChannel(channel) {
		this.channel = channel;
	}

	numberToInt32 (num) {
	    let arr = new Uint8Array([
	         (num & 0xff000000) >> 24,
	         (num & 0x00ff0000) >> 16,
	         (num & 0x0000ff00) >> 8,
	         (num & 0x000000ff)
	    ]);
	    return arr;
	}

	int32toNumber (bytes) {
	    return (bytes[0] << 24) + (bytes[1] << 16) + (bytes[2] << 8) + bytes[3];
	}


	send(bytes) {
		let clientId = localStorage['clientId'];

		bytes = CryptoUtils.bytesToBase64(bytes);
		console.warn('>', bytes);
		bytes = Uint8Array.from(bytes, c => c.charCodeAt(0));

		// [cafebabe][payload len = 4 bytes][payload]

		let msgLength = bytes.length;
		var lenBytes = this.numberToInt32(msgLength);

		var payload = new Uint8Array(8 + msgLength);

		for (let i = 0; i < 4; i++) {
			payload[i] = this.messagePrefix[i];
		}

		for (let i = 0; i < 4; i++) {
			payload[i+4] = lenBytes[i];
		}

	    for (let i = 0; i < msgLength; i++) {
	        payload[i+8] = bytes[i];
		}
		this.sendNextChunk(payload, clientId);
        // return this.sendNextChunk(payload, clientId);
	}

	sendNextChunk = (payload, clientId) => {
	    let sent = 0;
	    let length = payload.length;
	    while (sent < length) {
			let tmp = new Uint8Array(this.mtu);
			let chunk = payload.slice(0, this.mtu);
			tmp.set(chunk, 0);
			this.writeQueue.push(tmp);
	        payload = payload.slice(this.mtu);
	    	sent += this.mtu;
		}
		// console.trace(this.writeQueue.length);
		if (this.ongoingTransfers === false) {
			this.processQueue();
		}
		else {
			console.log('Not processing queue because there are ongoing transfers');
		}
		// return this.processQueue();
	}

	receive(buffer) {
		buffer = new Uint8Array(buffer);
		// console.log('<<', buffer);
		switch (this.currState) {
			case States.WAITING:
				this.runWaiting(buffer);
				break;
			case States.RECEIVING:
				this.runReceiving(buffer);
				break;
			default:
				break;
		}
	}

	hasPrefix(buffer, prefix) {
		let uint8_buffer = new Uint8Array(buffer, 0, prefix.length);
		for (var i = 0; i < prefix.length; i++) {
			if (uint8_buffer[i] !== prefix[i]) {
				return false;
			}
		}
		return true;
	}

	hasStartBytes(buffer) {
		return this.hasPrefix(buffer, this.messagePrefix);
	}

	runWaiting(buffer) {
		var length = new Uint8Array(4);
		var uint8_buffer = new Uint8Array(buffer);

		if (this.hasStartBytes(buffer)) {
			for (let i = 0; i < 4; i++) {
				length[i] = uint8_buffer[i + 4];
			}
			this.totalLength = this.int32toNumber(length);
			this.totalReceived = uint8_buffer.length - 8;
			this.buffer = new Uint8Array(this.totalLength);

			for (let i = 0; i < uint8_buffer.length; i++) {
				this.buffer[i] = uint8_buffer[i+8];
			}
			this.currState = States.RECEIVING;
			this.checkBuffer();
		}
		else {
			console.warn('Did not find message prefix.');
			this.resetState();
		}
	}

	runReceiving(buffer) {
		var uint8_buffer = new Uint8Array(buffer);

		if (this.hasStartBytes(uint8_buffer) === false) {
			var received = uint8_buffer.byteLength;

			for (let i = 0; i < received; i++) {
				this.buffer[this.totalReceived + i] = uint8_buffer[i];
			}

			this.totalReceived += received;
			this.checkBuffer();
		}
		else {
			// found start bytes in the middle of the stream
			// handle as a new stream
			this.resetState();
			this.runWaiting(buffer);
		}
	}

	checkBuffer() {
		if (this.totalReceived >= this.totalLength) {
			if (this.messageCallback) {
				let buffer = String.fromCharCode.apply(null, this.buffer);
				console.log('<', buffer);
				buffer = CryptoUtils.base64ToBytes(buffer);
				this.messageCallback(buffer);
			}
			this.resetState();
		}
	}

	resetState() {
		this.currState = States.WAITING;
		this.buffer = undefined;
		this.totalReceived = 0;
		this.totalLength = 0;
	}

	findMTU() {
		let range = [23, 24, 64, 99, 101, 127, 200, 247];

		let currentIndex = 0;

		let rejectRoutine = (result) => {
			if (currentIndex == 0) {
				return range[0];
			}
			else {
				return range[currentIndex-1];
			}
		};
		let resolveRoutine = (result) => {
			if (range.indexOf(result) < range.length -1) {
				currentIndex++;
				return this.attemptMTU(range[currentIndex])
					.then(resolveRoutine)
					.catch(rejectRoutine);
			}
			return range[currentIndex];
		};

		let p = new Promise((resolve, reject) => {
			resolve(this.attemptMTU(range[currentIndex])
				.then(resolveRoutine)
				.catch(rejectRoutine));
		});

		return p;
	}

	attemptMTU(mtu) {
		var p = new Promise((resolve, reject) => {
			let buffer = new Uint8Array(mtu);
			this.channel(buffer)
			.then(() => {
				console.log('success with mtu ', mtu);
				resolve(mtu);
			}).catch((error) => {
				console.log('failed with mtu ', mtu);
				reject(mtu);
			});
		});
		return p;
	}

	processQueue() {
		this.ongoingTransfers = true;
		var p = new Promise((resolve, reject) => {
			if (this.writeQueue.length > 0) {
				let chunk = this.writeQueue[0];
				this.writeQueue = this.writeQueue.slice(1);
				console.log('>>', chunk);
				this.channel(chunk)
				.then(() => {
					return this.processQueue();
				}).catch((error) => {
					this.ongoingTransfers = false;
					console.error(error);
				}).then((result) => {
					resolve(result);
				});
			}
			else {
				this.ongoingTransfers = false;
				resolve({});
			}
		});
		return p;
	}
}

export default Stream;