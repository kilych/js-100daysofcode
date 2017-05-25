var width = window.innerWidth,
    height = window.innerHeight,
    length = ((width < height) ? width : height);

var canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

drawLine('horizontal', 0.2 * length, 0.4 * length, 0.6 * length);
drawLine('horizontal', 0.2 * length, 0.6 * length, 0.6 * length);
drawLine('vertical', 0.4 * length, 0.2 * length, 0.6 * length);
drawLine('vertical', 0.6 * length, 0.2 * length, 0.6 * length);

function drawLine(axisType, startX, startY, length) {
    // context.font = "bold 10px sans-serif";
    var endX = startX;
    var endY = startY;
    if (axisType == 'horizontal') {
        endX += length;
        // drawTriangle(endX, endY + 2, 4, -2, -4, -2);
        // context.fillText("x", endX, endY + 12);
        // context.fill();
    } else if (axisType == 'vertical') {
        endY += length;
        // drawTriangle(endX + 2, endY, -2, -4, -2, 4);
        // context.fillText("y", endX + 6, endY);
        // context.fill();
    }
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
}
