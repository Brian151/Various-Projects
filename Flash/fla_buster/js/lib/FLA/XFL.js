var Brian151 = {}; // namespace, using github handle 
Brian151.XFL = {}; // sub name space using project handle
/*
	object to contain an XFL document
*/
Brian151.XFL.XFLFile = function() {
	this file = null;
	this.library = [];
}
/*
	ADDRESS ASAP:
	
	I will say that the actual structure looks solid, 
	but I find it odd how you include XFL in every variable name.
	Brian151.XFL.file.prototype.load is probably better - once you're using the XFL object, 
	you expect that files and variables passed to it will be XFL related.
	
	Oh, and you missed a . after this
	
	- Anthony
*/
Brian151.XFL.XFLFile.prototype.loadXFL = function(bytesXFL) {
	
} 