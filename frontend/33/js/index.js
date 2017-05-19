var width = window.innerWidth,
    height = window.innerHeight;
const alpha = 0.3,
      clr = Math.random() * 360,
      radius = 10 + 20 * Math.random(),
      // in milliseconds:
      beInvisibleTime = 100,
      moveTime = 300,
      defaultboard = 'eg32r';
var objects = {};
var socket = io.connect('/33');
var canvas;
var stage;
//var tweens;
//var activeCount;
//var circleCount = 25;
var text;

canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = height;
stage = new createjs.Stage(canvas);
stage.enableDOMEvents(true);
//tweens = [];
stage.enableMouseOver(10);
createjs.Touch.enable(stage);

var board = prompt("Enter code of a board you want to connect.\n" +
                   "If CANCEL or the board doesn't exist new board will be created.",
                   defaultboard);

socket.emit('chooseboard', board);

socket.on('init', function(items) {
    board = items.board;
    delete items.board;
    for (var key in items) { makeCircle(items[key]); }
    text = new createjs.Text("Your circle is in center.\n"
                             + "Click anywhere to move it.\n"
                             + "Board code: " + board
                             // ,Math.floor(width/30) + "px Arial"
                             ,Math.floor(width/30) + "px Sans-serif"
                             ,"#777");
    text.x = width/10;
    text.y = height/10;
    stage.addChild(text);
});

//for (var i = 0; i < circleCount; i++) {
var i = 0;
// draw the circle, and put it on stage:
var color = createjs.Graphics.getHSL(clr, 100, 50);
var circle = new createjs.Shape();
circle.graphics.beginFill(color).drawCircle(0, 0, radius);
circle.alpha = alpha;
circle.radius = radius;
circle.x = width/2;
circle.y = height/2;
// circle.graphics.setStrokeStyle(15);
// circle.graphics.beginStroke("#113355");
// circle.graphics.drawCircle(0, 0, (i + 1) * 4);
// circle.alpha = 1 - i * 0.02;
// circle.x = Math.random() * width;
// circle.y = Math.random() * height;
circle.compositeOperation = "lighter";

//var tween = createjs.Tween.get(circle).to({x: 275, y: 200}, (0.5 + i * 0.04) * 1500, createjs.Ease.bounceOut).call(tweenComplete);
//tweens.push({tween: tween, ref: circle});
stage.addChild(circle);
//}
//activeCount = circleCount;

socket.emit('newitem', {radius: radius, color: clr, x: circle.x, y: circle.y});

socket.on('newitem', makeCircle);

socket.on('moveto', function(point) {
    var item = objects[point.id];
		createjs.Tween.get(item, //ref
                       {override: true})
        .to({x: point.x, y: point.y}, (0.5 + i * 0.04) * 1500, createjs.Ease.bounceOut)
    // createjs.Tween.get(item, { loop: false })
        // .to({ alpha: 0 }, beInvisibleTime)
        // .to({ alpha: alpha, x: point.x, y: point.y }, moveTime, createjs.Ease.linear)
        .call(function() { item.x = point.x; item.y = point.y; });
});

socket.on('delete', function(id) {
    stage.removeChild(objects[id]);
    stage.update();
    delete objects[id];
});

function makeCircle(item) {
    var circle = new createjs.Shape();
    var color = createjs.Graphics.getHSL(item.color, 100, 50);
    circle.graphics.beginFill(color).drawCircle(0, 0, item.radius);
    circle.alpha = alpha;
    circle.radius = item.radius;
    // Set position of Shape instance:
    circle.x = item.x;
    circle.y = item.y;
    circle.compositeOperation = "lighter";

    stage.addChild(circle);
    objects[item.id] = circle;
}

stage.addEventListener("stagemousemove", handleMouse);

createjs.Ticker.addEventListener("tick", tick);

function handleMouse(event) {
	  // if (text) {
		//     stage.removeChild(text);
		//     text = null;
	  // }
	  //for (var i = 0; i < circleCount; i++) {
		//var ref = tweens[i].ref;
		//var tween = tweens[i].tween;
		createjs.Tween.get(circle, //ref
                       {override: true}).to({x: stage.mouseX, y: stage.mouseY}, (0.5 + i * 0.04) * 1500, createjs.Ease.bounceOut)
    //    .call(tweenComplete)
    ;
	  //}
	  //activeCount = circleCount;
    socket.emit('moveto', {x: stage.mouseX, y: stage.mouseY});
}

//function tweenComplete() {
//activeCount--;
//}

function tick(event) {
	  //if (activeCount) {
		stage.update(event);
	  //}
}
