"use strict";

// init
const radius = 20, dvy = 1;
var oldX, oldY,
    dragX, dragY,
    objects = [];

//Create a stage by getting a reference to the canvas
var stage = new createjs.Stage("canvas");
stage.enableDOMEvents(true);
var label = new createjs
    .Text("Mouse left button down for create\nthen drag for setting init speed\nthen release mouse",
          "12px Sans-serif");
stage.addChild(label);

stage.on("stagemousedown", makeCircle);
//stage.on("pressmove", dragObject);
stage.on("stagemouseup", releaseObject);

//Update stage will render next frame
createjs.Ticker.setFPS(50);
createjs.Ticker.addEventListener("tick", handleTick);
function handleTick() {
    objects.map(function(object) { object.handleTick(); });
    stage.update();
}

function makeCircle(event) {
    oldX = event.stageX;
    oldY = event.stageY;
    dragX = event.stageX;
    dragY = event.stageY;
    var circle = new createjs.Shape();
    var color = createjs.Graphics.getHSL(Math.random() * 360, 100, 50);
    circle.graphics.beginFill(color).drawCircle(0, 0, radius);
    circle.alpha = 0.3;
    circle.radius = radius;
    //circle.regX = radius;
    //circle.regY = radius;
    //Set position of Shape instance:
    circle.x = event.stageX;
    circle.y = event.stageY;
    circle.nowDragging = true;

    /*circle.handleTick = function() {
      if (this.nowDragging) {
      this.x = dragX;
      this.y = dragY;
      this.dx = (this.x - oldX);
      this.dy = (this.y - oldY);
      oldX = this.x;
      oldY = this.y;
      } else {
      this.dy += dvy;
      this.x += this.dx;
      this.y += this.dy;
      if (this.x < this.regX) {
      this.x = this.regX;
      this.dx = -this.dx;
      }
      if (this.x > stage.canvas.width - this.regX) {
      this.x = stage.canvas.width - this.regX;
      this.dx = -this.dx;
      }
      if (this.y < this.regY) {
      this.y = this.regY;
      this.dy = -this.dy;
      }
      if (this.y > stage.canvas.height - this.regY) {
      this.y = stage.canvas.height - this.regY;
      this.dy = -this.dy;
      }
      }
      };*/

    circle.handleTick = function() {
        if (this.nowDragging) {
            this.x = dragX;
            this.y = dragY;
            this.dx = (this.x - oldX);
            this.dy = (this.y - oldY);
            oldX = this.x;
            oldY = this.y;
        } else {
            this.dy += dvy;
            this.x += this.dx;
            this.y += this.dy;
            if (this.x < this.radius) {
                this.x = this.radius;
                this.dx = -this.dx;
            }
            if (this.x > stage.canvas.width - this.radius) {
                this.x = stage.canvas.width - this.radius;
                this.dx = -this.dx;
            }
            if (this.y < this.radius) {
                this.y = this.radius;
                this.dy = -this.dy;
            }
            if (this.y > stage.canvas.height - this.radius) {
                this.y = stage.canvas.height - this.radius;
                this.dy = -this.dy;
            }
        }
    };

    circle.on("pressmove", dragObject);

    stage.addChild(circle);
    objects.push(circle);
}

function dragObject(event) {
    dragX = event.stageX;
    dragY = event.stageY;
}

function releaseObject() {
    objects[objects.length - 1].nowDragging = false;
}
