Object.defineProperty(Object.prototype, 'iterator', {
	enumerable: false,
	configurable: false,
	writable: false,
	value: function() {
		var ImprovedArray = function() {};
		ImprovedArray.prototype.key = function(newKey) {
			if(typeof newKey !== "undefined" && typeof newKey === "string"){
				this[0] = newKey;
			}
			return this[0];
		}
		ImprovedArray.prototype.value = function(newValue) {
			if(typeof newValue !== "undefined"){
				this[1] = newValue;
			}
			return this[1];
		}
		var j = 0,
			arr = [];
		for (i in this) {
			if (typeof data[i] !== "function") {
				arr[j] = new ImprovedArray;
				arr[j][0] = i;
				arr[j][1] = this[i];
			}
			arr.len = j;
			j += 1;
		}
		var current = 0;
		this.next = function() {
			if (current === arr.len - 1) {
				throw new Error("Sorry, but this element is last!");
			}
			return arr[current += 1];
		}
		this.prev = function() {
			if (current === 0) {
				throw new Error("Sorry, but this element is first!");
				return null;
			}
			return arr[current -= 1];
		}
		this.current = function() {
			return arr[current];
		}
		this.change = function(num) {
			if (num >= 0 && num < arr.len) {
				current = num;
				return arr[current];
			} else {
				throw new Error("Sorry, but this element doesn't exist!");
			}
		}
		this.reset = function() {
			return this.change(0);
		}
		this.isLast = function() {
			return current === arr.len - 1;
		};
		this.isFirst = function() {
			return current === 0;
		};
		this.forEach = function(callback) {
			var i = 0;
			for (; i < arr.len; i += 1) {
				callback.apply(arr[i]);
			}
			return this;
		};
		return this;
	}
});
var data = {
	"fff" : 55,
	"ff" : 2
}
data.iterator();