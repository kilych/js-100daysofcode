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
