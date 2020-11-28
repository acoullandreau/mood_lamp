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
		let payload = new TextDecoder("utf-8").decode(this.obj.getPayload());
		payload = JSON.parse(payload);
		return payload;
	}

	setObjectPayload(obj) {
		var obj_str = JSON.stringify(obj);
		let payload = new TextEncoder("utf-8").encode(obj_str);
		this.obj.setPayload(payload);
	}

	serializeBinary() {
		return this.obj.serializeBinary();
	}

	deserializeBinary(buffer) {
		this.obj = maia_pb.Message.deserializeBinary(buffer);
	}
}

export default Message;