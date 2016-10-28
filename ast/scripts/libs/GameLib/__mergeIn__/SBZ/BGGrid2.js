/*
fork from: https://github.com/Brian151/spongebobzelda/tree/master/utils/SBZBuilder
INTENTED LIBRARY FEATURE:
POWERFUL MULTI-PURPOSE INFINITELY SCOLLING BACKGROUND CLASS
(VERY HARD TO DOCUMENT, PLEASE READ CODE FOR NOW /:)
*/
var BGGrid = function(parent,viewport,rows,cols,tw,th,img,settings) {
	this.view = viewport;
	this.rows = rows || 2;
	this.cols = cols || 2;
	this.img = img || false;
	this.tiles = [];
	this.parent = parent;
	for (var ix=0; ix < cols; ix++) {
		this.tiles.push([]);
		for (var iy=0; iy < rows; iy++) {
			if(!this.img) {
				this.tiles[ix].push({draw:function(){}});
			} else {
				this.tiles[ix].push({isImg:true,img:this.img});
			}
		}
	}
	this.settings = settings || {};
	//console.log(JSON.stringify(this.settings));
	this.tileWidth = tw;
	this.tileHeight = th;
	this.x = 0;
	this.y = 0;
	this.tX = 0;
	this.tY = 0;
	this.rx = this.view.x + this.x;
	this.ry = this.view.y + this.y;
	//console.log(this.view.x);
	//console.log(this.view.y);
	this.translatePos();
	//console.log(this.rx);
	//console.log(this.ry);
}
BGGrid.prototype.translatePos = function() {
	if (this.settings.minX) {
		if(this.x < 0) this.x = 0;
	}
	if (this.settings.minY) {
		if(this.y < 0) this.y = 0;
	}
	if (this.settings.maxX) {
		if(this.x > this.settings.maxX) this.x = this.settings.maxX;
	}
	if (this.settings.maxY) {
		if(this.y > this.settings.maxY) this.y = this.settings.maxY;
	}
	var nX = (this.x < 0);
	var nY = (this.y < 0); 
	var x2 = Math.floor(this.x/this.tileWidth) * this.tileWidth;
	var y2 = Math.floor(this.y/this.tileHeight) * this.tileHeight;
	this.tX = Math.floor(this.x/this.tileWidth);
	this.tY = Math.floor(this.y/this.tileHeight);
	var x3 = this.x - x2;
	var y3 = this.y - y2;
	if (nX) {
		x2 = Math.floor((-this.x)/this.tileWidth) * this.tileWidth;
		x3 = this.x + x2;
	}
	if (nY) {
		y2 = Math.floor((-this.y)/this.tileHeight) * this.tileHeight;
		y3 = this.y + y2;
	}
	var fX = -x3;
	var fY = -y3;
	//console.log(fX);
	//console.log(fY);
	this.rx = this.view.x + fX;
	this.ry = this.view.y + fY;
	if(nX) {
		if (this.settings.negXOff) this.rx -= this.settings.negXOff;
	}
	if(nY) { 
		if (this.settings.negYOff) this.ry -= this.settings.negYOff;
	}
}
BGGrid.prototype.draw = function() {
	var initX = this.rx;
	var initY = this.ry;
	var maxX = this.settings.maxW || this.cols;
	var maxY = this.settings.maxH || this.rows;
	if (maxX == this.cols) {
		var minX = 0;
	} else {
		var minX = this.tX;
	}
	if (maxY == this.rows) {
		var minY = 0;
	} else {
		var minY = this.tY;
	}
	var ix2 =0;
	var iy2 =0;
	for (var ix=minX; ix < maxX + minX; ix++) {
		iy2 = 0;
		for (var iy=minY; iy < maxY + minY; iy++) {
			var skip = false;
			if (ix < 0 || ix >= this.cols) skip = true;
			if (iy < 0 || iy >= this.rows) skip = true;
			if (skip) {
				iy2++;
				continue;
			} else {
				var t = this.tiles[ix][iy];
				if (t.draw) {
					var tx2 = this.rx + (ix2 * this.tileWidth);
					var ty2 = this.ry + (iy2 * this.tileHeight);
					//console.log(this.rx); //errors here
					//console.log(this.ry);
					//console.log(ix2);
					//console.log(iy2);
					//console.log(tx2);
					//console.log(ty2);
					t.draw(tx2,ty2);
				} else if (t.isImg) {
					var tx2 = this.rx + (ix2 * this.tileWidth);
					var ty2 = this.ry + (iy2 * this.tileHeight);
					this.parent.renderer.ctx.drawImage(t.img,tx2,ty2);
				}
				iy2++;
			}
		}
		ix2++;
	}
	
}