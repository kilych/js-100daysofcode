var xoGame = {

    painter: {},
    score: {x: 0, o: 0, draw: 0},
    boardCode: '',

    winLength: 3,

    state: 'x turn',
    usedCells: {x: [], o: []},

    checkTurn(cell) {
        var who = this.state[0];
        if (this.checkEmpty('x', cell)
            && this.checkEmpty('o', cell)) {
            this.usedCells[who].push(cell);
            this.state = this.otherPlayer(who) + ' turn';
            this.painter.drawShapeInCell(who, cell);
            var winningCells = this.checkWin(who, cell);
            if (winningCells) {
                var type = winningCells.pop();
                this.painter.drawLineInCells(type, winningCells);
                this.score[who]++;
                this.restart();
            } else if (this.checkDraw()) {
                this.score.draw++;
                this.restart();
            }
        }
    },

    otherPlayer(who) {
        if (who === 'x') { return 'o'; }
        else if (who === 'o') { return 'x'; }
    },

    restart() {
        this.usedCells = {x: [], o: []};
        this.state = 'x turn';
        var text = this.getGameText();
        setTimeout(function() { this.painter.reDraw(text) }, 1000);
    },

    getGameText() {
        return "Board: " + this.boardCode + " X: " + this.score.x
            + " O: " + this.score.o + " Draw: " + this.score.draw;
    },

    checkDraw() {
        return (this.usedCells.x.length + this.usedCells.o.length)
            === this.painter.boardOrder * this.painter.boardOrder;
    },

    checkWin(who, cell) {
        return this.checkWinByType('horizontal', who, cell) ||
            this.checkWinByType('vertical', who, cell) ||
            this.checkWinByType('descending', who, cell) ||
            this.checkWinByType('ascending', who, cell);
    },

    checkWinByType(type, who, cell) {
        var filledCells = [];
        var nextCell = {};
        var moveBackward = false;
        var shift = 0, step = 1;
        while (filledCells.length < this.winLength) {
            nextCell = this.nextCell(type, cell, shift);
            if (!this.checkEmpty(who, nextCell)) {
                filledCells.push(nextCell);
            } else {
                if (moveBackward) { return false; }
                moveBackward = true;
                shift = 0;
                step = -1;
            }
            shift += step;
        }
        filledCells.push(type);
        return filledCells;
    },

    nextCell(type, cell, shift) {
        switch(type) {
        case 'horizontal': return {col: cell.col + shift, row: cell.row};
        case 'vertical': return {col: cell.col, row: cell.row + shift};
        case 'descending': return {col: cell.col + shift, row: cell.row + shift};
        case 'ascending': return {col: cell.col + shift, row: cell.row - shift};
        }
    },

    checkEmpty(who, cell) {
        return -1 === this.usedCells[who].map(this.getPlain)
            .indexOf(this.getPlain(cell));
    },

    getPlain(cell) { return cell.col + this.painter.boardOrder * cell.row; },
};
