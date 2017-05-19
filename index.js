'use strict';

let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let iohandlers = require('./backend/socketioHandlers.js');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/frontend'));

app.get('/', function(req, res) {
    res.send("#100днейкода (17th day by kilych)");
});

app.get('/14-16', function(req, res) {
    res.sendFile(__dirname + '/frontend/14-16/shape/index.html');
});

app.get('/17', function(req, res) {
    res.send("#100днейкода (17th day by kilych)");
});

app.get('/18', function(req, res) {
    res.sendFile(__dirname + '/frontend/18/18.html');
});

iohandlers.handleChat(io.of('/chat'));

app.get('/chat', function(req, res) {
    res.sendFile(__dirname + '/frontend/other/socketio-chat.html');
});

iohandlers.handleChat(io.of('/19-echo'));

app.get('/19', function(req, res) {
    res.sendFile(__dirname + '/frontend/19/echo.html');
});

iohandlers.handle20(io.of('/20'));

app.get('/20/input', function(req, res) {
    res.sendFile(__dirname + '/frontend/20/input.html');
});

app.get('/20/output', function(req, res) {
    res.sendFile(__dirname + '/frontend/20/output.html');
});

iohandlers.handle21(io.of('/21-input'), io.of('/21-output'));

app.get('/21/input', function(req, res) {
    res.sendFile(__dirname + '/frontend/21/input.html');
});

app.get('/21/output', function(req, res) {
    res.sendFile(__dirname + '/frontend/21/output.html');
});

iohandlers.handle22(io.of('/22-input'), io.of('/22-output'));

app.get('/22/input', function(req, res) {
    res.sendFile(__dirname + '/frontend/22/input.html');
});

app.get('/22/output', function(req, res) {
    res.sendFile(__dirname + '/frontend/22/output.html');
});

iohandlers.handle24(io.of('/24'));

app.get('/24', function(req, res) {
    res.sendFile(__dirname + '/frontend/24/client/index.html');
});

iohandlers.handle24(io.of('/25'));

app.get('/25', function(req, res) {
    res.sendFile(__dirname + '/frontend/25/client/index.html');
});

iohandlers.handle24(io.of('/26'));

app.get('/26', function(req, res) {
    res.sendFile(__dirname + '/frontend/26/index.html');
});

app.get('/28', function(req, res) {
    res.sendFile(__dirname + '/frontend/28/quine-dom.html');
});

app.get('/28-fair', function(req, res) {
    res.sendFile(__dirname + '/frontend/28/quine-fair-browser.html');
});

iohandlers.handle24(io.of('/29'));

app.get('/29', function(req, res) {
    res.sendFile(__dirname + '/frontend/29/client/index.html');
});

iohandlers.handleBoards(io.of('/30'));

app.get('/30', function(req, res) {
    res.sendFile(__dirname + '/frontend/30/client/index.html');
});

http.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
