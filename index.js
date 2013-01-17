var dgram = require("dgram");

var WIDTH = 128, HEIGHT = 16, PIXEL = WIDTH * HEIGHT;

function Panel(ctx, host, port) {
	this.ctx = ctx;
	this.buffer = new Buffer(Math.ceil(PIXEL / 8) * 2);
	this.host = host;
	this.port = port;
}
Panel.prototype = {
	toMap: function() {
		var redOctet, greenOctet, bit, offset, color, x, y;
		var data = this.ctx.getImageData(0, 0, WIDTH, HEIGHT).data;
		for(var i = 0; i < WIDTH*HEIGHT; i++) {
			x = parseInt(i % WIDTH);
			y = parseInt(i / WIDTH);
			color = [ data[i*4], data[i*4+1], data[i*4+2], data[i*4+3]];
			greenOctet = parseInt((x + (y * 2) * WIDTH) / 8);
			redOctet = parseInt((x + ((y * 2) + 1) * WIDTH) / 8);
			bit = i % 8;

			if(this.isGreen.apply(this, color))
				this.buffer[greenOctet] |= 1 << bit;
			else {
				this.buffer[greenOctet] &= ~(1 << bit);
			}

			if(this.isRed.apply(this, color))
				this.buffer[redOctet] |= 1 << bit;
			else {
				this.buffer[redOctet] &= ~(1 << bit);
			}

		}
	},
	
	isRed: function(r, g, b, a) {
		return r >= 128;
	},
	isGreen: function(r, g, b, a) {
		return g >= 128;
	},

	draw: function(cb) {
		this.toMap();
		this.send(cb);
	},

	send: function(cb) {
		var self = this;
		var socket = dgram.createSocket('udp4');
		socket.send(self.buffer, 0, self.buffer.length, self.port, self.host, function() {
			socket.close();
		});
	}
}

exports.Panel = Panel;
