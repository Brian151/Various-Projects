var Sprite = function(x,y,img,animationData) {
	this.spriteSheetImage = img;
	this.animationData = animationData;
	this.x = x;
	this.y = y;
	this.currFrame = 0;
	this.currLabel = this.animationData.labels[0];
	this.stopped = false;
	this.constrained = false;
	this.timer = 0;
	this.timing = this.animationData.timing;
}
Sprite.prototype.tick = function() {
	//this.findCurrentLabel();
	var minFrame = 0;
	var maxFrame = this.animationData.length - 1;
	if(this.constrained) {
		minFrame = this.currLabel.i;
		maxFrame = this.currLabel.e;
	}
	if(!this.stopped){
		if(!(this.timer % this.timing) && this.timer != 0) {
			this.currFrame++;
			if (this.currFrame == (maxFrame + 1)) this.currFrame = minFrame;
			this.timer = 0;
			//console.log(this.currFrame);
		}
		this.timer++;
	}
}
Sprite.prototype.draw = function(){
	//console.log("draw!");
	this.tick();
	var frame = this.animationData.frames[this.currFrame];
	GameObjs.renderer.drawClippedImage(this.spriteSheetImage,this.x,this.y,this.animationData.frameWidth,this.animationData.frameHeight,frame.x,frame.y);
}
Sprite.prototype.gotoAndStop = function(frame) {
	this.constrained = false;
	this.stopped = true;
	var foundLabel = false;
	for (var i=0; i < this.animationData.labels.length; i++) {
		var curr = this.animationData.labels[i];
		if (curr.name == frame) {
			foundLabel = true;
			this.currLabel = curr;
			break;
		}
	}
	if (foundLabel) this.currFrame = this.currLabel.i;
	if (!foundLabel) this.currFrame = frame;
}
Sprite.prototype.gotoAndPlay = function(frame) {
	this.constrained = false;
	this.stopped = false;
	var foundLabel = false;
	for (var i=0; i < this.animationData.labels.length; i++) {
		var curr = this.animationData.labels[i];
		if (curr.name == frame) {
			foundLabel = true;
			this.currLabel = curr;
			break;
		}
	}
	if (foundLabel) this.currFrame = this.currLabel.i;
	if (!foundLabel) this.currFrame = frame;
	this.timer = 0;
}
/*specifically since I don't want work with nested animations just yet,
and also because the Sprite object uses spritesheets, raising
some questions how this implementation should work exactly*/
Sprite.prototype.gotoAndPlayWithin = function(frame) {
	this.constrained = true;
	this.stopped = false;
	var foundLabel = false;
	for (var i=0; i < this.animationData.labels.length; i++) {
		var curr = this.animationData.labels[i];
		if (curr.name == frame) {
			foundLabel = true;
			this.currLabel = curr;
			break;
		}
	}
	if (foundLabel) this.currFrame = this.currLabel.i;
	if (!foundLabel) {
		console.log("failed to find label: " + frame);
		this.constrained = false;
	}
	this.timer = 0;
}
Sprite.prototype.play = function() {
	this.stopped = false;
}
Sprite.prototype.stop = function() {
	this.stopped = true;
}