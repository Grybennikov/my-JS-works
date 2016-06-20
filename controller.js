var controller = {};
(function() {
    var draw = function() {
        model.animate(self.speed);
        view.render(model.smokeElements);
        requestAnimationFrame(draw);
    };
    var createSmokeElements = function(counts) {
        var i = 0;
        var transition;
        for (; i < counts; i += 1) {
            transition = {
                x: window.innerWidth / counts * i,
                y: window.innerHeight / counts * i
            };
            model.createSmoke(transition);
        }
    };
    var self = this;
    this.init = function(counts, speed, dir) {
        settings.direction = dir;
        this.speed = speed;
        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        window.requestAnimationFrame = requestAnimationFrame;
        createSmokeElements(counts);
        draw();
    };
}).call(controller);
controller.init(100, 2, 'ltr');
