var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/17', function(request, response) {
    response.send("#100днейкода (17th day by kilych)");
});

app.get('/18', function(req, res) {
    res.sendFile(__dirname + '/days/18/18.html');
});


app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
