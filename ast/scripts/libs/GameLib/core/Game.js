/*global linker if something needs direct access to say, the AssetManager
(hint: sprites need stuff from an asset library!!!) */
var GameObjs = {};

var Game = function() {
	this.state = "standby";
	var self = this;
	this.timing = 33; //approx 30 FPS
}
Game.prototype.setFPS = function(fps){
	this.timing = Math.round(1000 / fps);
}
/*most game methods are placeholders, left intentionally empty, since the Game object is intended to
be customized to the specific programmer's desires or requirements*/
Game.prototype.init = function(canvasID) {
	this.state = "intitialize";
	this.canvas = document.getElementById(canvasID);
}
Game.prototype.draw = function() {
	this.renderer.ctx.clearRect(0,0,1000,1000); //need reliable way to deal with canvas width
}
Game.prototype.tick = function() {}