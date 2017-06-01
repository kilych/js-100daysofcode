function XOPainterCanvas(canvas, boardOrder) {

    this.canvas = canvas;
    this.boardOrder = boardOrder;
    this.context = this.canvas.getContext('2d');
    this.minCanvasSize = (this.canvas.width < this.canvas.height)
        ? this.canvas.width : this.canvas.height;
    this.boardStartX = 0.1 * this.minCanvasSize;
    this.boardStartY = 0.1 * this.minCanvasSize;
    this.boardSize = 0.8 * this.minCanvasSize;
    this.cellSize = this.boardSize / this.boardOrder;
    this.shapeSize = 0.8 * this.cellSize;
    this.dSize = (this.cellSize - this.shapeSize) / 2;

    this.whichCell = function(x, y) {
        var borderX = this.boardStartX,
            borderY = this.boardStartY;
        for (var k = 0; k < this.boardOrder * this.boardOrder; k++) {
            if (borderX < x && x < borderX + this.cellSize && borderY < y && y < borderY + this.cellSize) {
                var i = k % this.boardOrder,
                    j = (k - i) / this.boardOrder;
                return [i, j];
            }
            borderX += this.cellSize;
            if (k % this.boardOrder === this.boardOrder - 1) {
                borderY += this.cellSize;
                borderX = 0;
            }
        }
        return false;
    };

    this.reDraw = function(text) {
        this.clear();
        this.drawText(text);
        this.drawBoard();
    };

    this.drawText = function(text) {
        this.context.fillStyle = "#00F";
        this.context.font = this.boardStartY/3 + "px Arial";
        this.context.fillText(text, this.boardStartY/2, this.boardStartY/2);
        return this;
    };

    // cell is two element array: first for x, from 0 to 2, from left to right;
    // second for y, from 0 to 2, from top to bottom
    this.drawShapeInCell = function(who, cell) {
        if (who == 'x') {
            this.drawX(this.boardStartX + this.cellSize * cell[0] + this.dSize,
                  this.boardStartX + this.cellSize * cell[1] + this.dSize,
                  this.shapeSize);
        } else if (who == 'o') {
            this.drawO(this.boardStartX + this.cellSize * cell[0] + this.dSize,
                  this.boardStartX + this.cellSize * cell[1] + this.dSize,
                  this.shapeSize);
        }
    };

    this.drawX = function(startX, startY, size) {
        this.drawLine(startX, startY, size, size)
            .drawLine(startX + size, startY, -size, size);
    };

    this.drawO = function(startX, startY, diameter) {
        var radius = diameter/2;
        this.context.beginPath();
        this.context.arc(startX + radius, startY + radius, radius, 0, 2 * Math.PI, false);
        this.context.stroke();
    };

    this.drawLineInCells = function(type, cells) {
        for (var i = 0, len = cells.length; i < len; i++) {
            this.drawLineInCell(type, cells[i]);
        }
    };

    this.drawLineInCell = function(type, cell) {
        var i = cell[0],
            j = cell[1];
        switch (type) {
        case 'horizontal':
            this.drawLine(this.boardStartX + i * this.cellSize,
                          this.boardStartY + (j + 0.45) * this.cellSize,
                          this.cellSize, 0);
            break;
        case 'vertical':
            this.drawLine(this.boardStartX + (i + 0.5) * this.cellSize,
                          this.boardStartY + j * this.cellSize,
                          0, this.cellSize);
            break;
        case 'ascending':
            this.drawLine(this.boardStartX + i * this.cellSize,
                          this.boardStartY + (j + 1) * this.cellSize - this.dSize,
                          this.cellSize - this.dSize,
                          -this.cellSize + this.dSize);
            break;
        case 'descending':
            this.drawLine(this.boardStartX + i * this.cellSize + this.dSize,
                          this.boardStartY + j * this.cellSize,
                          this.cellSize - this.dSize,
                          this.cellSize - this.dSize);
            break;
        }
        return this;
    };

    this.drawBoard = function() {
        for (var i = 1; i < this.boardOrder; i++) {
            this.drawLine(this.boardStartX, this.boardStartY + i * this.cellSize, this.boardSize, 0);
            this.drawLine(this.boardStartX + i * this.cellSize, this.boardStartY, 0, this.boardSize);
        }
        return this;
    };

    this.drawLine = function(startX, startY, dX, dY) {
        var endX = startX + dX;
        var endY = startY + dY;
        this.context.beginPath();
        this.context.moveTo(startX, startY);
        this.context.lineTo(endX, endY);
        this.context.stroke();
        return this;
    };

    // http://stackoverflow.com/a/6722031
    this.clear = function() {
        this.context.save();
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.restore();
    }
}
