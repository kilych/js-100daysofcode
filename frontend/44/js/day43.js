var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var painter = new XOPainterCanvas(canvas, 3);
// var painter = Object.create(xoPainterCanvas);
// painter.canvas = canvas;

var game = Object.create(xoGame);
game.painter = painter;
game.winLength = 3;

game.painter.canvas.addEventListener("mousedown", handleMouse);

game.restart('');

function handleMouse(event) {
        var cell = game.painter.whichCell(event.x, event.y);
        console.log(cell);
        if (cell) { game.checkTurn(cell); }
}
