import { v4 as uuidv4 } from 'uuid';
import maia_pb from './maia_pb';

class Message {
	constructor(payload) {
		this.obj = new maia_pb.Message();
		if (payload) {
			this.obj.setPayload(payload);
		}
		this.obj.setUuid(uuidv4());
	}

	getUUID() {
		return this.obj.getUuid();
	}

	getPayload() {
		return this.obj.getPayload();
		// let payload = new TextDecoder("utf-8").decode(this.obj.getPayload());
		// payload = JSON.parse(payload);
		// return payload;
	}

	setObjectPayload(payload) {
		// var obj_str = JSON.stringify(obj);
		// let payload = new TextEncoder("utf-8").encode(obj_str);
		this.obj.setPayload(payload);
	}

	setCommand(command) {
		this.obj.setCommand(command);
	}

	getCommand(command) {
		this.obj.getCommand();
	}

	serializeBinary() {
		return this.obj.serializeBinary();
	}

	deserializeBinary(buffer) {
		this.obj = maia_pb.Message.deserializeBinary(buffer);
	}

	static deserializeBinary(buffer) {
		let message = new Message();
		message.deserializeBinary(buffer);
		return message;
	}
}

export default Message;