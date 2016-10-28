var BitmapGenerator = new function() {

}
BitmapGenerator.fromTemplate = function(w,h,s,src,c) {
	var out = new ImageData(w * s, h * s);
	if (c) {
		var r = c.r;
		var g = c.g;
		var b = c.b;
	} else {
		var r = 255;
		var g = 0;
		var b = 0;
	}
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
						if (pix > 0) {
							out.data[p2 + 3] = a;
						} else {
							out.data[p2] = 0;
							out.data[p2 + 1] = 0;
							out.data[p2 + 2] = 0;
							out.data[p2 + 3] = 0;
						}
					}
				}
			ip++;
		}
	}
	return out;
}