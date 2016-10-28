//not by me... and really just common gamedev knowledge, anyways
//thx to my friend Josh for 'static class' implementation!
//see Debugger for link
var MathUtils = new function(){

}();
MathUtils.radians = function(degrees) {
	return degrees * Math.PI / 180;
}
MathUtils.degrees = function(radians) {
	return radians * 180 / Math.PI;
}
MathUtils.cartFromPolar = function(r,a) {
	var x = r * Math.cos(a);
	var y = r * Math.sin(a);
	return {x:x,y:y};
}