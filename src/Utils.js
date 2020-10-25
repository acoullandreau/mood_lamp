

class Utils {

	static convertHexToRGB(hex) {

		var HEX_START = '^(?:#?|0x?)';
		var HEX_INT_SINGLE = '([0-9a-fA-F]{1})';
		var HEX_INT_DOUBLE = '([0-9a-fA-F]{2})';
		var REGEX_HEX_3 = new RegExp(HEX_START + HEX_INT_SINGLE + HEX_INT_SINGLE + HEX_INT_SINGLE + '$');
		var REGEX_HEX_6 = new RegExp(HEX_START + HEX_INT_DOUBLE + HEX_INT_DOUBLE + HEX_INT_DOUBLE + '$');
		var match;
		var r,
		g,
		b;

		if (REGEX_HEX_3.exec(hex)) {
			match = REGEX_HEX_3.exec(hex);
			r = parseInt(match[1], 16) * 17;
			g = parseInt(match[2], 16) * 17;
			b = parseInt(match[3], 16) * 17;
		} else if (REGEX_HEX_6.exec(hex)) {
			match = REGEX_HEX_6.exec(hex);
			r = parseInt(match[1], 16);
			g = parseInt(match[2], 16);
			b = parseInt(match[3], 16);
		} 

		if (match) {
			return { r: r, g: g, b: b }
		} else {
			throw new Error('Invalid hex string');
		}

	}

	static convertRGBToString(rgb) {

		var rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
		return rgbString;

	}

}

export default Utils;
