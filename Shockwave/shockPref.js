//input, output : textareas

function convertToJSON() {
	var src = input.value;
	var out = parseSegment(src);
	output.value = JSON.stringify(out);
}

function parseSegment(seg) {
	var s = trimWhiteSpace(trimOuterBrackets(seg));
	var children = getChildren(s);
	var hasChildren = (trimOuterBrackets(seg,true).isComplex);
	console.log(s);
	console.log("has children : " + hasChildren);
	console.log("[  " + children.join("  ,  ") + "  ]");
	var isSymbol = (detectSymbol(s) && !hasChildren);
	var isSimple = !hasChildren;
	if (isSimple) {
		console.log("is simple data : " + isSimple);
		console.log("is symbol : " + isSymbol);
		console.log(s);
		if (isSymbol) {
			var out = s; //fine as-is
			console.log("symbol!");
		} else {
			var type = getType(s);
			console.log(type);
			switch (type) {
				case "number" : {
					var out = Number(s);
					break;
				}
				case "string" : {
					var out = writeString(s);
					break;
				}
			}
		}
	} else {
		var out = {list:[],props:{}};
		appendChildren(out,children);
	}
	console.log(out);
	return out;
}

function trimOuterBrackets(dat,checkComplex) {
	var d = dat;
	var out = "";
	var bracketPairs = [];
	var currPair = -1;
	var hasFailed = false;
	for (var i=0; i < d.length; i++) {
		var currChar = d.charAt(i);
		if (currChar == "[") {
			var ID = bracketPairs.length;
			bracketPairs.push({s:i,e:null,p:currPair});
			currPair = ID;
		}
		if (currChar == "]") {
			if (currPair == -1) {
				throw new Error("INCORRECTLY NESTED BRACKETS DETECTED, ABORTING!");
				hasFailed = true;
				break;
			}
			var pair = bracketPairs[currPair];
			currPair = pair.p;
			pair.e = i;
		}
	}
	if (!hasFailed) {
		var lim = d.length - 1;
		if (checkComplex) {
			out = {isComplex:false};
		}
		for (var i=0; i < bracketPairs.length; i++) {
			var test = bracketPairs[i];
			if (test.s == 0 && test.e == lim) {
				if (checkComplex) {
					out.isComplex = true;
					break;
				} else {
					out = d.slice(1);
					out = out.slice(0,-1);
					break;
				}
			}
		}
	}
	return out;
}

function detectSymbol(s) {
	var suspect = s;
	var out = false;
	if (suspect.charAt(0) == "#") {
		out = true;
		for (var i=1; i < suspect.length; i++) {
			var curr = suspect.charAt(i);
			if (curr == ":") {
				out = false;
				break;
			}
			if (curr == "[" || curr == "#" || curr == "]" || curr == ",") {
				throw new Error("the value : " + s + "does not seem to be a valid data type!","detectSymbol");
				break;
			}
		}
	}
	console.log("detected symbol : " + out);
	return out;
}

function detectProperty(s) {
	var suspect = s;
	var out = false;
	if (suspect.charAt(0) == "#") {
		for (var i=1; i < suspect.length; i++) {
			var curr = suspect.charAt(i);
			if (curr == ":") {
				out = true;
				break;
			}
			if (curr == "[" || curr == "#" || curr == "]" || curr == ",") {
				throw new Error("the value : " + s + "does not seem to be a valid data type!","detectProperty");
				break;
			}
		}
	}
	return out;
}

function getChildren(s) {
	var section = s;
	var limit = section.length - 1;
	var out = [];
	var inString = false;
	var pending = "";
	var nestLevel = 0;
	for (var i=0; i < section.length; i++) {
		var curr = section.charAt(i);
			if (curr == "[")
				nestLevel++;
			if (curr == "]")
				nestLevel--;
			if (curr == "\"")
				inString = !inString;
			if (curr == "," && nestLevel == 0 && !inString) {
				out.push(pending);
				pending = "";
				continue;
			}
			pending += curr;
			if (i == limit)
				out.push(pending);
	}
	return out;
}

function trimWhiteSpace(s) {
	var str = s;
	var inString = false;
	var quoteTotals = 0;
	var out = "";
	for (var i=0; i < str.length; i++) {
		var curr = str.charAt(i);
		if (curr == " " || curr == "\n" || curr == "\t") {
			if (!inString)
				continue;
		}
		if (curr == "\"") {
			inString = !inString;
			quoteTotals++;
		}
		out += curr;
	}
	var test = quoteTotals - ((Math.floor(quoteTotals/2)) * 2)
	if (test > 0) throw new Error("uneven quotes detected!");
	return out;
}

function getType(s) {
	var suspect = s;
	if (suspect.charAt(0) == "\"")
		return "string";
	if (!isNaN(Number(s)))
		return "number";
}

function writeNumber (s) {
	return Number(s);
}

function writeString(s) {
	var out = s.slice(1);
	out = out.slice(0,-1);
	return String(out);
}

function getPropertyName(p) {
	var out = "";
	for (var i=0; i < p.length; i++) {
		var curr = p.charAt(i);
		if (curr == "#")
			continue;
		if (curr == ":")
			break;
		out += curr;
	}
	if (out == "") {
		throw new Error("invalid property name detected!");
	}
	return out;
}

function getPropertyValue(p) {
	var out = "";
	var ind = 0;
	for (var i=0; i < p.length; i++) {
		var curr = p.charAt(i);
		if (curr == "#")
			continue;
		if (curr == ":")
			out = p.slice(i + 1);
			break;
	}
	return out;
}

function appendChildren(obj,children) {
	for (i=0; i < children.length; i++) {
		var curr = children[i];
		var isProperty = detectProperty(curr);
		console.log("curr child is prop : " + isProperty);
		if (isProperty) {
			var ID1 = obj.list.length;
			var ID2 = getPropertyName(curr);
			var data = getPropertyValue(curr);
			obj.list.push(parseSegment(data));
			obj.props[ID2] = ID1;
		} else {
			obj.list.push(parseSegment(curr));
			console.log("current item : " + curr);
		}
	}
}