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

app.get('/chat', function(req, res) {
    res.sendFile(__dirname + '/other/socketio-chat.html');
});

io.on('connection', function(socket) {
    // console.log('a user connected');
    socket.on('chat message', function(msg) {
        // console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
    // socket.on('disconnect', function() {
    // console.log('user disconnected');
    // });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
