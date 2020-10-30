

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

	static convertHextoHSV(hex) {
		var rgb = Utils.convertHexToRGB(hex);

		var r = rgb.r / 255;
		var g = rgb.g / 255;
		var b = rgb.b / 255;
		var max = Math.max(r, g, b);
		var min = Math.min(r, g, b);
		var delta = max - min;
		var hue = 0;
		var value = max;
		var saturation = max === 0 ? 0 : delta / max;

		switch (max) {
		case min:
			hue = 0; // achromatic
			break;
		case r:
			hue = (g - b) / delta + (g < b ? 6 : 0);
			break;
		case g:
			hue = (b - r) / delta + 2;
			break;
		case b:
			hue = (r - g) / delta + 4;
			break;
		}

		return {
			h: hue * 60 % 360,
			s: Utils.clamp(saturation * 100, 0, 100),
			v: Utils.clamp(value * 100, 0, 100)
		};

	}

	static clamp(num, min, max) {
		return Math.min(Math.max(num, min), max);
	}

	static getGradient(colors) {
		var gradient = [];

		for (var k=0 ; k < colors.length ; k++) {
			var item = Utils.convertRGBToString(colors[k]);
			gradient.push(item)
		}
		var linearGradient = `linear-gradient(45deg, ${gradient.join(',')})`;

		return linearGradient;

	}

	static getSpecialGradient(name) {
		var gradient;
		if (name === 'Fête') {
			gradient =`
				linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%),
            	linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%),
            	linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)
			`
		} else {
			gradient = `
				linear-gradient( 
					217deg,
					rgba(222,168,248,1) 0%, 
					rgba(168,222,258,1) 21.9%, 
					rgba(189,250,205,1) 35.6%, 
					rgba(243,250,189,1) 53.9%, 
					rgba(250,227,189,1) 66.8%, 
					rgba(248,172,171,1) 95%, 
					rgba(254,170,212,1) 99.9% 
				)
			`
		}

		return gradient;
	}

}

export default Utils;
