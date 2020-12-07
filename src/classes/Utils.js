

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

	static componentToHex(c) {
		var hex = c.toString(16);
		return hex.length === 1 ? "0" + hex : hex;
	}

	static convertRGBStringtoHex(rgb) {
		return "#" + Utils.componentToHex(rgb.r) + Utils.componentToHex(rgb.g) + Utils.componentToHex(rgb.b);
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
		default:
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

	static capitalize = (s) => {
		if (typeof(s) === 'string') {
			return s.charAt(0).toUpperCase() + s.slice(1)
		}
		return ''
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

	static getSpecialGradient(id) {
		var gradient;

		if (id === 8){
			//fish bowl effect
			gradient =`
				radial-gradient(circle, rgba(255,147,41,1) 2%, rgba(135,117,113,1) 20%, rgba(31,67,102,1) 100%)
			`
		} else if (id === 10){
			// fire effect
			gradient =`
				linear-gradient(0deg, rgba(57,57,57,1) 2%, rgba(227,61,16,1) 17%, rgba(251,199,80,1) 89%, rgba(254,250,221,1) 100%)
			`
		} else if (id === 14){
			// beach effect
			gradient =`
				linear-gradient(0deg, rgba(198,169,144,1) 39%, rgba(71,183,203,1) 62%)
			`
		} else if (id === 19){
			// Christmas effect
			gradient =`
				linear-gradient(23deg, rgba(67,108,58,1) 60%, rgba(194,122,126,1) 77%, rgba(12,11,82,1) 85%, rgba(251,194,41,1) 90%)
			`
		} else if (id === 21){
			// rainbow effect
			gradient =`
				linear-gradient(270deg, rgba(115,230,221,1) 15%, rgba(115,141,230,1) 40%, rgba(230,121,115,1) 65%, rgba(230,220,115,1) 85%)
			`
		} else if (id === 23){
			// summer holidays effect
			gradient =`
				linear-gradient(180deg, rgba(246,174,44,1) 15%, rgba(23,83,150,1) 36%, rgba(237,212,185,1) 65%, rgba(164,188,39,1) 90%)
			`
		} else if (id === 24) {
			gradient =`
				linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%),
            	linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%),
            	linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)
			`
		} else if (id === 25) {
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
