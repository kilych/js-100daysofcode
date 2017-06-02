var xoGame = {
    painter: {},
    winLength: 3,

    score: {x: 0, o: 0, draw: 0},
    whoPlays: 'x',
    usedCells: {x: [], o: []},

    checkTurn(cell) {
        var who = this.whoPlays;
        if (this.isEmpty('x', cell)
            && this.isEmpty('o', cell)) {
            this.usedCells[who].push(cell);
            this.whoPlays = this.otherPlayer(who);
            this.painter.drawShapeInCell(who, cell);
            var winningCells = this.checkWin(who, cell);
            if (winningCells) {
                console.log(winningCells);
                var type = winningCells.pop();
                this.painter.drawLineInCells(type, winningCells);
                this.score[who]++;
                this.restart('');
            } else if (this.checkDraw()) {
                this.score.draw++;
                this.restart('');
            }
            return cell;
        } else { return false; }
    },

    otherPlayer(who) {
        if (who === 'x') { return 'o'; }
        else if (who === 'o') { return 'x'; }
    },

    restart(msg) {
        this.usedCells = {x: [], o: []};
        this.whoPlays = 'x';
        var text = this.getGameText() + msg;
        setTimeout(function() { this.painter.reDraw(text) }, 1000);
    },

    getGameText() {
        return " X: " + this.score.x + " O: " + this.score.o
            + " Draw: " + this.score.draw;
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
        var shift = 0, step = 1;
        while (filledCells.length < this.winLength) {
            var nextCell = this.nextCell(type, cell, shift);
            if (this.isInsideBoard(nextCell)
                && !this.isEmpty(who, nextCell)) { filledCells.push(nextCell); }
            else if (step < 0) { return false; }
            else {
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

    isInsideBoard(cell) {
        return 0 <= cell.col && cell.col < this.painter.boardOrder
            && 0 <= cell.row && cell.row < this.painter.boardOrder;
    },

    isEmpty(who, cell) {
        return -1 === this.usedCells[who].map(this.getPlain)
            .indexOf(this.getPlain(cell));
    },

    getPlain(cell) { return cell.col + this.painter.boardOrder * cell.row; },
};
