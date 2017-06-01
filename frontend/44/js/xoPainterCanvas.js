var xoPainterCanvas = {

    canvas: {},
    context: this.canvas.getContext('2d'),
    minCanvasSize: (this.canvas.width < this.canvas.height)
        ? this.canvas.width : this.canvas.height,
    boardStartX: 0.1 * this.minCanvasSize,
    boardStartY: 0.1 * this.minCanvasSize,
    boardSize: 0.8 * this.minCanvasSize,
    cellSize: this.boardSize/3,
    shapeSize: 0.8 * this.cellSize,
    dSize: (this.cellSize - this.shapeSize) / 2,

    whichCell(x, y) {
        var borderX = this.boardStartX,
            borderY = this.boardStartY;
        for (var k = 0; k < 9; k++) {
            if (borderX < x && x < borderX + this.cellSize && borderY < y && y < borderY + this.cellSize) {
                var i = k % 3,
                    j = (k - i) / 3;
                return [i, j];
            }
            borderX += this.cellSize;
            if (k % 3 === 2) {
                borderY += this.cellSize;
                borderX = 0;
            }
        }
        return false;
    },

    reDraw(text) {
        this.clear();
        this.drawText(text);
        this.drawBoard();
    },

    drawText(text) {
        this.context.fillStyle = "#00F";
        this.context.font = this.boardStartY/3 + "px Arial";
        this.context.fillText(text, this.boardStartY/2, this.boardStartY/2);
        return this;
    },

    // cellIndex is two element array: first for x, from 0 to 2, from left to right;
    // second for y, from 0 to 2, from top to bottom
    drawShapeInCell(who, cellIndex) {
        if (who == 'x') {
            this.drawX(this.boardStartX + this.cellSize * cellIndex[0] + this.dSize,
                  this.boardStartX + this.cellSize * cellIndex[1] + this.dSize,
                  this.shapeSize);
        } else if (who == 'o') {
            this.drawO(this.boardStartX + this.cellSize * cellIndex[0] + this.dSize,
                  this.boardStartX + this.cellSize * cellIndex[1] + this.dSize,
                  this.shapeSize);
        }
    },

    drawX(startX, startY, size) {
        this.drawLine(startX, startY, size, size)
            .drawLine(startX + size, startY, -size, size);
    },

    drawO(startX, startY, diameter) {
        var radius = diameter/2;
        this.context.beginPath();
        this.context.arc(startX + radius, startY + radius, radius, 0, 2 * Math.PI, false);
        this.context.stroke();
    },

    drawLineInCells(type, cells) {
        cells.forEach(function(cell) { this.drawLineInCell(type, cell); });
    },

    drawLineInCell(type, cellIndex) {
        var i = cellIndex[0],
            j = cellIndex[1];
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
    },

    drawBoard() {
        this.drawLine(this.boardStartX, this.boardStartY + this.cellSize, 3 * this.cellSize, 0)
            .drawLine(this.boardStartX, this.boardStartY + 2 * this.cellSize, 3 * this.cellSize, 0)
            .drawLine(this.boardStartX + this.cellSize, this.boardStartY, 0, 3 * this.cellSize)
            .drawLine(this.boardStartX + 2 * this.cellSize, this.boardStartY, 0, 3 * this.cellSize);
        return this;
    },

    drawLine(startX, startY, dX, dY) {
        var endX = startX + dX;
        var endY = startY + dY;
        this.context.beginPath();
        this.context.moveTo(startX, startY);
        this.context.lineTo(endX, endY);
        this.context.stroke();
        return this;
    },

    // http://stackoverflow.com/a/6722031
    clear() {
        this.context.save();
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.restore();
    }
};
