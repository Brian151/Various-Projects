/*
MINI LD 70 - DETERMINISM - game setup
*/

Game.prototype.init = function(mainCanvas) {
	this.state = "init";
	this.assets = new AssetManager(this,"assets/");
	this.canvas = document.getElementById(mainCanvas);
	this.renderer = GameObjs.renderer = new GraphicsHandler(this.canvas);
	this.assets.loadAsset("txt","gfxEnemy.json","enemySpr");
	this.assets.loadAsset("image","gfxPlayer.png","playerSpr");
	this.spriteTemplates = {ast:[],en:[],pals:[]};
	this.ents = [];
	this.gameSettings = {
		misc : {
			colCGlobal : 0,
			spawnRadY : 150,
			spawnRadX : 250
		},
		ast : {
			smlCC : {e:false,c:0},
			medCC : {e:false,c:0},
			medCC : {e:false,c:0},
			smlTC : 0,
			medTC : 1,
			bigTC : 2,
			smlT : {min:0,max:0},
			medT : {min:1,max:1},
			bigT : {min:2,max:3},
			smlRad : 8,
			medRad : 16,
			bigRad : 32,
			dirC : 0,
			dir : [
				{x:0,y:-1},
				{x:1,y:-1},
				{x:1,y:0},
				{x:1,y:1},
				{x:0,y:1},
				{x:-1,y:1},
				{x:-1,y:0},
				{x:-1,y:-1},
			],
			spd:{
				sml: 4,
				med: 3,
				big: 2
			}
		},
		enemy : {
			shipC : 3,
			rad : 10
		},
		player : {
			rad : 14
		},
		bullet : {
			rad: 2
		}
	}
}

Game.prototype.tick = function(){
	this.assets.tick();
	if (this.state == "init"){
		if(this.assets.queuecomplete) {
			this.state = "play";
			//console.log("start game!");
			var spriteData = JSON.parse(this.assets.requestAsset("txt","enemySpr"));
			var x0 = 0;
			for (var i=0; i < spriteData.asteroids.length; i++) {
				var bmpSprTemplate = spriteData.asteroids[i];
				this.spriteTemplates.ast.push(BitmapGenerator.fromTemplate(bmpSprTemplate.w,bmpSprTemplate.h,4,bmpSprTemplate.px,{r:255,g:255,b:255}));
				//this.renderer.putImageData(bmpSpr,x0,0);
				//x0 += (24 * 4)
			}
			for (var i=0; i< spriteData.colors.length; i++) {
				this.spriteTemplates.pals.push(spriteData.colors[i]);
			}
			//console.log(this.spriteTemplates.ast[0].data);
			this.createLevel(1);
		}
	}
	
	if(this.state == "play") {
		for (var i=0; i < this.ents.length; i++) {
			this.ents[i].tick();
		}
		this.draw();
	}
}

Game.prototype.draw = function(){
	this.renderer.fillRect(0,0,600,400);
	for (var i=0; i < this.ents.length; i++) {
		this.ents[i].draw();
	}
}

Game.prototype.createLevel = function(lvl) {
	this.bigs = lvl + 3;
	this.medsFromSplit = lvl + 2;
	this.smlsFromSplit = lvl + 1;
	this.lvl = lvl;
	this.spawnRoids();
}

Game.prototype.spawnRoids = function() {
	var angle = MathUtils.radians(-90);
	var inc = MathUtils.radians(360/this.bigs);
	for (var i = 0; i < this.bigs; i++) {
		var coords = MathUtils.cartFromPolar(this.gameSettings.misc.spawnRadX,angle);
		var coords2 = MathUtils.cartFromPolar(this.gameSettings.misc.spawnRadY,angle);
		var i2 = this.ents.length;
		this.ents.push(new Asteroid(this,300 + coords.x,200 + coords2.y,"large"));
		if (this.gameSettings.ast.dirC >= this.gameSettings.ast.dir.length) this.gameSettings.ast.dirC = 0;
		this.ents[i2].setDir(this.gameSettings.ast.dir[this.gameSettings.ast.dirC].x,this.gameSettings.ast.dir[this.gameSettings.ast.dirC].y);
		this.ents[i2].setSpeed(this.gameSettings.ast.spd.big);
		this.gameSettings.ast.dirC++;
		angle += inc;
	}
}