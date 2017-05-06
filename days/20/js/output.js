"use strict";

// $(function () {
    // init
    var canvas = document.getElementById('example'),
        context = canvas.getContext('2d');
    const height = 320,
          width = 480,
          dx = 5;
    canvas.height = height;
    canvas.width  = width;
    context.translate(width/2, height/2);
    var x = 0, y = 0;
    var socket = io.connect();

alert('1');

    const drawTriangle = (startX, startY, shift1X, shift1Y, shift2X, shift2Y) => {
              context.beginPath();
              context.moveTo(startX, startY);
              context.lineTo(startX + shift1X, startY + shift1Y);
              context.lineTo(startX + shift1X + shift2X, startY + shift1Y + shift2Y);
              context.fill();
          };

    // const drawSampleTrinangle = (startX, startY) => {
    //           drawTriangle(startX, startY, 0, 4, 4, 0);
    // };

    // http://stackoverflow.com/a/6722031
    const clear = () => {
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();
    };

alert('2');

    drawTriangle(0, 0, 0, 30, 30, 0);

    socket.on('moveon', function(msg) {
        switch (msg) {
        case 'forward':
            x += dx;
            document.write('forward<br>');
            break;
        case 'backward':
            x -= dx;
            document.write('backward<br>');
            break;
        }
        clear();
        drawTriangle(x, y, 0, 10, 10, 0);
        // $('#messages').append($('<li>').text(msg));
        // window.scrollTo(0, document.body.scrollHeight);
    });
// });
