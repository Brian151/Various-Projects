function AssetManager(parent) {
	this.imgs = {};
	this.snds = {};
	this.txts = {}; //soon bringing-in JQUERY/AJAX, I'm sure
	this.assetCounter = 0;
	this.assetsLoaded = 0;
	this.queuecomplete = false;
	var self = this;
	
	this.onAssetLoaded = function(){
		self.assetsLoaded += 1;
		console.log("asset load!");
	}
	
	this.loadAsset = function(type,path,id){
		if (type == "image"){
			this.assetCounter += 1;
			this.imgs[id] = new Image();
			this.imgs[id].src = path;
			this.imgs[id].onload = this.onAssetLoaded;
		}
	}
	
	this.tick = function(){
		if (this.assetsLoaded == this.assetCounter){
			this.queuecomplete = true;
		} else {
			this.queuecomplete = false;
		}
	}
	
	this.requestAsset = function(assetID) {
	var out = undefined;
	out = this.imgs[assetID];
	return out;
	}
}

function InputManager(parent) {
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
	
	this.checkMouseCollision = function(e) {
		var out = {"result":false};
		if(e.x + e.width >= this.mouseState.mX && e.x <= this.mouseState.mX && e.y + e.height >= this.mouseState.mY && e.y <= this.mouseState.mY){
			out.result = true;
			out.mX = 0 + this.mouseState.mX;
			out.mY = 0 + this.mouseState.mY;
		}
		return out;
	}
	
	this.checkKeyDown = function(keyID,keyName) {
		var out = false;
		var current = this.keyStates["K_" + keyID];
		if ((current.down) && (current.lock != "disabled")) {
			out = true;
		}
		return out;
	}
	
	this.checkKeyPress = function(keyID,keyName) {
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
	
	this.tick =  function() {
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
	
}

function GraphicsHandler(canvas) {
	this.ctx = canvas.getContext("2d");
	//this.preRenderingCanvas = null;
	//document.innerHTML += "<canvas id=\"screenP\" width=\"" + 600 + "\" height=\"" + 400 + "\"></canvas>";
	this.preRenderingCanvas = document.getElementById("screenP");
	this.pR = this.preRenderingCanvas.getContext("2d");
	//this.preRenderingCanvas.setAttribute("display","none");
	//a disgrace, this object needs to start pulling its own weight
	//Perhaps the next tech demo will focus on this!
	this.draw = function() {
	
	}
	
	this.preRenderPattern = function(src,w,h) {
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
	
	this.drawPattern = function (src,x,y,w,h,notFixed,preRendered) {
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
	
	this.drawClippedImage = function(img,x,y,w,h,ix,iy,iw,ih){
		if(!iw){
			this.ctx.drawImage(img,ix,iy,w,h,x,y,w,h);
		} else {
			this.ctx.drawImage(img,ix,iy,iw,ih,x,y,w,h);
		}
		//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
		//context.drawImage(img,ix,iy,w,h,x,y,w,h);
	}
}

function SoundSystem() {
	
}

function s9(parent,x,y,w,h,sliceData){
	this.parent = parent;
	//console.log(img);
	if(sliceData.type == "image"){
		this.isImageSlice = true;
		this.img = GameObjs.assets.requestAsset(sliceData.img);
		this.sliceData = slice9(this.img.width,this.img.height,sliceData.skin.t,sliceData.skin.r,sliceData.skin.b,sliceData.skin.l);
	} else if (sliceData.type == "color") {
		this.color = sliceData.color;
		var tempW = sliceData.w;
		var tempH = sliceData.h;
		this.sliceData = slice9(tempW,tempH,sliceData.skin.t,sliceData.skin.r,sliceData.skin.b,sliceData.skin.l);
	}
	//this.parent.renderer.ctx.drawImage(this.img,0,0);
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	//this.color = "#cccccc";
	
	//console.log(JSON.stringify(sliceData.skin));
	//console.log(JSON.stringify(this.sliceData));
	//console.log(this.img.src);
	//console.log(this.x + " , " + this.y);
	//console.log(this.width + " X " + this.height);
	this.minW = this.sliceData.middle.minW;
	this.minH = this.sliceData.middle.minH;
	
	this.tick = function(){}
	
	this.draw = function(){
		//var tcol = this.parent.renderer.ctx.fillStyle;
		//this.parent.renderer.ctx.fillStyle = this.color;
		//this.parent.renderer.ctx.fillRect(this.x-3,this.y,this.width+6,this.height);
		//this.parent.renderer.ctx.fillStyle = tcol;
		if(this.isImageSlice){
			var tl = this.sliceData.topLeft;
			var t = this.sliceData.top;
			var tr = this.sliceData.topRight;
			var r = this.sliceData.right;
			var br = this.sliceData.bottomRight;
			var b = this.sliceData.bottom;
			var bl = this.sliceData.bottomLeft;
			var l = this.sliceData.left;
			GameObjs.renderer.drawClippedImage(this.img,this.x - tl.width,this.y - tl.height,tl.width,tl.height,tl.x,tl.y);
			//this.drawClippedImage = function(img,x,y,w,h,ix,iy)
			GameObjs.renderer.drawClippedImage(this.img,this.x,this.y - t.height,this.width,t.height,t.x,t.y,t.width,t.height);
			GameObjs.renderer.drawClippedImage(this.img,this.x + this.width,this.y - tr.height,tr.width,tr.height,tr.x,tr.y);
			GameObjs.renderer.drawClippedImage(this.img,this.x - l.width,this.y,tl.width,this.height,l.x,l.y,l.width,l.height);
			GameObjs.renderer.drawClippedImage(this.img,this.x + this.width,this.y,r.width,this.height,r.x,r.y,r.width,r.height);
			GameObjs.renderer.drawClippedImage(this.img,this.x - bl.width,this.y + this.height,bl.width,bl.height,bl.x,bl.y);
			GameObjs.renderer.drawClippedImage(this.img,this.x,this.y + this.height,this.width,b.height,b.x,b.y,b.width,b.height);
			GameObjs.renderer.drawClippedImage(this.img,this.x + this.width,this.y + this.height,br.width,br.height,br.x,br.y);
		} else {
			var tempCol = GameObjs.renderer.ctx.fillStyle;
			GameObjs.renderer.ctx.fillStyle = this.color;
			var tl = this.sliceData.topLeft;
			var t = this.sliceData.top;
			var tr = this.sliceData.topRight;
			var r = this.sliceData.right;
			var br = this.sliceData.bottomRight;
			var b = this.sliceData.bottom;
			var bl = this.sliceData.bottomLeft;
			var l = this.sliceData.left;
			GameObjs.renderer.ctx.fillRect(this.x - tl.width,this.y - tl.height,tl.width,tl.height);
			GameObjs.renderer.ctx.fillRect(this.x,this.y - t.height,this.width,t.height);
			GameObjs.renderer.ctx.fillRect(this.x + this.width,this.y - tr.height,tr.width,tr.height);
			GameObjs.renderer.ctx.fillRect(this.x - l.width,this.y,tl.width,this.height);
			GameObjs.renderer.ctx.fillRect(this.x + this.width,this.y,r.width,this.height);
			GameObjs.renderer.ctx.fillRect(this.x - bl.width,this.y + this.height,bl.width,bl.height);
			GameObjs.renderer.ctx.fillRect(this.x,this.y + this.height,this.width,b.height);
			GameObjs.renderer.ctx.fillRect(this.x + this.width,this.y + this.height,br.width,br.height);
			GameObjs.renderer.ctx.fillStyle = tempCol;
		}
	}
}

function checkNull(value){
	if (typeof value === "null" || typeof value === "undefined") {
		return true;
	} else {
		return false;
	}
}

var GameObjs = {};
function Game() {
	this.state = "standby";
	var self = this;
	this.timing = 33; //approx 30 FPS
	
	this.setFPS = function(fps){
		this.timing = Math.round(1000 / fps);
	}
	
	this.focusUI = function(targetUI) {
		for (var i = 0; i < this.uiPanes.length; i++) {
			var currPane = this.uiPanes[i];
			if(currPane === targetUI) {
				this.focusedUI = currPane;
				console.log("found target UI!");
				this.uiPanes.splice(i,1);
				this.uiPanes.push(this.focusedUI);
			}
		}
	}
	
	this.init = function(canvasID) {
		this.state = "load";
		this.canvas = document.getElementById(canvasID);
		this.controller = new InputManager(this);
		this.assets = new AssetManager(this);
		this.renderer = new GraphicsHandler(this.canvas);
		this.sound = new SoundSystem(); //dead weight, sounds aren't yet implemented.
		GameObjs.controller = this.controller;
		GameObjs.assets = this.assets;
		GameObjs.renderer = this.renderer;
		GameObjs.sound = this.sound;
		this.running = true;
		this.uiPanes = [];
		this.assets.loadAsset("image","gfx/Luna-Ice.png","LunaIce");
		this.assets.loadAsset("image","gfx/Luna-IceBG.png","LunaIceBG");
		this.assets.loadAsset("image","gfx/win8-CAC_REDUX.png","Win8CAC");
		var lunaSlices = {
			"t" : 29,
			"r" : 6,
			"b" : 3,
			"l" : 6
		};
		this.popupLunaIceTemplate = {
			"type" : "skinned_component",
			"overflowX" : 0,
			"overflowY" : 0,
			"freePos" : true,
			"title" : {
				"x" : -5,
				"y" : -29,
				"w" : 0,
				"h" : 29,
				"xO" : 10,
				"yO" : 0,
				"txt" : {
					"x" : 0,
					"y" : -8,
					"txt" : "UI PANE #1",
					"align" : "center",
					"font" : {
						"w" : "bold",
						"s" : "20px",
						"f" : "Arial",
						"c" : "#000000"
					}
				}
			},
			"rX" : {
				"x" : 0,
				"y" : 0,
				"w" : 5,
				"h" : 0,
				"xO" : 0,
				"yO" : 0,
			},
			"rY" : {
				"x" : 0,
				"y" : 0,
				"w" : 0,
				"h" : 5,
				"xO" : 0,
				"yO" : 0,
			},
			"debug" : false,
			"skin" : {
				"slice" : "slice-9",
				"type" : "image",
				"skin" : lunaSlices,
				"img" : "LunaIce"
			},
			"components" : [
				{
					"id" : "bg",
					"type" : "component",
					"x" : -3,
					"y" : 0,
					"w" : "fill",
					"h" : "fill",
					"background":{
						"img" : "LunaIceBG",
						"color" : "#0077ff"
					},
					"overflowX" : 3,
					"overflowY" : 0,
				},
				{
					"id" : "half",
					"type" : "component",
					"x" : -3,
					"y" : 0,
					"w" : .5,
					"h" : "fill",
					"background":{
						"color" : "#0077ff"
					},
					"overflowX" : 3,
					"overflowY" : 0,
				}
	
			]
		};
		this.popup8Template = {
			"type" : "skinned_component",
			"overflowX" : 0,
			"overflowY" : 0,
			"freePos" : true,
			"background":{
				"color" : "#858585"
			},
			"debug" : true,
			"title" : {
				"x" : -8,
				"y" : -38,
				"w" : 0,
				"h" : 38,
				"xO" : 16,
				"yO" : 0,
				"txt" : {
					"x" : 0,
					"y" : -12,
					"txt" : "UI PANE #2",
					"align" : "left",
					"font" : {
						"w" : "bold",
						"s" : "20px",
						"f" : "Arial",
						"c" : "#00FF00"
					}
				}
			},
			"rX" : {
				"x" : 0,
				"y" : 0,
				"w" : 8,
				"h" : 0,
				"xO" : 0,
				"yO" : 0,
			},
			"rY" : {
				"x" : 0,
				"y" : 0,
				"w" : 0,
				"h" : 8,
				"xO" : 0,
				"yO" : 0,
			},
			"skin" : {
				"slice" : "slice-9",
				"type" : "image",
				"skin" : {
					"t" : 38,
					"r" : 8,
					"b" : 8,
					"l" : 8
			},
				"img" : "Win8CAC"
			},
			"components" : [
			{
				"id" : "2/3",
				"type" : "component",
				"x" : .33,
				"y" : 0,
				"w" : .33,
				"h" : "fill",
				"background":{
					"color" : "#cccccc"
				},
				"overflowX" : 0,
				"overflowY" : 0,
			},
			{
				"id" : "1/3",
				"type" : "component",
				"x" : .66,
				"y" : 0,
				"w" : .34,
				"h" : "fill",
				"background":{
					"color" : "#dddddd"
				},
				"overflowX" : 0,
				"overflowY" : 0,
			}
			]
		};
		this.sliceColorTest = {
			"type" : "skinned_component",
			"overflowX" : 0,
			"overflowY" : 0,
			"freePos" : true,
			"background" : {
				"color" : "#ffff00"
			},
			"title" : {
				"x" : -5,
				"y" : -29,
				"w" : 0,
				"h" : 29,
				"xO" : 10,
				"yO" : 0,
				"txt" : {
					"x" : 0,
					"y" : -8,
					"txt" : "UI PANE #3",
					"align" : "right",
					"font" : {
						"w" : "bold",
						"s" : "20px",
						"f" : "Arial",
						"c" : "#bb00ff"
					}
				}
			},
			"rX" : {
				"x" : 0,
				"y" : 0,
				"w" : 5,
				"h" : 0,
				"xO" : 0,
				"yO" : 0,
			},
			"rY" : {
				"x" : 0,
				"y" : 0,
				"w" : 0,
				"h" : 5,
				"xO" : 0,
				"yO" : 0,
			},
			"debug" : false,
			"skin" : {
				"slice" : "slice-9",
				"type" : "color",
				"skin" : lunaSlices,
				"color" : "#ff7700",
				"w" : 100,
				"h" : 100
			}
		};
		this.isUIManager = true;
		this.hasFocusedUI = false;
		this.focusedUI = null;
		this.x = 0;
		this.y = 0;
		//this.uiPanes.push(this.customWindow = new s9(this,10,50,400,200,"LunaIce",lunaSlices));
	}

	this.draw = function() {
		this.renderer.ctx.clearRect(0,0,1000,1000);
		for (var i=0; i < this.uiPanes.length; i++) {
			this.uiPanes[i].draw();
		}
		if(!checkNull(this.focusedUI) && this.focusedUI != null) {
			this.focusedUI.draw();
		}
	}
	
	this.tick = function() {
		//always runs:
		//end
		this.assets.tick();
		if (this.state == "load"){
			if(this.assets.queuecomplete) {
				this.state = "play";
				this.uiPanes.push(this.customWindow = new SkinnedUIComponent(this,10,50,400,200,this.popupLunaIceTemplate));
				var w2 = this.uiPanes.push(new SkinnedUIComponent(this,8,28,300,150,this.popup8Template));
				var w3 = this.uiPanes.push(new SkinnedUIComponent(this,100,100,500,250,this.sliceColorTest));
				this.customWindow.init();
				this.uiPanes[w2-1].init();
				this.uiPanes[w3-1].init();
			}
		}
		for (var i=this.uiPanes.length-1; i >= 0; i--) {
			this.uiPanes[i].tick();
		}
		
		
		//only hapens during "play" or "menu" game states:
		if(this.state == "play"){
			var up = this.controller.checkKeyDown(38);
			var right = this.controller.checkKeyDown(39);
			var down = this.controller.checkKeyDown(40);
			var left = this.controller.checkKeyDown(37);
			var cmd = this.controller.checkKeyDown(67,"C");
			cmd = false;
			if(up) this.customWindow.y--;
			if(right) this.customWindow.x++;
			if(down) this.customWindow.y++;
			if(left) this.customWindow.x--;
			if(cmd){
				var h2 = prompt("new window height: ",this.customWindow.height);
				var w2 = prompt("new window width: ",this.customWindow.width);
				//alert(w2 + " x " + h2);
				/*if(w2 < this.customWindow.minW){
					w2 = this.customWindow.minW;
					alert("specified width less than min width! Reset to min width(" + this.customWindow.minW + ")!");
				}
				if(h2 < this.customWindow.minH){
					h2 = this.customWindow.minH;
					alert("specified height less than min height! Reset to min height(" + this.customWindow.minH + ")!");
				}*/
				this.customWindow.width = Number(w2);
				this.customWindow.height = Number(h2);
			}
		}//end
		
		//only happens during the "play" game state:
		if(this.state == "play"){
			
		}//end
		
		//always runs:
		this.draw();//end
	}
}

var game = null;
var loop = null;

window.onload = function(){
	game = new Game();
	game.init("gameScreen");
	loop = setInterval(function(){game.tick();},game.timing);
}

/*
var theConsole = document.getElementById("cmdCon");
function exec(){
var cmd = theConsole.value;
var isDims = cmd.indexOf("dims");
var isPos = cmd.indexOf("pos");
if(isDims == 0) {isDims = true;console.log("dimensions");}
if(isPos == 0) {isPos = true;console.log("positon!");}
	if(game){
		if(isDims) var com = cmd.replace("dims[","");
		if(isPos) var com = cmd.replace("pos[","");
		com = com.replace("]","");
		var com2 = com.split(",");
		//alert(com);
		if(isDims){
		game.customWindow.width = Number(com2[0]);
		game.customWindow.height = Number(com2[1]);
		}
		if(isPos){
		game.customWindow.x = Math.floor(Number(com2[0]));
		game.customWindow.y = Math.floor(Number(com2[1]));
		}
	}
}
*/