/*
main application template
far from complete
like MyGame, 100% unneccesarry and only a template
*/

var game = null;
var loop = null;

window.onload = function(){
	game = new Game();
	game.init("gameScreen");
	loop = setInterval(function(){game.tick();},game.timing);
}