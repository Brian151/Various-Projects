

var can = document.getElementById("mycanvas");
var ctx = can.getContext("2d");

function createBitmap(w,h,s) {
	var out = new ImageData(w * s, h * s);
	for (var iy=0; iy < h; iy++) {
		for (var ix=0; ix < w; ix++) {
			var r = Math.floor(Math.random() * 256);
			var g = Math.floor(Math.random() * 256);
			var b = Math.floor(Math.random() * 256);
			var a = 255;
			var p = (((iy * w) * (4 * s)) * s) + (ix * (4 * s));
			for (var iy2=0; iy2 < s; iy2++) {
				for (var ix2=0; ix2 < s; ix2++) {
					var p2 = p + ((iy2 * w) * (4 * s)) + (ix2 * 4);
					out.data[p2] = r;
					out.data[p2 + 1] = g;
					out.data[p2 + 2] = b;
					out.data[p2 + 3] = a;
				}
			}
		}
	}
	return out;
}

function createBitmapFromTemplate(w,h,s,src,c) {
	var out = new ImageData(w * s, h * s);
	var r = c.r || 255;
	var g = c.g || 0;
	var b = c.b || 0;
	var a = 255;
	var imgT = src;
	var ip = 0;
	for (var iy=0; iy < h; iy++) {
		for (var ix=0; ix < w; ix++) {
			var p = (((iy * w) * (4 * s)) * s) + (ix * (4 * s));
			var pix = imgT[ip];
				for (var iy2=0; iy2 < s; iy2++) {
					for (var ix2=0; ix2 < s; ix2++) {
						var p2 = p + ((iy2 * w) * (4 * s)) + (ix2 * 4);
						out.data[p2] = r;
						out.data[p2 + 1] = g;
						out.data[p2 + 2] = b;
						if (pix) out.data[p2 + 3] = a;
					}
				}
			ip++;
		}
	}
	return out;
}

//var img = createBitmap(16,16,8);
var raw = {
			"w" :16,
			"h" :14,
			"px" : [
				0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,
				0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
				0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
				0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,
				0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
				1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
				1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
				1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
				0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
				0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
				0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,
				0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,
				0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,
				0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0
			]
		};
var img = createBitmapFromTemplate(raw.w,raw.h,4,raw.px,{});
ctx.putImageData(img,0,0);