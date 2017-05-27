var width = window.innerWidth,
    height = window.innerHeight,
    length = ((width < height) ? width : height),
    fieldStart = 0.1 * length,
    cellSize = 0.8 * length/3;

var canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

var drawCounter = 0;
var usedCells = [];

drawLine(fieldStart, fieldStart + cellSize, 3 * cellSize, 0);
drawLine(fieldStart, fieldStart + 2 * cellSize, 3 * cellSize, 0);
drawLine(fieldStart + cellSize, fieldStart, 0, 3 * cellSize);
drawLine(fieldStart + 2 * cellSize, fieldStart, 0, 3 * cellSize);

canvas.addEventListener("mousedown", function(event) {
    var cell = whichCell(event.x, event.y);
    console.log(cell);
    if (cell !== false && 0 > usedCells.indexOf(cell)
        // && drawCounter < 9
       ) {
        if (drawCounter % 2 === 0) {
            drawInCell(cell, drawCross);
            usedCells.push(cell);
            drawCounter++;
        } else {
            drawInCell(cell, drawCircle);
            usedCells.push(cell);
            drawCounter++;
        }
    }
});

function whichCell(x, y) {
    var borderX = fieldStart;
    var borderY = fieldStart;
    for (var i = 0; i < 9; i++) {
        if (borderX < x && x < borderX + cellSize && borderY < y && y < borderY + cellSize) {
            return i;
        }
        borderX += cellSize;
        if (i % 3 === 2) {
            borderY += cellSize;
            borderX = 0;
        }
    }
    return false;
}

// cellNum from 0 to 8, from left to right, from top to bottom
function drawInCell(cellNum, drawFunc) {
    var i = cellNum % 3;
    var j = (cellNum - i) / 3;
    drawFunc(fieldStart + cellSize * (i + 0.1),
              fieldStart + cellSize * (j + 0.1),
              0.8 * cellSize);
}

function drawLine(startX, startY, dX, dY) {
    var endX = startX + dX;
    var endY = startY + dY;
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
}

function drawCross(startX, startY, size) {
    drawLine(startX, startY, size, size);
    drawLine(startX + size, startY, -size, size);
}

function drawCircle(startX, startY, diameter) {
    var radius = diameter/2;
    context.beginPath();
    context.arc(startX + radius, startY + radius, radius, 0, 2 * Math.PI, false);
    context.stroke();
}
