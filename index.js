/*
const http = require("http");

const server = http.createServer(function(request, response) {
    if (request.headers['X-Forwarded-Proto'] == 'https')
        response.redirect(['http://', request.get('Host'), request.url].join(''));
    else {
        response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        response.write("#100днейкода (by kilych)");
        response.end();
    }
});

server.listen(5000);
*/

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

//app.use(express.static(__dirname + '/public'));

// views is directory for all template files
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    // response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    // response.write("#100днейкода (by kilych)");
    response.send("#100днейкода (by kilych)");
    // response.end();
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
