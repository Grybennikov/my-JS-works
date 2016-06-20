var view = {};
(function() {
    layers.init();
    this.render = function(elementsParams){
    	ctx.clear();
    	for(var i = 0; i < elementsParams.length; i += 1){
    		drawSmokeElement(elementsParams[i].params);
    	}
    };
    var self = this;

    this.smokePic = new Image();
    this.smokePic.src = 'img/smoke-element-4.png';

    this.ctx = layers.createLayer("smoke");

    var ctx = this.ctx;

    var drawSmokeElement = function(params) {
        ctx.translate(params.posX, params.posY);
        _rotate(params.rotate);
        drawImage(params);
        _rotate(-params.rotate);
        ctx.translate(-params.posX, -params.posY);
    };
    var drawImage = function(params){
    	self.ctx.drawImage(self.smokePic, params.posX, params.posY, params.width, params.height);
    };

    var _rotate = function(rad) {
        ctx.rotate(_inRad(rad));
    };

    var _inRad = function(num) {
        return num * Math.PI / 180;
    };

}).call(view);
