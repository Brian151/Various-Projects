//input, output : textareas

function convertToJSON() {
	var src = input.value;
	var out = parseSegment(src);
	output.value = out;
}

function parseSegment(seg) {
	var s = trimOuterBrackets(seg);
	var hasChildren = detectChildren(s);
	var isObject = detectObject(s);
	var isSymbol = detectSymbol(s);
	var isArray = (!isObject && !isSymbol && hasChildren);
	var isSimple = (!isObject && !isArray)
	if (isArray) {
		var out = [];
		var childs = getChildren(s)
	} else if (isObj) {
		var out = {};
		var childs = getChildren(s);
	} else if (isSimple) {
		if (isSymbol) {
			var out = writeSymbol(s);
		} else {
			var type = getType();
			switch (type) {
				case "number" : {
					var out = writeNumber(s);
					break;
				}
				case "string" : {
					var out = writeString(s);
					break;
				}
			}
		}
	}
	if (isArray || isObj) {
		appendChildren(out,isObj);
	}
	return out;
}

function trimOuterBrackets(dat) {
	var d = dat;
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
		for (var i=0; i < bracketPairs.length; i++) {
			var lim = d.length - 1;
			var test = bracketPairs[i];
			if (test.s == 0 && test.e == lim) {
				d = d.slice(1);
				d = d.slice(0,-1);
			}
		}
	}
	return d;
}

function detectObject() {
	
}

function detectSymbol() {
	
}

function detectChildren() {
	
}

function getChildren() {
	
}

function writeSymbol() {
	
}

function getType() {
	
}

function writeNumber () {
	
}

function writeString() {
	
}

function appendChildren() {
	
}