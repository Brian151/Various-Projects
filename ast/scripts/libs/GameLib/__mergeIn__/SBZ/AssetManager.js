/*
fork from: https://github.com/Brian151/spongebobzelda/tree/master/utils/SBZBuilder
INTENTED LIBRARY FEATURE:
ASSET LIBRARY DEFINITIONS
EXTREMELY USEFUL FOR ANY LARGE SCALE GAME OR APPLICATION
*/
var AssetManager = function(parent,path) {
	this.imgs = {}; //works so far
	this.snds = {}; //sounds not yet implemented!
	this.txts = {}; //XMLHTTPREQUESTS WILL BE USED!
	this.libs = {}; //WIP
	this.pendingTxts = [];
	this.assetCounter = 0;
	this.assetsLoaded = 0;
	this.queuecomplete = false;
	this.assetsPath = path;
	var self = this;
}
//see if more specific stuff can be done, test showing what asset id was loaded in debug log!
AssetManager.prototype.onAssetLoaded = function(){
	this.assetsLoaded++;
	//console.log("asset load!");
	//console.log(this.assetsLoaded);
}
AssetManager.prototype.onXMLHTTPLoaded = function(id,pendingXMLHTTP,text){
	this.txts[id] = text;
	for (var i = 0; i < this.pendingTxts.length; i++) {
		var curr = this.pendingTxts[i];
		if(curr === pendingXMLHTTP) {
			this.pendingTxts.splice(i,1);
			break;
		}
	}
	//console.log("XMLHTTP LOADED! (" + id + ")");
}
//needs to be fleshed-out further!
AssetManager.prototype.loadAsset = function(type,path,id){
	this.assetCounter++;
	var self = this;
	if (type == "image"){
		this.imgs[id] = new Image();
		this.imgs[id].src = this.assetsPath + path;
		this.imgs[id].onload = function(){self.onAssetLoaded();};
	}
	if (type == "txt") {
		var xmlhttpi = this.pendingTxts.push(new XMLHttpRequest()) - 1;
		var xmlhttp = this.pendingTxts[xmlhttpi];
			xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				self.onXMLHTTPLoaded(id,xmlhttp,xmlhttp.responseText);
				self.onAssetLoaded();
			}
		};
		xmlhttp.open("GET", this.assetsPath + path, true);
		xmlhttp.send();
	}
}
AssetManager.prototype.tick = function(){
		if (this.assetsLoaded == this.assetCounter){
			this.queuecomplete = true;
			//console.log("all assets loaded!");
		} else {
			this.queuecomplete = false;
			//console.log(this.assetsLoaded + " / " + this.assetCounter);
		}
	}
AssetManager.prototype.requestAsset = function(type,assetID) {
	var out = undefined;
	//console.log(type);
	if (type == "image") out = this.imgs[assetID];
	if (type == "txt") out = this.txts[assetID];
	return out;
}
AssetManager.prototype.loadAssetLib = function (lib) {
	var libLink = "assetLib" + lib;
	this.assetCounter++;
	var self = this;
	var xmlhttpi = this.pendingTxts.push(new XMLHttpRequest()) - 1;
	var xmlhttp = this.pendingTxts[xmlhttpi];
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			self.onXMLHTTPLoaded(libLink,xmlhttp,xmlhttp.responseText);
			self.onAssetLoaded();
			var aLibObj = JSON.parse(self.requestAsset("txt",libLink));
			self.parseAssetLib(aLibObj,lib);
		}
	};
	xmlhttp.open("GET", this.assetsPath + (lib + "/index.json"), true);
	xmlhttp.send();
}
AssetManager.prototype.parseAssetLib = function(data,lib) {
	var pre = data.preload;
	data.flags = {};
	for (var i =0; i < data.assets.length; i++) {
		var curr = data.assets[i];
		var type = curr.type;
		var url = lib + "/" + curr.file;
		var id = lib + "_" + curr.group + "_" + curr.id;
		if (!pre) pre2 = curr.preload;
		if (pre || pre2) {
			this.loadAsset(type,url,id);
			//if (!data.flags[curr.group]) data.flags[curr.group] = {};
			//data.flags[curr.group][curr.id] = {"l":true};
		} /*else {
			if (!data.flags[curr.group]) data.flags[curr.group] = {};
			data.flags[curr.group][curr.id] = {"f":url};
		}*/
	}
	this.libs[lib] = data;
}
AssetManager.prototype.requestAssetFromLib = function(lib,group,id,type) {
	var id2 = lib + "_" + group + "_" + id;
	return this.requestAsset(type,id2);
}