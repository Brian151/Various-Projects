//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
var NameSpace = {} //namespace 

NameSpace.Animal = function(){
this.msg = "ANIMAL SPEAKS!";
};
NameSpace.Animal.prototype.talk = function(msg){
alert(this.msg);
}
NameSpace.Animal.prototype.setMsg = function(msg){
this.msg = msg;
}

NameSpace.Canine = function(){
//this.prototype = Animal.prototype;
NameSpace.Animal.call(this);
//this.prototype.msg = this.msg;
this.msg = "AROOOO!";
};
NameSpace.Canine.prototype = Object.create(NameSpace.Animal.prototype);
NameSpace.Canine.constructor = NameSpace.Canine;

NameSpace.Dog = function() {
	NameSpace.Canine.call(this);
	this.msg = "WOOF!";
};
NameSpace.Dog.prototype = Object.create(NameSpace.Canine.prototype);
NameSpace.Dog.constructor = NameSpace.Dog;


var test = new NameSpace.Dog();
var test2 = new NameSpace.Animal();
var test3 = new NameSpace.Canine();
test2.talk();
test.talk();
test3.talk();
var test4 = new NameSpace.Animal();
test4.setMsg("HI!");
test4.talk();