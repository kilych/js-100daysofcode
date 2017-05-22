var width = window.innerWidth,
    height = window.innerHeight,
    scaleX = width/100,
    scaleY = height/100,
    scale = (scaleX + scaleY)/2,
    moveTime = 300 * scale,     // milliseconds
    fps = Math.floor(1000/moveTime);
var initX = width * 0.2,
    initY = height * 0.3;
var pointX = initX;
var pointY = initY;
var dX = 0;
var dY = 0;
var ddY = 0.01;
const alpha = 0.1,
      clr = Math.random() * 360,
      radius = (1 + 2 * Math.random()) * scale,
      defaultboard = 'eg32r';
var objects = {};
var socket = io.connect('/36');
var canvas;
var stage;
var tweens = [];
var activeCount;
var circleCount = 25;
var text;

canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = height;
stage = new createjs.Stage(canvas);
stage.enableDOMEvents(true);
stage.enableMouseOver(10);
createjs.Touch.enable(stage);

var board = prompt("Enter code of a board you want to connect.\n" +
                   "If CANCEL or the board doesn't exist new board will be created.",
                   defaultboard);

var line = new createjs.Shape();
line.graphics.setStrokeStyle(3)
             .beginStroke('#FFF')
             .moveTo(width/2, height * 0.6)
             .lineTo(width/2, height)
             .endStroke();
stage.addChild(line);

// load the source image:
var image = new Image();
image.src = '/35/ball.png';
// image.src = "https://cdn4.iconfinder.com/data/icons/ball-sports-1/28/soccer-ball-128.png";
// image.width = 20 * scale;
// image.height = 20 * scale;
image.onload = function(event) {
    var image = event.target;
    var bitmap = new createjs.Bitmap(image);
    bitmap.x = (width - image.width)/2;
    bitmap.y = (height - image.height)/2;
    stage.addChild(bitmap);
};


for (var i = 0; i < circleCount; i++) {
    // draw the circle, and put it on stage:
    var color = createjs.Graphics.getHSL(clr, 100, 50);
    var circle = new createjs.Shape();
    circle.graphics.beginFill(color).drawCircle(0, 0, radius);
    circle.radius = radius;
    circle.alpha = alpha * (1 - i * 0.02);
    circle.x = Math.random() * width;
    circle.y = Math.random() * height;
    circle.compositeOperation = "lighter";

    var tween = createjs.Tween.get(circle).to({x: initX, y: initY}, (0.5 + i * 0.04) * moveTime, createjs.Ease.linear).call(tweenComplete);
    // tweens.push({tween: tween, ref: circle});
    tweens.push(circle);
    stage.addChild(circle);
}

activeCount = circleCount;

function makeCircle(item) {
    var tweens = [];
    for (var i = 0; i < circleCount; i++) {
        var circle = new createjs.Shape();
        var color = createjs.Graphics.getHSL(item.color, 100, 50);
        circle.graphics.beginFill(color).drawCircle(0, 0, item.radius * scale);
        // circle.alpha = alpha;
        circle.alpha = alpha * (1 - i * 0.02);
        circle.radius = item.radius * scale;
        // Set position of Shape instance:
        circle.x = item.x * scaleX;
        circle.y = item.y * scaleY;
        circle.compositeOperation = "lighter";

        tweens.push(circle);
        stage.addChild(circle);
    }
    objects[item.id] = tweens;
}

stage.addEventListener("stagemouseup", handleMouse);

createjs.Ticker.setFPS(fps);
createjs.Ticker.addEventListener("tick", tick);

function handleMouse(event) {
	  // if (text) { stage.removeChild(text); text = null; }
    dX = (stage.mouseX/scaleX - pointX)/100;
    dY = (stage.mouseY/scaleY - pointY)/100;
}

function tweenComplete() { activeCount--; }

function tick() {
	  // if (activeCount) {
    if (0 > pointX) { dX = -dX; pointX = radius; }
    if (100 < pointX) { dX = -dX; pointX = 100 - radius; }
    if (0 > pointY) { dY = -dX; pointY = radius; }
    if (100 < pointY) { dY = -dX; pointY = 100 - radius; }
    pointX += dX;
    pointY += dY;
    dY += ddY;
    moveTo(tweens, pointX, pointY);
	  activeCount = circleCount;
    socket.emit('moveto', {x: pointX, y: pointY});
		stage.update();
	  // }
}

function moveTo(tweens, pointX, pointY) {
    for (var i = 0; i < circleCount; i++) {
        var item = tweens[i];
		    createjs.Tween.get(item, {override: true})
            .to({x: pointX * scaleX, y: pointY * scaleY},
                (1 + i * 0.01) * moveTime, createjs.Ease.linear)
        // .call(function() { item.x = pointX * scaleX; itemY = point.y * scaleY; })
        // .call(tweenComplete)
        ;
    }
}

socket.emit('chooseboard', board);

socket.on('init', function(items) {
    board = items.board;
    delete items.board;
    for (var key in items) { makeCircle(items[key]); }

    text = new createjs.Text("Tap or click anywhere to move your circle.\n" +
                             "Board code: " + board,
                             Math.floor(width/30) + "px Sans-serif", // "px Arial"
                             "#777");
    text.x = width/10;
    text.y = height/10;
    stage.addChild(text);
});

socket.emit('newitem', {radius: radius/scale, color: clr, x: initX/scaleX, y: initY/scaleY});

socket.on('newitem', makeCircle);

socket.on('moveto', function(point) {
    moveTo(objects[point.id], point.x, point.y);
});

socket.on('delete', function(id) {
	  for (var i = 0; i < circleCount; i++) { stage.removeChild(objects[id][i]); }
    stage.update();
    delete objects[id];
});
