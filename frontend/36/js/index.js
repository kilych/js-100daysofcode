var width = window.innerWidth,
    height = window.innerHeight,
    scaleX = width/100,
    scaleY = height/100,
    scale = (scaleX > scaleY) ? scaleX : scaleY,
    moveTime = 20,     // milliseconds
    fps = Math.floor(1000/moveTime);
var ddY = 0.01;
const alpha = 0.1,
      defaultboard = 'eg32r';
var objects = {};
var socket = io.connect('/36');
var activeCount;
var circleCount = 25;
var text;

var canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = height;
var stage = new createjs.Stage(canvas);
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
// image.width = 20 * scale;
// image.height = 20 * scale;
image.onload = function(event) {
    var image = event.target;
    var bitmap = new createjs.Bitmap(image);
    bitmap.x = (width - image.width)/2;
    bitmap.y = (height - image.height)/2;
    stage.addChild(bitmap);
};

var circle = {
    color: Math.random() * 360,
    radius: (1 + 2 * Math.random()) * scale,
    x: width * 0.2,
    y: height * 0.3,
    dX: 0,
    dY: 0,
    ddY: 0.01
};

makeCircle({id: 'circle',
            color: circle.color,
            radius: circle.radius,
            x: circle.x,
            y: circle.y,
           });

activeCount = circleCount;

function makeCircle(item) {
    objects[item.id] = makeTweenCircles(item.color, item.radius, item.x, item.y);
}

function makeTweenCircles(clr, radius, x, y) {
    var tweens = [];
    for (var i = 0; i < circleCount; i++) {
        var circle = new createjs.Shape();
        var color = createjs.Graphics.getHSL(clr, 100, 50);
        circle.graphics.beginFill(color).drawCircle(0, 0, radius);
        // circle.alpha = alpha;
        circle.alpha = alpha * (1 - i * 0.02);
        circle.radius = radius;
        // Set position of Shape instance:
        circle.x = x;
        circle.y = y;
        circle.compositeOperation = "lighter";

        // var tween = createjs.Tween.get(circle).to({x: initX, y: initY}, (0.5 + i * 0.04) * moveTime, createjs.Ease.linear).call(tweenComplete);
        // tweens.push({tween: tween, ref: circle});

        tweens.push(circle);
        stage.addChild(circle);
    }
    return tweens;
}

stage.addEventListener("stagemouseup", handleMouse);

createjs.Ticker.setFPS(fps);
createjs.Ticker.addEventListener("tick", tick);

function handleMouse(event) {
	  // if (text) { stage.removeChild(text); text = null; }
    circle.dX = (stage.mouseX - circle.x)/(100);
    circle.dY = (stage.mouseY - circle.y)/(100);
}

function tweenComplete() { activeCount--; }

function tick() {
	  // if (activeCount) {
    if (circle.x < circle.radius) { circle.dX = -circle.dX; circle.x = circle.radius; }
    if (circle.x > width - circle.radius) { circle.dX = -circle.dX; circle.x = width - circle.radius; }
    if (circle.y < circle.radius) { circle.dY = -circle.dY; circle.y = circle.radius; }
    if (circle.y > height - circle.radius) { circle.dY = -circle.dY; circle.y = height - circle.radius; }
    circle.x += circle.dX;
    circle.y += circle.dY;
    circle.dY += ddY;
    moveTo(objects.circle, circle.x, circle.y);
	  activeCount = circleCount;
    socket.emit('moveto', {x: circle.x/scaleX, y: circle.y/scaleY});
		stage.update();
	  // }
}

function moveTo(tweens, pointX, pointY) {
    for (var i = 0; i < circleCount; i++) {
        var item = tweens[i];
		    createjs.Tween.get(item, {override: true})
            .to({x: pointX, y: pointY},
                (0.75 + i * 0.3) * moveTime, createjs.Ease.linear)
        // .call(function() { item.x = pointX * scaleX; itemY = point.y * scaleY; })
        // .call(tweenComplete)
        ;
    }
}

function scaleItem(item) {
    item.radius *= scale;
    item.x *= scaleX;
    item.y *= scaleY;
    return item;
}

socket.emit('chooseboard', board);

socket.on('init', function(items) {
    board = items.board;
    delete items.board;
    for (var key in items) { makeCircle(scaleItem(items[key])); }

    text = new createjs.Text("Tap or click anywhere to move your circle.\n" +
                             "Board code: " + board,
                             Math.floor(width/30) + "px Sans-serif", // "px Arial"
                             "#777");
    text.x = width/10;
    text.y = height/10;
    stage.addChild(text);
});

socket.emit('newitem', {radius: circle.radius/scale, color: circle.color, x: circle.x/scaleX, y: circle.y/scaleY});

socket.on('newitem', function(item) { makeCircle(scaleItem(item)) });

socket.on('moveto', function(point) {
    moveTo(objects[point.id], point.x * scaleX, point.y * scaleY);
});

socket.on('delete', function(id) {
	  for (var i = 0; i < circleCount; i++) { stage.removeChild(objects[id][i]); }
    stage.update();
    delete objects[id];
});
