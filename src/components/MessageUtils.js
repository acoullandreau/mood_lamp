import Message from './Message'

class MessageUtils {
	static buildMessage(payload) {
		let msg = new Message();
		msg.setObjectPayload(payload);
		return msg;
	}
}

export default MessageUtils;