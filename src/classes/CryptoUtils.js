import * as base64 from "byte-base64";

class CryptoUtils {
	bytesToBase64(msg) {
		return base64.bytesToBase64(msg);
	}

	base64ToBytes(msg) {
		return base64.base64ToBytes(msg);
	}

	clientIdToBytes(clientId) {
		var prefix = clientId.slice(0, 4);
		return Uint8Array.from(prefix, c => c.charCodeAt(0));
	}

	clientIdFromBytes(clientId) {
		var prefix = clientId.slice(0, 4);
		return this.bytesToBase64(prefix);
	}
}

const singletonInstance = new CryptoUtils();

export default singletonInstance;