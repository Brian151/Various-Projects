function UIText(parent,x,y,txt,align,font,linked) {
	this.parent = parent;
	if(!font){
		this.font = {
			"w" : "bold",
			"s" : "20px",
			"f" : "Arial",
			"c" : "#000000"
		};
	} else {
		this.font = {
			"w" : font.w,
			"s" : font.s,
			"f" : font.f,
			"c" : font.c
		};
	}
	this.oX = x;
	this.oY = y;
	this.x = x;
	this.y = y;
	this.txt = txt;
	if(linked) {
		this.txt = UIDataLinker[linked];
		this.txtLink = linked;
	}
	this.textAlign = align;
	/*console.log("UI TEXT POS: " + x + " , " + y);
	console.log("UI TEXT ALIGN: " + this.textAlign);
	console.log("UI TEXT TEXT: " + this.txt);*/
	
}
UIText.prototype.tick = function() {
	//console.log("UI TEXT TICK!");
	if(this.txtLink) {
		this.txt = UIDataLinker[this.txtLink];
	}
	if (this.textAlign == "center") {
		this.x = this.parent.x + Math.round((this.parent.width / 2));
	} else if (this.textAlign == "right") {
		this.x = (this.parent.x + this.parent.width) + this.oX;
	} else if (this.textAlign == "left") {
		this.x = this.parent.x + this.oX;
	}
	this.y = this.parent.y + this.oY;
}
UIText.prototype.draw = function() {
	var tempA = GameObjs.renderer.ctx.textAlign;
	var tempC = GameObjs.renderer.ctx.fillStyle;
	GameObjs.renderer.ctx.fillStyle = this.font.c;
	GameObjs.renderer.ctx.textAlign = this.textAlign;
	var tempF = GameObjs.renderer.ctx.font;
	GameObjs.renderer.ctx.font = this.font.w + " " + this.font.s + " " + this.font.f;
	GameObjs.renderer.ctx.fillText(this.txt,this.x,this.y);
	GameObjs.renderer.ctx.textAlign = tempA;
	GameObjs.renderer.ctx.fillStyle = tempC;
	GameObjs.renderer.ctx.font = tempF;
}

var UIComponent = function(parent,x,y,w,h,configData) {
	this.parent = parent;
	this.oX = x;
	this.oY = y;
	this.overFlowX = configData.overflowX;
	this.overFlowY = configData.overflowY;
	this.x = this.parent.x + this.oX;
	this.y = this.parent.y + this.oY;
	if(configData.boundMethods) {
		for(var i=0; i< configData.boundMethods.length; i++) {
			var id = configData.boundMethods[i].id;
			var m = configData.boundMethods[i].m;
			UIFCNLinker[id] = this[m];
		}
	}
	if (this.oX < 1 && this.oX > 0) this.x = this.parent.x + Math.round((this.parent.width * this.oX));
	if (this.oY < 1 && this.oY > 0) this.y = this.parent.y + Math.round((this.parent.height * this.oY));
	if(w == "fill"){
		this.fillW = true;
		var w2 = (this.parent.x + this.parent.width) - this.x;
		this.width = w2;
	} else if (w > 0 && w < 1) {
		this.fillW = true;
		this.scaleX = w;
		console.log("UI COMPONENT X SCALE: " + this.scaleX);
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
		console.log("UI COMPONENT Y SCALE: " + this.scaleY);
	} else {
		this.height = h;
	}
	this.configData = configData;
	this.components = [];
	if(this.configData.background){
		this.hasBG = true;
		if (this.configData.background.color) {
			this.bgColor = this.configData.background.color;
		}
		if (this.configData.background.img){
			this.hasImgBG = true;
			this.bgImage = GameObjs.assets.requestAsset(this.configData.background.img);
		}
		if(!this.configData.background.img && !this.configData.background.color) this.bgColor = "#FFFFFF";
	}
	
	this.prevW = this.width;
	this.prevH = this.height;
	this.bg2 = null;
	this.resized = false;
}
UIComponent.prototype.init = function() {
	//console.log("GUI COMPONENT INIT!");
	for (var i=0; i < this.configData.components.length; i++){
		var curr = this.configData.components[i];
		switch(curr.type) {
			case "component" : {
			console.log("normal component!");
				var temp = this.components.push(new UIComponent(this,curr.x,curr.y,curr.w,curr.h,curr));
				temp--;
				break;
			}
			case "skinned_component" : {
				var temp = this.components.push(new SkinnedUIComponent(this,curr.x,curr.y,curr.w,curr.h,curr));
				temp--;
				break;
			}
			case "button" : {
				var temp = this.components.push(new UIButton(this,curr.x,curr.y,curr.w,curr.h,curr));
				temp--;
				break;
			}
			case "text" : {
				var temp = this.components.push(new UIText(this,curr.x,curr.y,curr.txt,curr.align,curr.font,curr.link));
				temp--;
				break;
			}
			default: {
				break;
			}
		}
		if(curr.components){
			this.components[temp].init();
		}
	}
}
UIComponent.prototype.customTick = function(){} //placeholder
UIComponent.prototype.tick = function() {
	if(!this.configData.freePos){
		this.x = this.parent.x + this.oX;
		this.y = this.parent.y + this.oY;
		if (this.oX < 1 && this.oX > 0) this.x = this.parent.x + Math.round((this.parent.width * this.oX));
		if (this.oY < 1 && this.oY > 0) this.y = this.parent.y + Math.round((this.parent.height * this.oY));
	}
	this.resized = false;
		
	if(this.fillW){
		if (this.scaleX) {
			this.width = Math.round(this.parent.width * this.scaleX);
		} else {
			var w2 = (this.parent.x + this.parent.width) - this.x + this.overFlowX; 
			this.width = w2;
		}
	}
	if(this.fillH){
		if (this.scaleY) {
			this.height = Math.round(this.parent.height * this.scaleY);
		} else {
			var h2 = (this.parent.y + this.parent.height) - this.y + this.overFlowY; 
			this.height = h2;
		}
	}
	if(this.prevW != this.width || this.prevH != this.height) this.resized = true;
	this.prevW = this.width;
	this.prevH = this.height;
	this.customTick();
	for (var i=0; i < this.components.length; i++){
		this.components[i].tick();
	}
}
UIComponent.prototype.customDraw = function(){} //placeholder
UIComponent.prototype.draw = function() {
	if(this.hasBG) {
		if(this.hasImgBG) {
			if(this.resized) this.bg2 = this.parent.parent.renderer.preRenderPattern(this.bgImage,this.width,this.height);
			GameObjs.renderer.drawPattern(this.bg2,this.x,this.y,this.width,this.height,true,true);
		} else {
			var tCol = GameObjs.renderer.ctx.fillStyle;
			GameObjs.renderer.ctx.fillStyle = this.bgColor;
			GameObjs.renderer.ctx.fillRect(this.x,this.y,this.width,this.height);
			GameObjs.renderer.ctx.fillStyle = tCol;
		}
	}
	this.customDraw();
	for (var i=0; i < this.components.length; i++){
		this.components[i].draw();
	}
}
UIComponent.prototype.findMainParent = function() {
	var search = this.parent;
	if (search.isUIManager) {
		out = search;
	} else {
		out = this.parent.findMainParent();
	}
	return out;
}
UIComponent.prototype.findMainParentComponent = function() {
	var search = this.parent;
	if (search.isUIManager) {
		out = this;
	} else {
		out = this.parent.findMainParent();
	}
	return out;
}
UIComponent.prototype.close = function() {
	alert("this UI Panel has been closed!");
}

function SkinnedUIComponent(parent,x,y,w,h,configData) {
	UIComponent.call(this,parent,x,y,w,h,configData);
	this.skin = new s9(this,this.x,this.y,this.width,this.height,configData.skin);
	var tData = this.configData.title;
	if (tData) {
		this.components.push(this.title = new UIText(this,tData.txt.x,tData.txt.y,tData.txt.txt,tData.txt.align,tData.txt.font));
		this.hasTitle = true;
		this.tYO = tData.txt.y;
		this.titleBar = {
		"oX" : tData.x,
		"oY" : tData.y,
		"x" : this.x + tData.x,
		"y" : this.y + tData.y,
		"width" : tData.w,
		"height" : tData.h,
		"overflowX" : tData.xO,
		"overflowY" : tData.yO
		};
		this.clicked = false;
		this.clickedElement = "";
		this.mXO = 0;
		this.mYO = 0;
		this.lTMX = false;
		this.lTMY = false;
	}
	var canResizeX = this.configData.rX;
	var canResizeY = this.configData.rY;
	if (canResizeX) {
		this.canResizeX = true;
		this.xBar = {
		"oX" : canResizeX.x,
		"oY" : canResizeX.y,
		"x" : (this.x + this.width) + canResizeX.x,
		"y" : this.y + canResizeX.y,
		"width" : canResizeX.w,
		"height" : this.height,
		"overflowX" : canResizeX.xO,
		"overflowY" : canResizeX.yO
		};
	}
	if (canResizeY) {
		this.canResizeY = true;
		this.yBar = {
		"oX" : canResizeY.x,
		"oY" : canResizeY.y,
		"x" : this.x + canResizeY.x,
		"y" : (this.y + this.height) + canResizeY.y,
		"width" : this.width,
		"height" : canResizeY.h,
		"overflowX" : canResizeY.xO,
		"overflowY" : canResizeY.yO
		};
	}
	if(canResizeX && canResizeY) {
		this.sBar = {
		"oX" : canResizeX.x,
		"oY" : canResizeY.y,
		"x" : (this.x + this.width) + canResizeX.x,
		"y" : (this.y + this.height) + canResizeY.y,
		"width" : canResizeX.w,
		"height" : canResizeY.h,
		"overflowX" : canResizeX.xO,
		"overflowY" : canResizeY.yO
		};
	}
}
SkinnedUIComponent.prototype = Object.create(UIComponent.prototype);
SkinnedUIComponent.constructor = SkinnedUIComponent;
SkinnedUIComponent.prototype.onClick = function(mDat,oDat,clickID) {
	if(!this.clicked && mDat.result && !this.findMainParent().hasFocusedUI) {
		if (oDat.x < GameObjs.controller.mouseState.mX) {
			this.mXO = GameObjs.controller.mouseState.mX - oDat.x;
			this.lTMX = true;
		}
		if (oDat.x > GameObjs.controller.mouseState.mX) {
			this.mXO = oDat.x - GameObjs.controller.mouseState.mX;
			this.lTMX = false;
		}
		if (oDat.y < GameObjs.controller.mouseState.mY) {
			this.mYO = GameObjs.controller.mouseState.mY - oDat.y;
			this.lTMY = true;
		}
		if (oDat.y > GameObjs.controller.mouseState.mY) {						
			this.mYO = oDat.y - GameObjs.controller.mouseState.mY;
			this.lTMY = false;
		}
		this.clicked = true;
		this.findMainParent().hasFocusedUI = true;
		this.findMainParent().focusUI(this.findMainParentComponent());
		this.clickedElement = clickID; 
		//console.log("onClick(" + clickID + ")!");
	}
}
SkinnedUIComponent.prototype.customTick = function(){
	if (this.hasTitle) {
		this.title.tick();
		this.titleBar.x = this.x + this.titleBar.oX;
		this.titleBar.y = this.y + this.titleBar.oY;
		this.titleBar.width = this.width + this.titleBar.overflowX;
		this.titleBar.height = this.titleBar.height;
		this.tX = this.titleBar.x;
		this.tY = this.titleBar.y;
		this.tW = this.titleBar.width;
		this.tH = this.titleBar.height;
		var mouseInTitle = GameObjs.controller.checkMouseCollision(this.titleBar);
		if(GameObjs.controller.mouseState.down) {
			this.onClick(mouseInTitle,this,"title");
		}
		if(this.clicked && this.clickedElement == "title") {
		if (this.lTMX) {
			this.x = GameObjs.controller.mouseState.mX - this.mXO;
		} else {
			this.x = GameObjs.controller.mouseState.mX - this.mXO;
		}
		if (this.LTMY) {
			this.y = GameObjs.controller.mouseState.mY + this.mYO;
		} else {
			this.y = GameObjs.controller.mouseState.mY + this.mYO;
		}
	}
	}
	if (this.canResizeX) {
		this.xBar.x = (this.x + this.width) + this.xBar.oX;
		this.xBar.y = this.y + this.xBar.oY;
		this.xBar.height = this.height;
		var mouseInWidthHandle = GameObjs.controller.checkMouseCollision(this.xBar);
		if(GameObjs.controller.mouseState.down) {
			this.onClick(mouseInWidthHandle,this.xBar,"width_handle");
		}
		if(this.clicked && this.clickedElement == "width_handle") {
			if (this.lTMX) {
				this.xBar.x = GameObjs.controller.mouseState.mX - this.mXO;
			} else {
				this.xBar.x = GameObjs.controller.mouseState.mX - this.mXO;
			}
			var diff = this.xBar.x - this.x;
			this.width = diff;
		}
	}
	if (this.canResizeY) {
		this.yBar.x = this.x + this.yBar.oX;
		this.yBar.y = (this.y + this.height) + this.yBar.oY;
		this.yBar.width = this.width;
		var mouseInHeightHandle = GameObjs.controller.checkMouseCollision(this.yBar);
		if(GameObjs.controller.mouseState.down) {
			this.onClick(mouseInHeightHandle,this.yBar,"height_handle");
		}
		if(this.clicked && this.clickedElement == "height_handle") {
			if (this.lTMY) {
				this.yBar.y = GameObjs.controller.mouseState.mY + this.mYO;
			} else {
				this.yBar.y = GameObjs.controller.mouseState.mY + this.mYO;
			}
			var diff = this.yBar.y - this.y;
			this.height = diff;
		}
	}
	if (this.canResizeX && this.canResizeY) {
		this.sBar.x = (this.x + this.width) + this.sBar.oX;
		this.sBar.y = (this.y + this.height) + this.sBar.oY;
		var mouseInSizeHandle = GameObjs.controller.checkMouseCollision(this.sBar);
		if(GameObjs.controller.mouseState.down) {
			this.onClick(mouseInSizeHandle,this.sBar,"size_handle");
		}
		if(this.clicked && this.clickedElement == "size_handle") {
			if (this.lTMX) {
				this.sBar.x = GameObjs.controller.mouseState.mX - this.mXO;
			} else {
				this.sBar.x = GameObjs.controller.mouseState.mX - this.mXO;
			}
			if (this.lTMY) {
				this.sBar.y = GameObjs.controller.mouseState.mY + this.mYO;
			} else {
				this.sBar.y = GameObjs.controller.mouseState.mY + this.mYO;
			}
			var diffX = this.sBar.x - this.x;
			var diffY = this.sBar.y - this.y;
			this.width = diffX;
			this.height = diffY;
		}
	}
	var mouseInMain = GameObjs.controller.checkMouseCollision(this);
	if(GameObjs.controller.mouseState.down) {
		this.onClick(mouseInMain,this,"main_body");
	}
	this.skin.x = this.x;
	this.skin.y = this.y;
	this.titleBar.x = this.x + this.titleBar.oX;
	this.titleBar.y = this.y + this.titleBar.oY;
	if(!GameObjs.controller.mouseState.down && this.clicked) {
	this.clicked = false;this.clickedElement = "";
	//this.findMainParent().focusedUI = null;
	this.findMainParent().hasFocusedUI = false;
	}
	this.skin.width = this.width;
	this.skin.height = this.height;
}
SkinnedUIComponent.prototype.customDraw = function(){
	this.skin.draw();
	if (this.hasTitle) {
		this.title.draw();
	}
	if(this.configData.debug) {
		GameObjs.renderer.ctx.lineWidth = 2;
		if (this.hasTitle) {
			GameObjs.renderer.ctx.strokeStyle = "#ff0000";
			GameObjs.renderer.ctx.strokeRect(this.titleBar.x,this.titleBar.y,this.titleBar.width,this.titleBar.height);
		}
		if (this.canResizeX) {
			GameObjs.renderer.ctx.strokeStyle = "#00ff00";
			GameObjs.renderer.ctx.strokeRect(this.xBar.x,this.xBar.y,this.xBar.width,this.xBar.height);
		}
		if (this.canResizeY){
			GameObjs.renderer.ctx.strokeStyle = "#0000ff";
			GameObjs.renderer.ctx.strokeRect(this.yBar.x,this.yBar.y,this.yBar.width,this.yBar.height);
		}
		if(this.canResizeX && this.canResizeY) {
			GameObjs.renderer.ctx.strokeStyle = "#00ffff";
			GameObjs.renderer.ctx.strokeRect(this.sBar.x,this.sBar.y,this.sBar.width,this.sBar.height);
		}
	}
}

var UIButton = function(parent,x,y,w,h,configData) {
	this.oX = x;
	this.oY = y;
	this.parent = parent;
	this.x = this.parent.x + Math.floor((this.parent.width/2)) - Math.round((this.width / 2));
	this.y = this.parent.y + this.oY;
	this.width = w;
	this.height = h;
	this.color = configData.color;
	this.colorOver = configData.color2;
	this.colorPress = configData.color3;
	this.currColor = this.color;
	this.selected = false;
	this.pressed = false;
	var callBack = configData.onClick;
	var scope = callBack.charAt(0);
	/*if (scope == "$") {
		var mainParent = this.findMainParentComponent();
		alert(callBack.slice(1));
		this.clickCallBack = mainParent[callBack.slice(1)];
		alert(typeof this.clickCallBack);
	}*/ //Waste of time, doesn't work, never will... screw you, JavaScript!
	if (scope == "@") {
		this.clickCallBack = UIFCNLinker[callBack.slice(1)];
	}
	this.txt = new UIText(this,configData.txt.x,configData.txt.y,configData.txt.txt,"center",configData.txt.font);
}
UIButton.prototype.tick = function(){
	this.x = this.parent.x + Math.round((this.parent.width/2)) - Math.round((this.width / 2));
	this.y = this.parent.y + this.oY;
	var mouseOver = GameObjs.controller.checkMouseCollision(this);
	if (mouseOver.result) {
		this.selected = true;
	} else {
		this.selected = false;
	}
	if(this.selected && GameObjs.controller.mouseState.down) this.pressed = true;
	if (this.selected) this.currColor = this.colorOver;
	if (this.pressed) this.currColor = this.colorPress;
	if(this.selected && this.pressed && !GameObjs.controller.mouseState.down) {
		this.pressed = false;
		this.clickCallBack();
	}
	if(!this.selected && this.pressed && !GameObjs.controller.mouseState.down) {
		this.pressed = false;
	}
	if (!this.selected) this.currColor = this.color;
	this.txt.tick();
}
UIButton.prototype.draw = function() {
	var col2 = GameObjs.renderer.ctx.fillStyle;
	GameObjs.renderer.ctx.fillStyle = this.currColor;
	GameObjs.renderer.ctx.fillRect(this.x,this.y,this.width,this.height);
	GameObjs.renderer.ctx.fillStyle = col2;
	this.txt.draw();
}
UIButton.prototype.findMainParent = function() {
	var search = this.parent;
	if (search.isUIManager) {
		out = search;
	} else {
		out = this.parent.findMainParent();
	}
	return out;
}
UIButton.prototype.findMainParentComponent = function() {
	var search = this.parent;
	if (search.isUIManager) {
		out = this;
	} else {
		out = this.parent.findMainParent();
	}
	return out;
}

var UIManager = function(parent,x,y,w,h) {
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.isUIManager = true;
	this.UIPanes = [];
}
UIManager.prototype.addPane = function(configData) {
	console.log("GUI MANAGER ADD PANEL!");
	var curr = configData;
	switch(curr.type) {
		case "component" : {
		console.log("normal component!");
			var temp = this.UIPanes.push(new UIComponent(this,curr.x,curr.y,curr.w,curr.h,curr));
			temp--;
			break;
		}
		case "skinned_component" : {
			var temp = this.UIPanes.push(new SkinnedUIComponent(this,curr.x,curr.y,curr.w,curr.h,curr));
			temp--;
			break;
		}
		default: {
			break;
		}
	}
	if(curr.components){
		this.UIPanes[temp].init();
	}
}

