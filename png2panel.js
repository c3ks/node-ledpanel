var fs = require('fs');
var Canvas = require('canvas');
var Image = Canvas.Image;
var canvas = new Canvas(128, 16);
var ctx = canvas.getContext('2d');
var panel = require('./index');

var p = new panel.Panel(ctx, 'ledpanel.lan', 1021);
fs.readFile(process.argv[2], function(err, blackdot){
	if (err) throw err;
	img = new Image;
	img.src = blackdot;
	ctx.drawImage(img, 0, 0, img.width, img.height);
	p.draw(function() {
		console.log(arguments);
	});
});
