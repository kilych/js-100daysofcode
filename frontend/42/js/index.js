var width = window.innerWidth,
    height = window.innerHeight,
    length = ((width < height) ? width : height),
    fieldStart = 0.1 * length,
    fieldLength = 0.8 * length,
    cellSize = fieldLength/3,
    shapeSize = 0.8 * cellSize,
    dSize = (cellSize - shapeSize) / 2;

var canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

var drawCounter = 0;
var usedCells = [];
var crosses = [];
var zeros = [];

drawLine(fieldStart, fieldStart + cellSize, 3 * cellSize, 0);
drawLine(fieldStart, fieldStart + 2 * cellSize, 3 * cellSize, 0);
drawLine(fieldStart + cellSize, fieldStart, 0, 3 * cellSize);
drawLine(fieldStart + 2 * cellSize, fieldStart, 0, 3 * cellSize);

canvas.addEventListener("mousedown", function(event) {
    var cell = whichCell(event.x, event.y);
    console.log(cell);
    if (cell !== false && 0 > usedCells.indexOf(cell)
        && drawCounter < 9
       ) {
        if (drawCounter % 2 === 0) {
            drawInCell(cell, drawCross);
            usedCells.push(cell);
            crosses.push(cell);
            drawCounter++;
            checkTrees(crosses);
        } else {
            drawInCell(cell, drawCircle);
            usedCells.push(cell);
            zeros.push(cell);
            drawCounter++;
            checkTrees(zeros);
        }
    }
});

function checkTrees(arr) {
    if (checkTree(arr, [0, 1, 2])) {
        drawCounter = 9;
        drawLine(fieldStart, fieldStart + 0.45 * cellSize, fieldLength, 0);
    } else if (checkTree(arr, [3, 4, 5])) {
        drawCounter = 9;
        drawLine(fieldStart, fieldStart + 1.45 * cellSize, fieldLength, 0);
    } else if (checkTree(arr, [6, 7, 8])) {
        drawCounter = 9;
        drawLine(fieldStart, fieldStart + 2.45 * cellSize, fieldLength, 0);
    } else if (checkTree(arr, [0, 3, 6])) {
        drawCounter = 9;
        drawLine(fieldStart + 0.5 * cellSize, fieldStart, 0, fieldLength);
    } else     if (checkTree(arr, [1, 4, 7])) {
        drawCounter = 9;
        drawLine(fieldStart + 1.5 * cellSize, fieldStart, 0, fieldLength);
    } else if (checkTree(arr, [2, 5, 8])) {
        drawCounter = 9;
        drawLine(fieldStart + 2.5 * cellSize, fieldStart, 0, fieldLength);
    } else if (checkTree(arr, [0, 4, 8])) {
        drawCounter = 9;
        drawLine(fieldStart + dSize, fieldStart, fieldLength - dSize, fieldLength - dSize);
    } else if (checkTree(arr, [2, 4, 6])) {
        drawCounter = 9;
        drawLine(fieldStart + fieldLength - dSize, fieldStart, -fieldLength + dSize, fieldLength - dSize);
    }
}

function checkTree(haystack, needles) {
    for (var i = 0; i < needles.length; i++) {
        if (haystack.indexOf(needles[i]) < 0) { return false; }
    }
    return true;
}

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
    drawFunc(fieldStart + cellSize * i + dSize,
             fieldStart + cellSize * j + dSize,
              shapeSize);
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
