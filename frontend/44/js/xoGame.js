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
            if (this.checkWin(who, cell)) {
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
        var text = this.getScoreMsg();
        setTimeout(function() { this.painter.reDraw(text) }, 1000);
    },

    getScoreMsg() {
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
        for(var shift = 0; shift < this.winLength; shift++) {
            var res = true;
            var filledCells = [];
            for (var i = 0; i < this.winLength; i++) {
                // console.log(this.nextCell(type, cell, -shift + i));
                if (this.checkEmpty(who, this.nextCell(type, cell, -shift + i))) { res = false; break; }
                filledCells.push(this.nextCell(type, cell, -shift + i));
            }
            if (res) {
                this.painter.drawLineInCells(type, filledCells);
                return true;
            }
        }
        return false;
    },

    nextCell(type, cell, shift) {
        switch(type) {
        case 'horizontal': return [cell[0] + shift, cell[1]];
        case 'vertical': return [cell[0], cell[1] + shift];
        case 'descending': return [cell[0] + shift, cell[1] + shift];
        case 'ascending': return [cell[0] + shift, cell[1] - shift];
        }
    },

    checkEmpty(who, cell) {
        return -1 === this.usedCells[who].map(this.getPlain)
            .indexOf(this.getPlain(cell));
    },

    getPlain(index) { return index[0] + this.painter.boardOrder * index[1]; },
};
