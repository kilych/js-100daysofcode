var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
    res.send("#100днейкода (17th day by kilych)");
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
    // socket.on('chat message', function(msg) {
    //     console.log('message: ' + msg);
    //     io.emit('chat message', msg);
    //     // socket.broadcast.emit(msg);
    // });
    socket.on('moveon', function(msg) {
        console.log('moveon: ' + msg);
        io.emit('moveon', msg);
        // socket.broadcast.emit(msg);
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

http.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
