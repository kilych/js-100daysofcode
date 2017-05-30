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

var socket = io.connect('/44');

var usedCells = [];
var crosses = [];
var zeros = [];

var boardCode = '';

var board = {};
board.boardCode = boardCode;
board.clientCounter = 0;
board.score = {};
board.score.crosses = 0;
board.score.zeros = 0;
board.score.draw = 0;

var run = false;
var waited = false;
var yourTurn = false;

var crossWins = 0;
var zeroWins = 0;

socket.on('suggest board', function(suggestedCode) {
    boardCode = prompt("Enter code of a board you want to connect.\n" +
                       "If CANCEL or the board doesn't exist or the board is full of players\n" +
                       "new board will be created.",
                       suggestedCode);
    socket.emit('choose board', boardCode);
});

socket.on('wait another one', function(init) {
    board = init;
    run = false;
    waited = true;
    restart();
});

socket.on('start game', function(init) {
    board = init;
    if (waited) { yourTurn = true; }
    run = true;
    restart();
});

socket.on('new turn', function(cell) {
    var win = false;
    console.log(cell);
    if (run && cell !== false && 0 > usedCells.indexOf(cell)
        && usedCells.length < 9) {
        if (!waited) {
            drawInCell(cell, drawCross);
            usedCells.push(cell);
            crosses.push(cell);
            win = checkTrees(crosses);
            if (win) {
                socket.emit('win', 'crosses');
                run = false;
            }
        } else {
            drawInCell(cell, drawCircle);
            usedCells.push(cell);
            zeros.push(cell);
            win = checkTrees(zeros);
            if (win) {
                socket.emit('win', 'crosses');
                run = false;
            }
        }
        yourTurn = false;
        if (!win && usedCells.length == 9) {
            socket.emit('win', 'draw');
            run = false;
        }
    }
});

canvas.addEventListener("mousedown", function(event) {
    var cell = whichCell(event.x, event.y);
    var win = false;
    console.log(cell);
    // if (run) {
        if (run && yourTurn && cell !== false && 0 > usedCells.indexOf(cell)
            && usedCells.length < 9) {
            if (waited) {
                drawInCell(cell, drawCross);
                usedCells.push(cell);
                crosses.push(cell);
                win = checkTrees(crosses);
                if (win) {
                    socket.emit('win', 'crosses');
                }
            } else {
                drawInCell(cell, drawCircle);
                usedCells.push(cell);
                zeros.push(cell);
                win = checkTrees(zeros);
                if (win) {
                    socket.emit('win', 'crosses');
                }
            }
            yourTurn = false;
            if (!win && usedCells.length == 9) socket.emit('win', 'draw');
        }
    // }
});

function restart() {
    usedCells = [];
    crosses = [];
    zeros = [];
    clear();
    drawText();
    drawLine(fieldStart, fieldStart + cellSize, 3 * cellSize, 0);
    drawLine(fieldStart, fieldStart + 2 * cellSize, 3 * cellSize, 0);
    drawLine(fieldStart + cellSize, fieldStart, 0, 3 * cellSize);
    drawLine(fieldStart + 2 * cellSize, fieldStart, 0, 3 * cellSize);
}

function checkTrees(arr) {
    if (checkTree(arr, [0, 1, 2])) {
        drawCounter = 9;
        drawLine(fieldStart, fieldStart + 0.45 * cellSize, fieldLength, 0);
        return true;
    } else if (checkTree(arr, [3, 4, 5])) {
        drawCounter = 9;
        drawLine(fieldStart, fieldStart + 1.45 * cellSize, fieldLength, 0);
        return true;
    } else if (checkTree(arr, [6, 7, 8])) {
        drawCounter = 9;
        drawLine(fieldStart, fieldStart + 2.45 * cellSize, fieldLength, 0);
        return true;
    } else if (checkTree(arr, [0, 3, 6])) {
        drawCounter = 9;
        drawLine(fieldStart + 0.5 * cellSize, fieldStart, 0, fieldLength);
        return true;
    } else     if (checkTree(arr, [1, 4, 7])) {
        drawCounter = 9;
        drawLine(fieldStart + 1.5 * cellSize, fieldStart, 0, fieldLength);
        return true;
    } else if (checkTree(arr, [2, 5, 8])) {
        drawCounter = 9;
        drawLine(fieldStart + 2.5 * cellSize, fieldStart, 0, fieldLength);
        return true;
    } else if (checkTree(arr, [0, 4, 8])) {
        drawCounter = 9;
        drawLine(fieldStart + dSize, fieldStart, fieldLength - dSize, fieldLength - dSize);
        return true;
    } else if (checkTree(arr, [2, 4, 6])) {
        drawCounter = 9;
        drawLine(fieldStart + fieldLength - dSize, fieldStart, -fieldLength + dSize, fieldLength - dSize);
        return true;
    } else return false;
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

function drawText() {
    context.fillStyle = "#00F";
    context.font = fieldStart/3 + "px Arial";
    context.fillText("Board: " + board.boardCode + " Crosses: " + board.score.crosses + " Zeros: " + board.score.zeros
                     + " Draw: " + board.score.draw, fieldStart/2, fieldStart/2);
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

// http://stackoverflow.com/a/6722031
function clear() {
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
}
