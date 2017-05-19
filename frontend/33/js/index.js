var width = window.innerWidth,
    height = window.innerHeight;
const alpha = 0.3,
      clr = Math.random() * 360,
      radius = 10 + 20 * Math.random(),
      // in milliseconds:
      beInvisibleTime = 100,
      moveTime = 300,
      defaultboard = 'eg32r';
var socket = io.connect('/30');
var canvas;
var stage;
//var tweens;
//var activeCount;
//var circleCount = 25;
var text;

//function init() {
	canvas = document.getElementById('canvas');
  canvas.width = width;
  canvas.height = height;
	stage = new createjs.Stage(canvas);
	stage.enableDOMEvents(true);
	//tweens = [];
	stage.enableMouseOver(10);
	createjs.Touch.enable(stage);

	//for (var i = 0; i < circleCount; i++) {
    var i = 0;
		// draw the circle, and put it on stage:

    var color = createjs.Graphics.getHSL(clr, 100, 50);
		var circle = new createjs.Shape();
  	circle.graphics.beginFill(color).drawCircle(0, 0, radius);
    circle.alpha = alpha;
    circle.radius = radius;
	  // circle.graphics.setStrokeStyle(15);
		// circle.graphics.beginStroke("#113355");
		// circle.graphics.drawCircle(0, 0, (i + 1) * 4);
		// circle.alpha = 1 - i * 0.02;
		circle.x = Math.random() * width;
		circle.y = Math.random() * height;
		circle.compositeOperation = "lighter";

		//var tween = createjs.Tween.get(circle).to({x: 275, y: 200}, (0.5 + i * 0.04) * 1500, createjs.Ease.bounceOut).call(tweenComplete);
		//tweens.push({tween: tween, ref: circle});
		stage.addChild(circle);
	//}
	//activeCount = circleCount;
	stage.addEventListener("stagemousemove", handleMouseUp);

	text = new createjs.Text("Click Anywhere to Tween", "36px Arial", "#777");
	text.x = 350;
	text.y = 200;
	stage.addChild(text);

	createjs.Ticker.addEventListener("tick", tick);
//}

function handleMouseUp(event) {
	if (text) {
		stage.removeChild(text);
		text = null;
	}
	//for (var i = 0; i < circleCount; i++) {
		//var ref = tweens[i].ref;
		//var tween = tweens[i].tween;
		createjs.Tween.get(circle, //ref
                       {override: true}).to({x: stage.mouseX, y: stage.mouseY}, (0.5 + i * 0.04) * 1500, createjs.Ease.bounceOut)
  //    .call(tweenComplete)
  ;
	//}
	//activeCount = circleCount;
}

//function tweenComplete() {
	//activeCount--;
//}

function tick(event) {
	//if (activeCount) {
		stage.update(event);
	//}
}
