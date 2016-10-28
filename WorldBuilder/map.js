function drawMap(mapData,rows){
	var startX = (rows - 1) * 25;
	var y = 0;
	var x = startX;
	var tileIDs = ["M",".","w","_","x","r","T","#","@","~"];
	var tileNames = ["mountain","normal","water","normal_undiggable","water_unfillable","water_reefs","tree","swamp","hole","billboard"]; //fill later
	for (var i=0; i < mapData.length; i++) {
		var curr = mapData.charAt(i);
		for (var i2=0; i2 < tileIDs.length; i2++){
			if (curr == tileIDs[i2]) {
				var tile = tileNames[i2];
				if (tile == "billboard") {
					var tempX = x;
					x -= 50;
					//draw billboard tile
					x = tempX;
				} else {
					//draw tile
				}
				x += 25;
			}
		}
		if (curr == "\n") {
			startX -= 25;
			y += 50;
			x = startX;
		}	
	}
}