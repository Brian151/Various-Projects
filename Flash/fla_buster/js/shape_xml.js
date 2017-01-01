function shapeXMLParser(shapeXML){
	var tL = shapeXML.getElementsByTagName("timeline")[0];
	var tL2 = tL.getElementsByTagName("DOMTimeline")[0];
	var sName = tL2.getAttribute("name");
	var layers = tL2.getElementsByTagName("layers")[0];
	var layer = layers.getElementsByTagName("DOMLayer");
	var out = {name:sName,shape:[]};
	for(var i=0; i < layer.length; i++) {
		var out2 = {};
		var frame1 = layer[i].getElementsByTagName("frames")[0];
		var frame2 = frame1.getElementsByTagName("DOMFrame")[0];
		//console.log(frame2.getAttribute("index"));
		var el = frame2.getElementsByTagName("elements")[0];
		var dShape = el.getElementsByTagName("DOMShape")[0];
		out2.fills = [];
		var fills = dShape.getElementsByTagName("fills")[0];
		var fills2 = fills.getElementsByTagName("FillStyle");
		for (var i2=0; i2 < fills2.length; i2++) {
			var currFill = fills2[i2];
			var bmpFill = currFill.getElementsByTagName("BitmapFill")[0];
			var colFill = currFill.getElementsByTagName("SolidColor")[0];
			var fillIndex = currFill.getAttribute("index");
			var hasBmp = (typeof bmpFill != "undefined");
			var hasCol = (typeof colFill != "undefined");
			var theFill = {};
			theFill.index = Number(fillIndex);
			if (hasCol) {
				var theCol = colFill.getAttribute("color");
				var theAlpha = colFill.getAttribute("alpha");
				var hasAlpha = (typeof theAlpha == "string");
				theFill.color = theCol;
				if (hasAlpha) {
					theFill.alpha = Number(theAlpha);
				} else {
					theFill.alpha = 1;
				}
				//console.log(JSON.stringify(theFill));
				out2.fills.push(theFill);
			}
			if (hasBmp) {
				
			}
		}
		//skip strokes for now...
		//edges
		out2.edges = [];
		var edges = dShape.getElementsByTagName("edges")[0];
		var edges2 = edges.getElementsByTagName("Edge");
		for (var i2=0; i2 < edges2.length; i2++) {
			var currEdge = edges2[i2];
			var eFill1 = currEdge.getAttribute("fillStyle1");
			var eFill0 = currEdge.getAttribute("fillStyle0");
			var eDat = currEdge.getAttribute("edges");
			var theEdge = {};
			if (typeof eFill0) {
				theEdge.fill0 = Number(eFill0);
			} else {
				theEdge.fill0 = 0;
			}
			if (typeof eFill1) {
				theEdge.fill1 = Number(eFill1);
			} else {
				theEdge.fill1 = 0;
			}
			theEdge.data = eDat;
			console.log(JSON.stringify(theEdge));
			out2.edges.push(theEdge);
		}
		out.shape.push(out2);
	}
	inbox.value = JSON.stringify(out);
	
}


var parser = new DOMParser();
function readXML() {
	var shape = parser.parseFromString(inbox.value,"text/xml");
	shapeXMLParser(shape);
}