/**
 * Incomplete
 */

function XOGame(painter) {

    painter: {},
    score: {x: 0, o: 0, draw: 0},
    boardCode: '',

    state: 'x turn',
    usedCells: {x: [], o: []},

    checkTurn(cellIndex) {
        var who = this.state[0];
        if (this.checkEmpty('x', cellIndex)
            && this.checkEmpty('o', cellIndex)) {
            this.usedCells[who].push(cellIndex);
            this.state = this.otherPlayer(who) + ' turn';
            this.painter.drawShapeInCell(who, cellIndex);
            if (this.checkWin(who, cellIndex) || this.checkDraw()) {
                this.score[who]++;
                this.usedCells = {x: [], o: []};
                this.state = 'x turn';
                this.painter.reDraw("Board: " + this.boardCode
                                    + " X: " + this.score.x + " O: " + this.score.o
                                    + " Draw: " + this.score.draw);
            }
        }
    },

    otherPlayer(who) {
        if (who === 'x') { return 'o'; }
        else if (who === 'o') { return 'x'; }
    },

    checkDraw() { return this.usedCells.x.length + this.usedCells.o.length === 9; },

    checkWin(who, cellIndex) {
        if (this.checkHorizontal(who, cellIndex)) {
            return true;
        } else if (this.checkVertical(who, cellIndex)) {
            return true;
        } else if (this.checkAscending(who, cellIndex)) {
            return true;
        } else if (this.checkDescending(who, cellIndex)) {
            return true;
        } else return false;
    },

    checkHorizontal(who, cellIndex) {
        for (var i = 0; i < 3; i++) {
            if (this.checkEmpty(who, [i, cellIndex[1]])) { return false; }
        }
        return true;
    },

    checkVertical(who, cellIndex) {
        for (var i = 0; i < 3; i++) {
            if (this.checkEmpty(who, [cellIndex[0], i])) { return false; }
        }
        return true;
    },

    checkAscending(who, cellIndex) {
        for (var i = 0; i < 3; i++) {
            if (this.checkEmpty(who, [i, 2 - i])) { return false; }
        }
        return true;
},

    checkDescending(who, cellIndex) {
        for (var i = 0; i < 3; i++) {
            if (this.checkEmpty(who, [i, i])) { return false; }
        }
        return true;
},

    checkEmpty(who, cellIndex) {
        return -1 === this.usedCells[who].map(this.getPlain)
            .indexOf(this.getPlain(cellIndex));
    },

    getPlain(index) { return index[0] + 3 * index[1]; },
}
