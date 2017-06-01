var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var painter = new XOPainterCanvas(canvas, 10);
// var painter = Object.create(xoPainterCanvas);
// painter.canvas = canvas;

var game = Object.create(xoGame);
game.painter = painter;
game.winLength = 5;

game.painter.canvas.addEventListener("mousedown", handleMouse);

var socket = io.connect('/45');
var client = {};

socket.on('suggest board', function(code) {
    client.code = prompt("Enter code of a board you want to connect.\n" +
                         "If CANCEL or the board doesn't exist or the board is full of players\n" +
                         "new board will be created.",
                         code);
    socket.emit('choose board', client.code);
});

socket.on('init', function(init) {
    client = init;
    game.restart(' Board: ' + client.code + ' State: waiting');
});

socket.on('start', function() {
    client.ongoing = true;
    game.restart(' Board: ' + client.code);
});

socket.on('turn', function(cell) {
    game.checkTurn(cell);
});

function handleMouse(event) {
    if (client.ongoing
        && game.whoPlays === client.team) {
        var cell = game.painter.whichCell(event.x, event.y);
        console.log(cell);
        if (cell) {
            var checkedCell = game.checkTurn(cell);
            if (checkedCell) { socket.emit('turn', checkedCell); }
        }
    }
}
