function coordPair(x,y,x2,y2){
	return {"x":x,"y":y,"x2":x2,"y2":y2};
}

function imgClipRegion(x,y,w,h){
	return {"x":x,"y":y,"width":w,"height":h};
}

function slice9Data(x,y,w,h,lW,lH){
	var out = imgClipRegion(x,y,w,h);
	out.minW = w;
	out.minH = h;
	out.lockW = lW;
	out.lockH = lH;
	return out;
}

function slice9(w,h,t,r,b,l){
	var width = w;
	var height = h;
	var w1 = width - 1;
	var h1 = height - 1;
	var top = t;
	var right = r; 
	var bot = b;
	var left = l;
	var t1 = top - 1;
	var r1 = right - 1;
	var b1 = bot - 1;
	var l1 = left - 1;
	var orig = 0;
	var slices = {};
	slices["topLeft"] = slice9Data(0,0,left,top,true,true);
	slices["topRight"] = slice9Data(w1 - r1,0,right,top,true,true);
	slices["bottomRight"] = slice9Data(w1 - r1,h1 - b1,right,bot,true,true);
	slices["bottomLeft"] = slice9Data(0,h1 - b1,left,bot,true,true);
	var sW = (w1 - right) - l1;
	slices["top"] = slice9Data(left,0,sW,top,false,true);
	slices["bottom"] = slice9Data(left,h1 - b1,sW,bot,false,true);
	var sH = (h1 - bot) - t1;
	slices["left"] = slice9Data(0,top,left,sH,true,false);
	slices["right"] = slice9Data(w1 - r1,top,right,sH,true,false);
	slices["middle"] = slice9Data(left,top,sW,sH,false,false);
	return slices;
}

//alert(slice9(66,65,29,6,3,6).join("\n"));