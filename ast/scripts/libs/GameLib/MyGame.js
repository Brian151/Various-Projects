/*not really a required file...
Just an example of how to launch/configure the game*/

Game.prototype.init = function(mainCanvas) {
	this.state = "init";
	this.assets = new AssetManager(this,"assets/");
	this.canvas = document.getElementById(mainCanvas);
	this.renderer = GameObjs.renderer = new GraphicsHandler(this.canvas);
}

Game.prototype.tick = function(){
	this.assets.tick();
	if (this.state == "init"){
		if(this.assets.queuecomplete) {
			this.state = "play";
			//console.log("start game!");
		}
	}
	
	if(this.state == "play") {
		this.draw();
	}
}

Game.prototype.draw = function(){
	
}