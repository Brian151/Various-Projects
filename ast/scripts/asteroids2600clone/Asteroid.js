var Asteroid = function(parent,x,y,type) {
	this.parent = parent;
	this.x = x;
	this.y = y;
	switch (type) {
		case "small" : {
			if (this.parent.gameSettings.ast.smlTC > this.parent.gameSettings.ast.smlT.max) this.parent.gameSettings.ast.smlTC = this.parent.gameSettings.ast.smlT.min;
			var sprT = this.parent.spriteTemplates.ast[this.parent.gameSettings.ast.smlTC];
			this.type = type;
			this.rad = this.parent.gameSettings.ast.smlRad;
			this.parent.gameSettings.ast.smlTC++;
			break;
		}
		case "med" : {
			if (this.parent.gameSettings.ast.medTC > this.parent.gameSettings.ast.medT.max) this.parent.gameSettings.ast.medTC = this.parent.gameSettings.ast.medT.min;
			var sprT = this.parent.spriteTemplates.ast[this.parent.gameSettings.ast.medTC];
			this.type = type;
			this.rad = this.parent.gameSettings.ast.medRad;
			this.parent.gameSettings.ast.medTC++;
			break;
		}
		case "large" : {
			if (this.parent.gameSettings.ast.bigTC > this.parent.gameSettings.ast.bigT.max) this.parent.gameSettings.ast.bigTC = this.parent.gameSettings.ast.bigT.min;
			var sprT = this.parent.spriteTemplates.ast[this.parent.gameSettings.ast.bigTC];
			this.type = type;
			this.rad = this.parent.gameSettings.ast.bigRad;
			this.parent.gameSettings.ast.bigTC++;
			break;
		}
		default : {
			if (this.parent.gameSettings.ast.smlTC > this.parent.gameSettings.ast.smlT.max) this.parent.gameSettings.ast.smlTC = this.parent.gameSettings.ast.smlT.min;
			var sprT = this.parent.spriteTemplates.ast[this.parent.gameSettings.ast.smlTC];
			this.type = "small";
			this.parent.gameSettings.ast.smlTC++;
			break;
		}
	}
	this.spr = new ImageData(sprT.width,sprT.height);
	this.spr.data.set(sprT.data);
	if (this.parent.gameSettings.misc.colCGlobal >= this.parent.spriteTemplates.pals.length) this.parent.gameSettings.misc.colCGlobal = 0;
	var col = this.parent.spriteTemplates.pals[this.parent.gameSettings.misc.colCGlobal];
	for (var i=0; i < this.spr.data.length; i+=4) {
		var a = this.spr.data[i + 3]
		if (a > 0) {
			this.spr.data[i] = col[0];
			this.spr.data[i + 1] = col[1];
			this.spr.data[i + 2] = col[2];
		}
	}
	this.parent.gameSettings.misc.colCGlobal++;
	this.width = this.spr.width;
	this.height = this.spr.height;
	this.oX = this.width / -2;
	this.oY = this.height / -2;
	this.dir = {x:0,y:0};
	this.speed = 1;
}
Asteroid.prototype.draw = function() {
	var rX = Math.floor(this.x + this.oX);
	var rY = Math.floor(this.y + this.oY);
	var rW = this.width;
	var rH = this.height;
	this.parent.renderer.pR.putImageData(this.spr,rX,rY);
	this.parent.renderer.drawClippedImage(this.parent.renderer.preRenderingCanvas,rX,rY,rW,rH,rX,rY);
	this.parent.renderer.pR.clearRect(rX,rY,rW,rH);
}
Asteroid.prototype.tick = function() {
	this.x += (this.dir.x * this.speed);
	this.y += (this.dir.y * this.speed);
	if (this.dir.x > 0 && this.x >= 600 + this.rad) this.x = 0;
	if (this.dir.x < 0 && this.x <= 0 - this.rad) this.x = 600;
	if (this.dir.y > 0 && this.y >= 400 + this.rad) this.y = 0;
	if (this.dir.y < 0 && this.y <= 0 - this.rad) this.y = 400;
}
Asteroid.prototype.setDir = function(x,y) {
	this.dir.x = x;
	this.dir.y = y;
}
Asteroid.prototype.setSpeed = function(s) {
	this.speed = s;
}