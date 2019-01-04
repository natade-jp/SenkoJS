/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ArrayList {
	
	constructor() {
		this.element = [];
		if(arguments.length === 1) {
			for(let i = 0; i < arguments[0].element.length; i++) {
				this.element[i] = arguments[0].element[i];
			}
		}
	}

	each(func) {
		let out = true;
		for(let i = 0; i < this.element.length; i++) {
			const x = this.element[i];
			if(func.call(x, i, x) === false) {
				out = false;
				break;
			}
		}
		return out;
	}
	
	toString() {
		return this.join(", ");
	}
	
	isEmpty() {
		return this.element.length === 0;
	}
	
	contains(object) {
		return this.element.contains(object);
	}
	
	size() {
		return this.element.length;
	}
	
	clear() {
		this.element.length = 0;
	}
	
	join(separator) {
		if(arguments.length === 0) {
			separator = ",";
		}
		return this.element.join(separator);
	}
	
	clone() {
		const out = new ArrayList();
		for(let i = 0; i < this.element.length; i++) {
			out.element[i] = this.element[i];
		}
		return out;
	}
	
	indexOf(object) {
		for(let i = 0; i < this.element.length; i++) {
			if(this.element[i] === object) {
				return i;
			}
		}
		return -1;
	}
	
	lastIndexOf(object) {
		for(let i = this.element.length - 1; i !== -1; i--) {
			if(this.element[i] === object) {
				return i;
			}
		}
		return -1;
	}
	
	get(index) {
		return this.element[index];
	}
	
	add() {
		if(arguments.length === 1) {
			const object = arguments[0];
			this.element.push(object);
		}
		else if(arguments.length === 2) {
			const index = arguments[0];
			const object = arguments[1];
			this.element.splice(index, 0, object);
		}
	}
	
	addAll() {
		if(arguments.length === 1) {
			const list  = arguments[0];
			let j = this.element.length;
			for(let i = 0; i < list.length; i++) {
				this.element[j++] = list.element[i];
			}
		}
		else if(arguments.length === 2) {
			let index = arguments[0];
			let list  = arguments[1].element;
			if(list === this.element) {
				list = this.element.slice(0);
			}
			let size = this.element.length - index;
			let target_i = this.element.length + list.length - 1;
			let source_i = this.element.length - 1;
			for(let i = 0; i < size ; i++ ) {
				this.element[target_i--] = this.element[source_i--];
			}
			size = list.length;
			for(let i = 0; i < size; i++) {
				this.element[index++] = list[i];
			}
		}
	}
	
	set(index, object) {
		this.element[index] = object;
	}
	
	remove(index) {
		this.element.splice(index, 1);
	}
	
	removeRange(fromIndex, toIndex) {
		this.element.splice(fromIndex, toIndex - fromIndex);
	}
	
	sort(compareFunction) {
		let compare;
		if(arguments.length === 0) {
			// 比較関数
			compare = function(a, b) {
				if(a === b) {
					return(0);
				}
				if(typeof a === typeof b) {
					return(a < b ? -1 : 1);
				}
				return ((typeof a < typeof b) ? -1 : 1);
			};
		}
		else {
			compare = compareFunction;
		}
		const temp = [];
		// ソート関数（安定マージソート）
		const sort = function(element, first, last, cmp_function) { 
			if(first < last) {
				const middle = Math.floor((first + last) / 2);
				sort(element, first, middle, cmp_function);
				sort(element, middle + 1, last, cmp_function);
				let p = 0, i, j, k;
				for(i = first; i <= middle; i++) {
					temp[p++] = element[i];
				}
				i = middle + 1;
				j = 0;
				k = first;
				while((i <= last) && (j < p)) {
					if(cmp_function(element[i], temp[j]) >= 0) {
						element[k++] = temp[j++];
					}
					else {
						element[k++] = element[i++];
					}
				}
				while(j < p) {
					element[k++] = temp[j++];
				}
			}
			return true;
		};
		sort(this.element, 0, this.element.length - 1, compare);
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

// 色を扱うクラス
//
// 【参考】
// HSV色空間 / HLS色空間
// https://ja.wikipedia.org/wiki/HSV%E8%89%B2%E7%A9%BA%E9%96%93
// https://ja.wikipedia.org/wiki/HLS%E8%89%B2%E7%A9%BA%E9%96%93

class Color {
		
	constructor() {
		// 中身は 0 ~ 1に正規化した値とする
		this.r = 0.0;
		this.g = 0.0;
		this.b = 0.0;
		this.a = 1.0;
	}
	
	clone() {
		const color = new Color();
		color.r = this.r;
		color.g = this.g;
		color.b = this.b;
		color.a = this.a;
		return color;
	}

	toString() {
		return	"Color[" +
				this.getCSSHex() + ", " +
				this.getCSS255() + ", " +
				this.getCSSPercent() + "]";
	}
	
	static _flact(x) {
		return(x - Math.floor(x));
	}

	static _hex(x) {
		x = Math.round(x * 255.0).toString(16);
		if(x.length === 1) {
			return "0" + x;
		}
		else {
			return x;
		}
	}

	_setRGB(r, g, b, a) {
		this.r = r;
		this.g = g;
		this.b = b;
		if(a) this.a = a;
		return this;
	}

	_setHSV(h, s, v, a) {
		let i, f;

		this.r = v;
		this.g = v;
		this.b = v;
		if(a) this.a = a;

		if(s > 0.0) {
			h *= 6.0;
			i = ~~Math.floor(h);
			f = h - i;
			if(i === 0) {
				this.g *= 1.0 - s * (1.0 - f);
				this.b *= 1.0 - s;
			}
			else if(i === 1) {
				this.r *= 1.0 - s * f;
				this.b *= 1.0 - s;
			}
			else if(i === 2) {
				this.r *= 1.0 - s;
				this.b *= 1.0 - s * (1.0 - f);
			}
			else if(i === 3) {
				this.r *= 1.0 - s;
				this.g *= 1.0 - s * f;
			}
			else if(i === 4) {
				this.r *= 1.0 - s * (1.0 - f);
				this.g *= 1.0 - s;
			}
			else if(i === 5) {
				this.g *= 1.0 - s;
				this.b *= 1.0 - s * f;
			}
		}
		return this;
	}

	_setHSL(h, s, l, a) {

		if(a) this.a = a;

		if(s === 0.0) {
			this.r = 0.0;
			this.g = 0.0;
			this.b = 0.0;
			return this;
		}

		let max;
		if(l < 0.5) {
			max = l * (1.0 + s);
		}
		else {
			max = l * (1.0 - s) + s;
		}
		const min = 2.0 * l - max;
		const delta = max - min;

		h *= 6.0;
		const i = ~~Math.floor(h);
		const f = h - i;

		if(i === 0) {
			this.r = max;
			this.g = max - delta * (1.0 - f);
			this.b = min;
		}
		else if(i === 1) {
			this.r = min + delta * (1.0 - f);
			this.g = max;
			this.b = min;
		}
		else if(i === 2) {
			this.r = min;
			this.g = max;
			this.b = max - delta * (1.0 - f);
		}
		else if(i === 3) {
			this.r = min;
			this.g = min + delta * (1.0 - f);
			this.b = max;
		}
		else if(i === 4) {
			this.r = max - delta * (1.0 - f);
			this.g = min;
			this.b = max;
		}
		else if(i === 5) {
			this.r = max;
			this.g = min;
			this.b = min + delta * (1.0 - f);
		}

		return this;
	}

	_getRGB() {
		return {
			r : this.r,
			g : this.g,
			b : this.b,
			a : this.a
		};
	}

	_getHSV() {
		const max = Math.max( this.r, this.g, this.b );
		const min = Math.min( this.r, this.g, this.b );
		const delta = max - min;

		let h   = 0;
		let s   = max - min;
		const v = max;

		if(max !== 0.0) {
			s /= max;
		}

		if(delta === 0.0) {
			return [h, s, v];
		}

		if(max === this.r) {
			h = (this.g - this.b) / delta;
			if (h < 0.0) {
				h += 6.0;
			}
		}
		else if(max === this.g) {
			h = 2.0 + (this.b - this.r) / delta;
		}
		else {
			h = 4.0 + (this.r - this.g) / delta;
		}
		h /= 6.0;

		return {
			h : h,
			s : s,
			v : v,
			a : this.a
		};
	}

	_getHSL() {

		const max   = Math.max( this.r, this.g, this.b );
		const min   = Math.min( this.r, this.g, this.b );

		const l = (max + min) * 0.5;
		const delta = max - min;

		if(delta === 0) {
			return [0, l, 0];
		}

		let s;
		if(l < 0.5) {
			s = delta / (max + min);
		}
		else {
			s = delta / (2.0 - max - min);
		}

		let h;
		if(max === this.r) {
			h = (this.g - this.b) / delta;
			if (h < 0.0) {
				h += 6.0;
			}
		}
		else if(max === this.g) {
			h = 2.0 + (this.b - this.r) / delta;
		}
		else {
			h = 4.0 + (this.r - this.g) / delta;
		}
		h /= 6.0;

		return {
			h : h,
			s : s,
			l : l,
			a : this.a
		};
	}

	getNormalizedRGB() {
		return this._getRGB();
	}

	getRGB() {
		return {
			r : Math.round(this.r * 255.0),
			g : Math.round(this.g * 255.0),
			b : Math.round(this.b * 255.0),
			a : Math.round(this.a * 255.0)
		};
	}

	getRGB24() {
		return(	(Math.round(255.0 * this.r) << 16) |
				(Math.round(255.0 * this.g) << 8 ) |
				(Math.round(255.0 * this.b)      ));
	}

	getRGB32() {
		return( (Math.round(255.0 * this.a) << 24) |
				(Math.round(255.0 * this.r) << 16) |
				(Math.round(255.0 * this.g) << 8 ) |
				(Math.round(255.0 * this.b)      ));
	}

	getNormalizedHSV() {
		return this._getHSV();
	}

	getHSV() {
		const color = this.getNormalizedHSV();
		color.h = Math.round(color.h * 360.0);
		color.s = Math.round(color.s * 255.0);
		color.v = Math.round(color.v * 255.0);
		color.a = Math.round(color.a * 255.0);
		return color;
	}

	getNormalizedHSL() {
		return this._getHSL();
	}

	getHSL() {
		const color = this.getNormalizedHSL();
		color.h = Math.round(color.h * 360.0);
		color.s = Math.round(color.s * 255.0);
		color.l = Math.round(color.l * 255.0);
		color.a = Math.round(color.a * 255.0);
		return color;
	}

	getRed() {
		return Math.round(this.r * 255.0);
	}

	getGreen() {
		return Math.round(this.g * 255.0);
	}

	getBlue() {
		return Math.round(this.b * 255.0);
	}

	getAlpha() {
		return Math.round(this.b * 255.0);
	}

	brighter() {
		const FACTOR = 1.0 / 0.7;
		const color = new Color();
		color.r = Math.min( this.r * FACTOR, 1.0);
		color.g = Math.min( this.g * FACTOR, 1.0);
		color.b = Math.min( this.b * FACTOR, 1.0);
		color.a = this.a;
		return color;
	}

	darker() {
		const FACTOR = 0.7;
		const color = new Color();
		color.r = Math.max( this.r * FACTOR, 0.0);
		color.g = Math.max( this.g * FACTOR, 0.0);
		color.b = Math.max( this.b * FACTOR, 0.0);
		color.a = this.a;
		return color;
	}

	getCSSHex() {
		if(this.a === 1.0) {
			return "#" +
				Color._hex(this.r) + 
				Color._hex(this.g) +
				Color._hex(this.b);
		}
		else {
			return "#" +
				Color._hex(this.a) + 
				Color._hex(this.r) + 
				Color._hex(this.g) +
				Color._hex(this.b);
		}
	}

	getCSS255() {
		if(this.a === 1.0) {
			return "rgb(" +
			Math.round(this.r * 255) + "," +
			Math.round(this.g * 255) + "," +
			Math.round(this.b * 255) + ")";
		}
		else {
			return "rgba(" +
			Math.round(this.r * 255) + "," +
			Math.round(this.g * 255) + "," +
			Math.round(this.b * 255) + "," +
			this.a + ")";
		}
	}

	getCSSPercent() {
		if(this.a === 1.0) {
			return "rgb(" +
			Math.round(this.r * 100) + "%," +
			Math.round(this.g * 100) + "%," +
			Math.round(this.b * 100) + "%)";
		}
		else {
			return "rgba(" +
			Math.round(this.r * 100) + "%," +
			Math.round(this.g * 100) + "%," +
			Math.round(this.b * 100) + "%," +
			Math.round(this.a * 100) + "%)";
		}
	}

	static newColorNormalizedRGB() {
		let r = 0.0;
		let g = 0.0;
		let b = 0.0;
		let a = 1.0;
		if(arguments.length === 1) {
			if(arguments[0].r) r = arguments[0].r;
			if(arguments[0].g) g = arguments[0].g;
			if(arguments[0].b) b = arguments[0].b;
			if(arguments[0].a) a = arguments[0].a;
			if (arguments[0].length >= 3) {
				r = arguments[0][0];
				g = arguments[0][1];
				b = arguments[0][2];
			}
			if (arguments[0].length >= 4) {
				a = arguments[0][3];
			}
		}
		else {
			if(arguments.length >= 3) {
				r = arguments[0];
				g = arguments[1];
				b = arguments[2];
			}
			if (arguments.length >= 4) {
				a = arguments[3];
			}
		}
		const color = new Color();
		color.r = Math.min(Math.max(r, 0.0), 1.0);
		color.g = Math.min(Math.max(g, 0.0), 1.0);
		color.b = Math.min(Math.max(b, 0.0), 1.0);
		color.a = Math.min(Math.max(a, 0.0), 1.0);
		return color;
	}
	
	static newColorRGB() {
		let r = 0.0;
		let g = 0.0;
		let b = 0.0;
		let a = 255.0;
		if(arguments.length >= 3) {
			r = arguments[0];
			g = arguments[1];
			b = arguments[2];
			if (arguments.length >= 4) {
				a = arguments[3];
			}
		}
		else if(arguments.length >= 1) {
			if(typeof arguments[0] === "number") {
				r = (arguments[0] >> 16) & 0xff;
				g = (arguments[0] >> 8) & 0xff;
				b =  arguments[0] & 0xff;
				if(arguments[1]) {
					a = (arguments[0] >> 24) & 0xff;
				}
			}
			else if(typeof arguments[0].length === "undefined") {
				if(arguments[0].r) r = arguments[0].r;
				if(arguments[0].g) g = arguments[0].g;
				if(arguments[0].b) b = arguments[0].b;
				if(arguments[0].a) a = arguments[0].a;
			}
			else if (arguments[0].length >= 3) {
				r = arguments[0][0];
				g = arguments[0][1];
				b = arguments[0][2];
				if (arguments[0].length >= 4) {
					a = arguments[0][3];
				}
			}
		}
		const color = new Color();
		color.r = Math.min(Math.max(r / 255.0, 0.0), 1.0);
		color.g = Math.min(Math.max(g / 255.0, 0.0), 1.0);
		color.b = Math.min(Math.max(b / 255.0, 0.0), 1.0);
		color.a = Math.min(Math.max(a / 255.0, 0.0), 1.0);
		return color;
	}

	static newColorNormalizedHSV() {
		let h = 0.0;
		let s = 0.0;
		let v = 0.0;
		let a = 1.0;
		if(arguments.length === 1) {
			if(arguments[0].h) h = arguments[0].h;
			if(arguments[0].s) s = arguments[0].s;
			if(arguments[0].v) v = arguments[0].v;
			if(arguments[0].a) a = arguments[0].a;
			if (arguments[0].length >= 3) {
				h = arguments[0][0];
				s = arguments[0][1];
				v = arguments[0][2];
			}
			if (arguments[0].length >= 4) {
				a = arguments[0][3];
			}
		}
		else {
			if(arguments.length >= 3) {
				h = arguments[0];
				s = arguments[1];
				v = arguments[2];
			}
			if (arguments.length >= 4) {
				a = arguments[3];
			}
		}
		s = Math.min(Math.max(s, 0.0), 1.0);
		v = Math.min(Math.max(v, 0.0), 1.0);
		a = Math.min(Math.max(a, 0.0), 1.0);
		const color = new Color();
		color._setHSV( Color._flact(h), s, v, a );
		return color;
	}

	static newColorHSV() {
		let h = 0.0;
		let s = 0.0;
		let v = 0.0;
		let a = 255.0;
		if(arguments.length === 1) {
			if(arguments[0].h) h = arguments[0].h;
			if(arguments[0].s) s = arguments[0].s;
			if(arguments[0].v) v = arguments[0].v;
			if(arguments[0].a) a = arguments[0].a;
			if (arguments[0].length >= 3) {
				h = arguments[0][0];
				s = arguments[0][1];
				v = arguments[0][2];
			}
			if (arguments[0].length >= 4) {
				a = arguments[0][3];
			}
		}
		else {
			if(arguments.length >= 3) {
				h = arguments[0];
				s = arguments[1];
				v = arguments[2];
			}
			if (arguments.length >= 4) {
				a = arguments[3];
			}
		}
		return Color.newColorNormalizedHSV(
			h / 360.0,
			s / 255.0,
			v / 255.0,
			a / 255.0
		);
	}

	static newColorNormalizedHSL() {
		let h = 0.0;
		let s = 0.0;
		let l = 0.0;
		let a = 1.0;
		if(arguments.length === 1) {
			if(arguments[0].h) h = arguments[0].h;
			if(arguments[0].s) s = arguments[0].s;
			if(arguments[0].l) l = arguments[0].l;
			if(arguments[0].a) a = arguments[0].a;
			if (arguments[0].length >= 3) {
				h = arguments[0][0];
				s = arguments[0][1];
				l = arguments[0][2];
			}
			if (arguments[0].length >= 4) {
				a = arguments[0][3];
			}
		}
		else {
			if(arguments.length >= 3) {
				h = arguments[0];
				s = arguments[1];
				l = arguments[2];
			}
			if (arguments.length >= 4) {
				a = arguments[3];
			}
		}
		s = Math.min(Math.max(s, 0.0), 1.0);
		l = Math.min(Math.max(l, 0.0), 1.0);
		a = Math.min(Math.max(a, 0.0), 1.0);
		const color = new Color();
		color._setHSL( Color._flact(h), s, l, a );
		return color;
	}

	static newColorHSL() {
		let h = 0.0;
		let s = 0.0;
		let l = 0.0;
		let a = 255.0;
		if(arguments.length === 1) {
			if(arguments[0].h) h = arguments[0].h;
			if(arguments[0].s) s = arguments[0].s;
			if(arguments[0].l) l = arguments[0].l;
			if(arguments[0].a) a = arguments[0].a;
			if (arguments[0].length >= 3) {
				h = arguments[0][0];
				s = arguments[0][1];
				l = arguments[0][2];
			}
			if (arguments[0].length >= 4) {
				a = arguments[0][3];
			}
		}
		else {
			if(arguments.length >= 3) {
				h = arguments[0];
				s = arguments[1];
				l = arguments[2];
			}
			if (arguments.length >= 4) {
				a = arguments[3];
			}
		}
		return Color.newColorNormalizedHSL(
			h / 360.0,
			s / 255.0,
			l / 255.0,
			a / 255.0
		);
	}
}

Color.white			= Color.newColorRGB(0xffffff);
Color.lightGray		= Color.newColorRGB(0xd3d3d3);
Color.gray			= Color.newColorRGB(0x808080);
Color.darkGray		= Color.newColorRGB(0xa9a9a9);
Color.black			= Color.newColorRGB(0x000000);
Color.red			= Color.newColorRGB(0xff0000);
Color.pink			= Color.newColorRGB(0xffc0cb);
Color.orange		= Color.newColorRGB(0xffa500);
Color.yellow		= Color.newColorRGB(0xffff00);
Color.green			= Color.newColorRGB(0x008000);
Color.magenta		= Color.newColorRGB(0xff00ff);
Color.cyan			= Color.newColorRGB(0x00ffff);
Color.blue			= Color.newColorRGB(0x0000ff);

Color.WHITE			= Color.white;
Color.LIGHT_GRAY	= Color.lightGray;
Color.GRAY			= Color.gray;
Color.DARK_GRAY		= Color.darkGray;
Color.RED			= Color.red;
Color.PINK			= Color.pink;
Color.ORANGE		= Color.orange;
Color.YELLOW		= Color.yellow;
Color.GREEN			= Color.green;
Color.MAGENTA		= Color.magenta;
Color.CYAN			= Color.cyan;
Color.BLUE			= Color.blue;

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const CSVTool = {
	
	parseCSV: function(text, separator) {
		if(arguments.length < 2) {
			separator = ",";
		}
		// 改行コードの正規化
		text = text.replace(/\r\n?|\n/g, "\n");
		const CODE_SEPARATOR = separator.charCodeAt(0);
		const CODE_CR    = 0x0D;
		const CODE_LF    = 0x0A;
		const CODE_DOUBLEQUOTES = 0x22;
		const out = [];
		const length = text.length;
		let element = "";
		let count_rows    = 0;
		let count_columns = 0;
		let isnextelement = false;
		let isnextline    = false;
		for(let i = 0; i < length; i++) {
			let code = text.charCodeAt(i);
			// 複数行なら一気に全て読み込んでしまう(1文字目がダブルクォーテーションかどうか)
			if((code === CODE_DOUBLEQUOTES)&&(element.length === 0)) {
				i++;
				for(;i < length;i++) {
					code = text.charCodeAt(i);
					if(code === CODE_DOUBLEQUOTES) {
						// フィールドの終了か？
						// 文字としてのダブルクォーテーションなのか
						if((i + 1) !== (length - 1)) {
							if(text.charCodeAt(i + 1) === CODE_DOUBLEQUOTES) {
								i++;
								element += "\""; 
							}
							else {
								break;
							}
						}
						else {
							break;
						}
					}
					else {
						element += text.charAt(i);
					}
				}
			}
			// 複数行以外なら1文字ずつ解析
			else {
				switch(code) {
					case(CODE_SEPARATOR):
						isnextelement = true;
						break;
					case(CODE_CR):
					case(CODE_LF):
						isnextline = true;
						break;
					default:
						break;
				}
				if(isnextelement) {
					isnextelement = false;
					if(out[count_rows] === undefined) {
						out[count_rows] = [];
					}
					out[count_rows][count_columns] = element;
					element = "";
					count_columns += 1;
				}
				else if(isnextline) {
					isnextline = false;
					//文字があったり、改行がある場合は処理
					//例えば CR+LF や 最後のフィールド で改行しているだけなどは無視できる
					if((element !== "")||(count_columns !== 0)) {
						if(out[count_rows] === undefined) {
							out[count_rows] = [];
						}
						out[count_rows][count_columns] = element;
						element = "";
						count_rows    += 1;
						count_columns  = 0;
					}
				}
				else {
					element += text.charAt(i);
				}
			}
			// 最終行に改行がない場合
			if(i === length - 1) {
				if(count_columns !== 0) {
					out[count_rows][count_columns] = element;
				}
			}
		}
		return out;
	},
	
	makeCSV: function(text, separator, newline) {
		if(arguments.length < 2) {
			separator = ",";
		}
		if(arguments.length < 3) {
			newline = "\r\n";
		}
		let out = "";
		const escape = /["\r\n,\t]/;
		if(text !== undefined) {
			for(let i = 0;i < text.length;i++) {
				if(text[i] !== undefined) {
					for(let j = 0;j < text[i].length;j++) {
						let element = text[i][j];
						if(escape.test(element)) {
							element = element.replace(/"/g, "\"\"");
							element = "\"" + element + "\"";
						}
						out += element;
						if(j !== text[i].length - 1) {
							out += separator;
						}
					}
				}
				out += newline;
			}
		}
		return out;
	}
};

class File$1 {
	
	constructor(pathname) {
		this.isHTML = (typeof window !== "undefined");
		this.isNode = false;
		if(arguments.length !== 1) {
			throw "IllegalArgumentException";
		}
		else if((typeof pathname === "string")||(pathname instanceof String)) {
			// \を/に置き換える
			this.pathname = pathname.replace(/\\/g, "/" );
		}
		else if(pathname instanceof File$1) {
			this.pathname = pathname.getAbsolutePath();
		}
		else {
			throw "IllegalArgumentException";
		}
	}

	delete_() {
		throw "IllegalMethod";
	}
	
	exists() {
		throw "IllegalMethod";
	}
	
	copy() {
		throw "IllegalMethod";
	}
	
	move() {
		throw "IllegalMethod";
	}
	
	toString() {
		return this.getAbsolutePath();
	}
	
	getName() {
		if(this.isHTML) {
			// 最後がスラッシュで終えている場合は、ファイル名取得できない
			if(this.isDirectory()) {
				return "";
			}
			const slashsplit = this.pathname.split("/");
			return slashsplit[slashsplit.length - 1];
		}
		else if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	// 親フォルダの絶対パス名
	getParent() {
		const x = this.getAbsolutePath().match(/.*[/\\]/)[0];
		return x.substring(0 ,x.length - 1);
	}
	
	getParentFile() {
		return new File$1(this.getParent());
	}
	
	getExtensionName() {
		if(this.isHTML) {
			const dotlist = this.getName().split(".");
			return dotlist[dotlist.length - 1];
		}
		else if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	isAbsolute() {
		if(this.isHTML) {
			return this.getAbsolutePath() === this.pathname;
		}
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	isDirectory() {
		if(this.isHTML) {
			// 最後がスラッシュで終えている場合はディレクトリ
			return /\/$/.test(this.pathname);
		}
		else if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	isFile() {
		if(this.isHTML) {
			// 最後がスラッシュで終えていない場合はファイル
			return /[^/]$/.test(this.pathname);
		}
		else if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	isHidden() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	lastModified() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	setLastModified() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	length() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	getFiles() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	getSubFolders() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	getNormalizedPathName() {
		if(this.pathname === "") {
			return ".\\";
		}
		let name = this.pathname.replace(/\//g, "\\");
		if(name.slice(-1) !== "\\") {
			name += "\\";
		}
		return name;
	}
	
	getAllFiles() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	list() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	getAbsolutePath() {
		if(this.isHTML) {
			let all_path = null;
			// URLを一度取得する
			if(/^http/.test(this.pathname)) {
				all_path = this.pathname;
			}
			else {
				let curdir = window.location.toString();
				// 最後がスラッシュで終えていないは、ファイル部分を削る
				if(!(/\/$/.test(curdir))) {
					curdir = curdir.match(/.*\//)[0];
				}
				all_path = curdir + this.pathname;
			}
			// ホストとファイルに分ける
			const hosttext = all_path.match(/^http[^/]+\/\/[^/]+\//)[0];
			const filetext = all_path.substr(hosttext.length);
			// パスを1つずつ解析しながら辿っていく
			let name = hosttext;
			const namelist = filetext.split("/");
			let i;
			for(i = 0; i < namelist.length; i++) {
				if((namelist[i] === "") || (namelist[i] === ".")) {
					continue;
				}
				if(namelist[i] === "..") {
					name = name.substring(0 ,name.length - 1).match(/.*\//)[0];
					continue;
				}
				name += namelist[i];
				if(i !== namelist.length - 1) {
					name += "/";
				}
			}
			return name;
		}
		else if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	mkdir() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	mkdirs() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	renameTo() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	run() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	writeLine() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	download(callback) {
		if(this.isHTML) {
			const ext = this.getExtensionName().toLocaleString();
			const that = this;
			if((ext === "gif") || (ext === "jpg") || (ext === "png") || (ext === "bmp") || (ext === "svg") || (ext === "jpeg")) {
				const image = new Image();
				image.onload = function() {
					that.dataImage = image;
					callback(that);
				};
				image.src = this.pathname;
			}
			else {
				const http = File$1.createXMLHttpRequest();
				if(http === null) {
					return null;
				}
				const handleHttpResponse = function (){
					// readyState === 0 UNSENT
					// readyState === 1 OPENED
					// readyState === 2 HEADERS_RECEIVED
					// readyState === 3 LOADING
					if(http.readyState === 4) { // DONE
						if(http.status !== 200) {
							console.log("error downloadText " + that.pathname);
							return null;
						}
						that.dataText = http.responseText;
						callback(that);
					}
				};
				http.onreadystatechange = handleHttpResponse;
				http.open("GET", this.pathname, true);
				http.send(null);
			}
		}
		else if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	getImage() {
		if(this.isHTML) {
			return this.dataImage;
		}
	}
	
	getText() {
		if(this.isHTML) {
			return this.dataText;
		}
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	setText() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	getCSV(separator, charset, newline) {
		if(this.isHTML) {
			return(CSVTool.parseCSV(this.dataText, separator, newline));
		}
		else if(this.isNode) {
			throw "IllegalMethod";
		}
	}

	setCSV() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}

	getByte() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}

	setByte() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	static createTempFile(){
		const isHTML = (typeof window !== "undefined");
		if(isHTML) {
			throw "not createTempFile";
		}
	}
	
	static getCurrentDirectory(){
		const isHTML = (typeof window !== "undefined");
		if(isHTML) {
			const file = new File$1("./");
			return file.getParent();
		}
	}
	
	static setCurrentDirectory() {
		const isHTML = (typeof window !== "undefined");
		if(isHTML) {
			throw "not setCurrentDirectory";
		}
	}
	
	static searchFile(){
		const isHTML = (typeof window !== "undefined");
		if(isHTML) {
			throw "not searchFile";
		}
	}
	
	static downloadFileList(files, lastCallback, fileCallback) {
		let downloadcount = 0;
		let i;
		const inf = function(filenumber) {
			return function() {
				downloadcount++;
				if(fileCallback && fileCallback.length && fileCallback[filenumber] ) {
					fileCallback[filenumber](files[filenumber]);
				}
				if(downloadcount === files.length) {
					if(lastCallback) {
						lastCallback(files);
					}
				}
			};
		};
		for(i = 0; i < files.length; i++ ) {
			files[i].download(inf(i));
		}
	}

	static createXMLHttpRequest() {
		return new XMLHttpRequest();
	}
	
	static getCSVTool() {
		return CSVTool;
	}
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class HashMap {
	
	constructor() {
		this.map = [];
		this.size_ = 0;
		if(arguments.length === 1) {
			for(const key in arguments[0].map) {
				this.map[key] =arguments[0].map[key];
			}
			this.size_ = arguments[0].size_;
		}
	}

	each(func) {
		let out = true;
		for(const key in this.map) {
			const x = this.map[key];
			if(func.call(x, key, x) === false) {
				out = false;
				break;
			}
		}
		return out;
	}
	
	toString() {
		let output = "";
		let i = 0;
		for(const key in this.map) {
			output += key + "=>" + this.map[key];
			i++;
			if(i !== this.size_) {
				output += "\n";
			}
		}
		return output;
	}
	
	containsKey(key) {
		return (typeof this.map[key] !== "undefined");
	}
	
	containsValue(value) {
		for(const key in this.map) {
			if(this.map[key] === value) {
				return true;
			}
		}
		return false;
	}
	
	isEmpty() {
		return (this.size_ === 0);
	}
	
	clear() {
		this.map   = [];
		this.size_ = 0;
	}
	
	clone() {
		const out = new HashMap();
		for(const key in this.map) {
			out.map[key] = this.map[key];
		}
		out.size_ = this.size_;
		return out;
	}
	
	size() {
		return this.size_;
	}
	
	get(key) {
		return this.map[key];
	}
	
	put(key, value) {
		if(this.containsKey(key) === false) {
			this.map[key] = value;
			this.size_ = this.size_ + 1;
			return null;
		}
		else {
			const output = this.map[key];
			this.map[key] = value;
			return output;
		}
	}
	
	putAll(hashmap) {
		for(const key in hashmap.map) {
			if(typeof this.map[key] === "undefined") {
				this.map[key] = hashmap.map[key];
				this.size_ = this.size_ + 1;
			}
		}
	}
	
	remove(key) {
		if(this.containsKey(key) === false) {
			return null;
		}
		else {
			const output = this.map[key];
			delete this.map[key];
			this.size_ = this.size_ - 1;
			return output;
		}
	}
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class Unicode {

	/**
	 * サロゲートペアの上位
	 * @param {String} text 対象テキスト
	 * @param {Number} index インデックス
	 * @returns {Boolean} 確認結果
	 */
	static isHighSurrogateAt(text, index) {
		const ch = text.charCodeAt(index);
		return ((0xD800 <= ch) && (ch <= 0xDBFF));
	}

	/**
	 * サロゲートペアの下位
	 * @param {String} text 対象テキスト
	 * @param {Number} index インデックス
	 * @returns {Boolean} 確認結果
	 */
	static isLowSurrogateAt(text, index) {
		const ch = text.charCodeAt(index);
		return ((0xDC00 <= ch) && (ch <= 0xDFFF));
	}
	
	/**
	 * サロゲートペアか
	 * @param {String} text 対象テキスト
	 * @param {Number} index インデックス
	 * @returns {Boolean} 確認結果
	 */
	static isSurrogatePairAt(text, index) {
		const ch = text.charCodeAt(index);
		return ((0xD800 <= ch) && (ch <= 0xDFFF));
	}
	
	/**
	 * サロゲートペア対応のコードポイント取得
	 * @param {String} text 対象テキスト
	 * @param {Number} index インデックス
	 * @returns {Number} コードポイント
	 */
	static codePointAt(text, index) {
		if(Unicode.isHighSurrogateAt(text, index)) {
			const high = text.charCodeAt(index);
			const low  = text.charCodeAt(index + 1);
			return ((((high - 0xD800) << 10) | (low - 0xDC00)) + 0x10000);
		}
		else {
			return (text.charCodeAt(index));
		}
	}

	/**
	 * インデックスの前にあるコードポイント
	 * @param {String} text 対象テキスト
	 * @param {Number} index インデックス
	 * @returns {Number} コードポイント
	 */
	static codePointBefore(text, index) {
		if(!Unicode.isLowSurrogateAt(text, index - 1)) {
			return (text.charCodeAt(index - 1));
		}
		else {
			return (text.codePointAt(index - 2));
		}
	}

	/**
	 * コードポイント換算で文字列数を調査する
	 * @param {String} text 対象テキスト
	 * @param {Number} beginIndex 最初のインデックス（省略可）
	 * @param {Number} endIndex 最後のインデックス（ここは含めない）（省略可）
	 * @returns {Number} 文字数
	 */
	static codePointCount(text, beginIndex, endIndex) {
		if(arguments.length < 2) {
			beginIndex = 0;
		}
		if(arguments.length < 3) {
			endIndex = text.length;
		}
		let count = 0;
		for(;beginIndex < endIndex;beginIndex++) {
			count++;
			if(Unicode.isSurrogatePairAt(text, beginIndex)) {
				beginIndex++;
			}
		}
		return count;
	}

	/**
	 * コードポイント換算で文字列配列の位置を計算
	 * @param {String} text 対象テキスト
	 * @param {Number} index オフセット
	 * @param {Number} codePointOffset ずらすコードポイント数
	 * @returns {Number} ずらしたインデックス
	 */
	static offsetByCodePoints(text, index, codePointOffset) {
		let count = 0;
		if(codePointOffset === 0) {
			return (index);
		}
		if(codePointOffset > 0) {
			for(;index < text.length;index++) {
				count++;
				if(Unicode.isHighSurrogateAt(text, index)) {
					index++;
				}
				if(count === codePointOffset) {
					return (index + 1);
				}
			}

		}
		else {
			codePointOffset = -codePointOffset;
			for(;index >= 0;index--) {
				count++;
				if(Unicode.isLowSurrogateAt(text, index - 1)) {
					index--;
				}
				if(count === codePointOffset) {
					return (index - 1);
				}
			}
		}
		return false;
	}

	/**
	 * コードポイントの数値データを文字列へ変換します
	 * @param {Array} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static fromCodePoint() {
		let codepoint_array = [];
		if(arguments[0].length) {
			codepoint_array = arguments[0];
		}
		else {
			codepoint_array = arguments;
		}
		const text = [];
		for(let i = 0;i < codepoint_array.length;i++) {
			const codepoint = codepoint_array[i];
			if(0x10000 <= codepoint) {
				const high = (( codepoint - 0x10000 ) >> 10) + 0xD800;
				const low  = (codepoint & 0x3FF) + 0xDC00;
				text[text.length] = String.fromCharCode(high);
				text[text.length] = String.fromCharCode(low);
			}
			else {
				text[text.length] = String.fromCharCode(codepoint);
			}
		}
		return(text.join(""));
	}

	/**
	 * 文字列をUTF32(コードポイント)の配列へ変換します。
	 * @param {String} text 変換したいテキスト
	 * @returns {Array} UTF32(コードポイント)のデータが入った配列
	 */
	static toUTF32Array(text) {
		const utf32 = [];
		for(let i = 0; i < text.length; i = Unicode.offsetByCodePoints(text, i, 1)) {
			utf32.push(Unicode.codePointAt(text, i));
		}
		return utf32;
	}

	/**
	 * UTF32の配列から文字列へ戻します。
	 * @param {Array} utf32 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static fromUTF32Array(utf32) {
		return Unicode.fromCodePoint(utf32);
	}

	/**
	 * 文字列をUTF16の配列へ変換します。
	 * @param {String} text 変換したいテキスト
	 * @returns {Array} UTF16のデータが入った配列
	 */
	static toUTF16Array(text) {
		const utf16 = [];
		for(let i = 0; i < text.length; i++) {
			utf16[i] = text.charCodeAt(i);
		}
		return utf16;
	}

	/**
	 * UTF16の配列から文字列へ戻します。
	 * @param {Array} utf16 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static fromUTF16Array(utf16) {
		const text = [];
		for(let i = 0; i < utf16.length; i++) {
			text[i] = String.fromCharCode(utf16[i]);
		}
		return text.join("");
	}

	/**
	 * 文字列をUTF8の配列へ変換します。
	 * @param {String} text 変換したいテキスト
	 * @returns {Array} UTF8のデータが入った配列
	 */
	static toUTF8Array(text) {
		const utf32 = Unicode.toUTF32Array(text);
		const utf8 = [];
		for(let i = 0; i < utf32.length; i++) {
			let codepoint = utf32[i];
			// 1バイト文字
			if(codepoint <= 0x7F) {
				utf8.push(codepoint);
				continue;
			}
			const buffer = [];
			let size = 0;
			// 2バイト以上
			if(codepoint < 0x800) {
				size = 2;
			}
			else if(codepoint < 0x10000) {
				size = 3;
			}
			else {
				size = 4;
			}
			for(let j = 0; j < size; j++) {
				let write = codepoint & ((1 << 6) - 1);
				if(j === size - 1) {
					if(size === 2) {
						write |= 0xC0; // 1100 0000
					}
					else if(size === 3) {
						write |= 0xE0; // 1110 0000
					}
					else {
						write |= 0xF0; // 1111 0000
					}
					buffer.push(write);
					break;
				}
				buffer.push(write | 0x80); // 1000 0000
				codepoint = codepoint >> 6;
			}
			// 反転
			for(let j = buffer.length - 1; j >= 0; j--) {
				utf8.push(buffer[j]);
			}
		}
		return utf8;
	}

	/**
	 * UTF8の配列から文字列へ戻します。
	 * @param {Array} utf8 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static fromUTF8Array(utf8) {
		const utf32 = [];
		let size = 0;
		let write = 0;
		for(let i = 0; i < utf8.length; i++) {
			const bin = utf8[i];
			if(bin < 0x80) {
				utf32.push(bin);
			}
			if(size === 0) {
				if(bin < 0xE0) {
					size = 1;
					write = bin & 0x1F; // 0001 1111
				}
				else if(bin < 0xF0) {
					size = 2;
					write = bin & 0xF; // 0000 1111
				}
				else {
					size = 3;
					write = bin & 0x7; // 0000 0111
				}
			}
			else {
				write <<= 6;
				write |= bin & 0x3F; // 0011 1111
				size--;
				if(size === 0) {
					utf32.push(write);
				}
			}
		}
		return Unicode.fromCodePoint(utf32);
	}

	/**
	 * 指定したテキストを切り出します。
	 * 単位は文字数となります。
	 * @param {String} text 切り出したいテキスト
	 * @param {Number} offset 切り出し位置
	 * @param {Number} size 切り出す長さ
	 * @returns {String} 切り出したテキスト
	 */
	static cutTextForCodePoint(text, offset, size) {
		const utf32 = Unicode.toUTF32Array(text);
		const cut = [];
		for(let i = 0, point = offset; ((i < size) && (point < utf32.length)); i++, point++) {
			cut.push(utf32[point]);
		}
		return Unicode.fromUTF32Array(cut);
	}
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class CP932MAP {

	static init() {
		if(CP932MAP.is_initmap) {
			return;
		}
		CP932MAP.is_initmap = true;
			
		// WideCharToMultiByte の動作を参考に作成したマップ
		const cp932_to_unicode_map = {
			0x01: 0x01, 0x02: 0x02, 0x03: 0x03, 0x04: 0x04, 0x05: 0x05, 0x06: 0x06, 0x07: 0x07, 0x08: 0x08,
			0x09: 0x09, 0x0a: 0x0a, 0x0b: 0x0b, 0x0c: 0x0c, 0x0d: 0x0d, 0x0e: 0x0e, 0x0f: 0x0f, 0x10: 0x10,
			0x11: 0x11, 0x12: 0x12, 0x13: 0x13, 0x14: 0x14, 0x15: 0x15, 0x16: 0x16, 0x17: 0x17, 0x18: 0x18,
			0x19: 0x19, 0x1a: 0x1a, 0x1b: 0x1b, 0x1c: 0x1c, 0x1d: 0x1d, 0x1e: 0x1e, 0x1f: 0x1f, 0x20: 0x20,
			0x21: 0x21, 0x22: 0x22, 0x23: 0x23, 0x24: 0x24, 0x25: 0x25, 0x26: 0x26, 0x27: 0x27, 0x28: 0x28,
			0x29: 0x29, 0x2a: 0x2a, 0x2b: 0x2b, 0x2c: 0x2c, 0x2d: 0x2d, 0x2e: 0x2e, 0x2f: 0x2f, 0x30: 0x30,
			0x31: 0x31, 0x32: 0x32, 0x33: 0x33, 0x34: 0x34, 0x35: 0x35, 0x36: 0x36, 0x37: 0x37, 0x38: 0x38,
			0x39: 0x39, 0x3a: 0x3a, 0x3b: 0x3b, 0x3c: 0x3c, 0x3d: 0x3d, 0x3e: 0x3e, 0x3f: 0x3f, 0x40: 0x40,
			0x41: 0x41, 0x42: 0x42, 0x43: 0x43, 0x44: 0x44, 0x45: 0x45, 0x46: 0x46, 0x47: 0x47, 0x48: 0x48,
			0x49: 0x49, 0x4a: 0x4a, 0x4b: 0x4b, 0x4c: 0x4c, 0x4d: 0x4d, 0x4e: 0x4e, 0x4f: 0x4f, 0x50: 0x50,
			0x51: 0x51, 0x52: 0x52, 0x53: 0x53, 0x54: 0x54, 0x55: 0x55, 0x56: 0x56, 0x57: 0x57, 0x58: 0x58,
			0x59: 0x59, 0x5a: 0x5a, 0x5b: 0x5b, 0x5c: 0x5c, 0x5d: 0x5d, 0x5e: 0x5e, 0x5f: 0x5f, 0x60: 0x60,
			0x61: 0x61, 0x62: 0x62, 0x63: 0x63, 0x64: 0x64, 0x65: 0x65, 0x66: 0x66, 0x67: 0x67, 0x68: 0x68,
			0x69: 0x69, 0x6a: 0x6a, 0x6b: 0x6b, 0x6c: 0x6c, 0x6d: 0x6d, 0x6e: 0x6e, 0x6f: 0x6f, 0x70: 0x70,
			0x71: 0x71, 0x72: 0x72, 0x73: 0x73, 0x74: 0x74, 0x75: 0x75, 0x76: 0x76, 0x77: 0x77, 0x78: 0x78,
			0x79: 0x79, 0x7a: 0x7a, 0x7b: 0x7b, 0x7c: 0x7c, 0x7d: 0x7d, 0x7e: 0x7e, 0x7f: 0x7f, 0x80: 0x80,
			0xa0: 0xf8f0, 0xa1: 0xff61, 0xa2: 0xff62, 0xa3: 0xff63, 0xa4: 0xff64, 0xa5: 0xff65, 0xa6: 0xff66, 0xa7: 0xff67,
			0xa8: 0xff68, 0xa9: 0xff69, 0xaa: 0xff6a, 0xab: 0xff6b, 0xac: 0xff6c, 0xad: 0xff6d, 0xae: 0xff6e, 0xaf: 0xff6f,
			0xb0: 0xff70, 0xb1: 0xff71, 0xb2: 0xff72, 0xb3: 0xff73, 0xb4: 0xff74, 0xb5: 0xff75, 0xb6: 0xff76, 0xb7: 0xff77,
			0xb8: 0xff78, 0xb9: 0xff79, 0xba: 0xff7a, 0xbb: 0xff7b, 0xbc: 0xff7c, 0xbd: 0xff7d, 0xbe: 0xff7e, 0xbf: 0xff7f,
			0xc0: 0xff80, 0xc1: 0xff81, 0xc2: 0xff82, 0xc3: 0xff83, 0xc4: 0xff84, 0xc5: 0xff85, 0xc6: 0xff86, 0xc7: 0xff87,
			0xc8: 0xff88, 0xc9: 0xff89, 0xca: 0xff8a, 0xcb: 0xff8b, 0xcc: 0xff8c, 0xcd: 0xff8d, 0xce: 0xff8e, 0xcf: 0xff8f,
			0xd0: 0xff90, 0xd1: 0xff91, 0xd2: 0xff92, 0xd3: 0xff93, 0xd4: 0xff94, 0xd5: 0xff95, 0xd6: 0xff96, 0xd7: 0xff97,
			0xd8: 0xff98, 0xd9: 0xff99, 0xda: 0xff9a, 0xdb: 0xff9b, 0xdc: 0xff9c, 0xdd: 0xff9d, 0xde: 0xff9e, 0xdf: 0xff9f,
			0xfd: 0xf8f1, 0xfe: 0xf8f2, 0xff: 0xf8f3,
			0x8140: 0x3000, 0x8141: 0x3001, 0x8142: 0x3002, 0x8143: 0xff0c, 0x8144: 0xff0e,
			0x8145: 0x30fb, 0x8146: 0xff1a, 0x8147: 0xff1b, 0x8148: 0xff1f, 0x8149: 0xff01, 0x814a: 0x309b, 0x814b: 0x309c, 0x814c: 0x00b4,
			0x814d: 0xff40, 0x814e: 0x00a8, 0x814f: 0xff3e, 0x8150: 0xffe3, 0x8151: 0xff3f, 0x8152: 0x30fd, 0x8153: 0x30fe, 0x8154: 0x309d,
			0x8155: 0x309e, 0x8156: 0x3003, 0x8157: 0x4edd, 0x8158: 0x3005, 0x8159: 0x3006, 0x815a: 0x3007, 0x815b: 0x30fc, 0x815c: 0x2015,
			0x815d: 0x2010, 0x815e: 0xff0f, 0x815f: 0xff3c, 0x8160: 0xff5e, 0x8161: 0x2225, 0x8162: 0xff5c, 0x8163: 0x2026, 0x8164: 0x2025,
			0x8165: 0x2018, 0x8166: 0x2019, 0x8167: 0x201c, 0x8168: 0x201d, 0x8169: 0xff08, 0x816a: 0xff09, 0x816b: 0x3014, 0x816c: 0x3015,
			0x816d: 0xff3b, 0x816e: 0xff3d, 0x816f: 0xff5b, 0x8170: 0xff5d, 0x8171: 0x3008, 0x8172: 0x3009, 0x8173: 0x300a, 0x8174: 0x300b,
			0x8175: 0x300c, 0x8176: 0x300d, 0x8177: 0x300e, 0x8178: 0x300f, 0x8179: 0x3010, 0x817a: 0x3011, 0x817b: 0xff0b, 0x817c: 0xff0d,
			0x817d: 0x00b1, 0x817e: 0x00d7, 0x8180: 0x00f7, 0x8181: 0xff1d, 0x8182: 0x2260, 0x8183: 0xff1c, 0x8184: 0xff1e, 0x8185: 0x2266,
			0x8186: 0x2267, 0x8187: 0x221e, 0x8188: 0x2234, 0x8189: 0x2642, 0x818a: 0x2640, 0x818b: 0x00b0, 0x818c: 0x2032, 0x818d: 0x2033,
			0x818e: 0x2103, 0x818f: 0xffe5, 0x8190: 0xff04, 0x8191: 0xffe0, 0x8192: 0xffe1, 0x8193: 0xff05, 0x8194: 0xff03, 0x8195: 0xff06,
			0x8196: 0xff0a, 0x8197: 0xff20, 0x8198: 0x00a7, 0x8199: 0x2606, 0x819a: 0x2605, 0x819b: 0x25cb, 0x819c: 0x25cf, 0x819d: 0x25ce,
			0x819e: 0x25c7, 0x819f: 0x25c6, 0x81a0: 0x25a1, 0x81a1: 0x25a0, 0x81a2: 0x25b3, 0x81a3: 0x25b2, 0x81a4: 0x25bd, 0x81a5: 0x25bc,
			0x81a6: 0x203b, 0x81a7: 0x3012, 0x81a8: 0x2192, 0x81a9: 0x2190, 0x81aa: 0x2191, 0x81ab: 0x2193, 0x81ac: 0x3013, 0x81b8: 0x2208,
			0x81b9: 0x220b, 0x81ba: 0x2286, 0x81bb: 0x2287, 0x81bc: 0x2282, 0x81bd: 0x2283, 0x81be: 0x222a, 0x81bf: 0x2229, 0x81c8: 0x2227,
			0x81c9: 0x2228, 0x81ca: 0xffe2, 0x81cb: 0x21d2, 0x81cc: 0x21d4, 0x81cd: 0x2200, 0x81ce: 0x2203, 0x81da: 0x2220, 0x81db: 0x22a5,
			0x81dc: 0x2312, 0x81dd: 0x2202, 0x81de: 0x2207, 0x81df: 0x2261, 0x81e0: 0x2252, 0x81e1: 0x226a, 0x81e2: 0x226b, 0x81e3: 0x221a,
			0x81e4: 0x223d, 0x81e5: 0x221d, 0x81e6: 0x2235, 0x81e7: 0x222b, 0x81e8: 0x222c, 0x81f0: 0x212b, 0x81f1: 0x2030, 0x81f2: 0x266f,
			0x81f3: 0x266d, 0x81f4: 0x266a, 0x81f5: 0x2020, 0x81f6: 0x2021, 0x81f7: 0x00b6, 0x81fc: 0x25ef, 0x824f: 0xff10, 0x8250: 0xff11,
			0x8251: 0xff12, 0x8252: 0xff13, 0x8253: 0xff14, 0x8254: 0xff15, 0x8255: 0xff16, 0x8256: 0xff17, 0x8257: 0xff18, 0x8258: 0xff19,
			0x8260: 0xff21, 0x8261: 0xff22, 0x8262: 0xff23, 0x8263: 0xff24, 0x8264: 0xff25, 0x8265: 0xff26, 0x8266: 0xff27, 0x8267: 0xff28,
			0x8268: 0xff29, 0x8269: 0xff2a, 0x826a: 0xff2b, 0x826b: 0xff2c, 0x826c: 0xff2d, 0x826d: 0xff2e, 0x826e: 0xff2f, 0x826f: 0xff30,
			0x8270: 0xff31, 0x8271: 0xff32, 0x8272: 0xff33, 0x8273: 0xff34, 0x8274: 0xff35, 0x8275: 0xff36, 0x8276: 0xff37, 0x8277: 0xff38,
			0x8278: 0xff39, 0x8279: 0xff3a, 0x8281: 0xff41, 0x8282: 0xff42, 0x8283: 0xff43, 0x8284: 0xff44, 0x8285: 0xff45, 0x8286: 0xff46,
			0x8287: 0xff47, 0x8288: 0xff48, 0x8289: 0xff49, 0x828a: 0xff4a, 0x828b: 0xff4b, 0x828c: 0xff4c, 0x828d: 0xff4d, 0x828e: 0xff4e,
			0x828f: 0xff4f, 0x8290: 0xff50, 0x8291: 0xff51, 0x8292: 0xff52, 0x8293: 0xff53, 0x8294: 0xff54, 0x8295: 0xff55, 0x8296: 0xff56,
			0x8297: 0xff57, 0x8298: 0xff58, 0x8299: 0xff59, 0x829a: 0xff5a, 0x829f: 0x3041, 0x82a0: 0x3042, 0x82a1: 0x3043, 0x82a2: 0x3044,
			0x82a3: 0x3045, 0x82a4: 0x3046, 0x82a5: 0x3047, 0x82a6: 0x3048, 0x82a7: 0x3049, 0x82a8: 0x304a, 0x82a9: 0x304b, 0x82aa: 0x304c,
			0x82ab: 0x304d, 0x82ac: 0x304e, 0x82ad: 0x304f, 0x82ae: 0x3050, 0x82af: 0x3051, 0x82b0: 0x3052, 0x82b1: 0x3053, 0x82b2: 0x3054,
			0x82b3: 0x3055, 0x82b4: 0x3056, 0x82b5: 0x3057, 0x82b6: 0x3058, 0x82b7: 0x3059, 0x82b8: 0x305a, 0x82b9: 0x305b, 0x82ba: 0x305c,
			0x82bb: 0x305d, 0x82bc: 0x305e, 0x82bd: 0x305f, 0x82be: 0x3060, 0x82bf: 0x3061, 0x82c0: 0x3062, 0x82c1: 0x3063, 0x82c2: 0x3064,
			0x82c3: 0x3065, 0x82c4: 0x3066, 0x82c5: 0x3067, 0x82c6: 0x3068, 0x82c7: 0x3069, 0x82c8: 0x306a, 0x82c9: 0x306b, 0x82ca: 0x306c,
			0x82cb: 0x306d, 0x82cc: 0x306e, 0x82cd: 0x306f, 0x82ce: 0x3070, 0x82cf: 0x3071, 0x82d0: 0x3072, 0x82d1: 0x3073, 0x82d2: 0x3074,
			0x82d3: 0x3075, 0x82d4: 0x3076, 0x82d5: 0x3077, 0x82d6: 0x3078, 0x82d7: 0x3079, 0x82d8: 0x307a, 0x82d9: 0x307b, 0x82da: 0x307c,
			0x82db: 0x307d, 0x82dc: 0x307e, 0x82dd: 0x307f, 0x82de: 0x3080, 0x82df: 0x3081, 0x82e0: 0x3082, 0x82e1: 0x3083, 0x82e2: 0x3084,
			0x82e3: 0x3085, 0x82e4: 0x3086, 0x82e5: 0x3087, 0x82e6: 0x3088, 0x82e7: 0x3089, 0x82e8: 0x308a, 0x82e9: 0x308b, 0x82ea: 0x308c,
			0x82eb: 0x308d, 0x82ec: 0x308e, 0x82ed: 0x308f, 0x82ee: 0x3090, 0x82ef: 0x3091, 0x82f0: 0x3092, 0x82f1: 0x3093, 0x8340: 0x30a1,
			0x8341: 0x30a2, 0x8342: 0x30a3, 0x8343: 0x30a4, 0x8344: 0x30a5, 0x8345: 0x30a6, 0x8346: 0x30a7, 0x8347: 0x30a8, 0x8348: 0x30a9,
			0x8349: 0x30aa, 0x834a: 0x30ab, 0x834b: 0x30ac, 0x834c: 0x30ad, 0x834d: 0x30ae, 0x834e: 0x30af, 0x834f: 0x30b0, 0x8350: 0x30b1,
			0x8351: 0x30b2, 0x8352: 0x30b3, 0x8353: 0x30b4, 0x8354: 0x30b5, 0x8355: 0x30b6, 0x8356: 0x30b7, 0x8357: 0x30b8, 0x8358: 0x30b9,
			0x8359: 0x30ba, 0x835a: 0x30bb, 0x835b: 0x30bc, 0x835c: 0x30bd, 0x835d: 0x30be, 0x835e: 0x30bf, 0x835f: 0x30c0, 0x8360: 0x30c1,
			0x8361: 0x30c2, 0x8362: 0x30c3, 0x8363: 0x30c4, 0x8364: 0x30c5, 0x8365: 0x30c6, 0x8366: 0x30c7, 0x8367: 0x30c8, 0x8368: 0x30c9,
			0x8369: 0x30ca, 0x836a: 0x30cb, 0x836b: 0x30cc, 0x836c: 0x30cd, 0x836d: 0x30ce, 0x836e: 0x30cf, 0x836f: 0x30d0, 0x8370: 0x30d1,
			0x8371: 0x30d2, 0x8372: 0x30d3, 0x8373: 0x30d4, 0x8374: 0x30d5, 0x8375: 0x30d6, 0x8376: 0x30d7, 0x8377: 0x30d8, 0x8378: 0x30d9,
			0x8379: 0x30da, 0x837a: 0x30db, 0x837b: 0x30dc, 0x837c: 0x30dd, 0x837d: 0x30de, 0x837e: 0x30df, 0x8380: 0x30e0, 0x8381: 0x30e1,
			0x8382: 0x30e2, 0x8383: 0x30e3, 0x8384: 0x30e4, 0x8385: 0x30e5, 0x8386: 0x30e6, 0x8387: 0x30e7, 0x8388: 0x30e8, 0x8389: 0x30e9,
			0x838a: 0x30ea, 0x838b: 0x30eb, 0x838c: 0x30ec, 0x838d: 0x30ed, 0x838e: 0x30ee, 0x838f: 0x30ef, 0x8390: 0x30f0, 0x8391: 0x30f1,
			0x8392: 0x30f2, 0x8393: 0x30f3, 0x8394: 0x30f4, 0x8395: 0x30f5, 0x8396: 0x30f6, 0x839f: 0x0391, 0x83a0: 0x0392, 0x83a1: 0x0393,
			0x83a2: 0x0394, 0x83a3: 0x0395, 0x83a4: 0x0396, 0x83a5: 0x0397, 0x83a6: 0x0398, 0x83a7: 0x0399, 0x83a8: 0x039a, 0x83a9: 0x039b,
			0x83aa: 0x039c, 0x83ab: 0x039d, 0x83ac: 0x039e, 0x83ad: 0x039f, 0x83ae: 0x03a0, 0x83af: 0x03a1, 0x83b0: 0x03a3, 0x83b1: 0x03a4,
			0x83b2: 0x03a5, 0x83b3: 0x03a6, 0x83b4: 0x03a7, 0x83b5: 0x03a8, 0x83b6: 0x03a9, 0x83bf: 0x03b1, 0x83c0: 0x03b2, 0x83c1: 0x03b3,
			0x83c2: 0x03b4, 0x83c3: 0x03b5, 0x83c4: 0x03b6, 0x83c5: 0x03b7, 0x83c6: 0x03b8, 0x83c7: 0x03b9, 0x83c8: 0x03ba, 0x83c9: 0x03bb,
			0x83ca: 0x03bc, 0x83cb: 0x03bd, 0x83cc: 0x03be, 0x83cd: 0x03bf, 0x83ce: 0x03c0, 0x83cf: 0x03c1, 0x83d0: 0x03c3, 0x83d1: 0x03c4,
			0x83d2: 0x03c5, 0x83d3: 0x03c6, 0x83d4: 0x03c7, 0x83d5: 0x03c8, 0x83d6: 0x03c9, 0x8440: 0x0410, 0x8441: 0x0411, 0x8442: 0x0412,
			0x8443: 0x0413, 0x8444: 0x0414, 0x8445: 0x0415, 0x8446: 0x0401, 0x8447: 0x0416, 0x8448: 0x0417, 0x8449: 0x0418, 0x844a: 0x0419,
			0x844b: 0x041a, 0x844c: 0x041b, 0x844d: 0x041c, 0x844e: 0x041d, 0x844f: 0x041e, 0x8450: 0x041f, 0x8451: 0x0420, 0x8452: 0x0421,
			0x8453: 0x0422, 0x8454: 0x0423, 0x8455: 0x0424, 0x8456: 0x0425, 0x8457: 0x0426, 0x8458: 0x0427, 0x8459: 0x0428, 0x845a: 0x0429,
			0x845b: 0x042a, 0x845c: 0x042b, 0x845d: 0x042c, 0x845e: 0x042d, 0x845f: 0x042e, 0x8460: 0x042f, 0x8470: 0x0430, 0x8471: 0x0431,
			0x8472: 0x0432, 0x8473: 0x0433, 0x8474: 0x0434, 0x8475: 0x0435, 0x8476: 0x0451, 0x8477: 0x0436, 0x8478: 0x0437, 0x8479: 0x0438,
			0x847a: 0x0439, 0x847b: 0x043a, 0x847c: 0x043b, 0x847d: 0x043c, 0x847e: 0x043d, 0x8480: 0x043e, 0x8481: 0x043f, 0x8482: 0x0440,
			0x8483: 0x0441, 0x8484: 0x0442, 0x8485: 0x0443, 0x8486: 0x0444, 0x8487: 0x0445, 0x8488: 0x0446, 0x8489: 0x0447, 0x848a: 0x0448,
			0x848b: 0x0449, 0x848c: 0x044a, 0x848d: 0x044b, 0x848e: 0x044c, 0x848f: 0x044d, 0x8490: 0x044e, 0x8491: 0x044f, 0x849f: 0x2500,
			0x84a0: 0x2502, 0x84a1: 0x250c, 0x84a2: 0x2510, 0x84a3: 0x2518, 0x84a4: 0x2514, 0x84a5: 0x251c, 0x84a6: 0x252c, 0x84a7: 0x2524,
			0x84a8: 0x2534, 0x84a9: 0x253c, 0x84aa: 0x2501, 0x84ab: 0x2503, 0x84ac: 0x250f, 0x84ad: 0x2513, 0x84ae: 0x251b, 0x84af: 0x2517,
			0x84b0: 0x2523, 0x84b1: 0x2533, 0x84b2: 0x252b, 0x84b3: 0x253b, 0x84b4: 0x254b, 0x84b5: 0x2520, 0x84b6: 0x252f, 0x84b7: 0x2528,
			0x84b8: 0x2537, 0x84b9: 0x253f, 0x84ba: 0x251d, 0x84bb: 0x2530, 0x84bc: 0x2525, 0x84bd: 0x2538, 0x84be: 0x2542, 0x8740: 0x2460,
			0x8741: 0x2461, 0x8742: 0x2462, 0x8743: 0x2463, 0x8744: 0x2464, 0x8745: 0x2465, 0x8746: 0x2466, 0x8747: 0x2467, 0x8748: 0x2468,
			0x8749: 0x2469, 0x874a: 0x246a, 0x874b: 0x246b, 0x874c: 0x246c, 0x874d: 0x246d, 0x874e: 0x246e, 0x874f: 0x246f, 0x8750: 0x2470,
			0x8751: 0x2471, 0x8752: 0x2472, 0x8753: 0x2473, 0x8754: 0x2160, 0x8755: 0x2161, 0x8756: 0x2162, 0x8757: 0x2163, 0x8758: 0x2164,
			0x8759: 0x2165, 0x875a: 0x2166, 0x875b: 0x2167, 0x875c: 0x2168, 0x875d: 0x2169, 0x875f: 0x3349, 0x8760: 0x3314, 0x8761: 0x3322,
			0x8762: 0x334d, 0x8763: 0x3318, 0x8764: 0x3327, 0x8765: 0x3303, 0x8766: 0x3336, 0x8767: 0x3351, 0x8768: 0x3357, 0x8769: 0x330d,
			0x876a: 0x3326, 0x876b: 0x3323, 0x876c: 0x332b, 0x876d: 0x334a, 0x876e: 0x333b, 0x876f: 0x339c, 0x8770: 0x339d, 0x8771: 0x339e,
			0x8772: 0x338e, 0x8773: 0x338f, 0x8774: 0x33c4, 0x8775: 0x33a1, 0x877e: 0x337b, 0x8780: 0x301d, 0x8781: 0x301f, 0x8782: 0x2116,
			0x8783: 0x33cd, 0x8784: 0x2121, 0x8785: 0x32a4, 0x8786: 0x32a5, 0x8787: 0x32a6, 0x8788: 0x32a7, 0x8789: 0x32a8, 0x878a: 0x3231,
			0x878b: 0x3232, 0x878c: 0x3239, 0x878d: 0x337e, 0x878e: 0x337d, 0x878f: 0x337c, 0x8790: 0x2252, 0x8791: 0x2261, 0x8792: 0x222b,
			0x8793: 0x222e, 0x8794: 0x2211, 0x8795: 0x221a, 0x8796: 0x22a5, 0x8797: 0x2220, 0x8798: 0x221f, 0x8799: 0x22bf, 0x879a: 0x2235,
			0x879b: 0x2229, 0x879c: 0x222a, 0x889f: 0x4e9c, 0x88a0: 0x5516, 0x88a1: 0x5a03, 0x88a2: 0x963f, 0x88a3: 0x54c0, 0x88a4: 0x611b,
			0x88a5: 0x6328, 0x88a6: 0x59f6, 0x88a7: 0x9022, 0x88a8: 0x8475, 0x88a9: 0x831c, 0x88aa: 0x7a50, 0x88ab: 0x60aa, 0x88ac: 0x63e1,
			0x88ad: 0x6e25, 0x88ae: 0x65ed, 0x88af: 0x8466, 0x88b0: 0x82a6, 0x88b1: 0x9bf5, 0x88b2: 0x6893, 0x88b3: 0x5727, 0x88b4: 0x65a1,
			0x88b5: 0x6271, 0x88b6: 0x5b9b, 0x88b7: 0x59d0, 0x88b8: 0x867b, 0x88b9: 0x98f4, 0x88ba: 0x7d62, 0x88bb: 0x7dbe, 0x88bc: 0x9b8e,
			0x88bd: 0x6216, 0x88be: 0x7c9f, 0x88bf: 0x88b7, 0x88c0: 0x5b89, 0x88c1: 0x5eb5, 0x88c2: 0x6309, 0x88c3: 0x6697, 0x88c4: 0x6848,
			0x88c5: 0x95c7, 0x88c6: 0x978d, 0x88c7: 0x674f, 0x88c8: 0x4ee5, 0x88c9: 0x4f0a, 0x88ca: 0x4f4d, 0x88cb: 0x4f9d, 0x88cc: 0x5049,
			0x88cd: 0x56f2, 0x88ce: 0x5937, 0x88cf: 0x59d4, 0x88d0: 0x5a01, 0x88d1: 0x5c09, 0x88d2: 0x60df, 0x88d3: 0x610f, 0x88d4: 0x6170,
			0x88d5: 0x6613, 0x88d6: 0x6905, 0x88d7: 0x70ba, 0x88d8: 0x754f, 0x88d9: 0x7570, 0x88da: 0x79fb, 0x88db: 0x7dad, 0x88dc: 0x7def,
			0x88dd: 0x80c3, 0x88de: 0x840e, 0x88df: 0x8863, 0x88e0: 0x8b02, 0x88e1: 0x9055, 0x88e2: 0x907a, 0x88e3: 0x533b, 0x88e4: 0x4e95,
			0x88e5: 0x4ea5, 0x88e6: 0x57df, 0x88e7: 0x80b2, 0x88e8: 0x90c1, 0x88e9: 0x78ef, 0x88ea: 0x4e00, 0x88eb: 0x58f1, 0x88ec: 0x6ea2,
			0x88ed: 0x9038, 0x88ee: 0x7a32, 0x88ef: 0x8328, 0x88f0: 0x828b, 0x88f1: 0x9c2f, 0x88f2: 0x5141, 0x88f3: 0x5370, 0x88f4: 0x54bd,
			0x88f5: 0x54e1, 0x88f6: 0x56e0, 0x88f7: 0x59fb, 0x88f8: 0x5f15, 0x88f9: 0x98f2, 0x88fa: 0x6deb, 0x88fb: 0x80e4, 0x88fc: 0x852d,
			0x8940: 0x9662, 0x8941: 0x9670, 0x8942: 0x96a0, 0x8943: 0x97fb, 0x8944: 0x540b, 0x8945: 0x53f3, 0x8946: 0x5b87, 0x8947: 0x70cf,
			0x8948: 0x7fbd, 0x8949: 0x8fc2, 0x894a: 0x96e8, 0x894b: 0x536f, 0x894c: 0x9d5c, 0x894d: 0x7aba, 0x894e: 0x4e11, 0x894f: 0x7893,
			0x8950: 0x81fc, 0x8951: 0x6e26, 0x8952: 0x5618, 0x8953: 0x5504, 0x8954: 0x6b1d, 0x8955: 0x851a, 0x8956: 0x9c3b, 0x8957: 0x59e5,
			0x8958: 0x53a9, 0x8959: 0x6d66, 0x895a: 0x74dc, 0x895b: 0x958f, 0x895c: 0x5642, 0x895d: 0x4e91, 0x895e: 0x904b, 0x895f: 0x96f2,
			0x8960: 0x834f, 0x8961: 0x990c, 0x8962: 0x53e1, 0x8963: 0x55b6, 0x8964: 0x5b30, 0x8965: 0x5f71, 0x8966: 0x6620, 0x8967: 0x66f3,
			0x8968: 0x6804, 0x8969: 0x6c38, 0x896a: 0x6cf3, 0x896b: 0x6d29, 0x896c: 0x745b, 0x896d: 0x76c8, 0x896e: 0x7a4e, 0x896f: 0x9834,
			0x8970: 0x82f1, 0x8971: 0x885b, 0x8972: 0x8a60, 0x8973: 0x92ed, 0x8974: 0x6db2, 0x8975: 0x75ab, 0x8976: 0x76ca, 0x8977: 0x99c5,
			0x8978: 0x60a6, 0x8979: 0x8b01, 0x897a: 0x8d8a, 0x897b: 0x95b2, 0x897c: 0x698e, 0x897d: 0x53ad, 0x897e: 0x5186, 0x8980: 0x5712,
			0x8981: 0x5830, 0x8982: 0x5944, 0x8983: 0x5bb4, 0x8984: 0x5ef6, 0x8985: 0x6028, 0x8986: 0x63a9, 0x8987: 0x63f4, 0x8988: 0x6cbf,
			0x8989: 0x6f14, 0x898a: 0x708e, 0x898b: 0x7114, 0x898c: 0x7159, 0x898d: 0x71d5, 0x898e: 0x733f, 0x898f: 0x7e01, 0x8990: 0x8276,
			0x8991: 0x82d1, 0x8992: 0x8597, 0x8993: 0x9060, 0x8994: 0x925b, 0x8995: 0x9d1b, 0x8996: 0x5869, 0x8997: 0x65bc, 0x8998: 0x6c5a,
			0x8999: 0x7525, 0x899a: 0x51f9, 0x899b: 0x592e, 0x899c: 0x5965, 0x899d: 0x5f80, 0x899e: 0x5fdc, 0x899f: 0x62bc, 0x89a0: 0x65fa,
			0x89a1: 0x6a2a, 0x89a2: 0x6b27, 0x89a3: 0x6bb4, 0x89a4: 0x738b, 0x89a5: 0x7fc1, 0x89a6: 0x8956, 0x89a7: 0x9d2c, 0x89a8: 0x9d0e,
			0x89a9: 0x9ec4, 0x89aa: 0x5ca1, 0x89ab: 0x6c96, 0x89ac: 0x837b, 0x89ad: 0x5104, 0x89ae: 0x5c4b, 0x89af: 0x61b6, 0x89b0: 0x81c6,
			0x89b1: 0x6876, 0x89b2: 0x7261, 0x89b3: 0x4e59, 0x89b4: 0x4ffa, 0x89b5: 0x5378, 0x89b6: 0x6069, 0x89b7: 0x6e29, 0x89b8: 0x7a4f,
			0x89b9: 0x97f3, 0x89ba: 0x4e0b, 0x89bb: 0x5316, 0x89bc: 0x4eee, 0x89bd: 0x4f55, 0x89be: 0x4f3d, 0x89bf: 0x4fa1, 0x89c0: 0x4f73,
			0x89c1: 0x52a0, 0x89c2: 0x53ef, 0x89c3: 0x5609, 0x89c4: 0x590f, 0x89c5: 0x5ac1, 0x89c6: 0x5bb6, 0x89c7: 0x5be1, 0x89c8: 0x79d1,
			0x89c9: 0x6687, 0x89ca: 0x679c, 0x89cb: 0x67b6, 0x89cc: 0x6b4c, 0x89cd: 0x6cb3, 0x89ce: 0x706b, 0x89cf: 0x73c2, 0x89d0: 0x798d,
			0x89d1: 0x79be, 0x89d2: 0x7a3c, 0x89d3: 0x7b87, 0x89d4: 0x82b1, 0x89d5: 0x82db, 0x89d6: 0x8304, 0x89d7: 0x8377, 0x89d8: 0x83ef,
			0x89d9: 0x83d3, 0x89da: 0x8766, 0x89db: 0x8ab2, 0x89dc: 0x5629, 0x89dd: 0x8ca8, 0x89de: 0x8fe6, 0x89df: 0x904e, 0x89e0: 0x971e,
			0x89e1: 0x868a, 0x89e2: 0x4fc4, 0x89e3: 0x5ce8, 0x89e4: 0x6211, 0x89e5: 0x7259, 0x89e6: 0x753b, 0x89e7: 0x81e5, 0x89e8: 0x82bd,
			0x89e9: 0x86fe, 0x89ea: 0x8cc0, 0x89eb: 0x96c5, 0x89ec: 0x9913, 0x89ed: 0x99d5, 0x89ee: 0x4ecb, 0x89ef: 0x4f1a, 0x89f0: 0x89e3,
			0x89f1: 0x56de, 0x89f2: 0x584a, 0x89f3: 0x58ca, 0x89f4: 0x5efb, 0x89f5: 0x5feb, 0x89f6: 0x602a, 0x89f7: 0x6094, 0x89f8: 0x6062,
			0x89f9: 0x61d0, 0x89fa: 0x6212, 0x89fb: 0x62d0, 0x89fc: 0x6539, 0x8a40: 0x9b41, 0x8a41: 0x6666, 0x8a42: 0x68b0, 0x8a43: 0x6d77,
			0x8a44: 0x7070, 0x8a45: 0x754c, 0x8a46: 0x7686, 0x8a47: 0x7d75, 0x8a48: 0x82a5, 0x8a49: 0x87f9, 0x8a4a: 0x958b, 0x8a4b: 0x968e,
			0x8a4c: 0x8c9d, 0x8a4d: 0x51f1, 0x8a4e: 0x52be, 0x8a4f: 0x5916, 0x8a50: 0x54b3, 0x8a51: 0x5bb3, 0x8a52: 0x5d16, 0x8a53: 0x6168,
			0x8a54: 0x6982, 0x8a55: 0x6daf, 0x8a56: 0x788d, 0x8a57: 0x84cb, 0x8a58: 0x8857, 0x8a59: 0x8a72, 0x8a5a: 0x93a7, 0x8a5b: 0x9ab8,
			0x8a5c: 0x6d6c, 0x8a5d: 0x99a8, 0x8a5e: 0x86d9, 0x8a5f: 0x57a3, 0x8a60: 0x67ff, 0x8a61: 0x86ce, 0x8a62: 0x920e, 0x8a63: 0x5283,
			0x8a64: 0x5687, 0x8a65: 0x5404, 0x8a66: 0x5ed3, 0x8a67: 0x62e1, 0x8a68: 0x64b9, 0x8a69: 0x683c, 0x8a6a: 0x6838, 0x8a6b: 0x6bbb,
			0x8a6c: 0x7372, 0x8a6d: 0x78ba, 0x8a6e: 0x7a6b, 0x8a6f: 0x899a, 0x8a70: 0x89d2, 0x8a71: 0x8d6b, 0x8a72: 0x8f03, 0x8a73: 0x90ed,
			0x8a74: 0x95a3, 0x8a75: 0x9694, 0x8a76: 0x9769, 0x8a77: 0x5b66, 0x8a78: 0x5cb3, 0x8a79: 0x697d, 0x8a7a: 0x984d, 0x8a7b: 0x984e,
			0x8a7c: 0x639b, 0x8a7d: 0x7b20, 0x8a7e: 0x6a2b, 0x8a80: 0x6a7f, 0x8a81: 0x68b6, 0x8a82: 0x9c0d, 0x8a83: 0x6f5f, 0x8a84: 0x5272,
			0x8a85: 0x559d, 0x8a86: 0x6070, 0x8a87: 0x62ec, 0x8a88: 0x6d3b, 0x8a89: 0x6e07, 0x8a8a: 0x6ed1, 0x8a8b: 0x845b, 0x8a8c: 0x8910,
			0x8a8d: 0x8f44, 0x8a8e: 0x4e14, 0x8a8f: 0x9c39, 0x8a90: 0x53f6, 0x8a91: 0x691b, 0x8a92: 0x6a3a, 0x8a93: 0x9784, 0x8a94: 0x682a,
			0x8a95: 0x515c, 0x8a96: 0x7ac3, 0x8a97: 0x84b2, 0x8a98: 0x91dc, 0x8a99: 0x938c, 0x8a9a: 0x565b, 0x8a9b: 0x9d28, 0x8a9c: 0x6822,
			0x8a9d: 0x8305, 0x8a9e: 0x8431, 0x8a9f: 0x7ca5, 0x8aa0: 0x5208, 0x8aa1: 0x82c5, 0x8aa2: 0x74e6, 0x8aa3: 0x4e7e, 0x8aa4: 0x4f83,
			0x8aa5: 0x51a0, 0x8aa6: 0x5bd2, 0x8aa7: 0x520a, 0x8aa8: 0x52d8, 0x8aa9: 0x52e7, 0x8aaa: 0x5dfb, 0x8aab: 0x559a, 0x8aac: 0x582a,
			0x8aad: 0x59e6, 0x8aae: 0x5b8c, 0x8aaf: 0x5b98, 0x8ab0: 0x5bdb, 0x8ab1: 0x5e72, 0x8ab2: 0x5e79, 0x8ab3: 0x60a3, 0x8ab4: 0x611f,
			0x8ab5: 0x6163, 0x8ab6: 0x61be, 0x8ab7: 0x63db, 0x8ab8: 0x6562, 0x8ab9: 0x67d1, 0x8aba: 0x6853, 0x8abb: 0x68fa, 0x8abc: 0x6b3e,
			0x8abd: 0x6b53, 0x8abe: 0x6c57, 0x8abf: 0x6f22, 0x8ac0: 0x6f97, 0x8ac1: 0x6f45, 0x8ac2: 0x74b0, 0x8ac3: 0x7518, 0x8ac4: 0x76e3,
			0x8ac5: 0x770b, 0x8ac6: 0x7aff, 0x8ac7: 0x7ba1, 0x8ac8: 0x7c21, 0x8ac9: 0x7de9, 0x8aca: 0x7f36, 0x8acb: 0x7ff0, 0x8acc: 0x809d,
			0x8acd: 0x8266, 0x8ace: 0x839e, 0x8acf: 0x89b3, 0x8ad0: 0x8acc, 0x8ad1: 0x8cab, 0x8ad2: 0x9084, 0x8ad3: 0x9451, 0x8ad4: 0x9593,
			0x8ad5: 0x9591, 0x8ad6: 0x95a2, 0x8ad7: 0x9665, 0x8ad8: 0x97d3, 0x8ad9: 0x9928, 0x8ada: 0x8218, 0x8adb: 0x4e38, 0x8adc: 0x542b,
			0x8add: 0x5cb8, 0x8ade: 0x5dcc, 0x8adf: 0x73a9, 0x8ae0: 0x764c, 0x8ae1: 0x773c, 0x8ae2: 0x5ca9, 0x8ae3: 0x7feb, 0x8ae4: 0x8d0b,
			0x8ae5: 0x96c1, 0x8ae6: 0x9811, 0x8ae7: 0x9854, 0x8ae8: 0x9858, 0x8ae9: 0x4f01, 0x8aea: 0x4f0e, 0x8aeb: 0x5371, 0x8aec: 0x559c,
			0x8aed: 0x5668, 0x8aee: 0x57fa, 0x8aef: 0x5947, 0x8af0: 0x5b09, 0x8af1: 0x5bc4, 0x8af2: 0x5c90, 0x8af3: 0x5e0c, 0x8af4: 0x5e7e,
			0x8af5: 0x5fcc, 0x8af6: 0x63ee, 0x8af7: 0x673a, 0x8af8: 0x65d7, 0x8af9: 0x65e2, 0x8afa: 0x671f, 0x8afb: 0x68cb, 0x8afc: 0x68c4,
			0x8b40: 0x6a5f, 0x8b41: 0x5e30, 0x8b42: 0x6bc5, 0x8b43: 0x6c17, 0x8b44: 0x6c7d, 0x8b45: 0x757f, 0x8b46: 0x7948, 0x8b47: 0x5b63,
			0x8b48: 0x7a00, 0x8b49: 0x7d00, 0x8b4a: 0x5fbd, 0x8b4b: 0x898f, 0x8b4c: 0x8a18, 0x8b4d: 0x8cb4, 0x8b4e: 0x8d77, 0x8b4f: 0x8ecc,
			0x8b50: 0x8f1d, 0x8b51: 0x98e2, 0x8b52: 0x9a0e, 0x8b53: 0x9b3c, 0x8b54: 0x4e80, 0x8b55: 0x507d, 0x8b56: 0x5100, 0x8b57: 0x5993,
			0x8b58: 0x5b9c, 0x8b59: 0x622f, 0x8b5a: 0x6280, 0x8b5b: 0x64ec, 0x8b5c: 0x6b3a, 0x8b5d: 0x72a0, 0x8b5e: 0x7591, 0x8b5f: 0x7947,
			0x8b60: 0x7fa9, 0x8b61: 0x87fb, 0x8b62: 0x8abc, 0x8b63: 0x8b70, 0x8b64: 0x63ac, 0x8b65: 0x83ca, 0x8b66: 0x97a0, 0x8b67: 0x5409,
			0x8b68: 0x5403, 0x8b69: 0x55ab, 0x8b6a: 0x6854, 0x8b6b: 0x6a58, 0x8b6c: 0x8a70, 0x8b6d: 0x7827, 0x8b6e: 0x6775, 0x8b6f: 0x9ecd,
			0x8b70: 0x5374, 0x8b71: 0x5ba2, 0x8b72: 0x811a, 0x8b73: 0x8650, 0x8b74: 0x9006, 0x8b75: 0x4e18, 0x8b76: 0x4e45, 0x8b77: 0x4ec7,
			0x8b78: 0x4f11, 0x8b79: 0x53ca, 0x8b7a: 0x5438, 0x8b7b: 0x5bae, 0x8b7c: 0x5f13, 0x8b7d: 0x6025, 0x8b7e: 0x6551, 0x8b80: 0x673d,
			0x8b81: 0x6c42, 0x8b82: 0x6c72, 0x8b83: 0x6ce3, 0x8b84: 0x7078, 0x8b85: 0x7403, 0x8b86: 0x7a76, 0x8b87: 0x7aae, 0x8b88: 0x7b08,
			0x8b89: 0x7d1a, 0x8b8a: 0x7cfe, 0x8b8b: 0x7d66, 0x8b8c: 0x65e7, 0x8b8d: 0x725b, 0x8b8e: 0x53bb, 0x8b8f: 0x5c45, 0x8b90: 0x5de8,
			0x8b91: 0x62d2, 0x8b92: 0x62e0, 0x8b93: 0x6319, 0x8b94: 0x6e20, 0x8b95: 0x865a, 0x8b96: 0x8a31, 0x8b97: 0x8ddd, 0x8b98: 0x92f8,
			0x8b99: 0x6f01, 0x8b9a: 0x79a6, 0x8b9b: 0x9b5a, 0x8b9c: 0x4ea8, 0x8b9d: 0x4eab, 0x8b9e: 0x4eac, 0x8b9f: 0x4f9b, 0x8ba0: 0x4fa0,
			0x8ba1: 0x50d1, 0x8ba2: 0x5147, 0x8ba3: 0x7af6, 0x8ba4: 0x5171, 0x8ba5: 0x51f6, 0x8ba6: 0x5354, 0x8ba7: 0x5321, 0x8ba8: 0x537f,
			0x8ba9: 0x53eb, 0x8baa: 0x55ac, 0x8bab: 0x5883, 0x8bac: 0x5ce1, 0x8bad: 0x5f37, 0x8bae: 0x5f4a, 0x8baf: 0x602f, 0x8bb0: 0x6050,
			0x8bb1: 0x606d, 0x8bb2: 0x631f, 0x8bb3: 0x6559, 0x8bb4: 0x6a4b, 0x8bb5: 0x6cc1, 0x8bb6: 0x72c2, 0x8bb7: 0x72ed, 0x8bb8: 0x77ef,
			0x8bb9: 0x80f8, 0x8bba: 0x8105, 0x8bbb: 0x8208, 0x8bbc: 0x854e, 0x8bbd: 0x90f7, 0x8bbe: 0x93e1, 0x8bbf: 0x97ff, 0x8bc0: 0x9957,
			0x8bc1: 0x9a5a, 0x8bc2: 0x4ef0, 0x8bc3: 0x51dd, 0x8bc4: 0x5c2d, 0x8bc5: 0x6681, 0x8bc6: 0x696d, 0x8bc7: 0x5c40, 0x8bc8: 0x66f2,
			0x8bc9: 0x6975, 0x8bca: 0x7389, 0x8bcb: 0x6850, 0x8bcc: 0x7c81, 0x8bcd: 0x50c5, 0x8bce: 0x52e4, 0x8bcf: 0x5747, 0x8bd0: 0x5dfe,
			0x8bd1: 0x9326, 0x8bd2: 0x65a4, 0x8bd3: 0x6b23, 0x8bd4: 0x6b3d, 0x8bd5: 0x7434, 0x8bd6: 0x7981, 0x8bd7: 0x79bd, 0x8bd8: 0x7b4b,
			0x8bd9: 0x7dca, 0x8bda: 0x82b9, 0x8bdb: 0x83cc, 0x8bdc: 0x887f, 0x8bdd: 0x895f, 0x8bde: 0x8b39, 0x8bdf: 0x8fd1, 0x8be0: 0x91d1,
			0x8be1: 0x541f, 0x8be2: 0x9280, 0x8be3: 0x4e5d, 0x8be4: 0x5036, 0x8be5: 0x53e5, 0x8be6: 0x533a, 0x8be7: 0x72d7, 0x8be8: 0x7396,
			0x8be9: 0x77e9, 0x8bea: 0x82e6, 0x8beb: 0x8eaf, 0x8bec: 0x99c6, 0x8bed: 0x99c8, 0x8bee: 0x99d2, 0x8bef: 0x5177, 0x8bf0: 0x611a,
			0x8bf1: 0x865e, 0x8bf2: 0x55b0, 0x8bf3: 0x7a7a, 0x8bf4: 0x5076, 0x8bf5: 0x5bd3, 0x8bf6: 0x9047, 0x8bf7: 0x9685, 0x8bf8: 0x4e32,
			0x8bf9: 0x6adb, 0x8bfa: 0x91e7, 0x8bfb: 0x5c51, 0x8bfc: 0x5c48, 0x8c40: 0x6398, 0x8c41: 0x7a9f, 0x8c42: 0x6c93, 0x8c43: 0x9774,
			0x8c44: 0x8f61, 0x8c45: 0x7aaa, 0x8c46: 0x718a, 0x8c47: 0x9688, 0x8c48: 0x7c82, 0x8c49: 0x6817, 0x8c4a: 0x7e70, 0x8c4b: 0x6851,
			0x8c4c: 0x936c, 0x8c4d: 0x52f2, 0x8c4e: 0x541b, 0x8c4f: 0x85ab, 0x8c50: 0x8a13, 0x8c51: 0x7fa4, 0x8c52: 0x8ecd, 0x8c53: 0x90e1,
			0x8c54: 0x5366, 0x8c55: 0x8888, 0x8c56: 0x7941, 0x8c57: 0x4fc2, 0x8c58: 0x50be, 0x8c59: 0x5211, 0x8c5a: 0x5144, 0x8c5b: 0x5553,
			0x8c5c: 0x572d, 0x8c5d: 0x73ea, 0x8c5e: 0x578b, 0x8c5f: 0x5951, 0x8c60: 0x5f62, 0x8c61: 0x5f84, 0x8c62: 0x6075, 0x8c63: 0x6176,
			0x8c64: 0x6167, 0x8c65: 0x61a9, 0x8c66: 0x63b2, 0x8c67: 0x643a, 0x8c68: 0x656c, 0x8c69: 0x666f, 0x8c6a: 0x6842, 0x8c6b: 0x6e13,
			0x8c6c: 0x7566, 0x8c6d: 0x7a3d, 0x8c6e: 0x7cfb, 0x8c6f: 0x7d4c, 0x8c70: 0x7d99, 0x8c71: 0x7e4b, 0x8c72: 0x7f6b, 0x8c73: 0x830e,
			0x8c74: 0x834a, 0x8c75: 0x86cd, 0x8c76: 0x8a08, 0x8c77: 0x8a63, 0x8c78: 0x8b66, 0x8c79: 0x8efd, 0x8c7a: 0x981a, 0x8c7b: 0x9d8f,
			0x8c7c: 0x82b8, 0x8c7d: 0x8fce, 0x8c7e: 0x9be8, 0x8c80: 0x5287, 0x8c81: 0x621f, 0x8c82: 0x6483, 0x8c83: 0x6fc0, 0x8c84: 0x9699,
			0x8c85: 0x6841, 0x8c86: 0x5091, 0x8c87: 0x6b20, 0x8c88: 0x6c7a, 0x8c89: 0x6f54, 0x8c8a: 0x7a74, 0x8c8b: 0x7d50, 0x8c8c: 0x8840,
			0x8c8d: 0x8a23, 0x8c8e: 0x6708, 0x8c8f: 0x4ef6, 0x8c90: 0x5039, 0x8c91: 0x5026, 0x8c92: 0x5065, 0x8c93: 0x517c, 0x8c94: 0x5238,
			0x8c95: 0x5263, 0x8c96: 0x55a7, 0x8c97: 0x570f, 0x8c98: 0x5805, 0x8c99: 0x5acc, 0x8c9a: 0x5efa, 0x8c9b: 0x61b2, 0x8c9c: 0x61f8,
			0x8c9d: 0x62f3, 0x8c9e: 0x6372, 0x8c9f: 0x691c, 0x8ca0: 0x6a29, 0x8ca1: 0x727d, 0x8ca2: 0x72ac, 0x8ca3: 0x732e, 0x8ca4: 0x7814,
			0x8ca5: 0x786f, 0x8ca6: 0x7d79, 0x8ca7: 0x770c, 0x8ca8: 0x80a9, 0x8ca9: 0x898b, 0x8caa: 0x8b19, 0x8cab: 0x8ce2, 0x8cac: 0x8ed2,
			0x8cad: 0x9063, 0x8cae: 0x9375, 0x8caf: 0x967a, 0x8cb0: 0x9855, 0x8cb1: 0x9a13, 0x8cb2: 0x9e78, 0x8cb3: 0x5143, 0x8cb4: 0x539f,
			0x8cb5: 0x53b3, 0x8cb6: 0x5e7b, 0x8cb7: 0x5f26, 0x8cb8: 0x6e1b, 0x8cb9: 0x6e90, 0x8cba: 0x7384, 0x8cbb: 0x73fe, 0x8cbc: 0x7d43,
			0x8cbd: 0x8237, 0x8cbe: 0x8a00, 0x8cbf: 0x8afa, 0x8cc0: 0x9650, 0x8cc1: 0x4e4e, 0x8cc2: 0x500b, 0x8cc3: 0x53e4, 0x8cc4: 0x547c,
			0x8cc5: 0x56fa, 0x8cc6: 0x59d1, 0x8cc7: 0x5b64, 0x8cc8: 0x5df1, 0x8cc9: 0x5eab, 0x8cca: 0x5f27, 0x8ccb: 0x6238, 0x8ccc: 0x6545,
			0x8ccd: 0x67af, 0x8cce: 0x6e56, 0x8ccf: 0x72d0, 0x8cd0: 0x7cca, 0x8cd1: 0x88b4, 0x8cd2: 0x80a1, 0x8cd3: 0x80e1, 0x8cd4: 0x83f0,
			0x8cd5: 0x864e, 0x8cd6: 0x8a87, 0x8cd7: 0x8de8, 0x8cd8: 0x9237, 0x8cd9: 0x96c7, 0x8cda: 0x9867, 0x8cdb: 0x9f13, 0x8cdc: 0x4e94,
			0x8cdd: 0x4e92, 0x8cde: 0x4f0d, 0x8cdf: 0x5348, 0x8ce0: 0x5449, 0x8ce1: 0x543e, 0x8ce2: 0x5a2f, 0x8ce3: 0x5f8c, 0x8ce4: 0x5fa1,
			0x8ce5: 0x609f, 0x8ce6: 0x68a7, 0x8ce7: 0x6a8e, 0x8ce8: 0x745a, 0x8ce9: 0x7881, 0x8cea: 0x8a9e, 0x8ceb: 0x8aa4, 0x8cec: 0x8b77,
			0x8ced: 0x9190, 0x8cee: 0x4e5e, 0x8cef: 0x9bc9, 0x8cf0: 0x4ea4, 0x8cf1: 0x4f7c, 0x8cf2: 0x4faf, 0x8cf3: 0x5019, 0x8cf4: 0x5016,
			0x8cf5: 0x5149, 0x8cf6: 0x516c, 0x8cf7: 0x529f, 0x8cf8: 0x52b9, 0x8cf9: 0x52fe, 0x8cfa: 0x539a, 0x8cfb: 0x53e3, 0x8cfc: 0x5411,
			0x8d40: 0x540e, 0x8d41: 0x5589, 0x8d42: 0x5751, 0x8d43: 0x57a2, 0x8d44: 0x597d, 0x8d45: 0x5b54, 0x8d46: 0x5b5d, 0x8d47: 0x5b8f,
			0x8d48: 0x5de5, 0x8d49: 0x5de7, 0x8d4a: 0x5df7, 0x8d4b: 0x5e78, 0x8d4c: 0x5e83, 0x8d4d: 0x5e9a, 0x8d4e: 0x5eb7, 0x8d4f: 0x5f18,
			0x8d50: 0x6052, 0x8d51: 0x614c, 0x8d52: 0x6297, 0x8d53: 0x62d8, 0x8d54: 0x63a7, 0x8d55: 0x653b, 0x8d56: 0x6602, 0x8d57: 0x6643,
			0x8d58: 0x66f4, 0x8d59: 0x676d, 0x8d5a: 0x6821, 0x8d5b: 0x6897, 0x8d5c: 0x69cb, 0x8d5d: 0x6c5f, 0x8d5e: 0x6d2a, 0x8d5f: 0x6d69,
			0x8d60: 0x6e2f, 0x8d61: 0x6e9d, 0x8d62: 0x7532, 0x8d63: 0x7687, 0x8d64: 0x786c, 0x8d65: 0x7a3f, 0x8d66: 0x7ce0, 0x8d67: 0x7d05,
			0x8d68: 0x7d18, 0x8d69: 0x7d5e, 0x8d6a: 0x7db1, 0x8d6b: 0x8015, 0x8d6c: 0x8003, 0x8d6d: 0x80af, 0x8d6e: 0x80b1, 0x8d6f: 0x8154,
			0x8d70: 0x818f, 0x8d71: 0x822a, 0x8d72: 0x8352, 0x8d73: 0x884c, 0x8d74: 0x8861, 0x8d75: 0x8b1b, 0x8d76: 0x8ca2, 0x8d77: 0x8cfc,
			0x8d78: 0x90ca, 0x8d79: 0x9175, 0x8d7a: 0x9271, 0x8d7b: 0x783f, 0x8d7c: 0x92fc, 0x8d7d: 0x95a4, 0x8d7e: 0x964d, 0x8d80: 0x9805,
			0x8d81: 0x9999, 0x8d82: 0x9ad8, 0x8d83: 0x9d3b, 0x8d84: 0x525b, 0x8d85: 0x52ab, 0x8d86: 0x53f7, 0x8d87: 0x5408, 0x8d88: 0x58d5,
			0x8d89: 0x62f7, 0x8d8a: 0x6fe0, 0x8d8b: 0x8c6a, 0x8d8c: 0x8f5f, 0x8d8d: 0x9eb9, 0x8d8e: 0x514b, 0x8d8f: 0x523b, 0x8d90: 0x544a,
			0x8d91: 0x56fd, 0x8d92: 0x7a40, 0x8d93: 0x9177, 0x8d94: 0x9d60, 0x8d95: 0x9ed2, 0x8d96: 0x7344, 0x8d97: 0x6f09, 0x8d98: 0x8170,
			0x8d99: 0x7511, 0x8d9a: 0x5ffd, 0x8d9b: 0x60da, 0x8d9c: 0x9aa8, 0x8d9d: 0x72db, 0x8d9e: 0x8fbc, 0x8d9f: 0x6b64, 0x8da0: 0x9803,
			0x8da1: 0x4eca, 0x8da2: 0x56f0, 0x8da3: 0x5764, 0x8da4: 0x58be, 0x8da5: 0x5a5a, 0x8da6: 0x6068, 0x8da7: 0x61c7, 0x8da8: 0x660f,
			0x8da9: 0x6606, 0x8daa: 0x6839, 0x8dab: 0x68b1, 0x8dac: 0x6df7, 0x8dad: 0x75d5, 0x8dae: 0x7d3a, 0x8daf: 0x826e, 0x8db0: 0x9b42,
			0x8db1: 0x4e9b, 0x8db2: 0x4f50, 0x8db3: 0x53c9, 0x8db4: 0x5506, 0x8db5: 0x5d6f, 0x8db6: 0x5de6, 0x8db7: 0x5dee, 0x8db8: 0x67fb,
			0x8db9: 0x6c99, 0x8dba: 0x7473, 0x8dbb: 0x7802, 0x8dbc: 0x8a50, 0x8dbd: 0x9396, 0x8dbe: 0x88df, 0x8dbf: 0x5750, 0x8dc0: 0x5ea7,
			0x8dc1: 0x632b, 0x8dc2: 0x50b5, 0x8dc3: 0x50ac, 0x8dc4: 0x518d, 0x8dc5: 0x6700, 0x8dc6: 0x54c9, 0x8dc7: 0x585e, 0x8dc8: 0x59bb,
			0x8dc9: 0x5bb0, 0x8dca: 0x5f69, 0x8dcb: 0x624d, 0x8dcc: 0x63a1, 0x8dcd: 0x683d, 0x8dce: 0x6b73, 0x8dcf: 0x6e08, 0x8dd0: 0x707d,
			0x8dd1: 0x91c7, 0x8dd2: 0x7280, 0x8dd3: 0x7815, 0x8dd4: 0x7826, 0x8dd5: 0x796d, 0x8dd6: 0x658e, 0x8dd7: 0x7d30, 0x8dd8: 0x83dc,
			0x8dd9: 0x88c1, 0x8dda: 0x8f09, 0x8ddb: 0x969b, 0x8ddc: 0x5264, 0x8ddd: 0x5728, 0x8dde: 0x6750, 0x8ddf: 0x7f6a, 0x8de0: 0x8ca1,
			0x8de1: 0x51b4, 0x8de2: 0x5742, 0x8de3: 0x962a, 0x8de4: 0x583a, 0x8de5: 0x698a, 0x8de6: 0x80b4, 0x8de7: 0x54b2, 0x8de8: 0x5d0e,
			0x8de9: 0x57fc, 0x8dea: 0x7895, 0x8deb: 0x9dfa, 0x8dec: 0x4f5c, 0x8ded: 0x524a, 0x8dee: 0x548b, 0x8def: 0x643e, 0x8df0: 0x6628,
			0x8df1: 0x6714, 0x8df2: 0x67f5, 0x8df3: 0x7a84, 0x8df4: 0x7b56, 0x8df5: 0x7d22, 0x8df6: 0x932f, 0x8df7: 0x685c, 0x8df8: 0x9bad,
			0x8df9: 0x7b39, 0x8dfa: 0x5319, 0x8dfb: 0x518a, 0x8dfc: 0x5237, 0x8e40: 0x5bdf, 0x8e41: 0x62f6, 0x8e42: 0x64ae, 0x8e43: 0x64e6,
			0x8e44: 0x672d, 0x8e45: 0x6bba, 0x8e46: 0x85a9, 0x8e47: 0x96d1, 0x8e48: 0x7690, 0x8e49: 0x9bd6, 0x8e4a: 0x634c, 0x8e4b: 0x9306,
			0x8e4c: 0x9bab, 0x8e4d: 0x76bf, 0x8e4e: 0x6652, 0x8e4f: 0x4e09, 0x8e50: 0x5098, 0x8e51: 0x53c2, 0x8e52: 0x5c71, 0x8e53: 0x60e8,
			0x8e54: 0x6492, 0x8e55: 0x6563, 0x8e56: 0x685f, 0x8e57: 0x71e6, 0x8e58: 0x73ca, 0x8e59: 0x7523, 0x8e5a: 0x7b97, 0x8e5b: 0x7e82,
			0x8e5c: 0x8695, 0x8e5d: 0x8b83, 0x8e5e: 0x8cdb, 0x8e5f: 0x9178, 0x8e60: 0x9910, 0x8e61: 0x65ac, 0x8e62: 0x66ab, 0x8e63: 0x6b8b,
			0x8e64: 0x4ed5, 0x8e65: 0x4ed4, 0x8e66: 0x4f3a, 0x8e67: 0x4f7f, 0x8e68: 0x523a, 0x8e69: 0x53f8, 0x8e6a: 0x53f2, 0x8e6b: 0x55e3,
			0x8e6c: 0x56db, 0x8e6d: 0x58eb, 0x8e6e: 0x59cb, 0x8e6f: 0x59c9, 0x8e70: 0x59ff, 0x8e71: 0x5b50, 0x8e72: 0x5c4d, 0x8e73: 0x5e02,
			0x8e74: 0x5e2b, 0x8e75: 0x5fd7, 0x8e76: 0x601d, 0x8e77: 0x6307, 0x8e78: 0x652f, 0x8e79: 0x5b5c, 0x8e7a: 0x65af, 0x8e7b: 0x65bd,
			0x8e7c: 0x65e8, 0x8e7d: 0x679d, 0x8e7e: 0x6b62, 0x8e80: 0x6b7b, 0x8e81: 0x6c0f, 0x8e82: 0x7345, 0x8e83: 0x7949, 0x8e84: 0x79c1,
			0x8e85: 0x7cf8, 0x8e86: 0x7d19, 0x8e87: 0x7d2b, 0x8e88: 0x80a2, 0x8e89: 0x8102, 0x8e8a: 0x81f3, 0x8e8b: 0x8996, 0x8e8c: 0x8a5e,
			0x8e8d: 0x8a69, 0x8e8e: 0x8a66, 0x8e8f: 0x8a8c, 0x8e90: 0x8aee, 0x8e91: 0x8cc7, 0x8e92: 0x8cdc, 0x8e93: 0x96cc, 0x8e94: 0x98fc,
			0x8e95: 0x6b6f, 0x8e96: 0x4e8b, 0x8e97: 0x4f3c, 0x8e98: 0x4f8d, 0x8e99: 0x5150, 0x8e9a: 0x5b57, 0x8e9b: 0x5bfa, 0x8e9c: 0x6148,
			0x8e9d: 0x6301, 0x8e9e: 0x6642, 0x8e9f: 0x6b21, 0x8ea0: 0x6ecb, 0x8ea1: 0x6cbb, 0x8ea2: 0x723e, 0x8ea3: 0x74bd, 0x8ea4: 0x75d4,
			0x8ea5: 0x78c1, 0x8ea6: 0x793a, 0x8ea7: 0x800c, 0x8ea8: 0x8033, 0x8ea9: 0x81ea, 0x8eaa: 0x8494, 0x8eab: 0x8f9e, 0x8eac: 0x6c50,
			0x8ead: 0x9e7f, 0x8eae: 0x5f0f, 0x8eaf: 0x8b58, 0x8eb0: 0x9d2b, 0x8eb1: 0x7afa, 0x8eb2: 0x8ef8, 0x8eb3: 0x5b8d, 0x8eb4: 0x96eb,
			0x8eb5: 0x4e03, 0x8eb6: 0x53f1, 0x8eb7: 0x57f7, 0x8eb8: 0x5931, 0x8eb9: 0x5ac9, 0x8eba: 0x5ba4, 0x8ebb: 0x6089, 0x8ebc: 0x6e7f,
			0x8ebd: 0x6f06, 0x8ebe: 0x75be, 0x8ebf: 0x8cea, 0x8ec0: 0x5b9f, 0x8ec1: 0x8500, 0x8ec2: 0x7be0, 0x8ec3: 0x5072, 0x8ec4: 0x67f4,
			0x8ec5: 0x829d, 0x8ec6: 0x5c61, 0x8ec7: 0x854a, 0x8ec8: 0x7e1e, 0x8ec9: 0x820e, 0x8eca: 0x5199, 0x8ecb: 0x5c04, 0x8ecc: 0x6368,
			0x8ecd: 0x8d66, 0x8ece: 0x659c, 0x8ecf: 0x716e, 0x8ed0: 0x793e, 0x8ed1: 0x7d17, 0x8ed2: 0x8005, 0x8ed3: 0x8b1d, 0x8ed4: 0x8eca,
			0x8ed5: 0x906e, 0x8ed6: 0x86c7, 0x8ed7: 0x90aa, 0x8ed8: 0x501f, 0x8ed9: 0x52fa, 0x8eda: 0x5c3a, 0x8edb: 0x6753, 0x8edc: 0x707c,
			0x8edd: 0x7235, 0x8ede: 0x914c, 0x8edf: 0x91c8, 0x8ee0: 0x932b, 0x8ee1: 0x82e5, 0x8ee2: 0x5bc2, 0x8ee3: 0x5f31, 0x8ee4: 0x60f9,
			0x8ee5: 0x4e3b, 0x8ee6: 0x53d6, 0x8ee7: 0x5b88, 0x8ee8: 0x624b, 0x8ee9: 0x6731, 0x8eea: 0x6b8a, 0x8eeb: 0x72e9, 0x8eec: 0x73e0,
			0x8eed: 0x7a2e, 0x8eee: 0x816b, 0x8eef: 0x8da3, 0x8ef0: 0x9152, 0x8ef1: 0x9996, 0x8ef2: 0x5112, 0x8ef3: 0x53d7, 0x8ef4: 0x546a,
			0x8ef5: 0x5bff, 0x8ef6: 0x6388, 0x8ef7: 0x6a39, 0x8ef8: 0x7dac, 0x8ef9: 0x9700, 0x8efa: 0x56da, 0x8efb: 0x53ce, 0x8efc: 0x5468,
			0x8f40: 0x5b97, 0x8f41: 0x5c31, 0x8f42: 0x5dde, 0x8f43: 0x4fee, 0x8f44: 0x6101, 0x8f45: 0x62fe, 0x8f46: 0x6d32, 0x8f47: 0x79c0,
			0x8f48: 0x79cb, 0x8f49: 0x7d42, 0x8f4a: 0x7e4d, 0x8f4b: 0x7fd2, 0x8f4c: 0x81ed, 0x8f4d: 0x821f, 0x8f4e: 0x8490, 0x8f4f: 0x8846,
			0x8f50: 0x8972, 0x8f51: 0x8b90, 0x8f52: 0x8e74, 0x8f53: 0x8f2f, 0x8f54: 0x9031, 0x8f55: 0x914b, 0x8f56: 0x916c, 0x8f57: 0x96c6,
			0x8f58: 0x919c, 0x8f59: 0x4ec0, 0x8f5a: 0x4f4f, 0x8f5b: 0x5145, 0x8f5c: 0x5341, 0x8f5d: 0x5f93, 0x8f5e: 0x620e, 0x8f5f: 0x67d4,
			0x8f60: 0x6c41, 0x8f61: 0x6e0b, 0x8f62: 0x7363, 0x8f63: 0x7e26, 0x8f64: 0x91cd, 0x8f65: 0x9283, 0x8f66: 0x53d4, 0x8f67: 0x5919,
			0x8f68: 0x5bbf, 0x8f69: 0x6dd1, 0x8f6a: 0x795d, 0x8f6b: 0x7e2e, 0x8f6c: 0x7c9b, 0x8f6d: 0x587e, 0x8f6e: 0x719f, 0x8f6f: 0x51fa,
			0x8f70: 0x8853, 0x8f71: 0x8ff0, 0x8f72: 0x4fca, 0x8f73: 0x5cfb, 0x8f74: 0x6625, 0x8f75: 0x77ac, 0x8f76: 0x7ae3, 0x8f77: 0x821c,
			0x8f78: 0x99ff, 0x8f79: 0x51c6, 0x8f7a: 0x5faa, 0x8f7b: 0x65ec, 0x8f7c: 0x696f, 0x8f7d: 0x6b89, 0x8f7e: 0x6df3, 0x8f80: 0x6e96,
			0x8f81: 0x6f64, 0x8f82: 0x76fe, 0x8f83: 0x7d14, 0x8f84: 0x5de1, 0x8f85: 0x9075, 0x8f86: 0x9187, 0x8f87: 0x9806, 0x8f88: 0x51e6,
			0x8f89: 0x521d, 0x8f8a: 0x6240, 0x8f8b: 0x6691, 0x8f8c: 0x66d9, 0x8f8d: 0x6e1a, 0x8f8e: 0x5eb6, 0x8f8f: 0x7dd2, 0x8f90: 0x7f72,
			0x8f91: 0x66f8, 0x8f92: 0x85af, 0x8f93: 0x85f7, 0x8f94: 0x8af8, 0x8f95: 0x52a9, 0x8f96: 0x53d9, 0x8f97: 0x5973, 0x8f98: 0x5e8f,
			0x8f99: 0x5f90, 0x8f9a: 0x6055, 0x8f9b: 0x92e4, 0x8f9c: 0x9664, 0x8f9d: 0x50b7, 0x8f9e: 0x511f, 0x8f9f: 0x52dd, 0x8fa0: 0x5320,
			0x8fa1: 0x5347, 0x8fa2: 0x53ec, 0x8fa3: 0x54e8, 0x8fa4: 0x5546, 0x8fa5: 0x5531, 0x8fa6: 0x5617, 0x8fa7: 0x5968, 0x8fa8: 0x59be,
			0x8fa9: 0x5a3c, 0x8faa: 0x5bb5, 0x8fab: 0x5c06, 0x8fac: 0x5c0f, 0x8fad: 0x5c11, 0x8fae: 0x5c1a, 0x8faf: 0x5e84, 0x8fb0: 0x5e8a,
			0x8fb1: 0x5ee0, 0x8fb2: 0x5f70, 0x8fb3: 0x627f, 0x8fb4: 0x6284, 0x8fb5: 0x62db, 0x8fb6: 0x638c, 0x8fb7: 0x6377, 0x8fb8: 0x6607,
			0x8fb9: 0x660c, 0x8fba: 0x662d, 0x8fbb: 0x6676, 0x8fbc: 0x677e, 0x8fbd: 0x68a2, 0x8fbe: 0x6a1f, 0x8fbf: 0x6a35, 0x8fc0: 0x6cbc,
			0x8fc1: 0x6d88, 0x8fc2: 0x6e09, 0x8fc3: 0x6e58, 0x8fc4: 0x713c, 0x8fc5: 0x7126, 0x8fc6: 0x7167, 0x8fc7: 0x75c7, 0x8fc8: 0x7701,
			0x8fc9: 0x785d, 0x8fca: 0x7901, 0x8fcb: 0x7965, 0x8fcc: 0x79f0, 0x8fcd: 0x7ae0, 0x8fce: 0x7b11, 0x8fcf: 0x7ca7, 0x8fd0: 0x7d39,
			0x8fd1: 0x8096, 0x8fd2: 0x83d6, 0x8fd3: 0x848b, 0x8fd4: 0x8549, 0x8fd5: 0x885d, 0x8fd6: 0x88f3, 0x8fd7: 0x8a1f, 0x8fd8: 0x8a3c,
			0x8fd9: 0x8a54, 0x8fda: 0x8a73, 0x8fdb: 0x8c61, 0x8fdc: 0x8cde, 0x8fdd: 0x91a4, 0x8fde: 0x9266, 0x8fdf: 0x937e, 0x8fe0: 0x9418,
			0x8fe1: 0x969c, 0x8fe2: 0x9798, 0x8fe3: 0x4e0a, 0x8fe4: 0x4e08, 0x8fe5: 0x4e1e, 0x8fe6: 0x4e57, 0x8fe7: 0x5197, 0x8fe8: 0x5270,
			0x8fe9: 0x57ce, 0x8fea: 0x5834, 0x8feb: 0x58cc, 0x8fec: 0x5b22, 0x8fed: 0x5e38, 0x8fee: 0x60c5, 0x8fef: 0x64fe, 0x8ff0: 0x6761,
			0x8ff1: 0x6756, 0x8ff2: 0x6d44, 0x8ff3: 0x72b6, 0x8ff4: 0x7573, 0x8ff5: 0x7a63, 0x8ff6: 0x84b8, 0x8ff7: 0x8b72, 0x8ff8: 0x91b8,
			0x8ff9: 0x9320, 0x8ffa: 0x5631, 0x8ffb: 0x57f4, 0x8ffc: 0x98fe, 0x9040: 0x62ed, 0x9041: 0x690d, 0x9042: 0x6b96, 0x9043: 0x71ed,
			0x9044: 0x7e54, 0x9045: 0x8077, 0x9046: 0x8272, 0x9047: 0x89e6, 0x9048: 0x98df, 0x9049: 0x8755, 0x904a: 0x8fb1, 0x904b: 0x5c3b,
			0x904c: 0x4f38, 0x904d: 0x4fe1, 0x904e: 0x4fb5, 0x904f: 0x5507, 0x9050: 0x5a20, 0x9051: 0x5bdd, 0x9052: 0x5be9, 0x9053: 0x5fc3,
			0x9054: 0x614e, 0x9055: 0x632f, 0x9056: 0x65b0, 0x9057: 0x664b, 0x9058: 0x68ee, 0x9059: 0x699b, 0x905a: 0x6d78, 0x905b: 0x6df1,
			0x905c: 0x7533, 0x905d: 0x75b9, 0x905e: 0x771f, 0x905f: 0x795e, 0x9060: 0x79e6, 0x9061: 0x7d33, 0x9062: 0x81e3, 0x9063: 0x82af,
			0x9064: 0x85aa, 0x9065: 0x89aa, 0x9066: 0x8a3a, 0x9067: 0x8eab, 0x9068: 0x8f9b, 0x9069: 0x9032, 0x906a: 0x91dd, 0x906b: 0x9707,
			0x906c: 0x4eba, 0x906d: 0x4ec1, 0x906e: 0x5203, 0x906f: 0x5875, 0x9070: 0x58ec, 0x9071: 0x5c0b, 0x9072: 0x751a, 0x9073: 0x5c3d,
			0x9074: 0x814e, 0x9075: 0x8a0a, 0x9076: 0x8fc5, 0x9077: 0x9663, 0x9078: 0x976d, 0x9079: 0x7b25, 0x907a: 0x8acf, 0x907b: 0x9808,
			0x907c: 0x9162, 0x907d: 0x56f3, 0x907e: 0x53a8, 0x9080: 0x9017, 0x9081: 0x5439, 0x9082: 0x5782, 0x9083: 0x5e25, 0x9084: 0x63a8,
			0x9085: 0x6c34, 0x9086: 0x708a, 0x9087: 0x7761, 0x9088: 0x7c8b, 0x9089: 0x7fe0, 0x908a: 0x8870, 0x908b: 0x9042, 0x908c: 0x9154,
			0x908d: 0x9310, 0x908e: 0x9318, 0x908f: 0x968f, 0x9090: 0x745e, 0x9091: 0x9ac4, 0x9092: 0x5d07, 0x9093: 0x5d69, 0x9094: 0x6570,
			0x9095: 0x67a2, 0x9096: 0x8da8, 0x9097: 0x96db, 0x9098: 0x636e, 0x9099: 0x6749, 0x909a: 0x6919, 0x909b: 0x83c5, 0x909c: 0x9817,
			0x909d: 0x96c0, 0x909e: 0x88fe, 0x909f: 0x6f84, 0x90a0: 0x647a, 0x90a1: 0x5bf8, 0x90a2: 0x4e16, 0x90a3: 0x702c, 0x90a4: 0x755d,
			0x90a5: 0x662f, 0x90a6: 0x51c4, 0x90a7: 0x5236, 0x90a8: 0x52e2, 0x90a9: 0x59d3, 0x90aa: 0x5f81, 0x90ab: 0x6027, 0x90ac: 0x6210,
			0x90ad: 0x653f, 0x90ae: 0x6574, 0x90af: 0x661f, 0x90b0: 0x6674, 0x90b1: 0x68f2, 0x90b2: 0x6816, 0x90b3: 0x6b63, 0x90b4: 0x6e05,
			0x90b5: 0x7272, 0x90b6: 0x751f, 0x90b7: 0x76db, 0x90b8: 0x7cbe, 0x90b9: 0x8056, 0x90ba: 0x58f0, 0x90bb: 0x88fd, 0x90bc: 0x897f,
			0x90bd: 0x8aa0, 0x90be: 0x8a93, 0x90bf: 0x8acb, 0x90c0: 0x901d, 0x90c1: 0x9192, 0x90c2: 0x9752, 0x90c3: 0x9759, 0x90c4: 0x6589,
			0x90c5: 0x7a0e, 0x90c6: 0x8106, 0x90c7: 0x96bb, 0x90c8: 0x5e2d, 0x90c9: 0x60dc, 0x90ca: 0x621a, 0x90cb: 0x65a5, 0x90cc: 0x6614,
			0x90cd: 0x6790, 0x90ce: 0x77f3, 0x90cf: 0x7a4d, 0x90d0: 0x7c4d, 0x90d1: 0x7e3e, 0x90d2: 0x810a, 0x90d3: 0x8cac, 0x90d4: 0x8d64,
			0x90d5: 0x8de1, 0x90d6: 0x8e5f, 0x90d7: 0x78a9, 0x90d8: 0x5207, 0x90d9: 0x62d9, 0x90da: 0x63a5, 0x90db: 0x6442, 0x90dc: 0x6298,
			0x90dd: 0x8a2d, 0x90de: 0x7a83, 0x90df: 0x7bc0, 0x90e0: 0x8aac, 0x90e1: 0x96ea, 0x90e2: 0x7d76, 0x90e3: 0x820c, 0x90e4: 0x8749,
			0x90e5: 0x4ed9, 0x90e6: 0x5148, 0x90e7: 0x5343, 0x90e8: 0x5360, 0x90e9: 0x5ba3, 0x90ea: 0x5c02, 0x90eb: 0x5c16, 0x90ec: 0x5ddd,
			0x90ed: 0x6226, 0x90ee: 0x6247, 0x90ef: 0x64b0, 0x90f0: 0x6813, 0x90f1: 0x6834, 0x90f2: 0x6cc9, 0x90f3: 0x6d45, 0x90f4: 0x6d17,
			0x90f5: 0x67d3, 0x90f6: 0x6f5c, 0x90f7: 0x714e, 0x90f8: 0x717d, 0x90f9: 0x65cb, 0x90fa: 0x7a7f, 0x90fb: 0x7bad, 0x90fc: 0x7dda,
			0x9140: 0x7e4a, 0x9141: 0x7fa8, 0x9142: 0x817a, 0x9143: 0x821b, 0x9144: 0x8239, 0x9145: 0x85a6, 0x9146: 0x8a6e, 0x9147: 0x8cce,
			0x9148: 0x8df5, 0x9149: 0x9078, 0x914a: 0x9077, 0x914b: 0x92ad, 0x914c: 0x9291, 0x914d: 0x9583, 0x914e: 0x9bae, 0x914f: 0x524d,
			0x9150: 0x5584, 0x9151: 0x6f38, 0x9152: 0x7136, 0x9153: 0x5168, 0x9154: 0x7985, 0x9155: 0x7e55, 0x9156: 0x81b3, 0x9157: 0x7cce,
			0x9158: 0x564c, 0x9159: 0x5851, 0x915a: 0x5ca8, 0x915b: 0x63aa, 0x915c: 0x66fe, 0x915d: 0x66fd, 0x915e: 0x695a, 0x915f: 0x72d9,
			0x9160: 0x758f, 0x9161: 0x758e, 0x9162: 0x790e, 0x9163: 0x7956, 0x9164: 0x79df, 0x9165: 0x7c97, 0x9166: 0x7d20, 0x9167: 0x7d44,
			0x9168: 0x8607, 0x9169: 0x8a34, 0x916a: 0x963b, 0x916b: 0x9061, 0x916c: 0x9f20, 0x916d: 0x50e7, 0x916e: 0x5275, 0x916f: 0x53cc,
			0x9170: 0x53e2, 0x9171: 0x5009, 0x9172: 0x55aa, 0x9173: 0x58ee, 0x9174: 0x594f, 0x9175: 0x723d, 0x9176: 0x5b8b, 0x9177: 0x5c64,
			0x9178: 0x531d, 0x9179: 0x60e3, 0x917a: 0x60f3, 0x917b: 0x635c, 0x917c: 0x6383, 0x917d: 0x633f, 0x917e: 0x63bb, 0x9180: 0x64cd,
			0x9181: 0x65e9, 0x9182: 0x66f9, 0x9183: 0x5de3, 0x9184: 0x69cd, 0x9185: 0x69fd, 0x9186: 0x6f15, 0x9187: 0x71e5, 0x9188: 0x4e89,
			0x9189: 0x75e9, 0x918a: 0x76f8, 0x918b: 0x7a93, 0x918c: 0x7cdf, 0x918d: 0x7dcf, 0x918e: 0x7d9c, 0x918f: 0x8061, 0x9190: 0x8349,
			0x9191: 0x8358, 0x9192: 0x846c, 0x9193: 0x84bc, 0x9194: 0x85fb, 0x9195: 0x88c5, 0x9196: 0x8d70, 0x9197: 0x9001, 0x9198: 0x906d,
			0x9199: 0x9397, 0x919a: 0x971c, 0x919b: 0x9a12, 0x919c: 0x50cf, 0x919d: 0x5897, 0x919e: 0x618e, 0x919f: 0x81d3, 0x91a0: 0x8535,
			0x91a1: 0x8d08, 0x91a2: 0x9020, 0x91a3: 0x4fc3, 0x91a4: 0x5074, 0x91a5: 0x5247, 0x91a6: 0x5373, 0x91a7: 0x606f, 0x91a8: 0x6349,
			0x91a9: 0x675f, 0x91aa: 0x6e2c, 0x91ab: 0x8db3, 0x91ac: 0x901f, 0x91ad: 0x4fd7, 0x91ae: 0x5c5e, 0x91af: 0x8cca, 0x91b0: 0x65cf,
			0x91b1: 0x7d9a, 0x91b2: 0x5352, 0x91b3: 0x8896, 0x91b4: 0x5176, 0x91b5: 0x63c3, 0x91b6: 0x5b58, 0x91b7: 0x5b6b, 0x91b8: 0x5c0a,
			0x91b9: 0x640d, 0x91ba: 0x6751, 0x91bb: 0x905c, 0x91bc: 0x4ed6, 0x91bd: 0x591a, 0x91be: 0x592a, 0x91bf: 0x6c70, 0x91c0: 0x8a51,
			0x91c1: 0x553e, 0x91c2: 0x5815, 0x91c3: 0x59a5, 0x91c4: 0x60f0, 0x91c5: 0x6253, 0x91c6: 0x67c1, 0x91c7: 0x8235, 0x91c8: 0x6955,
			0x91c9: 0x9640, 0x91ca: 0x99c4, 0x91cb: 0x9a28, 0x91cc: 0x4f53, 0x91cd: 0x5806, 0x91ce: 0x5bfe, 0x91cf: 0x8010, 0x91d0: 0x5cb1,
			0x91d1: 0x5e2f, 0x91d2: 0x5f85, 0x91d3: 0x6020, 0x91d4: 0x614b, 0x91d5: 0x6234, 0x91d6: 0x66ff, 0x91d7: 0x6cf0, 0x91d8: 0x6ede,
			0x91d9: 0x80ce, 0x91da: 0x817f, 0x91db: 0x82d4, 0x91dc: 0x888b, 0x91dd: 0x8cb8, 0x91de: 0x9000, 0x91df: 0x902e, 0x91e0: 0x968a,
			0x91e1: 0x9edb, 0x91e2: 0x9bdb, 0x91e3: 0x4ee3, 0x91e4: 0x53f0, 0x91e5: 0x5927, 0x91e6: 0x7b2c, 0x91e7: 0x918d, 0x91e8: 0x984c,
			0x91e9: 0x9df9, 0x91ea: 0x6edd, 0x91eb: 0x7027, 0x91ec: 0x5353, 0x91ed: 0x5544, 0x91ee: 0x5b85, 0x91ef: 0x6258, 0x91f0: 0x629e,
			0x91f1: 0x62d3, 0x91f2: 0x6ca2, 0x91f3: 0x6fef, 0x91f4: 0x7422, 0x91f5: 0x8a17, 0x91f6: 0x9438, 0x91f7: 0x6fc1, 0x91f8: 0x8afe,
			0x91f9: 0x8338, 0x91fa: 0x51e7, 0x91fb: 0x86f8, 0x91fc: 0x53ea, 0x9240: 0x53e9, 0x9241: 0x4f46, 0x9242: 0x9054, 0x9243: 0x8fb0,
			0x9244: 0x596a, 0x9245: 0x8131, 0x9246: 0x5dfd, 0x9247: 0x7aea, 0x9248: 0x8fbf, 0x9249: 0x68da, 0x924a: 0x8c37, 0x924b: 0x72f8,
			0x924c: 0x9c48, 0x924d: 0x6a3d, 0x924e: 0x8ab0, 0x924f: 0x4e39, 0x9250: 0x5358, 0x9251: 0x5606, 0x9252: 0x5766, 0x9253: 0x62c5,
			0x9254: 0x63a2, 0x9255: 0x65e6, 0x9256: 0x6b4e, 0x9257: 0x6de1, 0x9258: 0x6e5b, 0x9259: 0x70ad, 0x925a: 0x77ed, 0x925b: 0x7aef,
			0x925c: 0x7baa, 0x925d: 0x7dbb, 0x925e: 0x803d, 0x925f: 0x80c6, 0x9260: 0x86cb, 0x9261: 0x8a95, 0x9262: 0x935b, 0x9263: 0x56e3,
			0x9264: 0x58c7, 0x9265: 0x5f3e, 0x9266: 0x65ad, 0x9267: 0x6696, 0x9268: 0x6a80, 0x9269: 0x6bb5, 0x926a: 0x7537, 0x926b: 0x8ac7,
			0x926c: 0x5024, 0x926d: 0x77e5, 0x926e: 0x5730, 0x926f: 0x5f1b, 0x9270: 0x6065, 0x9271: 0x667a, 0x9272: 0x6c60, 0x9273: 0x75f4,
			0x9274: 0x7a1a, 0x9275: 0x7f6e, 0x9276: 0x81f4, 0x9277: 0x8718, 0x9278: 0x9045, 0x9279: 0x99b3, 0x927a: 0x7bc9, 0x927b: 0x755c,
			0x927c: 0x7af9, 0x927d: 0x7b51, 0x927e: 0x84c4, 0x9280: 0x9010, 0x9281: 0x79e9, 0x9282: 0x7a92, 0x9283: 0x8336, 0x9284: 0x5ae1,
			0x9285: 0x7740, 0x9286: 0x4e2d, 0x9287: 0x4ef2, 0x9288: 0x5b99, 0x9289: 0x5fe0, 0x928a: 0x62bd, 0x928b: 0x663c, 0x928c: 0x67f1,
			0x928d: 0x6ce8, 0x928e: 0x866b, 0x928f: 0x8877, 0x9290: 0x8a3b, 0x9291: 0x914e, 0x9292: 0x92f3, 0x9293: 0x99d0, 0x9294: 0x6a17,
			0x9295: 0x7026, 0x9296: 0x732a, 0x9297: 0x82e7, 0x9298: 0x8457, 0x9299: 0x8caf, 0x929a: 0x4e01, 0x929b: 0x5146, 0x929c: 0x51cb,
			0x929d: 0x558b, 0x929e: 0x5bf5, 0x929f: 0x5e16, 0x92a0: 0x5e33, 0x92a1: 0x5e81, 0x92a2: 0x5f14, 0x92a3: 0x5f35, 0x92a4: 0x5f6b,
			0x92a5: 0x5fb4, 0x92a6: 0x61f2, 0x92a7: 0x6311, 0x92a8: 0x66a2, 0x92a9: 0x671d, 0x92aa: 0x6f6e, 0x92ab: 0x7252, 0x92ac: 0x753a,
			0x92ad: 0x773a, 0x92ae: 0x8074, 0x92af: 0x8139, 0x92b0: 0x8178, 0x92b1: 0x8776, 0x92b2: 0x8abf, 0x92b3: 0x8adc, 0x92b4: 0x8d85,
			0x92b5: 0x8df3, 0x92b6: 0x929a, 0x92b7: 0x9577, 0x92b8: 0x9802, 0x92b9: 0x9ce5, 0x92ba: 0x52c5, 0x92bb: 0x6357, 0x92bc: 0x76f4,
			0x92bd: 0x6715, 0x92be: 0x6c88, 0x92bf: 0x73cd, 0x92c0: 0x8cc3, 0x92c1: 0x93ae, 0x92c2: 0x9673, 0x92c3: 0x6d25, 0x92c4: 0x589c,
			0x92c5: 0x690e, 0x92c6: 0x69cc, 0x92c7: 0x8ffd, 0x92c8: 0x939a, 0x92c9: 0x75db, 0x92ca: 0x901a, 0x92cb: 0x585a, 0x92cc: 0x6802,
			0x92cd: 0x63b4, 0x92ce: 0x69fb, 0x92cf: 0x4f43, 0x92d0: 0x6f2c, 0x92d1: 0x67d8, 0x92d2: 0x8fbb, 0x92d3: 0x8526, 0x92d4: 0x7db4,
			0x92d5: 0x9354, 0x92d6: 0x693f, 0x92d7: 0x6f70, 0x92d8: 0x576a, 0x92d9: 0x58f7, 0x92da: 0x5b2c, 0x92db: 0x7d2c, 0x92dc: 0x722a,
			0x92dd: 0x540a, 0x92de: 0x91e3, 0x92df: 0x9db4, 0x92e0: 0x4ead, 0x92e1: 0x4f4e, 0x92e2: 0x505c, 0x92e3: 0x5075, 0x92e4: 0x5243,
			0x92e5: 0x8c9e, 0x92e6: 0x5448, 0x92e7: 0x5824, 0x92e8: 0x5b9a, 0x92e9: 0x5e1d, 0x92ea: 0x5e95, 0x92eb: 0x5ead, 0x92ec: 0x5ef7,
			0x92ed: 0x5f1f, 0x92ee: 0x608c, 0x92ef: 0x62b5, 0x92f0: 0x633a, 0x92f1: 0x63d0, 0x92f2: 0x68af, 0x92f3: 0x6c40, 0x92f4: 0x7887,
			0x92f5: 0x798e, 0x92f6: 0x7a0b, 0x92f7: 0x7de0, 0x92f8: 0x8247, 0x92f9: 0x8a02, 0x92fa: 0x8ae6, 0x92fb: 0x8e44, 0x92fc: 0x9013,
			0x9340: 0x90b8, 0x9341: 0x912d, 0x9342: 0x91d8, 0x9343: 0x9f0e, 0x9344: 0x6ce5, 0x9345: 0x6458, 0x9346: 0x64e2, 0x9347: 0x6575,
			0x9348: 0x6ef4, 0x9349: 0x7684, 0x934a: 0x7b1b, 0x934b: 0x9069, 0x934c: 0x93d1, 0x934d: 0x6eba, 0x934e: 0x54f2, 0x934f: 0x5fb9,
			0x9350: 0x64a4, 0x9351: 0x8f4d, 0x9352: 0x8fed, 0x9353: 0x9244, 0x9354: 0x5178, 0x9355: 0x586b, 0x9356: 0x5929, 0x9357: 0x5c55,
			0x9358: 0x5e97, 0x9359: 0x6dfb, 0x935a: 0x7e8f, 0x935b: 0x751c, 0x935c: 0x8cbc, 0x935d: 0x8ee2, 0x935e: 0x985b, 0x935f: 0x70b9,
			0x9360: 0x4f1d, 0x9361: 0x6bbf, 0x9362: 0x6fb1, 0x9363: 0x7530, 0x9364: 0x96fb, 0x9365: 0x514e, 0x9366: 0x5410, 0x9367: 0x5835,
			0x9368: 0x5857, 0x9369: 0x59ac, 0x936a: 0x5c60, 0x936b: 0x5f92, 0x936c: 0x6597, 0x936d: 0x675c, 0x936e: 0x6e21, 0x936f: 0x767b,
			0x9370: 0x83df, 0x9371: 0x8ced, 0x9372: 0x9014, 0x9373: 0x90fd, 0x9374: 0x934d, 0x9375: 0x7825, 0x9376: 0x783a, 0x9377: 0x52aa,
			0x9378: 0x5ea6, 0x9379: 0x571f, 0x937a: 0x5974, 0x937b: 0x6012, 0x937c: 0x5012, 0x937d: 0x515a, 0x937e: 0x51ac, 0x9380: 0x51cd,
			0x9381: 0x5200, 0x9382: 0x5510, 0x9383: 0x5854, 0x9384: 0x5858, 0x9385: 0x5957, 0x9386: 0x5b95, 0x9387: 0x5cf6, 0x9388: 0x5d8b,
			0x9389: 0x60bc, 0x938a: 0x6295, 0x938b: 0x642d, 0x938c: 0x6771, 0x938d: 0x6843, 0x938e: 0x68bc, 0x938f: 0x68df, 0x9390: 0x76d7,
			0x9391: 0x6dd8, 0x9392: 0x6e6f, 0x9393: 0x6d9b, 0x9394: 0x706f, 0x9395: 0x71c8, 0x9396: 0x5f53, 0x9397: 0x75d8, 0x9398: 0x7977,
			0x9399: 0x7b49, 0x939a: 0x7b54, 0x939b: 0x7b52, 0x939c: 0x7cd6, 0x939d: 0x7d71, 0x939e: 0x5230, 0x939f: 0x8463, 0x93a0: 0x8569,
			0x93a1: 0x85e4, 0x93a2: 0x8a0e, 0x93a3: 0x8b04, 0x93a4: 0x8c46, 0x93a5: 0x8e0f, 0x93a6: 0x9003, 0x93a7: 0x900f, 0x93a8: 0x9419,
			0x93a9: 0x9676, 0x93aa: 0x982d, 0x93ab: 0x9a30, 0x93ac: 0x95d8, 0x93ad: 0x50cd, 0x93ae: 0x52d5, 0x93af: 0x540c, 0x93b0: 0x5802,
			0x93b1: 0x5c0e, 0x93b2: 0x61a7, 0x93b3: 0x649e, 0x93b4: 0x6d1e, 0x93b5: 0x77b3, 0x93b6: 0x7ae5, 0x93b7: 0x80f4, 0x93b8: 0x8404,
			0x93b9: 0x9053, 0x93ba: 0x9285, 0x93bb: 0x5ce0, 0x93bc: 0x9d07, 0x93bd: 0x533f, 0x93be: 0x5f97, 0x93bf: 0x5fb3, 0x93c0: 0x6d9c,
			0x93c1: 0x7279, 0x93c2: 0x7763, 0x93c3: 0x79bf, 0x93c4: 0x7be4, 0x93c5: 0x6bd2, 0x93c6: 0x72ec, 0x93c7: 0x8aad, 0x93c8: 0x6803,
			0x93c9: 0x6a61, 0x93ca: 0x51f8, 0x93cb: 0x7a81, 0x93cc: 0x6934, 0x93cd: 0x5c4a, 0x93ce: 0x9cf6, 0x93cf: 0x82eb, 0x93d0: 0x5bc5,
			0x93d1: 0x9149, 0x93d2: 0x701e, 0x93d3: 0x5678, 0x93d4: 0x5c6f, 0x93d5: 0x60c7, 0x93d6: 0x6566, 0x93d7: 0x6c8c, 0x93d8: 0x8c5a,
			0x93d9: 0x9041, 0x93da: 0x9813, 0x93db: 0x5451, 0x93dc: 0x66c7, 0x93dd: 0x920d, 0x93de: 0x5948, 0x93df: 0x90a3, 0x93e0: 0x5185,
			0x93e1: 0x4e4d, 0x93e2: 0x51ea, 0x93e3: 0x8599, 0x93e4: 0x8b0e, 0x93e5: 0x7058, 0x93e6: 0x637a, 0x93e7: 0x934b, 0x93e8: 0x6962,
			0x93e9: 0x99b4, 0x93ea: 0x7e04, 0x93eb: 0x7577, 0x93ec: 0x5357, 0x93ed: 0x6960, 0x93ee: 0x8edf, 0x93ef: 0x96e3, 0x93f0: 0x6c5d,
			0x93f1: 0x4e8c, 0x93f2: 0x5c3c, 0x93f3: 0x5f10, 0x93f4: 0x8fe9, 0x93f5: 0x5302, 0x93f6: 0x8cd1, 0x93f7: 0x8089, 0x93f8: 0x8679,
			0x93f9: 0x5eff, 0x93fa: 0x65e5, 0x93fb: 0x4e73, 0x93fc: 0x5165, 0x9440: 0x5982, 0x9441: 0x5c3f, 0x9442: 0x97ee, 0x9443: 0x4efb,
			0x9444: 0x598a, 0x9445: 0x5fcd, 0x9446: 0x8a8d, 0x9447: 0x6fe1, 0x9448: 0x79b0, 0x9449: 0x7962, 0x944a: 0x5be7, 0x944b: 0x8471,
			0x944c: 0x732b, 0x944d: 0x71b1, 0x944e: 0x5e74, 0x944f: 0x5ff5, 0x9450: 0x637b, 0x9451: 0x649a, 0x9452: 0x71c3, 0x9453: 0x7c98,
			0x9454: 0x4e43, 0x9455: 0x5efc, 0x9456: 0x4e4b, 0x9457: 0x57dc, 0x9458: 0x56a2, 0x9459: 0x60a9, 0x945a: 0x6fc3, 0x945b: 0x7d0d,
			0x945c: 0x80fd, 0x945d: 0x8133, 0x945e: 0x81bf, 0x945f: 0x8fb2, 0x9460: 0x8997, 0x9461: 0x86a4, 0x9462: 0x5df4, 0x9463: 0x628a,
			0x9464: 0x64ad, 0x9465: 0x8987, 0x9466: 0x6777, 0x9467: 0x6ce2, 0x9468: 0x6d3e, 0x9469: 0x7436, 0x946a: 0x7834, 0x946b: 0x5a46,
			0x946c: 0x7f75, 0x946d: 0x82ad, 0x946e: 0x99ac, 0x946f: 0x4ff3, 0x9470: 0x5ec3, 0x9471: 0x62dd, 0x9472: 0x6392, 0x9473: 0x6557,
			0x9474: 0x676f, 0x9475: 0x76c3, 0x9476: 0x724c, 0x9477: 0x80cc, 0x9478: 0x80ba, 0x9479: 0x8f29, 0x947a: 0x914d, 0x947b: 0x500d,
			0x947c: 0x57f9, 0x947d: 0x5a92, 0x947e: 0x6885, 0x9480: 0x6973, 0x9481: 0x7164, 0x9482: 0x72fd, 0x9483: 0x8cb7, 0x9484: 0x58f2,
			0x9485: 0x8ce0, 0x9486: 0x966a, 0x9487: 0x9019, 0x9488: 0x877f, 0x9489: 0x79e4, 0x948a: 0x77e7, 0x948b: 0x8429, 0x948c: 0x4f2f,
			0x948d: 0x5265, 0x948e: 0x535a, 0x948f: 0x62cd, 0x9490: 0x67cf, 0x9491: 0x6cca, 0x9492: 0x767d, 0x9493: 0x7b94, 0x9494: 0x7c95,
			0x9495: 0x8236, 0x9496: 0x8584, 0x9497: 0x8feb, 0x9498: 0x66dd, 0x9499: 0x6f20, 0x949a: 0x7206, 0x949b: 0x7e1b, 0x949c: 0x83ab,
			0x949d: 0x99c1, 0x949e: 0x9ea6, 0x949f: 0x51fd, 0x94a0: 0x7bb1, 0x94a1: 0x7872, 0x94a2: 0x7bb8, 0x94a3: 0x8087, 0x94a4: 0x7b48,
			0x94a5: 0x6ae8, 0x94a6: 0x5e61, 0x94a7: 0x808c, 0x94a8: 0x7551, 0x94a9: 0x7560, 0x94aa: 0x516b, 0x94ab: 0x9262, 0x94ac: 0x6e8c,
			0x94ad: 0x767a, 0x94ae: 0x9197, 0x94af: 0x9aea, 0x94b0: 0x4f10, 0x94b1: 0x7f70, 0x94b2: 0x629c, 0x94b3: 0x7b4f, 0x94b4: 0x95a5,
			0x94b5: 0x9ce9, 0x94b6: 0x567a, 0x94b7: 0x5859, 0x94b8: 0x86e4, 0x94b9: 0x96bc, 0x94ba: 0x4f34, 0x94bb: 0x5224, 0x94bc: 0x534a,
			0x94bd: 0x53cd, 0x94be: 0x53db, 0x94bf: 0x5e06, 0x94c0: 0x642c, 0x94c1: 0x6591, 0x94c2: 0x677f, 0x94c3: 0x6c3e, 0x94c4: 0x6c4e,
			0x94c5: 0x7248, 0x94c6: 0x72af, 0x94c7: 0x73ed, 0x94c8: 0x7554, 0x94c9: 0x7e41, 0x94ca: 0x822c, 0x94cb: 0x85e9, 0x94cc: 0x8ca9,
			0x94cd: 0x7bc4, 0x94ce: 0x91c6, 0x94cf: 0x7169, 0x94d0: 0x9812, 0x94d1: 0x98ef, 0x94d2: 0x633d, 0x94d3: 0x6669, 0x94d4: 0x756a,
			0x94d5: 0x76e4, 0x94d6: 0x78d0, 0x94d7: 0x8543, 0x94d8: 0x86ee, 0x94d9: 0x532a, 0x94da: 0x5351, 0x94db: 0x5426, 0x94dc: 0x5983,
			0x94dd: 0x5e87, 0x94de: 0x5f7c, 0x94df: 0x60b2, 0x94e0: 0x6249, 0x94e1: 0x6279, 0x94e2: 0x62ab, 0x94e3: 0x6590, 0x94e4: 0x6bd4,
			0x94e5: 0x6ccc, 0x94e6: 0x75b2, 0x94e7: 0x76ae, 0x94e8: 0x7891, 0x94e9: 0x79d8, 0x94ea: 0x7dcb, 0x94eb: 0x7f77, 0x94ec: 0x80a5,
			0x94ed: 0x88ab, 0x94ee: 0x8ab9, 0x94ef: 0x8cbb, 0x94f0: 0x907f, 0x94f1: 0x975e, 0x94f2: 0x98db, 0x94f3: 0x6a0b, 0x94f4: 0x7c38,
			0x94f5: 0x5099, 0x94f6: 0x5c3e, 0x94f7: 0x5fae, 0x94f8: 0x6787, 0x94f9: 0x6bd8, 0x94fa: 0x7435, 0x94fb: 0x7709, 0x94fc: 0x7f8e,
			0x9540: 0x9f3b, 0x9541: 0x67ca, 0x9542: 0x7a17, 0x9543: 0x5339, 0x9544: 0x758b, 0x9545: 0x9aed, 0x9546: 0x5f66, 0x9547: 0x819d,
			0x9548: 0x83f1, 0x9549: 0x8098, 0x954a: 0x5f3c, 0x954b: 0x5fc5, 0x954c: 0x7562, 0x954d: 0x7b46, 0x954e: 0x903c, 0x954f: 0x6867,
			0x9550: 0x59eb, 0x9551: 0x5a9b, 0x9552: 0x7d10, 0x9553: 0x767e, 0x9554: 0x8b2c, 0x9555: 0x4ff5, 0x9556: 0x5f6a, 0x9557: 0x6a19,
			0x9558: 0x6c37, 0x9559: 0x6f02, 0x955a: 0x74e2, 0x955b: 0x7968, 0x955c: 0x8868, 0x955d: 0x8a55, 0x955e: 0x8c79, 0x955f: 0x5edf,
			0x9560: 0x63cf, 0x9561: 0x75c5, 0x9562: 0x79d2, 0x9563: 0x82d7, 0x9564: 0x9328, 0x9565: 0x92f2, 0x9566: 0x849c, 0x9567: 0x86ed,
			0x9568: 0x9c2d, 0x9569: 0x54c1, 0x956a: 0x5f6c, 0x956b: 0x658c, 0x956c: 0x6d5c, 0x956d: 0x7015, 0x956e: 0x8ca7, 0x956f: 0x8cd3,
			0x9570: 0x983b, 0x9571: 0x654f, 0x9572: 0x74f6, 0x9573: 0x4e0d, 0x9574: 0x4ed8, 0x9575: 0x57e0, 0x9576: 0x592b, 0x9577: 0x5a66,
			0x9578: 0x5bcc, 0x9579: 0x51a8, 0x957a: 0x5e03, 0x957b: 0x5e9c, 0x957c: 0x6016, 0x957d: 0x6276, 0x957e: 0x6577, 0x9580: 0x65a7,
			0x9581: 0x666e, 0x9582: 0x6d6e, 0x9583: 0x7236, 0x9584: 0x7b26, 0x9585: 0x8150, 0x9586: 0x819a, 0x9587: 0x8299, 0x9588: 0x8b5c,
			0x9589: 0x8ca0, 0x958a: 0x8ce6, 0x958b: 0x8d74, 0x958c: 0x961c, 0x958d: 0x9644, 0x958e: 0x4fae, 0x958f: 0x64ab, 0x9590: 0x6b66,
			0x9591: 0x821e, 0x9592: 0x8461, 0x9593: 0x856a, 0x9594: 0x90e8, 0x9595: 0x5c01, 0x9596: 0x6953, 0x9597: 0x98a8, 0x9598: 0x847a,
			0x9599: 0x8557, 0x959a: 0x4f0f, 0x959b: 0x526f, 0x959c: 0x5fa9, 0x959d: 0x5e45, 0x959e: 0x670d, 0x959f: 0x798f, 0x95a0: 0x8179,
			0x95a1: 0x8907, 0x95a2: 0x8986, 0x95a3: 0x6df5, 0x95a4: 0x5f17, 0x95a5: 0x6255, 0x95a6: 0x6cb8, 0x95a7: 0x4ecf, 0x95a8: 0x7269,
			0x95a9: 0x9b92, 0x95aa: 0x5206, 0x95ab: 0x543b, 0x95ac: 0x5674, 0x95ad: 0x58b3, 0x95ae: 0x61a4, 0x95af: 0x626e, 0x95b0: 0x711a,
			0x95b1: 0x596e, 0x95b2: 0x7c89, 0x95b3: 0x7cde, 0x95b4: 0x7d1b, 0x95b5: 0x96f0, 0x95b6: 0x6587, 0x95b7: 0x805e, 0x95b8: 0x4e19,
			0x95b9: 0x4f75, 0x95ba: 0x5175, 0x95bb: 0x5840, 0x95bc: 0x5e63, 0x95bd: 0x5e73, 0x95be: 0x5f0a, 0x95bf: 0x67c4, 0x95c0: 0x4e26,
			0x95c1: 0x853d, 0x95c2: 0x9589, 0x95c3: 0x965b, 0x95c4: 0x7c73, 0x95c5: 0x9801, 0x95c6: 0x50fb, 0x95c7: 0x58c1, 0x95c8: 0x7656,
			0x95c9: 0x78a7, 0x95ca: 0x5225, 0x95cb: 0x77a5, 0x95cc: 0x8511, 0x95cd: 0x7b86, 0x95ce: 0x504f, 0x95cf: 0x5909, 0x95d0: 0x7247,
			0x95d1: 0x7bc7, 0x95d2: 0x7de8, 0x95d3: 0x8fba, 0x95d4: 0x8fd4, 0x95d5: 0x904d, 0x95d6: 0x4fbf, 0x95d7: 0x52c9, 0x95d8: 0x5a29,
			0x95d9: 0x5f01, 0x95da: 0x97ad, 0x95db: 0x4fdd, 0x95dc: 0x8217, 0x95dd: 0x92ea, 0x95de: 0x5703, 0x95df: 0x6355, 0x95e0: 0x6b69,
			0x95e1: 0x752b, 0x95e2: 0x88dc, 0x95e3: 0x8f14, 0x95e4: 0x7a42, 0x95e5: 0x52df, 0x95e6: 0x5893, 0x95e7: 0x6155, 0x95e8: 0x620a,
			0x95e9: 0x66ae, 0x95ea: 0x6bcd, 0x95eb: 0x7c3f, 0x95ec: 0x83e9, 0x95ed: 0x5023, 0x95ee: 0x4ff8, 0x95ef: 0x5305, 0x95f0: 0x5446,
			0x95f1: 0x5831, 0x95f2: 0x5949, 0x95f3: 0x5b9d, 0x95f4: 0x5cf0, 0x95f5: 0x5cef, 0x95f6: 0x5d29, 0x95f7: 0x5e96, 0x95f8: 0x62b1,
			0x95f9: 0x6367, 0x95fa: 0x653e, 0x95fb: 0x65b9, 0x95fc: 0x670b, 0x9640: 0x6cd5, 0x9641: 0x6ce1, 0x9642: 0x70f9, 0x9643: 0x7832,
			0x9644: 0x7e2b, 0x9645: 0x80de, 0x9646: 0x82b3, 0x9647: 0x840c, 0x9648: 0x84ec, 0x9649: 0x8702, 0x964a: 0x8912, 0x964b: 0x8a2a,
			0x964c: 0x8c4a, 0x964d: 0x90a6, 0x964e: 0x92d2, 0x964f: 0x98fd, 0x9650: 0x9cf3, 0x9651: 0x9d6c, 0x9652: 0x4e4f, 0x9653: 0x4ea1,
			0x9654: 0x508d, 0x9655: 0x5256, 0x9656: 0x574a, 0x9657: 0x59a8, 0x9658: 0x5e3d, 0x9659: 0x5fd8, 0x965a: 0x5fd9, 0x965b: 0x623f,
			0x965c: 0x66b4, 0x965d: 0x671b, 0x965e: 0x67d0, 0x965f: 0x68d2, 0x9660: 0x5192, 0x9661: 0x7d21, 0x9662: 0x80aa, 0x9663: 0x81a8,
			0x9664: 0x8b00, 0x9665: 0x8c8c, 0x9666: 0x8cbf, 0x9667: 0x927e, 0x9668: 0x9632, 0x9669: 0x5420, 0x966a: 0x982c, 0x966b: 0x5317,
			0x966c: 0x50d5, 0x966d: 0x535c, 0x966e: 0x58a8, 0x966f: 0x64b2, 0x9670: 0x6734, 0x9671: 0x7267, 0x9672: 0x7766, 0x9673: 0x7a46,
			0x9674: 0x91e6, 0x9675: 0x52c3, 0x9676: 0x6ca1, 0x9677: 0x6b86, 0x9678: 0x5800, 0x9679: 0x5e4c, 0x967a: 0x5954, 0x967b: 0x672c,
			0x967c: 0x7ffb, 0x967d: 0x51e1, 0x967e: 0x76c6, 0x9680: 0x6469, 0x9681: 0x78e8, 0x9682: 0x9b54, 0x9683: 0x9ebb, 0x9684: 0x57cb,
			0x9685: 0x59b9, 0x9686: 0x6627, 0x9687: 0x679a, 0x9688: 0x6bce, 0x9689: 0x54e9, 0x968a: 0x69d9, 0x968b: 0x5e55, 0x968c: 0x819c,
			0x968d: 0x6795, 0x968e: 0x9baa, 0x968f: 0x67fe, 0x9690: 0x9c52, 0x9691: 0x685d, 0x9692: 0x4ea6, 0x9693: 0x4fe3, 0x9694: 0x53c8,
			0x9695: 0x62b9, 0x9696: 0x672b, 0x9697: 0x6cab, 0x9698: 0x8fc4, 0x9699: 0x4fad, 0x969a: 0x7e6d, 0x969b: 0x9ebf, 0x969c: 0x4e07,
			0x969d: 0x6162, 0x969e: 0x6e80, 0x969f: 0x6f2b, 0x96a0: 0x8513, 0x96a1: 0x5473, 0x96a2: 0x672a, 0x96a3: 0x9b45, 0x96a4: 0x5df3,
			0x96a5: 0x7b95, 0x96a6: 0x5cac, 0x96a7: 0x5bc6, 0x96a8: 0x871c, 0x96a9: 0x6e4a, 0x96aa: 0x84d1, 0x96ab: 0x7a14, 0x96ac: 0x8108,
			0x96ad: 0x5999, 0x96ae: 0x7c8d, 0x96af: 0x6c11, 0x96b0: 0x7720, 0x96b1: 0x52d9, 0x96b2: 0x5922, 0x96b3: 0x7121, 0x96b4: 0x725f,
			0x96b5: 0x77db, 0x96b6: 0x9727, 0x96b7: 0x9d61, 0x96b8: 0x690b, 0x96b9: 0x5a7f, 0x96ba: 0x5a18, 0x96bb: 0x51a5, 0x96bc: 0x540d,
			0x96bd: 0x547d, 0x96be: 0x660e, 0x96bf: 0x76df, 0x96c0: 0x8ff7, 0x96c1: 0x9298, 0x96c2: 0x9cf4, 0x96c3: 0x59ea, 0x96c4: 0x725d,
			0x96c5: 0x6ec5, 0x96c6: 0x514d, 0x96c7: 0x68c9, 0x96c8: 0x7dbf, 0x96c9: 0x7dec, 0x96ca: 0x9762, 0x96cb: 0x9eba, 0x96cc: 0x6478,
			0x96cd: 0x6a21, 0x96ce: 0x8302, 0x96cf: 0x5984, 0x96d0: 0x5b5f, 0x96d1: 0x6bdb, 0x96d2: 0x731b, 0x96d3: 0x76f2, 0x96d4: 0x7db2,
			0x96d5: 0x8017, 0x96d6: 0x8499, 0x96d7: 0x5132, 0x96d8: 0x6728, 0x96d9: 0x9ed9, 0x96da: 0x76ee, 0x96db: 0x6762, 0x96dc: 0x52ff,
			0x96dd: 0x9905, 0x96de: 0x5c24, 0x96df: 0x623b, 0x96e0: 0x7c7e, 0x96e1: 0x8cb0, 0x96e2: 0x554f, 0x96e3: 0x60b6, 0x96e4: 0x7d0b,
			0x96e5: 0x9580, 0x96e6: 0x5301, 0x96e7: 0x4e5f, 0x96e8: 0x51b6, 0x96e9: 0x591c, 0x96ea: 0x723a, 0x96eb: 0x8036, 0x96ec: 0x91ce,
			0x96ed: 0x5f25, 0x96ee: 0x77e2, 0x96ef: 0x5384, 0x96f0: 0x5f79, 0x96f1: 0x7d04, 0x96f2: 0x85ac, 0x96f3: 0x8a33, 0x96f4: 0x8e8d,
			0x96f5: 0x9756, 0x96f6: 0x67f3, 0x96f7: 0x85ae, 0x96f8: 0x9453, 0x96f9: 0x6109, 0x96fa: 0x6108, 0x96fb: 0x6cb9, 0x96fc: 0x7652,
			0x9740: 0x8aed, 0x9741: 0x8f38, 0x9742: 0x552f, 0x9743: 0x4f51, 0x9744: 0x512a, 0x9745: 0x52c7, 0x9746: 0x53cb, 0x9747: 0x5ba5,
			0x9748: 0x5e7d, 0x9749: 0x60a0, 0x974a: 0x6182, 0x974b: 0x63d6, 0x974c: 0x6709, 0x974d: 0x67da, 0x974e: 0x6e67, 0x974f: 0x6d8c,
			0x9750: 0x7336, 0x9751: 0x7337, 0x9752: 0x7531, 0x9753: 0x7950, 0x9754: 0x88d5, 0x9755: 0x8a98, 0x9756: 0x904a, 0x9757: 0x9091,
			0x9758: 0x90f5, 0x9759: 0x96c4, 0x975a: 0x878d, 0x975b: 0x5915, 0x975c: 0x4e88, 0x975d: 0x4f59, 0x975e: 0x4e0e, 0x975f: 0x8a89,
			0x9760: 0x8f3f, 0x9761: 0x9810, 0x9762: 0x50ad, 0x9763: 0x5e7c, 0x9764: 0x5996, 0x9765: 0x5bb9, 0x9766: 0x5eb8, 0x9767: 0x63da,
			0x9768: 0x63fa, 0x9769: 0x64c1, 0x976a: 0x66dc, 0x976b: 0x694a, 0x976c: 0x69d8, 0x976d: 0x6d0b, 0x976e: 0x6eb6, 0x976f: 0x7194,
			0x9770: 0x7528, 0x9771: 0x7aaf, 0x9772: 0x7f8a, 0x9773: 0x8000, 0x9774: 0x8449, 0x9775: 0x84c9, 0x9776: 0x8981, 0x9777: 0x8b21,
			0x9778: 0x8e0a, 0x9779: 0x9065, 0x977a: 0x967d, 0x977b: 0x990a, 0x977c: 0x617e, 0x977d: 0x6291, 0x977e: 0x6b32, 0x9780: 0x6c83,
			0x9781: 0x6d74, 0x9782: 0x7fcc, 0x9783: 0x7ffc, 0x9784: 0x6dc0, 0x9785: 0x7f85, 0x9786: 0x87ba, 0x9787: 0x88f8, 0x9788: 0x6765,
			0x9789: 0x83b1, 0x978a: 0x983c, 0x978b: 0x96f7, 0x978c: 0x6d1b, 0x978d: 0x7d61, 0x978e: 0x843d, 0x978f: 0x916a, 0x9790: 0x4e71,
			0x9791: 0x5375, 0x9792: 0x5d50, 0x9793: 0x6b04, 0x9794: 0x6feb, 0x9795: 0x85cd, 0x9796: 0x862d, 0x9797: 0x89a7, 0x9798: 0x5229,
			0x9799: 0x540f, 0x979a: 0x5c65, 0x979b: 0x674e, 0x979c: 0x68a8, 0x979d: 0x7406, 0x979e: 0x7483, 0x979f: 0x75e2, 0x97a0: 0x88cf,
			0x97a1: 0x88e1, 0x97a2: 0x91cc, 0x97a3: 0x96e2, 0x97a4: 0x9678, 0x97a5: 0x5f8b, 0x97a6: 0x7387, 0x97a7: 0x7acb, 0x97a8: 0x844e,
			0x97a9: 0x63a0, 0x97aa: 0x7565, 0x97ab: 0x5289, 0x97ac: 0x6d41, 0x97ad: 0x6e9c, 0x97ae: 0x7409, 0x97af: 0x7559, 0x97b0: 0x786b,
			0x97b1: 0x7c92, 0x97b2: 0x9686, 0x97b3: 0x7adc, 0x97b4: 0x9f8d, 0x97b5: 0x4fb6, 0x97b6: 0x616e, 0x97b7: 0x65c5, 0x97b8: 0x865c,
			0x97b9: 0x4e86, 0x97ba: 0x4eae, 0x97bb: 0x50da, 0x97bc: 0x4e21, 0x97bd: 0x51cc, 0x97be: 0x5bee, 0x97bf: 0x6599, 0x97c0: 0x6881,
			0x97c1: 0x6dbc, 0x97c2: 0x731f, 0x97c3: 0x7642, 0x97c4: 0x77ad, 0x97c5: 0x7a1c, 0x97c6: 0x7ce7, 0x97c7: 0x826f, 0x97c8: 0x8ad2,
			0x97c9: 0x907c, 0x97ca: 0x91cf, 0x97cb: 0x9675, 0x97cc: 0x9818, 0x97cd: 0x529b, 0x97ce: 0x7dd1, 0x97cf: 0x502b, 0x97d0: 0x5398,
			0x97d1: 0x6797, 0x97d2: 0x6dcb, 0x97d3: 0x71d0, 0x97d4: 0x7433, 0x97d5: 0x81e8, 0x97d6: 0x8f2a, 0x97d7: 0x96a3, 0x97d8: 0x9c57,
			0x97d9: 0x9e9f, 0x97da: 0x7460, 0x97db: 0x5841, 0x97dc: 0x6d99, 0x97dd: 0x7d2f, 0x97de: 0x985e, 0x97df: 0x4ee4, 0x97e0: 0x4f36,
			0x97e1: 0x4f8b, 0x97e2: 0x51b7, 0x97e3: 0x52b1, 0x97e4: 0x5dba, 0x97e5: 0x601c, 0x97e6: 0x73b2, 0x97e7: 0x793c, 0x97e8: 0x82d3,
			0x97e9: 0x9234, 0x97ea: 0x96b7, 0x97eb: 0x96f6, 0x97ec: 0x970a, 0x97ed: 0x9e97, 0x97ee: 0x9f62, 0x97ef: 0x66a6, 0x97f0: 0x6b74,
			0x97f1: 0x5217, 0x97f2: 0x52a3, 0x97f3: 0x70c8, 0x97f4: 0x88c2, 0x97f5: 0x5ec9, 0x97f6: 0x604b, 0x97f7: 0x6190, 0x97f8: 0x6f23,
			0x97f9: 0x7149, 0x97fa: 0x7c3e, 0x97fb: 0x7df4, 0x97fc: 0x806f, 0x9840: 0x84ee, 0x9841: 0x9023, 0x9842: 0x932c, 0x9843: 0x5442,
			0x9844: 0x9b6f, 0x9845: 0x6ad3, 0x9846: 0x7089, 0x9847: 0x8cc2, 0x9848: 0x8def, 0x9849: 0x9732, 0x984a: 0x52b4, 0x984b: 0x5a41,
			0x984c: 0x5eca, 0x984d: 0x5f04, 0x984e: 0x6717, 0x984f: 0x697c, 0x9850: 0x6994, 0x9851: 0x6d6a, 0x9852: 0x6f0f, 0x9853: 0x7262,
			0x9854: 0x72fc, 0x9855: 0x7bed, 0x9856: 0x8001, 0x9857: 0x807e, 0x9858: 0x874b, 0x9859: 0x90ce, 0x985a: 0x516d, 0x985b: 0x9e93,
			0x985c: 0x7984, 0x985d: 0x808b, 0x985e: 0x9332, 0x985f: 0x8ad6, 0x9860: 0x502d, 0x9861: 0x548c, 0x9862: 0x8a71, 0x9863: 0x6b6a,
			0x9864: 0x8cc4, 0x9865: 0x8107, 0x9866: 0x60d1, 0x9867: 0x67a0, 0x9868: 0x9df2, 0x9869: 0x4e99, 0x986a: 0x4e98, 0x986b: 0x9c10,
			0x986c: 0x8a6b, 0x986d: 0x85c1, 0x986e: 0x8568, 0x986f: 0x6900, 0x9870: 0x6e7e, 0x9871: 0x7897, 0x9872: 0x8155, 0x989f: 0x5f0c,
			0x98a0: 0x4e10, 0x98a1: 0x4e15, 0x98a2: 0x4e2a, 0x98a3: 0x4e31, 0x98a4: 0x4e36, 0x98a5: 0x4e3c, 0x98a6: 0x4e3f, 0x98a7: 0x4e42,
			0x98a8: 0x4e56, 0x98a9: 0x4e58, 0x98aa: 0x4e82, 0x98ab: 0x4e85, 0x98ac: 0x8c6b, 0x98ad: 0x4e8a, 0x98ae: 0x8212, 0x98af: 0x5f0d,
			0x98b0: 0x4e8e, 0x98b1: 0x4e9e, 0x98b2: 0x4e9f, 0x98b3: 0x4ea0, 0x98b4: 0x4ea2, 0x98b5: 0x4eb0, 0x98b6: 0x4eb3, 0x98b7: 0x4eb6,
			0x98b8: 0x4ece, 0x98b9: 0x4ecd, 0x98ba: 0x4ec4, 0x98bb: 0x4ec6, 0x98bc: 0x4ec2, 0x98bd: 0x4ed7, 0x98be: 0x4ede, 0x98bf: 0x4eed,
			0x98c0: 0x4edf, 0x98c1: 0x4ef7, 0x98c2: 0x4f09, 0x98c3: 0x4f5a, 0x98c4: 0x4f30, 0x98c5: 0x4f5b, 0x98c6: 0x4f5d, 0x98c7: 0x4f57,
			0x98c8: 0x4f47, 0x98c9: 0x4f76, 0x98ca: 0x4f88, 0x98cb: 0x4f8f, 0x98cc: 0x4f98, 0x98cd: 0x4f7b, 0x98ce: 0x4f69, 0x98cf: 0x4f70,
			0x98d0: 0x4f91, 0x98d1: 0x4f6f, 0x98d2: 0x4f86, 0x98d3: 0x4f96, 0x98d4: 0x5118, 0x98d5: 0x4fd4, 0x98d6: 0x4fdf, 0x98d7: 0x4fce,
			0x98d8: 0x4fd8, 0x98d9: 0x4fdb, 0x98da: 0x4fd1, 0x98db: 0x4fda, 0x98dc: 0x4fd0, 0x98dd: 0x4fe4, 0x98de: 0x4fe5, 0x98df: 0x501a,
			0x98e0: 0x5028, 0x98e1: 0x5014, 0x98e2: 0x502a, 0x98e3: 0x5025, 0x98e4: 0x5005, 0x98e5: 0x4f1c, 0x98e6: 0x4ff6, 0x98e7: 0x5021,
			0x98e8: 0x5029, 0x98e9: 0x502c, 0x98ea: 0x4ffe, 0x98eb: 0x4fef, 0x98ec: 0x5011, 0x98ed: 0x5006, 0x98ee: 0x5043, 0x98ef: 0x5047,
			0x98f0: 0x6703, 0x98f1: 0x5055, 0x98f2: 0x5050, 0x98f3: 0x5048, 0x98f4: 0x505a, 0x98f5: 0x5056, 0x98f6: 0x506c, 0x98f7: 0x5078,
			0x98f8: 0x5080, 0x98f9: 0x509a, 0x98fa: 0x5085, 0x98fb: 0x50b4, 0x98fc: 0x50b2, 0x9940: 0x50c9, 0x9941: 0x50ca, 0x9942: 0x50b3,
			0x9943: 0x50c2, 0x9944: 0x50d6, 0x9945: 0x50de, 0x9946: 0x50e5, 0x9947: 0x50ed, 0x9948: 0x50e3, 0x9949: 0x50ee, 0x994a: 0x50f9,
			0x994b: 0x50f5, 0x994c: 0x5109, 0x994d: 0x5101, 0x994e: 0x5102, 0x994f: 0x5116, 0x9950: 0x5115, 0x9951: 0x5114, 0x9952: 0x511a,
			0x9953: 0x5121, 0x9954: 0x513a, 0x9955: 0x5137, 0x9956: 0x513c, 0x9957: 0x513b, 0x9958: 0x513f, 0x9959: 0x5140, 0x995a: 0x5152,
			0x995b: 0x514c, 0x995c: 0x5154, 0x995d: 0x5162, 0x995e: 0x7af8, 0x995f: 0x5169, 0x9960: 0x516a, 0x9961: 0x516e, 0x9962: 0x5180,
			0x9963: 0x5182, 0x9964: 0x56d8, 0x9965: 0x518c, 0x9966: 0x5189, 0x9967: 0x518f, 0x9968: 0x5191, 0x9969: 0x5193, 0x996a: 0x5195,
			0x996b: 0x5196, 0x996c: 0x51a4, 0x996d: 0x51a6, 0x996e: 0x51a2, 0x996f: 0x51a9, 0x9970: 0x51aa, 0x9971: 0x51ab, 0x9972: 0x51b3,
			0x9973: 0x51b1, 0x9974: 0x51b2, 0x9975: 0x51b0, 0x9976: 0x51b5, 0x9977: 0x51bd, 0x9978: 0x51c5, 0x9979: 0x51c9, 0x997a: 0x51db,
			0x997b: 0x51e0, 0x997c: 0x8655, 0x997d: 0x51e9, 0x997e: 0x51ed, 0x9980: 0x51f0, 0x9981: 0x51f5, 0x9982: 0x51fe, 0x9983: 0x5204,
			0x9984: 0x520b, 0x9985: 0x5214, 0x9986: 0x520e, 0x9987: 0x5227, 0x9988: 0x522a, 0x9989: 0x522e, 0x998a: 0x5233, 0x998b: 0x5239,
			0x998c: 0x524f, 0x998d: 0x5244, 0x998e: 0x524b, 0x998f: 0x524c, 0x9990: 0x525e, 0x9991: 0x5254, 0x9992: 0x526a, 0x9993: 0x5274,
			0x9994: 0x5269, 0x9995: 0x5273, 0x9996: 0x527f, 0x9997: 0x527d, 0x9998: 0x528d, 0x9999: 0x5294, 0x999a: 0x5292, 0x999b: 0x5271,
			0x999c: 0x5288, 0x999d: 0x5291, 0x999e: 0x8fa8, 0x999f: 0x8fa7, 0x99a0: 0x52ac, 0x99a1: 0x52ad, 0x99a2: 0x52bc, 0x99a3: 0x52b5,
			0x99a4: 0x52c1, 0x99a5: 0x52cd, 0x99a6: 0x52d7, 0x99a7: 0x52de, 0x99a8: 0x52e3, 0x99a9: 0x52e6, 0x99aa: 0x98ed, 0x99ab: 0x52e0,
			0x99ac: 0x52f3, 0x99ad: 0x52f5, 0x99ae: 0x52f8, 0x99af: 0x52f9, 0x99b0: 0x5306, 0x99b1: 0x5308, 0x99b2: 0x7538, 0x99b3: 0x530d,
			0x99b4: 0x5310, 0x99b5: 0x530f, 0x99b6: 0x5315, 0x99b7: 0x531a, 0x99b8: 0x5323, 0x99b9: 0x532f, 0x99ba: 0x5331, 0x99bb: 0x5333,
			0x99bc: 0x5338, 0x99bd: 0x5340, 0x99be: 0x5346, 0x99bf: 0x5345, 0x99c0: 0x4e17, 0x99c1: 0x5349, 0x99c2: 0x534d, 0x99c3: 0x51d6,
			0x99c4: 0x535e, 0x99c5: 0x5369, 0x99c6: 0x536e, 0x99c7: 0x5918, 0x99c8: 0x537b, 0x99c9: 0x5377, 0x99ca: 0x5382, 0x99cb: 0x5396,
			0x99cc: 0x53a0, 0x99cd: 0x53a6, 0x99ce: 0x53a5, 0x99cf: 0x53ae, 0x99d0: 0x53b0, 0x99d1: 0x53b6, 0x99d2: 0x53c3, 0x99d3: 0x7c12,
			0x99d4: 0x96d9, 0x99d5: 0x53df, 0x99d6: 0x66fc, 0x99d7: 0x71ee, 0x99d8: 0x53ee, 0x99d9: 0x53e8, 0x99da: 0x53ed, 0x99db: 0x53fa,
			0x99dc: 0x5401, 0x99dd: 0x543d, 0x99de: 0x5440, 0x99df: 0x542c, 0x99e0: 0x542d, 0x99e1: 0x543c, 0x99e2: 0x542e, 0x99e3: 0x5436,
			0x99e4: 0x5429, 0x99e5: 0x541d, 0x99e6: 0x544e, 0x99e7: 0x548f, 0x99e8: 0x5475, 0x99e9: 0x548e, 0x99ea: 0x545f, 0x99eb: 0x5471,
			0x99ec: 0x5477, 0x99ed: 0x5470, 0x99ee: 0x5492, 0x99ef: 0x547b, 0x99f0: 0x5480, 0x99f1: 0x5476, 0x99f2: 0x5484, 0x99f3: 0x5490,
			0x99f4: 0x5486, 0x99f5: 0x54c7, 0x99f6: 0x54a2, 0x99f7: 0x54b8, 0x99f8: 0x54a5, 0x99f9: 0x54ac, 0x99fa: 0x54c4, 0x99fb: 0x54c8,
			0x99fc: 0x54a8, 0x9a40: 0x54ab, 0x9a41: 0x54c2, 0x9a42: 0x54a4, 0x9a43: 0x54be, 0x9a44: 0x54bc, 0x9a45: 0x54d8, 0x9a46: 0x54e5,
			0x9a47: 0x54e6, 0x9a48: 0x550f, 0x9a49: 0x5514, 0x9a4a: 0x54fd, 0x9a4b: 0x54ee, 0x9a4c: 0x54ed, 0x9a4d: 0x54fa, 0x9a4e: 0x54e2,
			0x9a4f: 0x5539, 0x9a50: 0x5540, 0x9a51: 0x5563, 0x9a52: 0x554c, 0x9a53: 0x552e, 0x9a54: 0x555c, 0x9a55: 0x5545, 0x9a56: 0x5556,
			0x9a57: 0x5557, 0x9a58: 0x5538, 0x9a59: 0x5533, 0x9a5a: 0x555d, 0x9a5b: 0x5599, 0x9a5c: 0x5580, 0x9a5d: 0x54af, 0x9a5e: 0x558a,
			0x9a5f: 0x559f, 0x9a60: 0x557b, 0x9a61: 0x557e, 0x9a62: 0x5598, 0x9a63: 0x559e, 0x9a64: 0x55ae, 0x9a65: 0x557c, 0x9a66: 0x5583,
			0x9a67: 0x55a9, 0x9a68: 0x5587, 0x9a69: 0x55a8, 0x9a6a: 0x55da, 0x9a6b: 0x55c5, 0x9a6c: 0x55df, 0x9a6d: 0x55c4, 0x9a6e: 0x55dc,
			0x9a6f: 0x55e4, 0x9a70: 0x55d4, 0x9a71: 0x5614, 0x9a72: 0x55f7, 0x9a73: 0x5616, 0x9a74: 0x55fe, 0x9a75: 0x55fd, 0x9a76: 0x561b,
			0x9a77: 0x55f9, 0x9a78: 0x564e, 0x9a79: 0x5650, 0x9a7a: 0x71df, 0x9a7b: 0x5634, 0x9a7c: 0x5636, 0x9a7d: 0x5632, 0x9a7e: 0x5638,
			0x9a80: 0x566b, 0x9a81: 0x5664, 0x9a82: 0x562f, 0x9a83: 0x566c, 0x9a84: 0x566a, 0x9a85: 0x5686, 0x9a86: 0x5680, 0x9a87: 0x568a,
			0x9a88: 0x56a0, 0x9a89: 0x5694, 0x9a8a: 0x568f, 0x9a8b: 0x56a5, 0x9a8c: 0x56ae, 0x9a8d: 0x56b6, 0x9a8e: 0x56b4, 0x9a8f: 0x56c2,
			0x9a90: 0x56bc, 0x9a91: 0x56c1, 0x9a92: 0x56c3, 0x9a93: 0x56c0, 0x9a94: 0x56c8, 0x9a95: 0x56ce, 0x9a96: 0x56d1, 0x9a97: 0x56d3,
			0x9a98: 0x56d7, 0x9a99: 0x56ee, 0x9a9a: 0x56f9, 0x9a9b: 0x5700, 0x9a9c: 0x56ff, 0x9a9d: 0x5704, 0x9a9e: 0x5709, 0x9a9f: 0x5708,
			0x9aa0: 0x570b, 0x9aa1: 0x570d, 0x9aa2: 0x5713, 0x9aa3: 0x5718, 0x9aa4: 0x5716, 0x9aa5: 0x55c7, 0x9aa6: 0x571c, 0x9aa7: 0x5726,
			0x9aa8: 0x5737, 0x9aa9: 0x5738, 0x9aaa: 0x574e, 0x9aab: 0x573b, 0x9aac: 0x5740, 0x9aad: 0x574f, 0x9aae: 0x5769, 0x9aaf: 0x57c0,
			0x9ab0: 0x5788, 0x9ab1: 0x5761, 0x9ab2: 0x577f, 0x9ab3: 0x5789, 0x9ab4: 0x5793, 0x9ab5: 0x57a0, 0x9ab6: 0x57b3, 0x9ab7: 0x57a4,
			0x9ab8: 0x57aa, 0x9ab9: 0x57b0, 0x9aba: 0x57c3, 0x9abb: 0x57c6, 0x9abc: 0x57d4, 0x9abd: 0x57d2, 0x9abe: 0x57d3, 0x9abf: 0x580a,
			0x9ac0: 0x57d6, 0x9ac1: 0x57e3, 0x9ac2: 0x580b, 0x9ac3: 0x5819, 0x9ac4: 0x581d, 0x9ac5: 0x5872, 0x9ac6: 0x5821, 0x9ac7: 0x5862,
			0x9ac8: 0x584b, 0x9ac9: 0x5870, 0x9aca: 0x6bc0, 0x9acb: 0x5852, 0x9acc: 0x583d, 0x9acd: 0x5879, 0x9ace: 0x5885, 0x9acf: 0x58b9,
			0x9ad0: 0x589f, 0x9ad1: 0x58ab, 0x9ad2: 0x58ba, 0x9ad3: 0x58de, 0x9ad4: 0x58bb, 0x9ad5: 0x58b8, 0x9ad6: 0x58ae, 0x9ad7: 0x58c5,
			0x9ad8: 0x58d3, 0x9ad9: 0x58d1, 0x9ada: 0x58d7, 0x9adb: 0x58d9, 0x9adc: 0x58d8, 0x9add: 0x58e5, 0x9ade: 0x58dc, 0x9adf: 0x58e4,
			0x9ae0: 0x58df, 0x9ae1: 0x58ef, 0x9ae2: 0x58fa, 0x9ae3: 0x58f9, 0x9ae4: 0x58fb, 0x9ae5: 0x58fc, 0x9ae6: 0x58fd, 0x9ae7: 0x5902,
			0x9ae8: 0x590a, 0x9ae9: 0x5910, 0x9aea: 0x591b, 0x9aeb: 0x68a6, 0x9aec: 0x5925, 0x9aed: 0x592c, 0x9aee: 0x592d, 0x9aef: 0x5932,
			0x9af0: 0x5938, 0x9af1: 0x593e, 0x9af2: 0x7ad2, 0x9af3: 0x5955, 0x9af4: 0x5950, 0x9af5: 0x594e, 0x9af6: 0x595a, 0x9af7: 0x5958,
			0x9af8: 0x5962, 0x9af9: 0x5960, 0x9afa: 0x5967, 0x9afb: 0x596c, 0x9afc: 0x5969, 0x9b40: 0x5978, 0x9b41: 0x5981, 0x9b42: 0x599d,
			0x9b43: 0x4f5e, 0x9b44: 0x4fab, 0x9b45: 0x59a3, 0x9b46: 0x59b2, 0x9b47: 0x59c6, 0x9b48: 0x59e8, 0x9b49: 0x59dc, 0x9b4a: 0x598d,
			0x9b4b: 0x59d9, 0x9b4c: 0x59da, 0x9b4d: 0x5a25, 0x9b4e: 0x5a1f, 0x9b4f: 0x5a11, 0x9b50: 0x5a1c, 0x9b51: 0x5a09, 0x9b52: 0x5a1a,
			0x9b53: 0x5a40, 0x9b54: 0x5a6c, 0x9b55: 0x5a49, 0x9b56: 0x5a35, 0x9b57: 0x5a36, 0x9b58: 0x5a62, 0x9b59: 0x5a6a, 0x9b5a: 0x5a9a,
			0x9b5b: 0x5abc, 0x9b5c: 0x5abe, 0x9b5d: 0x5acb, 0x9b5e: 0x5ac2, 0x9b5f: 0x5abd, 0x9b60: 0x5ae3, 0x9b61: 0x5ad7, 0x9b62: 0x5ae6,
			0x9b63: 0x5ae9, 0x9b64: 0x5ad6, 0x9b65: 0x5afa, 0x9b66: 0x5afb, 0x9b67: 0x5b0c, 0x9b68: 0x5b0b, 0x9b69: 0x5b16, 0x9b6a: 0x5b32,
			0x9b6b: 0x5ad0, 0x9b6c: 0x5b2a, 0x9b6d: 0x5b36, 0x9b6e: 0x5b3e, 0x9b6f: 0x5b43, 0x9b70: 0x5b45, 0x9b71: 0x5b40, 0x9b72: 0x5b51,
			0x9b73: 0x5b55, 0x9b74: 0x5b5a, 0x9b75: 0x5b5b, 0x9b76: 0x5b65, 0x9b77: 0x5b69, 0x9b78: 0x5b70, 0x9b79: 0x5b73, 0x9b7a: 0x5b75,
			0x9b7b: 0x5b78, 0x9b7c: 0x6588, 0x9b7d: 0x5b7a, 0x9b7e: 0x5b80, 0x9b80: 0x5b83, 0x9b81: 0x5ba6, 0x9b82: 0x5bb8, 0x9b83: 0x5bc3,
			0x9b84: 0x5bc7, 0x9b85: 0x5bc9, 0x9b86: 0x5bd4, 0x9b87: 0x5bd0, 0x9b88: 0x5be4, 0x9b89: 0x5be6, 0x9b8a: 0x5be2, 0x9b8b: 0x5bde,
			0x9b8c: 0x5be5, 0x9b8d: 0x5beb, 0x9b8e: 0x5bf0, 0x9b8f: 0x5bf6, 0x9b90: 0x5bf3, 0x9b91: 0x5c05, 0x9b92: 0x5c07, 0x9b93: 0x5c08,
			0x9b94: 0x5c0d, 0x9b95: 0x5c13, 0x9b96: 0x5c20, 0x9b97: 0x5c22, 0x9b98: 0x5c28, 0x9b99: 0x5c38, 0x9b9a: 0x5c39, 0x9b9b: 0x5c41,
			0x9b9c: 0x5c46, 0x9b9d: 0x5c4e, 0x9b9e: 0x5c53, 0x9b9f: 0x5c50, 0x9ba0: 0x5c4f, 0x9ba1: 0x5b71, 0x9ba2: 0x5c6c, 0x9ba3: 0x5c6e,
			0x9ba4: 0x4e62, 0x9ba5: 0x5c76, 0x9ba6: 0x5c79, 0x9ba7: 0x5c8c, 0x9ba8: 0x5c91, 0x9ba9: 0x5c94, 0x9baa: 0x599b, 0x9bab: 0x5cab,
			0x9bac: 0x5cbb, 0x9bad: 0x5cb6, 0x9bae: 0x5cbc, 0x9baf: 0x5cb7, 0x9bb0: 0x5cc5, 0x9bb1: 0x5cbe, 0x9bb2: 0x5cc7, 0x9bb3: 0x5cd9,
			0x9bb4: 0x5ce9, 0x9bb5: 0x5cfd, 0x9bb6: 0x5cfa, 0x9bb7: 0x5ced, 0x9bb8: 0x5d8c, 0x9bb9: 0x5cea, 0x9bba: 0x5d0b, 0x9bbb: 0x5d15,
			0x9bbc: 0x5d17, 0x9bbd: 0x5d5c, 0x9bbe: 0x5d1f, 0x9bbf: 0x5d1b, 0x9bc0: 0x5d11, 0x9bc1: 0x5d14, 0x9bc2: 0x5d22, 0x9bc3: 0x5d1a,
			0x9bc4: 0x5d19, 0x9bc5: 0x5d18, 0x9bc6: 0x5d4c, 0x9bc7: 0x5d52, 0x9bc8: 0x5d4e, 0x9bc9: 0x5d4b, 0x9bca: 0x5d6c, 0x9bcb: 0x5d73,
			0x9bcc: 0x5d76, 0x9bcd: 0x5d87, 0x9bce: 0x5d84, 0x9bcf: 0x5d82, 0x9bd0: 0x5da2, 0x9bd1: 0x5d9d, 0x9bd2: 0x5dac, 0x9bd3: 0x5dae,
			0x9bd4: 0x5dbd, 0x9bd5: 0x5d90, 0x9bd6: 0x5db7, 0x9bd7: 0x5dbc, 0x9bd8: 0x5dc9, 0x9bd9: 0x5dcd, 0x9bda: 0x5dd3, 0x9bdb: 0x5dd2,
			0x9bdc: 0x5dd6, 0x9bdd: 0x5ddb, 0x9bde: 0x5deb, 0x9bdf: 0x5df2, 0x9be0: 0x5df5, 0x9be1: 0x5e0b, 0x9be2: 0x5e1a, 0x9be3: 0x5e19,
			0x9be4: 0x5e11, 0x9be5: 0x5e1b, 0x9be6: 0x5e36, 0x9be7: 0x5e37, 0x9be8: 0x5e44, 0x9be9: 0x5e43, 0x9bea: 0x5e40, 0x9beb: 0x5e4e,
			0x9bec: 0x5e57, 0x9bed: 0x5e54, 0x9bee: 0x5e5f, 0x9bef: 0x5e62, 0x9bf0: 0x5e64, 0x9bf1: 0x5e47, 0x9bf2: 0x5e75, 0x9bf3: 0x5e76,
			0x9bf4: 0x5e7a, 0x9bf5: 0x9ebc, 0x9bf6: 0x5e7f, 0x9bf7: 0x5ea0, 0x9bf8: 0x5ec1, 0x9bf9: 0x5ec2, 0x9bfa: 0x5ec8, 0x9bfb: 0x5ed0,
			0x9bfc: 0x5ecf, 0x9c40: 0x5ed6, 0x9c41: 0x5ee3, 0x9c42: 0x5edd, 0x9c43: 0x5eda, 0x9c44: 0x5edb, 0x9c45: 0x5ee2, 0x9c46: 0x5ee1,
			0x9c47: 0x5ee8, 0x9c48: 0x5ee9, 0x9c49: 0x5eec, 0x9c4a: 0x5ef1, 0x9c4b: 0x5ef3, 0x9c4c: 0x5ef0, 0x9c4d: 0x5ef4, 0x9c4e: 0x5ef8,
			0x9c4f: 0x5efe, 0x9c50: 0x5f03, 0x9c51: 0x5f09, 0x9c52: 0x5f5d, 0x9c53: 0x5f5c, 0x9c54: 0x5f0b, 0x9c55: 0x5f11, 0x9c56: 0x5f16,
			0x9c57: 0x5f29, 0x9c58: 0x5f2d, 0x9c59: 0x5f38, 0x9c5a: 0x5f41, 0x9c5b: 0x5f48, 0x9c5c: 0x5f4c, 0x9c5d: 0x5f4e, 0x9c5e: 0x5f2f,
			0x9c5f: 0x5f51, 0x9c60: 0x5f56, 0x9c61: 0x5f57, 0x9c62: 0x5f59, 0x9c63: 0x5f61, 0x9c64: 0x5f6d, 0x9c65: 0x5f73, 0x9c66: 0x5f77,
			0x9c67: 0x5f83, 0x9c68: 0x5f82, 0x9c69: 0x5f7f, 0x9c6a: 0x5f8a, 0x9c6b: 0x5f88, 0x9c6c: 0x5f91, 0x9c6d: 0x5f87, 0x9c6e: 0x5f9e,
			0x9c6f: 0x5f99, 0x9c70: 0x5f98, 0x9c71: 0x5fa0, 0x9c72: 0x5fa8, 0x9c73: 0x5fad, 0x9c74: 0x5fbc, 0x9c75: 0x5fd6, 0x9c76: 0x5ffb,
			0x9c77: 0x5fe4, 0x9c78: 0x5ff8, 0x9c79: 0x5ff1, 0x9c7a: 0x5fdd, 0x9c7b: 0x60b3, 0x9c7c: 0x5fff, 0x9c7d: 0x6021, 0x9c7e: 0x6060,
			0x9c80: 0x6019, 0x9c81: 0x6010, 0x9c82: 0x6029, 0x9c83: 0x600e, 0x9c84: 0x6031, 0x9c85: 0x601b, 0x9c86: 0x6015, 0x9c87: 0x602b,
			0x9c88: 0x6026, 0x9c89: 0x600f, 0x9c8a: 0x603a, 0x9c8b: 0x605a, 0x9c8c: 0x6041, 0x9c8d: 0x606a, 0x9c8e: 0x6077, 0x9c8f: 0x605f,
			0x9c90: 0x604a, 0x9c91: 0x6046, 0x9c92: 0x604d, 0x9c93: 0x6063, 0x9c94: 0x6043, 0x9c95: 0x6064, 0x9c96: 0x6042, 0x9c97: 0x606c,
			0x9c98: 0x606b, 0x9c99: 0x6059, 0x9c9a: 0x6081, 0x9c9b: 0x608d, 0x9c9c: 0x60e7, 0x9c9d: 0x6083, 0x9c9e: 0x609a, 0x9c9f: 0x6084,
			0x9ca0: 0x609b, 0x9ca1: 0x6096, 0x9ca2: 0x6097, 0x9ca3: 0x6092, 0x9ca4: 0x60a7, 0x9ca5: 0x608b, 0x9ca6: 0x60e1, 0x9ca7: 0x60b8,
			0x9ca8: 0x60e0, 0x9ca9: 0x60d3, 0x9caa: 0x60b4, 0x9cab: 0x5ff0, 0x9cac: 0x60bd, 0x9cad: 0x60c6, 0x9cae: 0x60b5, 0x9caf: 0x60d8,
			0x9cb0: 0x614d, 0x9cb1: 0x6115, 0x9cb2: 0x6106, 0x9cb3: 0x60f6, 0x9cb4: 0x60f7, 0x9cb5: 0x6100, 0x9cb6: 0x60f4, 0x9cb7: 0x60fa,
			0x9cb8: 0x6103, 0x9cb9: 0x6121, 0x9cba: 0x60fb, 0x9cbb: 0x60f1, 0x9cbc: 0x610d, 0x9cbd: 0x610e, 0x9cbe: 0x6147, 0x9cbf: 0x613e,
			0x9cc0: 0x6128, 0x9cc1: 0x6127, 0x9cc2: 0x614a, 0x9cc3: 0x613f, 0x9cc4: 0x613c, 0x9cc5: 0x612c, 0x9cc6: 0x6134, 0x9cc7: 0x613d,
			0x9cc8: 0x6142, 0x9cc9: 0x6144, 0x9cca: 0x6173, 0x9ccb: 0x6177, 0x9ccc: 0x6158, 0x9ccd: 0x6159, 0x9cce: 0x615a, 0x9ccf: 0x616b,
			0x9cd0: 0x6174, 0x9cd1: 0x616f, 0x9cd2: 0x6165, 0x9cd3: 0x6171, 0x9cd4: 0x615f, 0x9cd5: 0x615d, 0x9cd6: 0x6153, 0x9cd7: 0x6175,
			0x9cd8: 0x6199, 0x9cd9: 0x6196, 0x9cda: 0x6187, 0x9cdb: 0x61ac, 0x9cdc: 0x6194, 0x9cdd: 0x619a, 0x9cde: 0x618a, 0x9cdf: 0x6191,
			0x9ce0: 0x61ab, 0x9ce1: 0x61ae, 0x9ce2: 0x61cc, 0x9ce3: 0x61ca, 0x9ce4: 0x61c9, 0x9ce5: 0x61f7, 0x9ce6: 0x61c8, 0x9ce7: 0x61c3,
			0x9ce8: 0x61c6, 0x9ce9: 0x61ba, 0x9cea: 0x61cb, 0x9ceb: 0x7f79, 0x9cec: 0x61cd, 0x9ced: 0x61e6, 0x9cee: 0x61e3, 0x9cef: 0x61f6,
			0x9cf0: 0x61fa, 0x9cf1: 0x61f4, 0x9cf2: 0x61ff, 0x9cf3: 0x61fd, 0x9cf4: 0x61fc, 0x9cf5: 0x61fe, 0x9cf6: 0x6200, 0x9cf7: 0x6208,
			0x9cf8: 0x6209, 0x9cf9: 0x620d, 0x9cfa: 0x620c, 0x9cfb: 0x6214, 0x9cfc: 0x621b, 0x9d40: 0x621e, 0x9d41: 0x6221, 0x9d42: 0x622a,
			0x9d43: 0x622e, 0x9d44: 0x6230, 0x9d45: 0x6232, 0x9d46: 0x6233, 0x9d47: 0x6241, 0x9d48: 0x624e, 0x9d49: 0x625e, 0x9d4a: 0x6263,
			0x9d4b: 0x625b, 0x9d4c: 0x6260, 0x9d4d: 0x6268, 0x9d4e: 0x627c, 0x9d4f: 0x6282, 0x9d50: 0x6289, 0x9d51: 0x627e, 0x9d52: 0x6292,
			0x9d53: 0x6293, 0x9d54: 0x6296, 0x9d55: 0x62d4, 0x9d56: 0x6283, 0x9d57: 0x6294, 0x9d58: 0x62d7, 0x9d59: 0x62d1, 0x9d5a: 0x62bb,
			0x9d5b: 0x62cf, 0x9d5c: 0x62ff, 0x9d5d: 0x62c6, 0x9d5e: 0x64d4, 0x9d5f: 0x62c8, 0x9d60: 0x62dc, 0x9d61: 0x62cc, 0x9d62: 0x62ca,
			0x9d63: 0x62c2, 0x9d64: 0x62c7, 0x9d65: 0x629b, 0x9d66: 0x62c9, 0x9d67: 0x630c, 0x9d68: 0x62ee, 0x9d69: 0x62f1, 0x9d6a: 0x6327,
			0x9d6b: 0x6302, 0x9d6c: 0x6308, 0x9d6d: 0x62ef, 0x9d6e: 0x62f5, 0x9d6f: 0x6350, 0x9d70: 0x633e, 0x9d71: 0x634d, 0x9d72: 0x641c,
			0x9d73: 0x634f, 0x9d74: 0x6396, 0x9d75: 0x638e, 0x9d76: 0x6380, 0x9d77: 0x63ab, 0x9d78: 0x6376, 0x9d79: 0x63a3, 0x9d7a: 0x638f,
			0x9d7b: 0x6389, 0x9d7c: 0x639f, 0x9d7d: 0x63b5, 0x9d7e: 0x636b, 0x9d80: 0x6369, 0x9d81: 0x63be, 0x9d82: 0x63e9, 0x9d83: 0x63c0,
			0x9d84: 0x63c6, 0x9d85: 0x63e3, 0x9d86: 0x63c9, 0x9d87: 0x63d2, 0x9d88: 0x63f6, 0x9d89: 0x63c4, 0x9d8a: 0x6416, 0x9d8b: 0x6434,
			0x9d8c: 0x6406, 0x9d8d: 0x6413, 0x9d8e: 0x6426, 0x9d8f: 0x6436, 0x9d90: 0x651d, 0x9d91: 0x6417, 0x9d92: 0x6428, 0x9d93: 0x640f,
			0x9d94: 0x6467, 0x9d95: 0x646f, 0x9d96: 0x6476, 0x9d97: 0x644e, 0x9d98: 0x652a, 0x9d99: 0x6495, 0x9d9a: 0x6493, 0x9d9b: 0x64a5,
			0x9d9c: 0x64a9, 0x9d9d: 0x6488, 0x9d9e: 0x64bc, 0x9d9f: 0x64da, 0x9da0: 0x64d2, 0x9da1: 0x64c5, 0x9da2: 0x64c7, 0x9da3: 0x64bb,
			0x9da4: 0x64d8, 0x9da5: 0x64c2, 0x9da6: 0x64f1, 0x9da7: 0x64e7, 0x9da8: 0x8209, 0x9da9: 0x64e0, 0x9daa: 0x64e1, 0x9dab: 0x62ac,
			0x9dac: 0x64e3, 0x9dad: 0x64ef, 0x9dae: 0x652c, 0x9daf: 0x64f6, 0x9db0: 0x64f4, 0x9db1: 0x64f2, 0x9db2: 0x64fa, 0x9db3: 0x6500,
			0x9db4: 0x64fd, 0x9db5: 0x6518, 0x9db6: 0x651c, 0x9db7: 0x6505, 0x9db8: 0x6524, 0x9db9: 0x6523, 0x9dba: 0x652b, 0x9dbb: 0x6534,
			0x9dbc: 0x6535, 0x9dbd: 0x6537, 0x9dbe: 0x6536, 0x9dbf: 0x6538, 0x9dc0: 0x754b, 0x9dc1: 0x6548, 0x9dc2: 0x6556, 0x9dc3: 0x6555,
			0x9dc4: 0x654d, 0x9dc5: 0x6558, 0x9dc6: 0x655e, 0x9dc7: 0x655d, 0x9dc8: 0x6572, 0x9dc9: 0x6578, 0x9dca: 0x6582, 0x9dcb: 0x6583,
			0x9dcc: 0x8b8a, 0x9dcd: 0x659b, 0x9dce: 0x659f, 0x9dcf: 0x65ab, 0x9dd0: 0x65b7, 0x9dd1: 0x65c3, 0x9dd2: 0x65c6, 0x9dd3: 0x65c1,
			0x9dd4: 0x65c4, 0x9dd5: 0x65cc, 0x9dd6: 0x65d2, 0x9dd7: 0x65db, 0x9dd8: 0x65d9, 0x9dd9: 0x65e0, 0x9dda: 0x65e1, 0x9ddb: 0x65f1,
			0x9ddc: 0x6772, 0x9ddd: 0x660a, 0x9dde: 0x6603, 0x9ddf: 0x65fb, 0x9de0: 0x6773, 0x9de1: 0x6635, 0x9de2: 0x6636, 0x9de3: 0x6634,
			0x9de4: 0x661c, 0x9de5: 0x664f, 0x9de6: 0x6644, 0x9de7: 0x6649, 0x9de8: 0x6641, 0x9de9: 0x665e, 0x9dea: 0x665d, 0x9deb: 0x6664,
			0x9dec: 0x6667, 0x9ded: 0x6668, 0x9dee: 0x665f, 0x9def: 0x6662, 0x9df0: 0x6670, 0x9df1: 0x6683, 0x9df2: 0x6688, 0x9df3: 0x668e,
			0x9df4: 0x6689, 0x9df5: 0x6684, 0x9df6: 0x6698, 0x9df7: 0x669d, 0x9df8: 0x66c1, 0x9df9: 0x66b9, 0x9dfa: 0x66c9, 0x9dfb: 0x66be,
			0x9dfc: 0x66bc, 0x9e40: 0x66c4, 0x9e41: 0x66b8, 0x9e42: 0x66d6, 0x9e43: 0x66da, 0x9e44: 0x66e0, 0x9e45: 0x663f, 0x9e46: 0x66e6,
			0x9e47: 0x66e9, 0x9e48: 0x66f0, 0x9e49: 0x66f5, 0x9e4a: 0x66f7, 0x9e4b: 0x670f, 0x9e4c: 0x6716, 0x9e4d: 0x671e, 0x9e4e: 0x6726,
			0x9e4f: 0x6727, 0x9e50: 0x9738, 0x9e51: 0x672e, 0x9e52: 0x673f, 0x9e53: 0x6736, 0x9e54: 0x6741, 0x9e55: 0x6738, 0x9e56: 0x6737,
			0x9e57: 0x6746, 0x9e58: 0x675e, 0x9e59: 0x6760, 0x9e5a: 0x6759, 0x9e5b: 0x6763, 0x9e5c: 0x6764, 0x9e5d: 0x6789, 0x9e5e: 0x6770,
			0x9e5f: 0x67a9, 0x9e60: 0x677c, 0x9e61: 0x676a, 0x9e62: 0x678c, 0x9e63: 0x678b, 0x9e64: 0x67a6, 0x9e65: 0x67a1, 0x9e66: 0x6785,
			0x9e67: 0x67b7, 0x9e68: 0x67ef, 0x9e69: 0x67b4, 0x9e6a: 0x67ec, 0x9e6b: 0x67b3, 0x9e6c: 0x67e9, 0x9e6d: 0x67b8, 0x9e6e: 0x67e4,
			0x9e6f: 0x67de, 0x9e70: 0x67dd, 0x9e71: 0x67e2, 0x9e72: 0x67ee, 0x9e73: 0x67b9, 0x9e74: 0x67ce, 0x9e75: 0x67c6, 0x9e76: 0x67e7,
			0x9e77: 0x6a9c, 0x9e78: 0x681e, 0x9e79: 0x6846, 0x9e7a: 0x6829, 0x9e7b: 0x6840, 0x9e7c: 0x684d, 0x9e7d: 0x6832, 0x9e7e: 0x684e,
			0x9e80: 0x68b3, 0x9e81: 0x682b, 0x9e82: 0x6859, 0x9e83: 0x6863, 0x9e84: 0x6877, 0x9e85: 0x687f, 0x9e86: 0x689f, 0x9e87: 0x688f,
			0x9e88: 0x68ad, 0x9e89: 0x6894, 0x9e8a: 0x689d, 0x9e8b: 0x689b, 0x9e8c: 0x6883, 0x9e8d: 0x6aae, 0x9e8e: 0x68b9, 0x9e8f: 0x6874,
			0x9e90: 0x68b5, 0x9e91: 0x68a0, 0x9e92: 0x68ba, 0x9e93: 0x690f, 0x9e94: 0x688d, 0x9e95: 0x687e, 0x9e96: 0x6901, 0x9e97: 0x68ca,
			0x9e98: 0x6908, 0x9e99: 0x68d8, 0x9e9a: 0x6922, 0x9e9b: 0x6926, 0x9e9c: 0x68e1, 0x9e9d: 0x690c, 0x9e9e: 0x68cd, 0x9e9f: 0x68d4,
			0x9ea0: 0x68e7, 0x9ea1: 0x68d5, 0x9ea2: 0x6936, 0x9ea3: 0x6912, 0x9ea4: 0x6904, 0x9ea5: 0x68d7, 0x9ea6: 0x68e3, 0x9ea7: 0x6925,
			0x9ea8: 0x68f9, 0x9ea9: 0x68e0, 0x9eaa: 0x68ef, 0x9eab: 0x6928, 0x9eac: 0x692a, 0x9ead: 0x691a, 0x9eae: 0x6923, 0x9eaf: 0x6921,
			0x9eb0: 0x68c6, 0x9eb1: 0x6979, 0x9eb2: 0x6977, 0x9eb3: 0x695c, 0x9eb4: 0x6978, 0x9eb5: 0x696b, 0x9eb6: 0x6954, 0x9eb7: 0x697e,
			0x9eb8: 0x696e, 0x9eb9: 0x6939, 0x9eba: 0x6974, 0x9ebb: 0x693d, 0x9ebc: 0x6959, 0x9ebd: 0x6930, 0x9ebe: 0x6961, 0x9ebf: 0x695e,
			0x9ec0: 0x695d, 0x9ec1: 0x6981, 0x9ec2: 0x696a, 0x9ec3: 0x69b2, 0x9ec4: 0x69ae, 0x9ec5: 0x69d0, 0x9ec6: 0x69bf, 0x9ec7: 0x69c1,
			0x9ec8: 0x69d3, 0x9ec9: 0x69be, 0x9eca: 0x69ce, 0x9ecb: 0x5be8, 0x9ecc: 0x69ca, 0x9ecd: 0x69dd, 0x9ece: 0x69bb, 0x9ecf: 0x69c3,
			0x9ed0: 0x69a7, 0x9ed1: 0x6a2e, 0x9ed2: 0x6991, 0x9ed3: 0x69a0, 0x9ed4: 0x699c, 0x9ed5: 0x6995, 0x9ed6: 0x69b4, 0x9ed7: 0x69de,
			0x9ed8: 0x69e8, 0x9ed9: 0x6a02, 0x9eda: 0x6a1b, 0x9edb: 0x69ff, 0x9edc: 0x6b0a, 0x9edd: 0x69f9, 0x9ede: 0x69f2, 0x9edf: 0x69e7,
			0x9ee0: 0x6a05, 0x9ee1: 0x69b1, 0x9ee2: 0x6a1e, 0x9ee3: 0x69ed, 0x9ee4: 0x6a14, 0x9ee5: 0x69eb, 0x9ee6: 0x6a0a, 0x9ee7: 0x6a12,
			0x9ee8: 0x6ac1, 0x9ee9: 0x6a23, 0x9eea: 0x6a13, 0x9eeb: 0x6a44, 0x9eec: 0x6a0c, 0x9eed: 0x6a72, 0x9eee: 0x6a36, 0x9eef: 0x6a78,
			0x9ef0: 0x6a47, 0x9ef1: 0x6a62, 0x9ef2: 0x6a59, 0x9ef3: 0x6a66, 0x9ef4: 0x6a48, 0x9ef5: 0x6a38, 0x9ef6: 0x6a22, 0x9ef7: 0x6a90,
			0x9ef8: 0x6a8d, 0x9ef9: 0x6aa0, 0x9efa: 0x6a84, 0x9efb: 0x6aa2, 0x9efc: 0x6aa3, 0x9f40: 0x6a97, 0x9f41: 0x8617, 0x9f42: 0x6abb,
			0x9f43: 0x6ac3, 0x9f44: 0x6ac2, 0x9f45: 0x6ab8, 0x9f46: 0x6ab3, 0x9f47: 0x6aac, 0x9f48: 0x6ade, 0x9f49: 0x6ad1, 0x9f4a: 0x6adf,
			0x9f4b: 0x6aaa, 0x9f4c: 0x6ada, 0x9f4d: 0x6aea, 0x9f4e: 0x6afb, 0x9f4f: 0x6b05, 0x9f50: 0x8616, 0x9f51: 0x6afa, 0x9f52: 0x6b12,
			0x9f53: 0x6b16, 0x9f54: 0x9b31, 0x9f55: 0x6b1f, 0x9f56: 0x6b38, 0x9f57: 0x6b37, 0x9f58: 0x76dc, 0x9f59: 0x6b39, 0x9f5a: 0x98ee,
			0x9f5b: 0x6b47, 0x9f5c: 0x6b43, 0x9f5d: 0x6b49, 0x9f5e: 0x6b50, 0x9f5f: 0x6b59, 0x9f60: 0x6b54, 0x9f61: 0x6b5b, 0x9f62: 0x6b5f,
			0x9f63: 0x6b61, 0x9f64: 0x6b78, 0x9f65: 0x6b79, 0x9f66: 0x6b7f, 0x9f67: 0x6b80, 0x9f68: 0x6b84, 0x9f69: 0x6b83, 0x9f6a: 0x6b8d,
			0x9f6b: 0x6b98, 0x9f6c: 0x6b95, 0x9f6d: 0x6b9e, 0x9f6e: 0x6ba4, 0x9f6f: 0x6baa, 0x9f70: 0x6bab, 0x9f71: 0x6baf, 0x9f72: 0x6bb2,
			0x9f73: 0x6bb1, 0x9f74: 0x6bb3, 0x9f75: 0x6bb7, 0x9f76: 0x6bbc, 0x9f77: 0x6bc6, 0x9f78: 0x6bcb, 0x9f79: 0x6bd3, 0x9f7a: 0x6bdf,
			0x9f7b: 0x6bec, 0x9f7c: 0x6beb, 0x9f7d: 0x6bf3, 0x9f7e: 0x6bef, 0x9f80: 0x9ebe, 0x9f81: 0x6c08, 0x9f82: 0x6c13, 0x9f83: 0x6c14,
			0x9f84: 0x6c1b, 0x9f85: 0x6c24, 0x9f86: 0x6c23, 0x9f87: 0x6c5e, 0x9f88: 0x6c55, 0x9f89: 0x6c62, 0x9f8a: 0x6c6a, 0x9f8b: 0x6c82,
			0x9f8c: 0x6c8d, 0x9f8d: 0x6c9a, 0x9f8e: 0x6c81, 0x9f8f: 0x6c9b, 0x9f90: 0x6c7e, 0x9f91: 0x6c68, 0x9f92: 0x6c73, 0x9f93: 0x6c92,
			0x9f94: 0x6c90, 0x9f95: 0x6cc4, 0x9f96: 0x6cf1, 0x9f97: 0x6cd3, 0x9f98: 0x6cbd, 0x9f99: 0x6cd7, 0x9f9a: 0x6cc5, 0x9f9b: 0x6cdd,
			0x9f9c: 0x6cae, 0x9f9d: 0x6cb1, 0x9f9e: 0x6cbe, 0x9f9f: 0x6cba, 0x9fa0: 0x6cdb, 0x9fa1: 0x6cef, 0x9fa2: 0x6cd9, 0x9fa3: 0x6cea,
			0x9fa4: 0x6d1f, 0x9fa5: 0x884d, 0x9fa6: 0x6d36, 0x9fa7: 0x6d2b, 0x9fa8: 0x6d3d, 0x9fa9: 0x6d38, 0x9faa: 0x6d19, 0x9fab: 0x6d35,
			0x9fac: 0x6d33, 0x9fad: 0x6d12, 0x9fae: 0x6d0c, 0x9faf: 0x6d63, 0x9fb0: 0x6d93, 0x9fb1: 0x6d64, 0x9fb2: 0x6d5a, 0x9fb3: 0x6d79,
			0x9fb4: 0x6d59, 0x9fb5: 0x6d8e, 0x9fb6: 0x6d95, 0x9fb7: 0x6fe4, 0x9fb8: 0x6d85, 0x9fb9: 0x6df9, 0x9fba: 0x6e15, 0x9fbb: 0x6e0a,
			0x9fbc: 0x6db5, 0x9fbd: 0x6dc7, 0x9fbe: 0x6de6, 0x9fbf: 0x6db8, 0x9fc0: 0x6dc6, 0x9fc1: 0x6dec, 0x9fc2: 0x6dde, 0x9fc3: 0x6dcc,
			0x9fc4: 0x6de8, 0x9fc5: 0x6dd2, 0x9fc6: 0x6dc5, 0x9fc7: 0x6dfa, 0x9fc8: 0x6dd9, 0x9fc9: 0x6de4, 0x9fca: 0x6dd5, 0x9fcb: 0x6dea,
			0x9fcc: 0x6dee, 0x9fcd: 0x6e2d, 0x9fce: 0x6e6e, 0x9fcf: 0x6e2e, 0x9fd0: 0x6e19, 0x9fd1: 0x6e72, 0x9fd2: 0x6e5f, 0x9fd3: 0x6e3e,
			0x9fd4: 0x6e23, 0x9fd5: 0x6e6b, 0x9fd6: 0x6e2b, 0x9fd7: 0x6e76, 0x9fd8: 0x6e4d, 0x9fd9: 0x6e1f, 0x9fda: 0x6e43, 0x9fdb: 0x6e3a,
			0x9fdc: 0x6e4e, 0x9fdd: 0x6e24, 0x9fde: 0x6eff, 0x9fdf: 0x6e1d, 0x9fe0: 0x6e38, 0x9fe1: 0x6e82, 0x9fe2: 0x6eaa, 0x9fe3: 0x6e98,
			0x9fe4: 0x6ec9, 0x9fe5: 0x6eb7, 0x9fe6: 0x6ed3, 0x9fe7: 0x6ebd, 0x9fe8: 0x6eaf, 0x9fe9: 0x6ec4, 0x9fea: 0x6eb2, 0x9feb: 0x6ed4,
			0x9fec: 0x6ed5, 0x9fed: 0x6e8f, 0x9fee: 0x6ea5, 0x9fef: 0x6ec2, 0x9ff0: 0x6e9f, 0x9ff1: 0x6f41, 0x9ff2: 0x6f11, 0x9ff3: 0x704c,
			0x9ff4: 0x6eec, 0x9ff5: 0x6ef8, 0x9ff6: 0x6efe, 0x9ff7: 0x6f3f, 0x9ff8: 0x6ef2, 0x9ff9: 0x6f31, 0x9ffa: 0x6eef, 0x9ffb: 0x6f32,
			0x9ffc: 0x6ecc, 0xe040: 0x6f3e, 0xe041: 0x6f13, 0xe042: 0x6ef7, 0xe043: 0x6f86, 0xe044: 0x6f7a, 0xe045: 0x6f78, 0xe046: 0x6f81,
			0xe047: 0x6f80, 0xe048: 0x6f6f, 0xe049: 0x6f5b, 0xe04a: 0x6ff3, 0xe04b: 0x6f6d, 0xe04c: 0x6f82, 0xe04d: 0x6f7c, 0xe04e: 0x6f58,
			0xe04f: 0x6f8e, 0xe050: 0x6f91, 0xe051: 0x6fc2, 0xe052: 0x6f66, 0xe053: 0x6fb3, 0xe054: 0x6fa3, 0xe055: 0x6fa1, 0xe056: 0x6fa4,
			0xe057: 0x6fb9, 0xe058: 0x6fc6, 0xe059: 0x6faa, 0xe05a: 0x6fdf, 0xe05b: 0x6fd5, 0xe05c: 0x6fec, 0xe05d: 0x6fd4, 0xe05e: 0x6fd8,
			0xe05f: 0x6ff1, 0xe060: 0x6fee, 0xe061: 0x6fdb, 0xe062: 0x7009, 0xe063: 0x700b, 0xe064: 0x6ffa, 0xe065: 0x7011, 0xe066: 0x7001,
			0xe067: 0x700f, 0xe068: 0x6ffe, 0xe069: 0x701b, 0xe06a: 0x701a, 0xe06b: 0x6f74, 0xe06c: 0x701d, 0xe06d: 0x7018, 0xe06e: 0x701f,
			0xe06f: 0x7030, 0xe070: 0x703e, 0xe071: 0x7032, 0xe072: 0x7051, 0xe073: 0x7063, 0xe074: 0x7099, 0xe075: 0x7092, 0xe076: 0x70af,
			0xe077: 0x70f1, 0xe078: 0x70ac, 0xe079: 0x70b8, 0xe07a: 0x70b3, 0xe07b: 0x70ae, 0xe07c: 0x70df, 0xe07d: 0x70cb, 0xe07e: 0x70dd,
			0xe080: 0x70d9, 0xe081: 0x7109, 0xe082: 0x70fd, 0xe083: 0x711c, 0xe084: 0x7119, 0xe085: 0x7165, 0xe086: 0x7155, 0xe087: 0x7188,
			0xe088: 0x7166, 0xe089: 0x7162, 0xe08a: 0x714c, 0xe08b: 0x7156, 0xe08c: 0x716c, 0xe08d: 0x718f, 0xe08e: 0x71fb, 0xe08f: 0x7184,
			0xe090: 0x7195, 0xe091: 0x71a8, 0xe092: 0x71ac, 0xe093: 0x71d7, 0xe094: 0x71b9, 0xe095: 0x71be, 0xe096: 0x71d2, 0xe097: 0x71c9,
			0xe098: 0x71d4, 0xe099: 0x71ce, 0xe09a: 0x71e0, 0xe09b: 0x71ec, 0xe09c: 0x71e7, 0xe09d: 0x71f5, 0xe09e: 0x71fc, 0xe09f: 0x71f9,
			0xe0a0: 0x71ff, 0xe0a1: 0x720d, 0xe0a2: 0x7210, 0xe0a3: 0x721b, 0xe0a4: 0x7228, 0xe0a5: 0x722d, 0xe0a6: 0x722c, 0xe0a7: 0x7230,
			0xe0a8: 0x7232, 0xe0a9: 0x723b, 0xe0aa: 0x723c, 0xe0ab: 0x723f, 0xe0ac: 0x7240, 0xe0ad: 0x7246, 0xe0ae: 0x724b, 0xe0af: 0x7258,
			0xe0b0: 0x7274, 0xe0b1: 0x727e, 0xe0b2: 0x7282, 0xe0b3: 0x7281, 0xe0b4: 0x7287, 0xe0b5: 0x7292, 0xe0b6: 0x7296, 0xe0b7: 0x72a2,
			0xe0b8: 0x72a7, 0xe0b9: 0x72b9, 0xe0ba: 0x72b2, 0xe0bb: 0x72c3, 0xe0bc: 0x72c6, 0xe0bd: 0x72c4, 0xe0be: 0x72ce, 0xe0bf: 0x72d2,
			0xe0c0: 0x72e2, 0xe0c1: 0x72e0, 0xe0c2: 0x72e1, 0xe0c3: 0x72f9, 0xe0c4: 0x72f7, 0xe0c5: 0x500f, 0xe0c6: 0x7317, 0xe0c7: 0x730a,
			0xe0c8: 0x731c, 0xe0c9: 0x7316, 0xe0ca: 0x731d, 0xe0cb: 0x7334, 0xe0cc: 0x732f, 0xe0cd: 0x7329, 0xe0ce: 0x7325, 0xe0cf: 0x733e,
			0xe0d0: 0x734e, 0xe0d1: 0x734f, 0xe0d2: 0x9ed8, 0xe0d3: 0x7357, 0xe0d4: 0x736a, 0xe0d5: 0x7368, 0xe0d6: 0x7370, 0xe0d7: 0x7378,
			0xe0d8: 0x7375, 0xe0d9: 0x737b, 0xe0da: 0x737a, 0xe0db: 0x73c8, 0xe0dc: 0x73b3, 0xe0dd: 0x73ce, 0xe0de: 0x73bb, 0xe0df: 0x73c0,
			0xe0e0: 0x73e5, 0xe0e1: 0x73ee, 0xe0e2: 0x73de, 0xe0e3: 0x74a2, 0xe0e4: 0x7405, 0xe0e5: 0x746f, 0xe0e6: 0x7425, 0xe0e7: 0x73f8,
			0xe0e8: 0x7432, 0xe0e9: 0x743a, 0xe0ea: 0x7455, 0xe0eb: 0x743f, 0xe0ec: 0x745f, 0xe0ed: 0x7459, 0xe0ee: 0x7441, 0xe0ef: 0x745c,
			0xe0f0: 0x7469, 0xe0f1: 0x7470, 0xe0f2: 0x7463, 0xe0f3: 0x746a, 0xe0f4: 0x7476, 0xe0f5: 0x747e, 0xe0f6: 0x748b, 0xe0f7: 0x749e,
			0xe0f8: 0x74a7, 0xe0f9: 0x74ca, 0xe0fa: 0x74cf, 0xe0fb: 0x74d4, 0xe0fc: 0x73f1, 0xe140: 0x74e0, 0xe141: 0x74e3, 0xe142: 0x74e7,
			0xe143: 0x74e9, 0xe144: 0x74ee, 0xe145: 0x74f2, 0xe146: 0x74f0, 0xe147: 0x74f1, 0xe148: 0x74f8, 0xe149: 0x74f7, 0xe14a: 0x7504,
			0xe14b: 0x7503, 0xe14c: 0x7505, 0xe14d: 0x750c, 0xe14e: 0x750e, 0xe14f: 0x750d, 0xe150: 0x7515, 0xe151: 0x7513, 0xe152: 0x751e,
			0xe153: 0x7526, 0xe154: 0x752c, 0xe155: 0x753c, 0xe156: 0x7544, 0xe157: 0x754d, 0xe158: 0x754a, 0xe159: 0x7549, 0xe15a: 0x755b,
			0xe15b: 0x7546, 0xe15c: 0x755a, 0xe15d: 0x7569, 0xe15e: 0x7564, 0xe15f: 0x7567, 0xe160: 0x756b, 0xe161: 0x756d, 0xe162: 0x7578,
			0xe163: 0x7576, 0xe164: 0x7586, 0xe165: 0x7587, 0xe166: 0x7574, 0xe167: 0x758a, 0xe168: 0x7589, 0xe169: 0x7582, 0xe16a: 0x7594,
			0xe16b: 0x759a, 0xe16c: 0x759d, 0xe16d: 0x75a5, 0xe16e: 0x75a3, 0xe16f: 0x75c2, 0xe170: 0x75b3, 0xe171: 0x75c3, 0xe172: 0x75b5,
			0xe173: 0x75bd, 0xe174: 0x75b8, 0xe175: 0x75bc, 0xe176: 0x75b1, 0xe177: 0x75cd, 0xe178: 0x75ca, 0xe179: 0x75d2, 0xe17a: 0x75d9,
			0xe17b: 0x75e3, 0xe17c: 0x75de, 0xe17d: 0x75fe, 0xe17e: 0x75ff, 0xe180: 0x75fc, 0xe181: 0x7601, 0xe182: 0x75f0, 0xe183: 0x75fa,
			0xe184: 0x75f2, 0xe185: 0x75f3, 0xe186: 0x760b, 0xe187: 0x760d, 0xe188: 0x7609, 0xe189: 0x761f, 0xe18a: 0x7627, 0xe18b: 0x7620,
			0xe18c: 0x7621, 0xe18d: 0x7622, 0xe18e: 0x7624, 0xe18f: 0x7634, 0xe190: 0x7630, 0xe191: 0x763b, 0xe192: 0x7647, 0xe193: 0x7648,
			0xe194: 0x7646, 0xe195: 0x765c, 0xe196: 0x7658, 0xe197: 0x7661, 0xe198: 0x7662, 0xe199: 0x7668, 0xe19a: 0x7669, 0xe19b: 0x766a,
			0xe19c: 0x7667, 0xe19d: 0x766c, 0xe19e: 0x7670, 0xe19f: 0x7672, 0xe1a0: 0x7676, 0xe1a1: 0x7678, 0xe1a2: 0x767c, 0xe1a3: 0x7680,
			0xe1a4: 0x7683, 0xe1a5: 0x7688, 0xe1a6: 0x768b, 0xe1a7: 0x768e, 0xe1a8: 0x7696, 0xe1a9: 0x7693, 0xe1aa: 0x7699, 0xe1ab: 0x769a,
			0xe1ac: 0x76b0, 0xe1ad: 0x76b4, 0xe1ae: 0x76b8, 0xe1af: 0x76b9, 0xe1b0: 0x76ba, 0xe1b1: 0x76c2, 0xe1b2: 0x76cd, 0xe1b3: 0x76d6,
			0xe1b4: 0x76d2, 0xe1b5: 0x76de, 0xe1b6: 0x76e1, 0xe1b7: 0x76e5, 0xe1b8: 0x76e7, 0xe1b9: 0x76ea, 0xe1ba: 0x862f, 0xe1bb: 0x76fb,
			0xe1bc: 0x7708, 0xe1bd: 0x7707, 0xe1be: 0x7704, 0xe1bf: 0x7729, 0xe1c0: 0x7724, 0xe1c1: 0x771e, 0xe1c2: 0x7725, 0xe1c3: 0x7726,
			0xe1c4: 0x771b, 0xe1c5: 0x7737, 0xe1c6: 0x7738, 0xe1c7: 0x7747, 0xe1c8: 0x775a, 0xe1c9: 0x7768, 0xe1ca: 0x776b, 0xe1cb: 0x775b,
			0xe1cc: 0x7765, 0xe1cd: 0x777f, 0xe1ce: 0x777e, 0xe1cf: 0x7779, 0xe1d0: 0x778e, 0xe1d1: 0x778b, 0xe1d2: 0x7791, 0xe1d3: 0x77a0,
			0xe1d4: 0x779e, 0xe1d5: 0x77b0, 0xe1d6: 0x77b6, 0xe1d7: 0x77b9, 0xe1d8: 0x77bf, 0xe1d9: 0x77bc, 0xe1da: 0x77bd, 0xe1db: 0x77bb,
			0xe1dc: 0x77c7, 0xe1dd: 0x77cd, 0xe1de: 0x77d7, 0xe1df: 0x77da, 0xe1e0: 0x77dc, 0xe1e1: 0x77e3, 0xe1e2: 0x77ee, 0xe1e3: 0x77fc,
			0xe1e4: 0x780c, 0xe1e5: 0x7812, 0xe1e6: 0x7926, 0xe1e7: 0x7820, 0xe1e8: 0x792a, 0xe1e9: 0x7845, 0xe1ea: 0x788e, 0xe1eb: 0x7874,
			0xe1ec: 0x7886, 0xe1ed: 0x787c, 0xe1ee: 0x789a, 0xe1ef: 0x788c, 0xe1f0: 0x78a3, 0xe1f1: 0x78b5, 0xe1f2: 0x78aa, 0xe1f3: 0x78af,
			0xe1f4: 0x78d1, 0xe1f5: 0x78c6, 0xe1f6: 0x78cb, 0xe1f7: 0x78d4, 0xe1f8: 0x78be, 0xe1f9: 0x78bc, 0xe1fa: 0x78c5, 0xe1fb: 0x78ca,
			0xe1fc: 0x78ec, 0xe240: 0x78e7, 0xe241: 0x78da, 0xe242: 0x78fd, 0xe243: 0x78f4, 0xe244: 0x7907, 0xe245: 0x7912, 0xe246: 0x7911,
			0xe247: 0x7919, 0xe248: 0x792c, 0xe249: 0x792b, 0xe24a: 0x7940, 0xe24b: 0x7960, 0xe24c: 0x7957, 0xe24d: 0x795f, 0xe24e: 0x795a,
			0xe24f: 0x7955, 0xe250: 0x7953, 0xe251: 0x797a, 0xe252: 0x797f, 0xe253: 0x798a, 0xe254: 0x799d, 0xe255: 0x79a7, 0xe256: 0x9f4b,
			0xe257: 0x79aa, 0xe258: 0x79ae, 0xe259: 0x79b3, 0xe25a: 0x79b9, 0xe25b: 0x79ba, 0xe25c: 0x79c9, 0xe25d: 0x79d5, 0xe25e: 0x79e7,
			0xe25f: 0x79ec, 0xe260: 0x79e1, 0xe261: 0x79e3, 0xe262: 0x7a08, 0xe263: 0x7a0d, 0xe264: 0x7a18, 0xe265: 0x7a19, 0xe266: 0x7a20,
			0xe267: 0x7a1f, 0xe268: 0x7980, 0xe269: 0x7a31, 0xe26a: 0x7a3b, 0xe26b: 0x7a3e, 0xe26c: 0x7a37, 0xe26d: 0x7a43, 0xe26e: 0x7a57,
			0xe26f: 0x7a49, 0xe270: 0x7a61, 0xe271: 0x7a62, 0xe272: 0x7a69, 0xe273: 0x9f9d, 0xe274: 0x7a70, 0xe275: 0x7a79, 0xe276: 0x7a7d,
			0xe277: 0x7a88, 0xe278: 0x7a97, 0xe279: 0x7a95, 0xe27a: 0x7a98, 0xe27b: 0x7a96, 0xe27c: 0x7aa9, 0xe27d: 0x7ac8, 0xe27e: 0x7ab0,
			0xe280: 0x7ab6, 0xe281: 0x7ac5, 0xe282: 0x7ac4, 0xe283: 0x7abf, 0xe284: 0x9083, 0xe285: 0x7ac7, 0xe286: 0x7aca, 0xe287: 0x7acd,
			0xe288: 0x7acf, 0xe289: 0x7ad5, 0xe28a: 0x7ad3, 0xe28b: 0x7ad9, 0xe28c: 0x7ada, 0xe28d: 0x7add, 0xe28e: 0x7ae1, 0xe28f: 0x7ae2,
			0xe290: 0x7ae6, 0xe291: 0x7aed, 0xe292: 0x7af0, 0xe293: 0x7b02, 0xe294: 0x7b0f, 0xe295: 0x7b0a, 0xe296: 0x7b06, 0xe297: 0x7b33,
			0xe298: 0x7b18, 0xe299: 0x7b19, 0xe29a: 0x7b1e, 0xe29b: 0x7b35, 0xe29c: 0x7b28, 0xe29d: 0x7b36, 0xe29e: 0x7b50, 0xe29f: 0x7b7a,
			0xe2a0: 0x7b04, 0xe2a1: 0x7b4d, 0xe2a2: 0x7b0b, 0xe2a3: 0x7b4c, 0xe2a4: 0x7b45, 0xe2a5: 0x7b75, 0xe2a6: 0x7b65, 0xe2a7: 0x7b74,
			0xe2a8: 0x7b67, 0xe2a9: 0x7b70, 0xe2aa: 0x7b71, 0xe2ab: 0x7b6c, 0xe2ac: 0x7b6e, 0xe2ad: 0x7b9d, 0xe2ae: 0x7b98, 0xe2af: 0x7b9f,
			0xe2b0: 0x7b8d, 0xe2b1: 0x7b9c, 0xe2b2: 0x7b9a, 0xe2b3: 0x7b8b, 0xe2b4: 0x7b92, 0xe2b5: 0x7b8f, 0xe2b6: 0x7b5d, 0xe2b7: 0x7b99,
			0xe2b8: 0x7bcb, 0xe2b9: 0x7bc1, 0xe2ba: 0x7bcc, 0xe2bb: 0x7bcf, 0xe2bc: 0x7bb4, 0xe2bd: 0x7bc6, 0xe2be: 0x7bdd, 0xe2bf: 0x7be9,
			0xe2c0: 0x7c11, 0xe2c1: 0x7c14, 0xe2c2: 0x7be6, 0xe2c3: 0x7be5, 0xe2c4: 0x7c60, 0xe2c5: 0x7c00, 0xe2c6: 0x7c07, 0xe2c7: 0x7c13,
			0xe2c8: 0x7bf3, 0xe2c9: 0x7bf7, 0xe2ca: 0x7c17, 0xe2cb: 0x7c0d, 0xe2cc: 0x7bf6, 0xe2cd: 0x7c23, 0xe2ce: 0x7c27, 0xe2cf: 0x7c2a,
			0xe2d0: 0x7c1f, 0xe2d1: 0x7c37, 0xe2d2: 0x7c2b, 0xe2d3: 0x7c3d, 0xe2d4: 0x7c4c, 0xe2d5: 0x7c43, 0xe2d6: 0x7c54, 0xe2d7: 0x7c4f,
			0xe2d8: 0x7c40, 0xe2d9: 0x7c50, 0xe2da: 0x7c58, 0xe2db: 0x7c5f, 0xe2dc: 0x7c64, 0xe2dd: 0x7c56, 0xe2de: 0x7c65, 0xe2df: 0x7c6c,
			0xe2e0: 0x7c75, 0xe2e1: 0x7c83, 0xe2e2: 0x7c90, 0xe2e3: 0x7ca4, 0xe2e4: 0x7cad, 0xe2e5: 0x7ca2, 0xe2e6: 0x7cab, 0xe2e7: 0x7ca1,
			0xe2e8: 0x7ca8, 0xe2e9: 0x7cb3, 0xe2ea: 0x7cb2, 0xe2eb: 0x7cb1, 0xe2ec: 0x7cae, 0xe2ed: 0x7cb9, 0xe2ee: 0x7cbd, 0xe2ef: 0x7cc0,
			0xe2f0: 0x7cc5, 0xe2f1: 0x7cc2, 0xe2f2: 0x7cd8, 0xe2f3: 0x7cd2, 0xe2f4: 0x7cdc, 0xe2f5: 0x7ce2, 0xe2f6: 0x9b3b, 0xe2f7: 0x7cef,
			0xe2f8: 0x7cf2, 0xe2f9: 0x7cf4, 0xe2fa: 0x7cf6, 0xe2fb: 0x7cfa, 0xe2fc: 0x7d06, 0xe340: 0x7d02, 0xe341: 0x7d1c, 0xe342: 0x7d15,
			0xe343: 0x7d0a, 0xe344: 0x7d45, 0xe345: 0x7d4b, 0xe346: 0x7d2e, 0xe347: 0x7d32, 0xe348: 0x7d3f, 0xe349: 0x7d35, 0xe34a: 0x7d46,
			0xe34b: 0x7d73, 0xe34c: 0x7d56, 0xe34d: 0x7d4e, 0xe34e: 0x7d72, 0xe34f: 0x7d68, 0xe350: 0x7d6e, 0xe351: 0x7d4f, 0xe352: 0x7d63,
			0xe353: 0x7d93, 0xe354: 0x7d89, 0xe355: 0x7d5b, 0xe356: 0x7d8f, 0xe357: 0x7d7d, 0xe358: 0x7d9b, 0xe359: 0x7dba, 0xe35a: 0x7dae,
			0xe35b: 0x7da3, 0xe35c: 0x7db5, 0xe35d: 0x7dc7, 0xe35e: 0x7dbd, 0xe35f: 0x7dab, 0xe360: 0x7e3d, 0xe361: 0x7da2, 0xe362: 0x7daf,
			0xe363: 0x7ddc, 0xe364: 0x7db8, 0xe365: 0x7d9f, 0xe366: 0x7db0, 0xe367: 0x7dd8, 0xe368: 0x7ddd, 0xe369: 0x7de4, 0xe36a: 0x7dde,
			0xe36b: 0x7dfb, 0xe36c: 0x7df2, 0xe36d: 0x7de1, 0xe36e: 0x7e05, 0xe36f: 0x7e0a, 0xe370: 0x7e23, 0xe371: 0x7e21, 0xe372: 0x7e12,
			0xe373: 0x7e31, 0xe374: 0x7e1f, 0xe375: 0x7e09, 0xe376: 0x7e0b, 0xe377: 0x7e22, 0xe378: 0x7e46, 0xe379: 0x7e66, 0xe37a: 0x7e3b,
			0xe37b: 0x7e35, 0xe37c: 0x7e39, 0xe37d: 0x7e43, 0xe37e: 0x7e37, 0xe380: 0x7e32, 0xe381: 0x7e3a, 0xe382: 0x7e67, 0xe383: 0x7e5d,
			0xe384: 0x7e56, 0xe385: 0x7e5e, 0xe386: 0x7e59, 0xe387: 0x7e5a, 0xe388: 0x7e79, 0xe389: 0x7e6a, 0xe38a: 0x7e69, 0xe38b: 0x7e7c,
			0xe38c: 0x7e7b, 0xe38d: 0x7e83, 0xe38e: 0x7dd5, 0xe38f: 0x7e7d, 0xe390: 0x8fae, 0xe391: 0x7e7f, 0xe392: 0x7e88, 0xe393: 0x7e89,
			0xe394: 0x7e8c, 0xe395: 0x7e92, 0xe396: 0x7e90, 0xe397: 0x7e93, 0xe398: 0x7e94, 0xe399: 0x7e96, 0xe39a: 0x7e8e, 0xe39b: 0x7e9b,
			0xe39c: 0x7e9c, 0xe39d: 0x7f38, 0xe39e: 0x7f3a, 0xe39f: 0x7f45, 0xe3a0: 0x7f4c, 0xe3a1: 0x7f4d, 0xe3a2: 0x7f4e, 0xe3a3: 0x7f50,
			0xe3a4: 0x7f51, 0xe3a5: 0x7f55, 0xe3a6: 0x7f54, 0xe3a7: 0x7f58, 0xe3a8: 0x7f5f, 0xe3a9: 0x7f60, 0xe3aa: 0x7f68, 0xe3ab: 0x7f69,
			0xe3ac: 0x7f67, 0xe3ad: 0x7f78, 0xe3ae: 0x7f82, 0xe3af: 0x7f86, 0xe3b0: 0x7f83, 0xe3b1: 0x7f88, 0xe3b2: 0x7f87, 0xe3b3: 0x7f8c,
			0xe3b4: 0x7f94, 0xe3b5: 0x7f9e, 0xe3b6: 0x7f9d, 0xe3b7: 0x7f9a, 0xe3b8: 0x7fa3, 0xe3b9: 0x7faf, 0xe3ba: 0x7fb2, 0xe3bb: 0x7fb9,
			0xe3bc: 0x7fae, 0xe3bd: 0x7fb6, 0xe3be: 0x7fb8, 0xe3bf: 0x8b71, 0xe3c0: 0x7fc5, 0xe3c1: 0x7fc6, 0xe3c2: 0x7fca, 0xe3c3: 0x7fd5,
			0xe3c4: 0x7fd4, 0xe3c5: 0x7fe1, 0xe3c6: 0x7fe6, 0xe3c7: 0x7fe9, 0xe3c8: 0x7ff3, 0xe3c9: 0x7ff9, 0xe3ca: 0x98dc, 0xe3cb: 0x8006,
			0xe3cc: 0x8004, 0xe3cd: 0x800b, 0xe3ce: 0x8012, 0xe3cf: 0x8018, 0xe3d0: 0x8019, 0xe3d1: 0x801c, 0xe3d2: 0x8021, 0xe3d3: 0x8028,
			0xe3d4: 0x803f, 0xe3d5: 0x803b, 0xe3d6: 0x804a, 0xe3d7: 0x8046, 0xe3d8: 0x8052, 0xe3d9: 0x8058, 0xe3da: 0x805a, 0xe3db: 0x805f,
			0xe3dc: 0x8062, 0xe3dd: 0x8068, 0xe3de: 0x8073, 0xe3df: 0x8072, 0xe3e0: 0x8070, 0xe3e1: 0x8076, 0xe3e2: 0x8079, 0xe3e3: 0x807d,
			0xe3e4: 0x807f, 0xe3e5: 0x8084, 0xe3e6: 0x8086, 0xe3e7: 0x8085, 0xe3e8: 0x809b, 0xe3e9: 0x8093, 0xe3ea: 0x809a, 0xe3eb: 0x80ad,
			0xe3ec: 0x5190, 0xe3ed: 0x80ac, 0xe3ee: 0x80db, 0xe3ef: 0x80e5, 0xe3f0: 0x80d9, 0xe3f1: 0x80dd, 0xe3f2: 0x80c4, 0xe3f3: 0x80da,
			0xe3f4: 0x80d6, 0xe3f5: 0x8109, 0xe3f6: 0x80ef, 0xe3f7: 0x80f1, 0xe3f8: 0x811b, 0xe3f9: 0x8129, 0xe3fa: 0x8123, 0xe3fb: 0x812f,
			0xe3fc: 0x814b, 0xe440: 0x968b, 0xe441: 0x8146, 0xe442: 0x813e, 0xe443: 0x8153, 0xe444: 0x8151, 0xe445: 0x80fc, 0xe446: 0x8171,
			0xe447: 0x816e, 0xe448: 0x8165, 0xe449: 0x8166, 0xe44a: 0x8174, 0xe44b: 0x8183, 0xe44c: 0x8188, 0xe44d: 0x818a, 0xe44e: 0x8180,
			0xe44f: 0x8182, 0xe450: 0x81a0, 0xe451: 0x8195, 0xe452: 0x81a4, 0xe453: 0x81a3, 0xe454: 0x815f, 0xe455: 0x8193, 0xe456: 0x81a9,
			0xe457: 0x81b0, 0xe458: 0x81b5, 0xe459: 0x81be, 0xe45a: 0x81b8, 0xe45b: 0x81bd, 0xe45c: 0x81c0, 0xe45d: 0x81c2, 0xe45e: 0x81ba,
			0xe45f: 0x81c9, 0xe460: 0x81cd, 0xe461: 0x81d1, 0xe462: 0x81d9, 0xe463: 0x81d8, 0xe464: 0x81c8, 0xe465: 0x81da, 0xe466: 0x81df,
			0xe467: 0x81e0, 0xe468: 0x81e7, 0xe469: 0x81fa, 0xe46a: 0x81fb, 0xe46b: 0x81fe, 0xe46c: 0x8201, 0xe46d: 0x8202, 0xe46e: 0x8205,
			0xe46f: 0x8207, 0xe470: 0x820a, 0xe471: 0x820d, 0xe472: 0x8210, 0xe473: 0x8216, 0xe474: 0x8229, 0xe475: 0x822b, 0xe476: 0x8238,
			0xe477: 0x8233, 0xe478: 0x8240, 0xe479: 0x8259, 0xe47a: 0x8258, 0xe47b: 0x825d, 0xe47c: 0x825a, 0xe47d: 0x825f, 0xe47e: 0x8264,
			0xe480: 0x8262, 0xe481: 0x8268, 0xe482: 0x826a, 0xe483: 0x826b, 0xe484: 0x822e, 0xe485: 0x8271, 0xe486: 0x8277, 0xe487: 0x8278,
			0xe488: 0x827e, 0xe489: 0x828d, 0xe48a: 0x8292, 0xe48b: 0x82ab, 0xe48c: 0x829f, 0xe48d: 0x82bb, 0xe48e: 0x82ac, 0xe48f: 0x82e1,
			0xe490: 0x82e3, 0xe491: 0x82df, 0xe492: 0x82d2, 0xe493: 0x82f4, 0xe494: 0x82f3, 0xe495: 0x82fa, 0xe496: 0x8393, 0xe497: 0x8303,
			0xe498: 0x82fb, 0xe499: 0x82f9, 0xe49a: 0x82de, 0xe49b: 0x8306, 0xe49c: 0x82dc, 0xe49d: 0x8309, 0xe49e: 0x82d9, 0xe49f: 0x8335,
			0xe4a0: 0x8334, 0xe4a1: 0x8316, 0xe4a2: 0x8332, 0xe4a3: 0x8331, 0xe4a4: 0x8340, 0xe4a5: 0x8339, 0xe4a6: 0x8350, 0xe4a7: 0x8345,
			0xe4a8: 0x832f, 0xe4a9: 0x832b, 0xe4aa: 0x8317, 0xe4ab: 0x8318, 0xe4ac: 0x8385, 0xe4ad: 0x839a, 0xe4ae: 0x83aa, 0xe4af: 0x839f,
			0xe4b0: 0x83a2, 0xe4b1: 0x8396, 0xe4b2: 0x8323, 0xe4b3: 0x838e, 0xe4b4: 0x8387, 0xe4b5: 0x838a, 0xe4b6: 0x837c, 0xe4b7: 0x83b5,
			0xe4b8: 0x8373, 0xe4b9: 0x8375, 0xe4ba: 0x83a0, 0xe4bb: 0x8389, 0xe4bc: 0x83a8, 0xe4bd: 0x83f4, 0xe4be: 0x8413, 0xe4bf: 0x83eb,
			0xe4c0: 0x83ce, 0xe4c1: 0x83fd, 0xe4c2: 0x8403, 0xe4c3: 0x83d8, 0xe4c4: 0x840b, 0xe4c5: 0x83c1, 0xe4c6: 0x83f7, 0xe4c7: 0x8407,
			0xe4c8: 0x83e0, 0xe4c9: 0x83f2, 0xe4ca: 0x840d, 0xe4cb: 0x8422, 0xe4cc: 0x8420, 0xe4cd: 0x83bd, 0xe4ce: 0x8438, 0xe4cf: 0x8506,
			0xe4d0: 0x83fb, 0xe4d1: 0x846d, 0xe4d2: 0x842a, 0xe4d3: 0x843c, 0xe4d4: 0x855a, 0xe4d5: 0x8484, 0xe4d6: 0x8477, 0xe4d7: 0x846b,
			0xe4d8: 0x84ad, 0xe4d9: 0x846e, 0xe4da: 0x8482, 0xe4db: 0x8469, 0xe4dc: 0x8446, 0xe4dd: 0x842c, 0xe4de: 0x846f, 0xe4df: 0x8479,
			0xe4e0: 0x8435, 0xe4e1: 0x84ca, 0xe4e2: 0x8462, 0xe4e3: 0x84b9, 0xe4e4: 0x84bf, 0xe4e5: 0x849f, 0xe4e6: 0x84d9, 0xe4e7: 0x84cd,
			0xe4e8: 0x84bb, 0xe4e9: 0x84da, 0xe4ea: 0x84d0, 0xe4eb: 0x84c1, 0xe4ec: 0x84c6, 0xe4ed: 0x84d6, 0xe4ee: 0x84a1, 0xe4ef: 0x8521,
			0xe4f0: 0x84ff, 0xe4f1: 0x84f4, 0xe4f2: 0x8517, 0xe4f3: 0x8518, 0xe4f4: 0x852c, 0xe4f5: 0x851f, 0xe4f6: 0x8515, 0xe4f7: 0x8514,
			0xe4f8: 0x84fc, 0xe4f9: 0x8540, 0xe4fa: 0x8563, 0xe4fb: 0x8558, 0xe4fc: 0x8548, 0xe540: 0x8541, 0xe541: 0x8602, 0xe542: 0x854b,
			0xe543: 0x8555, 0xe544: 0x8580, 0xe545: 0x85a4, 0xe546: 0x8588, 0xe547: 0x8591, 0xe548: 0x858a, 0xe549: 0x85a8, 0xe54a: 0x856d,
			0xe54b: 0x8594, 0xe54c: 0x859b, 0xe54d: 0x85ea, 0xe54e: 0x8587, 0xe54f: 0x859c, 0xe550: 0x8577, 0xe551: 0x857e, 0xe552: 0x8590,
			0xe553: 0x85c9, 0xe554: 0x85ba, 0xe555: 0x85cf, 0xe556: 0x85b9, 0xe557: 0x85d0, 0xe558: 0x85d5, 0xe559: 0x85dd, 0xe55a: 0x85e5,
			0xe55b: 0x85dc, 0xe55c: 0x85f9, 0xe55d: 0x860a, 0xe55e: 0x8613, 0xe55f: 0x860b, 0xe560: 0x85fe, 0xe561: 0x85fa, 0xe562: 0x8606,
			0xe563: 0x8622, 0xe564: 0x861a, 0xe565: 0x8630, 0xe566: 0x863f, 0xe567: 0x864d, 0xe568: 0x4e55, 0xe569: 0x8654, 0xe56a: 0x865f,
			0xe56b: 0x8667, 0xe56c: 0x8671, 0xe56d: 0x8693, 0xe56e: 0x86a3, 0xe56f: 0x86a9, 0xe570: 0x86aa, 0xe571: 0x868b, 0xe572: 0x868c,
			0xe573: 0x86b6, 0xe574: 0x86af, 0xe575: 0x86c4, 0xe576: 0x86c6, 0xe577: 0x86b0, 0xe578: 0x86c9, 0xe579: 0x8823, 0xe57a: 0x86ab,
			0xe57b: 0x86d4, 0xe57c: 0x86de, 0xe57d: 0x86e9, 0xe57e: 0x86ec, 0xe580: 0x86df, 0xe581: 0x86db, 0xe582: 0x86ef, 0xe583: 0x8712,
			0xe584: 0x8706, 0xe585: 0x8708, 0xe586: 0x8700, 0xe587: 0x8703, 0xe588: 0x86fb, 0xe589: 0x8711, 0xe58a: 0x8709, 0xe58b: 0x870d,
			0xe58c: 0x86f9, 0xe58d: 0x870a, 0xe58e: 0x8734, 0xe58f: 0x873f, 0xe590: 0x8737, 0xe591: 0x873b, 0xe592: 0x8725, 0xe593: 0x8729,
			0xe594: 0x871a, 0xe595: 0x8760, 0xe596: 0x875f, 0xe597: 0x8778, 0xe598: 0x874c, 0xe599: 0x874e, 0xe59a: 0x8774, 0xe59b: 0x8757,
			0xe59c: 0x8768, 0xe59d: 0x876e, 0xe59e: 0x8759, 0xe59f: 0x8753, 0xe5a0: 0x8763, 0xe5a1: 0x876a, 0xe5a2: 0x8805, 0xe5a3: 0x87a2,
			0xe5a4: 0x879f, 0xe5a5: 0x8782, 0xe5a6: 0x87af, 0xe5a7: 0x87cb, 0xe5a8: 0x87bd, 0xe5a9: 0x87c0, 0xe5aa: 0x87d0, 0xe5ab: 0x96d6,
			0xe5ac: 0x87ab, 0xe5ad: 0x87c4, 0xe5ae: 0x87b3, 0xe5af: 0x87c7, 0xe5b0: 0x87c6, 0xe5b1: 0x87bb, 0xe5b2: 0x87ef, 0xe5b3: 0x87f2,
			0xe5b4: 0x87e0, 0xe5b5: 0x880f, 0xe5b6: 0x880d, 0xe5b7: 0x87fe, 0xe5b8: 0x87f6, 0xe5b9: 0x87f7, 0xe5ba: 0x880e, 0xe5bb: 0x87d2,
			0xe5bc: 0x8811, 0xe5bd: 0x8816, 0xe5be: 0x8815, 0xe5bf: 0x8822, 0xe5c0: 0x8821, 0xe5c1: 0x8831, 0xe5c2: 0x8836, 0xe5c3: 0x8839,
			0xe5c4: 0x8827, 0xe5c5: 0x883b, 0xe5c6: 0x8844, 0xe5c7: 0x8842, 0xe5c8: 0x8852, 0xe5c9: 0x8859, 0xe5ca: 0x885e, 0xe5cb: 0x8862,
			0xe5cc: 0x886b, 0xe5cd: 0x8881, 0xe5ce: 0x887e, 0xe5cf: 0x889e, 0xe5d0: 0x8875, 0xe5d1: 0x887d, 0xe5d2: 0x88b5, 0xe5d3: 0x8872,
			0xe5d4: 0x8882, 0xe5d5: 0x8897, 0xe5d6: 0x8892, 0xe5d7: 0x88ae, 0xe5d8: 0x8899, 0xe5d9: 0x88a2, 0xe5da: 0x888d, 0xe5db: 0x88a4,
			0xe5dc: 0x88b0, 0xe5dd: 0x88bf, 0xe5de: 0x88b1, 0xe5df: 0x88c3, 0xe5e0: 0x88c4, 0xe5e1: 0x88d4, 0xe5e2: 0x88d8, 0xe5e3: 0x88d9,
			0xe5e4: 0x88dd, 0xe5e5: 0x88f9, 0xe5e6: 0x8902, 0xe5e7: 0x88fc, 0xe5e8: 0x88f4, 0xe5e9: 0x88e8, 0xe5ea: 0x88f2, 0xe5eb: 0x8904,
			0xe5ec: 0x890c, 0xe5ed: 0x890a, 0xe5ee: 0x8913, 0xe5ef: 0x8943, 0xe5f0: 0x891e, 0xe5f1: 0x8925, 0xe5f2: 0x892a, 0xe5f3: 0x892b,
			0xe5f4: 0x8941, 0xe5f5: 0x8944, 0xe5f6: 0x893b, 0xe5f7: 0x8936, 0xe5f8: 0x8938, 0xe5f9: 0x894c, 0xe5fa: 0x891d, 0xe5fb: 0x8960,
			0xe5fc: 0x895e, 0xe640: 0x8966, 0xe641: 0x8964, 0xe642: 0x896d, 0xe643: 0x896a, 0xe644: 0x896f, 0xe645: 0x8974, 0xe646: 0x8977,
			0xe647: 0x897e, 0xe648: 0x8983, 0xe649: 0x8988, 0xe64a: 0x898a, 0xe64b: 0x8993, 0xe64c: 0x8998, 0xe64d: 0x89a1, 0xe64e: 0x89a9,
			0xe64f: 0x89a6, 0xe650: 0x89ac, 0xe651: 0x89af, 0xe652: 0x89b2, 0xe653: 0x89ba, 0xe654: 0x89bd, 0xe655: 0x89bf, 0xe656: 0x89c0,
			0xe657: 0x89da, 0xe658: 0x89dc, 0xe659: 0x89dd, 0xe65a: 0x89e7, 0xe65b: 0x89f4, 0xe65c: 0x89f8, 0xe65d: 0x8a03, 0xe65e: 0x8a16,
			0xe65f: 0x8a10, 0xe660: 0x8a0c, 0xe661: 0x8a1b, 0xe662: 0x8a1d, 0xe663: 0x8a25, 0xe664: 0x8a36, 0xe665: 0x8a41, 0xe666: 0x8a5b,
			0xe667: 0x8a52, 0xe668: 0x8a46, 0xe669: 0x8a48, 0xe66a: 0x8a7c, 0xe66b: 0x8a6d, 0xe66c: 0x8a6c, 0xe66d: 0x8a62, 0xe66e: 0x8a85,
			0xe66f: 0x8a82, 0xe670: 0x8a84, 0xe671: 0x8aa8, 0xe672: 0x8aa1, 0xe673: 0x8a91, 0xe674: 0x8aa5, 0xe675: 0x8aa6, 0xe676: 0x8a9a,
			0xe677: 0x8aa3, 0xe678: 0x8ac4, 0xe679: 0x8acd, 0xe67a: 0x8ac2, 0xe67b: 0x8ada, 0xe67c: 0x8aeb, 0xe67d: 0x8af3, 0xe67e: 0x8ae7,
			0xe680: 0x8ae4, 0xe681: 0x8af1, 0xe682: 0x8b14, 0xe683: 0x8ae0, 0xe684: 0x8ae2, 0xe685: 0x8af7, 0xe686: 0x8ade, 0xe687: 0x8adb,
			0xe688: 0x8b0c, 0xe689: 0x8b07, 0xe68a: 0x8b1a, 0xe68b: 0x8ae1, 0xe68c: 0x8b16, 0xe68d: 0x8b10, 0xe68e: 0x8b17, 0xe68f: 0x8b20,
			0xe690: 0x8b33, 0xe691: 0x97ab, 0xe692: 0x8b26, 0xe693: 0x8b2b, 0xe694: 0x8b3e, 0xe695: 0x8b28, 0xe696: 0x8b41, 0xe697: 0x8b4c,
			0xe698: 0x8b4f, 0xe699: 0x8b4e, 0xe69a: 0x8b49, 0xe69b: 0x8b56, 0xe69c: 0x8b5b, 0xe69d: 0x8b5a, 0xe69e: 0x8b6b, 0xe69f: 0x8b5f,
			0xe6a0: 0x8b6c, 0xe6a1: 0x8b6f, 0xe6a2: 0x8b74, 0xe6a3: 0x8b7d, 0xe6a4: 0x8b80, 0xe6a5: 0x8b8c, 0xe6a6: 0x8b8e, 0xe6a7: 0x8b92,
			0xe6a8: 0x8b93, 0xe6a9: 0x8b96, 0xe6aa: 0x8b99, 0xe6ab: 0x8b9a, 0xe6ac: 0x8c3a, 0xe6ad: 0x8c41, 0xe6ae: 0x8c3f, 0xe6af: 0x8c48,
			0xe6b0: 0x8c4c, 0xe6b1: 0x8c4e, 0xe6b2: 0x8c50, 0xe6b3: 0x8c55, 0xe6b4: 0x8c62, 0xe6b5: 0x8c6c, 0xe6b6: 0x8c78, 0xe6b7: 0x8c7a,
			0xe6b8: 0x8c82, 0xe6b9: 0x8c89, 0xe6ba: 0x8c85, 0xe6bb: 0x8c8a, 0xe6bc: 0x8c8d, 0xe6bd: 0x8c8e, 0xe6be: 0x8c94, 0xe6bf: 0x8c7c,
			0xe6c0: 0x8c98, 0xe6c1: 0x621d, 0xe6c2: 0x8cad, 0xe6c3: 0x8caa, 0xe6c4: 0x8cbd, 0xe6c5: 0x8cb2, 0xe6c6: 0x8cb3, 0xe6c7: 0x8cae,
			0xe6c8: 0x8cb6, 0xe6c9: 0x8cc8, 0xe6ca: 0x8cc1, 0xe6cb: 0x8ce4, 0xe6cc: 0x8ce3, 0xe6cd: 0x8cda, 0xe6ce: 0x8cfd, 0xe6cf: 0x8cfa,
			0xe6d0: 0x8cfb, 0xe6d1: 0x8d04, 0xe6d2: 0x8d05, 0xe6d3: 0x8d0a, 0xe6d4: 0x8d07, 0xe6d5: 0x8d0f, 0xe6d6: 0x8d0d, 0xe6d7: 0x8d10,
			0xe6d8: 0x9f4e, 0xe6d9: 0x8d13, 0xe6da: 0x8ccd, 0xe6db: 0x8d14, 0xe6dc: 0x8d16, 0xe6dd: 0x8d67, 0xe6de: 0x8d6d, 0xe6df: 0x8d71,
			0xe6e0: 0x8d73, 0xe6e1: 0x8d81, 0xe6e2: 0x8d99, 0xe6e3: 0x8dc2, 0xe6e4: 0x8dbe, 0xe6e5: 0x8dba, 0xe6e6: 0x8dcf, 0xe6e7: 0x8dda,
			0xe6e8: 0x8dd6, 0xe6e9: 0x8dcc, 0xe6ea: 0x8ddb, 0xe6eb: 0x8dcb, 0xe6ec: 0x8dea, 0xe6ed: 0x8deb, 0xe6ee: 0x8ddf, 0xe6ef: 0x8de3,
			0xe6f0: 0x8dfc, 0xe6f1: 0x8e08, 0xe6f2: 0x8e09, 0xe6f3: 0x8dff, 0xe6f4: 0x8e1d, 0xe6f5: 0x8e1e, 0xe6f6: 0x8e10, 0xe6f7: 0x8e1f,
			0xe6f8: 0x8e42, 0xe6f9: 0x8e35, 0xe6fa: 0x8e30, 0xe6fb: 0x8e34, 0xe6fc: 0x8e4a, 0xe740: 0x8e47, 0xe741: 0x8e49, 0xe742: 0x8e4c,
			0xe743: 0x8e50, 0xe744: 0x8e48, 0xe745: 0x8e59, 0xe746: 0x8e64, 0xe747: 0x8e60, 0xe748: 0x8e2a, 0xe749: 0x8e63, 0xe74a: 0x8e55,
			0xe74b: 0x8e76, 0xe74c: 0x8e72, 0xe74d: 0x8e7c, 0xe74e: 0x8e81, 0xe74f: 0x8e87, 0xe750: 0x8e85, 0xe751: 0x8e84, 0xe752: 0x8e8b,
			0xe753: 0x8e8a, 0xe754: 0x8e93, 0xe755: 0x8e91, 0xe756: 0x8e94, 0xe757: 0x8e99, 0xe758: 0x8eaa, 0xe759: 0x8ea1, 0xe75a: 0x8eac,
			0xe75b: 0x8eb0, 0xe75c: 0x8ec6, 0xe75d: 0x8eb1, 0xe75e: 0x8ebe, 0xe75f: 0x8ec5, 0xe760: 0x8ec8, 0xe761: 0x8ecb, 0xe762: 0x8edb,
			0xe763: 0x8ee3, 0xe764: 0x8efc, 0xe765: 0x8efb, 0xe766: 0x8eeb, 0xe767: 0x8efe, 0xe768: 0x8f0a, 0xe769: 0x8f05, 0xe76a: 0x8f15,
			0xe76b: 0x8f12, 0xe76c: 0x8f19, 0xe76d: 0x8f13, 0xe76e: 0x8f1c, 0xe76f: 0x8f1f, 0xe770: 0x8f1b, 0xe771: 0x8f0c, 0xe772: 0x8f26,
			0xe773: 0x8f33, 0xe774: 0x8f3b, 0xe775: 0x8f39, 0xe776: 0x8f45, 0xe777: 0x8f42, 0xe778: 0x8f3e, 0xe779: 0x8f4c, 0xe77a: 0x8f49,
			0xe77b: 0x8f46, 0xe77c: 0x8f4e, 0xe77d: 0x8f57, 0xe77e: 0x8f5c, 0xe780: 0x8f62, 0xe781: 0x8f63, 0xe782: 0x8f64, 0xe783: 0x8f9c,
			0xe784: 0x8f9f, 0xe785: 0x8fa3, 0xe786: 0x8fad, 0xe787: 0x8faf, 0xe788: 0x8fb7, 0xe789: 0x8fda, 0xe78a: 0x8fe5, 0xe78b: 0x8fe2,
			0xe78c: 0x8fea, 0xe78d: 0x8fef, 0xe78e: 0x9087, 0xe78f: 0x8ff4, 0xe790: 0x9005, 0xe791: 0x8ff9, 0xe792: 0x8ffa, 0xe793: 0x9011,
			0xe794: 0x9015, 0xe795: 0x9021, 0xe796: 0x900d, 0xe797: 0x901e, 0xe798: 0x9016, 0xe799: 0x900b, 0xe79a: 0x9027, 0xe79b: 0x9036,
			0xe79c: 0x9035, 0xe79d: 0x9039, 0xe79e: 0x8ff8, 0xe79f: 0x904f, 0xe7a0: 0x9050, 0xe7a1: 0x9051, 0xe7a2: 0x9052, 0xe7a3: 0x900e,
			0xe7a4: 0x9049, 0xe7a5: 0x903e, 0xe7a6: 0x9056, 0xe7a7: 0x9058, 0xe7a8: 0x905e, 0xe7a9: 0x9068, 0xe7aa: 0x906f, 0xe7ab: 0x9076,
			0xe7ac: 0x96a8, 0xe7ad: 0x9072, 0xe7ae: 0x9082, 0xe7af: 0x907d, 0xe7b0: 0x9081, 0xe7b1: 0x9080, 0xe7b2: 0x908a, 0xe7b3: 0x9089,
			0xe7b4: 0x908f, 0xe7b5: 0x90a8, 0xe7b6: 0x90af, 0xe7b7: 0x90b1, 0xe7b8: 0x90b5, 0xe7b9: 0x90e2, 0xe7ba: 0x90e4, 0xe7bb: 0x6248,
			0xe7bc: 0x90db, 0xe7bd: 0x9102, 0xe7be: 0x9112, 0xe7bf: 0x9119, 0xe7c0: 0x9132, 0xe7c1: 0x9130, 0xe7c2: 0x914a, 0xe7c3: 0x9156,
			0xe7c4: 0x9158, 0xe7c5: 0x9163, 0xe7c6: 0x9165, 0xe7c7: 0x9169, 0xe7c8: 0x9173, 0xe7c9: 0x9172, 0xe7ca: 0x918b, 0xe7cb: 0x9189,
			0xe7cc: 0x9182, 0xe7cd: 0x91a2, 0xe7ce: 0x91ab, 0xe7cf: 0x91af, 0xe7d0: 0x91aa, 0xe7d1: 0x91b5, 0xe7d2: 0x91b4, 0xe7d3: 0x91ba,
			0xe7d4: 0x91c0, 0xe7d5: 0x91c1, 0xe7d6: 0x91c9, 0xe7d7: 0x91cb, 0xe7d8: 0x91d0, 0xe7d9: 0x91d6, 0xe7da: 0x91df, 0xe7db: 0x91e1,
			0xe7dc: 0x91db, 0xe7dd: 0x91fc, 0xe7de: 0x91f5, 0xe7df: 0x91f6, 0xe7e0: 0x921e, 0xe7e1: 0x91ff, 0xe7e2: 0x9214, 0xe7e3: 0x922c,
			0xe7e4: 0x9215, 0xe7e5: 0x9211, 0xe7e6: 0x925e, 0xe7e7: 0x9257, 0xe7e8: 0x9245, 0xe7e9: 0x9249, 0xe7ea: 0x9264, 0xe7eb: 0x9248,
			0xe7ec: 0x9295, 0xe7ed: 0x923f, 0xe7ee: 0x924b, 0xe7ef: 0x9250, 0xe7f0: 0x929c, 0xe7f1: 0x9296, 0xe7f2: 0x9293, 0xe7f3: 0x929b,
			0xe7f4: 0x925a, 0xe7f5: 0x92cf, 0xe7f6: 0x92b9, 0xe7f7: 0x92b7, 0xe7f8: 0x92e9, 0xe7f9: 0x930f, 0xe7fa: 0x92fa, 0xe7fb: 0x9344,
			0xe7fc: 0x932e, 0xe840: 0x9319, 0xe841: 0x9322, 0xe842: 0x931a, 0xe843: 0x9323, 0xe844: 0x933a, 0xe845: 0x9335, 0xe846: 0x933b,
			0xe847: 0x935c, 0xe848: 0x9360, 0xe849: 0x937c, 0xe84a: 0x936e, 0xe84b: 0x9356, 0xe84c: 0x93b0, 0xe84d: 0x93ac, 0xe84e: 0x93ad,
			0xe84f: 0x9394, 0xe850: 0x93b9, 0xe851: 0x93d6, 0xe852: 0x93d7, 0xe853: 0x93e8, 0xe854: 0x93e5, 0xe855: 0x93d8, 0xe856: 0x93c3,
			0xe857: 0x93dd, 0xe858: 0x93d0, 0xe859: 0x93c8, 0xe85a: 0x93e4, 0xe85b: 0x941a, 0xe85c: 0x9414, 0xe85d: 0x9413, 0xe85e: 0x9403,
			0xe85f: 0x9407, 0xe860: 0x9410, 0xe861: 0x9436, 0xe862: 0x942b, 0xe863: 0x9435, 0xe864: 0x9421, 0xe865: 0x943a, 0xe866: 0x9441,
			0xe867: 0x9452, 0xe868: 0x9444, 0xe869: 0x945b, 0xe86a: 0x9460, 0xe86b: 0x9462, 0xe86c: 0x945e, 0xe86d: 0x946a, 0xe86e: 0x9229,
			0xe86f: 0x9470, 0xe870: 0x9475, 0xe871: 0x9477, 0xe872: 0x947d, 0xe873: 0x945a, 0xe874: 0x947c, 0xe875: 0x947e, 0xe876: 0x9481,
			0xe877: 0x947f, 0xe878: 0x9582, 0xe879: 0x9587, 0xe87a: 0x958a, 0xe87b: 0x9594, 0xe87c: 0x9596, 0xe87d: 0x9598, 0xe87e: 0x9599,
			0xe880: 0x95a0, 0xe881: 0x95a8, 0xe882: 0x95a7, 0xe883: 0x95ad, 0xe884: 0x95bc, 0xe885: 0x95bb, 0xe886: 0x95b9, 0xe887: 0x95be,
			0xe888: 0x95ca, 0xe889: 0x6ff6, 0xe88a: 0x95c3, 0xe88b: 0x95cd, 0xe88c: 0x95cc, 0xe88d: 0x95d5, 0xe88e: 0x95d4, 0xe88f: 0x95d6,
			0xe890: 0x95dc, 0xe891: 0x95e1, 0xe892: 0x95e5, 0xe893: 0x95e2, 0xe894: 0x9621, 0xe895: 0x9628, 0xe896: 0x962e, 0xe897: 0x962f,
			0xe898: 0x9642, 0xe899: 0x964c, 0xe89a: 0x964f, 0xe89b: 0x964b, 0xe89c: 0x9677, 0xe89d: 0x965c, 0xe89e: 0x965e, 0xe89f: 0x965d,
			0xe8a0: 0x965f, 0xe8a1: 0x9666, 0xe8a2: 0x9672, 0xe8a3: 0x966c, 0xe8a4: 0x968d, 0xe8a5: 0x9698, 0xe8a6: 0x9695, 0xe8a7: 0x9697,
			0xe8a8: 0x96aa, 0xe8a9: 0x96a7, 0xe8aa: 0x96b1, 0xe8ab: 0x96b2, 0xe8ac: 0x96b0, 0xe8ad: 0x96b4, 0xe8ae: 0x96b6, 0xe8af: 0x96b8,
			0xe8b0: 0x96b9, 0xe8b1: 0x96ce, 0xe8b2: 0x96cb, 0xe8b3: 0x96c9, 0xe8b4: 0x96cd, 0xe8b5: 0x894d, 0xe8b6: 0x96dc, 0xe8b7: 0x970d,
			0xe8b8: 0x96d5, 0xe8b9: 0x96f9, 0xe8ba: 0x9704, 0xe8bb: 0x9706, 0xe8bc: 0x9708, 0xe8bd: 0x9713, 0xe8be: 0x970e, 0xe8bf: 0x9711,
			0xe8c0: 0x970f, 0xe8c1: 0x9716, 0xe8c2: 0x9719, 0xe8c3: 0x9724, 0xe8c4: 0x972a, 0xe8c5: 0x9730, 0xe8c6: 0x9739, 0xe8c7: 0x973d,
			0xe8c8: 0x973e, 0xe8c9: 0x9744, 0xe8ca: 0x9746, 0xe8cb: 0x9748, 0xe8cc: 0x9742, 0xe8cd: 0x9749, 0xe8ce: 0x975c, 0xe8cf: 0x9760,
			0xe8d0: 0x9764, 0xe8d1: 0x9766, 0xe8d2: 0x9768, 0xe8d3: 0x52d2, 0xe8d4: 0x976b, 0xe8d5: 0x9771, 0xe8d6: 0x9779, 0xe8d7: 0x9785,
			0xe8d8: 0x977c, 0xe8d9: 0x9781, 0xe8da: 0x977a, 0xe8db: 0x9786, 0xe8dc: 0x978b, 0xe8dd: 0x978f, 0xe8de: 0x9790, 0xe8df: 0x979c,
			0xe8e0: 0x97a8, 0xe8e1: 0x97a6, 0xe8e2: 0x97a3, 0xe8e3: 0x97b3, 0xe8e4: 0x97b4, 0xe8e5: 0x97c3, 0xe8e6: 0x97c6, 0xe8e7: 0x97c8,
			0xe8e8: 0x97cb, 0xe8e9: 0x97dc, 0xe8ea: 0x97ed, 0xe8eb: 0x9f4f, 0xe8ec: 0x97f2, 0xe8ed: 0x7adf, 0xe8ee: 0x97f6, 0xe8ef: 0x97f5,
			0xe8f0: 0x980f, 0xe8f1: 0x980c, 0xe8f2: 0x9838, 0xe8f3: 0x9824, 0xe8f4: 0x9821, 0xe8f5: 0x9837, 0xe8f6: 0x983d, 0xe8f7: 0x9846,
			0xe8f8: 0x984f, 0xe8f9: 0x984b, 0xe8fa: 0x986b, 0xe8fb: 0x986f, 0xe8fc: 0x9870, 0xe940: 0x9871, 0xe941: 0x9874, 0xe942: 0x9873,
			0xe943: 0x98aa, 0xe944: 0x98af, 0xe945: 0x98b1, 0xe946: 0x98b6, 0xe947: 0x98c4, 0xe948: 0x98c3, 0xe949: 0x98c6, 0xe94a: 0x98e9,
			0xe94b: 0x98eb, 0xe94c: 0x9903, 0xe94d: 0x9909, 0xe94e: 0x9912, 0xe94f: 0x9914, 0xe950: 0x9918, 0xe951: 0x9921, 0xe952: 0x991d,
			0xe953: 0x991e, 0xe954: 0x9924, 0xe955: 0x9920, 0xe956: 0x992c, 0xe957: 0x992e, 0xe958: 0x993d, 0xe959: 0x993e, 0xe95a: 0x9942,
			0xe95b: 0x9949, 0xe95c: 0x9945, 0xe95d: 0x9950, 0xe95e: 0x994b, 0xe95f: 0x9951, 0xe960: 0x9952, 0xe961: 0x994c, 0xe962: 0x9955,
			0xe963: 0x9997, 0xe964: 0x9998, 0xe965: 0x99a5, 0xe966: 0x99ad, 0xe967: 0x99ae, 0xe968: 0x99bc, 0xe969: 0x99df, 0xe96a: 0x99db,
			0xe96b: 0x99dd, 0xe96c: 0x99d8, 0xe96d: 0x99d1, 0xe96e: 0x99ed, 0xe96f: 0x99ee, 0xe970: 0x99f1, 0xe971: 0x99f2, 0xe972: 0x99fb,
			0xe973: 0x99f8, 0xe974: 0x9a01, 0xe975: 0x9a0f, 0xe976: 0x9a05, 0xe977: 0x99e2, 0xe978: 0x9a19, 0xe979: 0x9a2b, 0xe97a: 0x9a37,
			0xe97b: 0x9a45, 0xe97c: 0x9a42, 0xe97d: 0x9a40, 0xe97e: 0x9a43, 0xe980: 0x9a3e, 0xe981: 0x9a55, 0xe982: 0x9a4d, 0xe983: 0x9a5b,
			0xe984: 0x9a57, 0xe985: 0x9a5f, 0xe986: 0x9a62, 0xe987: 0x9a65, 0xe988: 0x9a64, 0xe989: 0x9a69, 0xe98a: 0x9a6b, 0xe98b: 0x9a6a,
			0xe98c: 0x9aad, 0xe98d: 0x9ab0, 0xe98e: 0x9abc, 0xe98f: 0x9ac0, 0xe990: 0x9acf, 0xe991: 0x9ad1, 0xe992: 0x9ad3, 0xe993: 0x9ad4,
			0xe994: 0x9ade, 0xe995: 0x9adf, 0xe996: 0x9ae2, 0xe997: 0x9ae3, 0xe998: 0x9ae6, 0xe999: 0x9aef, 0xe99a: 0x9aeb, 0xe99b: 0x9aee,
			0xe99c: 0x9af4, 0xe99d: 0x9af1, 0xe99e: 0x9af7, 0xe99f: 0x9afb, 0xe9a0: 0x9b06, 0xe9a1: 0x9b18, 0xe9a2: 0x9b1a, 0xe9a3: 0x9b1f,
			0xe9a4: 0x9b22, 0xe9a5: 0x9b23, 0xe9a6: 0x9b25, 0xe9a7: 0x9b27, 0xe9a8: 0x9b28, 0xe9a9: 0x9b29, 0xe9aa: 0x9b2a, 0xe9ab: 0x9b2e,
			0xe9ac: 0x9b2f, 0xe9ad: 0x9b32, 0xe9ae: 0x9b44, 0xe9af: 0x9b43, 0xe9b0: 0x9b4f, 0xe9b1: 0x9b4d, 0xe9b2: 0x9b4e, 0xe9b3: 0x9b51,
			0xe9b4: 0x9b58, 0xe9b5: 0x9b74, 0xe9b6: 0x9b93, 0xe9b7: 0x9b83, 0xe9b8: 0x9b91, 0xe9b9: 0x9b96, 0xe9ba: 0x9b97, 0xe9bb: 0x9b9f,
			0xe9bc: 0x9ba0, 0xe9bd: 0x9ba8, 0xe9be: 0x9bb4, 0xe9bf: 0x9bc0, 0xe9c0: 0x9bca, 0xe9c1: 0x9bb9, 0xe9c2: 0x9bc6, 0xe9c3: 0x9bcf,
			0xe9c4: 0x9bd1, 0xe9c5: 0x9bd2, 0xe9c6: 0x9be3, 0xe9c7: 0x9be2, 0xe9c8: 0x9be4, 0xe9c9: 0x9bd4, 0xe9ca: 0x9be1, 0xe9cb: 0x9c3a,
			0xe9cc: 0x9bf2, 0xe9cd: 0x9bf1, 0xe9ce: 0x9bf0, 0xe9cf: 0x9c15, 0xe9d0: 0x9c14, 0xe9d1: 0x9c09, 0xe9d2: 0x9c13, 0xe9d3: 0x9c0c,
			0xe9d4: 0x9c06, 0xe9d5: 0x9c08, 0xe9d6: 0x9c12, 0xe9d7: 0x9c0a, 0xe9d8: 0x9c04, 0xe9d9: 0x9c2e, 0xe9da: 0x9c1b, 0xe9db: 0x9c25,
			0xe9dc: 0x9c24, 0xe9dd: 0x9c21, 0xe9de: 0x9c30, 0xe9df: 0x9c47, 0xe9e0: 0x9c32, 0xe9e1: 0x9c46, 0xe9e2: 0x9c3e, 0xe9e3: 0x9c5a,
			0xe9e4: 0x9c60, 0xe9e5: 0x9c67, 0xe9e6: 0x9c76, 0xe9e7: 0x9c78, 0xe9e8: 0x9ce7, 0xe9e9: 0x9cec, 0xe9ea: 0x9cf0, 0xe9eb: 0x9d09,
			0xe9ec: 0x9d08, 0xe9ed: 0x9ceb, 0xe9ee: 0x9d03, 0xe9ef: 0x9d06, 0xe9f0: 0x9d2a, 0xe9f1: 0x9d26, 0xe9f2: 0x9daf, 0xe9f3: 0x9d23,
			0xe9f4: 0x9d1f, 0xe9f5: 0x9d44, 0xe9f6: 0x9d15, 0xe9f7: 0x9d12, 0xe9f8: 0x9d41, 0xe9f9: 0x9d3f, 0xe9fa: 0x9d3e, 0xe9fb: 0x9d46,
			0xe9fc: 0x9d48, 0xea40: 0x9d5d, 0xea41: 0x9d5e, 0xea42: 0x9d64, 0xea43: 0x9d51, 0xea44: 0x9d50, 0xea45: 0x9d59, 0xea46: 0x9d72,
			0xea47: 0x9d89, 0xea48: 0x9d87, 0xea49: 0x9dab, 0xea4a: 0x9d6f, 0xea4b: 0x9d7a, 0xea4c: 0x9d9a, 0xea4d: 0x9da4, 0xea4e: 0x9da9,
			0xea4f: 0x9db2, 0xea50: 0x9dc4, 0xea51: 0x9dc1, 0xea52: 0x9dbb, 0xea53: 0x9db8, 0xea54: 0x9dba, 0xea55: 0x9dc6, 0xea56: 0x9dcf,
			0xea57: 0x9dc2, 0xea58: 0x9dd9, 0xea59: 0x9dd3, 0xea5a: 0x9df8, 0xea5b: 0x9de6, 0xea5c: 0x9ded, 0xea5d: 0x9def, 0xea5e: 0x9dfd,
			0xea5f: 0x9e1a, 0xea60: 0x9e1b, 0xea61: 0x9e1e, 0xea62: 0x9e75, 0xea63: 0x9e79, 0xea64: 0x9e7d, 0xea65: 0x9e81, 0xea66: 0x9e88,
			0xea67: 0x9e8b, 0xea68: 0x9e8c, 0xea69: 0x9e92, 0xea6a: 0x9e95, 0xea6b: 0x9e91, 0xea6c: 0x9e9d, 0xea6d: 0x9ea5, 0xea6e: 0x9ea9,
			0xea6f: 0x9eb8, 0xea70: 0x9eaa, 0xea71: 0x9ead, 0xea72: 0x9761, 0xea73: 0x9ecc, 0xea74: 0x9ece, 0xea75: 0x9ecf, 0xea76: 0x9ed0,
			0xea77: 0x9ed4, 0xea78: 0x9edc, 0xea79: 0x9ede, 0xea7a: 0x9edd, 0xea7b: 0x9ee0, 0xea7c: 0x9ee5, 0xea7d: 0x9ee8, 0xea7e: 0x9eef,
			0xea80: 0x9ef4, 0xea81: 0x9ef6, 0xea82: 0x9ef7, 0xea83: 0x9ef9, 0xea84: 0x9efb, 0xea85: 0x9efc, 0xea86: 0x9efd, 0xea87: 0x9f07,
			0xea88: 0x9f08, 0xea89: 0x76b7, 0xea8a: 0x9f15, 0xea8b: 0x9f21, 0xea8c: 0x9f2c, 0xea8d: 0x9f3e, 0xea8e: 0x9f4a, 0xea8f: 0x9f52,
			0xea90: 0x9f54, 0xea91: 0x9f63, 0xea92: 0x9f5f, 0xea93: 0x9f60, 0xea94: 0x9f61, 0xea95: 0x9f66, 0xea96: 0x9f67, 0xea97: 0x9f6c,
			0xea98: 0x9f6a, 0xea99: 0x9f77, 0xea9a: 0x9f72, 0xea9b: 0x9f76, 0xea9c: 0x9f95, 0xea9d: 0x9f9c, 0xea9e: 0x9fa0, 0xea9f: 0x582f,
			0xeaa0: 0x69c7, 0xeaa1: 0x9059, 0xeaa2: 0x7464, 0xeaa3: 0x51dc, 0xeaa4: 0x7199, 0xed40: 0x7e8a, 0xed41: 0x891c, 0xed42: 0x9348,
			0xed43: 0x9288, 0xed44: 0x84dc, 0xed45: 0x4fc9, 0xed46: 0x70bb, 0xed47: 0x6631, 0xed48: 0x68c8, 0xed49: 0x92f9, 0xed4a: 0x66fb,
			0xed4b: 0x5f45, 0xed4c: 0x4e28, 0xed4d: 0x4ee1, 0xed4e: 0x4efc, 0xed4f: 0x4f00, 0xed50: 0x4f03, 0xed51: 0x4f39, 0xed52: 0x4f56,
			0xed53: 0x4f92, 0xed54: 0x4f8a, 0xed55: 0x4f9a, 0xed56: 0x4f94, 0xed57: 0x4fcd, 0xed58: 0x5040, 0xed59: 0x5022, 0xed5a: 0x4fff,
			0xed5b: 0x501e, 0xed5c: 0x5046, 0xed5d: 0x5070, 0xed5e: 0x5042, 0xed5f: 0x5094, 0xed60: 0x50f4, 0xed61: 0x50d8, 0xed62: 0x514a,
			0xed63: 0x5164, 0xed64: 0x519d, 0xed65: 0x51be, 0xed66: 0x51ec, 0xed67: 0x5215, 0xed68: 0x529c, 0xed69: 0x52a6, 0xed6a: 0x52c0,
			0xed6b: 0x52db, 0xed6c: 0x5300, 0xed6d: 0x5307, 0xed6e: 0x5324, 0xed6f: 0x5372, 0xed70: 0x5393, 0xed71: 0x53b2, 0xed72: 0x53dd,
			0xed73: 0xfa0e, 0xed74: 0x549c, 0xed75: 0x548a, 0xed76: 0x54a9, 0xed77: 0x54ff, 0xed78: 0x5586, 0xed79: 0x5759, 0xed7a: 0x5765,
			0xed7b: 0x57ac, 0xed7c: 0x57c8, 0xed7d: 0x57c7, 0xed7e: 0xfa0f, 0xed80: 0xfa10, 0xed81: 0x589e, 0xed82: 0x58b2, 0xed83: 0x590b,
			0xed84: 0x5953, 0xed85: 0x595b, 0xed86: 0x595d, 0xed87: 0x5963, 0xed88: 0x59a4, 0xed89: 0x59ba, 0xed8a: 0x5b56, 0xed8b: 0x5bc0,
			0xed8c: 0x752f, 0xed8d: 0x5bd8, 0xed8e: 0x5bec, 0xed8f: 0x5c1e, 0xed90: 0x5ca6, 0xed91: 0x5cba, 0xed92: 0x5cf5, 0xed93: 0x5d27,
			0xed94: 0x5d53, 0xed95: 0xfa11, 0xed96: 0x5d42, 0xed97: 0x5d6d, 0xed98: 0x5db8, 0xed99: 0x5db9, 0xed9a: 0x5dd0, 0xed9b: 0x5f21,
			0xed9c: 0x5f34, 0xed9d: 0x5f67, 0xed9e: 0x5fb7, 0xed9f: 0x5fde, 0xeda0: 0x605d, 0xeda1: 0x6085, 0xeda2: 0x608a, 0xeda3: 0x60de,
			0xeda4: 0x60d5, 0xeda5: 0x6120, 0xeda6: 0x60f2, 0xeda7: 0x6111, 0xeda8: 0x6137, 0xeda9: 0x6130, 0xedaa: 0x6198, 0xedab: 0x6213,
			0xedac: 0x62a6, 0xedad: 0x63f5, 0xedae: 0x6460, 0xedaf: 0x649d, 0xedb0: 0x64ce, 0xedb1: 0x654e, 0xedb2: 0x6600, 0xedb3: 0x6615,
			0xedb4: 0x663b, 0xedb5: 0x6609, 0xedb6: 0x662e, 0xedb7: 0x661e, 0xedb8: 0x6624, 0xedb9: 0x6665, 0xedba: 0x6657, 0xedbb: 0x6659,
			0xedbc: 0xfa12, 0xedbd: 0x6673, 0xedbe: 0x6699, 0xedbf: 0x66a0, 0xedc0: 0x66b2, 0xedc1: 0x66bf, 0xedc2: 0x66fa, 0xedc3: 0x670e,
			0xedc4: 0xf929, 0xedc5: 0x6766, 0xedc6: 0x67bb, 0xedc7: 0x6852, 0xedc8: 0x67c0, 0xedc9: 0x6801, 0xedca: 0x6844, 0xedcb: 0x68cf,
			0xedcc: 0xfa13, 0xedcd: 0x6968, 0xedce: 0xfa14, 0xedcf: 0x6998, 0xedd0: 0x69e2, 0xedd1: 0x6a30, 0xedd2: 0x6a6b, 0xedd3: 0x6a46,
			0xedd4: 0x6a73, 0xedd5: 0x6a7e, 0xedd6: 0x6ae2, 0xedd7: 0x6ae4, 0xedd8: 0x6bd6, 0xedd9: 0x6c3f, 0xedda: 0x6c5c, 0xeddb: 0x6c86,
			0xeddc: 0x6c6f, 0xeddd: 0x6cda, 0xedde: 0x6d04, 0xeddf: 0x6d87, 0xede0: 0x6d6f, 0xede1: 0x6d96, 0xede2: 0x6dac, 0xede3: 0x6dcf,
			0xede4: 0x6df8, 0xede5: 0x6df2, 0xede6: 0x6dfc, 0xede7: 0x6e39, 0xede8: 0x6e5c, 0xede9: 0x6e27, 0xedea: 0x6e3c, 0xedeb: 0x6ebf,
			0xedec: 0x6f88, 0xeded: 0x6fb5, 0xedee: 0x6ff5, 0xedef: 0x7005, 0xedf0: 0x7007, 0xedf1: 0x7028, 0xedf2: 0x7085, 0xedf3: 0x70ab,
			0xedf4: 0x710f, 0xedf5: 0x7104, 0xedf6: 0x715c, 0xedf7: 0x7146, 0xedf8: 0x7147, 0xedf9: 0xfa15, 0xedfa: 0x71c1, 0xedfb: 0x71fe,
			0xedfc: 0x72b1, 0xee40: 0x72be, 0xee41: 0x7324, 0xee42: 0xfa16, 0xee43: 0x7377, 0xee44: 0x73bd, 0xee45: 0x73c9, 0xee46: 0x73d6,
			0xee47: 0x73e3, 0xee48: 0x73d2, 0xee49: 0x7407, 0xee4a: 0x73f5, 0xee4b: 0x7426, 0xee4c: 0x742a, 0xee4d: 0x7429, 0xee4e: 0x742e,
			0xee4f: 0x7462, 0xee50: 0x7489, 0xee51: 0x749f, 0xee52: 0x7501, 0xee53: 0x756f, 0xee54: 0x7682, 0xee55: 0x769c, 0xee56: 0x769e,
			0xee57: 0x769b, 0xee58: 0x76a6, 0xee59: 0xfa17, 0xee5a: 0x7746, 0xee5b: 0x52af, 0xee5c: 0x7821, 0xee5d: 0x784e, 0xee5e: 0x7864,
			0xee5f: 0x787a, 0xee60: 0x7930, 0xee61: 0xfa18, 0xee62: 0xfa19, 0xee63: 0xfa1a, 0xee64: 0x7994, 0xee65: 0xfa1b, 0xee66: 0x799b,
			0xee67: 0x7ad1, 0xee68: 0x7ae7, 0xee69: 0xfa1c, 0xee6a: 0x7aeb, 0xee6b: 0x7b9e, 0xee6c: 0xfa1d, 0xee6d: 0x7d48, 0xee6e: 0x7d5c,
			0xee6f: 0x7db7, 0xee70: 0x7da0, 0xee71: 0x7dd6, 0xee72: 0x7e52, 0xee73: 0x7f47, 0xee74: 0x7fa1, 0xee75: 0xfa1e, 0xee76: 0x8301,
			0xee77: 0x8362, 0xee78: 0x837f, 0xee79: 0x83c7, 0xee7a: 0x83f6, 0xee7b: 0x8448, 0xee7c: 0x84b4, 0xee7d: 0x8553, 0xee7e: 0x8559,
			0xee80: 0x856b, 0xee81: 0xfa1f, 0xee82: 0x85b0, 0xee83: 0xfa20, 0xee84: 0xfa21, 0xee85: 0x8807, 0xee86: 0x88f5, 0xee87: 0x8a12,
			0xee88: 0x8a37, 0xee89: 0x8a79, 0xee8a: 0x8aa7, 0xee8b: 0x8abe, 0xee8c: 0x8adf, 0xee8d: 0xfa22, 0xee8e: 0x8af6, 0xee8f: 0x8b53,
			0xee90: 0x8b7f, 0xee91: 0x8cf0, 0xee92: 0x8cf4, 0xee93: 0x8d12, 0xee94: 0x8d76, 0xee95: 0xfa23, 0xee96: 0x8ecf, 0xee97: 0xfa24,
			0xee98: 0xfa25, 0xee99: 0x9067, 0xee9a: 0x90de, 0xee9b: 0xfa26, 0xee9c: 0x9115, 0xee9d: 0x9127, 0xee9e: 0x91da, 0xee9f: 0x91d7,
			0xeea0: 0x91de, 0xeea1: 0x91ed, 0xeea2: 0x91ee, 0xeea3: 0x91e4, 0xeea4: 0x91e5, 0xeea5: 0x9206, 0xeea6: 0x9210, 0xeea7: 0x920a,
			0xeea8: 0x923a, 0xeea9: 0x9240, 0xeeaa: 0x923c, 0xeeab: 0x924e, 0xeeac: 0x9259, 0xeead: 0x9251, 0xeeae: 0x9239, 0xeeaf: 0x9267,
			0xeeb0: 0x92a7, 0xeeb1: 0x9277, 0xeeb2: 0x9278, 0xeeb3: 0x92e7, 0xeeb4: 0x92d7, 0xeeb5: 0x92d9, 0xeeb6: 0x92d0, 0xeeb7: 0xfa27,
			0xeeb8: 0x92d5, 0xeeb9: 0x92e0, 0xeeba: 0x92d3, 0xeebb: 0x9325, 0xeebc: 0x9321, 0xeebd: 0x92fb, 0xeebe: 0xfa28, 0xeebf: 0x931e,
			0xeec0: 0x92ff, 0xeec1: 0x931d, 0xeec2: 0x9302, 0xeec3: 0x9370, 0xeec4: 0x9357, 0xeec5: 0x93a4, 0xeec6: 0x93c6, 0xeec7: 0x93de,
			0xeec8: 0x93f8, 0xeec9: 0x9431, 0xeeca: 0x9445, 0xeecb: 0x9448, 0xeecc: 0x9592, 0xeecd: 0xf9dc, 0xeece: 0xfa29, 0xeecf: 0x969d,
			0xeed0: 0x96af, 0xeed1: 0x9733, 0xeed2: 0x973b, 0xeed3: 0x9743, 0xeed4: 0x974d, 0xeed5: 0x974f, 0xeed6: 0x9751, 0xeed7: 0x9755,
			0xeed8: 0x9857, 0xeed9: 0x9865, 0xeeda: 0xfa2a, 0xeedb: 0xfa2b, 0xeedc: 0x9927, 0xeedd: 0xfa2c, 0xeede: 0x999e, 0xeedf: 0x9a4e,
			0xeee0: 0x9ad9, 0xeee1: 0x9adc, 0xeee2: 0x9b75, 0xeee3: 0x9b72, 0xeee4: 0x9b8f, 0xeee5: 0x9bb1, 0xeee6: 0x9bbb, 0xeee7: 0x9c00,
			0xeee8: 0x9d70, 0xeee9: 0x9d6b, 0xeeea: 0xfa2d, 0xeeeb: 0x9e19, 0xeeec: 0x9ed1, 0xeeef: 0x2170, 0xeef0: 0x2171, 0xeef1: 0x2172,
			0xeef2: 0x2173, 0xeef3: 0x2174, 0xeef4: 0x2175, 0xeef5: 0x2176, 0xeef6: 0x2177, 0xeef7: 0x2178, 0xeef8: 0x2179, 0xeef9: 0xffe2,
			0xeefa: 0xffe4, 0xeefb: 0xff07, 0xeefc: 0xff02, 0xf040: 0xe000, 0xf041: 0xe001, 0xf042: 0xe002, 0xf043: 0xe003, 0xf044: 0xe004,
			0xf045: 0xe005, 0xf046: 0xe006, 0xf047: 0xe007, 0xf048: 0xe008, 0xf049: 0xe009, 0xf04a: 0xe00a, 0xf04b: 0xe00b, 0xf04c: 0xe00c,
			0xf04d: 0xe00d, 0xf04e: 0xe00e, 0xf04f: 0xe00f, 0xf050: 0xe010, 0xf051: 0xe011, 0xf052: 0xe012, 0xf053: 0xe013, 0xf054: 0xe014,
			0xf055: 0xe015, 0xf056: 0xe016, 0xf057: 0xe017, 0xf058: 0xe018, 0xf059: 0xe019, 0xf05a: 0xe01a, 0xf05b: 0xe01b, 0xf05c: 0xe01c,
			0xf05d: 0xe01d, 0xf05e: 0xe01e, 0xf05f: 0xe01f, 0xf060: 0xe020, 0xf061: 0xe021, 0xf062: 0xe022, 0xf063: 0xe023, 0xf064: 0xe024,
			0xf065: 0xe025, 0xf066: 0xe026, 0xf067: 0xe027, 0xf068: 0xe028, 0xf069: 0xe029, 0xf06a: 0xe02a, 0xf06b: 0xe02b, 0xf06c: 0xe02c,
			0xf06d: 0xe02d, 0xf06e: 0xe02e, 0xf06f: 0xe02f, 0xf070: 0xe030, 0xf071: 0xe031, 0xf072: 0xe032, 0xf073: 0xe033, 0xf074: 0xe034,
			0xf075: 0xe035, 0xf076: 0xe036, 0xf077: 0xe037, 0xf078: 0xe038, 0xf079: 0xe039, 0xf07a: 0xe03a, 0xf07b: 0xe03b, 0xf07c: 0xe03c,
			0xf07d: 0xe03d, 0xf07e: 0xe03e, 0xf080: 0xe03f, 0xf081: 0xe040, 0xf082: 0xe041, 0xf083: 0xe042, 0xf084: 0xe043, 0xf085: 0xe044,
			0xf086: 0xe045, 0xf087: 0xe046, 0xf088: 0xe047, 0xf089: 0xe048, 0xf08a: 0xe049, 0xf08b: 0xe04a, 0xf08c: 0xe04b, 0xf08d: 0xe04c,
			0xf08e: 0xe04d, 0xf08f: 0xe04e, 0xf090: 0xe04f, 0xf091: 0xe050, 0xf092: 0xe051, 0xf093: 0xe052, 0xf094: 0xe053, 0xf095: 0xe054,
			0xf096: 0xe055, 0xf097: 0xe056, 0xf098: 0xe057, 0xf099: 0xe058, 0xf09a: 0xe059, 0xf09b: 0xe05a, 0xf09c: 0xe05b, 0xf09d: 0xe05c,
			0xf09e: 0xe05d, 0xf09f: 0xe05e, 0xf0a0: 0xe05f, 0xf0a1: 0xe060, 0xf0a2: 0xe061, 0xf0a3: 0xe062, 0xf0a4: 0xe063, 0xf0a5: 0xe064,
			0xf0a6: 0xe065, 0xf0a7: 0xe066, 0xf0a8: 0xe067, 0xf0a9: 0xe068, 0xf0aa: 0xe069, 0xf0ab: 0xe06a, 0xf0ac: 0xe06b, 0xf0ad: 0xe06c,
			0xf0ae: 0xe06d, 0xf0af: 0xe06e, 0xf0b0: 0xe06f, 0xf0b1: 0xe070, 0xf0b2: 0xe071, 0xf0b3: 0xe072, 0xf0b4: 0xe073, 0xf0b5: 0xe074,
			0xf0b6: 0xe075, 0xf0b7: 0xe076, 0xf0b8: 0xe077, 0xf0b9: 0xe078, 0xf0ba: 0xe079, 0xf0bb: 0xe07a, 0xf0bc: 0xe07b, 0xf0bd: 0xe07c,
			0xf0be: 0xe07d, 0xf0bf: 0xe07e, 0xf0c0: 0xe07f, 0xf0c1: 0xe080, 0xf0c2: 0xe081, 0xf0c3: 0xe082, 0xf0c4: 0xe083, 0xf0c5: 0xe084,
			0xf0c6: 0xe085, 0xf0c7: 0xe086, 0xf0c8: 0xe087, 0xf0c9: 0xe088, 0xf0ca: 0xe089, 0xf0cb: 0xe08a, 0xf0cc: 0xe08b, 0xf0cd: 0xe08c,
			0xf0ce: 0xe08d, 0xf0cf: 0xe08e, 0xf0d0: 0xe08f, 0xf0d1: 0xe090, 0xf0d2: 0xe091, 0xf0d3: 0xe092, 0xf0d4: 0xe093, 0xf0d5: 0xe094,
			0xf0d6: 0xe095, 0xf0d7: 0xe096, 0xf0d8: 0xe097, 0xf0d9: 0xe098, 0xf0da: 0xe099, 0xf0db: 0xe09a, 0xf0dc: 0xe09b, 0xf0dd: 0xe09c,
			0xf0de: 0xe09d, 0xf0df: 0xe09e, 0xf0e0: 0xe09f, 0xf0e1: 0xe0a0, 0xf0e2: 0xe0a1, 0xf0e3: 0xe0a2, 0xf0e4: 0xe0a3, 0xf0e5: 0xe0a4,
			0xf0e6: 0xe0a5, 0xf0e7: 0xe0a6, 0xf0e8: 0xe0a7, 0xf0e9: 0xe0a8, 0xf0ea: 0xe0a9, 0xf0eb: 0xe0aa, 0xf0ec: 0xe0ab, 0xf0ed: 0xe0ac,
			0xf0ee: 0xe0ad, 0xf0ef: 0xe0ae, 0xf0f0: 0xe0af, 0xf0f1: 0xe0b0, 0xf0f2: 0xe0b1, 0xf0f3: 0xe0b2, 0xf0f4: 0xe0b3, 0xf0f5: 0xe0b4,
			0xf0f6: 0xe0b5, 0xf0f7: 0xe0b6, 0xf0f8: 0xe0b7, 0xf0f9: 0xe0b8, 0xf0fa: 0xe0b9, 0xf0fb: 0xe0ba, 0xf0fc: 0xe0bb, 0xf140: 0xe0bc,
			0xf141: 0xe0bd, 0xf142: 0xe0be, 0xf143: 0xe0bf, 0xf144: 0xe0c0, 0xf145: 0xe0c1, 0xf146: 0xe0c2, 0xf147: 0xe0c3, 0xf148: 0xe0c4,
			0xf149: 0xe0c5, 0xf14a: 0xe0c6, 0xf14b: 0xe0c7, 0xf14c: 0xe0c8, 0xf14d: 0xe0c9, 0xf14e: 0xe0ca, 0xf14f: 0xe0cb, 0xf150: 0xe0cc,
			0xf151: 0xe0cd, 0xf152: 0xe0ce, 0xf153: 0xe0cf, 0xf154: 0xe0d0, 0xf155: 0xe0d1, 0xf156: 0xe0d2, 0xf157: 0xe0d3, 0xf158: 0xe0d4,
			0xf159: 0xe0d5, 0xf15a: 0xe0d6, 0xf15b: 0xe0d7, 0xf15c: 0xe0d8, 0xf15d: 0xe0d9, 0xf15e: 0xe0da, 0xf15f: 0xe0db, 0xf160: 0xe0dc,
			0xf161: 0xe0dd, 0xf162: 0xe0de, 0xf163: 0xe0df, 0xf164: 0xe0e0, 0xf165: 0xe0e1, 0xf166: 0xe0e2, 0xf167: 0xe0e3, 0xf168: 0xe0e4,
			0xf169: 0xe0e5, 0xf16a: 0xe0e6, 0xf16b: 0xe0e7, 0xf16c: 0xe0e8, 0xf16d: 0xe0e9, 0xf16e: 0xe0ea, 0xf16f: 0xe0eb, 0xf170: 0xe0ec,
			0xf171: 0xe0ed, 0xf172: 0xe0ee, 0xf173: 0xe0ef, 0xf174: 0xe0f0, 0xf175: 0xe0f1, 0xf176: 0xe0f2, 0xf177: 0xe0f3, 0xf178: 0xe0f4,
			0xf179: 0xe0f5, 0xf17a: 0xe0f6, 0xf17b: 0xe0f7, 0xf17c: 0xe0f8, 0xf17d: 0xe0f9, 0xf17e: 0xe0fa, 0xf180: 0xe0fb, 0xf181: 0xe0fc,
			0xf182: 0xe0fd, 0xf183: 0xe0fe, 0xf184: 0xe0ff, 0xf185: 0xe100, 0xf186: 0xe101, 0xf187: 0xe102, 0xf188: 0xe103, 0xf189: 0xe104,
			0xf18a: 0xe105, 0xf18b: 0xe106, 0xf18c: 0xe107, 0xf18d: 0xe108, 0xf18e: 0xe109, 0xf18f: 0xe10a, 0xf190: 0xe10b, 0xf191: 0xe10c,
			0xf192: 0xe10d, 0xf193: 0xe10e, 0xf194: 0xe10f, 0xf195: 0xe110, 0xf196: 0xe111, 0xf197: 0xe112, 0xf198: 0xe113, 0xf199: 0xe114,
			0xf19a: 0xe115, 0xf19b: 0xe116, 0xf19c: 0xe117, 0xf19d: 0xe118, 0xf19e: 0xe119, 0xf19f: 0xe11a, 0xf1a0: 0xe11b, 0xf1a1: 0xe11c,
			0xf1a2: 0xe11d, 0xf1a3: 0xe11e, 0xf1a4: 0xe11f, 0xf1a5: 0xe120, 0xf1a6: 0xe121, 0xf1a7: 0xe122, 0xf1a8: 0xe123, 0xf1a9: 0xe124,
			0xf1aa: 0xe125, 0xf1ab: 0xe126, 0xf1ac: 0xe127, 0xf1ad: 0xe128, 0xf1ae: 0xe129, 0xf1af: 0xe12a, 0xf1b0: 0xe12b, 0xf1b1: 0xe12c,
			0xf1b2: 0xe12d, 0xf1b3: 0xe12e, 0xf1b4: 0xe12f, 0xf1b5: 0xe130, 0xf1b6: 0xe131, 0xf1b7: 0xe132, 0xf1b8: 0xe133, 0xf1b9: 0xe134,
			0xf1ba: 0xe135, 0xf1bb: 0xe136, 0xf1bc: 0xe137, 0xf1bd: 0xe138, 0xf1be: 0xe139, 0xf1bf: 0xe13a, 0xf1c0: 0xe13b, 0xf1c1: 0xe13c,
			0xf1c2: 0xe13d, 0xf1c3: 0xe13e, 0xf1c4: 0xe13f, 0xf1c5: 0xe140, 0xf1c6: 0xe141, 0xf1c7: 0xe142, 0xf1c8: 0xe143, 0xf1c9: 0xe144,
			0xf1ca: 0xe145, 0xf1cb: 0xe146, 0xf1cc: 0xe147, 0xf1cd: 0xe148, 0xf1ce: 0xe149, 0xf1cf: 0xe14a, 0xf1d0: 0xe14b, 0xf1d1: 0xe14c,
			0xf1d2: 0xe14d, 0xf1d3: 0xe14e, 0xf1d4: 0xe14f, 0xf1d5: 0xe150, 0xf1d6: 0xe151, 0xf1d7: 0xe152, 0xf1d8: 0xe153, 0xf1d9: 0xe154,
			0xf1da: 0xe155, 0xf1db: 0xe156, 0xf1dc: 0xe157, 0xf1dd: 0xe158, 0xf1de: 0xe159, 0xf1df: 0xe15a, 0xf1e0: 0xe15b, 0xf1e1: 0xe15c,
			0xf1e2: 0xe15d, 0xf1e3: 0xe15e, 0xf1e4: 0xe15f, 0xf1e5: 0xe160, 0xf1e6: 0xe161, 0xf1e7: 0xe162, 0xf1e8: 0xe163, 0xf1e9: 0xe164,
			0xf1ea: 0xe165, 0xf1eb: 0xe166, 0xf1ec: 0xe167, 0xf1ed: 0xe168, 0xf1ee: 0xe169, 0xf1ef: 0xe16a, 0xf1f0: 0xe16b, 0xf1f1: 0xe16c,
			0xf1f2: 0xe16d, 0xf1f3: 0xe16e, 0xf1f4: 0xe16f, 0xf1f5: 0xe170, 0xf1f6: 0xe171, 0xf1f7: 0xe172, 0xf1f8: 0xe173, 0xf1f9: 0xe174,
			0xf1fa: 0xe175, 0xf1fb: 0xe176, 0xf1fc: 0xe177, 0xf240: 0xe178, 0xf241: 0xe179, 0xf242: 0xe17a, 0xf243: 0xe17b, 0xf244: 0xe17c,
			0xf245: 0xe17d, 0xf246: 0xe17e, 0xf247: 0xe17f, 0xf248: 0xe180, 0xf249: 0xe181, 0xf24a: 0xe182, 0xf24b: 0xe183, 0xf24c: 0xe184,
			0xf24d: 0xe185, 0xf24e: 0xe186, 0xf24f: 0xe187, 0xf250: 0xe188, 0xf251: 0xe189, 0xf252: 0xe18a, 0xf253: 0xe18b, 0xf254: 0xe18c,
			0xf255: 0xe18d, 0xf256: 0xe18e, 0xf257: 0xe18f, 0xf258: 0xe190, 0xf259: 0xe191, 0xf25a: 0xe192, 0xf25b: 0xe193, 0xf25c: 0xe194,
			0xf25d: 0xe195, 0xf25e: 0xe196, 0xf25f: 0xe197, 0xf260: 0xe198, 0xf261: 0xe199, 0xf262: 0xe19a, 0xf263: 0xe19b, 0xf264: 0xe19c,
			0xf265: 0xe19d, 0xf266: 0xe19e, 0xf267: 0xe19f, 0xf268: 0xe1a0, 0xf269: 0xe1a1, 0xf26a: 0xe1a2, 0xf26b: 0xe1a3, 0xf26c: 0xe1a4,
			0xf26d: 0xe1a5, 0xf26e: 0xe1a6, 0xf26f: 0xe1a7, 0xf270: 0xe1a8, 0xf271: 0xe1a9, 0xf272: 0xe1aa, 0xf273: 0xe1ab, 0xf274: 0xe1ac,
			0xf275: 0xe1ad, 0xf276: 0xe1ae, 0xf277: 0xe1af, 0xf278: 0xe1b0, 0xf279: 0xe1b1, 0xf27a: 0xe1b2, 0xf27b: 0xe1b3, 0xf27c: 0xe1b4,
			0xf27d: 0xe1b5, 0xf27e: 0xe1b6, 0xf280: 0xe1b7, 0xf281: 0xe1b8, 0xf282: 0xe1b9, 0xf283: 0xe1ba, 0xf284: 0xe1bb, 0xf285: 0xe1bc,
			0xf286: 0xe1bd, 0xf287: 0xe1be, 0xf288: 0xe1bf, 0xf289: 0xe1c0, 0xf28a: 0xe1c1, 0xf28b: 0xe1c2, 0xf28c: 0xe1c3, 0xf28d: 0xe1c4,
			0xf28e: 0xe1c5, 0xf28f: 0xe1c6, 0xf290: 0xe1c7, 0xf291: 0xe1c8, 0xf292: 0xe1c9, 0xf293: 0xe1ca, 0xf294: 0xe1cb, 0xf295: 0xe1cc,
			0xf296: 0xe1cd, 0xf297: 0xe1ce, 0xf298: 0xe1cf, 0xf299: 0xe1d0, 0xf29a: 0xe1d1, 0xf29b: 0xe1d2, 0xf29c: 0xe1d3, 0xf29d: 0xe1d4,
			0xf29e: 0xe1d5, 0xf29f: 0xe1d6, 0xf2a0: 0xe1d7, 0xf2a1: 0xe1d8, 0xf2a2: 0xe1d9, 0xf2a3: 0xe1da, 0xf2a4: 0xe1db, 0xf2a5: 0xe1dc,
			0xf2a6: 0xe1dd, 0xf2a7: 0xe1de, 0xf2a8: 0xe1df, 0xf2a9: 0xe1e0, 0xf2aa: 0xe1e1, 0xf2ab: 0xe1e2, 0xf2ac: 0xe1e3, 0xf2ad: 0xe1e4,
			0xf2ae: 0xe1e5, 0xf2af: 0xe1e6, 0xf2b0: 0xe1e7, 0xf2b1: 0xe1e8, 0xf2b2: 0xe1e9, 0xf2b3: 0xe1ea, 0xf2b4: 0xe1eb, 0xf2b5: 0xe1ec,
			0xf2b6: 0xe1ed, 0xf2b7: 0xe1ee, 0xf2b8: 0xe1ef, 0xf2b9: 0xe1f0, 0xf2ba: 0xe1f1, 0xf2bb: 0xe1f2, 0xf2bc: 0xe1f3, 0xf2bd: 0xe1f4,
			0xf2be: 0xe1f5, 0xf2bf: 0xe1f6, 0xf2c0: 0xe1f7, 0xf2c1: 0xe1f8, 0xf2c2: 0xe1f9, 0xf2c3: 0xe1fa, 0xf2c4: 0xe1fb, 0xf2c5: 0xe1fc,
			0xf2c6: 0xe1fd, 0xf2c7: 0xe1fe, 0xf2c8: 0xe1ff, 0xf2c9: 0xe200, 0xf2ca: 0xe201, 0xf2cb: 0xe202, 0xf2cc: 0xe203, 0xf2cd: 0xe204,
			0xf2ce: 0xe205, 0xf2cf: 0xe206, 0xf2d0: 0xe207, 0xf2d1: 0xe208, 0xf2d2: 0xe209, 0xf2d3: 0xe20a, 0xf2d4: 0xe20b, 0xf2d5: 0xe20c,
			0xf2d6: 0xe20d, 0xf2d7: 0xe20e, 0xf2d8: 0xe20f, 0xf2d9: 0xe210, 0xf2da: 0xe211, 0xf2db: 0xe212, 0xf2dc: 0xe213, 0xf2dd: 0xe214,
			0xf2de: 0xe215, 0xf2df: 0xe216, 0xf2e0: 0xe217, 0xf2e1: 0xe218, 0xf2e2: 0xe219, 0xf2e3: 0xe21a, 0xf2e4: 0xe21b, 0xf2e5: 0xe21c,
			0xf2e6: 0xe21d, 0xf2e7: 0xe21e, 0xf2e8: 0xe21f, 0xf2e9: 0xe220, 0xf2ea: 0xe221, 0xf2eb: 0xe222, 0xf2ec: 0xe223, 0xf2ed: 0xe224,
			0xf2ee: 0xe225, 0xf2ef: 0xe226, 0xf2f0: 0xe227, 0xf2f1: 0xe228, 0xf2f2: 0xe229, 0xf2f3: 0xe22a, 0xf2f4: 0xe22b, 0xf2f5: 0xe22c,
			0xf2f6: 0xe22d, 0xf2f7: 0xe22e, 0xf2f8: 0xe22f, 0xf2f9: 0xe230, 0xf2fa: 0xe231, 0xf2fb: 0xe232, 0xf2fc: 0xe233, 0xf340: 0xe234,
			0xf341: 0xe235, 0xf342: 0xe236, 0xf343: 0xe237, 0xf344: 0xe238, 0xf345: 0xe239, 0xf346: 0xe23a, 0xf347: 0xe23b, 0xf348: 0xe23c,
			0xf349: 0xe23d, 0xf34a: 0xe23e, 0xf34b: 0xe23f, 0xf34c: 0xe240, 0xf34d: 0xe241, 0xf34e: 0xe242, 0xf34f: 0xe243, 0xf350: 0xe244,
			0xf351: 0xe245, 0xf352: 0xe246, 0xf353: 0xe247, 0xf354: 0xe248, 0xf355: 0xe249, 0xf356: 0xe24a, 0xf357: 0xe24b, 0xf358: 0xe24c,
			0xf359: 0xe24d, 0xf35a: 0xe24e, 0xf35b: 0xe24f, 0xf35c: 0xe250, 0xf35d: 0xe251, 0xf35e: 0xe252, 0xf35f: 0xe253, 0xf360: 0xe254,
			0xf361: 0xe255, 0xf362: 0xe256, 0xf363: 0xe257, 0xf364: 0xe258, 0xf365: 0xe259, 0xf366: 0xe25a, 0xf367: 0xe25b, 0xf368: 0xe25c,
			0xf369: 0xe25d, 0xf36a: 0xe25e, 0xf36b: 0xe25f, 0xf36c: 0xe260, 0xf36d: 0xe261, 0xf36e: 0xe262, 0xf36f: 0xe263, 0xf370: 0xe264,
			0xf371: 0xe265, 0xf372: 0xe266, 0xf373: 0xe267, 0xf374: 0xe268, 0xf375: 0xe269, 0xf376: 0xe26a, 0xf377: 0xe26b, 0xf378: 0xe26c,
			0xf379: 0xe26d, 0xf37a: 0xe26e, 0xf37b: 0xe26f, 0xf37c: 0xe270, 0xf37d: 0xe271, 0xf37e: 0xe272, 0xf380: 0xe273, 0xf381: 0xe274,
			0xf382: 0xe275, 0xf383: 0xe276, 0xf384: 0xe277, 0xf385: 0xe278, 0xf386: 0xe279, 0xf387: 0xe27a, 0xf388: 0xe27b, 0xf389: 0xe27c,
			0xf38a: 0xe27d, 0xf38b: 0xe27e, 0xf38c: 0xe27f, 0xf38d: 0xe280, 0xf38e: 0xe281, 0xf38f: 0xe282, 0xf390: 0xe283, 0xf391: 0xe284,
			0xf392: 0xe285, 0xf393: 0xe286, 0xf394: 0xe287, 0xf395: 0xe288, 0xf396: 0xe289, 0xf397: 0xe28a, 0xf398: 0xe28b, 0xf399: 0xe28c,
			0xf39a: 0xe28d, 0xf39b: 0xe28e, 0xf39c: 0xe28f, 0xf39d: 0xe290, 0xf39e: 0xe291, 0xf39f: 0xe292, 0xf3a0: 0xe293, 0xf3a1: 0xe294,
			0xf3a2: 0xe295, 0xf3a3: 0xe296, 0xf3a4: 0xe297, 0xf3a5: 0xe298, 0xf3a6: 0xe299, 0xf3a7: 0xe29a, 0xf3a8: 0xe29b, 0xf3a9: 0xe29c,
			0xf3aa: 0xe29d, 0xf3ab: 0xe29e, 0xf3ac: 0xe29f, 0xf3ad: 0xe2a0, 0xf3ae: 0xe2a1, 0xf3af: 0xe2a2, 0xf3b0: 0xe2a3, 0xf3b1: 0xe2a4,
			0xf3b2: 0xe2a5, 0xf3b3: 0xe2a6, 0xf3b4: 0xe2a7, 0xf3b5: 0xe2a8, 0xf3b6: 0xe2a9, 0xf3b7: 0xe2aa, 0xf3b8: 0xe2ab, 0xf3b9: 0xe2ac,
			0xf3ba: 0xe2ad, 0xf3bb: 0xe2ae, 0xf3bc: 0xe2af, 0xf3bd: 0xe2b0, 0xf3be: 0xe2b1, 0xf3bf: 0xe2b2, 0xf3c0: 0xe2b3, 0xf3c1: 0xe2b4,
			0xf3c2: 0xe2b5, 0xf3c3: 0xe2b6, 0xf3c4: 0xe2b7, 0xf3c5: 0xe2b8, 0xf3c6: 0xe2b9, 0xf3c7: 0xe2ba, 0xf3c8: 0xe2bb, 0xf3c9: 0xe2bc,
			0xf3ca: 0xe2bd, 0xf3cb: 0xe2be, 0xf3cc: 0xe2bf, 0xf3cd: 0xe2c0, 0xf3ce: 0xe2c1, 0xf3cf: 0xe2c2, 0xf3d0: 0xe2c3, 0xf3d1: 0xe2c4,
			0xf3d2: 0xe2c5, 0xf3d3: 0xe2c6, 0xf3d4: 0xe2c7, 0xf3d5: 0xe2c8, 0xf3d6: 0xe2c9, 0xf3d7: 0xe2ca, 0xf3d8: 0xe2cb, 0xf3d9: 0xe2cc,
			0xf3da: 0xe2cd, 0xf3db: 0xe2ce, 0xf3dc: 0xe2cf, 0xf3dd: 0xe2d0, 0xf3de: 0xe2d1, 0xf3df: 0xe2d2, 0xf3e0: 0xe2d3, 0xf3e1: 0xe2d4,
			0xf3e2: 0xe2d5, 0xf3e3: 0xe2d6, 0xf3e4: 0xe2d7, 0xf3e5: 0xe2d8, 0xf3e6: 0xe2d9, 0xf3e7: 0xe2da, 0xf3e8: 0xe2db, 0xf3e9: 0xe2dc,
			0xf3ea: 0xe2dd, 0xf3eb: 0xe2de, 0xf3ec: 0xe2df, 0xf3ed: 0xe2e0, 0xf3ee: 0xe2e1, 0xf3ef: 0xe2e2, 0xf3f0: 0xe2e3, 0xf3f1: 0xe2e4,
			0xf3f2: 0xe2e5, 0xf3f3: 0xe2e6, 0xf3f4: 0xe2e7, 0xf3f5: 0xe2e8, 0xf3f6: 0xe2e9, 0xf3f7: 0xe2ea, 0xf3f8: 0xe2eb, 0xf3f9: 0xe2ec,
			0xf3fa: 0xe2ed, 0xf3fb: 0xe2ee, 0xf3fc: 0xe2ef, 0xf440: 0xe2f0, 0xf441: 0xe2f1, 0xf442: 0xe2f2, 0xf443: 0xe2f3, 0xf444: 0xe2f4,
			0xf445: 0xe2f5, 0xf446: 0xe2f6, 0xf447: 0xe2f7, 0xf448: 0xe2f8, 0xf449: 0xe2f9, 0xf44a: 0xe2fa, 0xf44b: 0xe2fb, 0xf44c: 0xe2fc,
			0xf44d: 0xe2fd, 0xf44e: 0xe2fe, 0xf44f: 0xe2ff, 0xf450: 0xe300, 0xf451: 0xe301, 0xf452: 0xe302, 0xf453: 0xe303, 0xf454: 0xe304,
			0xf455: 0xe305, 0xf456: 0xe306, 0xf457: 0xe307, 0xf458: 0xe308, 0xf459: 0xe309, 0xf45a: 0xe30a, 0xf45b: 0xe30b, 0xf45c: 0xe30c,
			0xf45d: 0xe30d, 0xf45e: 0xe30e, 0xf45f: 0xe30f, 0xf460: 0xe310, 0xf461: 0xe311, 0xf462: 0xe312, 0xf463: 0xe313, 0xf464: 0xe314,
			0xf465: 0xe315, 0xf466: 0xe316, 0xf467: 0xe317, 0xf468: 0xe318, 0xf469: 0xe319, 0xf46a: 0xe31a, 0xf46b: 0xe31b, 0xf46c: 0xe31c,
			0xf46d: 0xe31d, 0xf46e: 0xe31e, 0xf46f: 0xe31f, 0xf470: 0xe320, 0xf471: 0xe321, 0xf472: 0xe322, 0xf473: 0xe323, 0xf474: 0xe324,
			0xf475: 0xe325, 0xf476: 0xe326, 0xf477: 0xe327, 0xf478: 0xe328, 0xf479: 0xe329, 0xf47a: 0xe32a, 0xf47b: 0xe32b, 0xf47c: 0xe32c,
			0xf47d: 0xe32d, 0xf47e: 0xe32e, 0xf480: 0xe32f, 0xf481: 0xe330, 0xf482: 0xe331, 0xf483: 0xe332, 0xf484: 0xe333, 0xf485: 0xe334,
			0xf486: 0xe335, 0xf487: 0xe336, 0xf488: 0xe337, 0xf489: 0xe338, 0xf48a: 0xe339, 0xf48b: 0xe33a, 0xf48c: 0xe33b, 0xf48d: 0xe33c,
			0xf48e: 0xe33d, 0xf48f: 0xe33e, 0xf490: 0xe33f, 0xf491: 0xe340, 0xf492: 0xe341, 0xf493: 0xe342, 0xf494: 0xe343, 0xf495: 0xe344,
			0xf496: 0xe345, 0xf497: 0xe346, 0xf498: 0xe347, 0xf499: 0xe348, 0xf49a: 0xe349, 0xf49b: 0xe34a, 0xf49c: 0xe34b, 0xf49d: 0xe34c,
			0xf49e: 0xe34d, 0xf49f: 0xe34e, 0xf4a0: 0xe34f, 0xf4a1: 0xe350, 0xf4a2: 0xe351, 0xf4a3: 0xe352, 0xf4a4: 0xe353, 0xf4a5: 0xe354,
			0xf4a6: 0xe355, 0xf4a7: 0xe356, 0xf4a8: 0xe357, 0xf4a9: 0xe358, 0xf4aa: 0xe359, 0xf4ab: 0xe35a, 0xf4ac: 0xe35b, 0xf4ad: 0xe35c,
			0xf4ae: 0xe35d, 0xf4af: 0xe35e, 0xf4b0: 0xe35f, 0xf4b1: 0xe360, 0xf4b2: 0xe361, 0xf4b3: 0xe362, 0xf4b4: 0xe363, 0xf4b5: 0xe364,
			0xf4b6: 0xe365, 0xf4b7: 0xe366, 0xf4b8: 0xe367, 0xf4b9: 0xe368, 0xf4ba: 0xe369, 0xf4bb: 0xe36a, 0xf4bc: 0xe36b, 0xf4bd: 0xe36c,
			0xf4be: 0xe36d, 0xf4bf: 0xe36e, 0xf4c0: 0xe36f, 0xf4c1: 0xe370, 0xf4c2: 0xe371, 0xf4c3: 0xe372, 0xf4c4: 0xe373, 0xf4c5: 0xe374,
			0xf4c6: 0xe375, 0xf4c7: 0xe376, 0xf4c8: 0xe377, 0xf4c9: 0xe378, 0xf4ca: 0xe379, 0xf4cb: 0xe37a, 0xf4cc: 0xe37b, 0xf4cd: 0xe37c,
			0xf4ce: 0xe37d, 0xf4cf: 0xe37e, 0xf4d0: 0xe37f, 0xf4d1: 0xe380, 0xf4d2: 0xe381, 0xf4d3: 0xe382, 0xf4d4: 0xe383, 0xf4d5: 0xe384,
			0xf4d6: 0xe385, 0xf4d7: 0xe386, 0xf4d8: 0xe387, 0xf4d9: 0xe388, 0xf4da: 0xe389, 0xf4db: 0xe38a, 0xf4dc: 0xe38b, 0xf4dd: 0xe38c,
			0xf4de: 0xe38d, 0xf4df: 0xe38e, 0xf4e0: 0xe38f, 0xf4e1: 0xe390, 0xf4e2: 0xe391, 0xf4e3: 0xe392, 0xf4e4: 0xe393, 0xf4e5: 0xe394,
			0xf4e6: 0xe395, 0xf4e7: 0xe396, 0xf4e8: 0xe397, 0xf4e9: 0xe398, 0xf4ea: 0xe399, 0xf4eb: 0xe39a, 0xf4ec: 0xe39b, 0xf4ed: 0xe39c,
			0xf4ee: 0xe39d, 0xf4ef: 0xe39e, 0xf4f0: 0xe39f, 0xf4f1: 0xe3a0, 0xf4f2: 0xe3a1, 0xf4f3: 0xe3a2, 0xf4f4: 0xe3a3, 0xf4f5: 0xe3a4,
			0xf4f6: 0xe3a5, 0xf4f7: 0xe3a6, 0xf4f8: 0xe3a7, 0xf4f9: 0xe3a8, 0xf4fa: 0xe3a9, 0xf4fb: 0xe3aa, 0xf4fc: 0xe3ab, 0xf540: 0xe3ac,
			0xf541: 0xe3ad, 0xf542: 0xe3ae, 0xf543: 0xe3af, 0xf544: 0xe3b0, 0xf545: 0xe3b1, 0xf546: 0xe3b2, 0xf547: 0xe3b3, 0xf548: 0xe3b4,
			0xf549: 0xe3b5, 0xf54a: 0xe3b6, 0xf54b: 0xe3b7, 0xf54c: 0xe3b8, 0xf54d: 0xe3b9, 0xf54e: 0xe3ba, 0xf54f: 0xe3bb, 0xf550: 0xe3bc,
			0xf551: 0xe3bd, 0xf552: 0xe3be, 0xf553: 0xe3bf, 0xf554: 0xe3c0, 0xf555: 0xe3c1, 0xf556: 0xe3c2, 0xf557: 0xe3c3, 0xf558: 0xe3c4,
			0xf559: 0xe3c5, 0xf55a: 0xe3c6, 0xf55b: 0xe3c7, 0xf55c: 0xe3c8, 0xf55d: 0xe3c9, 0xf55e: 0xe3ca, 0xf55f: 0xe3cb, 0xf560: 0xe3cc,
			0xf561: 0xe3cd, 0xf562: 0xe3ce, 0xf563: 0xe3cf, 0xf564: 0xe3d0, 0xf565: 0xe3d1, 0xf566: 0xe3d2, 0xf567: 0xe3d3, 0xf568: 0xe3d4,
			0xf569: 0xe3d5, 0xf56a: 0xe3d6, 0xf56b: 0xe3d7, 0xf56c: 0xe3d8, 0xf56d: 0xe3d9, 0xf56e: 0xe3da, 0xf56f: 0xe3db, 0xf570: 0xe3dc,
			0xf571: 0xe3dd, 0xf572: 0xe3de, 0xf573: 0xe3df, 0xf574: 0xe3e0, 0xf575: 0xe3e1, 0xf576: 0xe3e2, 0xf577: 0xe3e3, 0xf578: 0xe3e4,
			0xf579: 0xe3e5, 0xf57a: 0xe3e6, 0xf57b: 0xe3e7, 0xf57c: 0xe3e8, 0xf57d: 0xe3e9, 0xf57e: 0xe3ea, 0xf580: 0xe3eb, 0xf581: 0xe3ec,
			0xf582: 0xe3ed, 0xf583: 0xe3ee, 0xf584: 0xe3ef, 0xf585: 0xe3f0, 0xf586: 0xe3f1, 0xf587: 0xe3f2, 0xf588: 0xe3f3, 0xf589: 0xe3f4,
			0xf58a: 0xe3f5, 0xf58b: 0xe3f6, 0xf58c: 0xe3f7, 0xf58d: 0xe3f8, 0xf58e: 0xe3f9, 0xf58f: 0xe3fa, 0xf590: 0xe3fb, 0xf591: 0xe3fc,
			0xf592: 0xe3fd, 0xf593: 0xe3fe, 0xf594: 0xe3ff, 0xf595: 0xe400, 0xf596: 0xe401, 0xf597: 0xe402, 0xf598: 0xe403, 0xf599: 0xe404,
			0xf59a: 0xe405, 0xf59b: 0xe406, 0xf59c: 0xe407, 0xf59d: 0xe408, 0xf59e: 0xe409, 0xf59f: 0xe40a, 0xf5a0: 0xe40b, 0xf5a1: 0xe40c,
			0xf5a2: 0xe40d, 0xf5a3: 0xe40e, 0xf5a4: 0xe40f, 0xf5a5: 0xe410, 0xf5a6: 0xe411, 0xf5a7: 0xe412, 0xf5a8: 0xe413, 0xf5a9: 0xe414,
			0xf5aa: 0xe415, 0xf5ab: 0xe416, 0xf5ac: 0xe417, 0xf5ad: 0xe418, 0xf5ae: 0xe419, 0xf5af: 0xe41a, 0xf5b0: 0xe41b, 0xf5b1: 0xe41c,
			0xf5b2: 0xe41d, 0xf5b3: 0xe41e, 0xf5b4: 0xe41f, 0xf5b5: 0xe420, 0xf5b6: 0xe421, 0xf5b7: 0xe422, 0xf5b8: 0xe423, 0xf5b9: 0xe424,
			0xf5ba: 0xe425, 0xf5bb: 0xe426, 0xf5bc: 0xe427, 0xf5bd: 0xe428, 0xf5be: 0xe429, 0xf5bf: 0xe42a, 0xf5c0: 0xe42b, 0xf5c1: 0xe42c,
			0xf5c2: 0xe42d, 0xf5c3: 0xe42e, 0xf5c4: 0xe42f, 0xf5c5: 0xe430, 0xf5c6: 0xe431, 0xf5c7: 0xe432, 0xf5c8: 0xe433, 0xf5c9: 0xe434,
			0xf5ca: 0xe435, 0xf5cb: 0xe436, 0xf5cc: 0xe437, 0xf5cd: 0xe438, 0xf5ce: 0xe439, 0xf5cf: 0xe43a, 0xf5d0: 0xe43b, 0xf5d1: 0xe43c,
			0xf5d2: 0xe43d, 0xf5d3: 0xe43e, 0xf5d4: 0xe43f, 0xf5d5: 0xe440, 0xf5d6: 0xe441, 0xf5d7: 0xe442, 0xf5d8: 0xe443, 0xf5d9: 0xe444,
			0xf5da: 0xe445, 0xf5db: 0xe446, 0xf5dc: 0xe447, 0xf5dd: 0xe448, 0xf5de: 0xe449, 0xf5df: 0xe44a, 0xf5e0: 0xe44b, 0xf5e1: 0xe44c,
			0xf5e2: 0xe44d, 0xf5e3: 0xe44e, 0xf5e4: 0xe44f, 0xf5e5: 0xe450, 0xf5e6: 0xe451, 0xf5e7: 0xe452, 0xf5e8: 0xe453, 0xf5e9: 0xe454,
			0xf5ea: 0xe455, 0xf5eb: 0xe456, 0xf5ec: 0xe457, 0xf5ed: 0xe458, 0xf5ee: 0xe459, 0xf5ef: 0xe45a, 0xf5f0: 0xe45b, 0xf5f1: 0xe45c,
			0xf5f2: 0xe45d, 0xf5f3: 0xe45e, 0xf5f4: 0xe45f, 0xf5f5: 0xe460, 0xf5f6: 0xe461, 0xf5f7: 0xe462, 0xf5f8: 0xe463, 0xf5f9: 0xe464,
			0xf5fa: 0xe465, 0xf5fb: 0xe466, 0xf5fc: 0xe467, 0xf640: 0xe468, 0xf641: 0xe469, 0xf642: 0xe46a, 0xf643: 0xe46b, 0xf644: 0xe46c,
			0xf645: 0xe46d, 0xf646: 0xe46e, 0xf647: 0xe46f, 0xf648: 0xe470, 0xf649: 0xe471, 0xf64a: 0xe472, 0xf64b: 0xe473, 0xf64c: 0xe474,
			0xf64d: 0xe475, 0xf64e: 0xe476, 0xf64f: 0xe477, 0xf650: 0xe478, 0xf651: 0xe479, 0xf652: 0xe47a, 0xf653: 0xe47b, 0xf654: 0xe47c,
			0xf655: 0xe47d, 0xf656: 0xe47e, 0xf657: 0xe47f, 0xf658: 0xe480, 0xf659: 0xe481, 0xf65a: 0xe482, 0xf65b: 0xe483, 0xf65c: 0xe484,
			0xf65d: 0xe485, 0xf65e: 0xe486, 0xf65f: 0xe487, 0xf660: 0xe488, 0xf661: 0xe489, 0xf662: 0xe48a, 0xf663: 0xe48b, 0xf664: 0xe48c,
			0xf665: 0xe48d, 0xf666: 0xe48e, 0xf667: 0xe48f, 0xf668: 0xe490, 0xf669: 0xe491, 0xf66a: 0xe492, 0xf66b: 0xe493, 0xf66c: 0xe494,
			0xf66d: 0xe495, 0xf66e: 0xe496, 0xf66f: 0xe497, 0xf670: 0xe498, 0xf671: 0xe499, 0xf672: 0xe49a, 0xf673: 0xe49b, 0xf674: 0xe49c,
			0xf675: 0xe49d, 0xf676: 0xe49e, 0xf677: 0xe49f, 0xf678: 0xe4a0, 0xf679: 0xe4a1, 0xf67a: 0xe4a2, 0xf67b: 0xe4a3, 0xf67c: 0xe4a4,
			0xf67d: 0xe4a5, 0xf67e: 0xe4a6, 0xf680: 0xe4a7, 0xf681: 0xe4a8, 0xf682: 0xe4a9, 0xf683: 0xe4aa, 0xf684: 0xe4ab, 0xf685: 0xe4ac,
			0xf686: 0xe4ad, 0xf687: 0xe4ae, 0xf688: 0xe4af, 0xf689: 0xe4b0, 0xf68a: 0xe4b1, 0xf68b: 0xe4b2, 0xf68c: 0xe4b3, 0xf68d: 0xe4b4,
			0xf68e: 0xe4b5, 0xf68f: 0xe4b6, 0xf690: 0xe4b7, 0xf691: 0xe4b8, 0xf692: 0xe4b9, 0xf693: 0xe4ba, 0xf694: 0xe4bb, 0xf695: 0xe4bc,
			0xf696: 0xe4bd, 0xf697: 0xe4be, 0xf698: 0xe4bf, 0xf699: 0xe4c0, 0xf69a: 0xe4c1, 0xf69b: 0xe4c2, 0xf69c: 0xe4c3, 0xf69d: 0xe4c4,
			0xf69e: 0xe4c5, 0xf69f: 0xe4c6, 0xf6a0: 0xe4c7, 0xf6a1: 0xe4c8, 0xf6a2: 0xe4c9, 0xf6a3: 0xe4ca, 0xf6a4: 0xe4cb, 0xf6a5: 0xe4cc,
			0xf6a6: 0xe4cd, 0xf6a7: 0xe4ce, 0xf6a8: 0xe4cf, 0xf6a9: 0xe4d0, 0xf6aa: 0xe4d1, 0xf6ab: 0xe4d2, 0xf6ac: 0xe4d3, 0xf6ad: 0xe4d4,
			0xf6ae: 0xe4d5, 0xf6af: 0xe4d6, 0xf6b0: 0xe4d7, 0xf6b1: 0xe4d8, 0xf6b2: 0xe4d9, 0xf6b3: 0xe4da, 0xf6b4: 0xe4db, 0xf6b5: 0xe4dc,
			0xf6b6: 0xe4dd, 0xf6b7: 0xe4de, 0xf6b8: 0xe4df, 0xf6b9: 0xe4e0, 0xf6ba: 0xe4e1, 0xf6bb: 0xe4e2, 0xf6bc: 0xe4e3, 0xf6bd: 0xe4e4,
			0xf6be: 0xe4e5, 0xf6bf: 0xe4e6, 0xf6c0: 0xe4e7, 0xf6c1: 0xe4e8, 0xf6c2: 0xe4e9, 0xf6c3: 0xe4ea, 0xf6c4: 0xe4eb, 0xf6c5: 0xe4ec,
			0xf6c6: 0xe4ed, 0xf6c7: 0xe4ee, 0xf6c8: 0xe4ef, 0xf6c9: 0xe4f0, 0xf6ca: 0xe4f1, 0xf6cb: 0xe4f2, 0xf6cc: 0xe4f3, 0xf6cd: 0xe4f4,
			0xf6ce: 0xe4f5, 0xf6cf: 0xe4f6, 0xf6d0: 0xe4f7, 0xf6d1: 0xe4f8, 0xf6d2: 0xe4f9, 0xf6d3: 0xe4fa, 0xf6d4: 0xe4fb, 0xf6d5: 0xe4fc,
			0xf6d6: 0xe4fd, 0xf6d7: 0xe4fe, 0xf6d8: 0xe4ff, 0xf6d9: 0xe500, 0xf6da: 0xe501, 0xf6db: 0xe502, 0xf6dc: 0xe503, 0xf6dd: 0xe504,
			0xf6de: 0xe505, 0xf6df: 0xe506, 0xf6e0: 0xe507, 0xf6e1: 0xe508, 0xf6e2: 0xe509, 0xf6e3: 0xe50a, 0xf6e4: 0xe50b, 0xf6e5: 0xe50c,
			0xf6e6: 0xe50d, 0xf6e7: 0xe50e, 0xf6e8: 0xe50f, 0xf6e9: 0xe510, 0xf6ea: 0xe511, 0xf6eb: 0xe512, 0xf6ec: 0xe513, 0xf6ed: 0xe514,
			0xf6ee: 0xe515, 0xf6ef: 0xe516, 0xf6f0: 0xe517, 0xf6f1: 0xe518, 0xf6f2: 0xe519, 0xf6f3: 0xe51a, 0xf6f4: 0xe51b, 0xf6f5: 0xe51c,
			0xf6f6: 0xe51d, 0xf6f7: 0xe51e, 0xf6f8: 0xe51f, 0xf6f9: 0xe520, 0xf6fa: 0xe521, 0xf6fb: 0xe522, 0xf6fc: 0xe523, 0xf740: 0xe524,
			0xf741: 0xe525, 0xf742: 0xe526, 0xf743: 0xe527, 0xf744: 0xe528, 0xf745: 0xe529, 0xf746: 0xe52a, 0xf747: 0xe52b, 0xf748: 0xe52c,
			0xf749: 0xe52d, 0xf74a: 0xe52e, 0xf74b: 0xe52f, 0xf74c: 0xe530, 0xf74d: 0xe531, 0xf74e: 0xe532, 0xf74f: 0xe533, 0xf750: 0xe534,
			0xf751: 0xe535, 0xf752: 0xe536, 0xf753: 0xe537, 0xf754: 0xe538, 0xf755: 0xe539, 0xf756: 0xe53a, 0xf757: 0xe53b, 0xf758: 0xe53c,
			0xf759: 0xe53d, 0xf75a: 0xe53e, 0xf75b: 0xe53f, 0xf75c: 0xe540, 0xf75d: 0xe541, 0xf75e: 0xe542, 0xf75f: 0xe543, 0xf760: 0xe544,
			0xf761: 0xe545, 0xf762: 0xe546, 0xf763: 0xe547, 0xf764: 0xe548, 0xf765: 0xe549, 0xf766: 0xe54a, 0xf767: 0xe54b, 0xf768: 0xe54c,
			0xf769: 0xe54d, 0xf76a: 0xe54e, 0xf76b: 0xe54f, 0xf76c: 0xe550, 0xf76d: 0xe551, 0xf76e: 0xe552, 0xf76f: 0xe553, 0xf770: 0xe554,
			0xf771: 0xe555, 0xf772: 0xe556, 0xf773: 0xe557, 0xf774: 0xe558, 0xf775: 0xe559, 0xf776: 0xe55a, 0xf777: 0xe55b, 0xf778: 0xe55c,
			0xf779: 0xe55d, 0xf77a: 0xe55e, 0xf77b: 0xe55f, 0xf77c: 0xe560, 0xf77d: 0xe561, 0xf77e: 0xe562, 0xf780: 0xe563, 0xf781: 0xe564,
			0xf782: 0xe565, 0xf783: 0xe566, 0xf784: 0xe567, 0xf785: 0xe568, 0xf786: 0xe569, 0xf787: 0xe56a, 0xf788: 0xe56b, 0xf789: 0xe56c,
			0xf78a: 0xe56d, 0xf78b: 0xe56e, 0xf78c: 0xe56f, 0xf78d: 0xe570, 0xf78e: 0xe571, 0xf78f: 0xe572, 0xf790: 0xe573, 0xf791: 0xe574,
			0xf792: 0xe575, 0xf793: 0xe576, 0xf794: 0xe577, 0xf795: 0xe578, 0xf796: 0xe579, 0xf797: 0xe57a, 0xf798: 0xe57b, 0xf799: 0xe57c,
			0xf79a: 0xe57d, 0xf79b: 0xe57e, 0xf79c: 0xe57f, 0xf79d: 0xe580, 0xf79e: 0xe581, 0xf79f: 0xe582, 0xf7a0: 0xe583, 0xf7a1: 0xe584,
			0xf7a2: 0xe585, 0xf7a3: 0xe586, 0xf7a4: 0xe587, 0xf7a5: 0xe588, 0xf7a6: 0xe589, 0xf7a7: 0xe58a, 0xf7a8: 0xe58b, 0xf7a9: 0xe58c,
			0xf7aa: 0xe58d, 0xf7ab: 0xe58e, 0xf7ac: 0xe58f, 0xf7ad: 0xe590, 0xf7ae: 0xe591, 0xf7af: 0xe592, 0xf7b0: 0xe593, 0xf7b1: 0xe594,
			0xf7b2: 0xe595, 0xf7b3: 0xe596, 0xf7b4: 0xe597, 0xf7b5: 0xe598, 0xf7b6: 0xe599, 0xf7b7: 0xe59a, 0xf7b8: 0xe59b, 0xf7b9: 0xe59c,
			0xf7ba: 0xe59d, 0xf7bb: 0xe59e, 0xf7bc: 0xe59f, 0xf7bd: 0xe5a0, 0xf7be: 0xe5a1, 0xf7bf: 0xe5a2, 0xf7c0: 0xe5a3, 0xf7c1: 0xe5a4,
			0xf7c2: 0xe5a5, 0xf7c3: 0xe5a6, 0xf7c4: 0xe5a7, 0xf7c5: 0xe5a8, 0xf7c6: 0xe5a9, 0xf7c7: 0xe5aa, 0xf7c8: 0xe5ab, 0xf7c9: 0xe5ac,
			0xf7ca: 0xe5ad, 0xf7cb: 0xe5ae, 0xf7cc: 0xe5af, 0xf7cd: 0xe5b0, 0xf7ce: 0xe5b1, 0xf7cf: 0xe5b2, 0xf7d0: 0xe5b3, 0xf7d1: 0xe5b4,
			0xf7d2: 0xe5b5, 0xf7d3: 0xe5b6, 0xf7d4: 0xe5b7, 0xf7d5: 0xe5b8, 0xf7d6: 0xe5b9, 0xf7d7: 0xe5ba, 0xf7d8: 0xe5bb, 0xf7d9: 0xe5bc,
			0xf7da: 0xe5bd, 0xf7db: 0xe5be, 0xf7dc: 0xe5bf, 0xf7dd: 0xe5c0, 0xf7de: 0xe5c1, 0xf7df: 0xe5c2, 0xf7e0: 0xe5c3, 0xf7e1: 0xe5c4,
			0xf7e2: 0xe5c5, 0xf7e3: 0xe5c6, 0xf7e4: 0xe5c7, 0xf7e5: 0xe5c8, 0xf7e6: 0xe5c9, 0xf7e7: 0xe5ca, 0xf7e8: 0xe5cb, 0xf7e9: 0xe5cc,
			0xf7ea: 0xe5cd, 0xf7eb: 0xe5ce, 0xf7ec: 0xe5cf, 0xf7ed: 0xe5d0, 0xf7ee: 0xe5d1, 0xf7ef: 0xe5d2, 0xf7f0: 0xe5d3, 0xf7f1: 0xe5d4,
			0xf7f2: 0xe5d5, 0xf7f3: 0xe5d6, 0xf7f4: 0xe5d7, 0xf7f5: 0xe5d8, 0xf7f6: 0xe5d9, 0xf7f7: 0xe5da, 0xf7f8: 0xe5db, 0xf7f9: 0xe5dc,
			0xf7fa: 0xe5dd, 0xf7fb: 0xe5de, 0xf7fc: 0xe5df, 0xf840: 0xe5e0, 0xf841: 0xe5e1, 0xf842: 0xe5e2, 0xf843: 0xe5e3, 0xf844: 0xe5e4,
			0xf845: 0xe5e5, 0xf846: 0xe5e6, 0xf847: 0xe5e7, 0xf848: 0xe5e8, 0xf849: 0xe5e9, 0xf84a: 0xe5ea, 0xf84b: 0xe5eb, 0xf84c: 0xe5ec,
			0xf84d: 0xe5ed, 0xf84e: 0xe5ee, 0xf84f: 0xe5ef, 0xf850: 0xe5f0, 0xf851: 0xe5f1, 0xf852: 0xe5f2, 0xf853: 0xe5f3, 0xf854: 0xe5f4,
			0xf855: 0xe5f5, 0xf856: 0xe5f6, 0xf857: 0xe5f7, 0xf858: 0xe5f8, 0xf859: 0xe5f9, 0xf85a: 0xe5fa, 0xf85b: 0xe5fb, 0xf85c: 0xe5fc,
			0xf85d: 0xe5fd, 0xf85e: 0xe5fe, 0xf85f: 0xe5ff, 0xf860: 0xe600, 0xf861: 0xe601, 0xf862: 0xe602, 0xf863: 0xe603, 0xf864: 0xe604,
			0xf865: 0xe605, 0xf866: 0xe606, 0xf867: 0xe607, 0xf868: 0xe608, 0xf869: 0xe609, 0xf86a: 0xe60a, 0xf86b: 0xe60b, 0xf86c: 0xe60c,
			0xf86d: 0xe60d, 0xf86e: 0xe60e, 0xf86f: 0xe60f, 0xf870: 0xe610, 0xf871: 0xe611, 0xf872: 0xe612, 0xf873: 0xe613, 0xf874: 0xe614,
			0xf875: 0xe615, 0xf876: 0xe616, 0xf877: 0xe617, 0xf878: 0xe618, 0xf879: 0xe619, 0xf87a: 0xe61a, 0xf87b: 0xe61b, 0xf87c: 0xe61c,
			0xf87d: 0xe61d, 0xf87e: 0xe61e, 0xf880: 0xe61f, 0xf881: 0xe620, 0xf882: 0xe621, 0xf883: 0xe622, 0xf884: 0xe623, 0xf885: 0xe624,
			0xf886: 0xe625, 0xf887: 0xe626, 0xf888: 0xe627, 0xf889: 0xe628, 0xf88a: 0xe629, 0xf88b: 0xe62a, 0xf88c: 0xe62b, 0xf88d: 0xe62c,
			0xf88e: 0xe62d, 0xf88f: 0xe62e, 0xf890: 0xe62f, 0xf891: 0xe630, 0xf892: 0xe631, 0xf893: 0xe632, 0xf894: 0xe633, 0xf895: 0xe634,
			0xf896: 0xe635, 0xf897: 0xe636, 0xf898: 0xe637, 0xf899: 0xe638, 0xf89a: 0xe639, 0xf89b: 0xe63a, 0xf89c: 0xe63b, 0xf89d: 0xe63c,
			0xf89e: 0xe63d, 0xf89f: 0xe63e, 0xf8a0: 0xe63f, 0xf8a1: 0xe640, 0xf8a2: 0xe641, 0xf8a3: 0xe642, 0xf8a4: 0xe643, 0xf8a5: 0xe644,
			0xf8a6: 0xe645, 0xf8a7: 0xe646, 0xf8a8: 0xe647, 0xf8a9: 0xe648, 0xf8aa: 0xe649, 0xf8ab: 0xe64a, 0xf8ac: 0xe64b, 0xf8ad: 0xe64c,
			0xf8ae: 0xe64d, 0xf8af: 0xe64e, 0xf8b0: 0xe64f, 0xf8b1: 0xe650, 0xf8b2: 0xe651, 0xf8b3: 0xe652, 0xf8b4: 0xe653, 0xf8b5: 0xe654,
			0xf8b6: 0xe655, 0xf8b7: 0xe656, 0xf8b8: 0xe657, 0xf8b9: 0xe658, 0xf8ba: 0xe659, 0xf8bb: 0xe65a, 0xf8bc: 0xe65b, 0xf8bd: 0xe65c,
			0xf8be: 0xe65d, 0xf8bf: 0xe65e, 0xf8c0: 0xe65f, 0xf8c1: 0xe660, 0xf8c2: 0xe661, 0xf8c3: 0xe662, 0xf8c4: 0xe663, 0xf8c5: 0xe664,
			0xf8c6: 0xe665, 0xf8c7: 0xe666, 0xf8c8: 0xe667, 0xf8c9: 0xe668, 0xf8ca: 0xe669, 0xf8cb: 0xe66a, 0xf8cc: 0xe66b, 0xf8cd: 0xe66c,
			0xf8ce: 0xe66d, 0xf8cf: 0xe66e, 0xf8d0: 0xe66f, 0xf8d1: 0xe670, 0xf8d2: 0xe671, 0xf8d3: 0xe672, 0xf8d4: 0xe673, 0xf8d5: 0xe674,
			0xf8d6: 0xe675, 0xf8d7: 0xe676, 0xf8d8: 0xe677, 0xf8d9: 0xe678, 0xf8da: 0xe679, 0xf8db: 0xe67a, 0xf8dc: 0xe67b, 0xf8dd: 0xe67c,
			0xf8de: 0xe67d, 0xf8df: 0xe67e, 0xf8e0: 0xe67f, 0xf8e1: 0xe680, 0xf8e2: 0xe681, 0xf8e3: 0xe682, 0xf8e4: 0xe683, 0xf8e5: 0xe684,
			0xf8e6: 0xe685, 0xf8e7: 0xe686, 0xf8e8: 0xe687, 0xf8e9: 0xe688, 0xf8ea: 0xe689, 0xf8eb: 0xe68a, 0xf8ec: 0xe68b, 0xf8ed: 0xe68c,
			0xf8ee: 0xe68d, 0xf8ef: 0xe68e, 0xf8f0: 0xe68f, 0xf8f1: 0xe690, 0xf8f2: 0xe691, 0xf8f3: 0xe692, 0xf8f4: 0xe693, 0xf8f5: 0xe694,
			0xf8f6: 0xe695, 0xf8f7: 0xe696, 0xf8f8: 0xe697, 0xf8f9: 0xe698, 0xf8fa: 0xe699, 0xf8fb: 0xe69a, 0xf8fc: 0xe69b, 0xf940: 0xe69c,
			0xf941: 0xe69d, 0xf942: 0xe69e, 0xf943: 0xe69f, 0xf944: 0xe6a0, 0xf945: 0xe6a1, 0xf946: 0xe6a2, 0xf947: 0xe6a3, 0xf948: 0xe6a4,
			0xf949: 0xe6a5, 0xf94a: 0xe6a6, 0xf94b: 0xe6a7, 0xf94c: 0xe6a8, 0xf94d: 0xe6a9, 0xf94e: 0xe6aa, 0xf94f: 0xe6ab, 0xf950: 0xe6ac,
			0xf951: 0xe6ad, 0xf952: 0xe6ae, 0xf953: 0xe6af, 0xf954: 0xe6b0, 0xf955: 0xe6b1, 0xf956: 0xe6b2, 0xf957: 0xe6b3, 0xf958: 0xe6b4,
			0xf959: 0xe6b5, 0xf95a: 0xe6b6, 0xf95b: 0xe6b7, 0xf95c: 0xe6b8, 0xf95d: 0xe6b9, 0xf95e: 0xe6ba, 0xf95f: 0xe6bb, 0xf960: 0xe6bc,
			0xf961: 0xe6bd, 0xf962: 0xe6be, 0xf963: 0xe6bf, 0xf964: 0xe6c0, 0xf965: 0xe6c1, 0xf966: 0xe6c2, 0xf967: 0xe6c3, 0xf968: 0xe6c4,
			0xf969: 0xe6c5, 0xf96a: 0xe6c6, 0xf96b: 0xe6c7, 0xf96c: 0xe6c8, 0xf96d: 0xe6c9, 0xf96e: 0xe6ca, 0xf96f: 0xe6cb, 0xf970: 0xe6cc,
			0xf971: 0xe6cd, 0xf972: 0xe6ce, 0xf973: 0xe6cf, 0xf974: 0xe6d0, 0xf975: 0xe6d1, 0xf976: 0xe6d2, 0xf977: 0xe6d3, 0xf978: 0xe6d4,
			0xf979: 0xe6d5, 0xf97a: 0xe6d6, 0xf97b: 0xe6d7, 0xf97c: 0xe6d8, 0xf97d: 0xe6d9, 0xf97e: 0xe6da, 0xf980: 0xe6db, 0xf981: 0xe6dc,
			0xf982: 0xe6dd, 0xf983: 0xe6de, 0xf984: 0xe6df, 0xf985: 0xe6e0, 0xf986: 0xe6e1, 0xf987: 0xe6e2, 0xf988: 0xe6e3, 0xf989: 0xe6e4,
			0xf98a: 0xe6e5, 0xf98b: 0xe6e6, 0xf98c: 0xe6e7, 0xf98d: 0xe6e8, 0xf98e: 0xe6e9, 0xf98f: 0xe6ea, 0xf990: 0xe6eb, 0xf991: 0xe6ec,
			0xf992: 0xe6ed, 0xf993: 0xe6ee, 0xf994: 0xe6ef, 0xf995: 0xe6f0, 0xf996: 0xe6f1, 0xf997: 0xe6f2, 0xf998: 0xe6f3, 0xf999: 0xe6f4,
			0xf99a: 0xe6f5, 0xf99b: 0xe6f6, 0xf99c: 0xe6f7, 0xf99d: 0xe6f8, 0xf99e: 0xe6f9, 0xf99f: 0xe6fa, 0xf9a0: 0xe6fb, 0xf9a1: 0xe6fc,
			0xf9a2: 0xe6fd, 0xf9a3: 0xe6fe, 0xf9a4: 0xe6ff, 0xf9a5: 0xe700, 0xf9a6: 0xe701, 0xf9a7: 0xe702, 0xf9a8: 0xe703, 0xf9a9: 0xe704,
			0xf9aa: 0xe705, 0xf9ab: 0xe706, 0xf9ac: 0xe707, 0xf9ad: 0xe708, 0xf9ae: 0xe709, 0xf9af: 0xe70a, 0xf9b0: 0xe70b, 0xf9b1: 0xe70c,
			0xf9b2: 0xe70d, 0xf9b3: 0xe70e, 0xf9b4: 0xe70f, 0xf9b5: 0xe710, 0xf9b6: 0xe711, 0xf9b7: 0xe712, 0xf9b8: 0xe713, 0xf9b9: 0xe714,
			0xf9ba: 0xe715, 0xf9bb: 0xe716, 0xf9bc: 0xe717, 0xf9bd: 0xe718, 0xf9be: 0xe719, 0xf9bf: 0xe71a, 0xf9c0: 0xe71b, 0xf9c1: 0xe71c,
			0xf9c2: 0xe71d, 0xf9c3: 0xe71e, 0xf9c4: 0xe71f, 0xf9c5: 0xe720, 0xf9c6: 0xe721, 0xf9c7: 0xe722, 0xf9c8: 0xe723, 0xf9c9: 0xe724,
			0xf9ca: 0xe725, 0xf9cb: 0xe726, 0xf9cc: 0xe727, 0xf9cd: 0xe728, 0xf9ce: 0xe729, 0xf9cf: 0xe72a, 0xf9d0: 0xe72b, 0xf9d1: 0xe72c,
			0xf9d2: 0xe72d, 0xf9d3: 0xe72e, 0xf9d4: 0xe72f, 0xf9d5: 0xe730, 0xf9d6: 0xe731, 0xf9d7: 0xe732, 0xf9d8: 0xe733, 0xf9d9: 0xe734,
			0xf9da: 0xe735, 0xf9db: 0xe736, 0xf9dc: 0xe737, 0xf9dd: 0xe738, 0xf9de: 0xe739, 0xf9df: 0xe73a, 0xf9e0: 0xe73b, 0xf9e1: 0xe73c,
			0xf9e2: 0xe73d, 0xf9e3: 0xe73e, 0xf9e4: 0xe73f, 0xf9e5: 0xe740, 0xf9e6: 0xe741, 0xf9e7: 0xe742, 0xf9e8: 0xe743, 0xf9e9: 0xe744,
			0xf9ea: 0xe745, 0xf9eb: 0xe746, 0xf9ec: 0xe747, 0xf9ed: 0xe748, 0xf9ee: 0xe749, 0xf9ef: 0xe74a, 0xf9f0: 0xe74b, 0xf9f1: 0xe74c,
			0xf9f2: 0xe74d, 0xf9f3: 0xe74e, 0xf9f4: 0xe74f, 0xf9f5: 0xe750, 0xf9f6: 0xe751, 0xf9f7: 0xe752, 0xf9f8: 0xe753, 0xf9f9: 0xe754,
			0xf9fa: 0xe755, 0xf9fb: 0xe756, 0xf9fc: 0xe757, 0xfa40: 0x2170, 0xfa41: 0x2171, 0xfa42: 0x2172, 0xfa43: 0x2173, 0xfa44: 0x2174,
			0xfa45: 0x2175, 0xfa46: 0x2176, 0xfa47: 0x2177, 0xfa48: 0x2178, 0xfa49: 0x2179, 0xfa4a: 0x2160, 0xfa4b: 0x2161, 0xfa4c: 0x2162,
			0xfa4d: 0x2163, 0xfa4e: 0x2164, 0xfa4f: 0x2165, 0xfa50: 0x2166, 0xfa51: 0x2167, 0xfa52: 0x2168, 0xfa53: 0x2169, 0xfa54: 0xffe2,
			0xfa55: 0xffe4, 0xfa56: 0xff07, 0xfa57: 0xff02, 0xfa58: 0x3231, 0xfa59: 0x2116, 0xfa5a: 0x2121, 0xfa5b: 0x2235, 0xfa5c: 0x7e8a,
			0xfa5d: 0x891c, 0xfa5e: 0x9348, 0xfa5f: 0x9288, 0xfa60: 0x84dc, 0xfa61: 0x4fc9, 0xfa62: 0x70bb, 0xfa63: 0x6631, 0xfa64: 0x68c8,
			0xfa65: 0x92f9, 0xfa66: 0x66fb, 0xfa67: 0x5f45, 0xfa68: 0x4e28, 0xfa69: 0x4ee1, 0xfa6a: 0x4efc, 0xfa6b: 0x4f00, 0xfa6c: 0x4f03,
			0xfa6d: 0x4f39, 0xfa6e: 0x4f56, 0xfa6f: 0x4f92, 0xfa70: 0x4f8a, 0xfa71: 0x4f9a, 0xfa72: 0x4f94, 0xfa73: 0x4fcd, 0xfa74: 0x5040,
			0xfa75: 0x5022, 0xfa76: 0x4fff, 0xfa77: 0x501e, 0xfa78: 0x5046, 0xfa79: 0x5070, 0xfa7a: 0x5042, 0xfa7b: 0x5094, 0xfa7c: 0x50f4,
			0xfa7d: 0x50d8, 0xfa7e: 0x514a, 0xfa80: 0x5164, 0xfa81: 0x519d, 0xfa82: 0x51be, 0xfa83: 0x51ec, 0xfa84: 0x5215, 0xfa85: 0x529c,
			0xfa86: 0x52a6, 0xfa87: 0x52c0, 0xfa88: 0x52db, 0xfa89: 0x5300, 0xfa8a: 0x5307, 0xfa8b: 0x5324, 0xfa8c: 0x5372, 0xfa8d: 0x5393,
			0xfa8e: 0x53b2, 0xfa8f: 0x53dd, 0xfa90: 0xfa0e, 0xfa91: 0x549c, 0xfa92: 0x548a, 0xfa93: 0x54a9, 0xfa94: 0x54ff, 0xfa95: 0x5586,
			0xfa96: 0x5759, 0xfa97: 0x5765, 0xfa98: 0x57ac, 0xfa99: 0x57c8, 0xfa9a: 0x57c7, 0xfa9b: 0xfa0f, 0xfa9c: 0xfa10, 0xfa9d: 0x589e,
			0xfa9e: 0x58b2, 0xfa9f: 0x590b, 0xfaa0: 0x5953, 0xfaa1: 0x595b, 0xfaa2: 0x595d, 0xfaa3: 0x5963, 0xfaa4: 0x59a4, 0xfaa5: 0x59ba,
			0xfaa6: 0x5b56, 0xfaa7: 0x5bc0, 0xfaa8: 0x752f, 0xfaa9: 0x5bd8, 0xfaaa: 0x5bec, 0xfaab: 0x5c1e, 0xfaac: 0x5ca6, 0xfaad: 0x5cba,
			0xfaae: 0x5cf5, 0xfaaf: 0x5d27, 0xfab0: 0x5d53, 0xfab1: 0xfa11, 0xfab2: 0x5d42, 0xfab3: 0x5d6d, 0xfab4: 0x5db8, 0xfab5: 0x5db9,
			0xfab6: 0x5dd0, 0xfab7: 0x5f21, 0xfab8: 0x5f34, 0xfab9: 0x5f67, 0xfaba: 0x5fb7, 0xfabb: 0x5fde, 0xfabc: 0x605d, 0xfabd: 0x6085,
			0xfabe: 0x608a, 0xfabf: 0x60de, 0xfac0: 0x60d5, 0xfac1: 0x6120, 0xfac2: 0x60f2, 0xfac3: 0x6111, 0xfac4: 0x6137, 0xfac5: 0x6130,
			0xfac6: 0x6198, 0xfac7: 0x6213, 0xfac8: 0x62a6, 0xfac9: 0x63f5, 0xfaca: 0x6460, 0xfacb: 0x649d, 0xfacc: 0x64ce, 0xfacd: 0x654e,
			0xface: 0x6600, 0xfacf: 0x6615, 0xfad0: 0x663b, 0xfad1: 0x6609, 0xfad2: 0x662e, 0xfad3: 0x661e, 0xfad4: 0x6624, 0xfad5: 0x6665,
			0xfad6: 0x6657, 0xfad7: 0x6659, 0xfad8: 0xfa12, 0xfad9: 0x6673, 0xfada: 0x6699, 0xfadb: 0x66a0, 0xfadc: 0x66b2, 0xfadd: 0x66bf,
			0xfade: 0x66fa, 0xfadf: 0x670e, 0xfae0: 0xf929, 0xfae1: 0x6766, 0xfae2: 0x67bb, 0xfae3: 0x6852, 0xfae4: 0x67c0, 0xfae5: 0x6801,
			0xfae6: 0x6844, 0xfae7: 0x68cf, 0xfae8: 0xfa13, 0xfae9: 0x6968, 0xfaea: 0xfa14, 0xfaeb: 0x6998, 0xfaec: 0x69e2, 0xfaed: 0x6a30,
			0xfaee: 0x6a6b, 0xfaef: 0x6a46, 0xfaf0: 0x6a73, 0xfaf1: 0x6a7e, 0xfaf2: 0x6ae2, 0xfaf3: 0x6ae4, 0xfaf4: 0x6bd6, 0xfaf5: 0x6c3f,
			0xfaf6: 0x6c5c, 0xfaf7: 0x6c86, 0xfaf8: 0x6c6f, 0xfaf9: 0x6cda, 0xfafa: 0x6d04, 0xfafb: 0x6d87, 0xfafc: 0x6d6f, 0xfb40: 0x6d96,
			0xfb41: 0x6dac, 0xfb42: 0x6dcf, 0xfb43: 0x6df8, 0xfb44: 0x6df2, 0xfb45: 0x6dfc, 0xfb46: 0x6e39, 0xfb47: 0x6e5c, 0xfb48: 0x6e27,
			0xfb49: 0x6e3c, 0xfb4a: 0x6ebf, 0xfb4b: 0x6f88, 0xfb4c: 0x6fb5, 0xfb4d: 0x6ff5, 0xfb4e: 0x7005, 0xfb4f: 0x7007, 0xfb50: 0x7028,
			0xfb51: 0x7085, 0xfb52: 0x70ab, 0xfb53: 0x710f, 0xfb54: 0x7104, 0xfb55: 0x715c, 0xfb56: 0x7146, 0xfb57: 0x7147, 0xfb58: 0xfa15,
			0xfb59: 0x71c1, 0xfb5a: 0x71fe, 0xfb5b: 0x72b1, 0xfb5c: 0x72be, 0xfb5d: 0x7324, 0xfb5e: 0xfa16, 0xfb5f: 0x7377, 0xfb60: 0x73bd,
			0xfb61: 0x73c9, 0xfb62: 0x73d6, 0xfb63: 0x73e3, 0xfb64: 0x73d2, 0xfb65: 0x7407, 0xfb66: 0x73f5, 0xfb67: 0x7426, 0xfb68: 0x742a,
			0xfb69: 0x7429, 0xfb6a: 0x742e, 0xfb6b: 0x7462, 0xfb6c: 0x7489, 0xfb6d: 0x749f, 0xfb6e: 0x7501, 0xfb6f: 0x756f, 0xfb70: 0x7682,
			0xfb71: 0x769c, 0xfb72: 0x769e, 0xfb73: 0x769b, 0xfb74: 0x76a6, 0xfb75: 0xfa17, 0xfb76: 0x7746, 0xfb77: 0x52af, 0xfb78: 0x7821,
			0xfb79: 0x784e, 0xfb7a: 0x7864, 0xfb7b: 0x787a, 0xfb7c: 0x7930, 0xfb7d: 0xfa18, 0xfb7e: 0xfa19, 0xfb80: 0xfa1a, 0xfb81: 0x7994,
			0xfb82: 0xfa1b, 0xfb83: 0x799b, 0xfb84: 0x7ad1, 0xfb85: 0x7ae7, 0xfb86: 0xfa1c, 0xfb87: 0x7aeb, 0xfb88: 0x7b9e, 0xfb89: 0xfa1d,
			0xfb8a: 0x7d48, 0xfb8b: 0x7d5c, 0xfb8c: 0x7db7, 0xfb8d: 0x7da0, 0xfb8e: 0x7dd6, 0xfb8f: 0x7e52, 0xfb90: 0x7f47, 0xfb91: 0x7fa1,
			0xfb92: 0xfa1e, 0xfb93: 0x8301, 0xfb94: 0x8362, 0xfb95: 0x837f, 0xfb96: 0x83c7, 0xfb97: 0x83f6, 0xfb98: 0x8448, 0xfb99: 0x84b4,
			0xfb9a: 0x8553, 0xfb9b: 0x8559, 0xfb9c: 0x856b, 0xfb9d: 0xfa1f, 0xfb9e: 0x85b0, 0xfb9f: 0xfa20, 0xfba0: 0xfa21, 0xfba1: 0x8807,
			0xfba2: 0x88f5, 0xfba3: 0x8a12, 0xfba4: 0x8a37, 0xfba5: 0x8a79, 0xfba6: 0x8aa7, 0xfba7: 0x8abe, 0xfba8: 0x8adf, 0xfba9: 0xfa22,
			0xfbaa: 0x8af6, 0xfbab: 0x8b53, 0xfbac: 0x8b7f, 0xfbad: 0x8cf0, 0xfbae: 0x8cf4, 0xfbaf: 0x8d12, 0xfbb0: 0x8d76, 0xfbb1: 0xfa23,
			0xfbb2: 0x8ecf, 0xfbb3: 0xfa24, 0xfbb4: 0xfa25, 0xfbb5: 0x9067, 0xfbb6: 0x90de, 0xfbb7: 0xfa26, 0xfbb8: 0x9115, 0xfbb9: 0x9127,
			0xfbba: 0x91da, 0xfbbb: 0x91d7, 0xfbbc: 0x91de, 0xfbbd: 0x91ed, 0xfbbe: 0x91ee, 0xfbbf: 0x91e4, 0xfbc0: 0x91e5, 0xfbc1: 0x9206,
			0xfbc2: 0x9210, 0xfbc3: 0x920a, 0xfbc4: 0x923a, 0xfbc5: 0x9240, 0xfbc6: 0x923c, 0xfbc7: 0x924e, 0xfbc8: 0x9259, 0xfbc9: 0x9251,
			0xfbca: 0x9239, 0xfbcb: 0x9267, 0xfbcc: 0x92a7, 0xfbcd: 0x9277, 0xfbce: 0x9278, 0xfbcf: 0x92e7, 0xfbd0: 0x92d7, 0xfbd1: 0x92d9,
			0xfbd2: 0x92d0, 0xfbd3: 0xfa27, 0xfbd4: 0x92d5, 0xfbd5: 0x92e0, 0xfbd6: 0x92d3, 0xfbd7: 0x9325, 0xfbd8: 0x9321, 0xfbd9: 0x92fb,
			0xfbda: 0xfa28, 0xfbdb: 0x931e, 0xfbdc: 0x92ff, 0xfbdd: 0x931d, 0xfbde: 0x9302, 0xfbdf: 0x9370, 0xfbe0: 0x9357, 0xfbe1: 0x93a4,
			0xfbe2: 0x93c6, 0xfbe3: 0x93de, 0xfbe4: 0x93f8, 0xfbe5: 0x9431, 0xfbe6: 0x9445, 0xfbe7: 0x9448, 0xfbe8: 0x9592, 0xfbe9: 0xf9dc,
			0xfbea: 0xfa29, 0xfbeb: 0x969d, 0xfbec: 0x96af, 0xfbed: 0x9733, 0xfbee: 0x973b, 0xfbef: 0x9743, 0xfbf0: 0x974d, 0xfbf1: 0x974f,
			0xfbf2: 0x9751, 0xfbf3: 0x9755, 0xfbf4: 0x9857, 0xfbf5: 0x9865, 0xfbf6: 0xfa2a, 0xfbf7: 0xfa2b, 0xfbf8: 0x9927, 0xfbf9: 0xfa2c,
			0xfbfa: 0x999e, 0xfbfb: 0x9a4e, 0xfbfc: 0x9ad9, 0xfc40: 0x9adc, 0xfc41: 0x9b75, 0xfc42: 0x9b72, 0xfc43: 0x9b8f, 0xfc44: 0x9bb1,
			0xfc45: 0x9bbb, 0xfc46: 0x9c00, 0xfc47: 0x9d70, 0xfc48: 0x9d6b, 0xfc49: 0xfa2d, 0xfc4a: 0x9e19, 0xfc4b: 0x9ed1
		};

		const duplicate_map_array = [
			0x8790, 0x8791, 0x8792, 0x8795, 0x8796, 0x8797, 0x879a, 0x879b, 0x879c, 0xed40, 0xed41, 0xed42, 0xed43, 0xed44, 0xed45, 0xed46,
			0xed47, 0xed48, 0xed49, 0xed4a, 0xed4b, 0xed4c, 0xed4d, 0xed4e, 0xed4f, 0xed50, 0xed51, 0xed52, 0xed53, 0xed54, 0xed55, 0xed56,
			0xed57, 0xed58, 0xed59, 0xed5a, 0xed5b, 0xed5c, 0xed5d, 0xed5e, 0xed5f, 0xed60, 0xed61, 0xed62, 0xed63, 0xed64, 0xed65, 0xed66,
			0xed67, 0xed68, 0xed69, 0xed6a, 0xed6b, 0xed6c, 0xed6d, 0xed6e, 0xed6f, 0xed70, 0xed71, 0xed72, 0xed73, 0xed74, 0xed75, 0xed76,
			0xed77, 0xed78, 0xed79, 0xed7a, 0xed7b, 0xed7c, 0xed7d, 0xed7e, 0xed80, 0xed81, 0xed82, 0xed83, 0xed84, 0xed85, 0xed86, 0xed87,
			0xed88, 0xed89, 0xed8a, 0xed8b, 0xed8c, 0xed8d, 0xed8e, 0xed8f, 0xed90, 0xed91, 0xed92, 0xed93, 0xed94, 0xed95, 0xed96, 0xed97,
			0xed98, 0xed99, 0xed9a, 0xed9b, 0xed9c, 0xed9d, 0xed9e, 0xed9f, 0xeda0, 0xeda1, 0xeda2, 0xeda3, 0xeda4, 0xeda5, 0xeda6, 0xeda7,
			0xeda8, 0xeda9, 0xedaa, 0xedab, 0xedac, 0xedad, 0xedae, 0xedaf, 0xedb0, 0xedb1, 0xedb2, 0xedb3, 0xedb4, 0xedb5, 0xedb6, 0xedb7,
			0xedb8, 0xedb9, 0xedba, 0xedbb, 0xedbc, 0xedbd, 0xedbe, 0xedbf, 0xedc0, 0xedc1, 0xedc2, 0xedc3, 0xedc4, 0xedc5, 0xedc6, 0xedc7,
			0xedc8, 0xedc9, 0xedca, 0xedcb, 0xedcc, 0xedcd, 0xedce, 0xedcf, 0xedd0, 0xedd1, 0xedd2, 0xedd3, 0xedd4, 0xedd5, 0xedd6, 0xedd7,
			0xedd8, 0xedd9, 0xedda, 0xeddb, 0xeddc, 0xeddd, 0xedde, 0xeddf, 0xede0, 0xede1, 0xede2, 0xede3, 0xede4, 0xede5, 0xede6, 0xede7,
			0xede8, 0xede9, 0xedea, 0xedeb, 0xedec, 0xeded, 0xedee, 0xedef, 0xedf0, 0xedf1, 0xedf2, 0xedf3, 0xedf4, 0xedf5, 0xedf6, 0xedf7,
			0xedf8, 0xedf9, 0xedfa, 0xedfb, 0xedfc, 0xee40, 0xee41, 0xee42, 0xee43, 0xee44, 0xee45, 0xee46, 0xee47, 0xee48, 0xee49, 0xee4a,
			0xee4b, 0xee4c, 0xee4d, 0xee4e, 0xee4f, 0xee50, 0xee51, 0xee52, 0xee53, 0xee54, 0xee55, 0xee56, 0xee57, 0xee58, 0xee59, 0xee5a,
			0xee5b, 0xee5c, 0xee5d, 0xee5e, 0xee5f, 0xee60, 0xee61, 0xee62, 0xee63, 0xee64, 0xee65, 0xee66, 0xee67, 0xee68, 0xee69, 0xee6a,
			0xee6b, 0xee6c, 0xee6d, 0xee6e, 0xee6f, 0xee70, 0xee71, 0xee72, 0xee73, 0xee74, 0xee75, 0xee76, 0xee77, 0xee78, 0xee79, 0xee7a,
			0xee7b, 0xee7c, 0xee7d, 0xee7e, 0xee80, 0xee81, 0xee82, 0xee83, 0xee84, 0xee85, 0xee86, 0xee87, 0xee88, 0xee89, 0xee8a, 0xee8b,
			0xee8c, 0xee8d, 0xee8e, 0xee8f, 0xee90, 0xee91, 0xee92, 0xee93, 0xee94, 0xee95, 0xee96, 0xee97, 0xee98, 0xee99, 0xee9a, 0xee9b,
			0xee9c, 0xee9d, 0xee9e, 0xee9f, 0xeea0, 0xeea1, 0xeea2, 0xeea3, 0xeea4, 0xeea5, 0xeea6, 0xeea7, 0xeea8, 0xeea9, 0xeeaa, 0xeeab,
			0xeeac, 0xeead, 0xeeae, 0xeeaf, 0xeeb0, 0xeeb1, 0xeeb2, 0xeeb3, 0xeeb4, 0xeeb5, 0xeeb6, 0xeeb7, 0xeeb8, 0xeeb9, 0xeeba, 0xeebb,
			0xeebc, 0xeebd, 0xeebe, 0xeebf, 0xeec0, 0xeec1, 0xeec2, 0xeec3, 0xeec4, 0xeec5, 0xeec6, 0xeec7, 0xeec8, 0xeec9, 0xeeca, 0xeecb,
			0xeecc, 0xeecd, 0xeece, 0xeecf, 0xeed0, 0xeed1, 0xeed2, 0xeed3, 0xeed4, 0xeed5, 0xeed6, 0xeed7, 0xeed8, 0xeed9, 0xeeda, 0xeedb,
			0xeedc, 0xeedd, 0xeede, 0xeedf, 0xeee0, 0xeee1, 0xeee2, 0xeee3, 0xeee4, 0xeee5, 0xeee6, 0xeee7, 0xeee8, 0xeee9, 0xeeea, 0xeeeb,
			0xeeec, 0xeeef, 0xeef0, 0xeef1, 0xeef2, 0xeef3, 0xeef4, 0xeef5, 0xeef6, 0xeef7, 0xeef8, 0xeef9, 0xeefa, 0xeefb, 0xeefc, 0xfa4a,
			0xfa4b, 0xfa4c, 0xfa4d, 0xfa4e, 0xfa4f, 0xfa50, 0xfa51, 0xfa52, 0xfa53, 0xfa54, 0xfa58, 0xfa59, 0xfa5a, 0xfa5b
		];

		const duplicate_map = {};
		const unicode_to_cp932_map = {};

		for(const key in duplicate_map_array) {
			duplicate_map[duplicate_map_array[key]] = 1;
		}
		for(const key in cp932_to_unicode_map) {
			// 重複登録された文字
			// IBM拡張文字 と NEC特殊文字 と NEC選定IBM拡張文字 で
			// マッピング先が一部重複している。
			// WideCharToMultiByte の仕様に基づき、登録しない。
			if(duplicate_map[key]) {
				continue;
			}
			const x = cp932_to_unicode_map[key];
			unicode_to_cp932_map[x] = key;
		}

		CP932MAP.cp932_to_unicode_map = cp932_to_unicode_map;
		CP932MAP.unicode_to_cp932_map = unicode_to_cp932_map;
	}

	static get CP932_TO_UNICODE() {
		CP932MAP.init();
		return CP932MAP.cp932_to_unicode_map;
	}
	
	static get UNICODE_TO_CP932() {
		CP932MAP.init();
		return CP932MAP.unicode_to_cp932_map;
	}
}

CP932MAP.is_initmap = false;
CP932MAP.cp932_to_unicode_map = null;
CP932MAP.unicode_to_cp932_map = null;

class CP932 {
	
	/**
	 * 文字列をCP932の配列へ変換します。
	 * @param {String} 変換したいテキスト
	 * @returns {Array} CP932のデータが入った配列
	 */
	static toCP932Array(text) {
		const map = CP932MAP.UNICODE_TO_CP932;
		const utf32 = Unicode.toUTF32Array(text);
		const cp932 = [];
		const ng = "・".charCodeAt(0);
		for(let i = 0; i < utf32.length; i++) {
			const map_bin = map[utf32[i]];
			if(map_bin) {
				cp932.push(map_bin);
			}
			else {
				cp932.push(ng);
			}
		}
		return cp932;
	}

	/**
	 * 文字列をCP932のバイナリ配列へ変換します。
	 * @param {String} 変換したいテキスト
	 * @returns {Array} CP932のデータが入ったバイナリ配列
	 */
	static toCP932ArrayBinary(text) {
		const cp932 = CP932.toCP932Array(text);
		const cp932bin = [];
		for(let i = 0; i < cp932.length; i++) {
			if(cp932[i] < 0x100) {
				cp932bin.push(cp932[i]);
			}
			else {
				cp932bin.push(cp932[i] >> 8);
				cp932bin.push(cp932[i] & 0xFF);
			}

		}
		return cp932bin;
	}

	/**
	 * CP932の配列から文字列へ戻します。
	 * @param {Array} cp932 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static fromCP932Array(cp932) {
		const map = CP932MAP.CP932_TO_UNICODE;
		const utf16 = [];
		const ng = "・".charCodeAt(0);
		for(let i = 0; i < cp932.length; i++) {
			let x = cp932[i];
			let y = -1;
			if(x >= 0x100) {
				// すでに1つの変数にまとめられている
				y = map[x];
			}
			else {
				// 2バイト文字かのチェック
				if( ((0x81 <= x) && (x <= 0x9F)) || ((0xE0 <= x) && (x <= 0xFC)) ) {
					x <<= 8;
					i++;
					x |= cp932[i];
					y = map[x];
				}
				else {
					y = map[x];
				}
			}
			if(y) {
				utf16.push(y);
			}
			else {
				utf16.push(ng);
			}
		}
		return Unicode.fromUTF16Array(utf16);
	}

	/**
	 * 指定したテキストの横幅をCP932の換算で計算します。
	 * つまり半角を1、全角を2としてカウントします。
	 * なお、CP932の範囲にない文字は2としてカウントします。
	 * @param {String} text カウントしたいテキスト
	 * @returns {Number} 文字の横幅
	 */
	static getWidthForCP932(text) {
		return CP932.toCP932ArrayBinary(text).length;
	}

	/**
	 * 指定したテキストの横幅をCP932の換算した場合に、
	 * 単位は見た目の位置となります。
	 * @param {String} text 切り出したいテキスト
	 * @param {Number} offset 切り出し位置
	 * @param {Number} size 切り出す長さ
	 * @returns {String} 切り出したテキスト
	 */
	static cutTextForCP932(text, offset, size) {
		const cp932bin = CP932.toCP932ArrayBinary(text);
		const cut = [];
		const SPACE = 0x20 ; // ' '

		if(offset > 0) {
			// offset が1文字以降の場合、
			// その位置が、2バイト文字の途中かどうか判定が必要である。
			// そのため、1つ前の文字をしらべる。
			// もし2バイト文字であれば、1バイト飛ばす。
			const x = cp932bin[offset - 1];
			if( ((0x81 <= x) && (x <= 0x9F)) || ((0xE0 <= x) && (x <= 0xFC)) ) {
				cut.push(SPACE);
				offset++;
				size--;
			}
		}
		
		let is_2byte = false;

		for(let i = 0, point = offset; ((i < size) && (point < cp932bin.length)); i++, point++) {
			const x = cp932bin[point];
			if(!is_2byte && (((0x81 <= x) && (x <= 0x9F)) || ((0xE0 <= x) && (x <= 0xFC)))) {
				is_2byte = true;
			}
			else {
				is_2byte = false;
			}
			// 最後の文字が2バイト文字の1バイト目かどうかの判定
			if((i === size - 1) && is_2byte) {
				cut.push(SPACE);
			}
			else {
				cut.push(x);
			}
		}
		return CP932.fromCP932Array(cut);
	}

	/**
	 * 指定したコードポイントの文字はCP932上の外字かを判定する
	 * @param {Number} unicode_codepoint Unicodeのコードポイント
	 * @param {boolean} 判定結果 
	 */
	static isCP932Gaiji(unicode_codepoint) {
		const utf16_text = Unicode.fromUTF32Array([unicode_codepoint]);
		const sjis_array = CP932.toCP932Array(utf16_text);
		const x = sjis_array[0];
	}

	/**
	 * 指定したコードポイントの文字はCP932上のIBM拡張文字かを判定する
	 * @param {Number} unicode_codepoint Unicodeのコードポイント
	 * @param {boolean} 判定結果 
	 */
	static isCP932IBMExtendedCharacter(unicode_codepoint) {
		const utf16_text = Unicode.fromUTF32Array([unicode_codepoint]);
		const sjis_array = CP932.toCP932Array(utf16_text);
		const x = sjis_array[0];
		return (0xfa40 <= x) && (x <= 0xfc4b);
	}

	/**
	 * 指定したコードポイントの文字はCP932上のNEC選定IBM拡張文字かを判定する
	 * @param {Number} unicode_codepoint Unicodeのコードポイント
	 * @param {boolean} 判定結果 
	 */
	static isCP932NECSelectionIBMExtendedCharacter(unicode_codepoint) {
		const utf16_text = Unicode.fromUTF32Array([unicode_codepoint]);
		const sjis_array = CP932.toCP932Array(utf16_text);
		const x = sjis_array[0];
		return (0xed40 <= x) && (x <= 0xeefc);
	}

	/**
	 * 指定したコードポイントの文字はCP932上のNEC特殊文字かを判定する
	 * @param {Number} unicode_codepoint Unicodeのコードポイント
	 * @param {boolean} 判定結果 
	 */
	static isCP932NECSpecialCharacter(unicode_codepoint) {
		const utf16_text = Unicode.fromUTF32Array([unicode_codepoint]);
		const sjis_array = CP932.toCP932Array(utf16_text);
		const x = sjis_array[0];
		return (0x8740 <= x) && (x <= 0x879C);
	}


}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class Japanese {

	/**
	 * カタカナをひらがなにします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHiragana(text) {
		const func = function(ch) {
			return(String.fromCharCode(ch.charCodeAt(0) - 0x0060));
		};
		return (text.replace(/[\u30A1-\u30F6]/g, func));
	}

	/**
	 * ひらがなをカタカナにします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toKatakana(text) {
		const func = function(ch) {
			return(String.fromCharCode(ch.charCodeAt(0) + 0x0060));
		};
		return (text.replace(/[\u3041-\u3096]/g, func));
	}
	
	/**
	 * スペースを半角にします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidthSpace(text) {
		return (text.replace(/\u3000/g, String.fromCharCode(0x0020)));
	}
	
	/**
	 * スペースを全角にします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toFullWidthSpace(text) {
		return (text.replace(/\u0020/g, String.fromCharCode(0x3000)));
	}
	
	/**
	 * 英数記号を半角にします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidthAsciiCode(text) {
		let out = text;
		out = out.replace(/\u3000/g, "\u0020");				//全角スペース
		out = out.replace(/[\u2018-\u201B]/g, "\u0027");	//シングルクォーテーション
		out = out.replace(/[\u201C-\u201F]/g, "\u0022");	//ダブルクォーテーション
		const func = function(ch) {
			ch = ch.charCodeAt(0);
			return (String.fromCharCode(ch - 0xFEE0));
		};
		return (out.replace(/[\uFF01-\uFF5E]/g, func));
	}
	
	/**
	 * 英数記号を全角にします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toFullWidthAsciiCode(text) {
		let out = text;
		out = out.replace(/\u0020/g, "\u3000");	//全角スペース
		out = out.replace(/\u0022/g, "\u201D");	//ダブルクォーテーション
		out = out.replace(/\u0027/g, "\u2019");	//アポストロフィー
		const func = function(ch) {
			ch = ch.charCodeAt(0);
			return (String.fromCharCode(ch + 0xFEE0));
		};
		return (out.replace(/[\u0020-\u007E]/g, func));
	}
	
	/**
	 * 英語を半角にします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidthAlphabet(text) {
		const func = function(ch) {
			return (String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
		};
		return (text.replace(/[\uFF21-\uFF3A\uFF41-\uFF5A]/g, func));
	}
	
	/**
	 * 英語を全角にします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toFullWidthAlphabet(text) {
		const func = function(ch) {
			return (String.fromCharCode(ch.charCodeAt(0) + 0xFEE0));
		};
		return (text.replace(/[A-Za-z]/g, func));
	}
	
	/**
	 * 数値を半角にします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidthNumber(text) {
		const func = function(ch) {
			return(String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
		};
		return (text.replace(/[\uFF10-\uFF19]/g, func));
	}
	
	/**
	 * 数値を全角にします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toFullWidthNumber(text) {
		const func = function(ch) {
			return(String.fromCharCode(ch.charCodeAt(0) + 0xFEE0));
		};
		return (text.replace(/[0-9]/g, func));
	}
	
	/**
	 * カタカナを半角にします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidthKana(text) {
		const map = {
			0x3001	:	"\uFF64"	,	//	､
			0x3002	:	"\uFF61"	,	//	。	｡
			0x300C	:	"\uFF62"	,	//	「	｢
			0x300D	:	"\uFF63"	,	//	」	｣
			0x309B	:	"\uFF9E"	,	//	゛	ﾞ
			0x309C	:	"\uFF9F"	,	//	゜	ﾟ
			0x30A1	:	"\uFF67"	,	//	ァ	ｧ
			0x30A2	:	"\uFF71"	,	//	ア	ｱ
			0x30A3	:	"\uFF68"	,	//	ィ	ｨ
			0x30A4	:	"\uFF72"	,	//	イ	ｲ
			0x30A5	:	"\uFF69"	,	//	ゥ	ｩ
			0x30A6	:	"\uFF73"	,	//	ウ	ｳ
			0x30A7	:	"\uFF6A"	,	//	ェ	ｪ
			0x30A8	:	"\uFF74"	,	//	エ	ｴ
			0x30A9	:	"\uFF6B"	,	//	ォ	ｫ
			0x30AA	:	"\uFF75"	,	//	オ	ｵ
			0x30AB	:	"\uFF76"	,	//	カ	ｶ
			0x30AC	:	"\uFF76\uFF9E"	,	//	ガ	ｶﾞ
			0x30AD	:	"\uFF77"	,	//	キ	ｷ
			0x30AE	:	"\uFF77\uFF9E"	,	//	ギ	ｷﾞ
			0x30AF	:	"\uFF78"	,	//	ク	ｸ
			0x30B0	:	"\uFF78\uFF9E"	,	//	グ	ｸﾞ
			0x30B1	:	"\uFF79"	,	//	ケ	ｹ
			0x30B2	:	"\uFF79\uFF9E"	,	//	ゲ	ｹﾞ
			0x30B3	:	"\uFF7A"	,	//	コ	ｺ
			0x30B4	:	"\uFF7A\uFF9E"	,	//	ゴ	ｺﾞ
			0x30B5	:	"\uFF7B"	,	//	サ	ｻ
			0x30B6	:	"\uFF7B\uFF9E"	,	//	ザ	ｻﾞ
			0x30B7	:	"\uFF7C"	,	//	シ	ｼ
			0x30B8	:	"\uFF7C\uFF9E"	,	//	ジ	ｼﾞ
			0x30B9	:	"\uFF7D"	,	//	ス	ｽ
			0x30BA	:	"\uFF7D\uFF9E"	,	//	ズ	ｽﾞ
			0x30BB	:	"\uFF7E"	,	//	セ	ｾ
			0x30BC	:	"\uFF7E\uFF9E"	,	//	ゼ	ｾﾞ
			0x30BD	:	"\uFF7F"	,	//	ソ	ｿ
			0x30BE	:	"\uFF7F\uFF9E"	,	//	ゾ	ｿﾞ
			0x30BF	:	"\uFF80"	,	//	タ	ﾀ
			0x30C0	:	"\uFF80\uFF9E"	,	//	ダ	ﾀﾞ
			0x30C1	:	"\uFF81"	,	//	チ	ﾁ
			0x30C2	:	"\uFF81\uFF9E"	,	//	ヂ	ﾁﾞ
			0x30C3	:	"\uFF6F"	,	//	ッ	ｯ
			0x30C4	:	"\uFF82"	,	//	ツ	ﾂ
			0x30C5	:	"\uFF82\uFF9E"	,	//	ヅ	ﾂﾞ
			0x30C6	:	"\uFF83"	,	//	テ	ﾃ
			0x30C7	:	"\uFF83\uFF9E"	,	//	デ	ﾃﾞ
			0x30C8	:	"\uFF84"	,	//	ト	ﾄ
			0x30C9	:	"\uFF84\uFF9E"	,	//	ド	ﾄﾞ
			0x30CA	:	"\uFF85"	,	//	ナ	ﾅ
			0x30CB	:	"\uFF86"	,	//	ニ	ﾆ
			0x30CC	:	"\uFF87"	,	//	ヌ	ﾇ
			0x30CD	:	"\uFF88"	,	//	ネ	ﾈ
			0x30CE	:	"\uFF89"	,	//	ノ	ﾉ
			0x30CF	:	"\uFF8A"	,	//	ハ	ﾊ
			0x30D0	:	"\uFF8A\uFF9E"	,	//	バ	ﾊﾞ
			0x30D1	:	"\uFF8A\uFF9F"	,	//	パ	ﾊﾟ
			0x30D2	:	"\uFF8B"	,	//	ヒ	ﾋ
			0x30D3	:	"\uFF8B\uFF9E"	,	//	ビ	ﾋﾞ
			0x30D4	:	"\uFF8B\uFF9F"	,	//	ピ	ﾋﾟ
			0x30D5	:	"\uFF8C"	,	//	フ	ﾌ
			0x30D6	:	"\uFF8C\uFF9E"	,	//	ブ	ﾌﾞ
			0x30D7	:	"\uFF8C\uFF9F"	,	//	プ	ﾌﾟ
			0x30D8	:	"\uFF8D"	,	//	ヘ	ﾍ
			0x30D9	:	"\uFF8D\uFF9E"	,	//	ベ	ﾍﾞ
			0x30DA	:	"\uFF8D\uFF9F"	,	//	ペ	ﾍﾟ
			0x30DB	:	"\uFF8E"	,	//	ホ	ﾎ
			0x30DC	:	"\uFF8E\uFF9E"	,	//	ボ	ﾎﾞ
			0x30DD	:	"\uFF8E\uFF9F"	,	//	ポ	ﾎﾟ
			0x30DE	:	"\uFF8F"	,	//	マ	ﾏ
			0x30DF	:	"\uFF90"	,	//	ミ	ﾐ
			0x30E0	:	"\uFF91"	,	//	ム	ﾑ
			0x30E1	:	"\uFF92"	,	//	メ	ﾒ
			0x30E2	:	"\uFF93"	,	//	モ	ﾓ
			0x30E3	:	"\uFF6C"	,	//	ャ	ｬ
			0x30E4	:	"\uFF94"	,	//	ヤ	ﾔ
			0x30E5	:	"\uFF6D"	,	//	ュ	ｭ
			0x30E6	:	"\uFF95"	,	//	ユ	ﾕ
			0x30E7	:	"\uFF6E"	,	//	ョ	ｮ
			0x30E8	:	"\uFF96"	,	//	ヨ	ﾖ
			0x30E9	:	"\uFF97"	,	//	ラ	ﾗ
			0x30EA	:	"\uFF98"	,	//	リ	ﾘ
			0x30EB	:	"\uFF99"	,	//	ル	ﾙ
			0x30EC	:	"\uFF9A"	,	//	レ	ﾚ
			0x30ED	:	"\uFF9B"	,	//	ロ	ﾛ
			0x30EE	:	"\uFF9C"	,	//	ヮ	ﾜ
			0x30EF	:	"\uFF9C"	,	//	ワ	ﾜ
			0x30F0	:	"\uFF72"	,	//	ヰ	ｲ
			0x30F1	:	"\uFF74"	,	//	ヱ	ｴ
			0x30F2	:	"\uFF66"	,	//	ヲ	ｦ
			0x30F3	:	"\uFF9D"	,	//	ン	ﾝ
			0x30F4	:	"\uFF73\uFF9E"	,	//	ヴ	ｳﾞ
			0x30F5	:	"\uFF76"	,	//	ヵ	ｶ
			0x30F6	:	"\uFF79"	,	//	ヶ	ｹ
			0x30F7	:	"\uFF9C\uFF9E"	,	//	ヷ	ﾜﾞ
			0x30F8	:	"\uFF72\uFF9E"	,	//	ヸ	ｲﾞ
			0x30F9	:	"\uFF74\uFF9E"	,	//	ヹ	ｴﾞ
			0x30FA	:	"\uFF66\uFF9E"	,	//	ヺ	ｦﾞ
			0x30FB	:	"\uFF65"	,	//	・	･
			0x30FC	:	"\uFF70"		//	ー	ｰ
		};
		const func = function(ch) {
			if(ch.length === 1) {
				return(map[ch.charCodeAt(0)]);
			}
			else {
				return(map[ch.charCodeAt(0)] + map[ch.charCodeAt(1)]);
			}
		};
		return (text.replace(/[\u3001\u3002\u300C\u300D\u309B\u309C\u30A1-\u30FC][\u309B\u309C]?/g, func));
	}

	/**
	 * カタカナを全角にします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toFullWidthKana(text) {
		const map = {
			0xFF61	:	0x3002	,	//	。	｡
			0xFF62	:	0x300C	,	//	「	｢
			0xFF63	:	0x300D	,	//	」	｣
			0xFF64	:	0x3001	,	//	､
			0xFF65	:	0x30FB	,	//	・	･
			0xFF66	:	0x30F2	,	//	ヲ	ｦ
			0xFF67	:	0x30A1	,	//	ァ	ｧ
			0xFF68	:	0x30A3	,	//	ィ	ｨ
			0xFF69	:	0x30A5	,	//	ゥ	ｩ
			0xFF6A	:	0x30A7	,	//	ェ	ｪ
			0xFF6B	:	0x30A9	,	//	ォ	ｫ
			0xFF6C	:	0x30E3	,	//	ャ	ｬ
			0xFF6D	:	0x30E5	,	//	ュ	ｭ
			0xFF6E	:	0x30E7	,	//	ョ	ｮ
			0xFF6F	:	0x30C3	,	//	ッ	ｯ
			0xFF70	:	0x30FC	,	//	ー	ｰ
			0xFF71	:	0x30A2	,	//	ア	ｱ
			0xFF72	:	0x30A4	,	//	イ	ｲ
			0xFF73	:	0x30A6	,	//	ウ	ｳ
			0xFF74	:	0x30A8	,	//	エ	ｴ
			0xFF75	:	0x30AA	,	//	オ	ｵ
			0xFF76	:	0x30AB	,	//	カ	ｶ
			0xFF77	:	0x30AD	,	//	キ	ｷ
			0xFF78	:	0x30AF	,	//	ク	ｸ
			0xFF79	:	0x30B1	,	//	ケ	ｹ
			0xFF7A	:	0x30B3	,	//	コ	ｺ
			0xFF7B	:	0x30B5	,	//	サ	ｻ
			0xFF7C	:	0x30B7	,	//	シ	ｼ
			0xFF7D	:	0x30B9	,	//	ス	ｽ
			0xFF7E	:	0x30BB	,	//	セ	ｾ
			0xFF7F	:	0x30BD	,	//	ソ	ｿ
			0xFF80	:	0x30BF	,	//	タ	ﾀ
			0xFF81	:	0x30C1	,	//	チ	ﾁ
			0xFF82	:	0x30C4	,	//	ツ	ﾂ
			0xFF83	:	0x30C6	,	//	テ	ﾃ
			0xFF84	:	0x30C8	,	//	ト	ﾄ
			0xFF85	:	0x30CA	,	//	ナ	ﾅ
			0xFF86	:	0x30CB	,	//	ニ	ﾆ
			0xFF87	:	0x30CC	,	//	ヌ	ﾇ
			0xFF88	:	0x30CD	,	//	ネ	ﾈ
			0xFF89	:	0x30CE	,	//	ノ	ﾉ
			0xFF8A	:	0x30CF	,	//	ハ	ﾊ
			0xFF8B	:	0x30D2	,	//	ヒ	ﾋ
			0xFF8C	:	0x30D5	,	//	フ	ﾌ
			0xFF8D	:	0x30D8	,	//	ヘ	ﾍ
			0xFF8E	:	0x30DB	,	//	ホ	ﾎ
			0xFF8F	:	0x30DE	,	//	マ	ﾏ
			0xFF90	:	0x30DF	,	//	ミ	ﾐ
			0xFF91	:	0x30E0	,	//	ム	ﾑ
			0xFF92	:	0x30E1	,	//	メ	ﾒ
			0xFF93	:	0x30E2	,	//	モ	ﾓ
			0xFF94	:	0x30E4	,	//	ヤ	ﾔ
			0xFF95	:	0x30E6	,	//	ユ	ﾕ
			0xFF96	:	0x30E8	,	//	ヨ	ﾖ
			0xFF97	:	0x30E9	,	//	ラ	ﾗ
			0xFF98	:	0x30EA	,	//	リ	ﾘ
			0xFF99	:	0x30EB	,	//	ル	ﾙ
			0xFF9A	:	0x30EC	,	//	レ	ﾚ
			0xFF9B	:	0x30ED	,	//	ロ	ﾛ
			0xFF9C	:	0x30EF	,	//	ワ	ﾜ
			0xFF9D	:	0x30F3	,	//	ン	ﾝ
			0xFF9E	:	0x309B	,	//	゛	ﾞ
			0xFF9F	:	0x309C		//	゜	ﾟ
		};
		const func = function(str) {
			if(str.length === 1) {
				return (String.fromCharCode(map[str.charCodeAt(0)]));
			}
			else {
				const next = str.charCodeAt(1);
				const ch   = str.charCodeAt(0);
				if(next === 0xFF9E) {
					// Shift-JISにない濁点は無視
					// ヴ
					if (ch === 0xFF73) {
						return (String.fromCharCode(0x3094));
					}
					// ガ-ド、バ-ボ
					else if(
						((0xFF76 <= ch) && (ch <= 0xFF84)) ||
						((0xFF8A <= ch) && (ch <= 0xFF8E))	) {
						return (String.fromCharCode(map[ch] + 1));
					}
				}
				// 半濁点
				else if(next === 0xFF9F) {
					// パ-ポ
					if((0xFF8A <= ch) && (ch <= 0xFF8E)) {
						return (String.fromCharCode(map[ch] + 2));
					}
				}
				return (String.fromCharCode(map[ch]) + String.fromCharCode(map[next]));
			}
		};
		return (text.replace(/[\uFF61-\uFF9F][\uFF9E\uFF9F]?/g, func));
	}
	
	/**
	 * 半角にします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidth(text) {
		return Japanese.toHalfWidthKana(Japanese.toHalfWidthAsciiCode(text));
	}
	
	/**
	 * 全角にします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toFullWidth(text) {
		return Japanese.toFullWidthKana(Japanese.toFullWidthAsciiCode(text));
	}

	/**
	 * ローマ字からひらがなに変換します。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHiraganaFromRomaji(text) {
		const map = {
			"a" : "あ" ,
			"i" : "い" ,
			"u" : "う" ,
			"e" : "え" ,
			"o" : "お" ,
			"ka" : "か" ,
			"ki" : "き" ,
			"ku" : "く" ,
			"ke" : "け" ,
			"ko" : "こ" ,
			"ga" : "が" ,
			"gi" : "ぎ" ,
			"gu" : "ぐ" ,
			"ge" : "げ" ,
			"go" : "ご" ,
			"sa" : "さ" ,
			"si" : "し" ,
			"su" : "す" ,
			"se" : "せ" ,
			"so" : "そ" ,
			"za" : "ざ" ,
			"zi" : "じ" ,
			"zu" : "ず" ,
			"ze" : "ぜ" ,
			"zo" : "ぞ" ,
			"ta" : "た" ,
			"ti" : "ち" ,
			"tu" : "つ" ,
			"te" : "て" ,
			"to" : "と" ,
			"da" : "だ" ,
			"di" : "ぢ" ,
			"du" : "づ" ,
			"de" : "で" ,
			"do" : "ど" ,
			"na" : "な" ,
			"ni" : "に" ,
			"nu" : "ぬ" ,
			"ne" : "ね" ,
			"no" : "の" ,
			"ha" : "は" ,
			"hi" : "ひ" ,
			"hu" : "ふ" ,
			"he" : "へ" ,
			"ho" : "ほ" ,
			"ba" : "ば" ,
			"bi" : "び" ,
			"bu" : "ぶ" ,
			"be" : "べ" ,
			"bo" : "ぼ" ,
			"pa" : "ぱ" ,
			"pi" : "ぴ" ,
			"pu" : "ぷ" ,
			"pe" : "ぺ" ,
			"po" : "ぽ" ,
			"ma" : "ま" ,
			"mi" : "み" ,
			"mu" : "む" ,
			"me" : "め" ,
			"mo" : "も" ,
			"ya" : "や" ,
			"yi" : "い" ,
			"yu" : "ゆ" ,
			"ye" : "いぇ" ,
			"yo" : "よ" ,
			"ra" : "ら" ,
			"ri" : "り" ,
			"ru" : "る" ,
			"re" : "れ" ,
			"ro" : "ろ" ,
			"wa" : "わ" ,
			"wi" : "うぃ" ,
			"wu" : "う" ,
			"we" : "うぇ" ,
			"wo" : "を" ,
			"la" : "ぁ" ,
			"li" : "ぃ" ,
			"lu" : "ぅ" ,
			"le" : "ぇ" ,
			"lo" : "ぉ" ,
			"lya" : "ゃ" ,
			"lyi" : "ぃ" ,
			"lyu" : "ゅ" ,
			"lye" : "ぇ" ,
			"lyo" : "ょ" ,
			"ltu" : "っ" ,
			"ltsu" : "っ" ,
			"xa" : "ぁ" ,
			"xi" : "ぃ" ,
			"xu" : "ぅ" ,
			"xe" : "ぇ" ,
			"xo" : "ぉ" ,
			"xya" : "ゃ" ,
			"xyi" : "ぃ" ,
			"xyu" : "ゅ" ,
			"xye" : "ぇ" ,
			"xyo" : "ょ" ,
			"xtu" : "っ" ,
			"xtsu" : "っ" ,
			"va" : "ヴぁ" ,
			"vi" : "ヴぃ" ,
			"vu" : "ヴ" ,
			"ve" : "ヴぇ" ,
			"vo" : "ヴぉ" ,
			"qa" : "くぁ" ,
			"qi" : "くぃ" ,
			"qu" : "く" ,
			"qe" : "くぇ" ,
			"qo" : "くぉ" ,
			"fa" : "ふぁ" ,
			"fi" : "ふぃ" ,
			"fu" : "ふ" ,
			"fe" : "ふぇ" ,
			"fo" : "ふぉ" ,
			"ja" : "じゃ" ,
			"ji" : "じ" ,
			"ju" : "じゅ" ,
			"je" : "じぇ" ,
			"jo" : "じょ" ,
			"cha" : "ちゃ" ,
			"chi" : "ち" ,
			"chu" : "ちゅ" ,
			"che" : "ちぇ" ,
			"cho" : "ちょ" ,
			"sha" : "しゃ" ,
			"shi" : "し" ,
			"shu" : "しゅ" ,
			"she" : "しぇ" ,
			"sho" : "しょ" ,
			"tha" : "ちゃ" ,
			"thi" : "ち" ,
			"thu" : "てゅ" ,
			"the" : "てぇ" ,
			"tho" : "てょ" ,
			"tsa" : "つぁ" ,
			"tsi" : "つぃ" ,
			"tsu" : "つ" ,
			"tse" : "つぇ" ,
			"tso" : "つぉ" ,
			"n" : "ん" ,
			"nn" : "ん" ,
			"-" : "ー" ,
			"?" : "？" ,
			"!" : "！"
		};
		const y_komoji_map = {
			"a" : "ゃ",
			"i" : "ぃ",
			"u" : "ゅ",
			"e" : "ぇ",
			"o" : "ょ"
		};
		const func = function(str) {
			const output = [];
			let y_komoji = null;
			let romaji = str.toLowerCase();
			if(romaji.length > 2) {
				if(romaji.charCodeAt(0) === romaji.charCodeAt(1)) {
					output.push("っ");
					romaji = romaji.substr(1);
				}
			}
			if(romaji.length === 3) {
				const char_1 = romaji.substr(0, 1);
				const char_2 = romaji.substr(1, 1);
				if((char_2 === "y") && (char_1 !== "l") && (char_1 !== "x")) {
					y_komoji = y_komoji_map[romaji.substr(2)];
					romaji = romaji.substr(0, 1) + "i";
				}
			}
			const data = map[romaji];
			if(!data) {
				return str;
			}
			output.push(data);
			if(y_komoji) {
				output.push(y_komoji);
			}
			return output.join("");
		};
		return (text.replace(/([xl]?[kgsztdnhbpmyrwlxvqfj])(\1)?y?[aiuoe]|[xl]?(ch|cch|sh|ssh|ts|tts|th|tth)?[aiuoe]|nn?|[?\\!-]/gi, func));
	}

	/**
	 * ローマ字からカタカナに変換します。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toKatakanaFromRomaji(text) {
		return Japanese.toKatakana(Japanese.toHiraganaFromRomaji(text));
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class KANJIMAP {
    
	static init() {
		if(KANJIMAP.is_initmap) {
			return;
		}
		KANJIMAP.is_initmap = true;

		const createMap = function(string_data) {
			const utf32_array = Unicode.toUTF32Array(string_data);
			const map = {};
			for(const key in utf32_array) {
				map[utf32_array[key]] = 1;
			}
			return map;
		};

		// 参考
		// 常用漢字一覧 - Wikipedia (2019/1/1)
		// https://ja.wikipedia.org/wiki/%E5%B8%B8%E7%94%A8%E6%BC%A2%E5%AD%97%E4%B8%80%E8%A6%A7

		{
			let map = "";
			map += "亜哀愛悪握圧扱安案暗以衣位囲医依委威為胃尉異移偉意違維慰遺緯域育一壱逸芋引印因姻";
			map += "員院陰飲隠韻右宇羽雨畝浦運雲永泳英映栄営詠影鋭衛易疫益液駅悦越謁閲円延沿炎宴援園";
			map += "煙遠鉛塩演縁汚王央応往押欧殴桜翁奥横屋億憶虞乙卸音恩温穏下化火加可仮何花佳価果河";
			map += "科架夏家荷華菓貨過嫁暇禍寡歌箇課蚊我画芽賀雅餓介回灰会快戒改怪悔海界皆械絵開階塊";
			map += "解壊懐貝外劾害街慨該概各角拡革格核郭覚較隔閣確獲嚇穫学岳楽額掛括活渇割滑轄且株刈";
			map += "干刊甘汗完肝官冠巻看陥乾勘患貫寒喚堪換敢棺款間閑勧寛幹感漢慣管関歓監緩憾還館環簡";
			map += "観艦鑑丸含岸岩眼顔願企危机気岐希忌汽奇祈季紀軌既記起飢鬼帰基寄規喜幾揮期棋貴棄旗";
			map += "器輝機騎技宜偽欺義疑儀戯擬犠議菊吉喫詰却客脚逆虐九久及弓丘旧休吸朽求究泣急級糾宮";
			map += "救球給窮牛去巨居拒拠挙虚許距魚御漁凶共叫狂京享供協況峡狭恐恭胸脅強教郷境橋鏡競響";
			map += "驚仰暁業凝曲局極玉斤均近金菌勤琴筋禁緊謹吟銀区句苦駆具愚空偶遇屈掘繰君訓勲薫軍郡";
			map += "群兄刑形系径茎係型契計恵啓掲経敬景軽傾携継慶憩警鶏芸迎鯨劇撃激欠穴血決結傑潔月犬";
			map += "件見券肩建研県倹兼剣軒健険圏堅検献絹遣権憲賢謙繭顕験懸元幻玄言弦限原現減源厳己戸";
			map += "古呼固孤弧故枯個庫湖雇誇鼓顧五互午呉後娯悟碁語誤護口工公孔功巧広甲交光向后好江考";
			map += "行坑孝抗攻更効幸拘肯侯厚恒皇紅荒郊香候校耕航貢降高康控黄慌港硬絞項鉱構綱酵稿興衡";
			map += "鋼講購号合拷剛豪克告谷刻国黒穀酷獄骨込今困恨根婚混紺魂墾懇左佐査砂唆差詐鎖座才再";
			map += "災妻砕宰栽彩採済祭斎細菜最裁債催歳載際在材剤財罪作削昨索策酢搾錯咲冊札刷殺察撮擦";
			map += "雑三山参蚕惨産散算酸賛残暫士子支止氏仕史司四市矢旨死糸至伺志私使刺始姉枝祉姿思指";
			map += "施師紙脂視紫詞歯嗣試詩資飼誌雌賜諮示字寺次耳自似児事侍治持時滋慈辞磁璽式識軸七失";
			map += "室疾執湿漆質実芝写社車舎者射捨赦斜煮謝邪勺尺借釈爵若弱寂手主守朱取狩首殊珠酒種趣";
			map += "寿受授需儒樹収囚州舟秀周宗拾秋臭修終習週就衆集愁酬醜襲十充住柔重従渋銃獣縦叔祝宿";
			map += "淑粛縮熟出述術俊春瞬旬巡盾准殉純循順準潤遵処初所書庶暑署緒諸女如助序叙徐除小升少";
			map += "召匠床抄肖招承昇松沼昭将消症祥笑唱商渉章紹訟勝掌晶焼焦硝粧詔証象傷奨照詳彰障衝賞";
			map += "償礁鐘上丈冗条状乗城浄剰常情場畳蒸嬢錠譲醸色食植殖飾触嘱織職辱心申伸臣身辛侵信津";
			map += "神娠振浸真針深紳進森診寝慎新審震薪親人刃仁尽迅陣尋図水吹垂炊帥粋衰推酔遂睡穂錘随";
			map += "髄枢崇数寸瀬是井世正生成西声制姓征性青政星牲省清盛婿晴勢聖誠精製誓静請整税夕斥石";
			map += "赤昔析席隻惜責跡積績籍切折拙窃接設雪摂節説舌絶千川占先宣専泉浅洗染扇旋船戦践銭銑";
			map += "潜線遷選薦繊鮮全前善然禅漸繕阻祖租素措粗組疎訴塑礎双壮早争走奏相荘草送倉捜桑巣掃";
			map += "窓創喪葬装僧想層総遭操燥霜騒造像増憎蔵贈臓即束足促則息速側測俗族属賊続卒率存村孫";
			map += "尊損他多打妥堕惰太対体耐待怠胎退帯泰袋逮替貸隊滞態大代台第題滝宅択沢卓拓託諾濁但";
			map += "達脱奪丹担単炭胆探淡短嘆端誕鍛団男段断弾暖談壇地池知値恥致遅痴稚置竹畜逐蓄築秩窒";
			map += "茶着嫡中仲虫沖宙忠抽注昼柱衷鋳駐著貯丁弔庁兆町長帳張彫頂鳥朝脹超腸跳徴潮澄調聴懲";
			map += "直勅沈珍朕陳賃鎮追墜通痛坪低呈廷弟定底抵邸貞帝訂庭逓停堤提程艇締的笛摘滴適敵迭哲";
			map += "鉄徹撤天典店点展添転田伝殿電斗吐徒途都渡塗土奴努度怒刀冬灯当投豆東到逃倒凍唐島桃";
			map += "討透党悼盗陶塔湯痘登答等筒統稲踏糖頭謄闘騰同胴動堂童道働銅導峠匿特得督徳篤毒独読";
			map += "突届豚鈍曇内南軟難二尼弐肉日入乳尿任妊忍認寧熱年念粘燃悩納能脳農濃波派破馬婆拝杯";
			map += "背肺俳配排敗廃輩売倍梅培陪媒買賠白伯拍泊迫舶博薄麦縛爆箱畑八発髪伐抜罰閥反半犯帆";
			map += "伴判坂板版班畔般販飯搬煩頒範繁藩晩番蛮盤比皮妃否批彼肥非卑飛疲秘被悲費碑罷避尾美";
			map += "備微鼻匹必泌筆姫百氷表俵票評漂標苗秒病描品浜貧賓敏不夫父付布扶府怖附負赴浮婦符富";
			map += "普腐敷膚賦譜侮武部舞封風伏服副幅復福腹複覆払沸仏物粉紛噴墳憤奮分文聞丙平兵併並柄";
			map += "陛閉幣弊米壁癖別片辺返変偏遍編弁便勉歩保捕補舗母募墓慕暮簿方包芳邦奉宝抱放法胞倣";
			map += "峰砲崩訪報豊飽縫亡乏忙坊妨忘防房肪某冒剖紡望傍帽棒貿暴膨謀北木牧墨撲没本奔翻凡盆";
			map += "麻摩魔毎妹枚埋幕膜又末万満慢漫未味魅密脈妙民眠矛務無夢霧娘名命明迷盟銘鳴滅免面綿";
			map += "茂模毛盲耗猛網目黙門紋問匁夜野役約訳薬躍由油愉諭輸唯友有勇幽郵猶裕遊雄誘憂融優与";
			map += "予余誉預幼用羊洋要容庸揚揺葉陽溶腰様踊窯養擁謡曜抑浴欲翌翼裸来雷頼絡落酪乱卵覧濫";
			map += "欄吏利里理痢裏履離陸立律略柳流留粒隆硫旅虜慮了両良料涼猟陵量僚領寮療糧力緑林厘倫";
			map += "輪隣臨涙累塁類令礼冷励例鈴零霊隷齢麗暦歴列劣烈裂恋連廉練錬炉路露老労郎朗浪廊楼漏";
			map += "六録論和話賄惑湾腕";
			KANJIMAP.joyokanji_before_1981_map = createMap(map);
		}

		{
			let map = "";
			map += "猿凹渦靴稼拐涯垣殻潟喝褐缶頑挟矯襟隅渓蛍嫌洪溝昆崎皿桟傘肢遮蛇酌汁塾尚宵縄壌唇甚";
			map += "据杉斉逝仙栓挿曹槽藻駄濯棚挑眺釣塚漬亭偵泥搭棟洞凸屯把覇漠肌鉢披扉猫頻瓶雰塀泡俸";
			map += "褒朴僕堀磨抹岬妄厄癒悠羅竜戻枠";
			KANJIMAP.joyokanji_add_1981_map = createMap(map);
		}

		{
			let map = "";
			map += "通用字体挨曖宛嵐畏萎椅彙茨咽淫唄鬱怨媛艶旺岡臆俺苛牙瓦楷潰諧崖蓋骸柿顎葛釜鎌韓玩";
			map += "伎亀毀畿臼嗅巾僅錦惧串窟熊詣憬稽隙桁拳鍵舷股虎錮勾梗喉乞傲駒頃痕沙挫采塞埼柵刹拶";
			map += "斬恣摯餌鹿嫉腫呪袖羞蹴憧拭尻芯腎須裾凄醒脊戚煎羨腺詮箋膳狙遡曽爽痩踪捉遜汰唾堆戴";
			map += "誰旦綻緻酎貼嘲捗椎爪鶴諦溺塡妬賭藤瞳栃頓貪丼那奈梨謎鍋匂虹捻罵剝箸氾汎阪斑眉膝肘";
			map += "阜訃蔽餅璧蔑哺蜂貌頰睦勃昧枕蜜冥麺冶弥闇喩湧妖瘍沃拉辣藍璃慄侶瞭瑠呂賂弄籠麓脇";
			KANJIMAP.joyokanji_add_2010_map = createMap(map);
		}

		{
			let map = "";
			map += "勺錘銑脹匁";
			KANJIMAP.joyokanji_delete_2010_map = createMap(map);
		}
		
		// 参考
		// 人名用漢字一覧 - Wikipedia (2019/1/1)
		// https://ja.wikipedia.org/wiki/%E4%BA%BA%E5%90%8D%E7%94%A8%E6%BC%A2%E5%AD%97%E4%B8%80%E8%A6%A7

		{
			let map = "";
			map += "亞亜惡悪爲為逸逸榮栄衞衛謁謁圓円緣縁薗園應応櫻桜奧奥橫横溫温價価禍禍悔悔海海壞壊";
			map += "懷懐樂楽渴渇卷巻陷陥寬寛漢漢氣気祈祈器器僞偽戲戯虛虚峽峡狹狭響響曉暁勤勤謹謹駈駆";
			map += "勳勲薰薫惠恵揭掲鷄鶏藝芸擊撃縣県儉倹劍剣險険圈圏檢検顯顕驗験嚴厳廣広恆恒黃黄國国";
			map += "黑黒穀穀碎砕雜雑祉祉視視兒児濕湿實実社社者者煮煮壽寿收収臭臭從従澁渋獸獣縱縦祝祝";
			map += "暑暑署署緖緒諸諸敍叙將将祥祥涉渉燒焼奬奨條条狀状乘乗淨浄剩剰疊畳孃嬢讓譲釀醸神神";
			map += "眞真寢寝愼慎盡尽粹粋醉酔穗穂瀨瀬齊斉靜静攝摂節節專専戰戦纖繊禪禅祖祖壯壮爭争莊荘";
			map += "搜捜巢巣曾曽裝装僧僧層層瘦痩騷騒增増憎憎藏蔵贈贈臟臓卽即帶帯滯滞瀧滝單単嘆嘆團団";
			map += "彈弾晝昼鑄鋳著著廳庁徵徴聽聴懲懲鎭鎮轉転傳伝都都嶋島燈灯盜盗稻稲德徳突突難難拜拝";
			map += "盃杯賣売梅梅髮髪拔抜繁繁晚晩卑卑祕秘碑碑賓賓敏敏冨富侮侮福福拂払佛仏勉勉步歩峯峰";
			map += "墨墨飜翻每毎萬万默黙埜野彌弥藥薬與与搖揺樣様謠謡來来賴頼覽覧欄欄龍竜虜虜凉涼綠緑";
			map += "淚涙壘塁類類禮礼曆暦歷歴練練鍊錬郞郎朗朗廊廊錄録";
			KANJIMAP.jinmeiyokanji_joyokanji_isetai_2017_map = createMap(map);
		}

		{
			let map = "";
			map += "丑丞乃之乎也云些亦亥亨亮仔伊伍伽佃佑伶侃侑俄俠俣俐倭俱倦倖偲傭儲允兎兜其冴凌凧凪";
			map += "凰凱函劉劫勁勺勿匁匡廿卜卯卿厨厩叉叡叢叶只吾吞吻哉哨啄哩喬喧喰喋嘩嘉嘗噌噂圃圭坐";
			map += "坦埴堰堺堵塙壕壬夷奄奎套娃姪姥娩嬉孟宏宋宕宥寅寓寵尖尤屑峨峻崚嵯嵩嶺巫已巳巴巷巽";
			map += "帖幌幡庄庇庚庵廟廻弘弛彗彦彪彬徠忽怜恢恰恕悌惟惚悉惇惹惺惣慧憐戊或戟托按挺挽掬捲";
			map += "捷捺捧掠揃摑摺撒撰撞播撫擢孜敦斐斡斧斯於旭昂昊昏昌昴晏晒晋晟晦晨智暉暢曙曝曳朋朔";
			map += "杏杖杜李杭杵杷枇柑柴柘柊柏柾柚栞桔桂栖桐栗梧梓梢梛梯桶梶椛梁棲椋椀楯楚楕椿楠楓椰";
			map += "楢楊榎樺榊榛槍槌樫槻樟樋橘樽橙檎檀櫂櫛櫓欣欽歎此殆毅毘毬汀汝汐汲沌沓沫洸洲洵洛浩";
			map += "浬淵淳淀淋渥渾湘湊湛溢滉溜漱漕漣澪濡瀕灘灸灼烏焰焚煌煤煉熙燕燎燦燭燿爾牒牟牡牽犀";
			map += "狼獅玖珂珈珊珀玲琉瑛琥琶琵琳瑚瑞瑶瑳瓜瓢甥甫畠畢疋疏皐皓眸瞥矩砦砥砧硯碓碗碩碧磐";
			map += "磯祇禽禾秦秤稀稔稟稜穹穿窄窪窺竣竪竺竿笈笹笙笠筈筑箕箔篇篠簞簾籾粥粟糊紘紗紐絃紬";
			map += "絆絢綺綜綴緋綾綸縞徽繫繡纂纏羚翔翠耀而耶耽聡肇肋肴胤胡脩腔脹膏臥舜舵芥芹芭芙芦苑";
			map += "茄苔苺茅茉茸茜莞荻莫莉菅菫菖萄菩萊菱葦葵萱葺萩董葡蓑蒔蒐蒼蒲蒙蓉蓮蔭蔣蔦蓬蔓蕎蕨";
			map += "蕉蕃蕪薙蕾蕗藁薩蘇蘭蝦蝶螺蟬蟹蠟衿袈袴裡裟裳襖訊訣註詢詫誼諏諄諒謂諺讃豹貰賑赳跨";
			map += "蹄蹟輔輯輿轟辰辻迂迄辿迪迦這逞逗逢遁遼邑祁郁鄭酉醇醐醍醬釉釘釧銑鋒鋸錘錐錆錫鍬鎧";
			map += "閃閏閤阿陀隈隼雀雁雛雫霞靖鞄鞍鞘鞠鞭頁頌頗顚颯饗馨馴馳駕駿驍魁魯鮎鯉鯛鰯鱒鱗鳩鳶";
			map += "鳳鴨鴻鵜鵬鷗鷲鷺鷹麒麟麿黎黛鼎";
			KANJIMAP.jinmeiyokanji_notjoyokanji_2017_map = createMap(map);
		}

		{
			let map = "";
			map += "亙亘凛凜堯尭巖巌晄晃檜桧槇槙渚渚猪猪琢琢禰祢祐祐禱祷祿禄禎禎穰穣萠萌遙遥";
			KANJIMAP.jinmeiyokanji_notjoyokanji_isetai_2017_map = createMap(map);
		}
	}

	static get JOYOJANJI_BEFORE_1981() {
		KANJIMAP.init();
		return KANJIMAP.joyokanji_before_1981_map;
	}
	
	static get JOYOKANJI_ADD_1981() {
		KANJIMAP.init();
		return KANJIMAP.joyokanji_add_1981_map;
	}
	
	static get JOYOKANJI_ADD_2010() {
		KANJIMAP.init();
		return KANJIMAP.joyokanji_add_2010_map;
	}
	
	static get JOYOKANJI_DELETE_2010() {
		KANJIMAP.init();
		return KANJIMAP.joyokanji_delete_2010_map;
	}
	
	static get JINMEIYOKANJI_JOYOKANJI_ISETAI_2017() {
		KANJIMAP.init();
		return KANJIMAP.jinmeiyokanji_joyokanji_isetai_2017_map;
	}
	
	static get JINMEIYOKANJI_NOTJOYOKANJI_2017() {
		KANJIMAP.init();
		return KANJIMAP.jinmeiyokanji_notjoyokanji_2017_map;
	}
	
	static get JINMEIYOKANJI_NOTJOYOKANJI_ISETAI_2017() {
		KANJIMAP.init();
		return KANJIMAP.jinmeiyokanji_notjoyokanji_isetai_2017_map;
	}
	
}

KANJIMAP.is_initmap = false;
KANJIMAP.joyokanji_before_1981_map = null;
KANJIMAP.joyokanji_add_1981_map = null;
KANJIMAP.joyokanji_add_2010_map = null;
KANJIMAP.joyokanji_delete_2010_map = null;
KANJIMAP.jinmeiyokanji_joyokanji_isetai_2017_map = null;
KANJIMAP.jinmeiyokanji_notjoyokanji_2017_map = null;
KANJIMAP.jinmeiyokanji_notjoyokanji_isetai_2017_map = null;

class JapaneseKanji {
	
	/**
	 * 指定したコードポイントの漢字は1981年より前に常用漢字とされているか判定する
	 * @param {Number} unicode_codepoint Unicodeのコードポイント
	 * @param {boolean} 判定結果 
	 */
	static isJoyoKanjiBefore1981(unicode_codepoint) {
		const joyokanji_before_1981_map = KANJIMAP.JOYOJANJI_BEFORE_1981;
		return !!joyokanji_before_1981_map[unicode_codepoint];
	}

	/**
	 * 指定したコードポイントの漢字は1981年時点で常用漢字かを判定する
	 * @param {Number} unicode_codepoint Unicodeのコードポイント
	 * @param {boolean} 判定結果 
	 */
	static isJoyoKanji1981(unicode_codepoint) {
		const joyokanji_before_1981_map = KANJIMAP.JOYOJANJI_BEFORE_1981;
		const joyokanji_add_1981_map = KANJIMAP.JOYOKANJI_ADD_1981;
		return (!!joyokanji_before_1981_map[unicode_codepoint]) || (!!joyokanji_add_1981_map[unicode_codepoint]);
	}

	/**
	 * 指定したコードポイントの漢字は2010年時点で常用漢字かを判定する
	 * @param {Number} unicode_codepoint Unicodeのコードポイント
	 * @param {boolean} 判定結果 
	 */
	static isJoyoKanji2010(unicode_codepoint) {
		const joyokanji_add_2010_map = KANJIMAP.JOYOKANJI_ADD_2010;
		const joyokanji_delete_2010_map = KANJIMAP.JOYOKANJI_DELETE_2010;
		if(joyokanji_delete_2010_map[unicode_codepoint]) {
			return false;
		}
		const x = JapaneseKanji.isJoyoKanji1981(unicode_codepoint);
		return x || (!!joyokanji_add_2010_map[unicode_codepoint]);
	}

	/**
	 * 指定したコードポイントの漢字は2017年時点で人名漢字でのみ存在するかを判定する
	 * @param {Number} unicode_codepoint Unicodeのコードポイント
	 * @param {boolean} 判定結果 
	 */
	static isOnlyJinmeiyoKanji2017(unicode_codepoint) {
		if(JapaneseKanji.isJoyoKanji2010(unicode_codepoint)) {
			return false;
		}
		const jinmeiyokanji_joyokanji_isetai_map = KANJIMAP.JINMEIYOKANJI_JOYOKANJI_ISETAI_2017;
		const jinmeiyokanji_notjoyokanji_map = KANJIMAP.JINMEIYOKANJI_NOTJOYOKANJI_2017;
		const jinmeiyokanji_notjoyokanji_isetai_map = KANJIMAP.JINMEIYOKANJI_NOTJOYOKANJI_ISETAI_2017;
		return (!!jinmeiyokanji_joyokanji_isetai_map[unicode_codepoint])
				|| (!!jinmeiyokanji_notjoyokanji_map[unicode_codepoint])
				|| (!!jinmeiyokanji_notjoyokanji_isetai_map[unicode_codepoint]);
	}

	/**
	 * 指定したコードポイントの漢字は2017年時点で人名漢字で許可されているかを判定する
	 * @param {Number} unicode_codepoint Unicodeのコードポイント
	 * @param {boolean} 判定結果 
	 */
	static isJinmeiyoKanji2017(unicode_codepoint) {
		return JapaneseKanji.isJoyoKanji2010(unicode_codepoint) || JapaneseKanji.isOnlyJinmeiyoKanji2017(unicode_codepoint);
	}

	/**
	 * 指定したコードポイントの漢字は本ソースコードの最新の時点で常用漢字かを判定する
	 * @param {Number} unicode_codepoint Unicodeのコードポイント
	 * @param {boolean} 判定結果 
	 */
	static isJoyoKanji(unicode_codepoint) {
		return JapaneseKanji.isJoyoKanji2010(unicode_codepoint);
	}
	
	/**
	 * 指定したコードポイントの漢字は本ソースコードの最新の時点で人名漢字でのみ存在するかを判定する
	 * @param {Number} unicode_codepoint Unicodeのコードポイント
	 * @param {boolean} 判定結果 
	 */
	static isOnlyJinmeiyoKanji(unicode_codepoint) {
		return JapaneseKanji.isOnlyJinmeiyoKanji2017(unicode_codepoint);
	}

	/**
	 * 指定したコードポイントの漢字は本ソースコードの最新の時点で人名漢字で許可されているかを判定する
	 * @param {Number} unicode_codepoint Unicodeのコードポイント
	 * @param {boolean} 判定結果 
	 */
	static isJinmeiyoKanji(unicode_codepoint) {
		return JapaneseKanji.isJinmeiyoKanji2017(unicode_codepoint);
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class Programming {

	/**
	 * コメントを除去します。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static removeComment(text) {
		let istextA  = false;
		let isescape = false;
		let commentA1 = false;
		let commentA2 = false;
		let commentB2 = false;
		let commentB3 = false;
		const output = [];

		for(let i = 0;i < text.length;i++) {
			const character = text.charAt(i);

			//文字列（ダブルクォーテーション）は除去しない
			if(istextA) {
				if(isescape) {
					isescape = false;
				}
				else if(character === "\\") {
					isescape = true;
				}
				else if(character === "\"") {
					istextA = false;
				}
				output[output.length] = character;
				continue;
			}

			//複数行コメント
			if(commentB2) {
				//前回複数行コメントが終了の可能性があった場合
				if(commentB3){
					commentB3 = false;
					//コメント終了
					if(character === "/") {
						commentB2 = false;
					}
				}
				//ここにelseをつけると、**/ が抜ける
				if(character === "*") {
					commentB3 = true;
				}
				else if(character === "\n"){
					output[output.length] = character;
				}
				continue;
			}

			//１行コメントである
			if(commentA2) {
				//改行でコメント修了
				if(character === "\n"){
					commentA2 = false;
					output[output.length] = character;
				}
				continue;
			}

			//前回コメントの開始点だと思われている場合
			if(commentA1){
				commentA1 = false;
				//1行コメントの場合
				if(character === "/") {
					commentA2 = true;
					output[output.length - 1] = "";
					continue;
				}
				//複数行コメントの場合
				else if(character === "*") {
					commentB2 = true;
					output[output.length - 1] = "";
					continue;
				}
			}

			//文字列開始点
			if(character === "\"") {
				istextA = true;
			}
			//コメントの開始点だと追われる場合
			if(character === "/") {
				commentA1 = true;
			}
			output[output.length] = character;
		}
		return (output.join(""));
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class Format {

	/**
	 * C言語のprintfを再現
	 * ロケール、日付時刻等はサポートしていません。
	 * sprintfの変換指定子のpとnはサポートしていません。
	 * @param {String} text 
	 * @param {String} parm パラメータは可変引数
	 * @returns {String}
	 */
	static format() {
		let parm_number = 1;
		const parm = arguments;
		const toUnsign  = function(x) {
			if(x >= 0) {
				return(x);
			}
			else {
				x = -x;
				//16ビットごとに分けてビット反転
				let high = ((~x) >> 16) & 0xFFFF;
				high *= 0x00010000;
				const low  =  (~x) & 0xFFFF;
				return(high + low + 1);
			}
		};
		const func = function(str) {
			// 1文字目の%を除去
			str = str.substring(1, str.length);
			let buff;
			// [6] 変換指定子(最後の1文字を取得)
			buff = str.match(/.$/);
			const type = buff[0];
			if(type === "%") {
				return("%");
			}
			// ここからパラメータの解析開始
			// [1] 引数順
			buff = str.match(/^[0-9]+\$/);
			if(buff !== null) {
				buff = buff[0];
				// 残りの文字列を取得
				str = str.substring(buff.length, str.length);
				// 数字だけ切り出す
				buff = buff.substring(0, buff.length - 1);
				// 整数へ
				parm_number = parseInt(buff , 10);
			}
			// 引数を取得
			let parameter = parm[parm_number];
			parm_number = parm_number + 1;
			// [2] フラグ
			buff = str.match(/^[-+ #0]+/);
			let isFlagSharp = false;
			let isFlagTextAlignLeft = false;
			let isFlagFillZero = false;
			let sSignCharacter = "";
			if(buff !== null) {
				buff = buff[0];
				// 残りの文字列を取得
				str = str.substring(buff.length, str.length);
				if(buff.indexOf("#") !== -1) {
					isFlagSharp = true;
				}
				if(buff.indexOf("-") !== -1) {
					isFlagTextAlignLeft = true;
				}
				if(buff.indexOf(" ") !== -1) {
					sSignCharacter = " ";
				}
				if(buff.indexOf("+") !== -1) {
					sSignCharacter = "+";
				}
				if(buff.indexOf("0") !== -1) {
					isFlagFillZero = true;
				}
			}
			// [3] 最小フィールド幅
			let width = 0;
			buff = str.match(/^([0-9]+|\*)/);
			if(buff !== null) {
				buff = buff[0];
				// 残りの文字列を取得
				str = str.substring(buff.length, str.length);
				if(buff.indexOf("*") !== -1) { // 引数で最小フィールド幅を指定
					width = parameter;
					parameter = parm[parm_number];
					parm_number = parm_number + 1;
				}
				else { // 数字で指定
					width = parseInt(buff , 10);
				}
			}
			// [4] 精度の指定
			let isPrecision = false;
			let precision = 0;
			buff = str.match(/^(\.((-?[0-9]+)|\*)|\.)/); //.-3, .* , .
			if(buff !== null) {
				buff = buff[0];
				// 残りの文字列を取得
				str = str.substring(buff.length, str.length);
				isPrecision = true;
				if(buff.indexOf("*") !== -1) { // 引数で精度を指定
					precision = parameter;
					parameter = parm[parm_number];
					parm_number = parm_number + 1;
				}
				else if(buff.length === 1) { // 小数点だけの指定
					precision = 0;
				}
				else { // 数字で指定
					buff = buff.substring(1, buff.length);
					precision = parseInt(buff , 10);
				}
			}
			// 長さ修飾子(非サポート)
			buff = str.match(/^hh|h|ll|l|L|z|j|t/);
			if(buff !== null) {
				str = str.substring(buff.length, str.length);
			}
			// 文字列を作成する
			let output = "";
			let isInteger = false;
			switch(type.toLowerCase()) {
				// 数字関連
				case "d":
				case "i":
				case "u":
				case "b":
				case "o":
				case "x":
					isInteger = true;
					// falls through
				case "e":
				case "f":
				case "g":
				{
					let sharpdata = "";
					let textlength = 0; // 現在の文字を構成するために必要な長さ
					let spacesize;  // 追加する横幅
					// 整数
					if(isInteger) {
						// 数字に変換
						if(isNaN(parameter)) {
							parameter = parseInt(parameter, 10);
						}
						// 正負判定
						if((type === "d") || (type === "i")) {
							if(parameter < 0) {
								sSignCharacter = "-";
								parameter  = -parameter;
							}
							parameter  = Math.floor(parameter);
						}
						else {
							if(parameter >= 0) {
								parameter  = Math.floor(parameter);
							}
							else {
								parameter  = Math.ceil(parameter);
							}
						}
					}
					// 実数
					else {
						// 数字に変換
						if(isNaN(parameter)) {
							parameter = parseFloat(parameter);
						}
						// 正負判定
						if(parameter < 0) {
							sSignCharacter = "-";
							parameter  = -parameter;
						}
						if(!isPrecision) {
							precision = 6;
						}
					}
					// 文字列を作成していく
					switch(type.toLowerCase()) {
						case "d":
						case "i":
							output += parameter.toString(10);
							break;
						case "u":
							output += toUnsign(parameter).toString(10);
							break;
						case "b":
							output += toUnsign(parameter).toString(2);
							if(isFlagSharp) {
								sharpdata = "0b";
							}
							break;
						case "o":
							output  += toUnsign(parameter).toString(8);
							if(isFlagSharp) {
								sharpdata = "0";
							}
							break;
						case "x":
						case "X":
							output  += toUnsign(parameter).toString(16);
							if(isFlagSharp) {
								sharpdata = "0x";
							}
							break;
						case "e":
							output += parameter.toExponential(precision);
							break;
						case "f":
							output += parameter.toFixed(precision);
							break;
						case "g":
							if(precision === 0) { // 0は1とする
								precision = 1;
							}
							output += parameter.toPrecision(precision);
							// 小数点以下の語尾の0の削除
							if((!isFlagSharp) && (output.indexOf(".") !== -1)) {
								output = output.replace(/\.?0+$/, "");  // 1.00 , 1.10
								output = output.replace(/\.?0+e/, "e"); // 1.0e , 1.10e
							}
							break;
						default:
							// 上でチェックしているため、ありえない
							break;
					}
					// 整数での後処理
					if(isInteger) {
						if(isPrecision) { // 精度の付け足し
							spacesize  = precision - output.length;
							for(let i = 0; i < spacesize; i++) {
								output = "0" + output;
							}
						}
					}
					// 実数での後処理
					else {
						if(isFlagSharp) { 
							// sharp指定の時は小数点を必ず残す
							if(output.indexOf(".") === -1) {
								if(output.indexOf("e") !== -1) {
									output = output.replace("e", ".e");
								}
								else {
									output += ".";
								}
							}
						}
					}
					// 指数表記は、3桁表示(double型のため)
					if(output.indexOf("e") !== -1) {
						const buff = function(str) {
							const l   = str.length;
							if(str.length === 3) { // e+1 -> e+001
								return(str.substring(0, l - 1) + "00" + str.substring(l - 1, l));
							}
							else { // e+10 -> e+010
								return(str.substring(0, l - 2) + "0" + str.substring(l - 2, l));
							}
						};
						output = output.replace(/e[+-][0-9]{1,2}$/, buff);
					}
					textlength = output.length + sharpdata.length + sSignCharacter.length;
					spacesize  = width - textlength;
					// 左よせ
					if(isFlagTextAlignLeft) {
						for(let i = 0; i < spacesize; i++) {
							output = output + " ";
						}
					}
					// 0を埋める場合
					if(isFlagFillZero) {
						for(let i = 0; i < spacesize; i++) {
							output = "0" + output;
						}
					}
					// マイナスや、「0x」などを接続
					output = sharpdata + output;
					output = sSignCharacter + output;
					// 0 で埋めない場合
					if((!isFlagFillZero) && (!isFlagTextAlignLeft)) {
						for(let i = 0; i < spacesize; i++) {
							output = " " + output;
						}
					}
					// 大文字化
					if(type.toUpperCase() === type) {
						output = output.toUpperCase();
					}
					break;
				}
				// 文字列の場合
				case "c":
					if(!isNaN(parameter)) {
						parameter = String.fromCharCode(parameter);
					}
					// falls through
				case "s":
				{
					if(!isNaN(parameter)) {
						parameter = parameter.toString(10);
					}
					output = parameter;
					if(isPrecision) { // 最大表示文字数
						if(output.length > precision) {
							output = output.substring(0, precision);
						}
					}
					const s_textlength = output.length; // 現在の文字を構成するために必要な長さ
					const s_spacesize  = width - s_textlength;  // 追加する横幅
					// 左よせ / 右よせ
					if(isFlagTextAlignLeft) {
						for(let i = 0; i < s_spacesize; i++) {
							output = output + " ";
						}
					}
					else {
						// 拡張
						const s = isFlagFillZero ? "0" : " ";
						for(let i = 0; i < s_spacesize; i++) {
							output = s + output;
						}
					}
					break;
				}
				// パーセント
				case "%":
					output = "%";
					break;
				// 未サポート
				case "p":
				case "n":
					output = "(変換できません)";
					break;
				default:
					// 正規表現でチェックしているため、ありえない
					break;
			}
			return (output);	
		};
		return (parm[0].replace(/%[^diubBoxXeEfFgGaAcspn%]*[diubBoxXeEfFgGaAcspn%]/g, func));
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const Text$1 = {
	
	Unicode : Unicode,
	isHighSurrogateAt : Unicode.isHighSurrogateAt,
	isLowSurrogateAt : Unicode.isLowSurrogateAt,
	isSurrogatePairAt : Unicode.isSurrogatePairAt,
	codePointAt : Unicode.codePointAt,
	codePointBefore : Unicode.codePointBefore,
	codePointCount : Unicode.codePointCount,
	offsetByCodePoints : Unicode.offsetByCodePoints,
	fromCodePoint : Unicode.fromCodePoint,
	toUTF32Array : Unicode.toUTF32Array,
	fromUTF32Array : Unicode.fromUTF32Array,
	toUTF16Array : Unicode.toUTF16Array,
	fromUTF16Array : Unicode.fromUTF16Array,
	toUTF8Array : Unicode.toUTF8Array,
	fromUTF8Array : Unicode.fromUTF8Array,
	cutTextForCodePoint : Unicode.cutTextForCodePoint,
	
	CP932 : CP932,
	toCP932Array : CP932.toCP932Array,
	toCP932ArrayBinary : CP932.toCP932ArrayBinary,
	fromCP932Array : CP932.fromCP932Array,
	getWidthForCP932 : CP932.getWidthForCP932,
	cutTextForCP932 : CP932.cutTextForCP932,
	isCP932Gaiji : CP932.isCP932Gaiji,
	isCP932IBMExtendedCharacter : CP932.isCP932IBMExtendedCharacter,
	isCP932NECSelectionIBMExtendedCharacter : CP932.isCP932NECSelectionIBMExtendedCharacter,
	isCP932NECSpecialCharacter : CP932.isCP932NECSpecialCharacter,

	Japanese : Japanese,
	toHiragana : Japanese.toHiragana,
	toKatakana : Japanese.toKatakana,
	toHalfWidthSpace : Japanese.toHalfWidthSpace,
	toFullWidthSpace : Japanese.toFullWidthSpace,
	toHalfWidthAsciiCode : Japanese.toHalfWidthAsciiCode,
	toFullWidthAsciiCode : Japanese.toFullWidthAsciiCode,
	toHalfWidthAlphabet : Japanese.toHalfWidthAlphabet,
	toFullWidthAlphabet : Japanese.toFullWidthAlphabet,
	toHalfWidthNumber : Japanese.toHalfWidthNumber,
	toFullWidthNumber : Japanese.toFullWidthNumber,
	toHalfWidthKana : Japanese.toHalfWidthKana,
	toFullWidthKana : Japanese.toFullWidthKana,
	toHalfWidth : Japanese.toHalfWidth,
	toFullWidth : Japanese.toFullWidth,
	toHiraganaFromRomaji : Japanese.toHiraganaFromRomaji,
	toKatakanaFromRomaji : Japanese.toKatakanaFromRomaji,

	JapaneseKanji : JapaneseKanji,
	isJoyoKanjiBefore1981 : JapaneseKanji.isJoyoKanjiBefore1981,
	isJoyoKanji1981 : JapaneseKanji.isJoyoKanji1981,
	isJoyoKanji2010 : JapaneseKanji.isJoyoKanji2010,
	isOnlyJinmeiyoKanji2017 : JapaneseKanji.isOnlyJinmeiyoKanji2017,
	isJinmeiyoKanji2017 : JapaneseKanji.isJinmeiyoKanji2017,
	isJoyoKanji : JapaneseKanji.isJoyoKanji,
	isOnlyJinmeiyoKanji : JapaneseKanji.isOnlyJinmeiyoKanji,
	isJinmeiyoKanji : JapaneseKanji.isJinmeiyoKanji,

	Programming : Programming,
	removeComment : Programming.removeComment,
	
	Format : Format,
	format : Format.format
	
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class IDSwitch {
	
	/**
	 * 押す、離すが可能なボタン
	 * @returns {IDSwitch}
	 */
	constructor() {
		this._initIDSwitch();
	}

	_initIDSwitch() {
		/**
		 * 押した瞬間に反応
		 */
		this.istyped		= false;

		/**
		 * 押している間に反応
		 */
		this.ispressed		= false;

		/**
		 * 離した瞬間に反応
		 */
		this.isreleased		= false;

		/**
		 * 押している時間に反応
		 */
		this.pressed_time	= 0;
	}

	clone () {
		const ret = new IDSwitch();
		ret.istyped			= this.istyped;
		ret.ispressed		= this.ispressed;
		ret.isreleased		= this.isreleased;
		ret.pressed_time	= this.pressed_time;
		return ret;
	}

	/**
	 * キーを押した情報
	 */
	keyPressed() {
		if(!this.ispressed) {
			this.istyped = true;
		}
		this.ispressed = true;
		this.pressed_time++;
	}

	/**
	 * キーを離した情報
	 */
	keyReleased() {
		this.ispressed  = false;
		this.isreleased = true;
		this.pressed_time = 0;
	}

	/**
	 * フォーカスが消えたとき
	 */
	focusLost() {
		this.keyReleased();
	}

	/**
	 * 情報をうけとる。
	 * トリガータイプなど1回目の情報と2回の情報で異なる場合がある。
	 * @param {InputSwitch} c 取得用クラス
	 */
	pickInput(c) {
		if(!(c instanceof IDSwitch)) {
			throw "IllegalArgumentException";
		}
		c.ispressed			= this.ispressed;
		c.istyped			= this.istyped;
		c.isreleased		= this.isreleased;
		c.pressed_time		= this.pressed_time;
		this.isreleased		= false;
		this.istyped		= false;
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class IDPosition {
		
	/**
	 * 位置情報
	 * @param {Number} x 任意
	 * @param {Number} y 任意
	 * @returns {IDPosition}
	 */
	constructor(x, y) {
		this._initIDPosition(x, y);
	}

	_initIDPosition(x, y) {
		if(x instanceof IDPosition) {
			const position = x;
			this.set(position);
		}
		else if(x === undefined) {
			this.x = 0; this.y = 0;
		}
		else if(arguments.length === 2) {
			this.set(x, y);
		}
		else {
			this.x = 0; this.y = 0;
		}
	}
	
	clone() {
		const ret = new IDPosition(this);
		return ret;
	}
	
	set(x, y) {
		if(x instanceof IDPosition) {
			const position = x;
			this.x = position.x; this.y = position.y;
		}
		else {
			this.x = x; this.y = y;
		}
	}
	
	add(x, y) {
		if(x instanceof IDPosition) {
			const position = x;
			this.x += position.x; this.y += position.y;
		}
		else {
			this.x += x; this.y += y;
		}
	}
	
	sub(x, y) {
		if(x instanceof IDPosition) {
			const position = x;
			this.x -= position.x; this.y -= position.y;
		}
		else {
			this.x -= x; this.y -= y;
		}
	}
	
	static norm(p1, p2) {
		const x = p1.x - p2.x;
		const y = p1.y - p2.y;
		return Math.sqrt(x * x + y * y);
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class IDDraggableSwitch {

	/**
	 * 動かすことが可能なクラス
	 * @param {Integer} mask
	 * @returns {IDDraggableSwitch}
	 */
	constructor(mask) {
		this._initIDDraggableSwitch(mask);
	}

	_initIDDraggableSwitch(mask) {
		this.mask			= mask;
		this.switch			= new IDSwitch();
		this.client			= new IDPosition();
		this.deltaBase		= new IDPosition();
		this.dragged		= new IDPosition();
	}

	clone() {
		const ret = new IDDraggableSwitch();
		ret.mask			= this.mask;
		ret.switch			= this.switch.clone();
		ret.client			= this.client.clone();
		ret.deltaBase		= this.deltaBase.clone();
		ret.dragged			= this.dragged.clone();
		return ret;
	}

	correctionForDOM(event) {
		// イベントが発生したノードの取得
		let node = event.target;
		if(!node) {
			// IE?
			node = event.currentTarget;
		}
		if(node === undefined) {
			return new IDPosition(
				event.clientX,
				event.clientY
			);
		}
		else {
			// ノードのサイズが変更されていることを考慮する
			// width / height が内部のサイズ
			// clientWidth / clientHeight が表示上のサイズ
			return new IDPosition(
				(event.clientX / node.clientWidth)  * node.width,
				(event.clientY / node.clientHeight) * node.height
			);
		}
	}

	setPosition(event) {
		// 強制的にその位置に全ての値をセットする
		const position = this.correctionForDOM(event);
		this.client.set(position);
		this.deltaBase.set(position);
		this.dragged._initIDPosition();
	}

	mousePressed(event) {
		const position = this.correctionForDOM(event);
		const state	= event.button;
		if(state === this.mask) {
			if(!this.switch.ispressed) {
				this.dragged._initIDPosition();
			}
			this.switch.keyPressed();
			this.client.set(position);
			this.deltaBase.set(position);
		}
	}

	mouseReleased(event) {
		const state	= event.button;
		if(state === this.mask) {
			if(this.switch.ispressed) {
				this.switch.keyReleased();
			}
		}
	}

	mouseMoved(event) {
		const position = this.correctionForDOM(event);
		if(this.switch.ispressed) {
			const delta = new IDPosition(position);
			delta.sub(this.deltaBase);
			this.dragged.add(delta);
		}
		this.client.set(position.x ,position.y);
		this.deltaBase.set(position.x ,position.y);
	}

	focusLost() {
		this.switch.focusLost();
	}

	/**
	 * 情報をうけとる。
	 * トリガータイプなど1回目の情報と2回の情報で異なる場合がある。
	 * @param {InputSwitch} c 取得用クラス
	 */
	pickInput(c) {
		if(!(c instanceof IDDraggableSwitch)) {
			throw "IllegalArgumentException";
		}
		this.switch.pickInput(c.switch);
		c.client.set(this.client);
		c.dragged.set(this.dragged);
		this.dragged._initIDPosition();
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class IDMouse {

	constructor() {
		this._initIDMouse();
	}
	
	_initIDMouse() {
		this.left   = new IDDraggableSwitch(IDMouse.MOUSE_EVENTS.BUTTON1_MASK);
		this.center = new IDDraggableSwitch(IDMouse.MOUSE_EVENTS.BUTTON2_MASK);
		this.right  = new IDDraggableSwitch(IDMouse.MOUSE_EVENTS.BUTTON3_MASK);
		this.position = new IDPosition();
		this.wheelrotation = 0;
	}

	clone() {
		const ret = new IDMouse();
		ret.left		= this.left.clone();
		ret.center		= this.center.clone();
		ret.right		= this.right.clone();
		ret.position	= this.position.clone();
		ret.wheelrotation = this.wheelrotation;
		return ret;
	}

	mousePressed(mouseevent) {
		this.left.mousePressed(mouseevent);
		this.center.mousePressed(mouseevent);
		this.right.mousePressed(mouseevent);
	}

	mouseReleased(mouseevent) {
		this.left.mouseReleased(mouseevent);
		this.center.mouseReleased(mouseevent);
		this.right.mouseReleased(mouseevent);
	}

	mouseMoved(mouseevent) {
		this.left.mouseMoved(mouseevent);
		this.center.mouseMoved(mouseevent);
		this.right.mouseMoved(mouseevent);
		this.position.x = this.left.client.x;
		this.position.y = this.left.client.y;
	}

	mouseWheelMoved(event) {
		if(event.wheelDelta !== 0) {
			this.wheelrotation += event.deltaY > 0 ? -1 : 1;
		}
	}

	focusLost() {
		this.left.focusLost();
		this.center.focusLost();
		this.right.focusLost();
	}

	pickInput(c) {
		if(!(c instanceof IDMouse)) {
			throw "IllegalArgumentException";
		}
		this.left.pickInput(c.left);
		this.center.pickInput(c.center);
		this.right.pickInput(c.right);
		c.position.set(this.position);
		c.wheelrotation = this.wheelrotation;
		this.wheelrotation = 0;
	}

	setListenerOnElement(element) {
		const that = this;
		const mousePressed = function(e) {
			that.mousePressed(e);
		};
		const mouseReleased = function(e) {
			that.mouseReleased(e);
		};
		const mouseMoved = function(e) {
			that.mouseMoved(e);
		};
		const focusLost = function() {
			that.focusLost();
		};
		const mouseWheelMoved = function(e) {
			that.mouseWheelMoved(e);
			e.preventDefault();
		};
		const contextMenu  = function(e) {
			e.preventDefault();
		};
		element.style.cursor = "crosshair";
		// 非選択化
		element.style.mozUserSelect			= "none";
		element.style.webkitUserSelect		= "none";
		element.style.msUserSelect			= "none";
		// メニュー非表示化
		element.style.webkitTouchCallout	= "none";
		// タップのハイライトカラーを消す
		element.style.webkitTapHighlightColor = "rgba(0,0,0,0)";

		element.addEventListener("mousedown",	mousePressed, false );
		element.addEventListener("mouseup",		mouseReleased, false );
		element.addEventListener("mousemove",	mouseMoved, false );
		element.addEventListener("mouseout",	focusLost, false );
		element.addEventListener("wheel",		mouseWheelMoved, false );
		element.addEventListener("contextmenu",	contextMenu, false );
	}
}

IDMouse.MOUSE_EVENTS = {
	BUTTON1_MASK : 0,
	BUTTON2_MASK : 1,
	BUTTON3_MASK : 2
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class IDTouch extends IDMouse {

	/**
	 * 指3本まで対応するタッチデバイス
	 * 1本目は左クリックに相当
	 * 2本目は右クリックに相当
	 * 3本目は中央クリックに相当
	 * @returns {IDTouch}
	 */
	constructor() {
		super();
		this._initIDTouch();
	}
	
	_initIDTouch() {
		this.touchcount_to_mask = {
			1 : IDMouse.MOUSE_EVENTS.BUTTON1_MASK,
			2 : IDMouse.MOUSE_EVENTS.BUTTON3_MASK,
			3 : IDMouse.MOUSE_EVENTS.BUTTON2_MASK
		};
		const that = this;
		this._mousePressed = function(e) {
			that.mousePressed(e);
		};
		this._mouseReleased = function(e) {
			that.mouseReleased(e);
		};
		this._mouseMoved = function(e) {
			that.mouseMoved(e);
		};
		this.isdoubletouch	= false;
	}

	_initPosition(mouseevent) {
		this.left.setPosition(mouseevent);
		this.right.setPosition(mouseevent);
		this.center.setPosition(mouseevent);
	}

	_MultiTouchToMouse(touchevent) {
		let x = 0, y = 0;
		// 座標はすべて平均値の位置とします。
		// identifier を使用すれば、1本目、2本目と管理できますが、実装は未対応となっています。
		for(let i = 0;i < touchevent.touches.length; i++) {
			x += touchevent.touches[i].clientX;
			y += touchevent.touches[i].clientY;
		}
		const event = {};
		if(touchevent.touches.length > 0) {
			event.clientX = x / touchevent.touches.length;
			event.clientY = y / touchevent.touches.length;
			event.button  = this.touchcount_to_mask[touchevent.touches.length];
			const touch = touchevent.touches[0];
			event.target  = touch.target ? touch.target : touch.currentTarget;
		}
		else {
			event.clientX = 0;
			event.clientY = 0;
			event.button  = 0;
		}
		event.touchcount = touchevent.touches.length;
		return event;
	}

	_MoveMultiTouch(touchevent) {
		if(touchevent.touches.length === 2) {
			const p1 = touchevent.touches[0];
			const p2 = touchevent.touches[1];
			if(this.isdoubletouch === false) {
				this.isdoubletouch = true;
				this.doubleposition = [];
				this.doubleposition[0] = new IDPosition(p1.clientX, p1.clientY);
				this.doubleposition[1] = new IDPosition(p2.clientX, p2.clientY);
			}
			else {
				// 前回との2点間の距離の増加幅を調べる
				// これによりピンチイン／ピンチアウト操作がわかる。
				const newp1 = new IDPosition(p1.clientX, p1.clientY);
				const newp2 = new IDPosition(p2.clientX, p2.clientY);
				const x = IDPosition.norm(this.doubleposition[0], this.doubleposition[1]) - IDPosition.norm(newp1, newp2);
				this.doubleposition[0] = newp1;
				this.doubleposition[1] = newp2;
				// そんなにずれていなかったら無視する
				const r = (Math.abs(x) < 10) ? Math.abs(x) * 0.01 : 0.5;
				this.wheelrotation += (x > 0 ? -1 : 1) * r;
			}
		}
		else {
			this.isdoubletouch === false;
		}
	}

	_actFuncMask(mouseevent, funcOn, funcOff, target) {
		for(const key in IDMouse.MOUSE_EVENTS) {
			mouseevent.button = IDMouse.MOUSE_EVENTS[key];
			if(IDMouse.MOUSE_EVENTS[key] === target) {
				funcOn(mouseevent);
			}
			else {
				funcOff(mouseevent);
			}
		}
	}

	touchStart(touchevent) {
		const mouseevent = this._MultiTouchToMouse(touchevent);
		// タッチした時点ですべての座標を初期化する
		this._initPosition(mouseevent);
		this._actFuncMask(
			mouseevent,
			this._mousePressed,
			this._mouseReleased,
			mouseevent.button
		);
	}
	
	touchEnd(touchevent) {
		const mouseevent = this._MultiTouchToMouse(touchevent);
		this._actFuncMask(
			mouseevent,
			this._mouseReleased,
			this._mouseReleased,
			mouseevent.button
		);
	}
	
	touchMove(touchevent) {
		this._MoveMultiTouch(touchevent);
		const mouseevent = this._MultiTouchToMouse(touchevent);
		this._actFuncMask(
			mouseevent,
			this._mouseMoved,
			this._mouseMoved,
			mouseevent.button
		);
	}

	setListenerOnElement(element) {
		super.setListenerOnElement(element);

		const that = this;
		const touchStart = function(touchevent) {
			that.touchStart(touchevent);
		};
		const touchEnd = function(touchevent) {
			that.touchEnd(touchevent);
		};
		const touchMove = function(touchevent) {
			that.touchMove(touchevent);
			// スクロール禁止
			touchevent.preventDefault();
		};

		element.addEventListener("touchstart",	touchStart, false );
		element.addEventListener("touchend",	touchEnd, false );
		element.addEventListener("touchmove",	touchMove, false );
		element.addEventListener("touchcancel",	touchEnd, false );
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const IDTools = {
	
	/**
	 * 縦のスクロールバーを削除
	 */
	noScroll : function() {
		// 縦のスクロールバーを削除
		const main = function() {
			// body
			document.body.style.height			= "100%";
			document.body.style.overflow		= "hidden";
			// html
			document.documentElement.height		= "100%";
			document.documentElement.overflow	= "hidden";
		};
		window.addEventListener("load", main, false);
	}
	
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const Device = {
	DraggableSwitch		: IDDraggableSwitch,
	Mouse				: IDMouse,
	Position			: IDPosition,
	Switch				: IDSwitch,
	Touch				: IDTouch,
	Tools				: IDTools
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const BlendFunctions = {
	
	ipLerp : function(v0, v1, x) {
		const delta = v1.subColor(v0);
		return v0.addColor(delta.mul(x));
	},
	
	brendNone : function(x, y, alpha) {
		return y;
	},
	
	brendAlpha : function(x, y, alpha) {
		const x_alpha = x.getBlendAlpha();
		const y_alpha = y.getBlendAlpha() * alpha;
		x = BlendFunctions.ipLerp(x, y, y_alpha);
		return x.setBlendAlpha(Math.max(x_alpha, y_alpha));
	},
	
	brendAdd : function(x, y, alpha) {
		const x_alpha = x.getBlendAlpha();
		const y_alpha = y.getBlendAlpha() * alpha;
		x = x.addColor(y.mul(y_alpha));
		return x.setBlendAlpha(Math.max(x_alpha, y_alpha));
	},
	
	brendSub : function(x, y, alpha) {
		const new_alpha = x.getBlendAlpha();
		const y_alpha = y.getBlendAlpha() * alpha;
		x = x.subColor(y.mul(y_alpha));
		return x.setBlendAlpha(new_alpha);
	},
	
	brendRevSub : function(x, y, alpha) {
		const new_alpha = y.getBlendAlpha();
		const x_alpha = x.getBlendAlpha() * alpha;
		y = y.subColor(x.mul(x_alpha));
		return y.setBlendAlpha(new_alpha);
	},
	
	brendMul : function(x, y, alpha) {
		const new_alpha = x.getBlendAlpha();
		const y_alpha = y.getBlendAlpha() * alpha;
		x = x.mulColor(y.mul(y_alpha).div(255.0));
		return x.setBlendAlpha(new_alpha);
	}
};

class ImgBlend {

	constructor(mode) {
		this.blendfunc = BlendFunctions.brendNone;
		if(arguments.length === 1) {
			this.setBlendMode(mode);
		}
	}
	
	clone() {
		return new ImgBlend(this.blendmode);
	}
	
	/**
	 * このデータへ書き込む際に、書き込み値をどのようなブレンドで反映させるか設定する
	 * @param {ImgData.brendtype} _blendtype
	 * @returns {undefined}
	 */
	setBlendMode(mode) {
		this.blendmode = mode;
		if(mode === ImgBlend.MODE.NONE) {
			this.blendfunc = BlendFunctions.brendNone;
		}
		else if(mode === ImgBlend.MODE.ALPHA) {
			this.blendfunc = BlendFunctions.brendAlpha;
		}
		else if(mode === ImgBlend.MODE.ADD) {
			this.blendfunc = BlendFunctions.brendAdd;
		}
		else if(mode === ImgBlend.MODE.SUB) {
			this.blendfunc = BlendFunctions.brendSub;
		}
		else if(mode === ImgBlend.MODE.REVSUB) {
			this.blendfunc = BlendFunctions.brendRevSub;
		}
		else if(mode === ImgBlend.MODE.MUL) {
			this.blendfunc = BlendFunctions.brendMul;
		}
	}
	
	blend(color1, color2, alpha) {
		return this.blendfunc(color1, color2, alpha);
	}
	
}

ImgBlend.MODE = {
	NONE				: "NONE",
	ALPHA				: "ALPHA",
	ADD					: "ADD",
	SUB					: "SUB",
	REVSUB				: "REVSUB",
	MUL					: "MUL"
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ImgColor {
	
	/**
	 * ImgColor 抽象クラス
	 */
	constructor() {	
	}

	getColor() {
		return null;
	}
	
	clone() {
		return null;
	}
	
	zero() {
		return null;
	}
	
	one() {
		return null;
	}
	
	add() {
		return null;
	}
	
	sub() {
		return null;
	}
	
	mul() {
		return null;
	}
	
	div() {
		return null;
	}
	
	exp() {
		return null;
	}
	
	log() {
		return null;
	}
	
	pow() {
		return null;
	}
	
	baselog() {
		return null;
	}
	
	table() {
		return null;
	}
	
	random() {
		return null;
	}
	
	luminance() {
		return null;
	}
	
	addColor() {
		return null;
	}
	
	subColor() {
		return null;
	}
	
	mulColor() {
		return null;
	}
	
	divColor() {
		return null;
	}
	
	maxColor() {
		return null;
	}
	
	minColor() {
		return null;
	}
	
	norm() {
		return null;
	}
	
	normFast() {
		return null;
	}
	
	normColor(c, normType) {
		return this.subColor(c).norm(normType);
	}
	
	normColorFast(c, normType) {
		return this.subColor(c).normFast(normType);
	}
	
	getBlendAlpha() {
		return null;
	}
	
	setBlendAlpha() {
		return null;
	}
	
	exchangeColorAlpha() {
		return null;
	}
	
	equals() {
		return false;
	}
	
	/**
	 * パレットから最も近い色を2色探します。
	 * @param {Array} palettes
	 * @param {ImgColor.normType} normType
	 * @returns {object}
	 */
	searchColor(palettes, normType) {
		let norm = 0;
		let c1_norm_max	= 0x7fffffff;
		let c1_color	= null;
		let c2_norm_max	= 0x7ffffffe;
		let c2_color	= null;
		for(let i = 0; i < palettes.length; i++) {
			norm = this.normColorFast(palettes[i], normType);
			if(norm < c2_norm_max) {
				if(norm < c1_norm_max) {
					c2_norm_max	= c1_norm_max;
					c2_color	= c1_color;
					c1_norm_max	= norm;
					c1_color	= palettes[i];
				}
				else {
					c2_norm_max	= norm;
					c2_color	= palettes[i];
				}
			}
		}
		return {
			c1 : {
				color : c1_color,
				norm  : c1_norm_max
			},
			c2 : {
				color : c2_color,
				norm  : c2_norm_max
			}
		};
	}
	
}

ImgColor.NORM_MODE = {
	/**
	 * マンハッタン距離を使用する
	 * @type Number
	 */
	MANHATTEN : 0,

	/**
	 * ユーグリッド距離を使用する
	 * @type Number
	 */
	EUGRID : 1
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ImgWrapInside {
	
	constructor(width, height) {
		if(arguments.length === 2) {
			this.setSize(width, height);
		}
		else {
			this.setSize(0, 0);
		}
	}
	
	clone() {
		return new ImgWrapInside(this.width, this.height);
	}
	
	setSize(width, height) {
		this.width  = width;
		this.height = height;
	}
	
	getPixelPosition(x, y) {
		x = ~~Math.floor(x);
		y = ~~Math.floor(y);
		if((x >= 0) && (y >= 0) && (x < this.width) && (y < this.height)) {
			return [x, y];
		}
		else {
			return null;
		}
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ImgWrapClamp extends ImgWrapInside {
		
	constructor(width, height) {
		super(width, height);
	}
	
	clone() {
		return new ImgWrapClamp(this.width, this.height);
	}
	
	getPixelPosition(x, y) {
		x = ~~Math.floor(x);
		y = ~~Math.floor(y);
		if((x >= 0) && (y >= 0) && (x < this.width) && (y < this.height)) {
			return [x, y];
		}
		// はみ出た場合は中にむりやり収める
		x = ~~Math.floor(Math.min(Math.max(0, x), this.width  - 1));
		y = ~~Math.floor(Math.min(Math.max(0, y), this.height - 1));
		return [x, y];
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ImgWrapRepeat extends ImgWrapInside {
		
	constructor(width, height) {
		super(width, height);
	}
	
	clone() {
		return new ImgWrapRepeat(this.width, this.height);
	}
	
	getPixelPosition(x, y) {
		x = ~~Math.floor(x);
		y = ~~Math.floor(y);
		if((x >= 0) && (y >= 0) && (x < this.width) && (y < this.height)) {
			return [x, y];
		}
		const x_times = Math.floor(x / this.width);
		const y_times = Math.floor(y / this.height);
		// リピート
		x -= Math.floor(this.width  * x_times);
		y -= Math.floor(this.height * y_times);
		if(x < 0) {
			x += this.width;
		}
		if(y < 0) {
			y += this.height;
		}
		return [x, y];
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ImgWrap {
	
	constructor(mode, width, height) {
		this.width	= 1;
		this.height	= 1;
		if(arguments.length >= 2) {
			this.width	= width;
			this.height	= height;
		}
		if(arguments.length == 3) {
			this.setImgWrapMode(mode);
		}
		else {
			this.setImgWrapMode(ImgWrap.MODE.INSIDE);
		}
	}
	
	clone() {
		return new ImgWrap(this.wrapmode, this.width, this.height);
	}
	
	setImgWrapMode(mode) {
		this.wrapmode = mode;
		if(mode === ImgWrap.MODE.INSIDE) {
			this.wrap = new ImgWrapInside(this.width, this.height);
		}
		else if(mode === ImgWrap.MODE.CLAMP) {
			this.wrap = new ImgWrapClamp(this.width, this.height);
		}
		else if(mode === ImgWrap.MODE.REPEAT) {
			this.wrap = new ImgWrapRepeat(this.width, this.height);
		}
	}
	
	setSize(width, height) {
		this.width = width;
		this.height = height;
		if(this.wrap) {
			this.wrap.setSize(width, height);
		}
	}
	
	getPixelPosition(x, y) {
		return this.wrap.getPixelPosition(x, y);
	}	
}

ImgWrap.MODE = {
	INSIDE			: "INSIDE",
	CLAMP			: "CLAMP",
	REPEAT			: "REPEAT"
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const InterpolationFunctions = {
	
	ipLerp : function(v0, v1, x) {
		const delta = v1.subColor(v0);
		return v0.addColor(delta.mul(x));
	},
	
	ipCosine : function(v0, v1, x) {
		return InterpolationFunctions.ipLerp(v0, v1,((1.0 - Math.cos(Math.PI * x)) * 0.5));
	},
	
	ipHermite2p3 : function(v0, v1, x) {
		return InterpolationFunctions.ipLerp(v0, v1, (x * x * (3.0 - 2.0 * x)));
	},
	
	ipHermite2p5 : function(v0, v1, x) {
		return InterpolationFunctions.ipLerp(v0, v1, (x * x * x * (6.0 * x * x - 15.0 * x + 10.0)));
	},
	
	ipHermite4p : function(v0, v1, v2, v3, x) {
		const P = v3.subColor(v2).subColor(v0.subColor(v1));
		const Q = v0.subColor(v1).subColor(P);
		const R = v2.subColor(v0);
		const S = v1;
		return  P.mul(x * x * x).addColor(Q.mul(x * x)).addColor(R.mul(x)).addColor(S);
	},
	
	funcInBicubic : function(d, a) {
		if(d <= 1.0) {
			return 1.0 - ((a + 3.0) * d * d) + ((a + 2.0) * d * d * d);
		}
		else {
			return (-4.0 * a) + (8.0 * a * d) - (5.0 * a * d * d) + (a * d * d * d);
		}
	},
	
	ipBicubic : function(v0, v1, v2, v3, x, a) {
		const w0 = InterpolationFunctions.funcInBicubic(x + 1, a);
		const w1 = InterpolationFunctions.funcInBicubic(x    , a);
		const w2 = InterpolationFunctions.funcInBicubic(1 - x, a);
		const w3 = InterpolationFunctions.funcInBicubic(2 - x, a);
		const c = v0.mul(w0).addColor(v1.mul(w1)).addColor(v2.mul(w2)).addColor(v3.mul(w3));
		return c.mul(1.0 / (w0 + w1 + w2 + w3));
	},
	
	ipBicubicSoft : function(v0, v1, v2, v3, x) {
		return InterpolationFunctions.ipBicubic(v0, v1, v2, v3, x, -0.5);
	},
	
	ipBicubicNormal : function(v0, v1, v2, v3, x) {
		return InterpolationFunctions.ipBicubic(v0, v1, v2, v3, x, -1.0);
	},
	
	ipBicubicSharp : function(v0, v1, v2, v3, x) {
		return InterpolationFunctions.ipBicubic(v0, v1, v2, v3, x, -1.2);
	},
	
	ipBicubic2D : function(va, nx, ny, a) {
		let output = va[0][0].zero();
		let x, y, y_weight, weight, sum = 0.0;
		for(y = 0; y < 4; y++) {
			y_weight = InterpolationFunctions.funcInBicubic(Math.abs(- ny + y - 1), a);
			for(x = 0; x < 4; x++) {
				weight  = InterpolationFunctions.funcInBicubic(Math.abs(- nx + x - 1), a);
				weight *= y_weight;
				sum    += weight;
				output = output.addColor(va[y][x].mul(weight));
			}
		}
		output = output.mul(1.0 / sum);
		return output;
	},
	
	ipBicubic2DSoft : function(va, nx, ny) {
		return InterpolationFunctions.ipBicubic2D(va, nx, ny, -0.5);
	},
	
	ipBicubic2DNormal : function(va, nx, ny) {
		return InterpolationFunctions.ipBicubic2D(va, nx, ny, -1.0);
	},
	
	ipBicubic2DSharp : function(va, nx, ny) {
		return InterpolationFunctions.ipBicubic2D(va, nx, ny, -1.2);
	}
};

class ImgInterpolation {
		
	constructor(mode) {
		if(arguments.length === 0) {
			mode = ImgInterpolation.MODE.NEAREST_NEIGHBOR;
		}
		this.setInterpolationMode(mode);
	}
	
	clone() {
		return new ImgInterpolation(this.ipmode);
	}
	
	/**
	 * 実数で色を選択した場合に、どのように色を補完するか選択する
	 * @param {ImgData.filtermode} ipmode
	 * @returns {undefined}
	 */
	setInterpolationMode(ipmode) {
		this.ipmode	= ipmode;
		if(ipmode === ImgInterpolation.MODE.NEAREST_NEIGHBOR) {
			this.ipfunc	= InterpolationFunctions.ipLerp;
			this.ipn	= 1;
		}
		else if(ipmode === ImgInterpolation.MODE.BILINEAR) {
			this.ipfunc = InterpolationFunctions.ipLerp;
			this.ipn	= 2;
		}
		else if(ipmode === ImgInterpolation.MODE.COSINE) {
			this.ipfunc = InterpolationFunctions.ipCosine;
			this.ipn	= 2;
		}
		else if(ipmode === ImgInterpolation.MODE.HERMITE4_3) {
			this.ipfunc = InterpolationFunctions.ipHermite2p3;
			this.ipn	= 2;
		}
		else if(ipmode === ImgInterpolation.MODE.HERMITE4_5) {
			this.ipfunc = InterpolationFunctions.ipHermite2p5;
			this.ipn	= 2;
		}
		else if(ipmode === ImgInterpolation.MODE.HERMITE16) {
			this.ipfunc = InterpolationFunctions.ipHermite4p;
			this.ipn	= 4;
		}
		else if(ipmode === ImgInterpolation.MODE.BICUBIC) {
			this.ipfunc = InterpolationFunctions.ipBicubic2DNormal;
			this.ipn	= 16;
		}
		else if(ipmode === ImgInterpolation.MODE.BICUBIC_SOFT) {
			this.ipfunc = InterpolationFunctions.ipBicubicSoft;
			this.ipn	= 4;
		}
		else if(ipmode === ImgInterpolation.MODE.BICUBIC_NORMAL) {
			this.ipfunc = InterpolationFunctions.ipBicubicNormal;
			this.ipn	= 4;
		}
		else if(ipmode === ImgInterpolation.MODE.BICUBIC_SHARP) {
			this.ipfunc = InterpolationFunctions.ipBicubicSharp;
			this.ipn	= 4;
		}
	}
	
	/**
	 * x と y の座標にある色を取得する。
	 * x, y が実数かつ画像の範囲内を保証していない場合でも使用可能
	 * @param {type} x
	 * @param {type} y
	 * @returns {ImgColor}
	 */
	getColor(imgdata, x, y) {
		const rx = Math.floor(x);
		const ry = Math.floor(y);
		if(	(this.ipn === 1) ||
			((rx === x) && (ry === y))) {
			return imgdata.getPixel(rx, ry);
		}
		else if(this.ipn === 2) {
			const nx = x - rx;
			const ny = y - ry;
			let c0, c1;
			c0 = imgdata.getPixel(rx    , ry    );
			c1 = imgdata.getPixel(rx + 1, ry    );
			const n0  = this.ipfunc(c0, c1 , nx);
			c0 = imgdata.getPixel(rx    , ry + 1);
			c1 = imgdata.getPixel(rx + 1, ry + 1);
			const n1  = this.ipfunc(c0, c1 , nx);
			return this.ipfunc( n0, n1, ny );
		}
		else if(this.ipn === 4) {
			const nx = x - rx;
			const ny = y - ry;
			let c0, c1, c2, c3;
			c0 = imgdata.getPixel(rx - 1, ry - 1);
			c1 = imgdata.getPixel(rx    , ry - 1);
			c2 = imgdata.getPixel(rx + 1, ry - 1);
			c3 = imgdata.getPixel(rx + 2, ry - 1);
			const n0 = this.ipfunc(c0, c1, c2, c3, nx);
			c0 = imgdata.getPixel(rx - 1, ry    );
			c1 = imgdata.getPixel(rx    , ry    );
			c2 = imgdata.getPixel(rx + 1, ry    );
			c3 = imgdata.getPixel(rx + 2, ry    );
			const n1 = this.ipfunc(c0, c1, c2, c3, nx);
			c0 = imgdata.getPixel(rx - 1, ry + 1);
			c1 = imgdata.getPixel(rx    , ry + 1);
			c2 = imgdata.getPixel(rx + 1, ry + 1);
			c3 = imgdata.getPixel(rx + 2, ry + 1);
			const n2 = this.ipfunc(c0, c1, c2, c3, nx);
			c0 = imgdata.getPixel(rx - 1, ry + 2);
			c1 = imgdata.getPixel(rx    , ry + 2);
			c2 = imgdata.getPixel(rx + 1, ry + 2);
			c3 = imgdata.getPixel(rx + 2, ry + 2);
			const n3 = this.ipfunc(c0, c1, c2, c3, nx);
			return this.ipfunc( n0, n1, n2, n3, ny );
		}
		else if(this.ipn === 16) {
			const nx = x - rx;
			const ny = y - ry;
			let ix, iy;
			const cdata = [];
			for(iy = -1; iy < 3; iy++) {
				const cx = [];
				for(ix = -1; ix < 3; ix++) {
					cx[cx.length] = imgdata.getPixel(rx + ix, ry + iy);
				}
				cdata[cdata.length] = cx;
			}
			return this.ipfunc( cdata, nx, ny );
		}
		return null;
	}
}

ImgInterpolation.MODE = {
	NEAREST_NEIGHBOR	: "NEAREST_NEIGHBOR",
	BILINEAR			: "BILINEAR",
	COSINE				: "COSINE",
	HERMITE4_3			: "HERMITE4_3",
	HERMITE4_5			: "HERMITE4_5",
	HERMITE16			: "HERMITE16",
	BICUBIC				: "BICUBIC",
	BICUBIC_SOFT		: "BICUBIC_SOFT",
	BICUBIC_NORMAL		: "BICUBIC_NORMAL",
	BICUBIC_SHARP		: "BICUBIC_SHARP"
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ImgFIRMatrix {
	
	/**
	 * 画像処理に使用する配列のフィルタ用クラス
	 * @param {type} matrix 2次元配列
	 * @returns {ImgFIRMatrix}
	 */
	constructor(matrix) {
		this.height = matrix.length;
		this.width  = matrix[0].length;
		this.matrix = [];
		let i;
		for(i = 0; i < matrix.length; i++) {
			this.matrix[i] = matrix[i].slice();
		}
	}
	
	clone() {
		return new ImgFIRMatrix(this.matrix);
	}
	
	rotateEdge(val) {
		// 周囲の値を時計回りに回転させます。
		const m = this.clone();

		const x = [], y = [];
		let i, j;
		{
			// 上側
			for(i = 0;i < this.width - 1; i++) {
				x.push(m.matrix[0][i]);
			}
			// 右側
			for(i = 0;i < this.height - 1; i++) {
				x.push(m.matrix[i][this.width - 1]);
			}
			// 下側
			for(i = this.width - 1;i > 0; i--) {
				x.push(m.matrix[this.height - 1][i]);
			}
			// 左側
			for(i = this.height - 1;i > 0; i--) {
				x.push(m.matrix[i][0]);
			}
		}
		for(i = 0;i < x.length; i++) {
			// かならず正とする
			y[i] = x[((i + val) % x.length + x.length) % x.length];
		}
		{
			// 上側
			m.matrix[0] = y.slice(0, this.width);
			// 右側
			for(i = 0;i < this.height; i++) {
				m.matrix[i][this.width - 1] = y[this.width + i];
			}
			// 下側
			m.matrix[this.height - 1] = y.slice(
				this.width + this.height - 2,
				this.width + this.height - 2 + this.width ).reverse();
			// 左側
			for(i = this.height - 1, j = 0;i > 0; i--, j++) {
				m.matrix[i][0] = y[this.width + this.height + this.width - 3 + j];
			}
		}
		return m;
	}
	
	mul(val) {
		const m = this.clone();
		let x, y;
		for(y = 0; y < m.height; y++) {
			for(x = 0; x < m.width; x++) {
				m.matrix[y][x] *= val;
			}
		}
		return m;
	}
	
	sum() {
		let sum = 0;
		let x, y;
		for(y = 0; y < this.height; y++) {
			for(x = 0; x < this.width; x++) {
				sum += this.matrix[y][x];
			}
		}
		return sum;
	}
	
	normalize() {
		return this.clone().mul(1.0 / this.sum());
	}
	
	addCenter(val) {
		const m = this.clone();
		m.matrix[m.height >> 1][m.width >> 1] += val;
		return m;
	}
	
	static makeLaplacianFilter() {
		return new ImgFIRMatrix([
			[ 0.0, -1.0, 0.0],
			[-1.0,  4.0,-1.0],
			[ 0.0, -1.0, 0.0]
		]);
	}
	
	static makeSharpenFilter(power) {
		const m = ImgFIRMatrix.makeLaplacianFilter();
		return m.mul(power).addCenter(1.0);
	}
	
	static makeBlur(width, height) {
		const m = [];
		const value = 1.0 / (width * height);
		let x, y;
		for(y = 0; y < height; y++) {
			m[y] = [];
			for(x = 0; x < width; x++) {
				m[y][x] = value;
			}
		}
		return new ImgFIRMatrix(m);
	}
	
	static makeGaussianFilter(width, height, sd) {
		if(sd === undefined) {
			sd = 1.0;
		}
		const m = [];
		let i, x, y;
		const v = [];
		const n = Math.max(width, height);
		let s = - Math.floor(n / 2);
		for(i = 0; i < n; i++, s++) {
			v[i] = Math.exp( - (s * s) / ((sd * sd) * 2.0) );
		}
		for(y = 0; y < height; y++) {
			m[y] = [];
			for(x = 0; x < width; x++) {
				m[y][x] = v[x] * v[y];
			}
		}
		return new ImgFIRMatrix(m).normalize();
	}

	static makeCircle(r) {
		const m = [];
		const radius	= r * 0.5;
		const center	= r >> 1;
		let x, y;
		for(y = 0; y < r; y++) {
			m[y] = [];
			for(x = 0; x < r; x++) {
				if (Math.sqrt(	(center - x) * (center - x) +
								(center - y) * (center - y)) < radius) {
					m[y][x] = 1.0;
				}
				else {
					m[y][x] = 0.0;
				}
			}
		}
		return new ImgFIRMatrix(m).normalize();
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ImgData {
	
	/**
	 * 画像データクラス
	 * ImgDataRGBA   32bit整数 0xRRGGBBAA で管理
	 * ImgDataY 32bit浮動小数点で管理
	 */
	constructor() {
		this.width  = 1;
		this.height = 1;
		this.globalAlpha = 1.0;
		this.data	= null;
		this.blend  = new ImgBlend(ImgBlend.MODE.NONE);
		this.wrap   = new ImgWrap(ImgWrap.MODE.INSIDE, this.width, this.height);
		this.ip     = new ImgInterpolation(ImgInterpolation.MODE.NEAREST_NEIGHBOR);
		if(arguments.length === 1) {
			const image = arguments[0];
			this.putImageData(image);
		}
		else if(arguments.length === 2) {
			const width  = arguments[0];
			const height = arguments[1];
			this.setSize(width, height);
		}
	}
	
	putImageData(imagedata) {
	}
	
	/**
	 * データのサイズを変更します。ただし、変更後が中身が初期化されます。
	 * 以前と同一の画像の場合は初期化されません。
	 * @param {type} width
	 * @param {type} height
	 * @returns {undefined}
	 */
	setSize(width, height) {
		if((this.width === width) && (this.height === height)) {
			return;
		}
		this.width	= width;
		this.height	= height;
		this.wrap.setSize(width, height);
	}
	
	/**
	 * 内部の情報をxにコピーする
	 * @param {type} x
	 * @returns {undefined}
	 */
	_copyData(x) {
		x.blend  = this.blend.clone();
		x.wrap   = this.wrap.clone();
		x.ip     = this.ip.clone();
		x.setSize(this.width, this.height);
		x.data.set(this.data);
		x.globalAlpha = this.globalAlpha;
	}
	
	clone() {
		const x = new ImgData();
		this._copyData(x);
		return x;
	}

	/**
	 * 画面外の色を選択する方法を選ぶ
	 * @param {ImgData.MODE_WRAP} _wrapmode
	 * @returns {undefined}
	 */
	setWrapMode(wrapmode) {
		this.wrap.setImgWrapMode(wrapmode);
	}
	
	/**
	 * 画面外の色を選択する方法を取得する
	 * @returns {ImgData.MODE_WRAP}
	 */
	getWrapMode() {
		return this.wrap.wrapmode;
	}
	
	/**
	 * 実数で色を選択した場合に、どのように色を補完するか選択する
	 * @param {ImgData.MODE_IP} ipmode
	 * @returns {undefined}
	 */
	setInterpolationMode(ipmode) {
		this.ip.setInterpolationMode(ipmode);
	}

	/**
	 * 実数で色を選択した場合に、どのように色を補完するか取得する
	 * @returns {ImgData.MODE_IP}
	 */
	getInterpolationMode() {
		return this.ip.ipmode;
	}

	/**
	 * このデータへ書き込む際に、書き込み値をどのようなブレンドで反映させるか設定する
	 * @param {ImgData.MODE_BLEND} blendmode
	 * @returns {undefined}
	 */
	setBlendType(blendmode) {
		this.blend.setBlendMode(blendmode);
	}

	/**
	 * このデータへ書き込む際に、書き込み値をどのようなブレンドで反映させるか取得する
	 * @returns {ImgData.MODE_BLEND}
	 */
	getBlendType() {
		return this.blend.blendmode;
	}
	
	/**
	 * 中身をクリアします。
	 * @returns {undefined}
	 */
	clear() {
		if(this.data) {
			this.data.fill(0);
		}
	}

	/**
	 * x と y の座標にある色を取得する。
	 * x, y が整数かつ画像の範囲内を保証している場合に使用可能
	 * @param {number} x
	 * @param {number} y
	 * @returns {ImgColorRGBA}
	 */
	getPixelInside(x, y) {
		return null;
	}

	/**
	 * x と y の座標にある色を設定する。
	 * x, y が整数かつ画像の範囲内を保証している場合に使用可能
	 * @param {type} x
	 * @param {type} y
	 * @param {type} color
	 * @returns {undefined}
	 */
	setPixelInside(x, y, color) {
	}

	/**
	 * x と y の座標にある色を取得する。
	 * x, y が整数かつ画像の範囲内を保証していない場合に使用可能
	 * @param {type} x
	 * @param {type} y
	 * @returns {ImgColor}
	 */
	getPixel(x, y) {
		const p = this.wrap.getPixelPosition(x, y);
		if(p) {
			return this.getPixelInside(p[0], p[1]);
		}
		return this.getPixelInside(0, 0).zero();
	}

	/**
	 * x と y の座標にある色を設定する。
	 * x, y が整数かつ画像の範囲内を保証していない場合に使用可能
	 * @param {type} x
	 * @param {type} y
	 * @param {type} color
	 * @returns {undefined}
	 */
	setPixel(x, y, color) {
		const p = this.wrap.getPixelPosition(x, y);
		if(p) {
			if(this._blendtype === ImgData.MODE_BLEND.NONE) {
				this.setPixelInside(p[0], p[1], color);
			}
			else {
				const mycolor = this.getPixelInside(p[0], p[1]);
				const newcolor = this.blend.blend(mycolor, color, this.globalAlpha);
				this.setPixelInside(p[0], p[1], newcolor);
			}
		}
	}
	
	/**
	 * x と y の座標にある色を取得する。
	 * x, y が実数かつ画像の範囲内を保証していない場合でも使用可能
	 * @param {type} x
	 * @param {type} y
	 * @returns {ImgColor}
	 */
	getColor(x, y) {
		return this.ip.getColor(this, x, y);
	}

	/**
	 * 座標系は、0-1を使用して、テクスチャとみたてて色を取得します。
	 * @param {type} u
	 * @param {type} v
	 * @returns {ImgColor}
	 */
	getColorUV(u, v) {
		return this.getColor(u * this.width, v * this.height);
	}

	/**
	 * x と y の座標にある色を設定する。
	 * x, y が実数かつ画像の範囲内を保証していない場合でも使用可能
	 * @param {type} x
	 * @param {type} y
	 * @param {type} color
	 * @returns {undefined}
	 */
	setColor(x, y, color) {
		this.setPixel(Math.floor(x), Math.floor(y), color);
	}
	
	/**
	 * Canvas型の drawImage と同じ使用方法で ImgData をドローする
	 * ImgDataRGBA データの上には、ImgDataRGBA のみ書き込み可能
	 * ImgDataY    データの上には、ImgDataY    のみ書き込み可能
	 * @param {ImgData} image
	 * @param {number} sx
	 * @param {number} sy
	 * @param {number} sw
	 * @param {number} sh
	 * @param {number} dx
	 * @param {number} dy
	 * @param {number} dw
	 * @param {number} dh
	 * @returns {undefined}
	 */
	drawImgData(image, sx, sy, sw, sh, dx, dy, dw, dh) {
		if(!(image instanceof ImgData)) {
			throw "IllegalArgumentException";
		}
		if(arguments.length === 3) {
			dx = sx;
			dy = sy;
			dw = image.width;
			dh = image.height;
			sx = 0;
			sy = 0;
			sw = image.width;
			sh = image.height;
		}
		else if(arguments.length === 5) {
			dx = sx;
			dy = sy;
			dw = sw;
			dh = sh;
			sx = 0;
			sy = 0;
			sw = image.width;
			sh = image.height;
		}
		else if(arguments.length === 9) ;
		else {
			throw "IllegalArgumentException";
		}
		const delta_w = sw / dw;
		const delta_h = sh / dh;
		let src_x, src_y;
		let dst_x, dst_y;

		src_y = sy;
		for(dst_y = dy; dst_y < (dy + dh); dst_y++) {
			src_x = sx;
			for(dst_x = dx; dst_x < (dx + dw); dst_x++) {
				const color = image.getColor(src_x, src_y);
				if(color) {
					this.setColor(dst_x, dst_y, color);
				}
				src_x += delta_w;
			}
			src_y += delta_h;
		}
	}

	/**
	 * 全画素に指定した関数の操作を行う
	 * @param {function} callback callback(color, x, y, this) 実行したいコールバック関数
	 * @returns {undefined}
	 */
	forEach(callback) {
		let x = 0, y = 0;
		for(; y < this.height; y++) {
			for(x = 0; x < this.width; x++) {
				callback(this.getPixelInside(x, y), x, y, this);
			}
		}
	}
	
	/**
	 * ImgFIRMatrix を使用して畳込みを行う
	 * @param {ImgFIRMatrix} matrix
	 * @returns {undefined}
	 */
	convolution(matrix) {
		if(!(matrix instanceof ImgFIRMatrix)) {
			throw "IllegalArgumentException";
		}
		let x, y, fx, fy, mx, my;
		const fx_offset	= - (matrix.width  >> 1);
		const fy_offset	= - (matrix.height >> 1);
		const m			= matrix.matrix;
		const zero_color  = this.getPixelInside(0, 0).zero();
		const bufferimage = this.clone();
		for(y = 0; y < this.height; y++) {
			for(x = 0; x < this.width; x++) {
				let newcolor = zero_color;
				fy = y + fy_offset;
				for(my = 0; my < matrix.height; my++, fy++) {
					fx = x + fx_offset;
					for(mx = 0; mx < matrix.width; mx++, fx++) {
						const color = bufferimage.getPixel(fx, fy);
						if(color) {
							newcolor = newcolor.addColor(color.mul(m[my][mx]));
						}
					}
				}
				this.setPixelInside(x, y, newcolor);
			}
		}
	}

	/**
	 * ImgFIRMatrix を使用してバイラテラルフィルタ的な畳込みを行う
	 * 対象の色に近いほど、フィルタをかける処理となる
	 * @param {ImgFIRMatrix} matrix
	 * @param {number} p 0.0～1.0 強度
	 * @returns {undefined}
	 */
	convolutionBilateral(matrix, p) {
		if(!(matrix instanceof ImgFIRMatrix)) {
			throw "IllegalArgumentException";
		}
		if(p === undefined) {
			p = 0.8;
		}
		let x, y, fx, fy, mx, my;
		const fx_offset	= - (matrix.width  >> 1);
		const fy_offset	= - (matrix.height >> 1);
		const m			= matrix.matrix;
		const zero_color  = this.getPixelInside(0, 0).zero();
		const bufferimage = this.clone();
		// -0.010 - -0.001
		const rate = - (1.0 - p) * 0.01 - 0.001;
		const exptable = [];
		for(x = 0; x < 256 * 3; x++) {
			exptable[x] = Math.exp(x * x * rate);
		}
		for(y = 0; y < this.height; y++) {
			for(x = 0; x < this.width; x++) {
				const thiscolor = bufferimage.getPixel(x, y);
				const thisalpha = thiscolor.getBlendAlpha();
				let sumfilter = 0;
				let newcolor  = zero_color;
				const m2 = [];
				fy = y + fy_offset;
				for(my = 0; my < matrix.height; my++, fy++) {
					fx = x + fx_offset;
					m2[my] = [];
					for(mx = 0; mx < matrix.width; mx++, fx++) {
						const tgtcolor = bufferimage.getPixel(fx, fy);
						if(!tgtcolor) {
							continue;
						}
						const newfilter = exptable[Math.floor(tgtcolor.normColor(thiscolor, ImgColor.NORM_MODE.EUGRID))] * m[my][mx];
						newcolor = newcolor.addColor(tgtcolor.mul(newfilter));
						sumfilter += newfilter;
					}
				}
				newcolor = newcolor.div(sumfilter).setBlendAlpha(thisalpha);
				this.setPixelInside(x, y, newcolor);
			}
		}
	}

	/**
	 * ImgFIRMatrix を使用して指数関数空間で畳込みを行う
	 * @param {ImgFIRMatrix} matrix
	 * @param {number} e 底(1.01-1.2)
	 * @returns {undefined}
	 */
	convolutionExp(matrix, e) {
		if(!(matrix instanceof ImgFIRMatrix)) {
			throw "IllegalArgumentException";
		}
		if(e === undefined) {
			e = 1.2;
		}
		let x, y, fx, fy, mx, my;
		const fx_offset	= - (matrix.width  >> 1);
		const fy_offset	= - (matrix.height >> 1);
		const m			= matrix.matrix;
		const zero_color  = this.getPixelInside(0, 0).zero();
		const bufferimage = this.clone();
		const exptable = [];
		for(x = 0; x < 256; x++) {
			exptable[x] = Math.pow(e, x);
		}
		for(y = 0; y < this.height; y++) {
			for(x = 0; x < this.width; x++) {
				let newcolor = zero_color;
				fy = y + fy_offset;
				for(my = 0; my < matrix.height; my++, fy++) {
					fx = x + fx_offset;
					for(mx = 0; mx < matrix.width; mx++, fx++) {
						const color = bufferimage.getPixel(fx, fy);
						if(color) {
							newcolor = newcolor.addColor(color.table(exptable).mul(m[my][mx]));
						}
					}
				}
				this.setPixelInside(x, y, newcolor.baselog(e));
			}
		}
	}

	/**
	 * ImgFIRMatrix を使用してアンシャープ畳込みを行う
	 * @param {ImgFIRMatrix} matrix
	 * @param {type} rate
	 * @returns {undefined}
	 */
	convolutionUnSharp(matrix, rate) {
		if(!(matrix instanceof ImgFIRMatrix)) {
			throw "IllegalArgumentException";
		}
		let x, y, fx, fy, mx, my;
		const fx_offset	= - (matrix.width  >> 1);
		const fy_offset	= - (matrix.height >> 1);
		const m			= matrix.matrix;
		const zero_color  = this.getPixelInside(0, 0).zero();
		const bufferimage = this.clone();
		for(y = 0; y < this.height; y++) {
			for(x = 0; x < this.width; x++) {
				let newcolor = zero_color;
				fy = y + fy_offset;
				for(my = 0; my < matrix.height; my++, fy++) {
					fx = x + fx_offset;
					for(mx = 0; mx < matrix.width; mx++, fx++) {
						const color = bufferimage.getPixel(fx, fy);
						if(color) {
							newcolor = newcolor.addColor(color.mul(m[my][mx]));
						}
					}
				}
				const thiscolor = bufferimage.getPixel(x, y);
				const deltaColor = thiscolor.subColor(newcolor).mul(rate);
				this.setPixelInside(x, y, thiscolor.addColor(deltaColor));
			}
		}
	}

	/**
	 * シャープフィルタ
	 * @param {number} power 強度
	 * @returns {undefined}
	 */
	filterSharp(power) {
		const m = ImgFIRMatrix.makeSharpenFilter(power);
		this.convolution(m);
	}

	/**
	 * ブラーフィルタ
	 * @param {number} n 口径
	 * @returns {undefined}
	 */
	filterBlur(n) {
		let m;
		m = ImgFIRMatrix.makeBlur(n, 1);
		this.convolution(m);
		m = ImgFIRMatrix.makeBlur(1, n);
		this.convolution(m);
	}

	/**
	 * ガウシアンフィルタ
	 * @param {number} n 口径
	 * @returns {undefined}
	 */
	filterGaussian(n) {
		let m;
		m = ImgFIRMatrix.makeGaussianFilter(n, 1);
		this.convolution(m);
		m = ImgFIRMatrix.makeGaussianFilter(1, n);
		this.convolution(m);
	}

	/**
	 * アンシャープ
	 * @param {number} n 口径
	 * @param {number} rate
	 * @returns {undefined}
	 */
	filterUnSharp(n, rate) {
		const m = ImgFIRMatrix.makeGaussianFilter(n, n);
		this.convolutionUnSharp(m, rate);
	}

	/**
	 * バイラテラルフィルタ
	 * @param {number} n 口径
	 * @param {number} p 0.0～1.0 強度
	 * @returns {undefined}
	 */
	filterBilateral(n, p) {
		const m = ImgFIRMatrix.makeGaussianFilter(n, n);
		this.convolutionBilateral(m, p);
	}

	/**
	 * レンズフィルタ
	 * @param {type} n 口径
	 * @param {type} e 底(1.01-1.2)
	 * @returns {undefined}
	 */
	filterSoftLens(n, e) {
		const m = ImgFIRMatrix.makeCircle(n);
		this.convolutionExp(m, e);
	}
	
}

ImgData.MODE_WRAP	= ImgWrap.MODE;
ImgData.MODE_IP		= ImgInterpolation.MODE;
ImgData.MODE_BLEND	= ImgBlend.MODE;

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ImgVector {
		
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	
	/**
	 * クロス積
	 * @param {ImgVector} tgt
	 * @returns {ImgVector}
	 */
	cross(tgt) {
		return new ImgVector(
			this.y * tgt.z - this.z * tgt.y,
			this.z * tgt.x - this.x * tgt.z,
			this.x * tgt.y - this.y * tgt.x
		);
	}

	/**
	 * ターゲットへのベクトル
	 * @param {ImgVector} tgt
	 * @returns {ImgVector}
	 */
	getDirection(tgt) {
		return new ImgVector(
			tgt.x - this.x,
			tgt.y - this.y,
			tgt.z - this.z
		);
	}

	/**
	 * ターゲットへの方向ベクトル
	 * @returns {ImgVector}
	 */
	normalize() {
		let b = this.x * this.x + this.y * this.y + this.z * this.z;
		b = Math.sqrt(1.0 / b);
		return new ImgVector(
			this.x * b,
			this.y * b,
			this.z * b
		);
	}

	/**
	 * 方向ベクトルから、RGBの画素へ変換
	 * 右がX+,U+、下がY+,V+としたとき、RGB＝（+X, -Y, +Z）系とします。
	 * @returns {ImgColorRGBA}
	 */
	getNormalMapColor() {
		return new ImgColorRGBA([
			Math.round((1.0 + this.x) * 127.5),
			Math.round((1.0 - this.y) * 127.5),
			Math.round((1.0 + this.z) * 127.5),
			255
		]);
	}
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ImgColorRGBA extends ImgColor {
	
	constructor(color) {
		super();
		// ディープコピー
		this.rgba = [color[0], color[1], color[2], color[3]];
	}

	getColor() {
		return this.rgba;
	}
	
	clone() {
		return new ImgColorRGBA(this.rgba);
	}
	
	zero() {
		return new ImgColorRGBA([0.0, 0.0, 0.0, 0.0]);
	}
	
	one() {
		return new ImgColorRGBA([1.0, 1.0, 1.0, 1.0]);
	}
	
	add(x) {
		return new ImgColorRGBA([
			this.rgba[0] + x,	this.rgba[1] + x,
			this.rgba[2] + x,	this.rgba[3] + x ]);
	}
	
	sub(x) {
		return new ImgColorRGBA([
			this.rgba[0] - x,	this.rgba[1] - x,
			this.rgba[2] - x,	this.rgba[3] - x ]);
	}
	
	mul(x) {
		return new ImgColorRGBA([
			this.rgba[0] * x,	this.rgba[1] * x,
			this.rgba[2] * x,	this.rgba[3] * x ]);
	}
	
	div(x) {
		return new ImgColorRGBA([
			this.rgba[0] / x,	this.rgba[1] / x,
			this.rgba[2] / x,	this.rgba[3] / x ]);
	}
	
	exp() {
		return new ImgColorRGBA([
			Math.exp(this.rgba[0]),	Math.exp(this.rgba[1]),
			Math.exp(this.rgba[2]),	Math.exp(this.rgba[3]) ]);
	}
	
	log() {
		return new ImgColorRGBA([
			Math.log(this.rgba[0]),	Math.log(this.rgba[1]),
			Math.log(this.rgba[2]),	Math.log(this.rgba[3]) ]);
	}
	
	pow(base) {
		return new ImgColorRGBA([
			Math.pow(base, this.rgba[0]),	Math.pow(base, this.rgba[1]),
			Math.pow(base, this.rgba[2]),	Math.pow(base, this.rgba[3]) ]);
	}
	
	baselog(base) {
		const x = 1.0 / Math.log(base);
		return new ImgColorRGBA([
			Math.log(this.rgba[0]) * x,	Math.log(this.rgba[1]) * x,
			Math.log(this.rgba[2]) * x,	Math.log(this.rgba[3]) * x ]);
	}
	
	table(table) {
		return new ImgColorRGBA([
			table[Math.round(this.rgba[0])], table[Math.round(this.rgba[1])],
			table[Math.round(this.rgba[2])], table[Math.round(this.rgba[3])] ]);
	}
	
	random() {
		return new ImgColorRGBA([
			Math.floor(Math.random() * 256), Math.floor(Math.random() * 256),
			Math.floor(Math.random() * 256), Math.floor(Math.random() * 256) ]);
	}
	
	luminance() {
		return 0.2126 * this.rgba[0] + 0.7152 * this.rgba[1] + 0.0722 * this.rgba[2];
	}
	
	addColor(c) {
		return new ImgColorRGBA([
			this.rgba[0] + c.rgba[0],	this.rgba[1] + c.rgba[1],
			this.rgba[2] + c.rgba[2],	this.rgba[3] + c.rgba[3] ]);
	}
	
	subColor(c) {
		return new ImgColorRGBA([
			this.rgba[0] - c.rgba[0],	this.rgba[1] - c.rgba[1],
			this.rgba[2] - c.rgba[2],	this.rgba[3] - c.rgba[3] ]);
	}
	
	mulColor(c) {
		return new ImgColorRGBA([
			this.rgba[0] * c.rgba[0],	this.rgba[1] * c.rgba[1],
			this.rgba[2] * c.rgba[2],	this.rgba[3] * c.rgba[3] ]);
	}
	
	divColor(c) {
		return new ImgColorRGBA([
			this.rgba[0] / c.rgba[0],	this.rgba[1] / c.rgba[1],
			this.rgba[2] / c.rgba[2],	this.rgba[3] / c.rgba[3] ]);
	}
	
	maxColor(c) {
		return new ImgColorRGBA([
			Math.max(c.rgba[0], this.rgba[0]),Math.max(c.rgba[1], this.rgba[1]),
			Math.max(c.rgba[2], this.rgba[2]),Math.max(c.rgba[3], this.rgba[3])]);
	}
	
	minColor(c) {
		return new ImgColorRGBA([
			Math.min(c.rgba[0], this.rgba[0]),Math.min(c.rgba[1], this.rgba[1]),
			Math.min(c.rgba[2], this.rgba[2]),Math.min(c.rgba[3], this.rgba[3])]);
	}
	
	norm(normType) {
		if(normType === ImgColor.NORM_MODE.MANHATTEN) {
			return (Math.abs(this.rgba[0]) + Math.abs(this.rgba[1]) + Math.abs(this.rgba[2])) / 3;
		}
		else if(normType === ImgColor.NORM_MODE.EUGRID) {
			return Math.sqrt(this.rgba[0] * this.rgba[0] + this.rgba[1] * this.rgba[1] + this.rgba[2] * this.rgba[2]) / 3;
		}
	}
	
	normFast(normType) {
		if(normType === ImgColor.NORM_MODE.MANHATTEN) {
			return Math.abs(this.rgba[0]) + Math.abs(this.rgba[1]) + Math.abs(this.rgba[2]);
		}
		else if(normType === ImgColor.NORM_MODE.EUGRID) {
			return this.rgba[0] * this.rgba[0] + this.rgba[1] * this.rgba[1] + this.rgba[2] * this.rgba[2];
		}
	}
	
	getBlendAlpha() {
		return this.rgba[3] / 255.0;
	}
	
	setBlendAlpha(x) {
		const color = this.clone();
		color.rgba[3] = x * 255.0;
		return color;
	}
	
	exchangeColorAlpha(color) {
		return new ImgColorRGBA( [ this.rgba[0], this.rgba[1], this.rgba[2], color.rgba[3] ]);
	}
	
	getRRGGBB() {
		return (this.rgba[0] << 16) | (this.rgba[1] << 8) | (this.rgba[2] & 0xff);
	}
	
	getRed() {
		return (this.rgba[0]);
	}
	
	getGreen() {
		return (this.rgba[1]);
	}
	
	getBlue() {
		return (this.rgba[2]);
	}
	
	equals(c) {
		return	(this.rgba[0] === c.rgba[0]) &&
				(this.rgba[1] === c.rgba[1]) &&
				(this.rgba[2] === c.rgba[2]) &&
				(this.rgba[3] === c.rgba[3]) ;
	}
	
	toString() {
		return "color(" + this.rgba[0] + "," + this.rgba[1] + "," + this.rgba[2] + "," + this.rgba[3] + ")";
	}
	
	mulMatrix(m) {
		const color = new ImgColorRGBA();
		color.rgba[0] =	this.rgba[0] * m[0][0] +
						this.rgba[1] * m[0][1] +
						this.rgba[2] * m[0][2] +
						this.rgba[3] * m[0][3];
		color.rgba[1] =	this.rgba[0] * m[1][0] +
						this.rgba[1] * m[1][1] +
						this.rgba[2] * m[1][2] +
						this.rgba[3] * m[1][3];
		color.rgba[2] =	this.rgba[0] * m[2][0] +
						this.rgba[1] * m[2][1] +
						this.rgba[2] * m[2][2] +
						this.rgba[3] * m[2][3];
		color.rgba[3] =	this.rgba[0] * m[3][0] +
						this.rgba[1] * m[3][1] +
						this.rgba[2] * m[3][2] +
						this.rgba[3] * m[3][3];
		return color;
	}
	
	/**
	 * RGBの画素から方向ベクトルへの変換
	 * 右がX+,U+、下がY+,V+としたとき、RGB＝（+X, -Y, +Z）系とします。
	 * @returns {ImgVector}
	 */
	getNormalVector() {
		return new ImgVector(
			(this.rgba[0] / 128.0) - 1.0,
			- (this.rgba[1] / 128.0) + 1.0,
			(this.rgba[2] / 128.0) - 1.0
		);
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ImgColorY extends ImgColor {
		
	constructor(color) {
		super();
		// ディープコピー
		this.y = color;
	}

	getColor() {
		return this.y;
	}
	
	clone() {
		return new ImgColorY(this.y);
	}
	
	zero() {
		return new ImgColorY(0.0);
	}
	
	one() {
		return new ImgColorY(1.0);
	}
	
	add(x) {
		return new ImgColorY(this.y + x);
	}
	
	sub(x) {
		return new ImgColorY(this.y - x);
	}
	
	mul(x) {
		return new ImgColorY(this.y * x);
	}
	
	div(x) {
		return new ImgColorY(this.y / x);
	}
	
	exp() {
		return new ImgColorY(Math.exp(this.y));
	}
	
	log() {
		return new ImgColorY(Math.log(this.y));
	}
	
	pow(base) {
		return new ImgColorY(Math.pow(base, this.y));
	}
	
	baselog(base) {
		return new ImgColorY(Math.log(this.y) / Math.log(base));
	}
	
	table(table) {
		return new ImgColorY(table[Math.floor(this.y)]);
	}
	
	random() {
		return new ImgColorY(Math.random() * 256);
	}
	
	luminance() {
		return this.y;
	}
	
	addColor(c) {
		return new ImgColorY(this.y + c.y);
	}
	
	subColor(c) {
		return new ImgColorY(this.y - c.y);
	}
	
	mulColor(c) {
		return new ImgColorY(this.y * c.y);
	}
	
	divColor(c) {
		return new ImgColorY(this.y / c.y);
	}
	
	maxColor(c) {
		return new ImgColorY(Math.max(c.y, this.y));
	}
	
	minColor(c) {
		return new ImgColorY(Math.min(c.y, this.y));
	}
	
	norm() {
		return Math.abs(this.y);
	}
	
	normFast() {
		return Math.abs(this.y);
	}
	
	getBlendAlpha() {
		return 1.0;
	}
	
	setBlendAlpha() {
		return this;
	}
	
	exchangeColorAlpha() {
		return this;
	}
	
	equals(c) {
		return this.y === c.y;
	}
	
	toString() {
		return "color(" + this.y + ")";
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ImgDataY extends ImgData {
	
	constructor() {
		if(arguments.length === 1) {
			super(arguments[0]);
		}
		else if(arguments.length === 2) {
			super(arguments[0], arguments[1]);
		}
		else {
			super();
		}
	}
	
	clone() {
		const x = new ImgDataY(this.width, this.height);
		this._copyData(x);
		return x;
	}
	
	setSize(width, height) {
		super.setSize(width, height);
		this.data	= new Float32Array(this.width * this.height);
	}
	
	getPixelInside(x, y) {
		const p = y * this.width + x;
		return new ImgColorY(this.data[p]);
	}
	
	setPixelInside(x, y, color) {
		const p = y * this.width + x;
		this.data[p]     = color.getColor();
	}
	
	putImageData(imagedata, n) {
		if(	(imagedata instanceof ImageData) ||
			(imagedata instanceof ImgDataRGBA)) {
			this.setSize(imagedata.width, imagedata.height);
			if(n === undefined) {
				n = 0;
			}
			let p = 0;
			for(let i = 0; i < this.data.length; i++) {
				this.data[i] = imagedata.data[p + n];
				p += 4;
			}
		}
		else if(imagedata instanceof ImgDataY) {
			this.setSize(imagedata.width, imagedata.height);
			this.data.set(imagedata.data);
		}
		else {
			throw "IllegalArgumentException";
		}
	}
	
	putImageDataR(imagedata) {
		this.putImageData(imagedata, 0);
	}
	
	putImageDataG(imagedata) {
		this.putImageData(imagedata, 1);
	}
	
	putImageDataB(imagedata) {
		this.putImageData(imagedata, 2);
	}
	
	putImageDataA(imagedata) {
		this.putImageData(imagedata, 3);
	}
	
	getImageData() {
		const canvas = document.createElement("canvas");
		canvas.width  = this.width;
		canvas.height = this.height;
		const context = canvas.getContext("2d");
		const imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
		let p = 0, i = 0;
		for(; i < this.data.length; i++) {
			const x = Math.floor(this.data[i]);
			imagedata.data[p + 0] = x;
			imagedata.data[p + 1] = x;
			imagedata.data[p + 2] = x;
			imagedata.data[p + 3] = 255;
			p += 4;
		}
		return imagedata;
	}
	
	/**
	 * ノーマルマップを作成する
	 * @returns {ImgColorRGBA}
	 */
	getNormalMap() {
		if(this.getWrapMode() === ImgData.MODE_WRAP.INSIDE) {
			// 端の値を取得できないのでエラー
			throw "not inside";
		}
		
		const output = new ImgDataRGBA(this.width, this.height);
		let x, y;
		for(y = 0; y < this.height; y++) {
			for(x = 0; x < this.width; x++) {
				const x1 = new ImgVector(x - 1, y, this.getPixel(x - 1, y).getColor());
				const x2 = new ImgVector(x + 1, y, this.getPixel(x + 1, y).getColor());
				const x3 = x1.getDirection(x2);
				const y1 = new ImgVector(x, y - 1, this.getPixel(x, y - 1).getColor());
				const y2 = new ImgVector(x, y + 1, this.getPixel(x, y + 1).getColor());
				const y3 = y1.getDirection(y2);
				const n  = x3.cross(y3).normalize();
				output.setPixelInside(x, y, n.getNormalMapColor());
			}
		}
		return output;
	}
	
	/**
	 * ノーマルマップに対して、環境マッピングする
	 * @param {ImgColorRGBA} texture
	 * @returns {ImgColorRGBA}
	 */
	filterEnvironmentMapping(texture) {
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ImgDataRGBA extends ImgData {
		
	constructor() {
		if(arguments.length === 1) {
			super(arguments[0]);
		}
		else if(arguments.length === 2) {
			super(arguments[0], arguments[1]);
		}
		else {
			super();
		}
	}
	
	clone() {
		const x = new ImgDataRGBA(this.width, this.height);
		this._copyData(x);
		return x;
	}
	
	setSize(width, height) {
		super.setSize(width, height);
		this.data	= new Uint8ClampedArray(this.width * this.height * 4);
	}
	
	getPixelInside(x, y) {
		const p = (y * this.width + x) * 4;
		const c = new ImgColorRGBA([
			this.data[p],
			this.data[p + 1],
			this.data[p + 2],
			this.data[p + 3]
		]);
		return c;
	}

	setPixelInside(x, y, color) {
		const p = (y * this.width + x) * 4;
		this.data[p]     = color.getColor()[0];
		this.data[p + 1] = color.getColor()[1];
		this.data[p + 2] = color.getColor()[2];
		this.data[p + 3] = color.getColor()[3];
	}
	
	putDataY(imagedata, n) {
		if(!(imagedata instanceof ImgDataY)) {
			throw "IllegalArgumentException";
		}
		this.setSize(imagedata.width, imagedata.height);
		if(n === undefined) {
			n = 0;
		}
		let p = 0, i = 0;
		for(; i < imagedata.data.length; i++) {
			this.data[p + n] = Math.floor(imagedata.data[i]);
			p += 4;
		}
	}
	
	putDataYToR(imagedata) {
		this.putDataS(imagedata, 0);
	}
	
	putDataYToG(imagedata) {
		this.putDataS(imagedata, 1);
	}
	
	putDataYToB(imagedata) {
		this.putDataS(imagedata, 2);
	}
	
	putDataYToA(imagedata) {
		this.putDataS(imagedata, 3);
	}
	
	putImageData(imagedata) {
		if(	(imagedata instanceof ImageData) ||
			(imagedata instanceof ImgDataRGBA)) {
			this.setSize(imagedata.width, imagedata.height);
			this.data.set(imagedata.data);
		}
		else if(imagedata instanceof ImgDataY) {
			this.putImageData(imagedata.getImageData());
		}
		else {
			throw "IllegalArgumentException";
		}
	}
	
	getImageData() {
		const canvas = document.createElement("canvas");
		canvas.width  = this.width;
		canvas.height = this.height;
		const context = canvas.getContext("2d");
		const imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
		imagedata.data.set(this.data);
		return imagedata;
	}
	
	grayscale() {
		this.forEach(function(color, x, y, data) {
			const luminance = ~~color.luminance();
			const newcolor = new ImgColorRGBA( [luminance, luminance, luminance, color.rgba[3]] );
			data.setPixelInside(x, y, newcolor);
		});
	}
	
	/**
	 * 使用している色数を取得します
	 * ※透過色はカウントしません
	 * @returns {Number}
	 */
	getColorCount() {
		// 色を記録する領域
		// 0x200000 = 256 * 256 * 256 / 8 = 2097152
		const sw = new Uint8ClampedArray(0x200000);
		let count = 0;
		this.forEach(function(color) {
			const rrggbb = color.getRRGGBB();
			const p1 = rrggbb >> 3; // x / 8
			const p2 = rrggbb  % 7; // x & 8
			if(((sw[p1] >> p2) & 1) === 0) {
				count++;
				sw[p1] = (sw[p1] ^ (1 << p2)) & 0xFF;
			}
		});
		return count;
	}

	/**
	 * メディアンカットで減色後のパレットを取得します。
	 * @param {Number} colors 色の数
	 * @returns {}
	 */
	getPalletMedianCut(colors) {
		if(this.getColorCount()<=colors){
			return(null);
		}
		let i;
		let r, g, b;

		// 減色に用いる解像度
		const bit = 7;

		// 含まれる色数
		const color = new Uint32Array((1<<bit)*(1<<bit)*(1<<bit));

		// 現在の色数
		let colorcnt = 0;

		// 色から指定した解像度のrrggbb値を返す
		const RGBtoPositionForColor = function(color) {
			const r = color.getRed();
			const g = color.getGreen();
			const b = color.getBlue();
			return ((r>>(8-bit))<<(bit*2))|((g>>(8-bit))<<bit)|(b>>(8-bit));
		};

		// 0区切り目の初期値を計算する
		// それぞれの区切り幅に含まれた色数、及び区切り幅の最大値と最小値
		// R = 0, G = 1, B = 2 の位置とする
		const color_cnt = [];	
		const color_max = [[], [], []];
		const color_min = [[], [], []];
		// 色数は全画素
		color_cnt[0] = this.width * this.height;
		// 色の幅も最小から最大までとる
		for(i = 0; i < 3; i++) {
			color_min[i][colorcnt] = 0;					//bit最小値
			color_max[i][colorcnt] = (1 << bit) - 1;	//bit最大値
		}

		// あらかじめ各色が何画素含まれているかを調査する
		this.forEach(function(targetcolor) {
			color[RGBtoPositionForColor(targetcolor)]++;
		});

		// 色の幅
		let r_delta, g_delta, b_delta;
		// 色の最大幅
		let max_r_delta, max_g_delta, max_b_delta;
		// 区切った回数
		let kugiri;

		// ここからアルゴリズム頑張った……！

		colorcnt++;
		for(kugiri = 1; colorcnt < colors ;) {

			//区切る場所(R・G・Bのどれを区切るか)を大雑把に決める
			//基準は体積
			let max_volume = 0, tgt = 0;
			for(i = 0; i < kugiri; i++) {
				r_delta = color_max[0][i] - color_min[0][i];
				g_delta = color_max[1][i] - color_min[1][i];
				b_delta = color_max[2][i] - color_min[2][i];
				const this_volume = r_delta * g_delta * b_delta;
				if(max_volume < this_volume) {
					max_volume = this_volume;
					max_r_delta = r_delta;
					max_g_delta = g_delta;
					max_b_delta = b_delta;
					tgt = i;
				}
			}

			//その立方体のうちどの次元を区切るか大雑把に決める
			//基準は幅
			let max_delta = max_g_delta; // 緑を優先して区切る
			let tgt_col = 1;
			if(max_delta < max_r_delta) {
				max_delta = max_r_delta;
				tgt_col = 0;
			}
			if(max_delta < max_b_delta) {
				max_delta = max_b_delta;
				tgt_col = 2;
			}

			// それ以上区切れなかった場合は終了
			if(max_delta === 0) {
				break;
			}

			// tgt の範囲を
			// tgt_col  の次元の中央で区切る
			{
				//区切る位置を調べる(色数の中心)
				const point = color_min[tgt_col][tgt] + (max_delta >> 1); //実際の中心
				//
				//新しく区切った範囲を作成
				if(point === color_max[tgt_col][tgt]) {
					color_min[tgt_col][kugiri] = point;
					color_max[tgt_col][kugiri] = color_max[tgt_col][tgt];
					color_max[tgt_col][tgt]   = point - 1;
				}
				else {
					color_min[tgt_col][kugiri] = point + 1;
					color_max[tgt_col][kugiri] = color_max[tgt_col][tgt];
					color_max[tgt_col][tgt]   = point;
				}

				//その他の範囲は受け継ぐ
				for( i=0;i < 3;i++){
					if(i === tgt_col) {
						continue;
					}
					color_min[i][kugiri] = color_min[i][tgt];
					color_max[i][kugiri] = color_max[i][tgt];
				}
			}

			// 新しく区切った範囲に対して、含まれる色の画素数を計算しなおす
			color_cnt[kugiri] = 0;
			for( r = color_min[0][kugiri];r <= color_max[0][kugiri];r++) {
				for( g = color_min[1][kugiri];g <= color_max[1][kugiri];g++) {
					for( b = color_min[2][kugiri];b <= color_max[2][kugiri];b++) {
						color_cnt[kugiri] += color[(r<<(bit<<1))|(g<<bit)|b];
					}
				}
			}
			color_cnt[tgt] -= color_cnt[kugiri];

			// 新しく区切った先に画素が入って、区切り元の画素数がなくなった場合
			if(color_cnt[tgt] === 0) {
				// 区切った先のデータを、区切り元にコピーして、
				// 区切ったことをなかったことにする
				color_cnt[tgt] = color_cnt[kugiri];
				for(i = 0; i < 3; i++){
					color_min[i][tgt] = color_min[i][kugiri];
					color_max[i][tgt] = color_max[i][kugiri];
				}
			}
			// せっかく区切ったが、区切った先の画素数が0だった
			else if(color_cnt[kugiri] === 0) ;
			//色が両方とも分別できた場合
			else {
				kugiri++;
				colorcnt++;
			}
		}

		// 作成するパレット
		const pallet = [];

		//パレットを作る
		for(i = 0; i < colorcnt; i++) {
			//色数 × 色
			let avr_r = 0;
			let avr_g = 0;
			let avr_b = 0;
			for(r = color_min[0][i];r <= color_max[0][i];r++) {
				for(g = color_min[1][i];g <= color_max[1][i];g++) {
					for(b = color_min[2][i];b <= color_max[2][i];b++) {
						const color_sum = color[(r<<(bit<<1))|(g<<bit)|b];
						avr_r += color_sum * (r << (8-bit));
						avr_g += color_sum * (g << (8-bit));
						avr_b += color_sum * (b << (8-bit));
					}
				}
			}
			//平均を取る
			r = Math.round(avr_r / color_cnt[i]);
			g = Math.round(avr_g / color_cnt[i]);
			b = Math.round(avr_b / color_cnt[i]);
			r = r < 0 ? 0 : r > 255 ? 255 : r;
			g = g < 0 ? 0 : g > 255 ? 255 : g;
			b = b < 0 ? 0 : b > 255 ? 255 : b;

			//COLORREF 型で代入
			pallet[i] = new ImgColorRGBA([r, g, b, 255]);
		}

		return pallet;
	}

	/**
	 * 使用されている色のパレットを取得します。
	 * 最大256色まで取得します。
	 * @returns {Array|ImgData.getPallet.pallet}
	 */
	getPallet() {
		const pallet = [];
		const rrggbb_array = new Uint32Array(256);
		let count = 0;
		let i = 0;
		this.forEach(function(color) {
			if(count > 255) {
				return;
			}
			const rrggbb = color.getRRGGBB();
			for(i = 0; i < count; i++) {
				if(rrggbb_array[i] === rrggbb) {
					return;
				}
			}
			rrggbb_array[count] = rrggbb;
			pallet[count] = color;
			count++;
		});
		return pallet;
	}

	/**
	 * グレースケールのパレットを取得します。
	 * @param {Number} colors 階調数(2~256)
	 * @returns {}
	 */
	getPalletGrayscale(colors) {
		const n = colors < 2 ? 2 : colors > 256 ? 256 : colors;
		const pallet = [];
		const diff = 255.0 / (n - 1);
		let col = 0.0;
		let i;
		for(i = 0; i < n; i++) {
			let y = Math.round(col);
			y = y < 0 ? 0 : y > 255 ? 255 : y;
			pallet[i] = new ImgColorRGBA([y, y, y, 255]);
			col += diff;
		}
		return pallet;
	}

	/**
	 * パレットを用いて単純減色する
	 * @param {Array} palettes
	 * @returns {undefined}
	 */
	quantizationSimple(palettes) {
		this.forEach(function(thiscolor, x, y, data) {
			const palletcolor = thiscolor.searchColor(palettes, ImgColor.NORM_MODE.EUGRID);
			data.setPixelInside(x, y, palletcolor.c1.color.exchangeColorAlpha(thiscolor));
		});
	}

	/**
	 * パレットから組織的ディザ法による減色を行います。(Error-diffusion dithering)
	 * @param {Array} palettes
	 * @param {ImgColorQuantization.orderPattern} orderPattern
	 * @param {ImgColor.NORM_MODE} normType
	 * @returns {undefined}
	 */
	quantizationOrdered(palettes, orderPattern, normType) {
		this.forEach(function(thiscolor, x, y, data) {
			const palletcolor = thiscolor.searchColor(palettes, normType);
			const color1 = palletcolor.c1.color;
			const norm1  = palletcolor.c1.norm;
			const color2 = palletcolor.c2.color;
			const norm2  = palletcolor.c2.norm;
			let normsum = norm1 + norm2;
			let sumdiff = 0;
			normsum = normsum === 0 ? 1 : normsum;
			const pattern = orderPattern.pattern[y % orderPattern.height][x % orderPattern.width];
			let newcolor = null;
			if(color1.luminance > color2.luminance) {
				sumdiff = Math.floor((norm2 * orderPattern.maxnumber) / normsum);
				if (pattern <= sumdiff) {
					newcolor = color1.exchangeColorAlpha(thiscolor); // 1番目に似ている色
				}
				else {
					newcolor = color2.exchangeColorAlpha(thiscolor); // 2番目に似ている色
				}
			}
			else {
				sumdiff = Math.floor((norm1 * orderPattern.maxnumber) / normsum);
				if (pattern >= sumdiff) {
					newcolor = color1.exchangeColorAlpha(thiscolor); // 1番目に似ている色
				}
				else {
					newcolor = color2.exchangeColorAlpha(thiscolor); // 2番目に似ている色
				}
			}
			data.setPixelInside(x, y, newcolor);
		});
	}

	/**
	 * パレットから誤差拡散法による減色を行います。
	 * @param {Array} palettes
	 * @param {ImgColorQuantization.diffusionPattern} diffusionPattern
	 * @returns {undefined}
	 */
	quantizationDiffusion(palettes, diffusionPattern) {

		// 誤差拡散するにあたって、0未満や255より大きな値を使用するため
		// 一旦、下記のバッファにうつす
		const pixelcount	= this.width * this.height;
		const color_r		= new Int16Array(pixelcount);
		const color_g		= new Int16Array(pixelcount);
		const color_b		= new Int16Array(pixelcount);

		// 現在の位置
		let point		= 0;
		this.forEach(function(thiscolor, x, y, data) {
			point = y * data.width + x;
			color_r[point] = thiscolor.getRed();
			color_g[point] = thiscolor.getGreen();
			color_b[point] = thiscolor.getBlue();
		});

		// 誤差拡散できない右端
		const width_max = this.width - diffusionPattern.width + diffusionPattern.center;

		// パターンを正規化して合計を1にする
		let px, py;
		let pattern_sum = 0;
		for(py = 0; py < diffusionPattern.height; py++) {
			for(px = 0; px < diffusionPattern.width; px++) {
				pattern_sum += diffusionPattern.pattern[py][px];
			}
		}
		const pattern_normalize = [];
		for(py = 0; py < diffusionPattern.height; py++) {
			pattern_normalize[py] = [];
			for(px = 0; px < diffusionPattern.width; px++) {
				pattern_normalize[py][px] = diffusionPattern.pattern[py][px] / pattern_sum;
			}
		}

		// 選択処理
		this.forEach(function(thiscolor, x, y, data) {
			point = y * data.width + x;
			const diffcolor = new ImgColorRGBA(
				[color_r[point], color_g[point], color_b[point], 255]
			);
			// 最も近い色を探して
			let palletcolor = diffcolor.searchColor(palettes, ImgColor.NORM_MODE.EUGRID);
			palletcolor = palletcolor.c1.color;
			// 値を設定する
			data.setPixelInside(x, y, palletcolor.exchangeColorAlpha(thiscolor));
			// 右端の近くは誤差分散させられないので拡散しない
			if(x > width_max) {
				return;
			}
			// ここから誤差を求める
			const deltacolor = diffcolor.subColor(palletcolor);
			for(py = 0; py < diffusionPattern.height; py++) {
				px = py === 0 ? diffusionPattern.center : 0;
				for(; px < diffusionPattern.width; px++) {
					const dx = x + px - diffusionPattern.center;
					const dy = y + py;
					// 画面外への拡散を防止する
					if((dx < 0) || (dy >= data.height)){
						continue;
					}
					const dp = dy * data.width + dx;
					color_r[dp] += deltacolor.getRed()   * pattern_normalize[py][px];
					color_g[dp] += deltacolor.getGreen() * pattern_normalize[py][px];
					color_b[dp] += deltacolor.getBlue()  * pattern_normalize[py][px];
				}
			}
		});
	}

	/**
	 * 単純減色
	 * @param {Array} colorcount 減色後の色数
	 * @returns {undefined}
	 */
	filterQuantizationSimple(colorcount) {
		const count = this.getColorCount();
		if(count > colorcount) {
			const pallet = this.getPalletMedianCut(colorcount);
			this.quantizationSimple(pallet);
		}
	}

	/**
	 * 組織的ディザ法による減色
	 * @param {Array} colorcount 減色後の色数
	 * @param {ImgColor.NORM_MODE} normType 
	 * @returns {undefined}
	 */
	filterQuantizationOrdered(colorcount, normType) {
		if(normType === undefined) {
			normType = ImgColor.NORM_MODE.EUGRID;
		}
		const count = this.getColorCount();
		if(count > colorcount) {
			const pallet = this.getPalletMedianCut(colorcount);
			this.quantizationOrdered(
				pallet,
				ImgDataRGBA.quantization.orderPattern.patternBayer,
				normType
			);
		}
	}

	/**
	 * 誤差拡散法による減色
	 * @param {Array} colorcount
	 * @param {ImgColorQuantization.diffusionPattern} diffusionPattern
	 * @returns {undefined}
	 */
	filterQuantizationDiffusion(colorcount, diffusionPattern) {
		if(diffusionPattern === undefined) {
			diffusionPattern = ImgDataRGBA.quantization.diffusionPattern.patternFloydSteinberg;
		}
		const count = this.getColorCount();
		if(count > colorcount) {
			const pallet = this.getPalletMedianCut(colorcount);
			this.quantizationDiffusion(
				pallet,
				diffusionPattern
			);
		}
	}
}

ImgDataRGBA.quantization = {
	
	diffusionPattern : {

		/**
		 * 誤差拡散法に用いるFloyd & Steinbergのパターン
		 */
		patternFloydSteinberg : {
			width	: 3,
			height	: 2,
			center	: 1,
			pattern	: [
				[0, 0, 7],
				[3, 5, 1]
			]
		},

		/**
		 * 誤差拡散法に用いるJarvis,Judice & Ninkeのパターン
		 */
		patternJarvisJudiceNinke : {
			width	: 5,
			height	: 3,
			center	: 2,
			pattern	: [
				[0, 0, 0, 7, 5],
				[3, 5, 7, 5, 3],
				[1, 3, 5, 3, 1]
			]
		}
	},

	orderPattern : {
		/**
		 * 組織的ディザ法に用いるBayerのパターン
		 */
		patternBayer : {
			width	: 4,
			height	: 4,
			maxnumber : 16,
			pattern	: [
				[ 0, 8, 2,10],
				[12, 4,14, 6],
				[ 3,11, 1, 9],
				[15, 7,13, 5]
			]
		}
	}
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const ImageProcessing = {
	ImgDataRGBA		: ImgDataRGBA,
	ImgColorRGBA	: ImgColorRGBA,
	ImgDataY		: ImgDataY,
	ImgColorY		: ImgColorY,
	MODE_WRAP		: ImgData.MODE_WRAP,
	MODE_IP			: ImgData.MODE_IP,
	MODE_BLEND		: ImgData.MODE_BLEND
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

/**
 * 基底クラス
 */
class SBase {
	
	constructor(elementtype, title) {
		this.id				= "SComponent_" + (SBase._counter++).toString(16);
		this.wallid			= "SComponent_" + (SBase._counter++).toString(16);
		this.isshow			= false;
		this._element		= null;
		this._wall			= null;
		this.elementtype	= elementtype;
		this.unit			= SBase.UNIT_TYPE.EM;

		const that = this;
		const mouseevent = {
			over : function(){
				SBase.node_tool.addClass(that.getElement(), SBase.CLASS_NAME.MOUSEOVER);
			},
			out : function(){
				SBase.node_tool.removeClass(that.getElement(), SBase.CLASS_NAME.MOUSEOVER);
				SBase.node_tool.removeClass(that.getElement(), SBase.CLASS_NAME.MOUSEDOWN);
			},
			down  : function(){
				SBase.node_tool.addClass(that.getElement(), SBase.CLASS_NAME.MOUSEDOWN);
			},
			up  : function(){
				SBase.node_tool.removeClass(that.getElement(), SBase.CLASS_NAME.MOUSEDOWN);
			}
		};

		this.tool			= {
			attachMouseEvent : function(element) {
				element.addEventListener("touchstart", mouseevent.over	,false);
				element.addEventListener("touchend", mouseevent.up		,false);
				element.addEventListener("mouseover",mouseevent.over	,false);
				element.addEventListener("mouseout"	,mouseevent.out		,false);
				element.addEventListener("mousedown",mouseevent.down	,false);
				element.addEventListener("mouseup"	,mouseevent.up		,false);
			},
			removeNodeForId : function(id) {
				const element = document.getElementById(id);
				SBase.node_tool.removeNode(element);
				return element;
			},
			AputB : function(target, component, type) {
				if((!target) || (!component) || (!(component instanceof SBase))) {
					throw "IllegalArgumentException";
				}
				else if(target === component) {
					throw "it referenced me";
				}
				else if((type !== SBase.PUT_TYPE.IN) &&
					(type !== SBase.PUT_TYPE.RIGHT) &&
					(type !== SBase.PUT_TYPE.NEWLINE) ) {
					throw "IllegalArgumentException";
				}
				let node = null;
				if((typeof target === "string")||(target instanceof String)) {
					node = document.getElementById(target);
				}
				else if(target instanceof SBase) {
					if(type === SBase.PUT_TYPE.IN) {
						if(target.isContainer()) {
							node = target.getContainerElement();
						}
						else {
							throw "not Container";
						}
					}
					else {
						node = target.getElement();
					}
				}
				if(node === null) {
					throw "Not Found " + target;
				}
				// この時点で
				// node は HTML要素 となる。
				// component は SBase となる。

				const insertNext = function(newNode, referenceNode) {
					if(referenceNode.nextSibling) {
						referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
					}
					else {
						referenceNode.parentNode.appendChild(newNode);
					}
				};
				// 移動前に自分を消去
				component.removeMe();
				if(type === SBase.PUT_TYPE.IN) {
					// 最後の行があるならば次の行へ
					component.onAdded();
					if(node.lastChild !== null) {
						component.getWall(SBase.PUT_TYPE.NEWLINE).style.display = "block";
						node.appendChild(component.getWall());
					}
					component.getElement().style.display = "inline-block";
					node.appendChild(component.getElement());
				}
				else {
					if(node.parentNode === null) {
						throw "not found element on the html";
					}
					component.onAdded();
					insertNext(component.getWall(type), node);
					insertNext(component.getElement(), component.getWall(type));
					if(type === SBase.PUT_TYPE.RIGHT) {
						node.style.display = "inline-block";
						component.getWall(type).style.display = "inline-block";
						component.getElement().style.display = "inline-block";
					}
					else if(type === SBase.PUT_TYPE.NEWLINE) {
						node.style.display = "inline-block";
						component.getWall(type).style.display = "block";
						component.getElement().style.display = "inline-block";
					}
				}
			}
		};

		this.setText(title);
	}
	
	getWidth() {
		let width = this.getElement().style.width;
		if(width === null) {
			return null;
		}
		width = width.match(/[+-]?\s*[0-9]*\.?[0-9]*/)[0];
		return parseFloat(width);
	}

	getHeight() {
		let height = this.getElement().style.height;
		if(height === null) {
			return null;
		}
		height = height.match(/[+-]?\s*[0-9]*\.?[0-9]*/)[0];
		return parseFloat(height);
	}

	getSize() {
		return {
			width : this.getWidth(),
			height : this.getHeight()
		};
	}

	setWidth(width) {
		if(typeof width !== "number") {
			throw "IllegalArgumentException not number";
		}
		this.getElement().style.width = width.toString() + this.unit;
	}

	setHeight(height) {
		if(typeof height !== "number") {
			throw "IllegalArgumentException not number";
		}
		this.getElement().style.height = height.toString() + this.unit;
	}

	setSize(width, height) {
		this.setWidth(width);
		this.setHeight(height);
	}

	removeMe() {
		this.tool.removeNodeForId(this.id);
		this.tool.removeNodeForId(this.space_id);
	}

	onAdded() {
	}

	getWall(type) {
		// すでに作成済みならそれを返して、作っていないければ作る
		if(this._wall) {
			return this._wall;
		}
		const wall = document.createElement("span");
		wall.id = this.wallid;
		if(type === SBase.PUT_TYPE.RIGHT) {
			wall.className = SBase.CLASS_NAME.SPACE;
		}
		else if(type === SBase.PUT_TYPE.NEWLINE) {
			wall.className = SBase.CLASS_NAME.NEWLINE;
		}
		wall.style.display = "inline-block";
		this._wall = wall;
		return wall;
	}

	isContainer() {
		return this.getContainerElement() !== null;
	}

	getContainerElement() {
		return null;
	}

	getElement() {
		// すでに作成済みならそれを返して、作っていないければ作る
		if(this._element) {
			return this._element;
		}
		const element = document.createElement(this.elementtype);
		element.id = this.id;
		element.className = SBase.CLASS_NAME.COMPONENT;
		element.style.display = "inline-block";
		this._element = element;
		this.tool.attachMouseEvent(element);
		return element;
	}

	put(targetComponent, type) {
		this.tool.AputB(this, targetComponent, type);
		return;
	}

	putMe(target, type) {
		this.tool.AputB(target, this, type);
		return;
	}

	isVisible() {
		if(this.getElement().style.visibility === null) {
			return true;
		}
		return this.getElement().style.visibility !== "hidden";
	}

	setVisible(isvisible) {
		if(isvisible) {
			this.getElement().style.visibility	= "visible";
			this.getWall().style.visibility		= "visible";
		}
		else {
			this.getElement().style.visibility	= "hidden";
			this.getWall().style.visibility		= "hidden";
		}
		return;
	}
	
	getTextNode() {
		const element = this.getElement();
		// childNodes でテキストノードまで取得する
		const childnodes = element.childNodes;
		let textnode = null;
		let i = 0;
		for(i = 0; i < childnodes.length; i++) {
			if(childnodes[i] instanceof Text) {
				textnode = childnodes[i];
				break;
			}
		}
		// テキストノードがない場合は null をかえす
		return textnode;
	}

	getElementNode() {
		const element = this.getElement();
		// children でテキストノード意外を取得する
		const childnodes = element.children;
		let node = null;
		let i = 0;
		for(i = 0; i < childnodes.length; i++) {
			if(!(childnodes[i] instanceof Text)) {
				node = childnodes[i];
				break;
			}
		}
		return node;
	}

	getEditableNodeForValue() {
		// Value要素をもつもの
		return null;
	}

	getEditableNodeForNodeValue() {
		// Value要素をもつなら、このメソッドは利用不可とする
		if(this.getEditableNodeForValue()) {
			return null;
		}
		// nodeValue 要素をもつもの
		let textnode = this.getTextNode();
		// 見つからなかったら作成する
		if(textnode === null) {
			const element = this.getElement();
			textnode = document.createTextNode("");
			element.appendChild(textnode);
		}
		return textnode;
	}

	setText(title) {
		if(!title) {
			return;
		}
		let node = null;
		node = this.getEditableNodeForValue();
		if(node) {
			node.value = title;
			return;
		}
		node = this.getEditableNodeForNodeValue();
		if(node) {
			node.nodeValue = title;
			return;
		}
	}

	getText() {
		let title = null;
		let node = null;
		node = this.getEditableNodeForValue();
		if(node) {
			title = node.value;
		}
		node = this.getEditableNodeForNodeValue();
		if(node) {
			title = node.nodeValue.trim();
		}
		return (title === null) ? "" : title;
	}

	getEnabledElement() {
		return null;
	}

	setEnabled(isenabled) {
		if(isenabled) {
			SBase.node_tool.removeClass(this.getElement(), SBase.CLASS_NAME.DISABLED);
		}
		else {
			SBase.node_tool.addClass(this.getElement(), SBase.CLASS_NAME.DISABLED);
		}
		const element = this.getEnabledElement();
		// disabled属性が利用可能ならつける
		if(element !== null) {
			SBase.node_tool.setBooleanAttribute(element, "disabled", isenabled);
		}
	}
	
	isEnabled() {
		return !SBase.node_tool.isSetClass(this.getElement(), SBase.CLASS_NAME.DISABLED);
	}

	getId() {
		return this.id;
	}

	getUnit() {
		return this.unit;
	}

	setUnit(UNIT_TYPE) {
		this.unit = UNIT_TYPE;
	}

	addClass(classname) {
		return SBase.node_tool.addClass(this.getElement(), classname);
	}

	toString() {
		return this._elementtype + "(" + this.id + ")";
	}
}

SBase.PUT_TYPE = {
	IN		: 0,
	RIGHT	: 1,
	NEWLINE	: 2
};

SBase.UNIT_TYPE = {
	PX		: "px",
	EM		: "em",
	PERCENT	: "%"
};

SBase.LABEL_POSITION = {
	LEFT	: 0,
	RIGHT	: 1
};

SBase.CLASS_NAME = {
	MOUSEOVER		: "SCOMPONENT_MouseOver",
	MOUSEDOWN		: "SCOMPONENT_MouseDown",
	DISABLED		: "SCOMPONENT_Disabled",
	COMPONENT		: "SCOMPONENT_Component",
	NEWLINE			: "SCOMPONENT_Newline",
	CLOSE			: "SCOMPONENT_Close",
	OPEN			: "SCOMPONENT_Open",
	SPACE			: "SCOMPONENT_Space",
	CONTENTSBOX		: "SCOMPONENT_ContentsBox",
	PANEL			: "SCOMPONENT_Panel",
	PANEL_LEGEND	: "SCOMPONENT_PanelLegend",
	SLIDEPANEL		: "SCOMPONENT_SlidePanel",
	SLIDEPANEL_LEGEND: "SCOMPONENT_SlidePanelLegend",
	SLIDEPANEL_SLIDE: "SCOMPONENT_SlidePanelSlide",
	GROUPBOX		: "SCOMPONENT_GroupBox",
	GROUPBOX_LEGEND	: "SCOMPONENT_GroupBoxLegend",
	IMAGEPANEL		: "SCOMPONENT_ImagePanel",
	LABEL			: "SCOMPONENT_Label",
	SELECT			: "SCOMPONENT_Select",
	COMBOBOX		: "SCOMPONENT_ComboBox",
	CHECKBOX		: "SCOMPONENT_CheckBox",
	CHECKBOX_IMAGE	: "SCOMPONENT_CheckBoxImage",
	BUTTON			: "SCOMPONENT_Button",
	FILELOAD		: "SCOMPONENT_FileLoad",
	FILESAVE		: "SCOMPONENT_FileSave",
	CANVAS			: "SCOMPONENT_Canvas",
	PROGRESSBAR		: "SCOMPONENT_ProgressBar",
	SLIDER			: "SCOMPONENT_Slider",
	COLORPICKER		: "SCOMPONENT_ColorPicker"
};

SBase._counter			= 0;

SBase.node_tool = {
	setBooleanAttribute : function(element, attribute, isset) {
		if((	!(typeof attribute === "string") &&
				!(attribute instanceof String)) ||
				(typeof isset !== "boolean")) {
			throw "IllegalArgumentException";
		}
		const checked = element.getAttribute(attribute);
		if((!isset) && (checked === null))  {
			// falseなので無効化させる。すでにチェック済みなら何もしなくてよい
			element.setAttribute(attribute, attribute);
		}
		else if ((isset) && (checked !== null)) {
			element.removeAttribute(attribute);
		}
	},

	isBooleanAttribute : function(element, attribute) {
		if( !(typeof attribute === "string") &&
			!(attribute instanceof String)) {
			throw "IllegalArgumentException";
		}
		return (element.getAttribute(attribute) === null);
	},

	removeNode : function(element) {
		if(element) {
			if (element.parentNode) {
				element.parentNode.removeChild(element);
			}
		}
		return element;
	},

	removeChildNodes : function(element) {
		let child = element.lastChild;
		while (child) {
			element.removeChild(child);
			child = element.lastChild;
		}
		return;
	},

	isSetClass : function(element, classname) {
		const classdata = element.className;
		if(classdata === null) {
			return false;
		}
		const pattern = new RegExp( "(^" + classname + "$)|( +" + classname + ")" , "g");
		return pattern.test(classdata);
	},

	addClass : function(element, classname) {
		const classdata = element.className;
		if(classdata === null) {
			element.className = classname;
			return;
		}
		const pattern = new RegExp( "(^" + classname + "$)|( +" + classname + ")" , "g");
		if(pattern.test(classdata)) {
			return;
		}
		element.className = classdata + " " + classname;
	},

	removeClass : function(element, classname) {
		const classdata = element.className;
		if(classdata === null) {
			return;
		}
		const pattern = new RegExp( "(^" + classname + "$)|( +" + classname + ")" , "g");
		if(!pattern.test(classdata)) {
			return;
		}
		element.className = classdata.replace(pattern, "");
	}
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SButton extends SBase {
	
	constructor(title) {
		super("input", title);
		this.addClass(SBase.CLASS_NAME.BUTTON);
		this.getElement().type = "button";
	}
	
	getEditableNodeForValue() {
		return this.getElement();
	}
	
	getEnabledElement () {
		return this.getElement();
	}
	
	addListener(func) {
		this.getElement().addEventListener("click", func, false);
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SCanvas extends SBase {
	
	constructor() {
		super("canvas");
		this.addClass(SBase.CLASS_NAME.CANVAS);
		this.canvas = super.getElement();
		this.glmode = false;
		this.setPixelSize(300, 150);	// canvas のデフォルト値を設定する
	}
	
	getPixelSize() {
		return {
			width: this.canvas.width,
			height: this.canvas.height
		};
	}

	getCanvas() {
		return this.canvas;
	}

	setPixelSize(width, height) {
		if(	(arguments.length !== 2) || 
			((typeof width !== "number") || (typeof height !== "number")) ||
			((width < 0) || (height < 0))) {
			throw "IllegalArgumentException";
		}
		width  = ~~Math.floor(width);
		height = ~~Math.floor(height);
		this.canvas.width = width;
		this.canvas.height = height;
	}

	getContext() {
		// 一度でも GL で getContext すると使用できなくなります。
		if(this.context === undefined) {
			this.context = this.canvas.getContext("2d");
			if(this.context === null) {
				this.glmode = true;
				this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
				this.context = this.gl;
			}
		}
		return this.context;
	}

	clear() {
		if(this.glmode) {
			this.getContext().clear(this.gl.COLOR_BUFFER_BIT);
		}
		else {
			this.getContext().clearRect(0, 0,  this.canvas.width, this.canvas.height);
		}
	}

	getImageData() {
		if(this.glmode) {
			return;
		}
		return this.getContext().getImageData(0, 0, this.canvas.width, this.canvas.height);
	}

	putImageData(imagedata) {
		if(this.glmode) {
			return;
		}
		this.getContext().putImageData(imagedata, 0, 0);
	}

	_putImage(image, isresizecanvas, drawsize) {
		const pixelsize = this.canvas;
		let dx = 0, dy = 0;
		let width  = pixelsize.width;
		let height = pixelsize.height;
		if(SCanvas.drawtype.ORIGINAL === drawsize) {
			width  = image.width;
			height = image.height;
		}
		else if(SCanvas.drawtype.STRETCH === drawsize) {
			width  = pixelsize.width;
			height = pixelsize.height;
		}
		else if(SCanvas.drawtype.FILL_ASPECT_RATIO === drawsize) {
			width  = pixelsize.width;
			height = pixelsize.height;
		}
		else {
			width  = image.width;
			height = image.height;
			if(SCanvas.drawtype.ASPECT_RATIO === drawsize) {
				if(width > pixelsize.width) {
					width  = pixelsize.width;
					height = Math.floor(height * (width / image.width));
				}
				if(height > pixelsize.height) {
					width  = Math.floor(width * (pixelsize.height / height));
					height = pixelsize.height;
				}
			}
			if(SCanvas.drawtype.LETTER_BOX === drawsize) {
				width  = pixelsize.width;
				height = Math.floor(height * (width / image.width));
				if(height > pixelsize.height) {
					width  = Math.floor(width * (pixelsize.height / height));
					height = pixelsize.height;
				}
				dx = Math.floor((pixelsize.width - width) / 2);
				dy = Math.floor((pixelsize.height - height) / 2);
				isresizecanvas = false;
			}
		}
		if(isresizecanvas) {
			this.setUnit(SBase.UNIT_TYPE.PX);
			this.setSize(width, height);
			this.setPixelSize(width, height);
		}
		this.clear();

		if(image instanceof Image) {
			this.context.drawImage(
				image,
				0, 0, image.width, image.height,
				dx, dy, width, height
			);
		}
		else if(image instanceof ImageData) {
			this.context.putImageData(
				image,
				0, 0,
				dx, dy, width, height
			);
		}
	}

	putImage(data, drawcallback, drawsize, isresizecanvas) {
		if(!drawcallback) {
			drawcallback = null;
		}
		if(drawsize === undefined) {
			drawsize = SCanvas.drawtype.LETTER_BOX;
		}
		if(isresizecanvas === undefined) {
			isresizecanvas = false;
		}
		if((data instanceof Image) || (data instanceof ImageData)) {
			// Image -> canvas, ImageData -> canvas
			this._putImage(data, isresizecanvas, drawsize);
			if(typeof drawcallback === "function") {
				drawcallback();
			}
		}
		else if(typeof data === "string") {
			const _this = this;
			const image = new Image();
			// URL(string) -> Image
			image.onload = function() {
				_this.putImage(image, isresizecanvas, drawsize, drawcallback);
			};
			image.src = data;
		}
		else if(data instanceof SCanvas) {
			// SCanvas -> canvas
			this.putImage(data.getElement(), isresizecanvas, drawsize, drawcallback);
		}
		else if((data instanceof Element) && (data.tagName === "CANVAS")){
			// canvas -> URL(string)
			this.putImage(data.toDataURL(), isresizecanvas, drawsize, drawcallback);
		}
		else if((data instanceof Blob) || (data instanceof File)) {
			const _this = this;
			const reader = new FileReader();
			// Blob, File -> URL(string)
			reader.onload = function() {
				_this.putImage(reader.result, isresizecanvas, drawsize, drawcallback);
			};
			reader.readAsDataURL(data);
		}
		else {
			throw "IllegalArgumentException";
		}
	}

	toDataURL(type) {
		if(!type) {
			type = "image/png";
		}
		return this.canvas.toDataURL(type);
	}
}

SCanvas.drawtype = {
	ORIGINAL		: 0,
	ASPECT_RATIO	: 1,
	STRETCH			: 2,
	LETTER_BOX		: 3
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SCheckBox extends SBase {
		
	constructor(title) {
		super("label");
		this.addClass(SBase.CLASS_NAME.LABEL);
		this.addClass(SBase.CLASS_NAME.CHECKBOX);
		
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.id = this.getId() + "_checkbox";
		checkbox.className = SBase.CLASS_NAME.CHECKBOX_IMAGE;
		this.checkbox = checkbox;
		this.textnode = document.createTextNode( title ? title : "");
		const element   = this.getElement();
		element.appendChild(this.checkbox);
		element.appendChild(this.textnode);
	}

	getEnabledElement() {
		return this.checkbox;
	}
	
	getTextNode() {
		return this.textnode;
	}
	
	getElementNode() {
		return this.checkbox;
	}
	
	setLabelPosition(LABEL_POSITION) {
		// ラベルかどうか確認
		const element = this.getElement();
		const textnode = this.getTextNode();
		const elementnode = this.getElementNode();
		// 中身を一旦消去する
		this.node_tool.removeChildNodes(element);
		// 配置を設定する
		if(LABEL_POSITION === SBase.LABEL_POSITION.LEFT) {
			// ラベル内のテキストは左側
			element.appendChild(textnode);
			element.appendChild(elementnode);
		}
		else {
			// ラベルのテキストは右側
			element.appendChild(elementnode);
			element.appendChild(textnode);
		}
		return;
	}
	
	setCheckBoxImageSize(size) {
		if(typeof size !== "number") {
			throw "IllegalArgumentException not number";
		}
		this.checkbox.style.height = size.toString() + this.unit;
		this.checkbox.style.width  = size.toString() + this.unit;
	}
	
	addListener(func) {
		this.checkbox.addEventListener("change", func, false);
	}
	
	setChecked(ischecked) {
		this.checkbox.checked = ischecked;
	}
	
	isChecked() {
		return this.checkbox.checked;
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SColorPicker extends SBase {
	
	constructor() {
		
		super("div");
		this.addClass(SBase.CLASS_NAME.COLORPICKER);
		
		const element	= this.getElement();
		const that = this;
		const hls = {
			H : {
				div : document.createElement("div"),
				split : 6,
				value : 0.0,
				input : null,
				gauge : null,
				color_data : [],
				color_node : [],
				is_press : false
			},
			S : {
				div : document.createElement("div"),
				split : 1,
				value : 0.5,
				input : null,
				gauge : null,
				color_data	: [],
				color_node	: [],
				is_press : false
			},
			L :	{
				div : document.createElement("div"),
				split : 2,
				value : 0.5,
				input : null,
				gauge : null,
				color_data : [],
				color_node : [],
				is_press : false
			}
		};

		for(let i = 0; i <= hls.H.split; i++) {
			const x = 1.0 / hls.H.split * i;
			hls.H.color_data.push(Color.newColorNormalizedHSL([x, 1.0, 0.5]).getCSSHex());
		}

		// イベントをどこで発生させたか分かるように、
		// 関数を戻り値としてもどし、戻り値として戻した関数を
		// イベント発生時に呼び出すようにしています。

		// 押したときにマウスの位置を取得して更新する
		const pushevent = function(name) {
			return function(event) {
				if(event.length) event = event[0];
				if(hls[name].is_press) {
					let node = event.target;
					node = node ? node : event.currentTarget;
					hls[name].value = event.offsetX / node.clientWidth;
					that.redraw();
				}
			};
		};

		// 押した・離したの管理
		const pressevent = function(name, is_press) {
			return function(event) {
				if(event.length) event = event[0];
				let node = event.target;
				node = node ? node : event.currentTarget;
				hls[name].is_press = is_press;
				if(is_press) {
					pushevent(name)(event);
				}
			};
		};

		// インプットボックスの変更
		const inputevent = function(name) {
			return function(event) {
				// イベントが発生したノードの取得
				let node = event.target;
				node = node ? node : event.currentTarget;
				hls[name].value = node.value / 100.0;
				that.redraw();
			};
		};

		// 内部のカラーバーを作成
		const createSelectBar = function(target, name) {
			const element_cover	= document.createElement("div");	// クリック検出
			const element_gauge	= document.createElement("div");	// ゲージ表示用
			const element_gradient= document.createElement("div");	// グラデーション作成用

			// レイヤーの初期設定
			target.style.position			= "relative";
			element_cover.style.position	= "absolute";
			element_gauge.style.position	= "absolute";
			element_gradient.style.position	= "absolute";
			element_cover.style.margin		= "0px";
			element_cover.style.padding		= "0px";
			element_gauge.style.margin		= "0px";
			element_gauge.style.padding		= "0px";
			element_gradient.style.margin	= "0px";
			element_gradient.style.padding	= "0px";

			// 上にかぶせるカバー
			element_cover.addEventListener("mousedown"	, pressevent(name, true), false);
			element_cover.addEventListener("mouseup"	, pressevent(name, false), false);
			element_cover.addEventListener("mouseout"	, pressevent(name, false), false);
			element_cover.addEventListener("mousemove"	, pushevent(name), false);
			element_cover.addEventListener("touchstart"	, pressevent(name, true), false);
			element_cover.addEventListener("touchend"	, pressevent(name, false), false);
			element_cover.addEventListener("touchcancel", pressevent(name, false), false);
			element_cover.dataset.name	= name;
			element_cover.style.width			= "100%";
			element_cover.style.height			= "100%";
			element_cover.style.bottom			= "0px";

			// ゲージ（横幅で｜を表す）
			element_gauge.style.width			= "33%";
			element_gauge.style.height			= "100%";
			element_gauge.style.bottom			= "0px";
			element_gauge.style.borderStyle		= "ridge";
			element_gauge.style.borderWidth		= "0px 2px 0px 0px";
			hls[name].gauge = element_gauge;

			// グラデーション部分
			const split = hls[name].split;
			element_gradient.style.width			= "100%";
			element_gradient.style.height			= "100%";
			element_gradient.style.overflow		= "hidden";
			for(let i = 0; i < split; i++) {
				const element_color = document.createElement("div");
				element_color.style.display		= "inline-block";
				element_color.style.margin		= "0px";
				element_color.style.padding		= "0px";
				element_color.style.height		= "100%";
				element_color.style.width		= 100.0 / split + "%";
				element_color.style.background	= "linear-gradient(to right, #000, #FFF)";
				hls[name].color_node.push(element_color);
				element_gradient.appendChild(element_color);
			}

			// 3つのレイヤーを結合
			target.appendChild(element_gradient);
			target.appendChild(element_gauge);
			target.appendChild(element_cover);
		};

		// 1行を作成
		const createColorBar = function(name) {
			const element_text		= document.createElement("span");
			const element_colorbar	= document.createElement("div");
			const element_inputbox	= document.createElement("input");

			// 位置の基本設定
			element_text.style.display		= "inline-block";
			element_colorbar.style.display	= "inline-block";
			element_inputbox.style.display	= "inline-block";
			element_text.style.verticalAlign		= "top";
			element_colorbar.style.verticalAlign	= "top";
			element_inputbox.style.verticalAlign	= "top";
			element_text.style.height		= "100%";
			element_colorbar.style.height	= "100%";
			element_inputbox.style.height	= "100%";

			// 文字
			element_text.style.margin		= "0px";
			element_text.style.padding		= "0px";
			element_text.style.textAlign	= "center";

			// 中央のバー
			element_colorbar.style.margin	= "0px 0.5em 0px 0.5em";
			element_colorbar.style.padding	= "0px";
			element_colorbar.style.borderStyle	= "solid";
			element_colorbar.style.borderWidth	= "1px";

			// 入力ボックス
			element_inputbox.addEventListener("input", inputevent(name), false);
			element_inputbox.type = "number";
			element_inputbox.style.margin	= "0px";
			element_inputbox.style.padding	= "0px";
			element_inputbox.style.borderStyle	= "none";
			element_inputbox.min = 0.0;
			element_inputbox.max = 100.0;
			element_inputbox.step = 1.0;
			hls[name].input = element_inputbox;

			// 横幅調整
			element_text.style.width		= "1.5em";
			element_colorbar.style.width	= "calc(100% - 6.0em)";
			element_inputbox.style.width	= "3.5em";

			// バーの内部を作成
			createSelectBar(element_colorbar, name);

			// バーのサイズ調整
			const target = hls[name].div;
			target.style.height				= "1.2em";
			target.style.margin				= "0.5em 0px 0.5em 0px";

			element_text.appendChild(document.createTextNode(name));
			target.appendChild(element_text);
			target.appendChild(element_colorbar);
			target.appendChild(element_inputbox);
		};

		// HSLの3つを作成する
		for(const key in hls) {
			createColorBar(key);
		}

		this.hls = hls;
		this.listener = [];

		// Elementを更新後にくっつける
		this.redraw();
		element.appendChild(this.hls.H.div);
		element.appendChild(this.hls.S.div);
		element.appendChild(this.hls.L.div);
	}
	
	setColor(color) {
		if(!(color instanceof Color)) {
			throw "ArithmeticException";
		}
		const hls = this.hls;
		const c = color.getNormalizedHSL();
		hls.H.value = c.h;
		hls.S.value = c.s; 
		hls.L.value = c.l; 
		this.redraw();
	}
	
	getColor() {
		const hls = this.hls;
		const h = hls.H.value;
		const s = hls.S.value;
		const l = hls.L.value;
		return Color.newColorNormalizedHSL([h, s, l]);
	}
	
	redraw() {
		const hls = this.hls;
		const h = hls.H.value;
		const s = hls.S.value;
		const l = hls.L.value;
		hls.S.color_data = [
			Color.newColorNormalizedHSL([h, 0.0, l]).getCSSHex(),
			Color.newColorNormalizedHSL([h, 1.0, l]).getCSSHex()
		];
		hls.L.color_data = [
			Color.newColorNormalizedHSL([h, s, 0.0]).getCSSHex(),
			Color.newColorNormalizedHSL([h, s, 0.5]).getCSSHex(),
			Color.newColorNormalizedHSL([h, s, 1.0]).getCSSHex()
		];
		for(const key in hls) {
			const data = hls[key].color_data;
			const node = hls[key].color_node;
			for(let i = 0; i < node.length; i++) {
				node[i].style.background = "linear-gradient(to right, " + data[i] + ", " + data[i + 1] + ")";
			}
			const value = Math.round(100.0 * hls[key].value);
			hls[key].gauge.style.width = value + "%";
			hls[key].input.value = value;
		}
		for(let i = 0;i < this.listener.length; i++) {
			this.listener[i]();
		}
	}

	addListener(func) {
		this.listener.push(func);
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SComboBox extends SBase {
	
	constructor(item) {
		super("select", item);
		this.addClass(SBase.CLASS_NAME.SELECT);
		this.addClass(SBase.CLASS_NAME.COMBOBOX);
	}
	
	getEnabledElement() {
		return this.getElement();
	}
	
	addListener(func) {
		this.getElement().addEventListener("change", func, false);
	}
	
	setText(title) {
		if(!title) {
			return;
		}
		const element = this.getElement();
		// 1つの文字列のみならば、配列化する
		if	((typeof title === "string") &&
			(title instanceof String)) {
			title = [title];
		}
		// 内部の要素を全部消去する
		let child = element.lastChild;
		while (child) {
			element.removeChild(child);
			child = element.lastChild;
		}
		let i = 0;
		// 追加していく
		for(i = 0; i < title.length; i++) {
			const option_node = document.createElement("option");
			option_node.text = title[i].toString();
			option_node.value = title[i].toString();
			element.appendChild(option_node);
		}
	}
	
	getText() {
		const element = this.getElement();
		// select要素なら option を取得
		const child = element.children;
		let i = 0;
		const output = [];
		for(i = 0; i < child.length; i++) {
			if(child[i].tagName === "OPTION") {
				output[output.length] = child[i].text;
			}
		}
		return output;
	}
	
	setSelectedItem(text) {
		const child = this.getElement().children;
		let i = 0, j = 0;
		for(i = 0; i < child.length; i++) {
			if(child[i].tagName === "OPTION") {
				if(child[i].value === text.toString()) {
					this.getElement().selectedIndex = j;
					break;
				}
				j++;
			}
		}
	}
	
	getSelectedItem() {
		const child = this.getElement().children;
		const selectindex = this.getElement().selectedIndex;
		let i = 0, j = 0;
		for(i = 0; i < child.length; i++) {
			if(child[i].tagName === "OPTION") {
				if(selectindex === j) {
					return child[i].value;
				}
				j++;
			}
		}
		return "";
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SFileLoadButton extends SBase {
	
	constructor(title) {
		super("label", title);
		this.addClass(SBase.CLASS_NAME.BUTTON);
		this.addClass(SBase.CLASS_NAME.FILELOAD);
		
		// CSS有効化のために、label 内に input(file) を入れる
		// Edge のバグがあるので Edgeで使用できない
		// https://github.com/facebook/react/issues/7683
		const element   = super.getElement();
		const file = document.createElement("input");
		element.style.textAlign =  "center";  
		file.setAttribute("type", "file");
		file.id = this.getId() + "_file";
		file.style.display = "none";
		this.file = file;
		element.appendChild(file);
	}
	
	getEnabledElement() {
		return this.file;
	}
	
	getFileAccept() {
		const accept = this.file.getAttribute("accept");
		return (accept === null) ? "" : accept;
	}
	
	setFileAccept(filter) {
		if(filter === SFileLoadButton.FILE_ACCEPT.DEFAULT) {
			if(this.file.getAttribute("accept") !== null) {
				this.file.removeAttribute("accept");
			}
		}
		else {
			this.file.accept = filter;
		}
	}
	
	addListener(func) {
		this.file.addEventListener("change",
			function(event){
				func(event.target.files);
			}, false );
	}

}

SFileLoadButton.FILE_ACCEPT = {
	DEFAULT	: "",
	IMAGE	: "image/*",
	AUDIO	: "audio/*",
	VIDEO 	: "video/*",
	TEXT 	: "text/*",
	PNG 	: "image/png",
	JPEG 	: "image/jpg",
	GIF 	: "image/gif"
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SFileSaveButton extends SBase {
	
	constructor(title) {
		super("a", title);
		this.addClass(SBase.CLASS_NAME.BUTTON);
		this.addClass(SBase.CLASS_NAME.FILESAVE);
		this.filename = "";
		this.url      = "";
		this.getElement().setAttribute("download", this.filename);
	}
	
	getFileName() {
		return this.filename;
	}
	
	setFileName(filename) {
		this.filename = filename;
		this.getElement().setAttribute("download", this.filenam);
	}
	
	setURL(url) {
		this.getElement().href = url;
		this.url               = url;
	}
	
	setEnabled(isenabled) {
		if(this.isEnabled() !== isenabled) {
			if(isenabled) {
				this.getElement().href = this.url;
			}
			else {
				this.getElement().removeAttribute("href");
			}
		}
		super.setEnabled(isenabled);
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SGroupBox extends SBase {
	
	constructor(title) {
		super("fieldset");
		this.addClass(SBase.CLASS_NAME.GROUPBOX);
		this.legend = document.createElement("legend");
		SBase.node_tool.addClass(this.legend, SBase.CLASS_NAME.GROUPBOX_LEGEND);
		this.legend.id = this.getId() + "_legend";
		this.legend.textContent = title;
		this.body = document.createElement("div");
		SBase.node_tool.addClass(this.body, SBase.CLASS_NAME.CONTENTSBOX);
		this.body.id = this.getId() + "_body";
		const element   = this.getElement();
		element.appendChild(this.legend);
		element.appendChild(this.body);
	}
	
	getEnabledElement() {
		return this.getElement();
	}
	
	getContainerElement() {
		return this.body;
	}
	
	clear() {
		SBase.node_tool.removeChildNodes(this.body);
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SImagePanel extends SBase {
	
	constructor() {
		super("div");
		this.addClass(SBase.CLASS_NAME.IMAGEPANEL);
		const image = document.createElement("img");
		image.id = this.id + "_img";
		this.image = image;
		this.getElement().appendChild(this.image);
	}
	
	clear() {
		// 未作成
		this.node_tool.removeChildNodes(this.getElement());
	}
	
	toDataURL() {
		return this.image.src;
	}
	
	putImageData(imagedata) {
		this.putImage(imagedata);
	}
	
	putImage(data, drawcallback) {
		if(!drawcallback) {
			drawcallback = null;
		}
		if(typeof data === "string") {
			// URL(string) -> IMG
			this.image.onload = function() {
				if(typeof drawcallback === "function") {
					drawcallback();
				}
			};
			this.image.src = data;
		}
		else if(data instanceof ImageData) {
			const canvas = document.createElement("canvas");
			canvas.width = data.width;
			canvas.height = data.height;
			const context = canvas.getContext("2d");
			context.putImageData(data, 0, 0);
			this.putImage(canvas, drawcallback);
		}
		else if(data instanceof Image) {
			this.image.src = data.src;
		}
		else if(data instanceof SCanvas) {
			// SCanvas -> canvas
			this.putImage(data.getElement(), drawcallback);
		}
		else if((data instanceof Element) && (data.tagName === "CANVAS")){
			// canvas -> URL(string)
			try {
				this.putImage(data.toDataURL("image/png"), drawcallback);
			} catch(e) {
				try {
					this.putImage(data.toDataURL("image/jpeg"), drawcallback);
				} catch(e) {
					// falls through
				}
			}
		}
		else if((data instanceof Blob) || (data instanceof File)) {
			const _this = this;
			const reader = new FileReader();
			// Blob, File -> URL(string)
			reader.onload = function() {
				_this.putImage(reader.result, drawcallback);
			};
			reader.readAsDataURL(data);
		}
		else {
			throw "IllegalArgumentException";
		}
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SLabel extends SBase {
	
	constructor(title) {
		super("div", title);
		this.addClass(SBase.CLASS_NAME.LABEL);
	}
	
	getContainerElement() {
		return this.getElement();
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SPanel extends SBase {
	
	constructor(title) {
		super("div", null);
		this.addClass(SBase.CLASS_NAME.PANEL);
		const element = this.getElement();
		this.legend = document.createElement("span");
		SBase.node_tool.addClass(this.legend, SBase.CLASS_NAME.PANEL_LEGEND);
		this.legend.id = this.getId() + "_legend";
		this.body = document.createElement("div");
		SBase.node_tool.addClass(this.body, SBase.CLASS_NAME.CONTENTSBOX);
		this.body.id = this.getId() + "_body";
		const that = this;
		this.paneltool = {
			setText :  function(title) {
				if(title) {
					that.legend.textContent = title;
					that.legend.style.display = "block";
				}
				else {
					that.legend.style.display = "none";
				}
			}
		};
		this.paneltool.setText(title);
		element.appendChild(this.legend);
		element.appendChild(this.body);
	}
	
	setText(title) {
		if(this.paneltool) {
			this.paneltool.setText(title);
		}
	}

	getContainerElement() {
		return this.body;
	}

	clear() {
		SBase.node_tool.removeChildNodes(this.body);
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SProgressBar extends SBase {
	
	constructor(min, max) {
		super("label");
		this.addClass(SBase.CLASS_NAME.LABEL);
		this.addClass(SBase.CLASS_NAME.PROGRESSBAR);
		
		this.min	= 0.0;
		this.max	= 0.0;
		this.value	= min;
		this.is_indeterminate = false;
		if(arguments.length === 0) {
			this.min = 0.0;
			this.max = 1.0;
		}
		else if(arguments.length === 2) {
			this.min = min;
			this.max = max;
		}
		else {
			throw "IllegalArgumentException";
		}
		this.progress = document.createElement("progress");
		this.getElement().appendChild(this.progress);
		this.progress.id = this.getId() + "_progress";
		this.progress.className = SBase.CLASS_NAME.PROGRESSBAR;
		// 内部の目盛りは0-1を使用する
		this.progress.value	= 0.0;
		this.progress.max	= 1.0;
	}
	
	setMaximum(max) {
		this.max = max;
	}
	
	setMinimum(min) {
		this.min = min;
	}
	
	getMaximum() {
		return this.max;
	}
	
	getMinimum() {
		return this.min;
	}
	
	setValue(value) {
		this.value = value;
		this.progress.value = this.getPercentComplete();
	}
	
	getValue() {
		return this.value;
	}
	
	setIndeterminate(newValue) {
		this.is_indeterminate = newValue;
		if(this.is_indeterminate) {
			this.progress.removeAttribute("value");
		}
		else {
			this.setValue(this.value);
		}
	}
	
	isIndeterminate() {
		return this.is_indeterminate;
	}
	
	getPercentComplete() {
		const delta = this.max - this.min;
		return (this.value - this.min) / delta;
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SSlidePanel extends SBase {
	
	constructor(title) {
		super("div");
		this.addClass(SBase.CLASS_NAME.SLIDEPANEL);
		this.textnode = document.createTextNode( title ? title : "");
		this.legend = document.createElement("span");
		SBase.node_tool.addClass(this.legend, SBase.CLASS_NAME.SLIDEPANEL_LEGEND);
		this.legend.id = this.getId() + "_legend";
		this.legend.appendChild(this.textnode);
		this.slide = document.createElement("div");
		SBase.node_tool.addClass(this.slide, SBase.CLASS_NAME.SLIDEPANEL_SLIDE);
		this.slide.id = this.getId() + "_slide";
		this.body = document.createElement("div");
		SBase.node_tool.addClass(this.body, SBase.CLASS_NAME.CONTENTSBOX);
		this.body.id = this.getId() + "_body";
		const that = this;
		const clickfunc = function() {
			that.setOpen(!that.isOpen());
		};
		this.legend.addEventListener("click", clickfunc);
		this.setOpen(false);
		this.slide.appendChild(this.body);
		const element   = super.getElement();
		element.appendChild(this.legend);
		element.appendChild(this.slide);
	}
	
	setOpen(is_open) {
		this.is_open = is_open;
		if (this.is_open){
			this.slide.style.maxHeight	= this.body.scrollHeight + "px";
			SBase.node_tool.addClass(this.legend, SBase.CLASS_NAME.OPEN);
			SBase.node_tool.removeClass(this.legend, SBase.CLASS_NAME.CLOSE);
		} else {
			this.slide.style.maxHeight	= null;
			SBase.node_tool.addClass(this.legend, SBase.CLASS_NAME.CLOSE);
			SBase.node_tool.removeClass(this.legend, SBase.CLASS_NAME.OPEN);
		} 
	}
	
	isOpen() {
		return this.is_open;
	}
	
	getTextNode() {
		return this.textnode;
	}
	
	getContainerElement() {
		return this.body;
	}
	
	clear() {
		SBase.node_tool.removeChildNodes(this.body);
	}
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SSlider extends SBase {
	
	constructor(min, max) {
		super("label");
		this.addClass(SBase.CLASS_NAME.LABEL);
		this.addClass(SBase.CLASS_NAME.SLIDER);
		
		if(arguments.length === 0) {
			min = 0.0;
			max = 1.0;
		}
		else if(arguments.length !== 2) {
			throw "IllegalArgumentException";
		}
		this.slider = document.createElement("input");
		this.slider.id = this.getId() + "_slider";
		this.slider.type	= "range";
		this.slider.className = SBase.CLASS_NAME.SLIDER;
		this.slider.value	= min;
		this.slider.min		= min;
		this.slider.max		= max;
		this.slider.step	= (max - min) / 100;
		this.datalist		= document.createElement("datalist");
		this.datalist.id	= this.getId() + "_datalist";
		this.slider.setAttribute("list", this.datalist.id);
		this.getElement().appendChild(this.slider);
		this.getElement().appendChild(this.datalist);
	}
	
	getEnabledElement() {
		return this.slider;
	}
	
	setMaximum(max) {
		this.slider.max = max;
	}
	
	setMinimum(min) {
		this.slider.min = min;
	}
	
	getMaximum() {
		return parseFloat(this.slider.max);
	}
	
	getMinimum() {
		return parseFloat(this.slider.min);
	}
	
	setValue(value) {
		this.slider.value = value;
	}
	
	getValue() {
		return parseFloat(this.slider.value);
	}
	
	setMinorTickSpacing(step) {
		this.slider.step = step;
	}
	
	getMinorTickSpacing() {
		return parseFloat(this.slider.step);
	}
	
	setMajorTickSpacing(step) {
		this.majortick = step;
		this.removeMajorTickSpacing();
		let i;
		const min = this.getMinimum();
		const max = this.getMaximum();
		for(i = min; i <= max; i+= step) {
			const option_node = document.createElement("option");
			option_node.value = i.toString();
			this.datalist.appendChild(option_node);
		}
	}
	
	getMajorTickSpacing() {
		return this.majortick;
	}
	
	removeMajorTickSpacing() {
		const element = this.datalist;
		let child = element.lastChild;
		while (child) {
			element.removeChild(child);
			child = element.lastChild;
		}
	}
	
	addListener(func) {
		let isDown = false;
		const _this = this;
		const setDown = function() {
			isDown = true;
		};
		const setUp = function() {
			if(isDown) {
				if(_this.slider.disabled !== "disabled") {
					func();
				}
				isDown = false;
			}
		};
		this.slider.addEventListener("touchstart", setDown, false );
		this.slider.addEventListener("touchend", setUp, false );
		this.slider.addEventListener("mousedown", setDown, false );
		this.slider.addEventListener("mouseup", setUp, false );
	}

	getWidth() {
		let width = this.slider.width;
		if(width === null) {
			return null;
		}
		width = width.match(/[+-]?\s*[0-9]*\.?[0-9]*/)[0];
		return parseFloat(width);
	}
	
	getHeight() {
		let height = this.slider.height;
		if(height === null) {
			return null;
		}
		height = height.match(/[+-]?\s*[0-9]*\.?[0-9]*/)[0];
		return parseFloat(height);
	}
	
	setWidth(width) {
		if(typeof width !== "number") {
			throw "IllegalArgumentException not number";
		}
		super.setWidth(width);
		this.slider.style.width = width.toString() + this.unit;
	}
	
	setHeight(height) {
		if(typeof height !== "number") {
			throw "IllegalArgumentException not number";
		}
		super.setHeight(height);
		this.slider.style.height = height.toString() + this.unit;
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const SComponent = {
	
	Button : SButton,
	Canvas : SCanvas,
	CheckBox : SCheckBox,
	ColorPicker : SColorPicker,
	ComboBox : SComboBox,
	FileLoadButton : SFileLoadButton,
	FileSaveButton : SFileSaveButton,
	GroupBox : SGroupBox,
	ImagePanel : SImagePanel,
	Label : SLabel,
	Panel : SPanel,
	ProgressBar : SProgressBar,
	SlidePanel : SSlidePanel,
	Slider : SSlider,
	
	PUT_TYPE : SBase.PUT_TYPE,
	UNIT_TYPE : SBase.UNIT_TYPE,
	LABEL_POSITION : SBase.LABEL_POSITION,
	FILE_ACCEPT : SFileLoadButton.FILE_ACCEPT
	
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

// 「M系列乱数」
// 比較的長い 2^521 - 1通りを出力します。
// 詳細は、奥村晴彦 著『C言語によるアルゴリズム辞典』を参照
// 乱数はCでの動作と同じ値が出ることを確認。(seed = 1として1000番目の値が等しいことを確認)
//
// Javaの仕様に基づく48ビット線形合同法を実装仕様と思いましたが
// 「キャリー付き乗算」、「XorShift」、「線形合同法」などは
// 2つを組にしてプロットするといった使い方をすると、模様が見える可能性があるようで止めました。
// 有名で超高性能な「メルセンヌツイスタ」は、MITライセンスのため組み込みませんでした。

class Random {
		
	constructor() {
		this.x = [];
		for(let i = 0;i < 521;i++) {
			this.x[i] = 0;
		}
		if(arguments.length >= 1) {
			this.setSeed(arguments[0]);
		}
		else {
			// 線形合同法で適当に乱数を作成する
			const seed = ((new Date()).getTime() + Random.seedUniquifier) & 0xFFFFFFFF;
			Random.seedUniquifier = (Random.seedUniquifier + 1) & 0xFFFFFFFF;
			this.setSeed(seed);
		}
	}

	static _unsigned32(x) {
		return ((x < 0) ? ((x & 0x7FFFFFFF) + 0x80000000) : x);
	}
	
	_multiplication32(x1, x2) {
		let b = (x1 & 0xFFFF) * (x2 & 0xFFFF);
		let y = Random._unsigned32(b);
		b = (x1 & 0xFFFF) * (x2 >>> 16);
		y = Random._unsigned32(y + ((b & 0xFFFF) << 16));
		b = (x1 >>> 16) * (x2 & 0xFFFF);
		y = Random._unsigned32(y + ((b & 0xFFFF) << 16));
		return (y & 0xFFFFFFFF);
	}

	_rnd521() {
		const x = this.x;
		for(let i = 0; i < 32; i++) {
			x[i] ^= x[i + 489];
		}
		for(let i = 32; i < 521; i++) {
			x[i] ^= x[i - 32];
		}
	}

	setSeed(seed) {
		// 伏見「乱数」東京大学出版会,1989 の方法により初期値を設定
		let u = 0;
		const x = this.x;
		// seedを使用して線形合同法でx[0-16]まで初期値を設定
		for(let i = 0; i <= 16; i++) {
			for(let j = 0; j < 32; j++) {
				seed = this._multiplication32(seed, 0x5D588B65) + 1;
				u = (u >>> 1) + ((seed < 0) ? 0x80000000 : 0);
			}
			x[i] = u;
		}
		// 残りのビットはx[i] = x[i-32] ^ x[i-521]で生成
		for(let i = 16; i < 521; i++) {
			u = (i === 16) ? i : (i - 17);
			x[i] = ((x[u] << 23) & 0xFFFFFFFF) ^ (x[i - 16] >>> 9) ^ x[i - 1];
		}
		// ビットをシャッフル
		for(let i = 0; i < 4; i++) {
			this._rnd521();
		}
		this.xi = 0;
		this.haveNextNextGaussian = false;
		this.nextNextGaussian = 0;
	}

	genrand_int32() {
		// 全て使用したら、再び混ぜる
		if(this.xi === 521) {
			this._rnd521();
			this.xi = 0;
		}
		const y = Random._unsigned32(this.x[this.xi]);
		this.xi = this.xi + 1;
		return y;
	}

	next(bits) {
		if(bits === 0) {
			return 0;
		}
		else if(bits === 32) {
			return this.genrand_int32();
		}
		else if(bits < 32) {
			// 線形合同法ではないため

			// 上位のビットを使用しなくてもいいがJavaっぽく。
			return (this.genrand_int32() >>> (32 - bits));
		}
		// double型のため、52ビットまでは、整数として出力可能
		else if(bits === 63) {
			// 正の値を出力するように調節
			return (this.next(32) * 0x80000000 + this.next(32));
		}
		else if(bits === 64) {
			return (this.next(32) * 0x100000000 + this.next(32));
		}
		else if(bits < 64) {
			return (this.genrand_int32() * (1 << (bits - 32)) + (this.genrand_int32()  >>> (64 - bits)));
		}
	}

	nextBytes(y) {
		// 配列yに乱数を入れる
		// 8ビットのために、32ビット乱数を1回回すのはもったいない
		for(let i = 0;i < y.length; i++) {
			y[i] = this.next(8);
		}
		return;
	}

	nextInt() {
		if(arguments.length === 1) {
			let r, y;
			const a = arguments[0];
			do {
				r = Random._unsigned32(this.genrand_int32());
				y = r % a;
			} while((r - y + a) > 0x100000000 );
			return y;
		}
		return (this.next(32) & 0xFFFFFFFF);
	}

	nextLong() {
		return this.next(64);
	}

	nextBoolean() {
		// 1ビットのために、32ビット乱数を1回回すのはもったいない
		return (this.next(1) !== 0);
	}

	nextFloat() {
		return (this.next(24) / 0x1000000);
	}

	nextDouble() {
		const a1 = this.next(26) * 0x8000000 + this.next(27);
		const a2 = 0x8000000 * 0x4000000;
		return (a1 / a2);
	}

	nextGaussian() {
		if(this.haveNextNextGaussian) {
			this.haveNextNextGaussian = false;
			return this.nextNextGaussian;
		}
		const a = Math.sqrt( -2 * Math.log( this.nextDouble() ) );
		const b = 2 * Math.PI * this.nextDouble();
		const y = a * Math.sin(b);
		this.nextNextGaussian = a * Math.cos(b);
		this.haveNextNextGaussian = true;
		return y;
	}
}

Random.seedUniquifier = 0x87654321;

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

// 内部では1変数内の中の16ビットごとに管理
// 2変数で16ビット*16ビットで32ビットを表す

class BigInteger {

	constructor() {
		this.element     = [];
		this.sign        = 0;
		if((arguments.length === 2) && (typeof Random !== "undefined") && (arguments[1] instanceof Random)) {
			this.sign = 1;
			const len = arguments[0];
			const random = arguments[1];
			const size = ((len - 1) >> 4) + 1;
			let r;
			if(len === 0) {
				return;
			}
			for(let i = 0, j = 0; i < size; i++) {
				if(j === 0) {
					r = random.nextInt(); // 32ビットずつ作成する
					this.element[i] = r & 0xFFFF;
					j = 1;
				}
				else {
					this.element[i] = (r >>> 16) & 0xFFFF;
					j = 0;
				}
			}
			// 1～15ビット余る場合は、16ビットずつ作成しているので削る
			if((len % 16) !== 0) {
				this.element[this.element.length - 1] &= (1 << (len % 16)) - 1;
			}
			// 最後のビットに 0 をたくさん作成していると、
			// 0のみのデータになる可能性があるためメモリを修正
			this._memory_reduction();
		}
		else if(arguments.length === 3) {
			if(typeof Random === "undefined") {
				return;
			}
			while(true) {
				const x = new BigInteger(arguments[0], arguments[2]);
				if(x.isProbablePrime(arguments[1])) {
					this.element = x.element;
					this.sign = x.sign;
					break;
				}
			}
		}
		else if(arguments.length >= 1) {
			this.sign = 1;
			const obj = arguments[0];
			if(obj instanceof BigInteger) {
				for(let i = 0; i < arguments[0].element.length; i++) {
					this.element[i] = arguments[0].element[i];
				}
				this.sign = arguments[0].sign;
			}
			else if((typeof obj === "number")||(obj instanceof Number)) {
				let x = arguments[0];
				if(x < 0) {
					this.sign = -1;
					x = -x;
				}
				this.element = this._number_to_binary_number(x);
			}
			else if((typeof obj === "string")||(obj instanceof String)) {
				let x = arguments[0].replace(/\s/g, "").toLowerCase();
				let buff = x.match(/^[-+]+/);
				if(buff !==  null) {
					buff = buff[0];
					x = x.substring(buff.length, x.length);
					if(buff.indexOf("-") !==  -1) {
						this.sign = -1;
					}
				}
				if(arguments.length === 2) {
					this.element = this._string_to_binary_number(x, arguments[1]);
				}
				else if(/^0x/.test(x)) {
					this.element = this._string_to_binary_number(x.substring(2, x.length), 16);
				}
				else if(/^0b/.test(x)) {
					this.element = this._string_to_binary_number(x.substring(2, x.length), 2);
				}
				else if(/^0/.test(x)) {
					this.element = this._string_to_binary_number(x.substring(1, x.length), 8);
				}
				else {
					this.element = this._string_to_binary_number(x, 10);
				}
				// "0"の場合がある為
				if((this.element.length === 1)&&(this.element[0] === 0)) {
					this.element = [];
				}
			}
		}
	}

	equals(x) {
		if(!(x instanceof BigInteger)) {
			x = new BigInteger(x);
		}
		if(this.signum() !==  x.signum()) {
			return false;
		}
		if(this.element.length !==  x.element.length) {
			return false;
		}
		for(let i = 0;i < x.element.length; i++) {
			if(this.element[i] !==  x.element[i]) {
				return false;
			}
		}
		return true;
	}

	toString(radix) {
		if(arguments.length === 0) {
			radix = 10;
		}
		// int型で扱える数値で toString が可能なので、
		// せっかくだからより大きな進数で計算していけば、あとでtoStringする回数が減るテクニック
		// 2進数であれば、2^n乗で計算しても問題がない 4進数や8進数で計算して、2進数に戻せば巡回少数なし
		// v0.03 出来る限りまとめてn進数変換する
		const max_num = 0x3FFFFFFF;
		//                        max_num > radix^x
		// floor(log max_num / log radix) = x
		const keta = Math.floor( Math.log(max_num) / Math.log(radix) );
		const calcradix = Math.round(Math.pow(radix, keta));
		// zeros = "00000000...."
		let zeros = [];
		let i;
		for(i = 0; i < keta; i++) {
			zeros[i] = "0";
		}
		zeros = zeros.join("");
		// v0.03ここまで
		const x = this._binary_number_to_string(this.element, calcradix);
		const y = [];
		let z = "";
		if(this.signum() < 0) {
			y[y.length] = "-";
		}
		for(i = x.length - 1;i >= 0; i--) {
			z = x[i].toString(radix);
			if(i < (x.length - 1)) {
				y[y.length] = zeros.substring(0, keta - z.length);
			}
			y[y.length] = z;
		}
		return y.join("");
	}

	// 内部計算用
	getShort(n) {
		if((n < 0) || (this.element.length <= n)) {
			return 0;
		}
		return this.element[n];
	}

	byteValue() {
		let x = this.getShort(0);
		x &= 0xFF;
		if((x > 0)&&(this.sign < 0)) {
			x = -x;
		}
		return x;
	}

	shortValue() {
		let x = this.getShort(0);
		x &= 0xFFFF;
		if((x > 0)&&(this.sign < 0)) {
			x = -x;
		}
		return x;
	}

	intValue() {
		let x = this.getShort(0) + (this.getShort(1) << 16);
		x &= 0xFFFFFFFF;
		if((x > 0)&&(this.sign < 0)) {
			x = -x;
		}
		return x;
	}

	longValue() {
		let x = 0;
		for(let i = 3; i >= 0; i--) {
			x *= 65536;
			x += this.getShort(i);
		}
		if(this.sign < 0) {
			x = -x;
		}
		return x;
	}

	floatValue() {
		return parseFloat(this.toString());
	}

	doubleValue() {
		return parseFloat(this.toString());
	}

	clone() {
		const y = new BigInteger();
		y.element = this.element.slice(0);
		y.sign    = this.sign;
		return y;
	}

	getLowestSetBit() {
		for(let i = 0;i < this.element.length;i++) {
			if(this.element[i] !==  0) {
				const x = this.element[i];
				for(let j = 0; j < 16; j++) {
					if(((x >>> j) & 1) !==  0) {
						return i * 16 + j;
					}
				}
			}
		}
		return -1;
	}

	bitLength() {
		for(let i = this.element.length - 1;i >= 0;i--) {
			if(this.element[i] !==  0) {
				const x = this.element[i];
				for(let j = 15; j >= 0; j--) {
					if(((x >>> j) & 1) !==  0) {
						return i * 16 + j + 1;
					}
				}
			}
		}
		return 0;
	}

	bitCount() {
		let target;
		if(this.sign >= 0) {
			target = this;
		}
		else {
			target = this.add(new BigInteger(1));
		}
		const len = target.bitLength();
		let bit = 0;
		let count = 0;
		for(let i = 0;bit < len;i++) {
			const x = target.element[i];
			for(let j = 0;((j < 16) && (bit < len));j++, bit++) {
				if(((x >>> j) & 1) !==  0) {
					count = count + 1;
				}
			}
		}
		return count;
	}

	// 内部計算用
	// 負の場合は、2の補数表現を作成します
	getTwosComplement(len) {
		const y = this.clone();
		if(y.sign >= 0) {
			return y;
		}
		else {
			// 正にする
			y.sign = 1;
			// ビットの数が存在しない場合は数える
			if(arguments.length === 0) {
				len = y.bitLength();
			}
			const e = y.element;
			// ビット反転後
			for(let i = 0; i < e.length; i++) {
				e[i] ^= 0xFFFF;
			}
			// 1～15ビット余る場合は、16ビットずつ作成しているので削る
			// nビットのマスク（なお負の値を表す最上位ビットは削除する）
			if((len % 16) !== 0) {
				e[e.length - 1] &= (1 << (len % 16)) - 1;
			}
			// 1を加算
			y._add(new BigInteger(1));
			return y;
		}
	}

	_and(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		let e1  = this, e2 = val;
		const s1  = e1.signum(), s2 = e2.signum();
		const len = Math.max(e1.bitLength(), e2.bitLength());
		// 引数が負の場合は、2の補数
		e1 = e1.getTwosComplement(len).element;
		e2 = e2.getTwosComplement(len).element;
		const size = Math.max(e1.length, e2.length);
		this.element = [];
		for(let i = 0;i < size;i++) {
			const x1 = (i >= e1.length) ? 0 : e1[i];
			const x2 = (i >= e2.length) ? 0 : e2[i];
			this.element[i] = x1 & x2;
		}
		if(this.bitLength() === 0) {
			this.element = [];
			this.sign = 0;
		}
		if((s1 === 1)||(s2 === 1)) {
			this.sign = 1;
		}
		// 出力が負の場合は、2の補数
		else if(this.sign === -1) {
			this.element = this.getTwosComplement(len).element;
		}
		return this;
	}

	and(val) {
		return this.clone()._and(val);
	}

	_or(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		let e1  = this, e2 = val;
		const s1  = e1.signum(), s2 = e2.signum();
		const len = Math.max(e1.bitLength(), e2.bitLength());
		// 引数が負の場合は、2の補数
		e1 = e1.getTwosComplement(len).element;
		e2 = e2.getTwosComplement(len).element;
		const size = Math.max(e1.length, e2.length);
		this.element = [];
		for(let i = 0;i < size;i++) {
			const x1 = (i >= e1.length) ? 0 : e1[i];
			const x2 = (i >= e2.length) ? 0 : e2[i];
			this.element[i] = x1 | x2;
		}
		this.sign = ((s1 === -1)||(s2 === -1)) ? -1 : Math.max(s1, s2);
		// 出力が負の場合は、2の補数
		if(this.sign === -1) {
			this.element = this.getTwosComplement(len).element;
		}
		return this;
	}

	or(val) {
		return this.clone()._or(val);
	}

	_xor(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		let e1  = this, e2 = val;
		const s1  = e1.signum(), s2 = e2.signum();
		const len = Math.max(e1.bitLength(), e2.bitLength());
		// 引数が負の場合は、2の補数
		e1 = e1.getTwosComplement(len).element;
		e2 = e2.getTwosComplement(len).element;
		const size = Math.max(e1.length, e2.length);
		this.element = [];
		for(let i = 0;i < size;i++) {
			const x1 = (i >= e1.length) ? 0 : e1[i];
			const x2 = (i >= e2.length) ? 0 : e2[i];
			this.element[i] = x1 ^ x2;
		}
		this.sign = ((s1 !== 0)&&(s1 !== s2)) ? -1 : 1;
		// 出力が負の場合は、2の補数
		if(this.sign === -1) {
			this.element = this.getTwosComplement(len).element;
		}
		return this;
	}

	xor(val) {
		return(this.clone()._xor(val));
	}

	_not() {
		return(this._add(new BigInteger(1))._negate());
	}

	not() {
		return(this.clone()._not());
	}

	_andNot(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		return(this._and(val.not()));
	}

	andNot(val) {
		return(this.clone()._andNot(val));
	}

	_number_to_binary_number(x) {
		if(x > 0xFFFFFFFF) {
			return(this._string_to_binary_number(x.toFixed(), 10));
		}
		const y = [];
		while(x !==  0) {
			y[y.length] = x & 1;
			x >>>= 1;
		}
		x = [];
		for(let i = 0; i < y.length; i++) {
			x[i >>> 4] |= y[i] << (i & 0xF);
		}
		return x;
	}

	_string_to_binary_number(text, radix) {
		// 下の変換をすることで、2進数での変換時に内部のforの繰り返す回数が減る
		// v0.03 出来る限りまとめてn進数変換する
		const max_num = 0x3FFFFFFF;
		const keta = Math.floor( Math.log(max_num) / Math.log(radix) );
		const calcradix = Math.round(Math.pow(radix, keta));
		let x = [];
		const y = [];
		const len = Math.ceil(text.length / keta);
		let offset = text.length;
		for(let i = 0; i < len; i++ ) {
			offset -= keta;
			if(offset >= 0) {
				x[i] = parseInt(text.substring(offset, offset + keta), radix);
			}
			else {
				x[i] = parseInt(text.substring(0, offset + keta), radix);
			}
		}
		radix = calcradix;
		// v0.03ここまで
		// 2で割っていくアルゴリズムで2進数に変換する
		while(x.length !==  0) {
			// 2で割っていく
			// 隣の桁でたcarryはradix進数をかけて桁上げしてる
			let carry = 0;
			for(let i = x.length - 1; i >= 0; i--) {
				const a = x[i] + carry * radix;
				x[i]  = a >>> 1;
				carry = a & 1;
			}
			// 1余るかどうかをテストする
			y[y.length] = carry;
			// xが0になっている部分は削除していく
			if(x[x.length - 1] === 0) {
				x.pop();
			}
		}
		// メモリ節約のため1つの変数（16ビット）に収めるだけ収めていく
		x = [];
		for(let i = 0; i < y.length; i++) {
			x[i >>> 4] |= y[i] << (i & 0xF);
		}
		return x;
	}

	_binary_number_to_string(binary, radix) {
		const add = function(x1, x2, y) {
			const size = x1.length;
			let carry = 0;
			for(let i = 0; i < size; i++) {
				y[i] = x1[i] + ((x2.length >= (i + 1)) ? x2[i] : 0) + carry;
				if(y[i] >= radix) {
					carry = 1;
					y[i] -= radix;
				}
				else {
					carry = 0;
				}
			}
			if(carry === 1) {
				y[size] = 1;
			}
		};
		const y = [0];
		const t = [1];
		for(let i = 0;i < binary.length;i++) {
			for(let j = 0; j < 16; j++) {
				if((binary[i] >>> j) & 1) {
					add(t, y, y);
				}
				add(t, t, t);
			}
		}
		return y;
	}

	_memory_allocation(n) {
		const elementsize = this.element.length << 4;
		if(elementsize < n) {
			const addsize = (((n - elementsize - 1) & 0xFFFFFFF0) >>> 4) + 1;
			for(let i = 0;i < addsize;i++) {
				this.element[this.element.length] = 0;
			}
		}
	}

	_memory_reduction() {
		for(let i = this.element.length - 1;i >= 0;i--) {
			if(this.element[i] !==  0) {
				if(i < this.element.length - 1) {
					this.element.splice(i + 1, this.element.length - i - 1);
				}
				return;
			}
		}
		this.sign = 0;
		this.element = [];
	}

	// ユークリッド互除法（非再帰）
	// x = this, y = val としたとき gcd(x,y)を返す
	gcd(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		let x = this, y = val, z;
		while(y.signum() !== 0) {
			z = x.remainder(y);
			x = y;
			y = z;
		}
		return x;
	}

	// 拡張ユークリッド互除法（非再帰）
	// x = this, y = valとしたとき、 a*x + b*y = c = gcd(x, y) の[a, b, c]を返す
	extgcd(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		const ONE  = new BigInteger(1);
		const ZERO = new BigInteger(0);
		let r0 = this, r1 = val, r2, q1;
		let a0 = ONE,  a1 = ZERO, a2;
		let b0 = ZERO, b1 = ONE,  b2;
		while(r1.signum() !== 0) {
			const y = r0.divideAndRemainder(r1);
			q1 = y[0];
			r2 = y[1];
			a2 = a0.subtract(q1.multiply(a1));
			b2 = b0.subtract(q1.multiply(b1));
			a0 = a1;
			a1 = a2;
			b0 = b1;
			b1 = b2;
			r0 = r1;
			r1 = r2;
		}
		return [a0, b0, r0];
	}

	_abs() {
		// -1 -> 1, 0 -> 0, 1 -> 1
		this.sign *= this.sign;
		return this;
	}

	abs() {
		return this.clone()._abs();
	}


	_negate() {
		this.sign *= -1;
		return this;
	}

	negate() {
		return this.clone()._negate();
	}

	signum() {
		if(this.element.length === 0) {
			return 0;
		}
		return this.sign;
	}

	compareToAbs(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		if(this.element.length < val.element.length) {
			return -1;
		}
		else if(this.element.length > val.element.length) {
			return 1;
		}
		for(let i = this.element.length - 1;i >= 0;i--) {
			if(this.element[i] !== val.element[i]) {
				const x = this.element[i] - val.element[i];
				return ( (x === 0) ? 0 : ((x > 0) ? 1 : -1) );
			}
		}
		return 0;
	}

	compareTo(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		if(this.signum() !== val.signum()) {
			if(this.sign > val.sign) {
				return 1;
			}
			else {
				return -1;
			}
		}
		else if(this.signum() === 0) {
			return 0;
		}
		return this.compareToAbs(val) * this.sign;
	}

	max(val) {
		if(this.compareTo(val) >= 0) {
			return this.clone();
		}
		else {
			return val.clone();
		}
	}

	min(val) {
		if(this.compareTo(val) >= 0) {
			return val.clone();
		}
		else {
			return this.clone();
		}
	}

	_shift(n) {
		if(n === 0) {
			return this;
		}
		const x = this.element;
		// 1ビットなら専用コードで高速計算
		if(n === 1) {
			let i = x.length - 1;
			if((x[i] & 0x8000) !==  0) {
				x[x.length] = 1;
			}
			for(;i >= 0;i--) {
				x[i] <<= 1;
				x[i]  &= 0xFFFF;
				if((i > 0) && ((x[i - 1] & 0x8000) !==  0)) {
					x[i] += 1;
				}
			}
		}
		else if(n === -1) {
			for(let i = 0;i < x.length;i++) {
				x[i] >>>= 1;
				if((i < x.length - 1) && ((x[i + 1] & 1) !==  0)) {
					x[i] |= 0x8000;
				}
			}
			if(x[x.length - 1] === 0) {
				x.pop();
			}
		}
		else {
			// 16ビット単位なら配列を追加削除する高速計算
			if(n >= 16) {
				const m = n >>> 4;
				for(let i = x.length - 1; i >= 0; i--) {
					x[i + m] = x[i];
				}
				for(let i = m - 1; i >= 0; i--) {
					x[i] = 0;
				}
				n &= 0xF;
			}
			else if(n <= -16){
				const m = (-n) >>> 4;
				x.splice(0, m);
				n += m << 4;
			}
			if(n !== 0) {
				// 15ビット以内ならビット演算でまとめて操作
				if(0 < n) {
					let carry = 0;
					for(let i = 0; i < x.length; i++) {
						x[i] = (x[i] << n) + carry;
						if(x[i] > 0xFFFF) {
							carry = x[i] >>> 16;
							x[i] &= 0xFFFF;
						}
						else {
							carry = 0;
						}
					}
					if(carry !== 0) {
						x[x.length] = carry;
					}
				}
				else {
					n = -n;
					for(let i = 0; i < x.length; i++) {
						if(i !== x.length - 1) {
							x[i] += x[i + 1] << 16;
							x[i] >>>= n;
							x[i] &= 0xFFFF;
						}
						else {
							x[i] >>>= n;
						}
					}
					if(x[x.length - 1] === 0) {
						x.pop();
					}
				}
			}
		}
		return this;
	}

	shift(n) {
		return this.clone()._shift(n);
	}

	shiftLeft(n) {
		return this.shift(n);
	}

	shiftRight(n) {
		return this.shift(-n);
	}

	_add(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		const o1 = this;
		const o2 = val;
		let x1 = o1.element;
		let x2 = o2.element;
		if(o1.sign === o2.sign) {
			//足し算
			this._memory_allocation(x2.length << 4);
			let carry = 0;
			for(let i = 0; i < x1.length; i++) {
				x1[i] += ((x2.length >= (i + 1)) ? x2[i] : 0) + carry;
				if(x1[i] > 0xFFFF) {
					carry = 1;
					x1[i] &= 0xFFFF;
				}
				else {
					carry = 0;
				}
			}
			if(carry !== 0) {
				x1[x1.length] = carry;
			}
		}
		else {
			// 引き算
			const compare = o1.compareToAbs(o2);
			if(compare === 0) {
				this.element = [];
				this.sign = 1;
				return this;
			}
			else if(compare === -1) {
				this.sign = o2.sign;
				const swap = x1;
				x1 = x2.slice(0);
				x2 = swap;
			}
			let carry = 0;
			for(let i = 0; i < x1.length; i++) {
				x1[i] -= ((x2.length >= (i + 1)) ? x2[i] : 0) + carry;
				if(x1[i] < 0) {
					x1[i] += 0x10000;
					carry  = 1;
				}
				else {
					carry  = 0;
				}
			}
			this.element = x1;
			this._memory_reduction();
		}
		return this;
	}

	add(val) {
		return this.clone()._add(val);
	}

	_subtract(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		const sign = val.sign;
		const out  = this._add(val._negate());
		val.sign = sign;
		return out;
	}

	subtract(val) {
		return this.clone()._subtract(val);
	}

	_multiply(val) {
		const x = this.multiply(val);
		this.element = x.element;
		this.sign    = x.sign;
		return this;
	}

	multiply(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		const out  = new BigInteger();
		const buff = new BigInteger();
		const o1 = this;
		const o2 = val;
		const x1 = o1.element;
		const x2 = o2.element;
		const y  = out.element;
		for(let i = 0; i < x1.length; i++) {
			buff.element = [];
			// x3 = x1[i] * x2
			const x3 = buff.element;
			let carry = 0;
			for(let j = 0; j < x2.length; j++) {
				x3[j] = x1[i] * x2[j] + carry;
				if(x3[j] > 0xFFFF) {
					carry = x3[j] >>> 16;
					x3[j] &= 0xFFFF;
				}
				else {
					carry = 0;
				}
			}
			if(carry !== 0) {
				x3[x3.length] = carry;
			}
			// x3 = x3 << (i * 16)
			//buff._shift(i << 4);
			for(let j = x3.length - 1; j >= 0; j--) {
				x3[j + i] = x3[j];
			}
			for(let j = i - 1; j >= 0; j--) {
				x3[j] = 0;
			}
			// y = y + x3 (out._add(buff))
			//out._add(buff);
			carry = 0;
			out._memory_allocation(x3.length << 4);
			for(let j = i; j < y.length; j++) {
				y[j] += ((x3.length >= (j + 1)) ? x3[j] : 0) + carry;
				if(y[j] > 0xFFFF) {
					carry = 1;
					y[j] &= 0xFFFF;
				}
				else {
					carry = 0;
				}
			}
			if(carry !== 0) {
				y[y.length] = carry;
			}
		}
		out.sign = this.sign * val.sign;
		return out;
	}

	_divideAndRemainder(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		const out = [];
		if(val.signum() === 0) {
			out[0] = 1 / 0;
			out[1] = 0 / 0;
			return out;
		}
		const compare = this.compareToAbs(val);
		if(compare < 0) {
			out[0] = new BigInteger(0);
			out[1] = this.clone();
			return out;
		}
		else if(compare === 0) {
			out[0] = new BigInteger(1);
			out[0].sign = this.sign * val.sign;
			out[1] = new BigInteger(0);
			return out;
		}
		const ONE = new BigInteger(1);
		const size = this.bitLength() - val.bitLength();
		const x1 = this.clone()._abs();
		const x2 = val.shift(size)._abs();
		const y  = new BigInteger();
		for(let i = 0; i <= size; i++) {
			if(x1.compareToAbs(x2) >= 0) {
				x1._subtract(x2);
				y._add(ONE);
			}
			if(i === size) {
				break;
			}
			x2._shift(-1);
			y._shift(1);
		}
		out[0] = y;
		out[0].sign = this.sign * val.sign;
		out[1] = x1;
		out[1].sign = this.sign;
		return out;
	}

	divideAndRemainder(val) {
		return this.clone()._divideAndRemainder(val);
	}

	_divide(val) {
		return this._divideAndRemainder(val)[0];
	}

	divide(val) {
		return this.clone()._divide(val);
	}

	_remainder(val) {
		return this._divideAndRemainder(val)[1];
	}

	remainder(val) {
		return this.clone()._remainder(val);
	}

	_mod(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		if(val.signum() < 0) {
			return null;
		}
		const y = this._divideAndRemainder(val);
		if(y[1] instanceof BigInteger) {
			if(y[1].signum() >= 0) {
				return y[1];
			}
			else {
				return y[1]._add(val);
			}
		}
		return null;
	}

	mod(val) {
		return this.clone()._mod(val);
	}

	_setBit(n) {
		this._memory_allocation(n + 1);
		this.element[n >>> 4] |= 1 << (n & 0xF);
		return this;
	}

	setBit(n) {
		return this.clone()._setBit(n);
	}

	_flipBit(n) {
		this._memory_allocation(n + 1);
		this.element[n >>> 4] ^= 1 << (n & 0xF);
		return this;
	}

	flipBit(n) {
		return this.clone()._flipBit(n);
	}

	clearBit(n) {
		const y = this.clone();
		y.element[n >>> 4] &= ~(1 << (n & 0xF));
		y._memory_reduction();
		return y;
	}

	testBit(n) {
		return ((this.element[n >>> 4] >>> (n & 0xF)) & 1);
	}

	pow(n) {
		let x, y;
		x = new BigInteger(this);
		y = new BigInteger(1);
		while(n !== 0) {
			if((n & 1) !== 0) {
				y = y.multiply(x);
			}
			x = x.multiply(x);
			n >>>= 1;
		}
		return y;
	}

	modPow(exponent, m) {
		m = new BigInteger(m);
		let x = new BigInteger(this);
		let y = new BigInteger(1);
		const e = new BigInteger(exponent);
		while(e.element.length !== 0) {
			if((e.element[0] & 1) !== 0) {
				y = y.multiply(x).mod(m);
			}
			x = x.multiply(x).mod(m);
			e._shift(-1);
		}
		return y;
	}

	modInverse(m) {
		m = new BigInteger(m);
		const y = this.extgcd(m);
		const ONE  = new BigInteger(1);
		if(y[2].compareTo(ONE) !== 0) {
			return null;
		}
		// 正にするため remainder ではなく mod を使用する
		return y[0]._add(m)._mod(m);
	}

	isProbablePrime(certainty) {
		const e = this.element;
		//0, 1, 2 -> true
		if( (e.length === 0) || ((e.length === 1)&&(e[0] <= 2)) ) {
			return true;
		}
		//even number -> false
		else if( ((e[0] & 1) === 0) || (certainty <= 0) ) {
			return false;
		}
		if(typeof Random === "undefined") {
			return false;
		}
		// ミラーラビン素数判定法
		// かなり処理が重たいです。まあお遊び程度に使用という感じで。
		certainty	= certainty >> 1;
		const ZERO	= new BigInteger(0);
		const ONE	= new BigInteger(1);
		const n		= this;
		const LEN	= n.bitLength();
		const n_1	= n.subtract(ONE);
		const s 	= n_1.getLowestSetBit();
		const d 	= n_1.shift(-s);
		const random = new Random();
		let a;
		let isComposite;
		for(let i = 0; i < certainty; i++ ) {
			//[ 1, n - 1] の範囲から a を選択
			do {
				a = new BigInteger( LEN, random );
			} while(( a.compareTo(ZERO) === 0 )||( a.compareTo(n) !== -1 ));
			// a^d != 1 mod n
			a = a.modPow(d, n);
			if( a.compareTo(ONE) === 0 ) {
				continue;
			}
			// x ^ 4 % 2 = ((x ^ 2 % 2) ^ 2 % 2) のように分解しておく
			isComposite = true;
			for(let j = 0; j <= s; j++) {
				if(a.compareTo(n_1) === 0) {
					isComposite = false;
					break;
				}
				if(j < s) {
					a = a.multiply(a)._mod(n);
				}
			}
			if(isComposite) {
				return false;
			}
		}
		return true;
	}

	nextProbablePrime() {
		if(typeof Random === "undefined") {
			return(new BigInteger(0));
		}
		const x = this.clone();
		const ONE	= new BigInteger(1);
		while(true) {
			x._add(ONE);
			if(x.isProbablePrime(100)) {
				break;
			}
		}
		return x;
	}
	
	static valueOf(x) {
		return new BigInteger(x);
	}
	
	static probablePrime(bitLength, rnd) {
		return new BigInteger(bitLength ,100 ,rnd);
	}
	
}

BigInteger.ONE = new BigInteger(1);
BigInteger.TEN = new BigInteger(10);
BigInteger.ZERO = new BigInteger(0);

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class BigDecimal {

	constructor() {
		this.integer = 0;
		this._scale = 0;
		let p1 = 0;
		let p2 = 0;
		let p3 = null;
		if(arguments.length >= 1) {
			p1 = arguments[0];
		}
		if(arguments.length >= 2) {
			p2 = arguments[1];
		}
		if(arguments.length >= 3) {
			p3 = arguments[2];
		}
		// BigDecimal(BigInteger val, MathContext mc)
		if(p2 instanceof MathContext) {
			p3 = p2;
		}
		if(p1 instanceof BigDecimal) {
			// Senko.println(p1.integer);
			this.integer	= p1.integer.clone();
			this._scale		= p1._scale;
			this.int_string	= p1.int_string;
		}
		else if(p1 instanceof BigInteger) {
			this.integer = p1.clone();
			this._scale   = p2;
		}
		else if(typeof p1 === "number") {
			// 整数か
			if(p1 === Math.floor(p1)) {
				this.integer = new BigInteger(p1);
				this._scale   = 0;
			}
			// 実数か
			else {
				this._scale = 0;
				while(true) {
					p1 = p1 * 10;
					this._scale = this._scale + 1;
					if(p1 === Math.floor(p1)) {
						break;
					}
				}
				this.integer = new BigInteger(p1);
			}
		}
		else if(typeof p1 === "string") {
			this._scale = 0;
			let buff;
			// 正規化
			let text = p1.replace(/\s/g, "").toLowerCase();
			// +-の符号があるか
			let number_text = "";
			buff = text.match(/^[-+]+/);
			if(buff !== null) {
				buff = buff[0];
				text = text.substring(buff.length, text.length);
				if(buff.indexOf("-") !== -1) {
					number_text += "-";
				}
			}
			// 整数部があるか
			buff = text.match(/^[0-9]+/);
			if(buff !== null) {
				buff = buff[0];
				text = text.substring(buff.length, text.length);
				number_text += buff;
			}
			// 小数部があるか
			buff = text.match(/^\.[0-9]+/);
			if(buff !== null) {
				buff = buff[0];
				text = text.substring(buff.length, text.length);
				buff = buff.substring(1, buff.length);
				this._scale   = this._scale + buff.length;
				number_text += buff;
			}
			// 指数表記があるか
			buff = text.match(/^e(\+|-)?[0-9]+/);
			if(buff !== null) {
				buff = buff[0].substring(1, buff[0].length);
				this._scale   = this._scale - parseInt(buff, 10);
			}
			this.integer = new BigInteger(number_text, 10);
		}
		if(p3 instanceof MathContext) {
			const newbigdecimal = this.round(p3);
			this.integer	= newbigdecimal.integer;
			this._scale		= newbigdecimal._scale;
		}
		//	Senko.println(p1 + "\t\n->\t[" + this.integer + "," + this._scale +"]\n\t"+ this.toEngineeringString() );
	}

	_getUnsignedIntegerString() {
		// キャッシュする
		if(typeof this.int_string === "undefined") {
			this.int_string = this.integer.toString(10).replace(/^-/, "");
		}
		return this.int_string;
	}

	clone() {
		return new BigDecimal(this);
	}

	scale() {
		return this._scale;
	}

	signum() {
		return this.integer.signum();
	}

	precision() {
		return this._getUnsignedIntegerString().length;
	}

	unscaledValue() {
		return new BigInteger(this.integer);
	}

	toScientificNotation(e) {
		const text	= this._getUnsignedIntegerString();
		let s		= this.scale();
		const x		= [];
		let i, k;
		// -
		if(this.signum() === -1) {
			x[x.length] = "-";
		}
		// 表示上の桁数
		s = - e - s;
		// 小数点が付かない
		if(s >= 0) {
			x[x.length] = text;
			for(i = 0; i < s; i++) {
				x[x.length] = "0";
			}
		}
		// 小数点が付く
		else {
			k = this.precision() + s;
			if(0 < k) {
				x[x.length] = text.substring(0, k);
				x[x.length] = ".";
				x[x.length] = text.substring(k, text.length);
			}
			else {
				k = - k;
				x[x.length] = "0.";
				for(i = 0; i < k; i++) {
					x[x.length] = "0";
				}
				x[x.length] = text;
			}
		}
		x[x.length] = "E";
		if(e >= 0) {
			x[x.length] = "+";
		}
		x[x.length] = e;
		return x.join("");
	}

	toString() {
		// 「調整された指数」
		const x = - this.scale() + (this.precision() - 1);
		// スケールが 0 以上で、「調整された指数」が -6 以上
		if((this.scale() >= 0) && (x >= -6)) {
			return this.toPlainString();
		}
		else {
			return this.toScientificNotation(x);
		}
	}

	toEngineeringString() {
		// 「調整された指数」
		const x = - this.scale() + (this.precision() - 1);
		// スケールが 0 以上で、「調整された指数」が -6 以上
		if((this.scale() >= 0) && (x >= -6)) {
			return this.toPlainString();
		}
		else {
			// 0 でない値の整数部が 1 〜 999 の範囲に収まるように調整
			return this.toScientificNotation(Math.floor(x / 3) * 3);
		}
	}

	toPlainString() {
		// スケールの変換なし
		if(this.scale() === 0) {
			if(this.signum() < 0) {
				return "-" + this._getUnsignedIntegerString();
			}
			else {
				return this._getUnsignedIntegerString();
			}
		}
		// 指数0で文字列を作成後、Eの後ろの部分をとっぱらう
		const text = this.toScientificNotation(0);
		return text.match(/^[^E]*/)[0];
	}

	ulp() {
		return new BigDecimal(BigInteger.ONE, this.scale());
	}

	setScale(newScale, roundingMode) {
		if(this.scale() === newScale) {
			// scaleが同一なので処理の必要なし
			return(this.clone());
		}
		if(arguments.length === 1) {
			roundingMode = RoundingMode.UNNECESSARY;
		}
		else {
			roundingMode = RoundingMode.getRoundingMode(roundingMode);
		}
		// 文字列を扱ううえで、符号があるとやりにくいので外しておく
		let text		= this._getUnsignedIntegerString();
		const sign		= this.signum();
		const sign_text	= sign >= 0 ? "" : "-";
		// scale の誤差
		// 0 以上なら 0 を加えればいい。0未満なら0を削るか、四捨五入など丸めを行う
		const delta		= newScale - this.scale();	// この桁分増やすといい
		if(0 <= delta) {
			// 0を加える
			let i;
			for(i = 0; i < delta; i++) {
				text = text + "0";
			}
			return new BigDecimal(new BigInteger(sign_text + text), newScale);
		}
		const keta			= text.length + delta;		// 最終的な桁数
		const keta_marume		= keta + 1;
		if(keta <= 0) {
			// 指定した scale では設定できない場合
			// 例えば "0.1".setScale(-2), "10".setScale(-3) としても表すことは不可能であるため、
			// sign（-1, 0, +1）のどれかの数値を使用して丸める
			const outdata = (sign + roundingMode.getAddNumber(sign)) / 10;
			// 上記の式は、CEILINGなら必ず1、正でCEILINGなら1、負でFLOORなら1、それ以外は0となり、
			// さらに元々の数値が 0 なら 0、切り捨て不能なら例外が返る計算式である。
			// これは Java の動作をまねています。
			return new BigDecimal(new BigInteger(outdata), newScale);
		}
		{
			// 0を削るだけで解決する場合
			// 単純な切捨て(0を削るのみ)
			const zeros			= text.match(/0+$/);
			const zero_length		= (zeros !== null) ? zeros[0].length : 0;
			if(( (zero_length + delta) >= 0 ) || (roundingMode === RoundingMode.DOWN)) {
				return new BigDecimal(new BigInteger(sign_text + text.substring(0, keta)), newScale);
			}
		}
		{
			// 丸め計算で解決する場合
			// 12345 -> '123'45
			text = text.substring(0, keta_marume);
			// 丸め計算に必要な切り取る桁数(後ろの1～2桁を取得)
			const cutsize = text.length > 1 ? 2 : 1;
			// '123'45 -> 1'23'4
			const number = parseInt(text.substring(text.length - cutsize, text.length)) * sign;
			// 「元の数」と「丸めに必要な数」を足す
			const x1 = new BigInteger(sign_text + text);
			const x2 = new BigInteger(roundingMode.getAddNumber(number));
			text = x1.add(x2).toString();
			// 丸め後の桁数に戻して
			return new BigDecimal(new BigInteger(text.substring(0, text.length - 1)), newScale);
		}
	}

	round(mc) {
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}
		const newPrecision	= mc.getPrecision();
		const delta			= newPrecision - this.precision();
		if((delta === 0)||(newPrecision === 0)) {
			return this.clone();
		}
		const newBigDecimal = this.setScale( this.scale() + delta, mc.getRoundingMode());
		/* 精度を上げる必要があるため、0を加えた場合 */
		if(delta > 0) {
			return newBigDecimal;
		}
		/* 精度を下げる必要があるため、丸めた場合は、桁の数が正しいか調べる */
		if(newBigDecimal.precision() === mc.getPrecision()) {
			return newBigDecimal;
		}
		/* 切り上げなどで桁数が１つ増えた場合 */
		const sign_text	= newBigDecimal.integer.signum() >= 0 ? "" : "-";
		const abs_text	= newBigDecimal._getUnsignedIntegerString();
		const inte_text	= sign_text + abs_text.substring(0, abs_text.length - 1);
		return new BigDecimal(new BigInteger(inte_text), newBigDecimal.scale() - 1);
	}

	abs(mc) {
		const output = this.clone();
		output.integer = output.integer.abs();
		if(arguments.length === 1) {
			return output;
		}
		else {
			if(!(mc instanceof MathContext)) {
				throw "not MathContext";
			}
			return output.round(mc);
		}
	}

	plus(mc) {
		const output = this.clone();
		if(arguments.length === 1) {
			return output;
		}
		else {
			if(!(mc instanceof MathContext)) {
				throw "not MathContext";
			}
			return output.round(mc);
		}
	}

	negate(mc) {
		const output = this.clone();
		output.integer = output.integer.negate();
		if(arguments.length === 1) {
			return output;
		}
		else {
			if(!(mc instanceof MathContext)) {
				throw "not MathContext";
			}
			return output.round(mc);
		}
	}

	compareTo(val) {
		if(!(val instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		const src			= this;
		const tgt			= val;
		// 簡易計算
		{
			const src_sign	= src.signum();
			const tgt_sign	= tgt.signum();
			if((src_sign === 0) && (src_sign === tgt_sign)) {
				return 0;
			}
			else if(src_sign === 0) {
				return - tgt_sign;
			}
			else if(tgt_sign === 0) {
				return src_sign;
			}
		}
		// 実際に計算する
		if(src._scale === tgt._scale) {
			return src.integer.compareTo(tgt.integer);
		}
		else if(src._scale > tgt._scale) {
			const newdst = tgt.setScale(src._scale);
			return src.integer.compareTo(newdst.integer);
		}
		else {
			const newsrc = src.setScale(tgt._scale);
			return newsrc.integer.compareTo(tgt.integer);
		}
	}

	equals(x) {
		if(!(x instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		return ((this._scale === x._scale) && (this.integer.equals(x.integer)));
	}

	min(val) {
		if(!(val instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		if(this.compareTo(val) <= 0) {
			return this.clone();
		}
		else {
			return val.clone();
		}
	}

	max(val) {
		if(!(val instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		if(this.compareTo(val) >= 0) {
			return this.clone();
		}
		else {
			return val.clone();
		}
	}

	movePointLeft(n) {
		let output = this.scaleByPowerOfTen( -n );
		output = output.setScale(Math.max(this.scale() + n, 0));
		return output;
	}

	movePointRight(n) {
		let output = this.scaleByPowerOfTen( n );
		output = output.setScale(Math.max(this.scale() - n, 0));
		return output;
	}

	scaleByPowerOfTen(n) {
		const output = this.clone();
		output._scale = this.scale() - n;
		return output;
	}

	stripTrailingZeros() {
		// 0をできる限り取り除く
		const sign		= this.signum();
		const sign_text	= sign >= 0 ? "" : "-";
		const text		= this.integer.toString(10).replace(/^-/, "");
		const zeros		= text.match(/0+$/);
		let zero_length	= (zeros !== null) ? zeros[0].length : 0;
		if(zero_length === text.length) {
			// 全て 0 なら 1 ケタ残す
			zero_length = text.length - 1;
		}
		const newScale	= this.scale() - zero_length;
		return new BigDecimal(new BigInteger(sign_text + text.substring(0, text.length - zero_length)), newScale);
	}

	add(augend, mc) {
		if(arguments.length === 1) {
			mc = MathContext.UNLIMITED;
		}
		if(!(augend instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}
		const src			= this;
		const tgt			= augend;
		const newscale	= Math.max(src._scale, tgt._scale);
		if(src._scale === tgt._scale) {
			// 1 e1 + 1 e1 = 1
			return new BigDecimal(src.integer.add(tgt.integer), newscale, mc);
		}
		else if(src._scale > tgt._scale) {
			// 1 e-2 + 1 e-1
			const newdst = tgt.setScale(src._scale);
			// 0.01 + 0.10 = 0.11 = 11 e-2
			return new BigDecimal(src.integer.add(newdst.integer), newscale, mc);
		}
		else {
			// 1 e-1 + 1 e-2
			const newsrc = src.setScale(tgt._scale);
			// 0.1 + 0.01 = 0.11 = 11 e-2
			return new BigDecimal(newsrc.integer.add(tgt.integer), newscale, mc);
		}
	}

	subtract(subtrahend, mc) {
		if(arguments.length === 1) {
			mc = MathContext.UNLIMITED;
		}
		if(!(subtrahend instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}
		const src			= this;
		const tgt			= subtrahend;
		const newscale	= Math.max(src._scale, tgt._scale);
		if(src._scale === tgt._scale) {
			return new BigDecimal(src.integer.subtract(tgt.integer), newscale, mc);
		}
		else if(src._scale > tgt._scale) {
			const newdst = tgt.setScale(src._scale);
			return new BigDecimal(src.integer.subtract(newdst.integer), newscale, mc);
		}
		else {
			const newsrc = src.setScale(tgt._scale);
			return new BigDecimal(newsrc.integer.subtract(tgt.integer), newscale, mc);
		}
	}

	multiply(multiplicand, mc) {
		if(arguments.length === 1) {
			mc = MathContext.UNLIMITED;
		}
		if(!(multiplicand instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}
		const src			= this;
		const tgt			= multiplicand;
		const newinteger	= src.integer.multiply(tgt.integer);
		// 0.1 * 0.01 = 0.001
		const newscale	= src._scale + tgt._scale;
		return new BigDecimal(newinteger, newscale, mc);
	}

	divideToIntegralValue(divisor, mc) {
		if(arguments.length === 1) {
			mc = MathContext.UNLIMITED;
		}
		if(!(divisor instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}
		const getDigit  = function( num ) {
			let i;
			let text = "1";
			for(i = 0; i < num; i++) {
				text = text + "0";
			}
			return new BigInteger(text);
		};
		if(divisor.compareTo(BigDecimal.ZERO) === 0) {
			throw "ArithmeticException";
		}

		// 1000e0		/	1e2				=	1000e-2
		// 1000e0		/	10e1			=	100e-1
		// 1000e0		/	100e0			=	10e0
		// 1000e0		/	1000e-1			=	1e1
		// 1000e0		/	10000e-2		=	1e1
		// 1000e0		/	100000e-3		=	1e1

		// 10e2			/	100e0			=	1e1
		// 100e1		/	100e0			=	1e1
		// 1000e0		/	100e0			=	10e0
		// 10000e-1		/	100e0			=	100e-1	
		// 100000e-2	/	100e0			=	1000e-2

		const src		= this;
		const tgt		= divisor;
		let src_integer	= src.integer;
		let tgt_integer	= tgt.integer;
		const newScale	= src._scale - tgt._scale;

		// 100e-2 / 3e-1 = 1 / 0.3 -> 100 / 30
		if(src._scale > tgt._scale) {
			// src._scale に合わせる
			tgt_integer = tgt_integer.multiply(getDigit(  newScale ));
		}
		// 1e-1 / 3e-2 = 0.1 / 0.03 -> 10 / 3
		else if(src._scale < tgt._scale) {
			// tgt._scale に合わせる
			src_integer = src_integer.multiply(getDigit( -newScale ));
		}

		// とりあえず計算結果だけ作ってしまう
		const new_integer	= src_integer.divide(tgt_integer);
		const sign			= new_integer.signum();
		if(sign !== 0) {
			const text	= new_integer.toString(10).replace(/^-/, "");
			// 指定した桁では表すことができない
			if((mc.getPrecision() !== 0) && (text.length > mc.getPrecision())) {
				throw "ArithmeticException";
			}
			// 結果の優先スケール に合わせる (this.scale() - divisor.scale())
			if(text.length <= (-newScale)) {
				// 合わせることができないので、0をできる限り削る = stripTrailingZerosメソッド
				const zeros			= text.match(/0+$/);
				const zero_length	= (zeros !== null) ? zeros[0].length : 0;
				const sign_text		= sign >= 0 ? "" : "-";
				return(new BigDecimal(new BigInteger(sign_text + text.substring(0, text.length - zero_length)), -zero_length));
			}
		}

		let output = new BigDecimal(new_integer);
		output = output.setScale(newScale, RoundingMode.UP);
		output = output.round(mc);
		return output;
	}

	divideAndRemainder(divisor, mc) {
		if(arguments.length === 1) {
			mc = MathContext.UNLIMITED;
		}
		if(!(divisor instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}

		// 1000e0		/	1e2				=	1000e-2	... 0e0
		// 1000e0		/	10e1			=	100e-1	... 0e0
		// 1000e0		/	100e0			=	10e0	... 0e0
		// 1000e0		/	1000e-1			=	1e1		... 0e0
		// 1000e0		/	10000e-2		=	1e1		... 0e-1
		// 1000e0		/	100000e-3		=	1e1		... 0e-2

		// 10e2			/	100e0			=	1e1		... 0e1
		// 100e1		/	100e0			=	1e1		... 0e1
		// 1000e0		/	100e0			=	10e0	... 0e0
		// 10000e-1		/	100e0			=	100e-1	... 0e-1
		// 100000e-2	/	100e0			=	1000e-2	... 0e-2

		const result_divide	= this.divideToIntegralValue(divisor, mc);
		const result_remaind	= this.subtract(result_divide.multiply(divisor, mc), mc);

		const output = [result_divide, result_remaind];
		return output;
	}

	divide(divisor, p1, p2) {
		if(!(divisor instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		const src			= this;
		const tgt			= divisor;
		let roundingMode	= null;
		let mc				= MathContext.UNLIMITED;
		let newScale		= 0;
		let isPriorityScale	= false;
		let parm;
		if(arguments.length === 1) {
			newScale		 = src.scale() - tgt.scale();
			isPriorityScale	= true;
		}
		else if(arguments.length === 2) {
			parm = p1;
			newScale		= src.scale();
			isPriorityScale	= true;
			if(parm instanceof MathContext) {
				mc = parm;
				roundingMode = mc.getRoundingMode();
			}
			else {
				roundingMode = RoundingMode.getRoundingMode(arguments[0]);
			}
		}
		else if(arguments.length === 3) {
			if((typeof p1 === "number")||(p1 instanceof Number)) {
				newScale = p1;
			}
			else {
				throw "scale is not Integer";
			}
			parm = p2;
			if(parm instanceof MathContext) {
				mc = parm;
				roundingMode = mc.getRoundingMode();
			}
			else {
				roundingMode = RoundingMode.getRoundingMode(arguments[0]);
			}
		}
		else {
			throw "The argument is over.";
		}
		if(tgt.compareTo(BigDecimal.ZERO) === 0) {
			throw "ArithmeticException";
		}
		let i;
		let newsrc = src;
		const result_map = [];
		let result, result_divide, result_remaind, all_result;
		all_result = BigDecimal.ZERO;
		const precision = mc.getPrecision();
		const check_max = precision !== 0 ? (precision + 8) : 0x3FFFF;
		for(i = 0; i < check_max; i++) {
			result = newsrc.divideAndRemainder(tgt, MathContext.UNLIMITED);
			result_divide	= result[0];
			result_remaind	= result[1];
			all_result = all_result.add(result_divide.scaleByPowerOfTen(-i), MathContext.UNLIMITED);
			if(result_remaind.compareTo(BigDecimal.ZERO) !== 0) {
				if(precision === 0) {	// 精度無限大の場合は、循環小数のチェックが必要
					if(result_map[result_remaind._getUnsignedIntegerString()]) {
						throw "ArithmeticException " + all_result + "[" + result_remaind._getUnsignedIntegerString() + "]";
					}
					else {
						result_map[result_remaind._getUnsignedIntegerString()] = true;
					}
				}
				newsrc = result_remaind.scaleByPowerOfTen(1);
			}
			else {
				break;
			}
		}
		if(isPriorityScale) {
			// 優先スケールの場合は、スケールの変更に失敗する可能性あり
			try {
				all_result = all_result.setScale(newScale, roundingMode);
			}
			catch(e) {
				// falls through
			}
		}
		else {
			all_result = all_result.setScale(newScale, roundingMode);
		}
		all_result = all_result.round(mc);
		return all_result;
	}

	toBigInteger() {
		const x = this.toPlainString().replace(/\.\d*$/, "");
		return new BigInteger(x.toPlainString());
	}

	toBigIntegerExact() {
		const x = this.setScale(0, RoundingMode.UNNECESSARY);
		return new BigInteger(x.toPlainString());
	}

	longValue() {
		let x = this.toBigInteger();
		x = x.longValue();
		return x;
	}

	longValueExact() {
		let x = this.toBigIntegerExact();
		x = x.longValue();
		return x;
	}

	intValue() {
		let x = this.toBigInteger();
		x = x.intValue();
		return x & 0xFFFFFFFF;
	}

	intValueExact() {
		let x = this.toBigIntegerExact();
		x = x.longValue();
		if((x < -2147483648) || (2147483647 < x)) {
			throw "ArithmeticException";
		}
		return x;
	}

	floatValue() {
		const p = this.precision();
		if(MathContext.DECIMAL32.getPrecision() < p) {
			return(this.signum() >= 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY);
		}
		return parseFloat(p.toEngineeringString());
	}

	doubleValue() {
		const p = this.precision();
		if(MathContext.DECIMAL64.getPrecision() < p) {
			return(this.signum() >= 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY);
		}
		return parseFloat(p.toEngineeringString());
	}

	pow(n, mc) {
		if(Math.abs(n) > 999999999) {
			throw "ArithmeticException";
		}
		if(arguments.length === 1) {
			mc = MathContext.UNLIMITED;
		}
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}
		if((mc.getPrecision() === 0) && (n < 0)) {
			throw "ArithmeticException";
		}
		if((mc.getPrecision() > 0) && (n > mc.getPrecision())) {
			throw "ArithmeticException";
		}
		let x, y;
		x = this.clone();
		y = BigDecimal.ONE;
		while(n !== 0) {
			if((n & 1) !== 0) {
				y = y.multiply(x, MathContext.UNLIMITED);
			}
			x = x.multiply(x, MathContext.UNLIMITED);
			n >>>= 1;
		}
		return y.round(mc);
	}
	
	static valueOf(val, scale) {
		if(arguments.length === 1) {
			return new BigDecimal(val);
		}
		else if(arguments.length === 2) {
			if((typeof val === "number") && (val === Math.floor(val))) {
				return new BigDecimal(new BigInteger(val), scale);
			}
			else {
				throw "IllegalArgumentException";
			}
		}
		throw "IllegalArgumentException";
	}
	
}

const RoundingMode = {
	
	// 0 から離れる
	UP: {
		toString : function() {
			return "UP";
		},
		getAddNumber : function(x) {
			x = x % 10;
			if(x === 0) {
				return 0;
			}
			else if(x > 0) {
				return 10 - x;
			}
			else {
				return (-(10 + x));
			}
		}
	},
	
	// 0 に近づく
	DOWN: {
		toString : function() {
			return "DOWN";
		},
		getAddNumber : function(x) {
			x = x % 10;
			return -x;
		}
	},
	
	// 正の無限大に近づく
	CEILING: {
		toString : function() {
			return "CEILING";
		},
		getAddNumber : function(x) {
			x = x % 10;
			if(x === 0) {
				return 0;
			}
			else if(x > 0) {
				return 10 - x;
			}
			else {
				return -x;
			}
		}
	},
	
	// 負の無限大に近づく
	FLOOR: {
		toString : function() {
			return "FLOOR";
		},
		getAddNumber : function(x) {
			x = x % 10;
			if(x === 0) {
				return 0;
			}
			else if(x > 0) {
				return -x;
			}
			else {
				return(-(10 + x));
			}
		}
	},
	
	// 四捨五入
	HALF_UP: {
		toString : function() {
			return "HALF_UP";
		},
		getAddNumber : function(x) {
			x = x % 10;
			const sign = x >= 0 ? 1 : -1;
			if(Math.abs(x) < 5) {
				return (x * -1);
			}
			else {
				return (sign * (10 - Math.abs(x)));
			}
		}
	},
	
	// 五捨六入
	HALF_DOWN: {
		toString : function() {
			return "HALF_DOWN";
		},
		getAddNumber : function(x) {
			x = x % 10;
			const sign = x >= 0 ? 1 : -1;
			if(Math.abs(x) < 6) {
				return (x * -1);
			}
			else {
				return (sign * (10 - Math.abs(x)));
			}
		}
	},
	
	// 等間隔なら偶数側へ丸める
	HALF_EVEN: {
		toString : function() {
			return "HALF_EVEN";
		},
		getAddNumber : function(x) {
			x = x % 100;
			let sign, even;
			if(x < 0) {
				sign = -1;
				even = Math.ceil(x / 10) & 1;
			}
			else {
				sign = 1;
				even = Math.floor(x / 10) & 1;
			}
			let center;
			if(even === 1) {
				center = 5;
			}
			else {
				center = 6;
			}
			x = x % 10;
			if(Math.abs(x) < center) {
				return (x * -1);
			}
			else {
				return (sign * (10 - Math.abs(x)));
			}
		}
	},
	
	// 丸めない（丸める必要が出る場合はエラー）
	UNNECESSARY: {
		toString : function() {
			return "UNNECESSARY";
		},
		getAddNumber : function(x) {
			x = x % 10;
			if(x === 0) {
				return 0;
			}
			else {
				throw "ArithmeticException";
			}
		}
	},
	
	valueOf: function(name) {
		if(name === null) {
			throw "NullPointerException";
		}
		const values = RoundingMode.values;
		for(let i = 0; i < values.length; i++) {
			if(values[i].toString() === name) {
				return values[i];
			}
		}
		throw "IllegalArgumentException";
	},
	
	getRoundingMode: function(roundingMode) {
		let mode;
		switch(roundingMode) {
			case RoundingMode.CEILING:
			case RoundingMode.DOWN:
			case RoundingMode.FLOOR:
			case RoundingMode.HALF_DOWN:
			case RoundingMode.HALF_EVEN:
			case RoundingMode.HALF_UP:
			case RoundingMode.UNNECESSARY:
			case RoundingMode.UP:
				mode = roundingMode;
				break;
			default:
				if((typeof roundingMode === "number")||(roundingMode instanceof Number)) {
					mode = RoundingMode.values[roundingMode];
				}
				else if((typeof roundingMode === "string")||(roundingMode instanceof String)) {
					mode = RoundingMode.valueOf(roundingMode);
				}
		}
		if(!mode) {
			throw "Not RoundingMode";
		}
		return mode;
	}
};

RoundingMode.values = {
	0	:	RoundingMode.CEILING,
	1	:	RoundingMode.DOWN,
	2	:	RoundingMode.FLOOR,
	3	:	RoundingMode.HALF_DOWN,
	4	:	RoundingMode.HALF_EVEN,
	5	:	RoundingMode.HALF_UP,
	6	:	RoundingMode.UNNECESSARY,
	7	:	RoundingMode.UP
};

class MathContext {

	constructor() {
		this.precision = 0;
		this.roundingMode = RoundingMode.HALF_UP;
		let p1 = 0;
		let p2 = 0;
		let buff;
		if(arguments.length >= 1) {
			p1 = arguments[0];
		}
		if(arguments.length >= 2) {
			p2 = arguments[1];
		}
		if((typeof p1 === "string")||(p1 instanceof String)) {
			buff = p1.match(/precision=\d+/);
			if(buff !== null) {
				buff = buff[0].substring("precision=".length, buff[0].length);
				this.precision = parseInt(buff, 10);
			}
			buff = p1.match(/roundingMode=\w+/);
			if(buff !== null) {
				buff = buff[0].substring("roundingMode=".length, buff[0].length);
				this.roundingMode = RoundingMode.valueOf(buff);
			}	
		}
		else if(arguments.length === 1) {
			this.precision = p1;
		}
		else if(arguments.length === 2) {
			this.precision = p1;
			this.roundingMode = p2;
		}
		if(this.precision < 0) {
			throw "IllegalArgumentException";
		}
	}

	getPrecision() {
		return this.precision;
	}

	getRoundingMode() {
		return this.roundingMode;
	}

	equals(x) {
		if(x instanceof MathContext) {
			if(x.toString() === this.toString()) {
				return true;
			}
		}
		return false;
	}

	toString() {
		return ("precision=" + this.precision + " roundingMode=" + this.roundingMode.toString());
	}
}

MathContext.UNLIMITED	= new MathContext(0,	RoundingMode.HALF_UP);
MathContext.DECIMAL32	= new MathContext(7,	RoundingMode.HALF_EVEN);
MathContext.DECIMAL64	= new MathContext(16,	RoundingMode.HALF_EVEN);
MathContext.DECIMAL128	= new MathContext(34,	RoundingMode.HALF_EVEN);

BigDecimal.RoundingMode			= RoundingMode;
BigDecimal.MathContext			= MathContext;

BigDecimal.ZERO					= new BigDecimal(0);
BigDecimal.ONE					= new BigDecimal(1);
BigDecimal.TEN					= new BigDecimal(10);
BigDecimal.ROUND_CEILING		= RoundingMode.CEILING;
BigDecimal.ROUND_DOWN			= RoundingMode.DOWN;
BigDecimal.ROUND_FLOOR			= RoundingMode.FLOOR;
BigDecimal.ROUND_HALF_DOWN		= RoundingMode.HALF_DOWN;
BigDecimal.ROUND_HALF_EVEN		= RoundingMode.HALF_EVEN;
BigDecimal.ROUND_HALF_UP		= RoundingMode.HALF_UP;
BigDecimal.ROUND_UNNECESSARY	= RoundingMode.UNNECESSARY;
BigDecimal.ROUND_UP				= RoundingMode.UP;

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const S3Math =  {
	EPSILON: 2.2204460492503130808472633361816E-8,
	
	clamp: function(x, min, max) {
		return (x < min) ? min : (x > max) ? max : x;
	},
	
	step: function(edge, x) {
		return edge > x ? 1 : 0;
	},
	
	mix: function(v0, v1, x) {
		return v0 + (v1 - v0) * x;
	},
	
	smoothstep: function(v0, v1, x) {
		const s = x * x * (3.0 - 2.0 * x);
		return v0 + (v1 - v0) * s;
	},
	
	equals: function(x1, x2) {
		return Math.abs(x1 - x2) < S3Math.EPSILON;
	},
	
	mod: function(x, y) {
		return x - y * parseInt(x / y);
	},
	
	sign: function(x) {
		return x >= 0.0 ? 1.0 : -1.0;
	},
	
	fract: function(x) {
		return x - Math.floor(x);
	},
	
	rsqrt: function(x) {
		return Math.sqrt(1.0 / x);
	},
	
	radius: function(degree) {
		return (degree / 360.0) * (2.0 * Math.PI);
	},
	
	degrees: function(rad) {
		return rad / (2.0 * Math.PI) * 360.0;
	}
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3Matrix {
	
	/**
	 * 3DCG用 の4x4行列  (immutable)
	 * 引数は、MATLAB と同じように行で順番に定義していきます。
	 * この理由は、行列を初期化する際に見た目が分かりやすいためです。
	 * 9個の引数なら3x3行列、16個の引数なら4x4行列として扱います。
	 * @param {Number} m00
	 * @param {Number} m01
	 * @param {Number} m02
	 * @param {Number} m03
	 * @param {Number} m10
	 * @param {Number} m11
	 * @param {Number} m12
	 * @param {Number} m13
	 * @param {Number} m20
	 * @param {Number} m21
	 * @param {Number} m22
	 * @param {Number} m23
	 * @param {Number} m30
	 * @param {Number} m31
	 * @param {Number} m32
	 * @param {Number} m33
	 * @returns {S3Matrix}
	 */
	constructor(
		m00, m01, m02, m03,		// row 1
		m10, m11, m12, m13,		// row 2
		m20, m21, m22, m23,		// row 3
		m30, m31, m32, m33 ) {	// row 4
		if(arguments.length === 0) {
			this.m00 = 0.0;	this.m01 = 0.0;	this.m02 = 0.0;	this.m03 = 0.0;
			this.m10 = 0.0;	this.m11 = 0.0;	this.m12 = 0.0;	this.m13 = 0.0;
			this.m20 = 0.0;	this.m21 = 0.0;	this.m22 = 0.0;	this.m23 = 0.0;
			this.m30 = 0.0;	this.m31 = 0.0;	this.m32 = 0.0;	this.m33 = 0.0;
		}
		else if(arguments.length === 9) {
			// 3x3行列
			this.m00 = m00;	this.m01 = m01;	this.m02 = m02;	this.m03 = 0.0;
			this.m10 = m03;	this.m11 = m10;	this.m12 = m11;	this.m13 = 0.0;
			this.m20 = m12;	this.m21 = m13;	this.m22 = m20;	this.m23 = 0.0;
			this.m30 = 0.0;	this.m31 = 0.0;	this.m32 = 0.0;	this.m33 = 1.0;
		}
		else if(arguments.length === 16) {
			// 4x4行列
			this.m00 = m00;	this.m01 = m01;	this.m02 = m02;	this.m03 = m03;
			this.m10 = m10;	this.m11 = m11;	this.m12 = m12;	this.m13 = m13;
			this.m20 = m20;	this.m21 = m21;	this.m22 = m22;	this.m23 = m23;
			this.m30 = m30;	this.m31 = m31;	this.m32 = m32;	this.m33 = m33;
		}
		else {
			throw "IllegalArgumentException";
		}
	}
	
	equals(tgt) {
		return (
			S3Math.equals(this.m00, tgt.m00) &&
			S3Math.equals(this.m01, tgt.m01) &&
			S3Math.equals(this.m02, tgt.m02) &&
			S3Math.equals(this.m03, tgt.m03) &&
			S3Math.equals(this.m10, tgt.m10) &&
			S3Math.equals(this.m11, tgt.m11) &&
			S3Math.equals(this.m12, tgt.m12) &&
			S3Math.equals(this.m13, tgt.m13) &&
			S3Math.equals(this.m20, tgt.m20) &&
			S3Math.equals(this.m21, tgt.m21) &&
			S3Math.equals(this.m22, tgt.m22) &&
			S3Math.equals(this.m23, tgt.m23) &&
			S3Math.equals(this.m30, tgt.m30) &&
			S3Math.equals(this.m31, tgt.m31) &&
			S3Math.equals(this.m32, tgt.m32) &&
			S3Math.equals(this.m33, tgt.m33)
		);
	}
	
	clone() {
		return new S3Matrix(
			this.m00, this.m01, this.m02, this.m03,
			this.m10, this.m11, this.m12, this.m13,
			this.m20, this.m21, this.m22, this.m23,
			this.m30, this.m31, this.m32, this.m33
		);
	}
	
	transposed() {
		return new S3Matrix(
			this.m00, this.m10, this.m20, this.m30,
			this.m01, this.m11, this.m21, this.m31,
			this.m02, this.m12, this.m22, this.m32,
			this.m03, this.m13, this.m23, this.m33
		);
	}

	/**
	 * 非数か確認する
	 * @returns {Boolean}
	 */
	isNaN() {
		return	isNaN(this.m00) || isNaN(this.m01) || isNaN(this.m02)  || isNaN(this.m03) ||
				isNaN(this.m10) || isNaN(this.m11) || isNaN(this.m12)  || isNaN(this.m13) ||
				isNaN(this.m20) || isNaN(this.m21) || isNaN(this.m22)  || isNaN(this.m23) ||
				isNaN(this.m30) || isNaN(this.m31) || isNaN(this.m32)  || isNaN(this.m33);
	}

	/**
	 * 有限の値であるか確認する
	 * @returns {Boolean}
	 */
	isFinite() {
		return	isFinite(this.m00) && isFinite(this.m01) && isFinite(this.m02)  && isFinite(this.m03) ||
				isFinite(this.m10) && isFinite(this.m11) && isFinite(this.m12)  && isFinite(this.m13) ||
				isFinite(this.m20) && isFinite(this.m21) && isFinite(this.m22)  && isFinite(this.m23) ||
				isFinite(this.m30) && isFinite(this.m31) && isFinite(this.m32)  && isFinite(this.m33);
	}

	/**
	 * 実数か確認する
	 * @returns {Boolean}
	 */
	isRealNumber() {
		return !this.isNaN() && this.isFinite();
	}

	/**
	 * 掛け算します。
	 * @param {S3Vector|S3Matrix} tgt 行列、縦ベクトル
	 * @returns {S3Vector|S3Matrix}
	 */
	mul(tgt) {
		if(tgt instanceof S3Matrix) {
			const A = this;
			const B = tgt;
			const C = new S3Matrix();
			// 行列クラスのコンストラクタを変更しても問題がないように
			// 後で代入を行っております。
			C.m00 = A.m00 * B.m00 + A.m01 * B.m10 + A.m02 * B.m20 + A.m03 * B.m30;
			C.m01 = A.m00 * B.m01 + A.m01 * B.m11 + A.m02 * B.m21 + A.m03 * B.m31;
			C.m02 = A.m00 * B.m02 + A.m01 * B.m12 + A.m02 * B.m22 + A.m03 * B.m32;
			C.m03 = A.m00 * B.m03 + A.m01 * B.m13 + A.m02 * B.m23 + A.m03 * B.m33;
			C.m10 = A.m10 * B.m00 + A.m11 * B.m10 + A.m12 * B.m20 + A.m13 * B.m30;
			C.m11 = A.m10 * B.m01 + A.m11 * B.m11 + A.m12 * B.m21 + A.m13 * B.m31;
			C.m12 = A.m10 * B.m02 + A.m11 * B.m12 + A.m12 * B.m22 + A.m13 * B.m32;
			C.m13 = A.m10 * B.m03 + A.m11 * B.m13 + A.m12 * B.m23 + A.m13 * B.m33;
			C.m20 = A.m20 * B.m00 + A.m21 * B.m10 + A.m22 * B.m20 + A.m23 * B.m30;
			C.m21 = A.m20 * B.m01 + A.m21 * B.m11 + A.m22 * B.m21 + A.m23 * B.m31;
			C.m22 = A.m20 * B.m02 + A.m21 * B.m12 + A.m22 * B.m22 + A.m23 * B.m32;
			C.m23 = A.m20 * B.m03 + A.m21 * B.m13 + A.m22 * B.m23 + A.m23 * B.m33;
			C.m30 = A.m30 * B.m00 + A.m31 * B.m10 + A.m32 * B.m20 + A.m33 * B.m30;
			C.m31 = A.m30 * B.m01 + A.m31 * B.m11 + A.m32 * B.m21 + A.m33 * B.m31;
			C.m32 = A.m30 * B.m02 + A.m31 * B.m12 + A.m32 * B.m22 + A.m33 * B.m32;
			C.m33 = A.m30 * B.m03 + A.m31 * B.m13 + A.m32 * B.m23 + A.m33 * B.m33;
			return C;
		}
		else if(tgt instanceof S3Vector) {
			const A = this;
			const v = tgt;
			// 行列×縦ベクトル＝縦ベクトル
			// Av = u なので、各項を行列の行ごとで掛け算する
			return new S3Vector(
				A.m00 * v.x + A.m01 * v.y + A.m02 * v.z + A.m03 * v.w,
				A.m10 * v.x + A.m11 * v.y + A.m12 * v.z + A.m13 * v.w,
				A.m20 * v.x + A.m21 * v.y + A.m22 * v.z + A.m23 * v.w,
				A.m30 * v.x + A.m31 * v.y + A.m32 * v.z + A.m33 * v.w
			);
		}
		else {
			throw "IllegalArgumentException";
		}
	}
	
	det3() {
		const A = this;
		let out;
		out  = A.m00 * A.m11 * A.m22;
		out += A.m10 * A.m21 * A.m02;
		out += A.m20 * A.m01 * A.m12;
		out -= A.m00 * A.m21 * A.m12;
		out -= A.m20 * A.m11 * A.m02;
		out -= A.m10 * A.m01 * A.m22;
		return out;
	}
	
	inverse3() {
		const A = this;
		const det = A.det3();
		if(det === 0.0) {
			return( null );
		}
		const id = 1.0 / det;
		const B = A.clone();
		B.m00 = (A.m11 * A.m22 - A.m12 * A.m21) * id;
		B.m01 = (A.m02 * A.m21 - A.m01 * A.m22) * id;
		B.m02 = (A.m01 * A.m12 - A.m02 * A.m11) * id;
		B.m10 = (A.m12 * A.m20 - A.m10 * A.m22) * id;
		B.m11 = (A.m00 * A.m22 - A.m02 * A.m20) * id;
		B.m12 = (A.m02 * A.m10 - A.m00 * A.m12) * id;
		B.m20 = (A.m10 * A.m21 - A.m11 * A.m20) * id;
		B.m21 = (A.m01 * A.m20 - A.m00 * A.m21) * id;
		B.m22 = (A.m00 * A.m11 - A.m01 * A.m10) * id;
		return B;
	}
	
	det4() {
		const A = this;
		let out;
		out  = A.m00 * A.m11 * A.m22 * A.m33;
		out += A.m00 * A.m12 * A.m23 * A.m31;
		out += A.m00 * A.m13 * A.m21 * A.m32;
		out += A.m01 * A.m10 * A.m23 * A.m32;
		out += A.m01 * A.m12 * A.m20 * A.m33;
		out += A.m01 * A.m13 * A.m22 * A.m30;
		out += A.m02 * A.m10 * A.m21 * A.m33;
		out += A.m02 * A.m11 * A.m23 * A.m30;
		out += A.m02 * A.m13 * A.m20 * A.m31;
		out += A.m03 * A.m10 * A.m22 * A.m31;
		out += A.m03 * A.m11 * A.m20 * A.m32;
		out += A.m03 * A.m12 * A.m21 * A.m30;
		out -= A.m00 * A.m11 * A.m23 * A.m32;
		out -= A.m00 * A.m12 * A.m21 * A.m33;
		out -= A.m00 * A.m13 * A.m22 * A.m31;
		out -= A.m01 * A.m10 * A.m22 * A.m33;
		out -= A.m01 * A.m12 * A.m23 * A.m30;
		out -= A.m01 * A.m13 * A.m20 * A.m32;
		out -= A.m02 * A.m10 * A.m23 * A.m31;
		out -= A.m02 * A.m11 * A.m20 * A.m33;
		out -= A.m02 * A.m13 * A.m21 * A.m30;
		out -= A.m03 * A.m10 * A.m21 * A.m32;
		out -= A.m03 * A.m11 * A.m22 * A.m30;
		out -= A.m03 * A.m12 * A.m20 * A.m31;
		return out;
	}
	
	inverse4() {
		const A = this;
		const det = A.det4();
		if(det === 0.0) {
			return( null );
		}
		const id = 1.0 / det;
		const B = new S3Matrix();
		B.m00 = (A.m11*A.m22*A.m33 + A.m12*A.m23*A.m31 + A.m13*A.m21*A.m32 - A.m11*A.m23*A.m32 - A.m12*A.m21*A.m33 - A.m13*A.m22*A.m31) * id;
		B.m01 = (A.m01*A.m23*A.m32 + A.m02*A.m21*A.m33 + A.m03*A.m22*A.m31 - A.m01*A.m22*A.m33 - A.m02*A.m23*A.m31 - A.m03*A.m21*A.m32) * id;
		B.m02 = (A.m01*A.m12*A.m33 + A.m02*A.m13*A.m31 + A.m03*A.m11*A.m32 - A.m01*A.m13*A.m32 - A.m02*A.m11*A.m33 - A.m03*A.m12*A.m31) * id;
		B.m03 = (A.m01*A.m13*A.m22 + A.m02*A.m11*A.m23 + A.m03*A.m12*A.m21 - A.m01*A.m12*A.m23 - A.m02*A.m13*A.m21 - A.m03*A.m11*A.m22) * id;
		B.m10 = (A.m10*A.m23*A.m32 + A.m12*A.m20*A.m33 + A.m13*A.m22*A.m30 - A.m10*A.m22*A.m33 - A.m12*A.m23*A.m30 - A.m13*A.m20*A.m32) * id;
		B.m11 = (A.m00*A.m22*A.m33 + A.m02*A.m23*A.m30 + A.m03*A.m20*A.m32 - A.m00*A.m23*A.m32 - A.m02*A.m20*A.m33 - A.m03*A.m22*A.m30) * id;
		B.m12 = (A.m00*A.m13*A.m32 + A.m02*A.m10*A.m33 + A.m03*A.m12*A.m30 - A.m00*A.m12*A.m33 - A.m02*A.m13*A.m30 - A.m03*A.m10*A.m32) * id;
		B.m13 = (A.m00*A.m12*A.m23 + A.m02*A.m13*A.m20 + A.m03*A.m10*A.m22 - A.m00*A.m13*A.m22 - A.m02*A.m10*A.m23 - A.m03*A.m12*A.m20) * id;
		B.m20 = (A.m10*A.m21*A.m33 + A.m11*A.m23*A.m30 + A.m13*A.m20*A.m31 - A.m10*A.m23*A.m31 - A.m11*A.m20*A.m33 - A.m13*A.m21*A.m30) * id;
		B.m21 = (A.m00*A.m23*A.m31 + A.m01*A.m20*A.m33 + A.m03*A.m21*A.m30 - A.m00*A.m21*A.m33 - A.m01*A.m23*A.m30 - A.m03*A.m20*A.m31) * id;
		B.m22 = (A.m00*A.m11*A.m33 + A.m01*A.m13*A.m30 + A.m03*A.m10*A.m31 - A.m00*A.m13*A.m31 - A.m01*A.m10*A.m33 - A.m03*A.m11*A.m30) * id;
		B.m23 = (A.m00*A.m13*A.m21 + A.m01*A.m10*A.m23 + A.m03*A.m11*A.m20 - A.m00*A.m11*A.m23 - A.m01*A.m13*A.m20 - A.m03*A.m10*A.m21) * id;
		B.m30 = (A.m10*A.m22*A.m31 + A.m11*A.m20*A.m32 + A.m12*A.m21*A.m30 - A.m10*A.m21*A.m32 - A.m11*A.m22*A.m30 - A.m12*A.m20*A.m31) * id;
		B.m31 = (A.m00*A.m21*A.m32 + A.m01*A.m22*A.m30 + A.m02*A.m20*A.m31 - A.m00*A.m22*A.m31 - A.m01*A.m20*A.m32 - A.m02*A.m21*A.m30) * id;
		B.m32 = (A.m00*A.m12*A.m31 + A.m01*A.m10*A.m32 + A.m02*A.m11*A.m30 - A.m00*A.m11*A.m32 - A.m01*A.m12*A.m30 - A.m02*A.m10*A.m31) * id;
		B.m33 = (A.m00*A.m11*A.m22 + A.m01*A.m12*A.m20 + A.m02*A.m10*A.m21 - A.m00*A.m12*A.m21 - A.m01*A.m10*A.m22 - A.m02*A.m11*A.m20) * id;
		return B;
	}
	
	toString() {
		return "[" +
		"[" + this.m00 + " " + this.m01 + " " + this.m02 + " " + this.m03 + "]\n" + 
		" [" + this.m10 + " " + this.m11 + " " + this.m12 + " " + this.m13 + "]\n" + 
		" [" + this.m20 + " " + this.m21 + " " + this.m22 + " " + this.m23 + "]\n" + 
		" [" + this.m30 + " " + this.m31 + " " + this.m32 + " " + this.m33 + "]]";
	}
	
	toInstanceArray(Instance, dimension) {
		if(dimension === 1) {
			return new Instance([this.m00]);
		}
		else if(dimension === 4) {
			return new Instance(
				[   this.m00, this.m10, 
					this.m01, this.m11]);
		}
		else if(dimension === 9) {
			return new Instance(
				[   this.m00, this.m10, this.m20,
					this.m01, this.m11, this.m21,
					this.m02, this.m12, this.m22]);
		}
		else {
			return new Instance(
				[   this.m00, this.m10, this.m20, this.m30,
					this.m01, this.m11, this.m21, this.m31,
					this.m02, this.m12, this.m22, this.m32,
					this.m03, this.m13, this.m23, this.m33]);
		}
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3Vector {
	
	/**
	 * 3DCG用 のベクトルクラス (immutable)
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} z
	 * @param {Number} w (遠近除算用のため掛け算以外で使用されません)
	 * @returns {S3Vector}
	 */
	constructor(x, y, z, w) {
		this.x = x;
		this.y = y;
		if(z === undefined) {
			this.z = 0.0;
		}
		else {
			this.z = z;
		}
		if(w === undefined) {
			this.w = 1.0;
		}
		else {
			this.w = w;
		}
	}
	
	clone() {
		return new S3Vector(this.x, this.y, this.z, this.w);
	}
	
	negate() {
		return new S3Vector(-this.x, -this.y, -this.z, this.w);
	}
	
	cross(tgt) {
		return new S3Vector(
			this.y * tgt.z - this.z * tgt.y,
			this.z * tgt.x - this.x * tgt.z,
			this.x * tgt.y - this.y * tgt.x,
			1.0
		);
	}
	
	dot(tgt) {
		return this.x * tgt.x + this.y * tgt.y + this.z * tgt.z;
	}
	
	add(tgt) {
		return new S3Vector(
			this.x + tgt.x,
			this.y + tgt.y,
			this.z + tgt.z,
			1.0
		);
	}
	
	sub(tgt) {
		return new S3Vector(
			this.x - tgt.x,
			this.y - tgt.y,
			this.z - tgt.z,
			1.0
		);
	}
	
	mul(tgt) {
		if(tgt instanceof S3Vector) {
			return new S3Vector(
				this.x * tgt.x,
				this.y * tgt.y,
				this.z * tgt.z,
				1.0
			);
		}
		else if(tgt instanceof S3Matrix) {
			// 横ベクトル×行列＝横ベクトル
			const v = this;
			const A = tgt;
			// vA = u なので、各項を行列の列ごとで掛け算する
			return new S3Vector(
				v.x * A.m00 + v.y * A.m10 + v.z * A.m20 + v.w * A.m30,
				v.x * A.m01 + v.y * A.m11 + v.z * A.m21 + v.w * A.m31,
				v.x * A.m02 + v.y * A.m12 + v.z * A.m22 + v.w * A.m32,
				v.x * A.m03 + v.y * A.m13 + v.z * A.m23 + v.w * A.m33
			);
		}
		else if(typeof tgt === "number") {
			return new S3Vector(
				this.x * tgt,
				this.y * tgt,
				this.z * tgt,
				1.0
			);
		}
		else {
			throw "IllegalArgumentException";
		}
	}
	
	setX(x) {
		return new S3Vector(x, this.y, this.z, this.w);
	}
	
	setY(y) {
		return new S3Vector(this.x, y, this.z, this.w);
	}
	
	setZ(z) {
		return new S3Vector(this.x, this.y, z, this.w);
	}
	
	setW(w) {
		return new S3Vector(this.x, this.y, this.z, w);
	}
	
	max(tgt) {
		return new S3Vector(
			Math.max(this.x, tgt.x),
			Math.max(this.y, tgt.y),
			Math.max(this.z, tgt.z),
			Math.max(this.w, tgt.w)
		);
	}
	
	min(tgt) {
		return new S3Vector(
			Math.min(this.x, tgt.x),
			Math.min(this.y, tgt.y),
			Math.min(this.z, tgt.z),
			Math.min(this.w, tgt.w)
		);
	}

	equals(tgt) {
		return (
			S3Math.equals(this.x, tgt.x) &&
			S3Math.equals(this.y, tgt.y) &&
			S3Math.equals(this.z, tgt.z) &&
			S3Math.equals(this.w, tgt.w)
		);
	}
	
	mix(tgt, alpha) {
		return new S3Vector(
			S3Math.mix(this.x, tgt.x, alpha),
			S3Math.mix(this.y, tgt.y, alpha),
			S3Math.mix(this.z, tgt.z, alpha),
			S3Math.mix(this.w, tgt.w, alpha)
		);
	}
	
	norm() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}
	
	normFast() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}
	
	normalize() {
		let b = this.normFast();
		if(b === 0.0) {
			throw "divide error";
		}
		b = Math.sqrt(1.0 / b);
		return new S3Vector(
			this.x * b,
			this.y * b,
			this.z * b,
			1.0
		);
	}
	
	toString(num) {
		if(num === 1) {
			return "[" + this.x + "]T";
		}
		else if(num === 2) {
			return "[" + this.x + "," + this.y + "]T";
		}
		else if(num === 3) {
			return "[" + this.x + "," + this.y + "," + this.z + "]T";
		}
		else {
			return "[" + this.x + "," + this.y + "," + this.z + "," + this.w + "]T";
		}
	}
	
	toHash(num) {
		const s = 4;
		const t = 10000;
		let x = (parseFloat(this.x.toExponential(3).substring(0,5)) * 321) & 0xFFFFFFFF;
		if(num >= 2) {
			x = (x * 12345 + parseFloat(this.y.toExponential(s).substring(0,s+2)) * t) & 0xFFFFFFFF;
		}
		if(num >= 3) {
			x = (x * 12345 + parseFloat(this.z.toExponential(s).substring(0,s+2)) * t) & 0xFFFFFFFF;
		}
		if(num >= 4) {
			x = (x * 12345 + parseFloat(this.w.toExponential(s).substring(0,s+2)) * t) & 0xFFFFFFFF;
		}
		return x;
	}
	
	toInstanceArray(Instance, dimension) {
		if(dimension === 1) {
			return new Instance([this.x]);
		}
		else if(dimension === 2) {
			return new Instance([this.x, this.y]);
		}
		else if(dimension === 3) {
			return new Instance([this.x, this.y, this.z]);
		}
		else {
			return new Instance([this.x, this.y, this.z, this.w]);
		}
	}
	
	pushed(array, num) {
		if(num === 1) {
			array.push(this.x);
		}
		else if(num === 2) {
			array.push(this.x);
			array.push(this.y);
		}
		else if(num === 3) {
			array.push(this.x);
			array.push(this.y);
			array.push(this.z);
		}
		else {
			array.push(this.x);
			array.push(this.y);
			array.push(this.z);
			array.push(this.w);
		}
	}

	/**
	 * tgt への方向ベクトルを取得する
	 * @param {S3Vector} tgt
	 * @returns {S3Vector}
	 */
	getDirection(tgt) {
		return tgt.sub(this);
	}

	/**
	 * tgt への正規方向ベクトルを取得する
	 * @param {S3Vector} tgt
	 * @returns {S3Vector}
	 */
	getDirectionNormalized(tgt) {
		return tgt.sub(this).normalize();
	}

	/**
	 * 指定した位置までの距離を取得する
	 * @param {S3Vector} tgt
	 * @returns {Number}
	 */
	getDistance(tgt) {
		return this.getDirection(tgt).norm();
	}

	/**
	 * 非数か確認する
	 * @returns {Boolean}
	 */
	isNaN() {
		return isNaN(this.x) || isNaN(this.y) || isNaN(this.z)  || isNaN(this.w);
	}

	/**
	 * 有限の値か確認する
	 * @returns {Boolean}
	 */
	isFinite() {
		return isFinite(this.x) && isFinite(this.y) && isFinite(this.z) && isFinite(this.w);
	}

	/**
	 * 実数か確認する
	 * @returns {Boolean}
	 */
	isRealNumber() {
		return !this.isNaN() && this.isFinite();
	}

	/**
	 * A, B, C の3点を通る平面の法線と、UV座標による接線、従法線を求めます。
	 * A, B, C の3点の時計回りが表だとした場合、表方向へ延びる法線となります。
	 * @param {S3Vector} posA
	 * @param {S3Vector} posB
	 * @param {S3Vector} posC
	 * @param {S3Vector} uvA
	 * @param {S3Vector} uvB
	 * @param {S3Vector} uvC
	 * @returns {Object}
	 */
	static getNormalVector(posA, posB, posC, uvA, uvB, uvC) {
		let N;

		while(1) {
			const P0 = posA.getDirection(posB);
			const P1 = posA.getDirection(posC);
			try {
				N = (P0.cross(P1)).normalize();
			}
			catch (e) {
				// 頂点の位置が直行しているなどのエラー処理
				N = new S3Vector(0.3333, 0.3333, 0.3333);
				break;
			}
			if((uvA === null) | (uvB === null) | (uvC === null)) {
				// UV値がない場合はノーマルのみ返す
				break;
			}
			// 接線と従法線を計算するにあたり、以下のサイトを参考にしました。
			// http://sunandblackcat.com/tipFullView.php?l=eng&topicid=8
			// https://stackoverflow.com/questions/5255806/how-to-calculate-tangent-and-binormal
			// http://www.terathon.com/code/tangent.html
			const st0 = uvA.getDirection(uvB);
			const st1 = uvA.getDirection(uvC);
			let q;
			try {
				// 接線と従法線を求める
				q = 1.0 / ((st0.cross(st1)).z);
				const T = new S3Vector(); // Tangent	接線
				const B = new S3Vector(); // Binormal	従法線
				T.x = q * (  st1.y * P0.x - st0.y * P1.x);
				T.y = q * (  st1.y * P0.y - st0.y * P1.y);
				T.z = q * (  st1.y * P0.z - st0.y * P1.z);
				B.x = q * ( -st1.x * P0.x + st0.x * P1.x);
				B.y = q * ( -st1.x * P0.y + st0.x * P1.y);
				B.z = q * ( -st1.x * P0.z + st0.x * P1.z);
				return {
					normal		: N,
					tangent		: T.normalize(),
					binormal	: B.normalize()
				};
				/*
				// 接線と従法線は直行していない
				// 直行している方が行列として安定している。
				// 以下、Gram-Schmidtアルゴリズムで直行したベクトルを作成する場合
				const nT = T.sub(N.mul(N.dot(T))).normalize();
				const w  = N.cross(T).dot(B) < 0.0 ? -1.0 : 1.0;
				const nB = N.cross(nT).mul(w);
				return {
					normal		: N,
					tangent		: nT,
					binormal	: nB
				}
				*/
			}
			catch (e) {
				break;
			}
		}
		return {
			normal		: N,
			tangent		: null,
			binormal	: null
		};
	}
	
	/**
	 * A, B, C の3点が時計回りなら true をかえす。
	 * 時計回りでも反時計回りでもないと null を返す
	 * @param {S3Vector} A
	 * @param {S3Vector} B
	 * @param {S3Vector} C
	 * @returns {Boolean}
	 */
	static isClockwise(A, B, C) {
		const v1 = A.getDirection(B).setZ(0);
		const v2 = A.getDirection(C).setZ(0);
		const type = v1.cross(v2).z;
		if(type === 0) {
			return null;
		}
		else if(type > 0) {
			return true;
		}
		else {
			return false;
		}
	}

}

/**
 * 0
 * @type S3Vector
 */
S3Vector.ZERO = new S3Vector(0.0, 0.0, 0.0);

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3Camera {

	/**
	 * カメラ (mutable)
	 * @param {type} s3system
	 * @returns {S3Camera}
	 */
	constructor(s3system) {
		this.sys = s3system;
		this.init();
	}

	dispose() {
		this.sys		= null;
		this.fovY		= 0;
		this.eye		= null;
		this.at			= null;
		this.near		= 0;
		this.far		= 0;
	}
	
	init() {
		this.fovY		= 45;
		this.eye		= new S3Vector(0, 0, 0);
		this.at			= new S3Vector(0, 0, 1);
		this.near		= 1;
		this.far		= 1000;
	}
	
	clone() {
		const camera = new S3Camera(this.sys);
		camera.fovY		= this.fovY;
		camera.eye		= this.eye;
		camera.at		= this.at;
		camera.near		= this.near;
		camera.far		= this.far;
		return camera;
	}
	
	getVPSMatrix(canvas) {
		const x = S3System.calcAspect(canvas.width, canvas.height);
		// ビューイング変換行列を作成する
		const V = this.sys.getMatrixLookAt(this.eye, this.at);
		// 射影トランスフォーム行列
		const P = this.sys.getMatrixPerspectiveFov(this.fovY, x, this.near, this.far );
		// ビューポート行列
		const S = this.sys.getMatrixViewport(0, 0, canvas.width, canvas.height);
		return { LookAt : V, aspect : x, PerspectiveFov : P, Viewport : S };
	}
	
	setDrawRange(near, far) {
		this.near	= near;
		this.far	= far;
	}
	
	setFovY(fovY) {
		this.fovY = fovY;
	}
	
	setEye(eye) {
		this.eye = eye.clone();
	}
	
	setCenter(at) {
		this.at = at.clone();
	}
	
	getDirection() {
		return this.eye.getDirectionNormalized(this.at);
	}
	
	getDistance() {
		return this.at.getDistance(this.eye);
	}
	
	setDistance(distance) {
		const direction = this.at.getDirectionNormalized(this.eye);
		this.eye = this.at.add(direction.mul(distance));
	}
	
	getRotateY() {
		const ray = this.at.getDirection(this.eye);
		return S3Math.degrees(Math.atan2(ray.x, ray.z));
	}
	
	setRotateY(deg) {
		const rad = S3Math.radius(deg);
		const ray = this.at.getDirection(this.eye);
		const length = ray.setY(0).norm();
		const cos = Math.cos(rad);
		const sin = Math.sin(rad);
		this.eye = new S3Vector(
			this.at.x + length * sin,
			this.eye.y,
			this.at.z + length * cos
		);
	}
	
	addRotateY(deg) {
		this.setRotateY(this.getRotateY() + deg);
	}
	
	getRotateX() {
		const ray = this.at.getDirection(this.eye);
		return S3Math.degrees(Math.atan2( ray.z, ray.y ));
	}
	
	setRotateX(deg) {
		const rad = S3Math.radius(deg);
		const ray = this.at.getDirection(this.eye);
		const length = ray.setX(0).norm();
		const cos = Math.cos(rad);
		const sin = Math.sin(rad);
		this.eye = new S3Vector(
			this.eye.x,
			this.at.y + length * cos,
			this.at.z + length * sin
		);
	}
	
	addRotateX(deg) {
		this.setRotateX(this.getRotateX() + deg);
	}
	
	translateAbsolute(v) {
		this.eye	= this.eye.add(v);
		this.at	= this.at.add(v);
	}
	
	translateRelative(v) {
		let X, Y, Z;
		const up = new S3Vector(0.0, 1.0, 0.0);
		// Z ベクトルの作成
		Z = this.eye.getDirectionNormalized(this.at);
		
		// 座標系に合わせて計算
		if(this.sys.dimensionmode === S3System.DIMENSION_MODE.RIGHT_HAND) {
			// 右手系なら反転
			Z = Z.negate();
		}
		// X, Y ベクトルの作成
		X = up.cross(Z).normalize();
		Y = Z.cross(X);
		// 移動
		X = X.mul(v.x);
		Y = Y.mul(v.y);
		Z = Z.mul(v.z);
		this.translateAbsolute(X.add(Y).add(Z));
	}
	
	toString() {
		return "camera[\n" +
				"eye  :" + this.eye		+ ",\n" +
				"at   :" + this.at		+ ",\n" +
				"fovY :" + this.fovY 	+ "]";
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3Light {
	
	constructor() {
		this.init();
	}
	
	init() {
		this.mode		= S3Light.MODE.DIRECTIONAL_LIGHT;
		this.power		= 1.0;
		this.range		= 1000.0;
		this.position	= new S3Vector(0.0, 0.0, 0.0);
		this.direction	= new S3Vector(0.0, 0.0, -1.0);
		this.color		= new S3Vector(1.0, 1.0, 1.0);
	}
	
	clone(Instance) {
		if(!Instance) {
			Instance = S3Light;
		}
		const light = new Instance();
		light.mode		= this.mode;
		light.power		= this.power;
		light.range		= this.range;
		light.position	= this.position;
		light.direction	= this.direction;
		light.color		= this.color;
		return light;
	}
	
	setMode(mode) {
		this.mode = mode;
	}
	
	setPower(power) {
		this.power = power;
	}
	
	setRange(range) {
		this.range = range;
	}
	
	setPosition(position) {
		this.position = position;
	}
	
	setDirection(direction) {
		this.direction = direction;
	}
	
	setColor(color) {
		this.color = color;
	}
}

S3Light.MODE = {
	NONE				: 0,
	AMBIENT_LIGHT		: 1,
	DIRECTIONAL_LIGHT	: 2,
	POINT_LIGHT			: 3
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3Material {

	/**
	 * 素材 (mutable)
	 * @param {S3Material} type
	 * @param {S3Material} name
	 * @returns {S3Material}
	 */
	constructor(s3system, name) {
		this.sys		= s3system;
		this.name		= "s3default";
		if(name !== undefined) {
			this.name = name;
		}
		this.color		= new S3Vector(1.0, 1.0, 1.0, 1.0);	// 拡散反射の色
		this.diffuse	= 0.8;								// 拡散反射の強さ
		this.emission	= new S3Vector(0.0, 0.0, 0.0);		// 自己照明（輝き）
		this.specular	= new S3Vector(0.0, 0.0, 0.0);		// 鏡面反射の色
		this.power		= 5.0;								// 鏡面反射の強さ
		this.ambient	= new S3Vector(0.6, 0.6, 0.6);		// 光によらない初期色
		this.reflect	= 0.0;								// 環境マッピングによる反射の強さ
		this.textureColor	= this.sys.createTexture();
		this.textureNormal	= this.sys.createTexture();
	}

	dispose() {
	}
	
	setName(name) {
		this.name = name;
	}
	
	setColor(color) {
		this.color = this.sys._toVector3(color);
	}
	
	setDiffuse(diffuse) {
		this.diffuse = this.sys._toValue(diffuse);
	}
	
	setEmission(emission) {
		this.emission = this.sys._toVector3(emission);
	}
	
	setSpecular(specular) {
		this.specular = this.sys._toVector3(specular);
	}
	
	setPower(power) {
		this.power = this.sys._toValue(power);
	}
	
	setAmbient(ambient) {
		this.ambient = this.sys._toVector3(ambient);
	}
	
	setReflect(reflect) {
		this.reflect = this.sys._toValue(reflect);
	}
	
	setTextureColor(data) {
		if(this.textureColor !== null) {
			this.textureColor.dispose();
		}
		this.textureColor = this.sys.createTexture();
		this.textureColor.setImage(data);
	}
	
	setTextureNormal(data) {
		if(this.textureNormal !== null) {
			this.textureNormal.dispose();
		}
		this.textureNormal = this.sys.createTexture();
		this.textureNormal.setImage(data);
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3Vertex {
	
	/**
	 * 頂点 (immutable)
	 * @param {S3Vector} position 座標
	 * @returns {S3Vertex}
	 */
	constructor(position) {
		this.position	= position;
	}
	
	clone(Instance) {
		if(!Instance) {
			Instance = S3Vertex;
		}
		return new Instance(this.position);
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3TriangleIndex {

	/**
	 * ABCの頂点を囲む3角ポリゴン (immutable)
	 * @param {Number} i1 配列の番号A
	 * @param {Number} i2 配列の番号B
	 * @param {Number} i3 配列の番号C
	 * @param {Array} indexlist Index Array
	 * @param {Number} materialIndex
	 * @param {Array} uvlist S3Vector Array
	 */
	constructor(i1, i2, i3, indexlist, materialIndex, uvlist) {
		this._init(i1, i2, i3, indexlist, materialIndex, uvlist);
	}

	/**
	 * ABCの頂点を囲む3角ポリゴン (immutable)
	 * @param {Number} i1 配列の番号A
	 * @param {Number} i2 配列の番号B
	 * @param {Number} i3 配列の番号C
	 * @param {Array} indexlist Index Array
	 * @param {Number} materialIndex 負の場合や未定義の場合は 0 とします。
	 * @param {Array} uvlist S3Vector Array
	 */
	_init(i1, i2, i3, indexlist, materialIndex, uvlist) {
		this.index				= null;		// 各頂点を示すインデックスリスト
		this.uv					= null;		// 各頂点のUV座標
		this.materialIndex		= null;		// 面の材質
		if((indexlist instanceof Array) && (indexlist.length > 0)) {
			this.index = [indexlist[i1], indexlist[i2], indexlist[i3]];
		}
		else {
			throw "IllegalArgumentException";
		}
		if((uvlist !== undefined) && (uvlist instanceof Array) && (uvlist.length > 0) && (uvlist[0] instanceof S3Vector)) {
			this.uv = [uvlist[i1], uvlist[i2], uvlist[i3]];
		}
		else {
			this.uv = [null, null, null];
		}
		materialIndex = materialIndex      ? materialIndex : 0;
		materialIndex = materialIndex >= 0 ? materialIndex : 0;
		this.materialIndex = materialIndex;
	}
	
	clone(Instance) {
		if(!Instance) {
			Instance = S3TriangleIndex;
		}
		return new Instance( 0, 1, 2, this.index, this.materialIndex, this.uv );
	}
	
	inverseTriangle(Instance) {
		if(!Instance) {
			Instance = S3TriangleIndex;
		}
		return new Instance( 2, 1, 0, this.index, this.materialIndex, this.uv );
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3Mesh {
	
	/**
	 * 立体物 (mutable)
	 * @param {S3System} sys
	 * @returns {S3Mesh}
	 */
	constructor(sys) {
		this.sys = sys;
		this._init();
	}
	
	_init() {
		// 変数の準備
		this.src = {};
		this.src.vertex			= [];
		this.src.triangleindex	= [];
		this.src.material		= [];
		this.is_complete	= false;
	}
	
	isComplete() {
		return this.is_complete;
	}
	
	clone(Instance) {
		if(!Instance) {
			Instance = S3Mesh;
		}
		const mesh = new Instance(this.sys);
		mesh.addVertex(this.getVertexArray());
		mesh.addTriangleIndex(this.getTriangleIndexArray());
		mesh.addMaterial(this.getMaterialArray());
		return mesh;
	}
	
	setComplete(is_complete) {
		this.is_complete = is_complete;
	}
	
	setInverseTriangle(inverse) {
		this.setComplete(false);
		this.is_inverse = inverse; 
	}
	
	getVertexArray() {
		return this.src.vertex;
	}
	
	getTriangleIndexArray() {
		return this.src.triangleindex;
	}
	
	getMaterialArray() {
		return this.src.material;
	}
	
	addVertex(vertex) {
		// 一応 immutable なのでそのままシャローコピー
		this.setComplete(false);
		const meshvertex = this.getVertexArray(); 
		if(vertex === undefined) ;
		else if(vertex instanceof S3Vertex) {
			meshvertex[meshvertex.length] = vertex;
		}
		else {
			for(let i = 0; i < vertex.length; i++) {
				meshvertex[meshvertex.length] = vertex[i];
			}
		}
	}
	
	addTriangleIndex(ti) {
		// 一応 immutable なのでそのままシャローコピー
		this.setComplete(false);
		const meshtri = this.getTriangleIndexArray();
		if(ti === undefined) ;
		else if(ti instanceof S3TriangleIndex) {
			meshtri[meshtri.length] = this.is_inverse ? ti.inverseTriangle() : ti;
		}
		else {
			for(let i = 0; i < ti.length; i++) {
				meshtri[meshtri.length] = this.is_inverse ? ti[i].inverseTriangle() : ti[i];
			}
		}
	}
	
	addMaterial(material) {
		// 一応 immutable なのでそのままシャローコピー
		this.setComplete(false);
		const meshmat = this.getMaterialArray();
		if(material === undefined) ;
		else if(material instanceof S3Material) {
			meshmat[meshmat.length] = material;
		}
		else {
			for(let i = 0; i < material.length; i++) {
				meshmat[meshmat.length] = material[i];
			}
		}
	}
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3Angles {
	
	/**
	 * 3DCG用 のオイラー角 (immutable)
	 * @param {Number} z ロール
	 * @param {Number} x ピッチ
	 * @param {Number} y ヨー
	 * @returns {S3Angle}
	 */
	constructor(z, x, y) {
		this.setRotateZXY(z, x, y);
	}

	static _toPeriodicAngle(x) {
		if(x > S3Angles.PI) {
			return x - S3Angles.PI2 * parseInt(( x + S3Angles.PI) / S3Angles.PI2);
		}
		else if(x < -S3Angles.PI) {
			return x + S3Angles.PI2 * parseInt((-x + S3Angles.PI) / S3Angles.PI2);
		}
		return x;
	}

	clone() {
		return new S3Angles(this.roll, this.pitch, this.yaw);
	}

	setRotateZXY(z, x, y) {
		this.roll	= S3Angles._toPeriodicAngle(isNaN(z) ? 0.0 : z);
		this.pitch	= S3Angles._toPeriodicAngle(isNaN(x) ? 0.0 : x);
		this.yaw	= S3Angles._toPeriodicAngle(isNaN(y) ? 0.0 : y);
	}

	addRotateX(x) {
		return new S3Angles(this.roll, this.pitch + x, this.yaw);
	}

	addRotateY(y) {
		return new S3Angles(this.roll, this.pitch, this.yaw + y);
	}

	addRotateZ(z) {
		return new S3Angles(this.roll + z, this.pitch, this.yaw);
	}

	setRotateX(x) {
		return new S3Angles(this.roll, x, this.yaw);
	}

	setRotateY(y) {
		return new S3Angles(this.roll, this.pitch, y);
	}

	setRotateZ(z) {
		return new S3Angles(z, this.pitch, this.yaw);
	}

	toString() {
		return "angles[" + this.roll + "," + this.pitch + "," + this.yaw + "]";
	}

}

S3Angles.PI		= 180.0;
S3Angles.PIOVER2= S3Angles.PI / 2.0;
S3Angles.PILOCK	= S3Angles.PIOVER2 - 0.0001;
S3Angles.PI2	= 2.0 * S3Angles.PI;

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3Model {
	
	/**
	* 色々な情報をいれたモデル (mutable)
	* @returns {S3Model}
	*/
	constructor() {
		this._init();
	}
		
	_init() {
		this.angles			= new S3Angles();
		this.scale			= new S3Vector(1, 1, 1);
		this.position		= new S3Vector(0, 0, 0);
		this.mesh			= new S3Mesh();
	}
	
	setMesh(mesh) {
		this.mesh			= mesh;
	}
	
	getMesh() {
		return this.mesh;
	}
	
	setScale(x, y, z) {
		if(arguments.length === 1) {
			if(typeof x === "number"){
				this.scale = new S3Vector(x, x, x);
			}
			else if(x instanceof S3Vector){
				this.scale = x;
			}
		}
		else {
			this.scale = new S3Vector(x, y, z);
		}
	}
	
	getScale() {
		return this.scale;
	}
	
	setPosition(x, y, z) {
		if((arguments.length === 1) && (x instanceof S3Vector)){
			this.position = x;
		}
		else {
			this.position = new S3Vector(x, y, z);
		}
	}
	
	getPosition() {
		return this.position;
	}
	
	getAngle() {
		return this.angles;
	}
	
	setAngle(angles) {
		this.angles = angles;
	}
	
	addRotateX(x) {
		this.angles = this.angles.addRotateX(x);
	}
	
	addRotateY(y) {
		this.angles = this.angles.addRotateY(y);
	}
	
	addRotateZ(z) {
		this.angles = this.angles.addRotateZ(z);
	}
	
	setRotateX(x) {
		this.angles = this.angles.setRotateX(x);
	}
	
	setRotateY(y) {
		this.angles = this.angles.setRotateY(y);
	}
	
	setRotateZ(z) {
		this.angles = this.angles.addRotateZ(z);
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3Scene {
	
	/**
	 * 描写するときのシーン (mutable)
	 * @returns {S3Scene}
	 */
	constructor() {
		this._init();
	}
	
	_init() {
		this.camera		= new S3Camera();
		this.model		= [];
		this.light		= [];
	}
	
	empty() {
		this.model		= [];
		this.light		= [];
	}
	
	setCamera(camera) {
		this.camera = camera.clone();
	}
	
	addModel(model) {
		this.model[this.model.length] = model;
	}
	
	addLight(light) {
		this.light[this.light.length] = light;
	}
	
	getCamera() {
		return this.camera;
	}
	
	getModels() {
		return this.model;
	}
	
	getLights() {
		return this.light;
	}
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3Texture {
	
	constructor(s3system, data) {
		this.sys	= s3system;
		this._init();
		if(data !== undefined) {
			this.setImage(data);
		}
	}
	
	_init() {
		this.url			= null;
		this.image			= null;
		this.is_loadimage	= false;
		this.is_dispose		= false;
	}
	
	dispose() {
		if(!this.is_dispose) {
			this.is_dispose = true;
		}
	}
	
	setImage(image) {
		if((image === null) || this.is_dispose){
			return;
		}
		if(	(image instanceof HTMLImageElement) ||
			(image instanceof HTMLCanvasElement)) {
			const original_width  = image.width;
			const original_height = image.height;
			const ceil_power_of_2 = function(x) {
				// IE には Math.log2 がない
				const a = Math.log(x) / Math.log(2);
				if ((a - Math.floor(a)) < 1e-10) {
					return x;
				}
				else {
					return 1 << Math.ceil(a);
				}
			};
			const ceil_width  = ceil_power_of_2(original_width);
			const ceil_height = ceil_power_of_2(original_height);
			if((original_width !== ceil_width) || (original_height !== ceil_height)) {
				// 2の累乗ではない場合は、2の累乗のサイズに変換
				const ceil_image = document.createElement("canvas");
				ceil_image.width	= ceil_width;
				ceil_image.height	= ceil_height;
				ceil_image.getContext("2d").drawImage(
					image,
					0, 0, original_width, original_height,
					0, 0, ceil_width, ceil_height
				);
				image = ceil_image;
			} 
		}
		if(	(image instanceof ImageData) ||
			(image instanceof HTMLImageElement) ||
			(image instanceof HTMLCanvasElement) ||
			(image instanceof HTMLVideoElement)) {
			if(this.url === null) {
				// 直接設定した場合はIDをURLとして設定する
				this.url		= this.sys._createID();
			}
			this.image			= image;
			this.is_loadimage	= true;
			return;
		}
		else if((typeof image === "string")||(image instanceof String)) {
			this.url = image;
			const that = this;
			this.sys._download(this.url, function (image){
				that.setImage(image);
			});
			return;
		}
		else {
			console.log("not setImage");
			console.log(image);
		}
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */


/**
 * /////////////////////////////////////////////////////////
 * 描写に使用するシーンを構成するクラス群
 * 
 * ポリゴン情報を構成部品
 * S3Vertex			頂点
 * S3Material		素材
 * S3TriangleIndex	インデックス
 * S3Mesh			頂点とインデックス情報と素材からなるメッシュ
 * 
 * ポリゴンの描写用構成部品
 * S3Model			どの座標にどのように表示するかモデル
 * S3Camera			映像をどのように映すか
 * S3Scene			モデルとカメラを使用してシーン
 * 
 * /////////////////////////////////////////////////////////
 */

class S3System {
	
	/**
	 * S3System
	 * 3DCGを作成するための行列を準備したり、シーンの描写をしたりする
	 * 
	 * 3DCGを作るうえで必要最小限の機能を提供する
	 * ・それらを構成する頂点、材質、面（全てimmutable）
	 * ・モデル (mutable)
	 * ・カメラ (mutable)
	 * ・シーン (mutable)
	 * ・描写用の行列作成
	 * ・描写のための必要最低限の計算
	 */
	constructor() {
		this._init();
	}

	_init() {
		this.setSystemMode(S3System.SYSTEM_MODE.OPEN_GL);
		this.setBackgroundColor(new S3Vector(1.0, 1.0, 1.0, 1.0));
	}

	_createID() {
		if(typeof this._CREATE_ID1 === "undefined") {
			this._CREATE_ID1 = 0;
			this._CREATE_ID2 = 0;
			this._CREATE_ID3 = 0;
			this._CREATE_ID4 = 0;
		}
		const id = ""+
			this._CREATE_ID4.toString(16)+":"+
			this._CREATE_ID3.toString(16)+":"+
			this._CREATE_ID2.toString(16)+":"+
			this._CREATE_ID1.toString(16);
		this._CREATE_ID1++;
		if(this._CREATE_ID1 === 0x100000000) {
			this._CREATE_ID1 = 0;
			this._CREATE_ID2++;
			if(this._CREATE_ID2 === 0x100000000) {
				this._CREATE_ID2 = 0;
				this._CREATE_ID3++;
				if(this._CREATE_ID3 === 0x100000000) {
					this._CREATE_ID3 = 0;
					this._CREATE_ID4++;
					if(this._CREATE_ID4 === 0x100000000) {
						this._CREATE_ID4 = 0;
						throw "createID";
					}
				}
			}
		}
		return id;
	}
	
	_download(url, callback) {
		const dotlist = url.split(".");
		let isImage = false;
		const ext = "";
		if(dotlist.length > 1) {
			const ext = dotlist[dotlist.length - 1].toLocaleString();
			isImage = (ext === "gif") || (ext === "jpg") || (ext === "png") || (ext === "bmp") || (ext === "svg") || (ext === "jpeg");
		}
		if(isImage) {
			const image = new Image();
			image.onload = function() {
				callback(image, ext);
			};
			image.src = url;
			return;
		}
		const http = new XMLHttpRequest();
		const handleHttpResponse = function (){
			if(http.readyState === 4) { // DONE
				if(http.status !== 200) {
					console.log("error download [" + url + "]");
					return(null);
				}
				callback(http.responseText, ext);
			}
		};
		http.onreadystatechange = handleHttpResponse;
		http.open("GET", url, true);
		http.send(null);
	}
	
	_toVector3(x) {
		if(x instanceof S3Vector) {
			return x;
		}
		else if(!isNaN(x)) {
			return new S3Vector(x, x, x);
		}
		else if(x instanceof Array) {
			return new S3Vector(x[0], x[1], x[2]);
		}
		else {
			throw "IllegalArgumentException";
		}
	}
	
	_toValue(x) {
		if(!isNaN(x)) {
			return x;
		}
		else {
			throw "IllegalArgumentException";
		}
	}
	
	setBackgroundColor(color) {
		this.backgroundColor = color;
	}
	
	getBackgroundColor() {
		return this.backgroundColor;
	}
	
	setSystemMode(mode) {
		this.systemmode = mode;
		if(this.systemmode === S3System.SYSTEM_MODE.OPEN_GL) {
			this.depthmode		= S3System.DEPTH_MODE.OPEN_GL;
			this.dimensionmode	= S3System.DIMENSION_MODE.RIGHT_HAND;
			this.vectormode		= S3System.VECTOR_MODE.VECTOR4x1;
			this.frontface		= S3System.FRONT_FACE.COUNTER_CLOCKWISE;
			this.cullmode		= S3System.CULL_MODE.BACK;
		}
		else {
			this.depthmode		= S3System.DEPTH_MODE.DIRECT_X;
			this.dimensionmode	= S3System.DIMENSION_MODE.LEFT_HAND;
			this.vectormode		= S3System.VECTOR_MODE.VECTOR1x4;
			this.frontface		= S3System.FRONT_FACE.CLOCKWISE;
			this.cullmode		= S3System.CULL_MODE.BACK;
		}
	}
	
	/**
	 * ビューポート行列を作成する際に、Z値の範囲の範囲をどうするか
	 * @param {S3System.DEPTH_MODE} depthmode
	 * @returns {undefined}
	 */
	setDepthMode(depthmode) {
		this.depthmode = depthmode;
	}
	
	/**
	 * 座標軸について左手系か、右手系か
	 * @param {S3System.DIMENSION_MODE} dimensionmode
	 * @returns {undefined}
	 */
	setDimensionMode(dimensionmode) {
		this.dimensionmode = dimensionmode;
	}
	
	/**
	 * N次元の座標について、横ベクトルか、縦ベクトル、どちらで管理するか
	 * @param {S3System.VECTOR_MODE} vectormode
	 * @returns {undefined}
	 */
	setVectorMode(vectormode) {
		this.vectormode = vectormode;
	}
	
	/**
	 * どのようなポリゴンの頂点の順序を表として定義するか
	 * @param {S3System.FRONT_FACE} frontface
	 * @returns {undefined}
	 */
	setFrontMode(frontface) {
		this.frontface = frontface;
	}
	
	/**
	 * どの方向を描写しないかを設定する。
	 * @param {S3System.CULL_MODE} cullmode
	 * @returns {undefined}
	 */
	setCullMode(cullmode) {
		this.cullmode = cullmode;
	}
	
	setCanvas(canvas) {
		const that		= this;
		const ctx			= canvas.getContext("2d");
		this.canvas		= canvas;
		this.context2d = {
			context : ctx,
			drawLine : function(v0, v1) {
				ctx.beginPath();
				ctx.moveTo( v0.x, v0.y );
				ctx.lineTo( v1.x, v1.y );
				ctx.stroke();
			},
			drawLinePolygon : function(v0, v1, v2) {
				ctx.beginPath();
				ctx.moveTo( v0.x, v0.y );
				ctx.lineTo( v1.x, v1.y );
				ctx.lineTo( v2.x, v2.y );
				ctx.closePath();
				ctx.stroke();
			},
			setLineWidth : function(width) {
				ctx.lineWidth = width;
			},
			setLineColor : function(color) {
				ctx.strokeStyle = color;
			},
			clear : function() {
				const color = that.getBackgroundColor();
				ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);
				ctx.fillStyle = "rgba(" + color.x * 255 + "," + color.y * 255 + "," + color.z * 255 + "," + color.w + ")";
				ctx.fillRect(0, 0, that.canvas.width, that.canvas.height);
			}
		};
	}
	
	/**
	 * カリングのテストをする
	 * @param {S3Vector} p1
	 * @param {S3Vector} p2
	 * @param {S3Vector} p3
	 * @returns {Boolean} true で描写しない
	 */
	testCull(p1, p2, p3) {
		if(this.cullmode === S3System.CULL_MODE.NONE) {
			return false;
		}
		if(this.cullmode === S3System.CULL_MODE.FRONT_AND_BACK) {
			return true;
		}
		const isclock = S3Vector.isClockwise(p1, p2, p3);
		if(isclock === null) {
			return true;
		}
		else if(!isclock) {
			if(this.frontface === S3System.FRONT_FACE.CLOCKWISE) {
				return this.cullmode !== S3System.CULL_MODE.BACK;
			}
			else {
				return this.cullmode !== S3System.CULL_MODE.FRONT;
			}
		}
		else {
			if(this.frontface === S3System.FRONT_FACE.CLOCKWISE) {
				return this.cullmode === S3System.CULL_MODE.BACK;
			}
			else {
				return this.cullmode === S3System.CULL_MODE.FRONT;
			}
		}
	}
	
	/**
	 * ビューポート行列を作成する
	 * @param {Number} x 描写する左上の座標X
	 * @param {Number} y 描写する左上の座標Y
	 * @param {Number} Width 描写幅
	 * @param {Number} Height 描写幅
	 * @param {Number} MinZ 深度値の変換
	 * @param {Number} MaxZ 深度値の変換
	 * @returns {S3Matrix}
	 */
	getMatrixViewport(x, y, Width, Height, MinZ, MaxZ) {
		if(MinZ === undefined) {
			MinZ = 0.0;
		}
		if(MaxZ === undefined) {
			MaxZ = 1.0;
		}
		// M.m11 は、DirectXだとマイナス、OpenGLだとプラスである
		// 今回は、下がプラスであるcanvasに表示させることを考えて、マイナスにしてある。
		const M = new S3Matrix();
		M.m00 =  Width/2; M.m01 =       0.0; M.m02 = 0.0; M.m03 = 0.0;
		M.m10 =      0.0; M.m11 = -Height/2; M.m12 = 0.0; M.m13 = 0.0;
		M.m20 =      0.0; M.m21 =       0.0; M.m22 = 1.0; M.m23 = 1.0;
		M.m30 =x+Width/2; M.m31 =y+Height/2; M.m32 = 0.0; M.m33 = 1.0;
		
		if(this.depthmode === S3System.DEPTH_MODE.DIRECT_X) {
			M.m22 = MinZ - MaxZ;
			M.m32 = MinZ;
		}
		else if(this.depthmode === S3System.DEPTH_MODE.OPEN_GL) {
			M.m22 = (MinZ - MaxZ) / 2;
			M.m32 = (MinZ + MaxZ) / 2;
		}
		return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
	}
	
	/**
	 * 視体積の上下方向の視野角を求める
	 * @param {Number} zoomY
	 * @returns {Number}
	 */
	static calcFovY(zoomY) {
		return(2.0 * Math.atan(1.0 / zoomY));
	}
	
	/**
	 * アスペクト比を求める
	 * @param {Number} width
	 * @param {Number} height
	 * @returns {Number}
	 */
	static calcAspect(width, height) {
		return(width / height);
	}
	
	/**
	 * パースペクティブ射影行列を作成する
	 * @param {Number} fovY 視体積の上下方向の視野角（0度から180度）
	 * @param {Number} Aspect 近平面、遠平面のアスペクト比（Width / Height）
	 * @param {Number} Near カメラから近平面までの距離（ニアークリッピング平面）
	 * @param {Number} Far カメラから遠平面までの距離（ファークリッピング平面）
	 * @returns {S3Matrix}
	 */
	getMatrixPerspectiveFov(fovY, Aspect, Near, Far) {
		const arc = S3Math.radius(fovY);
		const zoomY = 1.0 / Math.tan(arc / 2.0);
		const zoomX = zoomY / Aspect;
		const M = new S3Matrix();
		M.m00 =zoomX; M.m01 =  0.0; M.m02 = 0.0; M.m03 = 0.0;
		M.m10 =  0.0; M.m11 =zoomY; M.m12 = 0.0; M.m13 = 0.0;
		M.m20 =  0.0; M.m21 =  0.0; M.m22 = 1.0; M.m23 = 1.0;
		M.m30 =  0.0; M.m31 =  0.0; M.m32 = 0.0; M.m33 = 0.0;
		const Delta = Far - Near;
		if(Near > Far) {
			throw "Near > Far error";
		}
		else if(Delta === 0.0) {
			throw "divide error";
		}
		if(this.depthmode === S3System.DEPTH_MODE.DIRECT_X) {
			M.m22 = Far / Delta;
			M.m32 = - Far * Near / Delta;
		}
		else if(this.depthmode === S3System.DEPTH_MODE.OPEN_GL) {
			M.m22 = (Far + Near) / Delta;
			M.m32 = - 2.0 * Far * Near / Delta;
		}
		if(this.dimensionmode === S3System.DIMENSION_MODE.RIGHT_HAND) {
			M.m22 = - M.m22;
			M.m23 = - M.m23;
		}
		return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
	}
	
	/**
	 * ビュートランスフォーム行列を作成する
	 * @param {S3Vector} eye カメラの座標の位置ベクトル
	 * @param {S3Vector} at カメラの注視点の位置ベクトル
	 * @param {S3Vector} up カメラの上への方向ベクトル
	 * @returns {S3Matrix}
	 */
	getMatrixLookAt(eye, at, up) {
		if(up === undefined) {
			up = new S3Vector(0.0, 1.0, 0.0);
		}
		// Z ベクトルの作成
		let Z = eye.getDirectionNormalized(at);
		if(this.dimensionmode === S3System.DIMENSION_MODE.RIGHT_HAND) {
			// 右手系なら反転
			Z = Z.negate();
		}
		// X, Y ベクトルの作成
		const X = up.cross(Z).normalize();
		const Y = Z.cross(X);
		const M = new S3Matrix();
		M.m00 = X.x; M.m01 = Y.x; M.m02 = Z.x; M.m03 = 0.0;
		M.m10 = X.y; M.m11 = Y.y; M.m12 = Z.y; M.m13 = 0.0;
		M.m20 = X.z; M.m21 = Y.z; M.m22 = Z.z; M.m23 = 0.0;
		M.m30 = -X.dot(eye); M.m31 = -Y.dot(eye); M.m32 = -Z.dot(eye); M.m33 = 1.0;
		return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
	}
	
	/**
	 * 単位行列を作成します。
	 * @returns {S3Matrix}
	 */
	getMatrixIdentity() {
		const M = new S3Matrix();
		M.m00 = 1.0; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
		M.m10 = 0.0; M.m11 = 1.0; M.m12 = 0.0; M.m13 = 0.0;
		M.m20 = 0.0; M.m21 = 0.0; M.m22 = 1.0; M.m23 = 0.0;
		M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
		return M;
	}
	
	/**
	 * 平行移動行列を作成します。
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} z
	 * @returns {S3Matrix}
	 */
	getMatrixTranslate(x, y, z) {
		const M = new S3Matrix();
		M.m00 = 1.0; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
		M.m10 = 0.0; M.m11 = 1.0; M.m12 = 0.0; M.m13 = 0.0;
		M.m20 = 0.0; M.m21 = 0.0; M.m22 = 1.0; M.m23 = 0.0;
		M.m30 =   x; M.m31 =   y; M.m32 =   z; M.m33 = 1.0;
		return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
	}
	
	/**
	 * 拡大縮小行列を作成します。
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} z
	 * @returns {S3Matrix}
	 */
	getMatrixScale(x, y, z) {
		const M = new S3Matrix();
		M.m00 =   x; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
		M.m10 = 0.0; M.m11 =   y; M.m12 = 0.0; M.m13 = 0.0;
		M.m20 = 0.0; M.m21 = 0.0; M.m22 =   z; M.m23 = 0.0;
		M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
		return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
	}
	
	/**
	 * X軸周りの回転行列を作成します。
	 * @param {Number} degree 角度を度数法で指定
	 * @returns {S3Matrix}
	 */
	getMatrixRotateX(degree) {
		const arc = S3Math.radius(degree);
		const cos = Math.cos(arc);
		const sin = Math.sin(arc);
		const M = new S3Matrix();
		M.m00 = 1.0; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
		M.m10 = 0.0; M.m11 = cos; M.m12 = sin; M.m13 = 0.0;
		M.m20 = 0.0; M.m21 =-sin; M.m22 = cos; M.m23 = 0.0;
		M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
		return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
	}
	
	/**
	 * Y軸周りの回転行列を作成します。
	 * @param {Number} degree 角度を度数法で指定
	 * @returns {S3Matrix}
	 */
	getMatrixRotateY(degree) {
		const arc = S3Math.radius(degree);
		const cos = Math.cos(arc);
		const sin = Math.sin(arc);
		const M = new S3Matrix();
		M.m00 = cos; M.m01 = 0.0; M.m02 =-sin; M.m03 = 0.0;
		M.m10 = 0.0; M.m11 = 1.0; M.m12 = 0.0; M.m13 = 0.0;
		M.m20 = sin; M.m21 = 0.0; M.m22 = cos; M.m23 = 0.0;
		M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
		return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
	}

	/**
	 * Z軸周りの回転行列を作成します。
	 * @param {Number} degree 角度を度数法で指定
	 * @returns {S3Matrix}
	 */
	getMatrixRotateZ(degree) {
		const arc = S3Math.radius(degree);
		const cos = Math.cos(arc);
		const sin = Math.sin(arc);
		const M = new S3Matrix();
		M.m00 = cos; M.m01 = sin; M.m02 = 0.0; M.m03 = 0.0;
		M.m10 =-sin; M.m11 = cos; M.m12 = 0.0; M.m13 = 0.0;
		M.m20 = 0.0; M.m21 = 0.0; M.m22 = 1.0; M.m23 = 0.0;
		M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
		return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
	}

	/**
	 * 縦型、横型を踏まえて掛け算します。
	 * @param {S3Matrix} A
	 * @param {S3Matrix|S3Vector} B
	 * @returns {S3Matrix|S3Vector}
	 */
	mulMatrix(A, B) {
		if(B instanceof S3Matrix) {
			// 横型の場合は、v[AB]=u
			// 縦型の場合は、[BA]v=u
			return (this.vectormode === S3System.VECTOR_MODE.VECTOR4x1) ? B.mul(A) : A.mul(B);
		}
		else if(B instanceof S3Vector) {
			// 横型の場合は、[vA]=u
			// 縦型の場合は、[Av]=u
			return (this.vectormode === S3System.VECTOR_MODE.VECTOR4x1) ? A.mul(B) : B.mul(A);
		}
		else {
			throw "IllegalArgumentException";
		}
	}

	/**
	 * 航空機の姿勢制御（ロール・ピッチ・ヨー）の順序で回転
	 * @param {Number} z
	 * @param {Number} x
	 * @param {Number} y
	 * @returns {S3Matrix}
	 */
	getMatrixRotateZXY(z, x, y) {
		const Z = this.getMatrixRotateZ(z);
		const X = this.getMatrixRotateX(x);
		const Y = this.getMatrixRotateY(y);
		return this.mulMatrix(this.mulMatrix(Z, X), Y);
	}

	getMatrixWorldTransform(model) {
		// 回転行列
		const R = this.getMatrixRotateZXY(model.angles.roll, model.angles.pitch, model.angles.yaw);
		// スケーリング
		const S = this.getMatrixScale(model.scale.x, model.scale.y, model.scale.z);
		// 移動行列
		const T = this.getMatrixTranslate(model.position.x, model.position.y, model.position.z);
		// ワールド変換行列を作成する
		const W = this.mulMatrix(this.mulMatrix(S, R), T);
		return W;
	}

	clear() {
		this.context2d.clear();
	}

	_calcVertexTransformation(vertexlist, MVP, Viewport) {
		const newvertexlist = [];
		
		for(let i = 0; i < vertexlist.length; i++) {
			let p = vertexlist[i].position;
			
			//	console.log("1 " + p);
			//	console.log("2 " + this.mulMatrix(VPS.LookAt, p));
			//	console.log("3 " + this.mulMatrix(VPS.PerspectiveFov, this.mulMatrix(VPS.LookAt, p)));
			//	console.log("4 " + this.mulMatrix(MVP, p));
			
			p = this.mulMatrix(MVP, p);
			const rhw = p.w;
			p = p.mul(1.0 / rhw);
			p = this.mulMatrix(Viewport, p);
			newvertexlist[i] = new S3Vertex(p);
		}
		return newvertexlist;
	}

	drawAxis(scene) {
		const VPS = scene.getCamera().getVPSMatrix(this.canvas);
		
		const vertexvector = [];
		vertexvector[0] = new S3Vector(0, 0, 0);
		vertexvector[1] = new S3Vector(10, 0, 0);
		vertexvector[2] = new S3Vector(0, 10, 0);
		vertexvector[3] = new S3Vector(0, 0, 10);
		
		const newvector = [];
		const M = this.mulMatrix(VPS.LookAt, VPS.PerspectiveFov);
		for(let i = 0; i < vertexvector.length; i++) {
			let p = vertexvector[i];
			p = this.mulMatrix(M, p);
			p = p.mul(1.0 / p.w);
			p = this.mulMatrix(VPS.Viewport, p);
			newvector[i] = p;
		}
		
		this.context2d.setLineWidth(3.0);
		this.context2d.setLineColor("rgb(255, 0, 0)");
		this.context2d.drawLine(newvector[0], newvector[1]);
		this.context2d.setLineColor("rgb(0, 255, 0)");
		this.context2d.drawLine(newvector[0], newvector[2]);
		this.context2d.setLineColor("rgb(0, 0, 255)");
		this.context2d.drawLine(newvector[0], newvector[3]);
	}

	_drawPolygon(vetexlist, triangleindexlist) {
		for(let i = 0; i < triangleindexlist.length; i++) {
			const ti = triangleindexlist[i];
			if(this.testCull(
				vetexlist[ti.index[0]].position,
				vetexlist[ti.index[1]].position,
				vetexlist[ti.index[2]].position )) {
				continue;
			}
			this.context2d.drawLinePolygon(
				vetexlist[ti.index[0]].position,
				vetexlist[ti.index[1]].position,
				vetexlist[ti.index[2]].position
			);
		}
	}

	drawScene(scene) {
		const VPS = scene.getCamera().getVPSMatrix(this.canvas);
		
		this.context2d.setLineWidth(1.0);
		this.context2d.setLineColor("rgb(0, 0, 0)");
		
		const models = scene.getModels();
		for(let i = 0; i < models.length; i++) {
			const model	= models[i];
			const mesh	= model.getMesh();
			if(mesh.isComplete() === false) {
				continue;
			}
			const M = this.getMatrixWorldTransform(model);
			const MVP = this.mulMatrix(this.mulMatrix(M, VPS.LookAt), VPS.PerspectiveFov);
			const vlist = this._calcVertexTransformation(mesh.src.vertex, MVP, VPS.Viewport);
			this._drawPolygon(vlist, mesh.src.triangleindex);
		}
	}

	_disposeObject() {
	}
	
	createVertex(position) {
		return new S3Vertex(position);
	}
	
	createTriangleIndex(i1, i2, i3, indexlist, materialIndex, uvlist) {
		return new S3TriangleIndex(i1, i2, i3, indexlist, materialIndex, uvlist);
	}
	
	createTexture(name) {
		return new S3Texture(this, name);
	}
	
	createScene() {
		return new S3Scene();
	}
	
	createModel() {
		return new S3Model();
	}
	
	createMesh() {
		return new S3Mesh(this);
	}
	
	createMaterial(name) {
		return new S3Material(this, name);
	}
	
	createLight() {
		return new S3Light();
	}
	
	createCamera() {
		const camera = new S3Camera(this);
		return camera;
	}

}

S3System.SYSTEM_MODE = {
	OPEN_GL		: 0,
	DIRECT_X	: 1
};

S3System.DEPTH_MODE = {
	/**
	 * Z値の範囲などの依存関係をOpenGL準拠
	 * @type Number
	 */
	OPEN_GL		: 0,
	/**
	 * Z値の範囲などの依存関係をDirecX準拠
	 * @type Number
	 */
	DIRECT_X	: 1
};

S3System.DIMENSION_MODE = {
	/**
	 * 右手系
	 * @type Number
	 */
	RIGHT_HAND	: 0,
	/**
	 * 左手系
	 * @type Number
	 */
	LEFT_HAND	: 1
};

S3System.VECTOR_MODE = {
	/**
	 * 値を保持するベクトルを縦ベクトルとみなす
	 * @type Number
	 */
	VECTOR4x1	: 0,
	/**
	 * 値を保持するベクトルを横ベクトルとみなす
	 * @type Number
	 */
	VECTOR1x4	: 1
};

S3System.FRONT_FACE = {
	/**
	 * 反時計回りを前面とする
	 * @type Number
	 */
	COUNTER_CLOCKWISE : 0,
	
	/**
	 * 時計回りを前面とする
	 * @type Number
	 */
	CLOCKWISE : 1
};

S3System.CULL_MODE = {
	
	/**
	 * 常にすべての三角形を描画します。
	 * @type Number
	 */
	NONE : 0,
	
	/**
	 * 前向きの三角形を描写しません。
	 * @type Number
	 */
	FRONT : 1,
	
	/**
	 * 後ろ向きの三角形を描写しません。
	 * @type Number
	 */
	BACK : 2,
	
	/**
	 * 常に描写しない。
	 * @type Number
	 */
	FRONT_AND_BACK : 3
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLShader {
	
	/**
	 * WebGLのシェーダー情報
	 * 頂点シェーダー／フラグメントシェーダ―用クラス
	 * ソースコード、コンパイル済みデータ、シェーダータイプを格納できる
	 * S3GLProgram 内部で利用するもので、一般的にこれ単体では使用しない
	 * @param {S3GLSystem} sys
	 * @param {String} code
	 * @returns {S3GLShader}
	 */
	constructor(sys, code) {
		this._init(sys, code);
	}
	
	_init(sys, code) {
		this.sys			= sys;
		this.code			= null;
		this.shader			= null;
		this.sharder_type	= -1;
		this.is_error		= false;
		const that = this;
		const downloadCallback = function(code) {
			that.code = code;
		};
		if(code.indexOf("\n") === -1) {
			// 1行の場合はURLとみなす（雑）
			this.sys._download(code, downloadCallback);
		}
		else {
			this.code = code;
		}
	}
	
	isError() {
		return this.is_error;
	}
	
	getCode() {
		return this.code;
	}
	
	getShader() {
		const gl = this.sys.getGL();
		if((gl === null) || this.is_error || (this.code === null)) {
			// まだ準備ができていないのでエラーを発生させない
			return null;
		}
		if(this.shader !== null) {
			// すでにコンパイル済みであれば返す
			return this.shader;
		}
		let code = this.code;
		// コメントを除去する
		code = code.replace(/\/\/.*/g,"");
		code = code.replace(/\/\*([^*]|\*[^/])*\*\//g,"");
		// コード内を判定して種別を自動判断する（雑）
		let sharder_type = 0;
		if(code.indexOf("gl_FragColor") !== -1) {
		// フラグメントシェーダである
			sharder_type = gl.FRAGMENT_SHADER;
		}
		else {
			// バーテックスシェーダである
			sharder_type = gl.VERTEX_SHADER;
		}
		const data = this.sys.glfunc.createShader(sharder_type, code);
		if(data.is_error) {
			this.is_error = true;
			return null;
		}
		this.shader			= data.shader;
		this.sharder_type	= sharder_type;
		return this.shader;
		
	}
	
	getShaderType() {
		if(this.sharder_type !== -1) {
			return this.sharder_type;
		}
		if(this.getShader() !== null) {
			return this.sharder_type;
		}
		return null;
	}
	
	dispose() {
		const gl = this.sys.getGL();
		if(gl === null) {
			return null;
		}
		if(this.shader === null) {
			return true;
		}
		this.sys.glfunc.deleteShader(this.shader);
		this.shader	= null;
		this.sharder_type = -1;
		return true;
	}
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLArray {
	
	/**
	 * WebGL用の配列 (immutable)
	 * @param {Object} data 数値／配列／S3Vector/S3Matrix
	 * @param {Number} dimension 例えば3次元のベクトルなら、3
	 * @param {S3GLArray.datatype} datatype
	 * @returns {S3GLArray}
	 */
	constructor(data, dimension, datatype) {
		// 引数の情報(S3GLArray.datatype.instance)を用いて、
		// JS用配列を、WEBGL用配列に変換して保存する
		if(data instanceof datatype.instance) {
			this.data	= data;
		}
		else if((data instanceof S3Vector) || (data instanceof S3Matrix)) {
			this.data	= data.toInstanceArray(datatype.instance, dimension);
		}
		else if(data instanceof Array) {
			this.data	= new datatype.instance(data);
		}
		else if(!isNaN(data)) {
			this.data	= new datatype.instance([data]);
		}
		else {
			throw "IllegalArgumentException";
		}
		this.dimension	= dimension;
		this.datatype	= datatype;
		
		let instance = "";
		if(data instanceof S3Vector) {
			instance = "S3Vector";
		}
		else if(data instanceof S3Matrix) {
			instance = "S3Matrix";
		}
		else {
			instance = "Number";
		}
		this.glsltype = S3GLArray.gltypetable[datatype.name][instance][dimension];
	}
	
}

// Int32Array を一応定義してあるが、整数型は補間できないため、Attributeには使用できない。
S3GLArray.datatype = {
	"Float32Array"	: {
		instance	: Float32Array,
		name	: "Float32Array"
	},
	"Int32Array"	: {
		instance	: Int32Array,
		name	: "Int32Array"
	}
};

S3GLArray.gltypetable = {
	"Float32Array"	: {
		"Number"	:	{
			1	:	"float",
			2	:	"vec2",
			3	:	"vec3",
			4	:	"vec4"
		},
		"S3Vector"	:	{
			2	:	"vec2",
			3	:	"vec3",
			4	:	"vec4"
		},
		"S3Matrix"	:	{
			4	:	"mat2",
			9	:	"mat3",
			16	:	"mat4"
		}
	},
	"Int32Array"	: {
		"Number"	:	{
			1	:	"int",
			2	:	"ivec2",
			3	:	"ivec3",
			4	:	"ivec4"
		},
		"S3Vector"	:	{
			2	:	"ivec2",
			3	:	"ivec3",
			4	:	"ivec4"
		}
	}
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLProgram {
	
	/**
	 * WebGLのプログラム情報
	 * 頂点シェーダー、フラグメントシェーダーの2つを組み合わせたプログラム用のクラス
	 * 2種類のシェーダーと、リンクしたプログラムを格納できる
	 * またプログラムをセットしたり、セットした後は変数とのバインドができる。
	 * @param {S3GLSystem} sys
	 * @param {Integer} id
	 * @returns {S3GLProgram}
	 */
	constructor(sys, id) {
		this._init(sys, id);
	}

	_init(sys, id) {
		this.id				= id;
		this.sys			= sys;
		this.vertex			= null;
		this.fragment		= null;
		this.isDLVertex		= false;
		this.isDLFragment	= false;
		this.program		= null;
		this.is_linked		= false;
		this.is_error		= false;
		this.enable_vertex_number = {};
		
		const variable = {};
		variable.attribute	= {};
		variable.uniform	= {};
		variable.modifiers	= [];
		variable.datatype	= [];
		this.variable = variable;
		
		const _this = this;
		this.activeTextureId = 0;
		
		const g = {
			uniform1iv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform1iv(location, value); }},
			uniform2iv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform2iv(location, value); }},
			uniform3iv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform3iv(location, value); }},
			uniform4iv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform4iv(location, value); }},
			uniform1fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform1fv(location, value); }},
			uniform2fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform2fv(location, value); }},
			uniform3fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform3fv(location, value); }},
			uniform4fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform4fv(location, value); }},
			uniformMatrix2fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniformMatrix2fv(location, false, value); }},
			uniformMatrix3fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniformMatrix3fv(location, false, value); }},
			uniformMatrix4fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniformMatrix4fv(location, false, value); }},
			uniformSampler2D: function(location, value) {
				const gl = sys.getGL();
				if(gl){
					gl.activeTexture(gl.TEXTURE0 + _this.activeTextureId);
					gl.bindTexture(gl.TEXTURE_2D, value);
					gl.uniform1i(location, _this.activeTextureId);
					_this.activeTextureId++;
				}
			}
		};
		
		const info = {
			int		: {glsltype : "int",	instance : Int32Array,		size : 1, btype : "INT",	bind : g.uniform1iv},
			float	: {glsltype : "float",	instance : Float32Array,	size : 1, btype : "FLOAT",	bind : g.uniform1fv},
			bool	: {glsltype : "bool",	instance : Int32Array,		size : 1, btype : "INT",	bind : g.uniform1iv},
			mat2	: {glsltype : "mat2",	instance : Float32Array,	size : 4, btype : "FLOAT",	bind : g.uniformMatrix2fv},
			mat3	: {glsltype : "mat3",	instance : Float32Array,	size : 9, btype : "FLOAT",	bind : g.uniformMatrix3fv},
			mat4	: {glsltype : "mat4",	instance : Float32Array,	size : 16,btype : "FLOAT",	bind : g.uniformMatrix4fv},
			vec2	: {glsltype : "vec2",	instance : Float32Array,	size : 2, btype : "FLOAT",	bind : g.uniform2fv},
			vec3	: {glsltype : "vec3",	instance : Float32Array,	size : 3, btype : "FLOAT",	bind : g.uniform3fv},
			vec4	: {glsltype : "vec4",	instance : Float32Array,	size : 4, btype : "FLOAT",	bind : g.uniform4fv},
			ivec2	: {glsltype : "ivec2",	instance : Int32Array,		size : 2, btype : "INT",	bind : g.uniform2iv},
			ivec3	: {glsltype : "ivec3",	instance : Int32Array,		size : 3, btype : "INT",	bind : g.uniform3iv},
			ivec4	: {glsltype : "ivec4",	instance : Int32Array,		size : 4, btype : "INT",	bind : g.uniform4iv},
			bvec2	: {glsltype : "bvec2",	instance : Int32Array,		size : 2, btype : "INT",	bind : g.uniform2iv},
			bvec3	: {glsltype : "bvec3",	instance : Int32Array,		size : 3, btype : "INT",	bind : g.uniform3iv},
			bvec4	: {glsltype : "bvec4",	instance : Int32Array,		size : 4, btype : "INT",	bind : g.uniform4iv},
			sampler2D		: {glsltype : "sampler2D",	instance : Image, size : 1, btype : "TEXTURE",	bind : g.uniformSampler2D},
			samplerCube	: {glsltype : "samplerCube",instance : Image, size : 1, btype : "TEXTURE",	bind : null}
		};
		
		this.analysisShader = function(code, variable) {
			// コメントを除去する
			code = code.replace(/\/\/.*/g,"");
			code = code.replace(/\/\*([^*]|\*[^/])*\*\//g,"");
			// 1行ずつ解析
			const codelines = code.split("\n");
			for(let i = 0; i < codelines.length; i++) {
				// uniform vec4 lights[4]; とすると、 uniform,vec4,lights,[4]で区切られる
				const data = codelines[i].match( /(attribute|uniform)\s+(\w+)\s+(\w+)\s*(\[\s*\w+\s*\])?;/);
				if(data === null) {
					continue;
				}
				// 見つけたら変数名や、型を記録しておく
				// 配列数の調査は、定数などを使用されると簡単に調べられないため取得できない
				// そのため自動でテストできないため、bindする際に、正しい配列数の配列をbindすること
				const text_space			= data[1];
				const text_type			= data[2];
				const text_variable		= data[3];
				const text_array			= data[4];
				const is_array			= text_array !== undefined;
				// 型に応じたテンプレートを取得する
				// data[1] ... uniform, data[2] ... mat4, data[3] ... M
				const targetinfo = info[text_type];
				variable[text_variable]			= {};
				// 参照元データを書き換えないようにディープコピーする
				for(const key in targetinfo) {
					variable[text_variable][key]	= targetinfo[key];	// glsl, js, size, bind
				}
				// さらに情報を保存しておく
				variable[text_variable].name		= text_variable;		// M
				variable[text_variable].modifiers	= text_space;			// uniform
				variable[text_variable].is_array	= is_array;
				variable[text_variable].location	= [];
				
			}
			return;
		};
	}
	
	resetActiveTextureId() {
		this.activeTextureId = 0;
	}
	
	isLinked() {
		return this.is_linked;
	}
	
	dispose() {
		const gl = this.sys.getGL();
		if(gl === null) {
			return false;
		}
		if(this.is_linked) {
			this.disuseProgram();
			this.sys.glfunc.deleteProgram(this.program,
				this.vertex.getShader(), this.fragment.getShader()
			);
			this.program		= null;
			this.is_linked		= false;
		}
		if(this.vertex !== null) {
			this.vertex.dispose();
			this.vertex = null;
		}
		if(this.fragment !== null) {
			this.fragment.dispose();
			this.fragment = null;
		}
		this._init(this.sys, this.id);
		return true;
	}
	
	setVertexShader(shader_code) {
		if(this.isLinked()) {
			return false;
		}
		if(this.vertex !== null) {
			this.vertex.dispose();
			this.vertex = null;
		}
		this.vertex = new S3GLShader(this.sys, shader_code);
		this.is_error = false;
		return true;
	}
	
	setFragmentShader(shader_code) {
		if(this.isLinked()) {
			return false;
		}
		if(this.fragment !== null) {
			this.fragment.dispose();
			this.fragment = null;
		}
		this.fragment = new S3GLShader(this.sys, shader_code);
		this.is_error = false;
		return true;
	}

	useProgram() {
		if(!this.isLinked()) {
			return false;
		}
		const program = this.getProgram();
		if(program && this.sys.getGL()) {
			this.sys.getGL().useProgram(program);
		}
		return true;
	}
	
	disuseProgram() {
		if(!this.isLinked()) {
			return false;
		}
		const gl = this.sys.getGL();
		if(gl) {
			// enable化したデータを解放する
			for(const key in this.enable_vertex_number) {
				gl.disableVertexAttribArray(key);
			}
			this.enable_vertex_number = {};
		}
		return true;
	}
	
	getProgram() {
		const gl = this.sys.getGL();
		// 1度でもエラーが発生したか、glキャンバスの設定をしていない場合
		if((gl === null) || this.is_error) {
			return null;
		}
		// ダウンロード中なら無視する
		if(this.isDLVertex || this.isDLFragment) {
			return null;
		}
		// すでにリンク済みのがあれば返す
		if(this.isLinked()) {
			return this.program;
		}
		// シェーダーを取得する
		if(this.vertex === null) {
			console.log("do not set VERTEX_SHADER");
			this.is_error = true;
			return null;
		}
		if(this.fragment === null) {
			console.log("do not set FRAGMENT_SHADER");
			this.is_error = true;
			return null;
		}
		const is_error_vertex		= this.vertex.isError();
		const is_error_fragment	= this.fragment.isError();
		if(is_error_vertex || is_error_fragment) {
			console.log("shader compile error");
			this.is_error = true;
			return null;
		}
		const shader_vertex	= this.vertex.getShader();
		const shader_fragment	= this.fragment.getShader();
		if((shader_vertex === null) || (shader_fragment === null)) {
			// まだロードが終わってない可能性あり
			return null;
		}
		if(this.vertex.getShaderType() !== gl.VERTEX_SHADER) {
			console.log("VERTEX_SHADER is not VERTEX_SHADER");
			this.is_error = true;
			return null;
		}
		if(this.fragment.getShaderType() !== gl.FRAGMENT_SHADER) {
			console.log("FRAGMENT_SHADER is not FRAGMENT_SHADER");
			this.is_error = true;
			return null;
		}
		// 取得したシェーダーを用いてプログラムをリンクする
		const data = this.sys.glfunc.createProgram(shader_vertex, shader_fragment);
		if(data.is_error) {
			this.is_error = true;
			return null;
		}
		// リンクが成功したらプログラムの解析しておく
		this.is_linked = true;
		this.program = data.program;
		this.analysisShader(this.vertex.getCode(), this.variable);
		this.analysisShader(this.fragment.getCode(), this.variable);
		return this.program;
	}

	/**
	 * プログラムにデータを結びつける
	 * @param {String} name
	 * @param {Object} data
	 * @returns {undefined}
	 */
	bindData(name, data) {
		if(!this.isLinked()) {
			return false;
		}
		const gl	= this.sys.getGL();
		const prg	= this.getProgram();
		const variable	= this.variable[name];
		
		// ---- check Location ----
		if(variable === undefined) {
			// シェーダーでは利用していないものをbindしようとした。
			return false;
		}
		// 長さが0なら位置が未調査なので調査する
		if(variable.location.length === 0) {
			if(variable.modifiers === "attribute") {
				variable.location[0] = gl.getAttribLocation(prg, name);
			}
			else {
				if(!variable.is_array) {
					variable.location[0] = gl.getUniformLocation(prg, name);
				}
				else {
					// 配列の場合は、配列の数だけlocationを調査する
					// 予め、シェーダー内の配列数と一致させておくこと
					for(let i = 0; i < data.length; i++) {
						variable.location[i] = gl.getUniformLocation(prg, name + "[" + i + "]");
					}
				}
			}
		}
		if(variable.location[0] === -1) {
			// 変数は宣言されているが、関数の中で使用していないと -1 がかえる
			return false;
		}
		// data が bind できる形になっているか調査する
		
		// ---- check Type ----
		// glslの型をチェックして自動型変換する
		const toArraydata = function(data) {
			if(data instanceof WebGLBuffer) {
				// VBO型は、無視する
				if(variable.modifiers === "attribute"){
					return data;
				}
			}
			if(data instanceof WebGLTexture) {
				// テクスチャ型なら無視する
				if(variable.glsltype === "sampler2D") {
					return data;
				}
			}
			if(data instanceof variable.instance) {
				// 型と同じインスタンスであるため問題なし
				return data;
			}
			// GL用の型
			if(data instanceof S3GLArray) {
				if(variable.glsltype === data.glsltype) {
					return data.data;
				}
			}
			// 入力型が行列型であり、GLSLも行列であれば
			if(data instanceof S3Matrix) {
				if(	(variable.glsltype === "mat2") ||
					(variable.glsltype === "mat3") ||
					(variable.glsltype === "mat4") ){
					return data.toInstanceArray(variable.instance, variable.size);
				}
			}
			// 入力型がベクトル型であり、GLSLも数値であれば
			if(data instanceof S3Vector) {
				if(	(variable.glsltype === "vec2") ||
					(variable.glsltype === "vec3") ||
					(variable.glsltype === "vec4") ||
					(variable.glsltype === "ivec2") ||
					(variable.glsltype === "ivec3") ||
					(variable.glsltype === "ivec4") ||
					(variable.glsltype === "bvec2") ||
					(variable.glsltype === "bvec3") ||
					(variable.glsltype === "bvec4") ) {
					return data.toInstanceArray(variable.instance, variable.size);
				}
			}
			// 入力型が数値型であり、GLSLも数値であれば
			if((typeof data === "number")||(data instanceof Number)) {
				if(	(variable.glsltype === "int") ||
					(variable.glsltype === "float") ||
					(variable.glsltype === "bool") ) {
					return new variable.instance([data]);
				}
			}
			console.log(data);
			throw "not toArraydata";
		};
		
		// 引数の値をArray型に統一化する
		if(!variable.is_array) {
			data = toArraydata(data);
		}
		else {
			for(let i = 0; i < data.length; i++) {
				if(variable.location[i] !== -1) {
					// 配列の値が NULL になっているものは調査しない
					if(data[i] !== null) {
						data[i] = toArraydata(data[i]);
					}
				}
			}
		}
		
		// ---- bind Data ----
		// 装飾子によって bind する方法を変更する
		if(variable.modifiers === "attribute") {
			// bindしたいデータ
			gl.bindBuffer(gl.ARRAY_BUFFER, data);
			// 有効化していない場合は有効化する
			if(!this.enable_vertex_number[variable.location[0]]) {
				gl.enableVertexAttribArray(variable.location[0]);
				this.enable_vertex_number[variable.location[0]] = true;
			}
			// bind。型は適当に設定
			gl.vertexAttribPointer(
				variable.location[0],
				variable.size,
				variable.btype === "FLOAT" ? gl.FLOAT : gl.SHORT,
				false, 0, 0);
		}
		else {
			// uniform の設定
			if(!variable.is_array) {
				variable.bind(variable.location[0], data);
			}
			else {
				// 配列の場合は、配列の数だけbindする
				for(let i = 0; i < data.length; i++) {
					if(variable.location[i] !== -1) {
						// 配列の値が NULL になっているものはbindしない
						if(data[i] !== null) {
							variable.bind(variable.location[i], data[i]);
						}
					}
				}
			}
		}
		
		return true;
	}

	/**
	 * プログラムにデータを結びつける
	 * @param {Object} s3mesh
	 * @returns {Integer} IBOのインデックス数
	 */
	bindMesh(s3mesh) {
		if(!this.isLinked()) {
			// programが未作成
			return 0;
		}
		const gl = this.sys.getGL();
		if(gl === null) {
			// glが用意されていない
			return 0;
		}
		const gldata = s3mesh.getGLData();
		if(gldata === null) {
			// 入力値が用意されていない
			return 0;
		}
		// インデックスをセット
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gldata.ibo.data );
		const index_length = gldata.ibo.array_length;
		// 頂点をセット(あらかじめコードから解析した attribute について埋める)
		for(const key in this.variable) {
			
			if(this.variable[key].modifiers === "uniform") {
				// uniform は共通設定なので省略
				continue;
			}
			// 例えば、vboのリストにあるが、gldata内に情報をもっていない場合がある
			// それは、カメラ用の行列などがあげられる。
			// 逆に、gldata内に情報をもっているが、vbo内に定義されていないのであれば、
			// 使用しない。
			if(gldata.vbo[key] === undefined) {
				continue;
			}
			this.bindData(key, gldata.vbo[key].data);
		}
		// 戻り値でインデックスの長さを返す
		// この長さは、drawElementsで必要のため
		return index_length;
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLLight extends S3Light {

	/**
	 * ライト情報にデータ取得用のメソッドを拡張している。
	 */
	constructor() {
		super();
	}

	clone() {
		return super.clone(S3GLLight);
	}
	
	getGLHash() {
		return "" + this.mode + this.power + this.range + this.position.toString(3) + this.direction.toString(3) + this.color.toString(3);
	}
	
	getGLData() {
		const lightsColor = this.color.mul(this.power);
		let lightsVector = new S3Vector();
		// uniform 節約のためにライト用のベクトルは用途によって入れる値を変更する
		if(this.mode === S3Light.MODE.DIRECTIONAL_LIGHT) {
			lightsVector = this.direction;
		}
		else if(this.mode === S3Light.MODE.POINT_LIGHT) {
			lightsVector = this.position;
		}
		// uniform 節約のために最終的に渡すデータをまとめる
		return {
			lightsData1	: new S3GLArray([this.mode, this.range, lightsVector.x, lightsVector.y] , 4, S3GLArray.datatype.Float32Array),
			lightsData2	: new S3GLArray([lightsVector.z, lightsColor.x, lightsColor.y, lightsColor.z] , 4, S3GLArray.datatype.Float32Array)
		};
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLMaterial extends S3Material {
	
	constructor(s3dlsystem, name) {
		super(s3dlsystem, name);
	}
	
	getGLHash() {
		// 名前は被らないので、ハッシュに使用する
		return this.name;
	}

	/**
	 * 頂点データを作成して取得する
	 * 頂点データ内に含まれるデータは、S3GLArray型となる。
	 * なお、ここでつけているメンバの名前は、そのままバーテックスシェーダで使用する変数名となる
	 * uniform の数がハードウェア上限られているため、送る情報は選定すること
	 * @returns {頂点データ（色情報）}
	 */
	getGLData() {
		// テクスチャを取得
		let tex_color	= this.textureColor.getGLData();
		let tex_normal	= this.textureNormal.getGLData();
		// テクスチャのありなしフラグを作成。ない場合はダミーデータを入れる。
		const tex_exist	= [tex_color === null?0:1, tex_normal === null?0:1];
		tex_color	= tex_color === null	? this.sys._getDummyTexture() : tex_color;
		tex_normal	= tex_normal === null	? this.sys._getDummyTexture() : tex_normal;
		return {
			materialsColorAndDiffuse	:
				new S3GLArray([this.color.x, this.color.y, this.color.z, this.diffuse]			, 4, S3GLArray.datatype.Float32Array),
			materialsSpecularAndPower	:
				new S3GLArray([this.specular.x, this.specular.y, this.specular.z, this.power]	, 4, S3GLArray.datatype.Float32Array),
			materialsEmission	:
				new S3GLArray(this.emission	, 3, S3GLArray.datatype.Float32Array),
			materialsAmbientAndReflect	:
				new S3GLArray([this.ambient.x, this.ambient.y, this.ambient.z, this.reflect]	, 4, S3GLArray.datatype.Float32Array),
			materialsTextureExist	:
				new S3GLArray(tex_exist	, 2, S3GLArray.datatype.Float32Array),
			materialsTextureColor	:	tex_color,
			materialsTextureNormal	:	tex_normal
		};
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLTexture extends S3Texture {
	
	constructor(s3glsystem, data) {
		super(s3glsystem, data);
		this.gldata			= null;
	}

	_init() {
		super._init();
		this.gldata			= null;
	}
	
	dispose() {
		if(!this.is_dispose) {
			this.is_dispose = true;
			if(this.gldata !== null) {
				this.sys._disposeObject(this);
				this.gldata = null;
			}
		}
	}

	getGLData() {
		if(this.is_dispose) {
			return null;
		}
		if(this.gldata !== null) {
			return this.gldata;
		}
		if(this.is_loadimage) {
			this.gldata = this.sys.glfunc.createTexture(this.url, this.image);
			return this.gldata;
		}
		return null;
	}
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLMesh extends S3Mesh {
	
	/**
	 * 既存の部品に WebGL 用の情報を記録するための拡張
	 * 主に、描写のための VBO と IBO を記録する
	 * @param {S3System} sys 
	 */
	constructor(sys) {
		super(sys);
	}
	
	_init() {
		super._init();
		// webgl用
		this.gldata = {};
		this.is_compile_gl	= false;
	}
	
	clone() {
		return super.clone(S3GLMesh);
	}
	
	isCompileGL() {
		return this.is_compile_gl;
	}
	
	setCompileGL(is_compile_gl) {
		this.is_compile_gl = is_compile_gl;
	}
	
	/**
	 * 三角形インデックス情報（頂点ごとのYV、法線）などを求める
	 * 具体的には共有している頂点をしらべて、法線の平均値をとる
	 * @returns {S3GLTriangleIndexData}
	 */
	createTriangleIndexData() {
		const vertex_list			= this.getVertexArray();
		const triangleindex_list	= this.getTriangleIndexArray();
		const tid_list = [];
		
		const normallist = {
			normal		: null,
			tangent		: null,
			binormal	: null
		};
		
		// 各面の法線、接線、従法線を調べる
		for(let i = 0; i < triangleindex_list.length; i++) {
			const triangleindex = triangleindex_list[i];
			const index	= triangleindex.index;
			const uv		= triangleindex.uv;
			tid_list[i]	= triangleindex.createGLTriangleIndexData();
			const triangledata = tid_list[i];
			let vector_list = null;
			// 3点を時計回りで通る平面が表のとき
			if(this.sys.dimensionmode === S3System.DIMENSION_MODE.RIGHT_HAND) {
				vector_list = S3Vector.getNormalVector(
					vertex_list[index[0]].position, vertex_list[index[1]].position, vertex_list[index[2]].position,
					uv[0], uv[1], uv[2]
				);
			}
			else {
				vector_list = S3Vector.getNormalVector(
					vertex_list[index[2]].position, vertex_list[index[1]].position, vertex_list[index[0]].position,
					uv[2], uv[1], uv[0]
				);
			}
			for(const vector_name in normallist) {
				triangledata.face[vector_name] = vector_list[vector_name];
			}
		}
		
		// 素材ごとに、三角形の各頂点に、面の法線情報を追加する
		// 後に正規化する（平均値をとる）が、同じベクトルを加算しないようにキャッシュでチェックする
		const vertexdatalist_material = [];
		const vertexdatalist_material_cash = [];
		for(let i = 0; i < triangleindex_list.length; i++) {
			const triangleindex = triangleindex_list[i];
			const material = triangleindex.materialIndex;
			const triangledata = tid_list[i];
			// 未登録なら新規作成する
			if(vertexdatalist_material[material] === undefined) {
				vertexdatalist_material[material] = [];
				vertexdatalist_material_cash[material] = [];
			}
			const vertexdata_list = vertexdatalist_material[material];
			const vertexdata_list_cash = vertexdatalist_material_cash[material];
			// 素材ごとの三角形の各頂点に対応する法線情報に加算していく
			for(let j = 0; j < 3; j++) {
				// 未登録なら新規作成する
				const index = triangleindex.index[j];
				if(vertexdata_list[index] === undefined) {
					vertexdata_list[index] = {
						normal		: new S3Vector(0, 0, 0),
						tangent		: new S3Vector(0, 0, 0),
						binormal	: new S3Vector(0, 0, 0)
					};
					vertexdata_list_cash[index] = {
						normal		: [],
						tangent		: [],
						binormal	: []
					};
				}
				const vertexdata = vertexdata_list[index];
				const vertexdata_cash = vertexdata_list_cash[index];
				
				// 加算する
				for(const vector_name in normallist) {
					if(triangledata.face[vector_name] !== null) {
						// データが入っていたら加算する
						const id = triangledata.face[vector_name].toHash(3);
						if(vertexdata_cash[vector_name][id]) continue;
						vertexdata[vector_name] = vertexdata[vector_name].add(triangledata.face[vector_name]);
						vertexdata_cash[vector_name][id] = true;
					}
				}
			}
		}
		
		// マテリアルごとの頂点の法線を、正規化して1とする（平均値をとる）
		for(const material in vertexdatalist_material) {
			const vertexdata_list = vertexdatalist_material[material];
			for(const index in vertexdata_list) {
				const vertexdata = vertexdata_list[index];
				for(const vectorname in normallist) {
					// あまりに小さいと、0で割ることになるためチェックする
					if(vertexdata[vectorname].normFast() > 0.000001) {
						vertexdata[vectorname] = vertexdata[vectorname].normalize();
					}
				}
			}
		}
		
		// 面法線と、頂点（スムーズ）法線との角度の差が、下記より大きい場合は面法線を優先
		const SMOOTH = {};
		SMOOTH.normal	= Math.cos((50/360)*(2*Math.PI));
		SMOOTH.tangent	= Math.cos((50/360)*(2*Math.PI));
		SMOOTH.binormal	= Math.cos((50/360)*(2*Math.PI));
		
		// 最終的に三角形の各頂点の法線を求める
		for(let i = 0; i < triangleindex_list.length; i++) {
			const triangleindex = triangleindex_list[i];
			const material = triangleindex.materialIndex;
			const triangledata = tid_list[i];
			const vertexdata_list = vertexdatalist_material[material];
			
			// 法線ががあまりに違うのであれば、面の法線を採用する
			for(let j = 0; j < 3; j++) {
				const index = triangleindex.index[j];
				const vertexdata = vertexdata_list[index];
				for(const vectorname in normallist) {
					let targetdata;
					if(triangledata.face[vectorname]) {
						// 面で計算した値が入っているなら、
						// 面で計算した値と、頂点の値とを比較してどちらかを採用する
						const rate  = triangledata.face[vectorname].dot(vertexdata[vectorname]);
						// 指定した度以上傾いていたら、面の法線を採用する
						targetdata = (rate < SMOOTH[vectorname]) ? triangledata.face : vertexdata;
					}
					else {
						targetdata = vertexdata;
					}
					// コピー
					triangledata.vertex[vectorname][j]	= targetdata[vectorname];
				}
			}
		}
		
		return tid_list;
	}

	/**
	 * メッシュの頂点情報やインデックス情報を、WebGLで扱うIBO/VBO形式に計算して変換する
	 * @returns {undefined}
	 */
	_getGLArrayData() {
		
		const vertex_list			= this.getVertexArray();
		const triangleindex_list	= this.createTriangleIndexData();
		const hashlist = [];
		let vertex_length = 0;
		
		const triangle			= [];
		const vertextypelist	= {};
		
		// インデックスを再構築して、VBOとIBOを作る
		// 今の生データだと、頂点情報、素材情報がばらばらに保存されているので
		// 1つの頂点情報（位置、色等）を1つのセットで保存する必要がある
		// 面に素材が結びついているので、面が1つの頂点を共有していると
		// それらの面の素材情報によって、別の頂点として扱う必要がある
		// なので基本的には頂点情報を毎回作り直す必要があるが、
		// 1度作ったものと等しいものが必要であれば、キャッシュを使用する
		for(let i = 0; i < triangleindex_list.length; i++) {
			const triangleindex = triangleindex_list[i];
			const indlist = [];
			// ポリゴンの各頂点を調べる
			for(let j = 0; j < 3; j++) {
				// その頂点（面の情報（UVなど）も含めたデータ）のハッシュ値を求める
				const hash = triangleindex.getGLHash(j, vertex_list);
				// すでに以前と同一の頂点があるならば、その頂点アドレスを選択。ない場合は新しいアドレス
				const hit = hashlist[hash];
				indlist[j] = (hit !== undefined) ? hit : vertex_length;
				// 頂点がもしヒットしていなかったら
				if(hit === undefined) {
					// 頂点データを作成して
					const vertexdata = triangleindex.getGLData(j, vertex_list);
					hashlist[hash]  = vertex_length;
					// 頂点にはどういった情報があるか分からないので、in を使用する。
					// key には、position / normal / color / uv などがおそらく入っている
					for(const key in vertexdata) {
						if(vertextypelist[key] === undefined) {
							vertextypelist[key]		= [];
						}
						vertextypelist[key].push(vertexdata[key]);
					}
					vertex_length++;
				}
			}
			// 3つの頂点のインデックスを記録
			triangle[i] = new Int16Array(indlist);
		}
		
		// データ結合処理
		// これまでは複数の配列にデータが入ってしまっているので、
		// 1つの指定した型の配列に全てをまとめる必要がある
		
		let pt = 0;
		const ibo = {};
		{
			// IBOの結合（インデックス）
			ibo.array_length	= triangleindex_list.length * 3;
			ibo.array			= new Int16Array(ibo.array_length);
			pt = 0;
			for(let i = 0; i < triangleindex_list.length; i++) {
				for(let j = 0; j < 3; j++) {
					ibo.array[pt++] = triangle[i][j];
				}
			}
		}
		const vbo = {};
		{
			// VBOの結合（頂点）
			// 位置、法線、色などを、それぞれ1つの配列として記録する
			for(const key in vertextypelist) {
				const srcdata		= vertextypelist[key];
				const dimension	= srcdata[0].dimension;
				const dstdata	= {};
				// 情報の名前(position / uv / normal など)
				dstdata.name			= key;
				// 1つの頂点あたり、いくつの値が必要か。例えばUVなら2次元情報
				dstdata.dimension		= srcdata[0].dimension;
				// 型情報 Float32Array / Int32Array なのかどうか
				dstdata.datatype		= srcdata[0].datatype;
				// 配列の長さ
				dstdata.array_length	= dimension * vertex_length;
				// 型情報と、配列の長さから、メモリを確保する
				dstdata.array			= new dstdata.datatype.instance(dstdata.array_length);
				// data を1つの配列に結合する
				pt = 0;
				for(let i = 0; i < vertex_length; i++) {
					for(let j = 0; j < dimension; j++) {
						dstdata.array[pt++] = srcdata[i].data[j];
					}
				}
				// VBOオブジェクトに格納
				vbo[key] = dstdata;
			}
		}
		
		const arraydata = {};
		arraydata.ibo		= ibo;
		arraydata.vbo		= vbo;
		return arraydata;
	}

	disposeGLData() {
		// コンパイルしていなかったら抜ける
		if(!this.isCompileGL()) {
			return;
		}
		const gldata = this.getGLData();
		if(gldata !== null) {
			if(gldata.ibo !== undefined) {
				if(gldata.ibo.data !== undefined) {
					this.sys.glfunc.deleteBuffer(gldata.ibo.data);
				}
				delete gldata.ibo;
			}
			if(gldata.vbo !== undefined) {
				for(const key in gldata.vbo) {
					if(gldata.vbo[key].data !== undefined) {
						this.sys.glfunc.deleteBuffer(gldata.vbo[key].data);
					}
				}
				delete gldata.vbo;
			}
			{
				const material_list = this.getMaterialArray();
				for(let i = 0; i < material_list.length; i++) {
					const mat = material_list[i];
					for(const key in mat) {
						const obj = mat[key];
						if(obj instanceof S3GLTexture) {
							obj.dispose();
						}
					}
				}
			}
		}
		delete this.gldata;
		this.gldata = {};
		this.setCompileGL(false);
	}

	/**
	 * VBO/IBOを作成するため、使用中のWEBGL情報を設定し、データを作成する
	 * @returns {S3GLMesh.gldata}
	 */
	getGLData() {
		// すでに存在している場合は、返す
		if(this.isCompileGL()) {
			return this.gldata;
		}
		// 完成していない場合は null
		if(this.isComplete() === false) {
			return null;
		}
		// GLを取得できない場合も、この時点で終了させる
		if(!this.sys.isSetGL()) {
			return null;
		}
		const gldata = this._getGLArrayData(); // GL用の配列データを作成
		
		// IBO / VBO 用のオブジェクトを作成
		gldata.ibo.data = this.sys.glfunc.createBufferIBO(gldata.ibo.array);
		for(const key in gldata.vbo) {
			gldata.vbo[key].data = this.sys.glfunc.createBufferVBO(gldata.vbo[key].array);
		}
		// 代入
		this.gldata = gldata;
		this.setCompileGL(true);
		return this.gldata;
	}
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLModel extends S3Model {

	constructor() {
		super();
	}
	
	/**
	 * Uniform を作成して返す
	 */
	getUniforms() {
		const uniforms				= {};
		{
			const MATELIAL_MAX			= 4;
			const material_array			= this.getMesh().getMaterialArray();
			const materialLength			= Math.min(material_array.length, MATELIAL_MAX);
			for(let i = 0; i < materialLength; i++) {
				const data = material_array[i].getGLData();
				for(const key in data) {
					if(!uniforms[key]) {
						uniforms[key] = [];
					}
					uniforms[key].push(data[key]);
				}
			}
		}
		const ret = [];
		ret.uniforms = uniforms;
		return ret;
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLScene extends S3Scene {
	
	constructor() {
		super();
	}
	
	getUniforms() {
		const uniforms			= {};
		// カメラ情報もUniformで送る
		{
			uniforms.eyeWorldDirection = this.getCamera().getDirection();
		}
		// ライト情報はUniformで送る
		{
			const LIGHTS_MAX			= 4;
			const light_array			= this.getLights();
			const lightsLength		= Math.min(light_array.length, LIGHTS_MAX);
			uniforms.lightsLength	= new S3GLArray(lightsLength, 1, S3GLArray.datatype.Int32Array);
			for(let i = 0; i < lightsLength; i++) {
				const data = light_array[i].getGLData();
				for(const key in data) {
					if(!uniforms[key]) {
						uniforms[key] = [];
					}
					uniforms[key].push(data[key]);
				}
			}
		}
		const ret = [];
		ret.uniforms = uniforms;
		return ret;
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLTriangleIndexData {
	
	constructor(triangle_index) {
		this.index				= triangle_index.index;				// 各頂点を示すインデックスリスト
		this.materialIndex		= triangle_index.materialIndex;		// 面の材質
		this.uv					= triangle_index.uv;				// 各頂点のUV座標
		this._isEnabledTexture	= triangle_index.uv[0] !== null;	// UV情報があるか
		
		this.face				= {};
		this.vertex				= {};
		// S3Vector.getTangentVectorの取得値を格納用
		this.face.normal		= null;							// 面の法線情報
		this.face.tangent		= null;							// 面の接線情報
		this.face.binormal		= null;							// 面の従法線情報
		this.vertex.normal		= [null, null, null];			// 頂点ごとの法線
		this.vertex.tangent		= [null, null, null];			// 頂点ごとの接線 
		this.vertex.binormal	= [null, null, null];			// 頂点ごとの従法線 
	}

	getGLHash(number, vertexList) {
		const uvdata = this._isEnabledTexture ? this.uv[number].toString(2) + this.face.binormal.toString(2) + this.face.tangent.toString(2): "";
		const vertex   = vertexList[this.index[number]].getGLHash();
		return vertex + this.materialIndex + uvdata + this.vertex.normal[number].toString(3);
	}

	/**
	 * 頂点データを作成して取得する
	 * 頂点データ内に含まれるデータは、S3GLArray型となる。
	 * なお、ここでつけているメンバの名前は、そのままバーテックスシェーダで使用する変数名となる
	 * @param {Integer} number 三角形の何番目の頂点データを取得するか
	 * @param {S3Vertex[]} vertexList 頂点の配列
	 * @returns {頂点データ（座標、素材番号、UV値が入っている）}
	 */
	getGLData(number, vertexList) {
		const vertex		= {};
		const vertexdata_list = vertexList[this.index[number]].getGLData();
		for(const key in vertexdata_list) {
			vertex[key]	= vertexdata_list[key];
		}
		const uvdata = this._isEnabledTexture ? this.uv[number] : new S3Vector(0.0, 0.0);
		vertex.vertexTextureCoord	= new S3GLArray(uvdata, 2, S3GLArray.datatype.Float32Array);
		vertex.vertexMaterialFloat	= new S3GLArray(this.materialIndex, 1, S3GLArray.datatype.Float32Array);
		vertex.vertexNormal			= new S3GLArray(this.vertex.normal[number], 3, S3GLArray.datatype.Float32Array);
		vertex.vertexBinormal		= new S3GLArray(this.vertex.binormal[number], 3, S3GLArray.datatype.Float32Array);
		vertex.vertexTangent		= new S3GLArray(this.vertex.tangent[number], 3, S3GLArray.datatype.Float32Array);
		return vertex;
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLTriangleIndex extends S3TriangleIndex {
	
	/**
	 * 3つの頂点を持つポリゴン情報にデータ取得用のメソッドを拡張
	 * @param {Number} i1 
	 * @param {Number} i2 
	 * @param {Number} i3 
	 * @param {Array} indexlist 
	 * @param {Array} materialIndex 
	 * @param {Array} uvlist 
	 */
	constructor(i1, i2, i3, indexlist, materialIndex, uvlist) {
		super(i1, i2, i3, indexlist, materialIndex, uvlist);
	}

	clone() {
		return super.clone(S3GLTriangleIndex);
	}
	
	inverseTriangle() {
		return super.inverseTriangle(S3GLTriangleIndex);
	}

	createGLTriangleIndexData() {
		return new S3GLTriangleIndexData(this);
	}	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLVertex extends S3Vertex {

	constructor(position) {
		super(position);
	}
	
	clone() {
		return super.clone(S3GLVertex);
	}

	getGLHash() {
		return this.position.toString(3);
	}
	
	/**
	 * 頂点データを作成して取得する
	 * 頂点データ内に含まれるデータは、S3GLVertex型となる。
	 * なお、ここでつけているメンバの名前は、そのままバーテックスシェーダで使用する変数名となる
	 * @returns {頂点データ（座標、法線情報）}
	 */
	getGLData() {
		return {
			vertexPosition	: new S3GLArray(this.position, 3, S3GLArray.datatype.Float32Array)
		};
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLSystem extends S3System {
	
	constructor() {
		super();
		this.program		= null;
		this.gl				= null;
		this.is_set			= false;
		this.program_list	= [];
		this.program_listId	= 0;
		const that = this;
		
		const glfunc_texture_cash = {};
		
		this.glfunc = {
			
			createBufferVBO : function(data) {
				const gl = that.getGL();
				if(gl === null) {
					return null;
				}
				const vbo = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
				gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
				gl.bindBuffer(gl.ARRAY_BUFFER, null);
				return vbo;
			},

			createBufferIBO : function(data) {
				const gl = that.getGL();
				if(gl === null) {
					return null;
				}
				const ibo = gl.createBuffer();
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
				return ibo;
			},
			
			deleteBuffer : function(data) {
				const gl = that.getGL();
				if(gl !== null) {
					gl.deleteBuffer(data);
				}
			},
			
			createTexture : function(id, image) {
				if(	!(image instanceof ImageData) &&
					!(image instanceof HTMLImageElement) &&
					!(image instanceof HTMLCanvasElement) &&
					!(image instanceof HTMLVideoElement)) {
					throw "createBufferTexture";
				}
				const gl = that.getGL();
				if(gl === null) {
					return null;
				}
				let texture = null;
				if(!glfunc_texture_cash[id]) {
					texture = gl.createTexture();
					gl.bindTexture(gl.TEXTURE_2D, texture);
					gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
					gl.generateMipmap(gl.TEXTURE_2D);
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
					const cash = {};
					cash.texture	= texture;
					cash.count		= 0;
					glfunc_texture_cash[id] = cash;
				}
				texture = glfunc_texture_cash[id].texture;
				glfunc_texture_cash[id].count++;
				return texture;
			},
			
			deleteTexture : function(id) {
				const gl = that.getGL();
				if(gl !== null) {
					if(glfunc_texture_cash[id]) {
						glfunc_texture_cash[id].count--;
						if(glfunc_texture_cash[id].count === 0) {
							gl.deleteBuffer(glfunc_texture_cash[id].texture);
							delete glfunc_texture_cash[id];
						}
					}
				}
			},
			
			createProgram : function(shader_vertex, shader_fragment) {
				const gl = that.getGL();
				if(gl === null) {
					return null;
				}
				let program		= gl.createProgram();
				let is_error	= false;
				gl.attachShader(program, shader_vertex   );
				gl.attachShader(program, shader_fragment );
				gl.linkProgram(program);
				if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
					console.log("link error " + gl.getProgramInfoLog(program));
					gl.detachShader(program, shader_vertex   );
					gl.detachShader(program, shader_fragment );
					gl.deleteProgram(program);
					program		= null;
					is_error	= true;
				}
				return {
					program		: program,
					is_error	: is_error
				};
			},
			
			deleteProgram : function(program, shader_vertex, shader_fragment) {
				const gl = that.getGL();
				if(gl === null) {
					return null;
				}
				gl.detachShader(program, shader_vertex   );
				gl.detachShader(program, shader_fragment );
				gl.deleteProgram(program);
			},
			
			createShader : function(sharder_type, code) {
				const gl = that.getGL();
				if(gl === null) {
					return null;
				}
				let shader		= gl.createShader(sharder_type);
				let is_error	= false;
				gl.shaderSource(shader, code);
				gl.compileShader(shader);
				if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
					console.log("compile error " + gl.getShaderInfoLog(shader));
					gl.deleteShader(shader);
					shader		= null;
					is_error	= true;
				}
				return {
					shader		: shader,
					is_error	: is_error
				};
			},
			
			deleteShader : function(shader) {
				const gl = that.getGL();
				if(gl === null) {
					return null;
				}
				gl.deleteShader(shader);
			}
			
		};
	}
	
	getGL() {
		return this.gl;
	}

	isSetGL() {
		return this.gl !== null;
	}
	
	setCanvas(canvas) {
		// 初期化色
		const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		this.canvas = canvas;
		this.gl = gl;
	}

	createProgram() {
		const program = new S3GLProgram(this, this.program_listId);
		this.program_list[this.program_listId] = program;
		this.program_listId++;
		return program;
	}

	disposeProgram() {
		for(const key in this.program_list) {
			this.program_list[key].dispose();
			delete this.program_list[key];
		}
	}

	setProgram(glprogram) {
		// nullの場合はエラーも無視
		if(glprogram === null) {
			return false;
		}
		// 明確な入力の誤り
		if(!(glprogram instanceof S3GLProgram)) {
			throw "not S3GLProgram";
		}
		// 新規のプログラムなら保持しておく
		if(this.program === null) {
			this.program = glprogram;
		}
		// プログラムが取得できない場合は、ダウンロード中の可能性あり無視する
		const new_program = glprogram.getProgram();
		if(null === new_program) {
			return false;
		}
		// すでに動作中で、設定されているものと同一なら無視する
		if((this.program === glprogram) && this.is_set) {
			return true;
		}
		// 新しいプログラムなのでセットする
		if(this.program !== null) {
			this.program.disuseProgram();
		}
		this.program = glprogram;
		this.program.useProgram();
		this.is_set = true;
	}

	clear() {
		if(this.gl === null) {
			return false;
		}
		const color = this.getBackgroundColor();
		this.gl.clearColor(color.x, color.y, color.z, color.w);
		this.gl.clearDepth(1.0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		return true;
	}

	drawElements(indexsize) {
		if(!this.is_set) {
			return;
		}
		this.gl.drawElements(this.gl.TRIANGLES, indexsize, this.gl.UNSIGNED_SHORT, 0);
		this.gl.flush();
	}

	deleteBuffer(data) {
		if(this.gl === null) {
			return null;
		}
		this.gl.deleteBuffer(data);
	}

	_getDummyTexture() {
		if(this._textureDummyData === undefined) {
			const canvas = document.createElement("canvas");
			canvas.width  = 1;
			canvas.height = 1;
			const context = canvas.getContext("2d");
			const imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
			this._textureDummyId = this._createID();
			this._textureDummyData = this.glfunc.createTexture(this._textureDummyId, imagedata);
		}
		return this._textureDummyData;
	}

	_setDepthMode() {
		if(this.gl === null) {
			return null;
		}
		const gl = this.gl;
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
	}

	_setCullMode() {
		if(this.gl === null) {
			return null;
		}
		const gl = this.gl;
		if(this.cullmode === S3System.CULL_MODE.NONE) {
			gl.disable(gl.CULL_FACE);
			return;
		}
		else {
			gl.enable(gl.CULL_FACE);
		}
		if(this.frontface === S3System.FRONT_FACE.CLOCKWISE) {
			gl.frontFace(gl.CW);
		}
		else {
			gl.frontFace(gl.CCW);
		}
		if(this.cullmode === S3System.CULL_MODE.FRONT_AND_BACK) {
			gl.cullFace(gl.FRONT_AND_BACK);
		}
		else if(this.cullmode === S3System.CULL_MODE.BACK) {
			gl.cullFace(gl.BACK);
		}
		else if(this.cullmode === S3System.CULL_MODE.FRONT) {
			gl.cullFace(gl.FRONT);
		}
	}

	_bindStart() {
		this.program.resetActiveTextureId();
	}

	_bindEnd() {
		
	}

	_bind(p1, p2) {
		if(!this.is_set) {
			return;
		}
		const prg = this.program;
		let index_lenght = 0;
		// p1が文字列、p2がデータの場合、データとして結びつける
		if((arguments.length === 2) && ((typeof p1 === "string")||(p1 instanceof String))) {
			prg.bindData(p1, p2);
		}
		// 引数がモデルであれば、モデルとして紐づける
		else if((arguments.length === 1) && (p1 instanceof S3GLModel)) {
			const mesh = p1.getMesh();
			if(mesh instanceof S3GLMesh) {
				index_lenght = prg.bindMesh(mesh);
			}
		}
		// uniformsデータであれば、内部のデータを全て割り当てる
		else if((arguments.length === 1) && (p1.uniforms)) {
			const uniforms = p1.uniforms;
			for(const key in uniforms) {
				prg.bindData(key, uniforms[key]);
			}
		}
		return index_lenght;
	}

	drawScene(scene) {
		// プログラムを再設定
		this.setProgram(this.program);
		
		// まだ設定できていない場合は、この先へいかせない
		if(!this.is_set) {
			return;
		}
		
		// 画面の初期化
		this._setDepthMode();
		this._setCullMode();
		
		// 描写開始
		this._bindStart();
		
		// Sceneに関するUniform設定（カメラやライト設定など）
		this._bind(scene.getUniforms());
		
		// カメラの行列を取得する
		const VPS = scene.getCamera().getVPSMatrix(this.canvas);
		
		// モデル描写
		const models = scene.getModels();
		for(let i = 0; i < models.length; i++) {
			const model	= models[i];
			const mesh	= model.getMesh();
			if(mesh.isComplete() === false) {
				continue;
			}
			
			// モデルに関するUniform設定（材質の設定など）
			this._bind(model.getUniforms());
			
			// モデル用のBIND
			const M = this.getMatrixWorldTransform(model);
			const MV = this.mulMatrix(M, VPS.LookAt);
			const MVP = this.mulMatrix(MV, VPS.PerspectiveFov);
			this._bind("matrixWorldToLocal4", M.inverse4());
			this._bind("matrixLocalToWorld4", M);
			this._bind("matrixLocalToWorld3", M);
			this._bind("matrixLocalToPerspective4", MVP);
			
			const indexsize = this._bind(model);
			if(indexsize) {
				this.drawElements(indexsize);
			}
		}
		
		// 描写終了
		this._bindEnd();
	}

	_disposeObject(obj) {
		if(obj instanceof S3GLTexture) {
			this.glfunc.deleteTexture(this.url);
		}
	}
	
	createVertex(position) {
		return new S3GLVertex(position);
	}
	
	createTriangleIndex(i1, i2, i3, indexlist, materialIndex, uvlist) {
		return new S3GLTriangleIndex(i1, i2, i3, indexlist, materialIndex, uvlist);
	}
	
	createTexture(name) {
		return new S3GLTexture(this, name);
	}
	
	createScene() {
		return new S3GLScene();
	}
	
	createModel() {
		return new S3GLModel();
	}
	
	createMesh() {
		return new S3GLMesh(this);
	}
	
	createMaterial(name) {
		return new S3GLMaterial(this, name);
	}
	
	createLight() {
		return new S3GLLight();
	}
	
	createCamera() {
		const camera = new S3Camera(this);
		return camera;
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const DefaultMaterial = {
	name : "s3default",
	color		:new S3Vector(1.0, 1.0, 1.0, 1.0),	// 拡散反射の色
	diffuse	: 0.8,									// 拡散反射の強さ
	emission	: new S3Vector(0.0, 0.0, 0.0),		// 自己照明（輝き）
	specular	: new S3Vector(0.0, 0.0, 0.0),		// 鏡面反射の色
	power		: 5.0,								// 鏡面反射の強さ
	ambient	: new S3Vector(0.6, 0.6, 0.6),			// 光によらない初期色
	reflect	: 0.0,									// 環境マッピングによる反射の強さ
	textureColor	: null,
	textureNormal	: null
};

/*
	次のようなデータを入出力できます。
	const sample = {
		Indexes:{
			body:[
				[ 0, 1, 2],
				[ 3, 1, 0],
				[ 3, 0, 2],
				[ 3, 2, 1]
			]
		},
		Vertices:[
			[  0,  0,  -5],
			[  0, 20,  -5],
			[ 10,  0,  -5],
			[  0,  0, -20]
		]
	};
*/

const S3MeshLoaderJSON = {

	name : "JSON",

	input : function(sys, mesh, json) {
		let meshdata;
		if((typeof json === "string")||(json instanceof String)) {
			meshdata = eval(json);
		}
		else {
			meshdata = json;
		}
		let material = 0;
		// 材質名とインデックスを取得
		for(const materialname in meshdata.Indexes) {
			mesh.addMaterial(sys.createMaterial(materialname));
			const materialindexlist = meshdata.Indexes[materialname];
			for(let i = 0; i < materialindexlist.length; i++) {
				const list = materialindexlist[i];
				for(let j = 0; j < list.length - 2; j++) {
					// 3角形と4角形に対応
					const ti = ((j % 2) === 0) ? 
						sys.createTriangleIndex(j    , j + 1, j + 2, list, material)
						:sys.createTriangleIndex(j - 1, j + 1, j + 2, list, material);
					mesh.addTriangleIndex(ti);
				}
			}
			material++;
		}
		// 頂点座標を取得
		for(let i = 0; i < meshdata.Vertices.length; i++) {
			const vector = new S3Vector(meshdata.Vertices[i][0], meshdata.Vertices[i][1], meshdata.Vertices[i][2]);
			const vertex = sys.createVertex(vector);
			mesh.addVertex(vertex);
		}
		return true;
	},

	output : function(mesh) {
		const vertex			= mesh.getVertexArray(); 
		const triangleindex	= mesh.getTriangleIndexArray(); 
		const material		= mesh.getMaterialArray();
		const material_vertexlist = [];
		const material_length = material.length !== 0 ? material.length : 1;
		const default_material = DefaultMaterial;
		// 材質リストを取得
		for(let i = 0; i < material_length; i++) {
			material_vertexlist[i] = {
				material: material[i] ? material[i] : default_material ,
				list:[]
			};
		}
		// 材質名に合わせて、インデックスリストを取得
		for(let i = 0; i < triangleindex.length; i++) {
			const ti = triangleindex[i];
			material_vertexlist[ti.materialIndex].list.push( ti.index );
		}
		const output = [];
		output.push("{");
		output.push("\tIndexes:{");
		for(let i = 0; i < material_vertexlist.length; i++) {
			const mv = material_vertexlist[i];
			output.push("\t\t" + mv.material.name + ":[");
			for(let j = 0; j < mv.list.length; j++) {
				const vi = mv.list[j];
				output.push("\t\t\t[" + vi[0] + " " + vi[1] + " " + vi[2] + "]" + ((j === mv.list.length - 1) ? "" : ",") );
			}
			output.push("\t\t]" + ((i === material_vertexlist.length - 1) ? "" : ",") );
		}
		output.push("\t},");
		output.push("\tVertices:[");
		for(let i = 0; i < vertex.length; i++) {
			const vp = vertex[i].position;
			output.push("\t\t[" + vp.x + " " + vp.y + " " + vp.z + "]" + ((vp === vertex.length - 1) ? "" : ",") );
		}
		output.push("\t]");
		output.push("}");
		return(output.join("\n"));
	}
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class File$2 {

	constructor(pathname) {
		this.pathname = pathname.replace(/\\/g, "/" );
	}

	getAbsolutePath() {
		if(/$http/.test(this.pathname)) {
			return this.pathname;
		}
		let name = window.location.toString();
		if(!(/\/$/.test(name))) {
			name = name.match(/.*\//)[0];
		}
		const namelist = this.pathname.split("/");
		for(let i = 0; i < namelist.length; i++) {
			if((namelist[i] === "") || (namelist[i] === ".")) {
				continue;
			}
			if(namelist[i] === "..") {
				name = name.substring(0 ,name.length - 1).match(/.*\//)[0];
				continue;
			}
			name += namelist[i];
			if(i !== namelist.length - 1) {
				name += "/";
			}
		}
		return name;
	}

	getParent() {
		const x = this.getAbsolutePath().match(/.*\//)[0];
		return(x.substring(0 ,x.length - 1));
	}
}

const S3MeshLoaderMQO = {

	name : "MQO",

	/**
	 * メタセコイア形式で入力
	 * ただしある程度手動で修正しないといけません。
	 * @param {S3Mesh} mesh
	 * @param {String} text
	 * @returns {unresolved}
	 */
	input : function(sys, mesh, text, url) {
		
		let mqofile = null;
		let parent_dir = "./";
		if(url) {
			mqofile = new File$2(url);
			parent_dir = mqofile.getParent() + "/";
		}
		
		const lines = text.split("\n");
		const block_stack = [];
		let block_type  = "none";
		// 半角スペース区切りにの文字列数値を、数値型配列にする
		const toNumberArray = function(text) {
			const x = text.split(" "), out = [];
			for(let i = 0; i < x.length; i++) {
				out[i] = parseFloat(x[i]);
			}
			return out;
		};
		// func(XXX) のXXXの中身を抜き出す
		const getValueFromPrm = function(text, parameter) {
			const x = text.split(" " + parameter + "(");
			if(x.length === 1) {
				return [];
			}
			return x[1].split(")")[0];
		};
		// func(XXX) のXXXの中を抜き出して数値化
		const getNumberFromPrm = function(text, parameter) {
			const value = getValueFromPrm(text, parameter);
			if(value.length === 0) {
				return [];
			}
			return toNumberArray(value);
		};
		// func(XXX) のXXXの中を抜き出して文字列取得
		const getURLFromPrm = function(text, parameter) {
			const value = getValueFromPrm(text, parameter);
			if(value.length === 0) {
				return null;
			}
			const x = value.split("\"");
			if(x.length !== 3) {
				return null;
			}
			return x[1];
		};
		for(let i = 0;i < lines.length; i++) {
			const trim_line = lines[i].replace(/^\s+|\s+$/g, "");
			const first = trim_line.split(" ")[0];
			if ( trim_line.indexOf("{") !== -1) {
				// 階層に入る前の位置を保存
				block_stack.push(block_type);
				block_type = first;
				continue;
			}
			else if( trim_line.indexOf("}") !== -1) {
				block_type = block_stack.pop();
				continue;
			}
			if(	(block_type === "Thumbnail") || 
				(block_type === "none")) {
				continue;
			}
			if(block_type === "Material") {
				const material_name = first.replace(/"/g, "");
				const material = sys.createMaterial();
				material.setName(material_name);
				let val;
				val = getNumberFromPrm(trim_line, "col");
				if(val.length !== 0) {
					material.setColor(new S3Vector(val[0], val[1], val[2], val[3]));
				}
				val = getNumberFromPrm(trim_line, "dif");
				if(val.length !== 0) {
					material.setDiffuse(val[0]);
				}
				val = getNumberFromPrm(trim_line, "amb");
				if(val.length !== 0) {
					material.setAmbient(new S3Vector(val[0], val[0], val[0]));
				}
				val = getNumberFromPrm(trim_line, "amb_col");
				if(val.length !== 0) {
					material.setAmbient(new S3Vector(val[0], val[1], val[2]));
				}
				val = getNumberFromPrm(trim_line, "emi");
				if(val.length !== 0) {
					material.setEmission(new S3Vector(val[0], val[0], val[0]));
				}
				val = getNumberFromPrm(trim_line, "emi_col");
				if(val.length !== 0) {
					material.setEmission(new S3Vector(val[0], val[1], val[2]));
				}
				val = getNumberFromPrm(trim_line, "spc");
				if(val.length !== 0) {
					material.setSpecular(new S3Vector(val[0], val[0], val[0]));
				}
				val = getNumberFromPrm(trim_line, "spc_col");
				if(val.length !== 0) {
					material.setSpecular(new S3Vector(val[0], val[1], val[2]));
				}
				val = getNumberFromPrm(trim_line, "power");
				if(val.length !== 0) {
					material.setPower(val[0]);
				}
				val = getNumberFromPrm(trim_line, "reflect");
				if(val.length !== 0) {
					material.setReflect(val[0]);
				}
				val = getURLFromPrm(trim_line, "tex");
				if(val) {
					material.setTextureColor(parent_dir + val);
				}
				val = getURLFromPrm(trim_line, "bump");
				if(val) {
					material.setTextureNormal(parent_dir + val);
				}
				mesh.addMaterial(material);
			}
			else if(block_type === "vertex") {
				const words = toNumberArray(trim_line);
				const vector = new S3Vector(words[0], words[1], words[2]);
				const vertex = sys.createVertex(vector);
				mesh.addVertex(vertex);
			}
			else if(block_type === "face") {
				const facenum = parseInt(first);
				const v		= getNumberFromPrm(trim_line, "V");
				const uv_a	= getNumberFromPrm(trim_line, "UV");
				const uv		= [];
				let material= getNumberFromPrm(trim_line, "M");
				material = (material.length === 0) ? 0 : material[0];
				if(uv_a.length !== 0) {
					for(let j = 0; j < facenum; j++) {
						uv[j] = new S3Vector( uv_a[j * 2], uv_a[j * 2 + 1], 0);
					}
				}
				for(let j = 0;j < facenum - 2; j++) {
					const ti = ((j % 2) === 0) ? 
						sys.createTriangleIndex(j    , j + 1, j + 2, v, material, uv)
						:sys.createTriangleIndex(j - 1, j + 1, j + 2, v, material, uv);
					mesh.addTriangleIndex(ti);
				}
			}
		}
		return true;
	},

	/**
	 * メタセコイア形式で出力
	 * ただしある程度手動で修正しないといけません。
	 * @param {S3Mesh} mesh
	 * @returns {String}
	 */
	output : function(mesh) {
		const output = [];
		const vertex			= mesh.getVertexArray(); 
		const triangleindex	= mesh.getTriangleIndexArray(); 
		const material		= mesh.getMaterialArray();
		
		// 材質の出力
		output.push("Material " + material.length + " {");
		for(let i = 0; i < material.length; i++) {
			const mv = material[i];
			//  こんな感じにする必要がある・・・
			// "mat" shader(3) col(1.000 1.000 1.000 0.138) dif(0.213) amb(0.884) emi(0.301) spc(0.141) power(38.75) amb_col(1.000 0.996 0.000) emi_col(1.000 0.000 0.016) spc_col(0.090 0.000 1.000) reflect(0.338) refract(2.450)
			output.push("\t\"" + mv.name + "\" col(1.000 1.000 1.000 1.000) dif(0.800) amb(0.600) emi(0.000) spc(0.000) power(5.00)");
		}
		output.push("}");
		
		// オブジェクトの出力
		output.push("Object \"obj1\" {");
		{
			// 頂点の出力
			output.push("\tvertex " + vertex.length + " {");
			for(let i = 0; i < vertex.length; i++) {
				const vp = vertex[i].position;
				output.push("\t\t" + vp.x + " " + vp.y + " " + vp.z);
			}
			output.push("}");

			// 面の定義
			output.push("\tface " + triangleindex.length + " {");
			for(let i = 0; i < triangleindex.length; i++) {
				const ti = triangleindex[i];
				let line = "\t\t3";
				// 座標と材質は必ずある
				line += " V(" + ti.index[0] + " " + ti.index[1] + " " + ti.index[2] + ")";
				line += " M(" + ti.materialIndex + ")";
				// UVはないかもしれないので、条件を付ける
				if((ti.uv !== undefined) && (ti.uv[0] !== null)) {
					line += " UV(" + ti.uv[0] + " " + ti.uv[1] + " " + ti.uv[2] +")";
				}
				output.push(line);
			}
		}
		output.push("\t}");
		
		output.push("}");
		return output.join("\n");
	}

};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const S3MeshLoaderOBJ = {

	name : "OBJ",

	/**
	 * Wavefront OBJ形式で入力
	 * v 頂点
	 * vt テクスチャ
	 * vn テクスチャ 
	 * f 面
	 * @param {S3Mesh} mesh
	 * @param {String} text
	 * @returns {unresolved}
	 */
	input : function(sys, mesh, text, url) {
		
		const trim = function(str) {
			return(str.replace(/^\s+|\s+$/g, ""));
		};
		
		// 文字列解析
		const lines = text.split("\n");
		const v_list = [];
		const face_v_list = [];
		for(let i = 0; i < lines.length; i++) {
			// コメントより前の文字を取得
			const line = trim(lines[i].split("#")[0]);
			
			if(line.length === 0) {
				// 空白なら何もしない
				continue;
			}
			
			const data = line.split(" ");
			if(data[0] === "v") {
				// vertex
				const v = new S3Vector(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
				v_list.push(v);
			}
			else if(data[1] === "vt") {
				// texture
				const vt = new S3Vector(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
				
			}
			else if(data[2] === "vn") {
				// normal
				const vn = new S3Vector(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
			}
			else if(data[0] === "f") {
				// face
				const vcount = data.length - 3; // 繰り返す回数
				for(let j = 0;j < vcount; j++) {
					const fdata = [];
					if((j % 2) === 0) {
						fdata[0] = data[1 + j];
						fdata[1] = data[1 + j + 1];
						fdata[2] = data[1 + j + 2];
					}
					else {
						fdata[0] = data[1 + j];
						fdata[1] = data[1 + j + 1];
						fdata[2] = data[1 + j + 2];
					}
					const face_v = [];
					const face_vt = [];
					const face_vn = [];
					// 数字は1から始まるので、1を引く
					for(let k = 0;k < 3; k++) {
						const indexdata = fdata[k].split("/");
						if(indexdata.length === 1) {
							// 頂点インデックス
							face_v[k]	= parseInt(indexdata[0], 10) - 1;
						}
						else if(indexdata.length === 2) {
							// 頂点テクスチャ座標インデックス
							face_v[k]	= parseInt(indexdata[0], 10) - 1;
							face_vt[k]	= parseInt(indexdata[1], 10) - 1;
						}
						else if(indexdata.length === 3) {
							if(indexdata[1].length !== 0) {
								// 頂点法線インデックス
								face_v[k]	= parseInt(indexdata[0], 10) - 1;
								face_vt[k]	= parseInt(indexdata[1], 10) - 1;
								face_vn[k]	= parseInt(indexdata[2], 10) - 1;
							}
							else {
								// テクスチャ座標インデックス無しの頂点法線インデックス
								face_v[k]	= parseInt(indexdata[0], 10) - 1;
								face_vt[k]	= null;
								face_vn[k]	= parseInt(indexdata[2], 10) - 1;
							}
						}
					}
					face_v_list.push(face_v);
				}
			}
		}
		
		// 変換
		// マテリアルの保存
		const material = sys.createMaterial();
		mesh.addMaterial(material);
		// 頂点の保存
		for(let i = 0; i < v_list.length; i++) {
			const vertex = sys.createVertex(v_list[i]);
			mesh.addVertex(vertex);
		}
		// インデックスの保存
		for(let i = 0; i < face_v_list.length; i++) {
			const triangle = sys.createTriangleIndex(0, 1, 2, face_v_list[i], 0);
			mesh.addTriangleIndex(triangle);
		}
		
		return true;
	}
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const S3MeshLoader = {

	// 他のファイルの読み書きの拡張用
	inputData: function(s3system, data, type) {
		const s3mesh = s3system.createMesh();
		const load = function(ldata, ltype, url) {
			s3mesh._init();
			const isLoad = S3MeshLoader._DATA_INPUT_FUNCTION[ltype](s3system, s3mesh, ldata, url);
			s3mesh.setComplete(isLoad);
		};
		if(((typeof data === "string")||(data instanceof String))&&((data.indexOf("\n") === -1))) {
			// 1行の場合はURLとみなす（雑）
			const downloadCallback = function(text) {
				load(text, type, data);
			};
			s3system._download(data, downloadCallback);
		}
		else {
			load(data, type, "");
		}
		return s3mesh;
	},
	
	outputData: function(s3mesh, type) {
		return S3MeshLoader._DATA_OUTPUT_FUNCTION[type](s3mesh);
	}

};

S3MeshLoader.TYPE = {
	JSON : S3MeshLoaderJSON.name,
	MQO : S3MeshLoaderMQO.name,
	OBJ : S3MeshLoaderOBJ.name
};

S3MeshLoader._DATA_INPUT_FUNCTION	= {};
S3MeshLoader._DATA_OUTPUT_FUNCTION	= {};
S3MeshLoader._DATA_OUTPUT_FUNCTION[S3MeshLoaderJSON.name] = S3MeshLoaderJSON.output;
S3MeshLoader._DATA_INPUT_FUNCTION[S3MeshLoaderJSON.name] = S3MeshLoaderJSON.input;
S3MeshLoader._DATA_OUTPUT_FUNCTION[S3MeshLoaderMQO.name] = S3MeshLoaderMQO.output;
S3MeshLoader._DATA_INPUT_FUNCTION[S3MeshLoaderMQO.name] = S3MeshLoaderMQO.input;
S3MeshLoader._DATA_INPUT_FUNCTION[S3MeshLoaderOBJ.name] = S3MeshLoaderOBJ.input;

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3Plane {
    
	/**
     * 面を作成する。
     * @param {S3Vector} n 面の法線
     * @param {Number|S3Vector} d 原点からの距離 | 面の中のある点
     */
	constructor(n , d) {
		if(d instanceof S3Vector) {
			this.n = n;
			this.d = this.n.dot(d);
		}
		else {
			this.n = n;
			this.d = d;
		}
	}
	
	/**
	 * 任意の点から平面への距離を求めます。
	 * @param {S3Vector} position
	 * @return {Number}
	 */
	getDistance(position) {
		return (position.dot(this.n) - this.d);
	}

	/**
	 * 任意の点から一番近い平面上の点を求めます。
	 * @param {S3Vector} position
	 * @return {S3Vector}
	 */
	getNearestPoint(position) {
		return this.n.mul(- this.getDistance(position)).add(position);
	}

	/**
	 * 面の内側にあるかどうか判定する
	 * @param {S3Vector} position
	 * @return {Boolean}
	 */
	isHitPosition(position) {
		return this.getDistance(position) < 0;
	}

	/**
	 * 文字列に変換します。
	 */
	toString() {
		return "Plane("+ this.n.toString() +", ["+this.d+"])";
	}


    
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class CameraController {

	constructor() {
		this.mouse		= new Device.Touch();
		this.moveDistance	= 4.0;
		this.moveRotate		= 0.5;
		this.moveTranslateRelative	= 0.1;
	}

	setCanvas(element) {
		this.mouse.setListenerOnElement(element);
	}

	setCamera(camera) {
		this.camera = camera.clone();
	}

	getCamera() {
		const data = new Device.Touch();
		this.mouse.pickInput(data);
		{
			this.camera.translateRelative(
				new S3Vector(
					- data.left.dragged.x * this.moveTranslateRelative,
					data.left.dragged.y * this.moveTranslateRelative,
					0
				)
			);
		}
		{
			this.camera.addRotateY(   data.right.dragged.x * this.moveRotate );
			this.camera.addRotateX( - data.right.dragged.y * this.moveRotate );
		}
		{
			let distance = this.camera.getDistance();
			const l = data.wheelrotation;
			distance -= l * this.moveDistance * Math.log(distance);
			this.camera.setDistance(distance);
		}
		return this.camera;
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const S3 = {
	
	System : S3System,
	GLSystem : S3GLSystem,
	Math : S3Math,
	Angles : S3Angles,
	Vector : S3Vector,
	Matrix : S3Matrix,
	Plane : S3Plane,

	SYSTEM_MODE : S3System.SYSTEM_MODE,
	DEPTH_MODE : S3System.DEPTH_MODE,
	DIMENSION_MODE : S3System.DIMENSION_MODE,
	VECTOR_MODE : S3System.VECTOR_MODE,
	FRONT_FACE : S3System.FRONT_FACE,
	CULL_MODE : S3System.CULL_MODE,
	LIGHT_MODE : S3Light.MODE,
	MESH_TYPE : S3MeshLoader.TYPE,
	
	MeshLoader : S3MeshLoader,
	CameraController : CameraController,
	
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const Senko = {

	_toString: function(text_obj) {
		let text;
		if((typeof text_obj === "string")||(text_obj instanceof String)) {
			if(text_obj.length === 0) {
				// Edge だと console.log("") でエラー表示になるため
				text = " ";
			}
			else {
				text = text_obj;
			}
		}
		else if(typeof text_obj === "undefined") {
			text = typeof text_obj;
		}
		else if(text_obj === null) {
			text = text_obj;
		}
		else if(typeof text_obj.toString === "function") {
			text = text_obj.toString();
		}
		return text;
	},

	println: function(text_obj) {
		const out = console;
		const text = Senko._printbuffer + Senko._toString(text_obj);
		Senko._printbuffer = "";
		out.log(text);
	},
	
	print: function(text_obj) {
		Senko._printbuffer += Senko._toString(text_obj);
	},
	
	printf: function() {
		const x = [];
		for(let i = 0 ; i < arguments.length ; i++) {
			x[i] = arguments[i];
		}
		Senko.print(Text$1.format.apply(this, x));
	}
};

Senko._printbuffer = "";
Senko.ArrayList = ArrayList;
Senko.Color = Color;
Senko.File = File$1;
Senko.HashMap = HashMap;
Senko.Text = Text$1;
Senko.Device = Device;
Senko.ImageProcessing = ImageProcessing;
Senko.SComponent = SComponent;
Senko.BigDecimal = BigDecimal;
Senko.BigInteger = BigInteger;
Senko.Random = Random;
Senko.S3 = S3;

export default Senko;
