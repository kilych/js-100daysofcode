const http = require("http");

const server = http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    response.write("#100днейкода");
    response.end();
});

server.listen(5000);
