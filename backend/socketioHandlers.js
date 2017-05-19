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

    const makeBoardCode = () => {
        let code = '';
        const source = '0123456789abcdefghijklmnopqrstuvwxyz',
              len = source.length;
        for ( let i = 0; i < 5; i++ ) {
            code += source.charAt(Math.floor(Math.random() * len));
        }
        return code;
    };

    const makeUniqCode = () => {
        let code;
        do { code = makeBoardCode(); } while (items[code] !== undefined)
        return code;
    };

    io.on('connection', function(socket) {
        console.log(socket.id + ' connected');
        let board = defaultboard;
        socket.on('chooseboard', function(choosedboard) {
            if(items[choosedboard] === undefined) {
                board = makeUniqCode();
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
