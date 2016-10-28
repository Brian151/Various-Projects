var GraphicsHandler = function(canvas) {
	this.ctx = canvas.getContext("2d");
	//this.preRenderingCanvas = null;
	//document.innerHTML += "<canvas id=\"screenP\" width=\"" + 600 + "\" height=\"" + 400 + "\"></canvas>";
	this.preRenderingCanvas = document.getElementById("screenP");
	this.pR = this.preRenderingCanvas.getContext("2d");
	//this.preRenderingCanvas.setAttribute("display","none");
	//a disgrace, this object needs to start pulling its own weight
	//Perhaps the next tech demo will focus on this!
	
	//MAJOR CLEAN-UP GENERALLY REQUIRED
	
}
//empty method, subject for removal
GraphicsHandler.prototype.draw = function() {}
GraphicsHandler.prototype.preRenderPattern = function(src,w,h) {
	console.log("pre-render pattern!");
	var pat = this.pR.createPattern(src,"repeat");
	var pw = this.pR.canvas.width;
	var ph =  this.pR.canvas.height;
	this.pR.fillStyle = pat;
	this.pR.fillRect(0,0,pw,ph);
	var wt = Math.round(w);
	var ht = Math.round(h);
	var imgPat = this.pR.getImageData(0,0,wt,ht);
	return imgPat;
}
GraphicsHandler.prototype.drawPattern = function (src,x,y,w,h,notFixed,preRendered) {
	//console.log("PATTERN!");
	var img = src;
	if(notFixed){
		if(!preRendered){
		var pat = this.pR.createPattern(img,"repeat");
		this.pR.fillStyle = pat;
		var pw = this.pR.canvas.width;
		var ph =  this.pR.canvas.height;
		this.pR.fillRect(0,0,pw,ph);
		this.imgD = this.pR.getImageData(0,0,w,h);
		this.ctx.putImageData(this.imgD,x,y);
		} else {
			this.ctx.putImageData(img,x,y);
		}
	} else {
	var fillBackup = this.ctx.fillStyle;
	var pat = this.ctx.createPattern(img,"repeat");
	this.ctx.fillStyle = pat;
	this.ctx.fillRect(x,y,w,h);
	this.ctx.fillStyle = fillBackup;
	}
}
GraphicsHandler.prototype.drawClippedImage = function(img,x,y,w,h,ix,iy,iw,ih){
	if(!iw){
		this.ctx.drawImage(img,ix,iy,w,h,x,y,w,h);
	} else {
		this.ctx.drawImage(img,ix,iy,iw,ih,x,y,w,h);
	}
	//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
	//context.drawImage(img,ix,iy,w,h,x,y,w,h); //refs
}
//native draw call proxies (especially needed for vector engines)
GraphicsHandler.prototype.beginPath = function() {
	this.ctx.beginPath();
}
GraphicsHandler.prototype.closePath = function() {
	this.ctx.closePath();
}
GraphicsHandler.prototype.fill = function() {
	this.ctx.fill();
}
GraphicsHandler.prototype.stroke = function() {
	this.ctx.stroke();
}
GraphicsHandler.prototype.moveTo = function(x,y) {
	this.ctx.moveTo(x,y);
}
GraphicsHandler.prototype.lineTo = function(x,y) {
	this.ctx.lineTo(x,y);
}
GraphicsHandler.prototype.quadraticCurveTo = function(cx,cy,dx,dy) {
	this.ctx.quadraticCurveTo(cx,cy,dx,dy);
}
GraphicsHandler.prototype.bezierCurveTo = function(cx1,cy1,cx2,cy2,dx,dy) {
	this.ctx.bezierCurveTo(cx1,cy1,cx2,cy2,dx,dy);
}
GraphicsHandler.prototype.arc = function(x,y,r,a1,a2,cc) {
	this.ctx.arc(x,y,r,a1,a2,cc);
}
GraphicsHandler.prototype.arcTo = function(x1,y1,x2,y2,r) {
	this.ctx.arcTo(x1,y1,x2,y2,r);
}
GraphicsHandler.prototype.drawImage = function(img,x,y) {
	this.ctx.drawImage(img,x,y);
}
//also needs to create from source image data
GraphicsHandler.prototype.createImageData = function(w,h) {
	this.ctx.createImageData(w,h);
}
GraphicsHandler.prototype.getImageData = function(x,y,w,h) {
	this.ctx.getImageData(x,y,w,h);
}
//more stuff to support...
GraphicsHandler.prototype.putImageData = function(iDat,x,y) {
	this.ctx.putImageData(iDat,x,y);
}
GraphicsHandler.prototype.rect = function(x,y,w,h) {
	this.ctx.rect(x,y,w,h);
}
//add fill styles
GraphicsHandler.prototype.fillRect = function(x,y,w,h) {
	this.ctx.fillRect(x,y,w,h);
}
//add line styles
GraphicsHandler.prototype.strokeRect = function(x,y,w,h) {
	this.ctx.strokeRect(x,y,w,h);
}
GraphicsHandler.prototype.clearRect = function(x,y,w,h) {
	this.ctx.clearRect(x,y,w,h);
}
//clearAll()
//still WIP
/* 
future : 
beginFill()
endFill()
conditional override of 'native' methods to push to queue or frame buffer
(effectively, re-create parts (or all) of the Flash AS3 drawing API)
*/
