"use strict";

const width = 480,
      height = 320,
      alpha = 0.3,
      color = "hsla(" + Math.random() * 360 + ",100%,50%," + alpha + ")";
var objects = {};
var socket = io.connect('/26');

let canvas = document.getElementById("canvas");
canvas.style.width = width + "px";
canvas.style.height = height + "px";

let shape = document.getElementById("shape");
shape.style.backgroundColor = color;

socket.on('init', function(items) {
    for (let key in items) {
        makeShape(items[key]);
    }
});

socket.emit('newitem', {color: color,
                        x: shape.style.left,
                        y: shape.style.top});

socket.on('newitem', makeShape);

canvas.addEventListener("mousedown", function(event) {
    console.log(event.clientX);
    shape.style.left = event.clientX + "px";
    shape.style.top = event.clientY + "px";
    socket.emit('moveto', {x: shape.style.left, y: shape.style.top});
});

socket.on('moveto', function(point) {
    let item = objects[point.id];
    item.style.left = point.x;
    item.style.top = point.y;
});

socket.on('delete', function(id) {
    delete objects[id];
});

function makeShape(item) {
    let shape = document.createElement("div");
    shape.style.width = "20px";
    shape.style.height = "20px";
    shape.style.backgroundColor = item.color;
    shape.style.left = item.x;
    shape.style.top = item.y;

    canvas.appendChild(shape);
    objects[item.id] = shape;
}
