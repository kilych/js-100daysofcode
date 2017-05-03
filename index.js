const http = require("http");

const server = http.createServer(function(request, response) {
    // if (request.headers['x-forwarded-proto'] == 'https')
        // response.redirect(['http://', request.get('Host'), req.url].join(''));
    // else {
        response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        response.write("#100днейкода (by kilych)");
        response.end();
    // }
});

server.listen(3000);
