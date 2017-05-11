"use strict";

// init
const width = 480, height = 320;
const clr = Math.random() * 360,
      radius = 10 + 20 * Math.random();
var oldX, oldY,
    dragX, dragY,
    objects = {};
var socket = io.connect('/24');

var canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = height;
//Create a stage by getting a reference to the canvas
var stage = new createjs.Stage(canvas);
stage.enableDOMEvents(true);

var label = new createjs.Text("Your circle is in top left corner. Drag it.",
                              "12px Sans-serif");
stage.addChild(label);

socket.on('init', function(items) {
    for(let key in items) {
        makeCircle(items[key]);
    }
});

var circle = new createjs.Shape();
var color = createjs.Graphics.getHSL(clr, 100, 50);
circle.graphics.beginFill(color).drawCircle(0, 0, radius);
circle.alpha = 0.3;
circle.radius = radius;
//Set position of Shape instance:
circle.x = 0;
circle.y = 0;

socket.emit('newitem', {radius: radius, color: clr, x: circle.x, y: circle.y});

circle.handleTick = function() {
    this.x = dragX;
    this.y = dragY;
    // this.dx = (this.x - oldX);
    // this.dy = (this.y - oldY);
    // oldX = this.x;
    // oldY = this.y;
};

circle.on("pressmove", dragObject);
function dragObject(event) {
    dragX = event.stageX;
    dragY = event.stageY;
    socket.emit('moveto', {x: dragX, y: dragY});
}

stage.addChild(circle);

socket.on('newitem', function(item) {
    // console.log(item);
    makeCircle(item);
});

socket.on('moveto', function(point) {
    // console.log(point);
    objects[point.id].x = point.x;
    objects[point.id].y = point.y;
});

socket.on('delete', function(id) {
    stage.removeChild(objects[id]);
    stage.update();
    delete objects[id];
});

//Update stage will render next frame
createjs.Ticker.setFPS(50);
createjs.Ticker.addEventListener("tick", handleTick);
function handleTick() {
    // for(var key in objects) { objects[key].handleTick(); }
    circle.handleTick();
    stage.update();
}

function makeCircle(item) {
    // oldX = event.stageX;
    // oldY = event.stageY;
    // dragX = event.stageX;
    // dragY = event.stageY;
    let circle = new createjs.Shape();
    let color = createjs.Graphics.getHSL(item.color, 100, 50);
    circle.graphics.beginFill(color).drawCircle(0, 0, item.radius);
    circle.alpha = 0.3;
    circle.radius = item.radius;
    //Set position of Shape instance:
    circle.x = item.x;
    circle.y = item.y;
    // circle.nowDragging = false;

    stage.addChild(circle);
    objects[item.id] = circle;
}
