var settings = {};
var directions = {
    'rtl': {
        x: window.innerWidth,
        y: 0,
        dx: -1,
        dy: 0
    },
    'ltr': {
        x: 0,
        y: 0,
        dx: 1,
        dy: -1
    },
    'td': {
        x: 0,
        y: 0,
        dx: 0,
        dy: 1
    },
    'dt': {
        x: 0,
        y: window.innerHeight,
        dx: 0,
        dy: -1
    }
};

var model = {};
(function() {
    this.createSmoke = function(transition) {
        var trX = (typeof transition.x != 'undefined') ? transition.x : 0,
            trY = (typeof transition.y != 'undefined') ? transition.y : 0;
        var startX = directions[settings.direction].x + trX,
            startY = directions[settings.direction].y + trY;
        var randomSide = _randomInt(this.startW[0], this.startW[1]); //Сторона при инициализации
        var randomRotate = _randomInt(0, 90); //Поворот при инициализации 
        var smoke = new Smoke(randomSide, randomSide, startX, startY, randomRotate);
    };
    this.startW = [100, 300];
    this.smokeElements = [];
    this.animate = function(spd) {
        var speed = (typeof spd != "undefined") ? spd : 10;
        for (var i = 0; i < this.smokeElements.length; i += 1) {
            var deltaSide = _randomInt(1, 2) / speed; //Скорость увеличения или уменьшения текстуры за один шаг анимации
            var deltaX = (_randomInt(1, 2) / speed) * directions[settings.direction].dx; // Скорость движения вправо(+) или влево (-) за один шаг анимации
            var deltaY = (_randomInt(1, 2) / speed) * directions[settings.direction].dy; // Скорость движения вверх(-) или вниз (+) за один шаг анимации
            var deltaRotate = _randomInt(1, 2) / 80 //Скорость вращения за один шаг анимации;
            this.smokeElements[i].params.width += deltaSide;
            this.smokeElements[i].params.height += deltaSide;
            this.smokeElements[i].params.posX += deltaX;
            this.smokeElements[i].params.posY += deltaY;
            this.smokeElements[i].params.rotate += deltaRotate;
            if (this.smokeElements[i].params.posX > window.innerWidth - this.smokeElements[i].params.startW || this.smokeElements[i].params.posY > window.innerHeight - this.smokeElements[i].params.startH) {

                transition = {
                    x: window.innerWidth / this.smokeElements.length * i,
                    y: window.innerHeight / this.smokeElements.length * i
                };
                var trX = (typeof transition.x != 'undefined') ? transition.x : 0,
                    trY = (typeof transition.y != 'undefined') ? transition.y : 0;
                var startX = directions[settings.direction].x + trX,
                    startY = directions[settings.direction].y + trY;

                this.smokeElements[i].params.width = this.smokeElements[i].params.startW;
                this.smokeElements[i].params.height = this.smokeElements[i].params.startH;
                this.smokeElements[i].params.posX = startX;
                this.smokeElements[i].params.posY = startY;
                this.smokeElements[i].params.rotate = _randomInt(0, 90);
            };
        };
    };
    var self = this;

    var Smoke = function(width, height, posX, posY, rotate) {
        var smoke = {};
        (function() {
            this.params = {
                width: width,
                height: height,
                posX: posX,
                posY: posY,
                rotate: rotate,
                startW: width,
                startH: height
            };
        }).call(smoke);
        self.smokeElements.push(smoke);
        return smoke;
    };

    var _randomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

}).call(model);
