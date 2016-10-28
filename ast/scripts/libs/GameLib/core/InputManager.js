var InputManager = function(parent) {
	this.parent = parent;
	var self = this;
	this.timing = 30;
	this.keyStates = {};
	this.mouseState = {
		"mX" : 0,
		"mY" : 0,
		"down" : false
	};
	
	for (var i = 0; i < 512; i++) {
		this.keyStates["K_" + i] = {
			"id": i,
			"strID": String.fromCharCode(i),
			"cooldown": this.timing,
			"state": "inactive",
			"down": false
		};
	}
	
	this.parent.canvas.addEventListener("mousemove",function(event){
		var x = event.clientX - parent.canvas.offsetLeft;
		var y = event.clientY - parent.canvas.offsetTop;
		self.mouseState.mX = x;
		self.mouseState.mY = y;
	});
	
	this.parent.canvas.addEventListener("mousedown",function(event){
		self.mouseState.down = true;
	});
	
	this.parent.canvas.addEventListener("mouseup",function(event){
		self.mouseState.down = false;
	});
	
	document.addEventListener("keydown",function(event){
	//http://stackoverflow.com/questions/8916620/disable-arrow-key-scrolling-in-users-browser
		switch(event.keyCode){
			case 37: case 39: case 38: case 40: // Arrow keys
			case 32: event.preventDefault(); break; // Space
			default: break; // do not block other keys
		}
		var current = self.keyStates["K_" + event.keyCode];
			if ((current.lock != "press") && (current.lock != "disabled")){
				current.cooldown = self.timing;
			}
			current.state = "active";
			current.down = true;
		//console.log("[controller] pressed key: " + event.keyCode);
	});
	
	document.addEventListener("keyup",function(event){
		var current = self.keyStates["K_" + event.keyCode];
			current.down = false;
			if (current.lock == "press") {
				current.lock = "enabled";
				current.cooldown = 0;
			}
	});
}
InputManager.prototype.checkMouseCollision = function(e) {
	var out = {"result":false};
	if(e.x + e.width >= this.mouseState.mX && e.x <= this.mouseState.mX && e.y + e.height >= this.mouseState.mY && e.y <= this.mouseState.mY){
		out.result = true;
		out.mX = 0 + this.mouseState.mX;
		out.mY = 0 + this.mouseState.mY;
	}
	return out;
}
InputManager.prototype.checkKeyDown = function(keyID,keyName) {
	var out = false;
	var current = this.keyStates["K_" + keyID];
	if ((current.down) && (current.lock != "disabled")) {
		out = true;
	}
	return out;
}
InputManager.prototype.checkKeyPress = function(keyID,keyName) {
	var out = false;
	var test = this.keyStates["K_" + keyID];
	if ((test.state == "active") && ((test.lock != "press") && (test.lock != "disabled"))) {
		out = true;
		test.state = "inactive";
		test.lock = "press";
		test.down = false;
		//test.cooldown = this.timing;
	}
	//console.log(out);
	return out;
}
InputManager.prototype.tick =  function() {
	for (var i =0; i < this.keyStates.length; i++) {
		var current = this.keyStates["K_" + i];
		if (current.state == "active") {
			if (current.cooldown >= 1) {
				current.cooldown--;
			} else {
				current.state = "inactive";
			}
		}
	}
}