var SpriteData = function(configData) {
	this.width = configData.width;
	this.height = configData.height;
	this.x = configData.x;
	this.y = configData.y;
	this.frameWidth = configData.sW;
	this.frameHeight = configData.sH;
	this.frames = [];
	this.labels = configData.labels;
	this.length = configData.length;
	this.timings = configData.timings;
	this.timing = configData.timing;
	var excludedFrames = configData.cutFrames;
	var i3 = 0;
	
	for (var i = 0; i < this.height; i += this.frameHeight) {
		for (var i2 = 0; i2 < this.width; i2 += this.frameWidth) {
			if (i2 + this.frameHeight <= this.width) {
				var copyFrame = true;
				for(var i4=0; i4 < excludedFrames.length; i4++) {
					var curr = excludedFrames[i4];
					if (curr == i3) {
						copyFrame = false;
						console.log("do not copy frame! (" + curr + ")");
						excludedFrames.splice(i4,1);
						break;
					}
				}
				if (copyFrame) this.frames.push({"x":this.x + i2,"y":this.y + i,"w":this.frameWidth,"h":this.frameHeight});
				i3++;
			} else {
				break;
			}
		}
		if (i + this.frameHeight <= this.height) {
			//nothing needs happen
		} else {
			break;
		}
	}
	//console.log(JSON.stringify(this.frames));
}