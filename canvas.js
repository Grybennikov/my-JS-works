var layers = {},
	canvas = {};

(function() {
	this.init = function(obj, height, width) {
		document.getElementById("canvas_container").style.height = height + "px" || '100%';
		document.getElementById("canvas_container").style.width = (width || height) + "px" || '100%';
		this.obj = obj;
		this.createLayer("default").changeLayer("default");
	};

	this.changeLayer = function(layer) {
		if (typeof this.obj.context !== "undefined") {
			this.old_context = this.obj.context;
		}
		this.obj.context = layers[layer];
		return this;
	};

	this.restoreLayer = function() {
		this.obj.context = this.old_context;
		return this;
	};

	this.workOn = function(layer, callback) {
		layers.changeLayer(layer);
		callback();
		layers.restoreLayer();
		return this;
	};

	this.createLayer = function(name, webgl) {
		var graph = webgl ? "WebGL" : "2d",
			container = document.getElementById("canvas_container"),
			new_layer = document.createElement("canvas"),
			i = 0,
			layers;
		new_layer.setAttribute("id", name);
		new_layer.setAttribute("width", container.offsetWidth);
		new_layer.setAttribute("height", container.offsetHeight);
		container.appendChild(new_layer);
		this[name] = document.getElementById(name).getContext(graph);
		layers = document.getElementsByTagName("canvas");
		for (; i < layers.length; i += 1) {
			layers[i].style.zIndex = i;
		}
		return this;
	}

}).call(layers);

(function() {

	var self = this;

	this.init = function(height, width) {
		layers.init(this, height, width);
		this.width = width;
		this.height = height;
		return this;
	};

	//CASH CODE
	this.cache = [];

	this.draw = function(vertices, params, start) {
		if (!(vertices[0] instanceof Array) && vertices.length === 2 && typeof params.src === "string") {
			self.context.imageSmoothingEnabled = false;
			drawImage(vertices[0], vertices[1], params);
		} else if (typeof vertices === "string") {
			setContextParams(params);
			shapes[vertices](params, start);
			fillAndStroke(params);
		} else {
			getOutline(vertices, start);
			setContextParams(params);
			fillAndStroke(params);
		}
		this.cache.add(vertices, params, start);
		return this;
	};

	this.clearLayer = function(layer) {
		layers.workOn(layer, function() {
			self.context.clearRect(0, 0, self.width, self.height);
		});
		return this;
	}


	//PRIVAT METHODS-------------------
	var cache = [];
	var filterSrc = function(str) {
		var from = str.search('img'),
			to = str.length;
		return str.substring(from, to);
	}
	var drawImage = function(x, y, params) {
		var i = 0;
		rightContext = self.context;
		for (; i < cache.length; i += 1) {
			if (filterSrc(params.src) === filterSrc(cache[i].src)) {
				var img = cache[i];
				rightContext.drawImage(img, x, y, params.width, params.height);
			}
		}
		if (typeof img === "undefined") {
			var img = new Image();
			img.src = params.src;
			cache.push(img);
			img.onload = function() {
				rightContext.drawImage(img, x, y, params.width, params.height);
			}
		}
	}
	var getOutline = function(coords, start) {
		var c = self.context,
			i = 0;
		c.beginPath();
		if (start) {
			c.moveTo(start[0], start[1]);
		}
		for (; i < coords.length; i += 1) {
			c.lineTo(coords[i][0], coords[i][1]);
		}
		c.closePath();
	};
	var setContextParams = function(package) {
		if (typeof package !== "object") return;
		self.context.save();
		self.context.fillStyle = package.color || null;
		self.context.lineWidth = package.strokeWidth || 1;
		self.context.strokeStyle = package.strokeColor || "black";
	};

	var fillAndStroke = function(params) {
		if (typeof params === "object" && 'color' in params) self.context.fill();
		self.context.stroke();
		return this;
	};

	var shapes = {
		rect: function(params, start) {
			var width = params.width,
				height = params.height,
				startX = start ? start[0] : 0,
				startY = start ? start[1] : 0;
			self.context.beginPath();
			self.context.moveTo(startX, startY);
			self.context.lineTo(startX + width, startY);
			self.context.lineTo(startX + width, startY + height);
			self.context.lineTo(startX, startY + height);
			self.context.lineTo(startX, startY);
			self.context.closePath();
		},
		triangle: function(params, start) {
			var size = params.size;
			startX = start ? start[0] : 0,
			startY = start ? start[1] : 0;
			self.context.beginPath();
			self.context.moveTo(startX, startY);
			self.context.lineTo();
			self.context.closePath();
		},
		circle: function(params, start) {
			var radius = params.radius,
				startX = start ? start[0] : 0,
				startY = start ? start[1] : 0;
			self.context.beginPath();
			self.context.arc(startX, startY, radius, 0, 2 * Math.PI, true);
			self.context.closePath();
		}
	}
}).call(canvas);

(function() {
	this.add = function(vertices, params, start) {
		if (this.length >= 10) {
			this.splice(0, 1);
		}
		this.push([vertices, params, start]);
		return this;
	}
	this.delete = function(index) {
		this.splice(index, 1);
	}
	this.get = function(index) {
		var vertices,
			params,
			start,
			ind,
			i = 0;
		if (typeof index === "undefined") {
			for (; i < this.length; i += 1) {
				ind = i;
			}
		} else {
			if (index > this.length - 1) throw new Error("In cache only " + this.length + " elements, but you try to get " +
				(index + 1) + " element!");
			ind = index;
		}
		vertices = this[ind][0];
		params = this[ind][1];
		start = this[ind][2];
		return [vertices, params, start];
	}
}).call(canvas.cache);