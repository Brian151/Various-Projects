var instr = ["!","|","["];
var drawComs = ["move","line","qCurve"];
var prefix = "ctx"
var coms = {
"move" : "moveTo",
"line" : "lineTo",
"qCurve" : "quadraticCurveTo"
};
//if these are encountered, don't treat as instruction
var noComChars = [0,1,2,3,4,5,6,7,8,9,"-","S","0","1","2","3","4","5","6","7","8","9","#"];
//tell translate if value is a x or a y, or something not needing translation
var transCon = [
["x","y"], //moveTo
["x","y"], //lineTo
["x","y","x","y"] //quadraticCurveTo
];
//draw calls need to be re-structured...
var parTable = {
	"move" : ["x","y"],
	"line" : ["x","y"],
	"qCurve" : ["cx","cy","x","y"]
};

function twips(t){return (t/20);}
function translate(v,fi,i){
	var oX = 299;
	var oY = 199;
	var scale = 2;
	var out = (v * scale);
	//console.log(fi);
	var fnc = transCon[fi];
	var mode = fnc[i];
	switch (mode) {
		case "x" : {
			out = oX + (v * scale);
			break;
		}		
		case "y" : {
			out = oY + (v * scale);
			break;
		}
		default : {
			break;
		}
	}
	return out;
}
//deal with values written-out as "#<hex>.<hex>"
//as described here: http://stackoverflow.com/questions/4077200/whats-the-meaning-of-the-non-numerical-values-in-the-xfls-edge-definition
function parseFixedPointHex(num) {
	var temp = num.slice(1);
	var temp2 = num.split(".");
	var temp3 = parseInt("0x" + temp2[0] + temp2[1],16);
	return (temp3 / 256);
}

function shapeToEdges(s) {
	var out = [];
	var pend = "";
	var max = s.length - 1;
	for (var i=0; i < s.length; i++){
		var curr = s.charAt(i);
		var found = true;
		/*for (var i2=0; i2 < instr.length; i2++) {
			var curr2 = instr[i2];
			if (curr2 == curr) {
				found = true;
				break;
			}
		}*/
		for (var i2=0; i2 < noComChars.length; i2++) {
			var curr2 = noComChars[i2];
			if (curr2 == curr) {
				found = false;
				break;
			}
		}
		if(found && i > 0) {
			out.push(pend);
			pend = "";
		}
		pend += curr;
		if (i == max) {
			out.push(pend);
		}
	}
	return out;

}

function edgesToDrawCalls(e) {
	var out = [];
	for (var i=0; i < e.length; i++) {
		var curr = e[i];
		var curr2 = curr.charAt(0);
		var curr3 = curr.slice(1);
		var dCom = "unknown";
		var found = false;
		for (var i2=0; i2 < instr.length; i2++) {
			var curr4 = instr[i2];
			if (curr2 == curr4) {
				found = true;
				dCom = drawComs[i2];
				break;
			}
		}
		if(found) {
			out.push({type:dCom,pars:curr3});
		} else {
			out.push({type:dCom,pars:curr3,orig:curr2,failed:true});
		}
	}
	return out;
}

function drawPreProccess(d) {
	var out = [];
	var prevX = 0;
	var prevY = 0;
	for (var i=0; i < d.length; i++) {
		var curr = d[i];
		if (!curr.failed) {
			var temp = {type:curr.type};
			var type2 = curr.type;
			var dat = curr.pars.split(" ");
			for (var i2 =0; i2 < dat.length; i2++) {
				var curr2 = dat[i2];
				var where = curr2.lastIndexOf("S");
				var where2 = curr.lastIndexOf("#");
				if (where >= 0) curr2 = curr2.slice(0,where);
				if (where2 >= 0) curr2 = parseFixedPointHex(curr2);
				var num = twips(Number(curr2)) + 100;
				//console.log(JSON.stringify(parTable[type2]));
				temp[parTable[type2][i2]] = num;
			}
			if (type2 == "move") {
				if ((temp.x != prevX || temp.y != prevY) || i == 0) {
					out.push(temp);
					prevX = temp.x;
					prevY = temp.y;
				}
			} else {
				out.push(temp);
				prevX = temp.x;
				prevY = temp.y;
			}
		}
	}
	return out;
}

function drawsToJavaScript(d,twip,trans) {
	var out = "ctx.fillStyle=\"#777777\";\nctx.lineWidth=2;\n";
	for (var i=0; i < d.length; i++) {
		var curr = d[i];
		var pars = [];
		var jsCom = coms[curr.type];
		var com = parTable[curr.type];
		for (var i2 =0; i2 < com.length; i2++) {
			var pID = com[i2];
			//console.log(JSON.stringify(curr));
			var num = curr[pID];
			//console.log(pID);
			pars.push(num);
		}
		out += "ctx." + jsCom + "(" + pars.join(",") + ");\n";
	}
	out += "ctx.fill();\nctx.stroke();"
	return out;
}

/*
PARS:
s = shape
m = mode "js"
t = convert twips?
t2 = translate?
*/
function edgeParser(s,m,t,t2) {
	var edges = shapeToEdges(s);
	//console.log("[ " + edges.join(" , ") + " ]");
	var draws = edgesToDrawCalls(edges);
	var draws2 = drawPreProccess(draws);
	var out = "";
	switch (m) {
		case "js" : {
			out = drawsToJavaScript(draws2,t,t2);
			break;
		}
		case "JSON" : {
			out = JSON.stringify(draws2);
			break;
		}
		case "OBJ" : {
			out = draws2;
			break;
		}
		default : {
			out = drawsToJavaScript(draws2,t,t2);
			break;
		}
	}
	//out = JSON.stringify(draws2);
	return out;
}

function getShape(){
	var dat = JSON.parse(inbox.value);
	for (var i = 0; i < dat.shape.length; i++) {
		var curr = dat.shape[i];
		var temp = [];
			for (var i2 =0; i2 < curr.edges.length; i2++) {
			var curr2 = curr.edges[i2];
			var parsedEdge = edgeParser(curr2.data,"OBJ",true,true)
			temp.push({fill0:curr2.fill0,fill1:curr2.fill1,data:parsedEdge});
		}
		curr.edges = temp;
	}
	inbox.value = JSON.stringify(dat);
}
function drawShape(){
	var dat = outbox.value;
	ctx.clearRect(0,0,cW,cH);
	ctx.beginPath();
	eval(dat);
	ctx.stroke();
}

function convertShape() {
	var dat = JSON.parse(inbox.value);
	var out = {name:dat.name,subShapes:[]};
	for (var i = 0; i < dat.shape.length; i++) {
		var curr = dat.shape[i];
		var out2 = {fillPaths:[]};
		for (var i2=0; i2 < curr.fills.length; i2++) {
			var curr2 = curr.fills[i2];
			var indexT = curr2.index;
			out2.fillPaths.push({i:curr2.index,c:curr2.color,a:curr2.alpha,paths:[]});
			for (var i3=0; i3 < curr.edges.length; i3++) {
				var curr3 = curr.edges[i3];
				if (curr3.fill0 == indexT || curr3.fill1 == indexT) {
					out2.fillPaths[i2].paths.push(curr3);
				}
			}
		}
		out.subShapes.push(out2);
	}
	outbox.value = JSON.stringify(out);
}

var shapeToParse = "!947 947S6|0 947!0 947|0 0!0 0|947 0!947 0|947 947";
var shape = edgeParser(shapeToParse,"js",true,true);
//alert(shape);
//alert("[ " + shape.join(" , ") + " ]");

/*
JS .fla shape .xml parser/converter
end goal : 
1) completely or mostly reverse-enginner .fla shape XML format 
2) document shape format
3) freeware open-source converter for .fla internal shape data 
[3a] create something more human readable
[3b] make possible proper shape asset recovery from .fla's
{3b1} as it stands, no existing converter can losslessly convert flash shapes
progress:
twips to pixels (hopefully...)
draw instructions for : moveto(), lineto(), quadCurveTo() indentified
4) optimize export...
[4a] basically, attempt to clean-up extra moveTo()'s (success: possibly unlikely...)
*/


/*
LICENSING: 
non-disclosure until further notice 
(
And if somehow you find this by accident, PLEASE keep it silent.
It is unknown how adobe woud react since the new .fla / .xfl is still a proprietary format,
despite their claims/lies ~6 years ago (2016 at present) it would become open
That said, I want something far more complete before making it public.
)
non-commercial use only
do not claim as your own
better license later when/if this becomes more complete
*/
