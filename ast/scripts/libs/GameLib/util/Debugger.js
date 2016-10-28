//thx to my friend Josh for helping get this working as a 'static class' as intended!
//https://github.com/leveleditor
var Debugger = new function(){
	this.stack = "{DEBUG LOG!}";
}();
Debugger.log = function(orig,type,dat) {
	var oT = "[" + orig + ".js] - ";
	var tT = type + " : ";
	var dT = dat;
	this.stack += "\n" + oT + tT + dT;
}
Debugger.trace = function() {
	alert(this.stack);
	console.log(this.stack);
}
Debugger.arrayToString = function(arr) {
	var out = "Array: [" + arr.join(" , ") + "]";
	return out;
}
Debugger.stringArrayToString = function(arr) {
	var arr2 = [];
	for (var i=0; i < arr.length; i++) {
		arr2.push("\"" + arr[i] + "\""));
	}
	var out = "String Array: [" + arr2.join(" , ") + "]";
	return out;
}
Debugger.objArrayToString = function(arr) {
	var arr2 = [];
	for (var i=0; i < arr.length; i++) {
		arr2.push(JSON.stringify(arr[i]));
	}
	var out = "Object Array: [" + arr2.join(" , ") + "]";
	return out;
}