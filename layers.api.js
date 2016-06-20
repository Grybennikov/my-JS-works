var layers = {};
(function() {
    this.init = function(container, height, width) {
        this.container = typeof(container == 'undefined') ? document.body : container;
        this.container.style.height = height + "px" || '100%';
        this.container.style.width = (width || height) + "px" || '100%';
        this.width = typeof(width == 'undefined') ? this.container.offsetWidth : width;
        this.height = typeof(height == 'undefined') ? this.container.offsetHeight : height;
    };

    var self = this;

    this.createLayer = function(name, webgl) {
        var graph = webgl ? "WebGL" : "2d",
            new_layer = document.createElement("canvas"),
            i = 0,
            layers;
        new_layer.setAttribute("id", name);
        new_layer.setAttribute("width", this.container.offsetWidth);
        new_layer.setAttribute("height", this.container.offsetHeight);

        this.container.appendChild(new_layer);
        this[name] = document.getElementById(name).getContext(graph);
        this[name].clear = function() { 
            this.clearRect(0, 0, self.width, self.height);
            return this;
        };
        layers = document.getElementsByTagName("canvas");
        for (; i < layers.length; i += 1) {
            layers[i].style.zIndex = i;
        }
        return this[name];
    };
}).call(layers);
