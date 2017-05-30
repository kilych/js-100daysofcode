'use strict';

exports.handleChat = io => {
    io.on('connection', function(socket) {
        console.log(socket.id + ' connected');
        socket.on('chat message', function(msg) {
            io.emit('chat message', msg);
            console.log(socket.id + ' says: ' + msg);
        });
        socket.on('disconnect', function() {
            console.log(socket.id + ' disconnected');
        });
    });
}

// day 19
exports.handleEcho = io => {
    io.on('connection', function(socket) {
        console.log(socket.id + ' connected');
        socket.on('chat message', function(msg) {
            socket.emit('chat message', msg); // FIXIT: emits to not only this socket
            console.log(socket.id + ' says: ' + msg);
        });
        socket.on('disconnect', function() {
            console.log(socket.id + ' disconnected');
        });
    });
}

// day 20
exports.handle20 = io => {
    io.on('connection', function(socket) {
        console.log(socket.id + ' connected');
        socket.on('moveon', function(msg) {
            io.emit('moveon', msg);
            console.log(socket.id + ' moves ' + msg);
        });
        socket.on('disconnect', function() {
            console.log(socket.id + ' disconnected');
        });
    });
}

exports.handle21 = (input, output) => {
    const height = 320,
          width = 480,
          dx = 30;
    let initY = -height/2;
    let sprites = {};

    const createSprite = id => {
        sprites[id] = {x: 0, y:  initY};
        initY += dx;
        if (initY > height/2) initY -= height;
    };

    input.on('connection', function(socket) {
        console.log(socket.id + ' connected');
        createSprite(socket.id);
        output.emit('update', sprites);
        socket.on('movebackward', function() {
            let x = sprites[socket.id].x;
            x -= dx;
            if (x < -width/2) x += width;
            sprites[socket.id].x = x;
            output.emit('update', sprites);
            console.log(socket.id + ' moves backward');
        });
        socket.on('moveforward', function() {
            let x = sprites[socket.id].x;
            x += dx;
            if (x > width/2) x -= width;
            sprites[socket.id].x = x;
            output.emit('update', sprites);
            console.log(socket.id + ' moves forward');
        });
        socket.on('disconnect', function() {
            delete sprites[socket.id];
            output.emit('update', sprites);
            console.log(socket.id + ' disconnected');
        });
    });

    output.on('connection', function(socket) {
        console.log(socket.id + ' connected');
        output.emit('update', sprites);
        socket.on('disconnect', function() {
            console.log(socket.id + ' disconnected');
        });
    });
}

exports.handle22 = (input, output) => {
    let items = {};

    input.on('connection', function(socket) {
        console.log(socket.id + ' connected');
        socket.on('newitem', function(item) {
            item['id'] = socket.id;
            items[socket.id] = item;
            output.emit('newitem', item);
            console.log('newitem: ' + item.x);
        });
        socket.on('moveto', function(point) {
            // items[scoket.id] can be undefined if client live when server rebooting.
            // State on client and server can be non-consistent.
            // Client reconnects wuthout reloading, 'newitem' event don't pass.
            if (items[socket.id] !== undefined) {
                items[socket.id].x = point.x;
                items[socket.id].y = point.y;
                point['id'] = socket.id;
                output.emit('moveto', point);
                console.log(socket.id + ' moves to ' +
                            point.x + ', ' + point.y);
            }
        });
        socket.on('disconnect', function() {
            delete items[socket.id];
            output.emit('delete', socket.id);
            console.log(socket.id + ' disconnected');
        });
    });

    output.on('connection', function(socket) {
        console.log(socket.id + ' connected');
        output.emit('init', items);
        socket.on('disconnect', function() {
            console.log(socket.id + ' disconnected');
        });
    });
}

exports.handle24 = io => {
    let items = {};

    io.on('connection', function(socket) {
        console.log(socket.id + ' connected');
        socket.emit('init', items);
        socket.on('newitem', function(item) {
            item['id'] = socket.id;
            items[socket.id] = item;
            socket.broadcast.emit('newitem', item);
        });
        socket.on('moveto', function(point) {
            if (items[socket.id] !== undefined) {
                items[socket.id].x = point.x;
                items[socket.id].y = point.y;
                point['id'] = socket.id;
                socket.broadcast.emit('moveto', point);
                console.log(socket.id + ' moves to ' +
                            point.x + ', ' + point.y);
            }
        });
        socket.on('disconnect', function() {
            delete items[socket.id];
            io.emit('delete', socket.id);
            console.log(socket.id + ' disconnected');
        });
    });
}

exports.handleBoards = io => {
    let items = {};
    const defaultboard = 'eg32r';
    items[defaultboard] = {};

    io.on('connection', function(socket) {
        console.log(socket.id + ' connected');
        let board = defaultboard;
        socket.on('chooseboard', function(choosedboard) {
            if(items[choosedboard] === undefined) {
                board = makeUniqCode(items);
                items[board] = {};
            } else { board = choosedboard; }
            socket.join(board);
            items[board].board = board;
            socket.emit('init', items[board]);
            console.log(socket.id + ' joined board ' +
                        items[board].board);
        });
        socket.on('newitem', function(item) {
            item['id'] = socket.id;
            items[board][socket.id] = item;
            socket.broadcast.to(board).emit('newitem', item);
        });
        socket.on('moveto', function(point) {
            if (items[board][socket.id] !== undefined) {
                items[board][socket.id].x = point.x;
                items[board][socket.id].y = point.y;
                point['id'] = socket.id;
                socket.broadcast.to(board).emit('moveto', point);
                console.log(socket.id + ' moves to ' +
                            point.x + ', ' + point.y);
            }
        });
        socket.on('disconnect', function() {
            delete items[board][socket.id];
            io.to(board).emit('delete', socket.id);
            console.log(socket.id + ' disconnected');
        });
    });
}

exports.handleBoards36 = io => {
    let items = {};
    let ball = { id: 'ball',
                 color: 180,
                 radius: 2,
                 x: 50,
                 y: 50,
                 dX: 0,
                 dY: 0 };
    const defaultboard = 'eg32r';
    items[defaultboard] = {};
    items[defaultboard].counter = 0;
    items[defaultboard].ball = ball;

    io.on('connection', function(socket) {
        console.log(socket.id + ' connected');
        let board = defaultboard;
        socket.on('chooseboard', function(choosedboard) {
            if(items[choosedboard] === undefined) {
                board = makeUniqCode(items);
                items[board] = {};
                items[board].counter = 0;
                items[board].ball = ball;
            } else { board = choosedboard; }
            socket.join(board);
            items[board].board = board;
            items[board].counter++;
            socket.emit('init', items[board]);
            console.log(socket.id + ' joined board ' + items[board].board);
        });
        socket.on('newitem', function(item) {
            item['id'] = socket.id;
            items[board][socket.id] = item;
            socket.broadcast.to(board).emit('newitem', item);
        });
        socket.on('moveto', function(point) {
            if (items[board][socket.id] !== undefined) {
                if (point.id == 'ball') {
                    items[board].ball.x = point.x;
                    items[board].ball.y = point.y;
                    items[board].ball.dX = point.dX;
                    items[board].ball.dY = point.dY;
                } else {
                    items[board][socket.id].x = point.x;
                    items[board][socket.id].y = point.y;
                    point.id = socket.id;
                }
                socket.broadcast.to(board).emit('moveto', point);
                console.log(point.id + ' moves to ' + point.x + ', ' + point.y);
            }
        });
        socket.on('disconnect', function() {
            delete items[board][socket.id];
            io.to(board).emit('delete', socket.id);
            console.log(socket.id + ' disconnected');
        });
    });
}

exports.handleBoards37 = io => {
    let items = {};
    const defaultboard = 'eg32r';
    items[defaultboard] = initBoard();

    io.on('connection', function(socket) {
        console.log(socket.id + ' connected');
        let board = defaultboard;
        socket.on('chooseboard', function(choosedboard) {
            if(items[choosedboard] === undefined) {
                board = makeUniqCode(items);
                items[board] = initBoard();
            } else { board = choosedboard; }
            socket.join(board);
            items[board].board = board;
            items[board].numberOfClients++;
            socket.emit('init', items[board]);
            console.log(socket.id + ' joined board ' + items[board].board);
        });
        socket.on('newitem', function(item) {
            item['id'] = socket.id;
            items[board][socket.id] = item;
            socket.broadcast.to(board).emit('newitem', item);
        });
        socket.on('moveto', function(point) {
            if (items[board][socket.id] !== undefined) {
                if (point.id == 'ball') {
                    items[board].ball.x = point.x;
                    items[board].ball.y = point.y;
                    items[board].ball.dX = point.dX;
                    items[board].ball.dY = point.dY;
                } else {
                    items[board][socket.id].x = point.x;
                    items[board][socket.id].y = point.y;
                    point.id = socket.id;
                }
                socket.broadcast.to(board).emit('moveto', point);
                // console.log(point.id + ' moves to ' + point.x + ', ' + point.y);
            }
        });
        socket.on('goal', function(who) {
            if (items[board][socket.id] !== undefined) {
                if (who == 'left') {
                    items[board].scoreCounter.left++;
                    if (items[board].scoreCounter.left ===
                        items[board].numberOfClients) {
                        items[board].scoreCounter.left = 0;
                        items[board].score.left++;
                        io.to(board).emit('goal', items[board].score);
                        console.log(socket.id + ' new score ' +
                                    items[board].score.left + ':' +
                                    items[board].score.right);
                    }
                }
                if (who == 'right') {
                    items[board].scoreCounter.right++;
                    if (items[board].scoreCounter.right ===
                        items[board].numberOfClients) {
                        items[board].scoreCounter.right = 0;
                        items[board].score.right++;
                        io.to(board).emit('goal', items[board].score);
                        console.log(socket.id + ' new score ' +
                                    items[board].score.left + ':' +
                                    items[board].score.right);
                    }
                }
            }
        });
        socket.on('disconnect', function() {
            delete items[board][socket.id];
            io.to(board).emit('delete', socket.id);
            items[board].numberOfClients--;
            if (items[board].numberOfClients <= 0) {
                items[board].score = { left: 0, right: 0 };
            }
            console.log(socket.id + ' disconnected');
        });
    });
}

exports.handleBoards38 = io => {
    let items = {};
    let results = [];
    const defaultBoardCode = 'eg32r';
    items[defaultBoardCode] = initBoard();

    io.on('connection', function(socket) {
        console.log(socket.id + ' connected');
        let boardCode = defaultBoardCode;

        socket.on('chooseboard', function(choosedBoard) {
            if(items[choosedBoard] === undefined) {
                boardCode = makeUniqCode(items);
                items[boardCode] = initBoard();
            } else { boardCode = choosedBoard; }
            socket.join(boardCode);
            items[boardCode].board = boardCode;
            items[boardCode].numberOfClients++;
            socket.emit('init', items[boardCode]);
            console.log(socket.id + ' joined board ' + items[boardCode].board);
        });

        socket.on('newitem', function(item) {
            item['id'] = socket.id;
            items[boardCode][socket.id] = item;
            socket.broadcast.to(boardCode).emit('newitem', item);
        });

        socket.on('moveto', function(point) {
            if (items[boardCode][socket.id] !== undefined) {
                handleMoveTo(items[boardCode], socket, point);
                socket.broadcast.to(boardCode).emit('moveto', point);
                // console.log(point.id + ' moves to ' + point.x + ', ' + point.y);
            }
        });

        socket.on('goal', function(who) {
            var board = items[boardCode];
            if (board[socket.id] !== undefined) {
                handleGoal(board, socket, who);
                if (board.score[who] >= 3) {
                    var row = UTCDateNow() + ' board: ' + board.board + ' score: ' +
                        board.score.left + ':' + board.score.right;
                    console.log(row);
                    results.push(row);
                    io.to(boardCode).emit('finalgoal', board.score);
                    io.emit('statupdate', row);
                } else { io.to(boardCode).emit('goal', board.score); }
                console.log(socket.id + ' new score ' +
                            board.score.left + ':' + board.score.right);
            }
        });

        socket.on('statinitrequest', function() {
            socket.emit('statinit', results);
        });

        socket.on('disconnect', function() {
            delete items[boardCode][socket.id];
            io.to(boardCode).emit('delete', socket.id);
            items[boardCode].numberOfClients--;
            if (items[boardCode].numberOfClients <= 0) {
                items[boardCode].score = { left: 0, right: 0 };
            }
            console.log(socket.id + ' disconnected');
        });
    });
}

function handleMoveTo(board, socket, point) {
    if (point.id == 'ball') {
        board.ball.x = point.x;
        board.ball.y = point.y;
        board.ball.dX = point.dX;
        board.ball.dY = point.dY;
    } else {
        board[socket.id].x = point.x;
        board[socket.id].y = point.y;
        point.id = socket.id;
    }
}

function handleGoal(board, socket, who) {
    board.scoreCounter[who]++;
    if (board.scoreCounter[who] === board.numberOfClients) {
        board.scoreCounter[who] = 0;
        board.score[who]++;
    }
}

function UTCDateNow() {
    var date = new Date();

    var dd = date.getUTCDate();
    if (dd < 10) { dd = '0' + dd; }

    var mm = date.getUTCMonth() + 1;
    if (mm < 10) { mm = '0' + mm; }

    var yy = date.getUTCFullYear() % 100;
    if (yy < 10) { yy = '0' + yy; }

    var hh = date.getUTCHours();
    if (hh < 10) { hh = '0' + hh; }

    var mn = date.getUTCMinutes();
    if (mn < 10) { mn = '0' + mn; }

    return 'UTC: ' + dd + '.' + mm + '.' + yy + ':' + hh + ':' + mn;
}

function initBoard() {
    return { numberOfClients: 0,
             ball: { id: 'ball',
                     color: 180,
                     radius: 2,
                     x: 50, y: 50,
                     dX: 0, dY: 0 },
             score: { left: 0, right: 0 },
             scoreCounter: { left: 0, right: 0 } }
}

exports.handleBoards44 = io => {
    let boards = {};

    io.on('connection', function(socket) {
        console.log(socket.id + ' connected');
        let boardCode = makeUniqCode(boards);
        socket.emit('suggest board', boardCode)
        socket.on('choose board', function(choosedBoard) {
            if(boards[choosedBoard] === undefined
               || boards[choosedBoard].clientCounter === 2) {
                boardCode = makeUniqCode(boards);
                boards[boardCode] = {};
                boards[boardCode].boardCode = boardCode;
                boards[boardCode].clientCounter = 0;
                boards[boardCode].score = {};
                boards[boardCode].score.crosses = 0;
                boards[boardCode].score.zeros = 0;
                boards[boardCode].score.draw = 0;
                boards[boardCode].scoreCounter = 0;
            } else { boardCode = choosedBoard; }
            socket.join(boardCode);
            boards[boardCode].clientCounter++;
            if (boards[boardCode].clientCounter = 1) {
                socket.emit('wait another one', boards[boardCode]);
                console.log(socket.id + ' joined board ' + boards[boardCode].boardCode + ' wait another one');
            } else if (boards[boardCode].clientCounter = 2) {
                io.to(boardCode).emit('start game', boards[boardCode]);
                console.log(socket.id + ' joined board ' + boards[boardCode].boardCode + ' start game');
            }
        });
        socket.on('new turn', function(cell) {
            socket.broadcast.to(boardCode).emit('new turn', cell);
        });
        socket.on('win', function(who) {
            board[boardCode].scoreCounter++;
            if (boards[boardCode].scoreCounter === 2) {
                boards[boardCode].scoreCounter = 0;
                boards[boardCode].score[who]++;
                io.to(boardCode).emit('start game', boards[boardCode]);
            }
        });
        socket.on('disconnect', function() {
            boards[boardCode].clientCounter--;
            if (boards[boardCode].clientCounter === 1) {
                socket.emit('wait another one', boards[boardCode]);
            } else if (boards[boardCode].clientCounter === 2) {
                delete boards[boardCode];
            }
            console.log(socket.id + ' disconnected');
        });
    });
}

function makeUniqCode(items) {
    let code;
    do { code = makeBoardCode(); } while (items[code] !== undefined)
    return code;
}

function makeBoardCode() {
    let code = '';
    const source = '0123456789abcdefghijklmnopqrstuvwxyz',
          len = source.length;
    for ( let i = 0; i < 5; i++ ) {
        code += source.charAt(Math.floor(Math.random() * len));
    }
    return code;
}
