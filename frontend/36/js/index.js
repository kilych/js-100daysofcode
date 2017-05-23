var width = window.innerWidth,
    height = window.innerHeight,
    scaleX = width/100,
    scaleY = height/100,
    scale = (scaleX > scaleY) ? scaleX : scaleY,
    moveTime = 20,     // milliseconds
    fps = Math.floor(1000/moveTime);
var ddY = 0.01 * scaleY;
var netLevel = height * 0.6;
const alpha = 0.1,
      defaultboard = 'eg32r';
var objects = {};
var socket = io.connect('/36');
var activeCount;
var circleCount = 25;
var text;
var init = false;

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

var net = new createjs.Shape();
net.graphics.setStrokeStyle(3)
    .beginStroke('#FFF')
    .moveTo(width/2, netLevel)
    .lineTo(width/2, height)
    .endStroke();
stage.addChild(net);

// // load the source image:
// var image = new Image();
// image.src = '/35/ball.png';
// // image.width = 20 * scale;
// // image.height = 20 * scale;
// image.onload = function(event) {
//     var image = event.target;
//     var bitmap = new createjs.Bitmap(image);
//     bitmap.x = (width - image.width)/2;
//     bitmap.y = (height - image.height)/2;
//     stage.addChild(bitmap);
// };

var circle = {
    radius: (1 + 2 * Math.random()) * scale,
    x: width * 0.2,
    y: height * 0.3,
    dX: 0,
    dY: 0,
};

var ball = {
    radius: 2 * scale,
    x: width/2,
    y: height/2,
    dX: 0,
    dY: 0,
};

stage.addEventListener("stagemouseup", handleMouse);
function handleMouse(event) {
	  // if (text) { stage.removeChild(text); text = null; }
    circle.dX = (stage.mouseX - circle.x)/(100);
    circle.dY = (stage.mouseY - circle.y)/(100);
}

createjs.Ticker.setFPS(fps);
    createjs.Ticker.addEventListener("tick", tick);
function tick() {
    if (init) {
        circle.dY += ddY;
        circle.x += circle.dX;
        circle.y += circle.dY;
        ball.dY += ddY;
        ball.x += ball.dX;
        ball.y += ball.dY;

        checkBall();
        checkBorders(circle);
        checkNet(circle);
        checkBorders(ball);
        checkNet(ball);
        moveTo(objects.circle, circle.x, circle.y);
        moveTo(objects.ball, ball.x, ball.y);
	      activeCount = circleCount;
        socket.emit('moveto', {x: circle.x/scaleX, y: circle.y/scaleY});
		    stage.update();
    }
}
socket.emit('chooseboard', board);

socket.on('init', function(items) {
    board = items.board;
    delete items.board;
    text = new createjs.Text("Tap or click anywhere to move your circle.\n" +
                             "Board code: " + board,
                             Math.floor(width/30) + "px Sans-serif", // "px Arial"
                             "#777");
    text.x = width/10;
    text.y = height/10;
    stage.addChild(text);

    if (items.counter % 2 === 0) { circle.color = 240 + Math.random() * 120; }
    else { circle.color = Math.random() * 120; }
    delete items.counter;
    makeCircle({id: 'circle',
                color: circle.color,
                radius: circle.radius,
                x: circle.x,
                y: circle.y});

    activeCount = circleCount;

    socket.emit('newitem', {radius: circle.radius/scale, color: circle.color, x: circle.x/scaleX, y: circle.y/scaleY});

    for (var key in items) { makeCircle(scaleItem(items[key])); }

    ball.x = items.ball.x * scaleX;
    ball.y = items.ball.y * scaleY;
    // ball.dX = items.ball.dX * scaleX;
    // ball.dY = items.ball.dY * scaleY;

    init = true;
});

socket.on('newitem', function(item) { makeCircle(scaleItem(item)) });

socket.on('moveto', function(point) {
    if (point.id == 'ball') {
        ball.x = point.x * scaleX;
        ball.y = point.y * scaleY;
        ball.dX = point.dX * scaleX;
        ball.dY = point.dY * scaleY;
    }
    moveTo(objects[point.id], point.x * scaleX, point.y * scaleY);
});

socket.on('delete', function(id) {
	  for (var i = 0; i < circleCount; i++) { stage.removeChild(objects[id][i]); }
    stage.update();
    delete objects[id];
});

function makeCircle(item) {
    objects[item.id] = makeTweenCircles(item.color, item.radius, item.x, item.y);
    console.log(item.id);
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

        tweens.push(circle);
        stage.addChild(circle);
    }
    return tweens;
}

function scaleItem(item) {
    item.radius *= scale;
    item.x *= scaleX;
    item.y *= scaleY;
    return item;
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

function checkBall() {
    var square = function(x) { return x * x; }
    var distance = Math.sqrt(square(circle.x - ball.x) + square(circle.y - ball.y));
    if (distance < circle.radius + ball.radius) {
        ball.dX = 2 * circle.dX;
        ball.dY = 2 * circle.dY;
        socket.emit('moveto', { id: 'ball',
                                x: ball.x/scaleX, y: ball.y/scaleY,
                                dX: ball.dX/scaleX, dY: ball.dY/scaleY });
    }
}

function checkBorders(circle) {
    if (circle.x < circle.radius) { circle.dX = -circle.dX; circle.x = circle.radius; }
    if (circle.x > width - circle.radius) { circle.dX = -circle.dX; circle.x = width - circle.radius; }
    if (circle.y < circle.radius) { circle.dY = -circle.dY; circle.y = circle.radius; }
    if (circle.y > height - circle.radius) { circle.dY = -circle.dY; circle.y = height - circle.radius; }
}

function checkNet(circle) {
    if (circle.y > netLevel - circle.radius &&
        circle.y < netLevel &&
        circle.x > width/2 - circle.radius &&
        circle.x < width/2 + circle.radius) {
        circle.dY = -circle.dY;
        circle.y = netLevel - circle.radius;
    } else if (circle.y > netLevel - circle.radius &&
               circle.x > width/2 &&
               circle.x < width/2 + circle.radius) {
        circle.dX = -circle.dX;
        circle.x = width/2 + circle.radius;
    } else if (circle.y > netLevel - circle.radius &&
               circle.x < width/2 &&
               circle.x > width/2 - circle.radius) {
        circle.dX = -circle.dX;
        circle.x = width/2 - circle.radius;
    }
}

function tweenComplete() { activeCount--; }
