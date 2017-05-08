var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
    res.send("#100днейкода (17th day by kilych)");
});

app.get('/14-16', function(req, res) {
    res.sendFile(__dirname + '/days/14-16/shape.html');
});

app.get('/17', function(req, res) {
    res.send("#100днейкода (17th day by kilych)");
});

app.get('/18', function(req, res) {
    res.sendFile(__dirname + '/days/18/18.html');
});

io.of('/chat').on('connection', function(socket) {
    console.log('chat: a user connected');
    // console.log('chat: a user ' + socket.id + ' connected');
    socket.on('chat message', function(msg) {
        console.log('message: ' + msg);
        io.of('/chat').emit('chat message', msg);
    });
    socket.on('disconnect', function() {
        console.log('chat: user disconnected');
    });
});

app.get('/chat', function(req, res) {
    res.sendFile(__dirname + '/other/socketio-chat.html');
});

io.of('/19-echo').on('connection', function(socket) {
    console.log('day19-echo_server: a user connected');
    socket.on('chat message', function(msg) {
        console.log('message: ' + msg);
        socket.emit('chat message', msg);
    });
    socket.on('disconnect', function() {
        console.log('day19-echo_server: user disconnected');
    });
});

app.get('/19', function(req, res) {
    res.sendFile(__dirname + '/days/19/echo.html');
});

io.of('/20').on('connection', function(socket) {
    console.log('day20: a user connected');
    socket.on('moveon', function(msg) {
        console.log('moveon: ' + msg);
        io.of('/20').emit('moveon', msg);
    });
    socket.on('disconnect', function() {
        console.log('day20: user disconnected');
    });
});

app.get('/20/input', function(req, res) {
    res.sendFile(__dirname + '/days/20/input.html');
});

app.get('/20/output', function(req, res) {
    res.sendFile(__dirname + '/days/20/output.html');
});

const height = 320,
      width = 480,
      dx = 30;
var initY = -height/2;
var sprites = {};

const createSprite = id => {
    sprites[id] = {x: 0, y:  initY};
    initY += dx;
    if (initY > height/2) initY -= height;
};

const deleteSprite = id => {
    delete sprites[id];
};

io.of('/21-input').on('connection', function(socket) {
    console.log(socket.id + ' connected');
    createSprite(socket.id);
    io.of('/21-output').emit('update', sprites);
    socket.on('movebackward', function() {
        console.log('moveon: ' + socket.id);
        var x = sprites[socket.id].x;
        x -= dx;
        if (x < -width/2) x += width;
        sprites[socket.id].x = x;
        io.of('/21-output').emit('update', sprites);
    });
    socket.on('moveforward', function() {
        console.log('moveon: ' + socket.id);
        var x = sprites[socket.id].x;
        x += dx;
        if (x > width/2) x -= width;
        sprites[socket.id].x = x;
        io.of('/21-output').emit('update', sprites);
    });
    socket.on('disconnect', function() {
        console.log(socket.id + ' disconnected');
        deleteSprite(socket.id);
        io.of('/21-output').emit('update', sprites);
    });
});

io.of('/21-output').on('connection', function(socket) {
    console.log(socket.id + ' connected');
    io.of('/21-output').emit('update', sprites);
    socket.on('disconnect', function() {
        console.log(socket.id + ' disconnected');
    });
});

app.get('/21/input', function(req, res) {
    res.sendFile(__dirname + '/days/21/input.html');
});

app.get('/21/output', function(req, res) {
    res.sendFile(__dirname + '/days/21/output.html');
});

var items = {};

io.of('/22-input').on('connection', function(socket) {
    console.log(socket.id + ' connected');
    socket.on('newitem', function(item) {
        item['id'] = socket.id;
        items[socket.id] = item;
        console.log('newitem: ' + item.x);
        io.of('/22-output').emit('newitem', item);
    });
    socket.on('moveto', function(point) {
        // items[scoket.id] can be undefined if client live when server rebooting
        // state on client and server can be non-consistent.
        // When reconnect client isn't reload, 'newitem' event don't pass.
        if (items[socket.id] !== undefined) {
            items[socket.id].x = point.x;
            items[socket.id].y = point.y;
            point['id'] = socket.id;
            console.log('moveto: ' + point);
            io.of('/22-output').emit('moveto', point);
        }
    });
    socket.on('disconnect', function() {
        delete items[socket.id];
        io.of('/22-output').emit('delete', socket.id);
        console.log(socket.id + ' disconnected');
    });
});

io.of('/22-output').on('connection', function(socket) {
    console.log(socket.id + ' connected');
    io.of('/22-output').emit('init', items);
    socket.on('disconnect', function() {
        console.log(socket.id + ' disconnected');
    });
});

app.get('/22/input', function(req, res) {
    res.sendFile(__dirname + '/days/22/input.html');
});

app.get('/22/output', function(req, res) {
    res.sendFile(__dirname + '/days/22/output.html');
});

http.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
