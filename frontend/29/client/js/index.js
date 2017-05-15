//
// TODO: make tail of circle when it move via multiple tween
// decreased alpha circles.
// See: http://createjs.com/demos/tweenjs/tween_circles
//

"use strict";

// init
// const width = 480, height = 320;
var width = window.innerWidth,
    height = window.innerHeight;
const alpha = 0.3,
      clr = Math.random() * 360,
      radius = 10 + 20 * Math.random(),
      // in milliseconds:
      getInvisibilityTime = 100,
      moveTime = 300;
var objects = {};
var socket = io.connect('/29');

var canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = height;
// canvas.style.width = window.innerWidth + "px";
// canvas.style.height = window.innerHeight + "px";
//Create a stage by getting a reference to the canvas
var stage = new createjs.Stage(canvas);
stage.enableDOMEvents(true);
// stage.enableMouseOver(10);
createjs.Touch.enable(stage);

var text = new createjs.Text("Your circle is in center.\n"
                             + "Click inside border to move it."
                             // ,"18px Arial"
                             ,"18px Sans-serif"
                             ,"#777");
text.x = width/10;
text.y = height/10;
stage.addChild(text);

socket.on('init', function(items) {
    for (let key in items) {
        makeCircle(items[key]);
    }
});

var circle = new createjs.Shape();
var color = createjs.Graphics.getHSL(clr, 100, 50);
circle.graphics.beginFill(color).drawCircle(0, 0, radius);
circle.alpha = alpha;
circle.radius = radius;
// Set position of Shape instance:
circle.x = width/2;
circle.y = height/2;

socket.emit('newitem', {radius: radius, color: clr, x: circle.x, y: circle.y});

// circle.handleTick = function() {
//     this.x = dragX;
//     this.y = dragY;
// };

stage.addChild(circle);

// socket.on('newitem', function(item) { makeCircle(item); });
socket.on('newitem', makeCircle);

addEventListener("mouseup", function(event) {
    // if (0 < event.x && event.x < width && 0 < event.y && event.y < height) {
        createjs.Tween.get(circle, {loop: false})
            .to({ alpha: 0 }, getInvisibilityTime)
            .to({ alpha: alpha, x: event.x, y: event.y},
                moveTime,
                // ((circle.y - event.y) * (circle.x - event.x)) * 0.001,
                createjs.Ease.Linear);
        socket.emit('moveto', {x: event.x, y: event.y});
    // }
});

// Update stage will render next frame
createjs.Ticker.setFPS(50);
createjs.Ticker.addEventListener("tick", stage);

socket.on('moveto', function(point) {
    let item = objects[point.id];
    createjs.Tween.get(item, { loop: false })
        .to({ alpha: 0 }, getInvisibilityTime)
        .to({ alpha: alpha, x: point.x, y: point.y }, moveTime, createjs.Ease.linear)
        .call(function() {
            item.x = point.x;
            item.y = point.y;
        });
});

socket.on('delete', function(id) {
    stage.removeChild(objects[id]);
    stage.update();
    delete objects[id];
});

function makeCircle(item) {
    let circle = new createjs.Shape();
    let color = createjs.Graphics.getHSL(item.color, 100, 50);
    circle.graphics.beginFill(color).drawCircle(0, 0, item.radius);
    circle.alpha = 0.3;
    circle.radius = item.radius;
    // Set position of Shape instance:
    circle.x = item.x;
    circle.y = item.y;

    stage.addChild(circle);
    objects[item.id] = circle;
}
