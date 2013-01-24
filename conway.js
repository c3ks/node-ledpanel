var Canvas = require('canvas');
var Image = Canvas.Image;
var canvas = new Canvas(128, 16);
var panel = require('./index');
var ctx = canvas.getContext("2d");
var mypanel = new panel.Panel(ctx, 'ledpanel.lan', 1021);

var width = 128;
var height = 16;

var oldMap = new Array(width * height);
var newMap = new Array(width * height);

for(var i = 0; i < oldMap.length; i++) {
	oldMap[i] = Math.round(Math.random());
}


function getAlive(x, y) {
	x = (x + width) % width;
	y = (y + height) % height;
	return oldMap[x + y * width];
}

function updateAlive(x, y) {
	var isAlive = getAlive(x, y);
	var neighbour = 0;

	for(var x_ = x-1; x_ <= x+1; x_++) {
		for(var y_ = y-1; y_ <= y+1; y_++) {
			if(x_ == x && y_ == y)
				continue;
			if(getAlive(x_, y_))
				neighbour++;
		}
	}
	if(!isAlive) {
		newMap[x + y * width] = neighbour == 3;
	}
	else if(neighbour < 2)
		newMap[x + y * width] = false;
	else if(neighbour > 3)
		newMap[x + y * width] = false;
	else
		newMap[x + y * width] = true;
	return newMap[x + y * width];
}

function swapMap() {
	var tmp = newMap;
	newMap = oldMap;
	oldMap = tmp;
}

function setPixel(imageData, x, y, r, g, b, a) {
	index = (x + y * imageData.width) * 4;
	imageData.data[index+0] = r;
	imageData.data[index+1] = g;
	imageData.data[index+2] = b;
	imageData.data[index+3] = a;
}

function loop() {
	var imageData = ctx.createImageData(width, height);

	for(var x = 0; x < width; x++) {
		for(var y = 0; y < height; y++) {
			var wasAlive = getAlive(x, y);
			var alive = updateAlive(x, y);
			
			setPixel(imageData, x, y, wasAlive * 255, alive * 255, 0, 255);
		}
	}
	ctx.putImageData(imageData, 0, 0);
	mypanel.draw();
	swapMap();
}

setInterval(loop, 100);
