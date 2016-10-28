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
		console.log("load!");
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
		var imgPat = this.pR.getImageData(0,0,w,h);
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

function UIText(parent,x,y,txt,pos) {
	this.parent = parent;
	this.font = {
		"w" : "bold",
		"s" : "20px",
		"f" : "Arial",
		"c" : "#000000"
	};
	this.x = x;
	this.y = y;
	this.txt = txt;
	this.textAlign = pos;
	
	this.tick = function() {
	
	}
	
	this.draw = function() {
		var tempA = this.parent.renderer.ctx.textAlign;
		this.parent.renderer.ctx.textAlign = this.textAlign;
		var tempF = this.parent.renderer.ctx.font;
		this.parent.renderer.ctx.font = this.font.w + " " + this.font.s + " " + this.font.f;
		this.parent.renderer.ctx.fillText(this.txt,this.x,this.y);
		this.parent.renderer.ctx.textAlign = tempA;
		this.parent.renderer.ctx.font = tempF;
	}
	
}

function UIComponent(parent,x,y,w,h,color,img,xOver,yOver) {
	this.parent = parent;
	//console.log(img);
	this.oX = x;
	this.oY = y;
	this.overFlowX = xOver;
	this.overFlowY = yOver;
	this.x = this.parent.x + this.oX;
	this.y = this.parent.y + this.oY;
	if(w == "fill"){
		this.fillW = true;
		var w2 = (this.parent.x + this.parent.width) - this.x;
		this.width = w2;
	} else if (w > 0 && w < 1) {
		this.fillW = true;
		this.scaleX = w;
	} else {
		this.width = w;
	}
	if(h == "fill"){
		this.fillH = true;
		var h2 = (this.parent.x + this.parent.height) - this.y;
		this.height = w2;
	} else if (h > 0 && h < 1) {
		this.fillH = true;
		this.scaleY = h;
	} else {
		this.height = h;
	}
	if(color){
		this.bg = color;
	} else {
		this.bg = "#ffffff";
	}
	if(img) {
		this.bg = this.parent.parent.assets.requestAsset(img);
		this.hasImgBG = true;
	}
	this.prevW = this.width;
	this.prevH = this.height;
	this.bg2 = null;
	this.resized = false;
	
	this.tick = function() {
		this.x = this.parent.x + this.oX;
		this.y = this.parent.y + this.oY;
		this.resized = false;
		
		if(this.fillW){
			if (this.scaleX) {
				this.width = this.parent.width * this.scaleX;
			} else {
				var w2 = (this.parent.x + this.parent.width) - this.x + this.overFlowX; 
				this.width = w2;
			}
		}
		if(this.fillH){
			if (this.scaleY) {
				this.height = this.parent.height * this.scaleY;
			} else {
				var h2 = (this.parent.y + this.parent.height) - this.y + this.overFlowY; 
				this.height = h2;
			}
		}
		if(this.prevW != this.width || this.prevH != this.height) this.resized = true;
		this.prevW = this.width;
		this.prevH = this.height;
	}
	
	this.draw = function(){
		if(this.hasImgBG){
			if(this.resized) {
				this.bg2 = this.parent.parent.renderer.preRenderPattern(this.bg,this.width,this.height);
			}
			this.parent.parent.renderer.drawPattern(this.bg2,this.x,this.y,this.width,this.height,true,true);
		} else {
			var tCol = this.parent.parent.renderer.ctx.fillStyle;
			this.parent.parent.renderer.ctx.fillStyle = this.bg;
			this.parent.parent.renderer.ctx.fillRect(this.x,this.y,this.width,this.height);
			this.parent.parent.renderer.ctx.fillStyle = tCol;
		}
	}
}

function SkinnedUIComponent(parent,x,y,w,h,skinData) {
	this.parent = parent;
	this.oX = x;
	this.oY = y;
	this.x = this.parent.x + this.oX;
	this.y = this.parent.y + this.oY;
	if(w == "fill"){
		this.fillW = true;
	} else if (w > 0 && w < 1) {
		this.fillW = true;
		this.scaleX = w;
	} else {
		this.width = w;
	}
	if(h == "fill"){
		this.fillH = true;
	} else if (h > 0 && h < 1) {
		this.fillH = true;
		this.scaleY = h;
	} else {
		this.height = h;
	}
	//console.log(JSON.stringify(skinData));
	this.skin = new s9(this.parent.parent,this.x,this.y,this.width,this.height,skinData.img,skinData.skin);
	var tData = skinData.title;
	if (tData) {
		this.title = new UIText(this.parent.parent,this.x + (this.width/2),this.y - 8,tData.name,tData.pos);
		this.hasTitle = true;
	}
	this.tick = function() {
		this.x = this.parent.x + this.oX;
		this.y = this.parent.y + this.oY;
		this.skin.x = this.x;
		this.skin.y = this.y;
		if (this.hasTitle) {
			this.title.x = this.x + (this.width/2);
			this.title.y = this.y - 8;
		}
		
		if(this.fillW){
			if (this.scaleX) {
				this.width = this.parent.width * this.scaleX;
			} else {
				var w2 = (this.parent.x + this.parent.width) - this.x; 
				this.width = w2;
			}
		}
		if(this.fillH){
			if (this.scaleY) {
				this.height = this.parent.height * this.scaleY;
			} else {
				var h2 = (this.parent.y + this.parent.height) - this.y; 
				this.height = h2;
			}
		}
		this.skin.width = this.width;
		this.skin.height = this.height;
	}
	
	this.draw = function(){
		this.skin.draw();
		if (this.hasTitle) {
			this.title.draw();
		}
	}
}

function UIPane() {

}

function SkinnedUIPane(parent,x,y,w,h,configData) {
	this.parent = parent;
	if (!checkNull(x) && !isNaN(x)) {
		this.x = x;
	} else {
		this.x = 50;
	}
	if(!checkNull(y) && !isNaN(y)) {
		this.y = y;
	} else {
		this.y = 50;
	}
	if (!checkNull(w) && !isNaN(w)) {
		this.width = w;
	} else {
		this.width = 300;
	}
	if(!checkNull(h) && !isNaN(h)) {
		this.height = h;
	} else {
		this.height = 100;
	}
	this.config = configData;
	this.components = [];
	this.titleBar = {
		"oX" : this.config.title.x,
		"oY" : this.config.title.y,
		"x" : this.x + this.config.title.x,
		"y" : this.y + this.config.title.y,
		"width" : this.config.title.w,
		"height" : this.config.title.h,
		"overflowX" : this.config.title.xO,
		"overflowY" : this.config.title.yO
	};
	//this.components.push(new SkinnedUIComponent(this,0,0,"fill","fill",this.config.skin));
	//this.components.push(new UIComponent(this,-3,0,"fill","fill",this.config.color,this.config.bg,3,0));
	for (var i = 0; i < this.config.components.length; i++) {
		var curr = this.config.components[i];
		if (curr.type == "skinned") {
			this.components.push(new SkinnedUIComponent(this,curr.x,curr.y,curr.w,curr.h,curr.skin));
		} else if (curr.type == "component") {
			this.components.push(new UIComponent(this,curr.x,curr.y,curr.w,curr.h,curr.color,curr.bg,curr.overflowX,curr.overflowY));
		}
	}
	var tData = this.config.title;
	if (tData) {
		this.title = new UIText(this.parent,this.x + (this.width/2),this.y + tData.txt.y,tData.txt.txt,tData.txt.align);
		this.hasTitle = true;
		this.tYO = tData.txt.y;
	}
	this.clicked = false;
	this.mXO = 0;
	this.mYO = 0;
	this.lTMX = false;
	this.lTMY = false;
	
	this.tick = function(){
		this.tX = this.titleBar.x;
		this.tY = this.titleBar.y;
		this.tW = this.titleBar.width;
		this.tH = this.titleBar.height;
		if(this.tX + this.tW >= this.parent.controller.mouseState.mX && this.tX <= this.parent.controller.mouseState.mX && this.tY + this.tH >= this.parent.controller.mouseState.mY && this.tY <= this.parent.controller.mouseState.mY){
			if(this.parent.controller.mouseState.down) {
				if(!this.clicked) {
					if (this.x < this.parent.controller.mouseState.mX) {
						this.mXO = this.parent.controller.mouseState.mX - this.x;
						this.lTMX = true;
					}
					if (this.x > this.parent.controller.mouseState.mX) {
						this.mXO = this.x - this.parent.controller.mouseState.mX;
						this.lTMX = false;
					}
					if (this.y < this.parent.controller.mouseState.mY) {
						this.mYO = this.parent.controller.mouseState.mY - this.y;
						this.lTMY = true;
					}
					if (this.y > this.parent.controller.mouseState.mY) {						
						this.mYO = this.y - this.parent.controller.mouseState.mY;
						this.lTMY = false;
					}
					this.clicked = true;
				}
			}
		}
		if(this.clicked) {
			if (this.lTMX) {
				this.x = this.parent.controller.mouseState.mX - this.mXO;
			} else {
				this.x = this.parent.controller.mouseState.mX - this.mXO;
			}
			if (this.LTMY) {
				this.y = this.parent.controller.mouseState.mY + this.mYO;
			} else {
				this.y = this.parent.controller.mouseState.mY + this.mYO;
			}
		}
		if(!parent.controller.mouseState.down) this.clicked = false;
		this.titleBar.x = this.x + this.titleBar.oX;
		this.titleBar.y = this.y + this.titleBar.oY;
		this.titleBar.width = this.width + this.titleBar.overflowX;
		this.titleBar.height = this.titleBar.height;
		if (this.hasTitle) {
			this.title.x = this.x + (this.width/2)
			this.title.y = this.y + this.tYO;
		}
		for (var i=0; i < this.components.length; i++) {
			this.components[i].tick();
		}
	}
	
	this.draw = function() {
		for (var i=0; i < this.components.length; i++) {
			this.components[i].draw();
		}
		this.title.draw();
		//console.log(this.titleBar.x);
		//console.log(this.titleBar.y);
		//console.log
		//this.parent.renderer.ctx.strokeRect(this.titleBar.x,this.titleBar.y,this.titleBar.width,this.titleBar.height);
	}
}

function s9(parent,x,y,w,h,img,sliceData){
	this.parent = parent;
	//console.log(img);
	this.img = this.parent.assets.requestAsset(img);
	//this.parent.renderer.ctx.drawImage(this.img,0,0);
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.color = "#cccccc";
	this.sliceData = slice9(this.img.width,this.img.height,sliceData.t,sliceData.r,sliceData.b,sliceData.l);
	//console.log(JSON.stringify(this.sliceData));
	this.minW = this.sliceData.middle.minW;
	this.minH = this.sliceData.middle.minH;
	
	this.draw = function(){
		//var tcol = this.parent.renderer.ctx.fillStyle;
		//this.parent.renderer.ctx.fillStyle = this.color;
		//this.parent.renderer.ctx.fillRect(this.x-3,this.y,this.width+6,this.height);
		//this.parent.renderer.ctx.fillStyle = tcol;
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
		var lunaSlices = {
			"t" : 29,
			"r" : 6,
			"b" : 3,
			"l" : 6
		};
		this.popupLunaIceTemplate = {
			"type" : "skinnedPane",
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
			"components" : [
				{
					"id" : "main",
					"type" : "skinned",
					"x" : 0,
					"y" : 0,
					"w" : "fill",
					"h" : "fill",
					"skin" : {
						"skin" : lunaSlices,
						"img" : "LunaIce"
					}
				},
				{
					"id" : "bg",
					"type" : "component",
					"x" : -3,
					"y" : 0,
					"w" : "fill",
					"h" : .5,
					"color" : "#00ffff",
					"bg" : "LunaIceBG",
					"overflowX" : 3,
					"overflowY" : 0
				}
	
			]
		};
		//this.uiPanes.push(this.customWindow = new s9(this,10,50,400,200,"LunaIce",lunaSlices));
	}
	
	
	this.draw = function() {
		this.renderer.ctx.clearRect(0,0,1000,1000);
		for (var i=0; i < this.uiPanes.length; i++) {
			this.uiPanes[i].draw();
		}
	}
	
	this.tick = function() {
		//always runs:
		//end
		this.assets.tick();
		if (this.state == "load"){
			if(this.assets.queuecomplete) {
				this.state = "play";
				this.uiPanes.push(this.customWindow = new SkinnedUIPane(this,10,50,400,200,this.popupLunaIceTemplate));
			}
		}
		for (var i=0; i < this.uiPanes.length; i++) {
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