import Message from './Message'
import maia_pb from './maia_pb';

class MessageUtils {
	static buildMessage(payload) {
		let msg = new Message();
		msg.setObjectPayload(payload);
		return msg;
	}
}

export default MessageUtils;