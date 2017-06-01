var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var painter = new XOPainterCanvas(canvas, 10);
// var painter = Object.create(xoPainterCanvas);
// painter.canvas = canvas;

var game = Object.create(xoGame);
game.painter = painter;
game.winLength = 5;

game.painter.reDraw(game.getScoreMsg());

game.painter.canvas.addEventListener("mousedown", function(event) {
    var cell = game.painter.whichCell(event.x, event.y);
    console.log(cell);
    if (cell) { game.checkTurn(cell); }
});


/*
  var socket = io.connect('/44');

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
*/
