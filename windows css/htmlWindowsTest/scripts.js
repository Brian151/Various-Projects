//add copyright/creds popup function
//add documentation popup function
//add other needed functions


//auto-installer for the windows skins styles
function windowsSkinInstaller() {
	var tgt = document.getElementsByClassName("?head");
	var skinFiles = new Array();
	var skinHost = ""; //public skin host URL
	skinFiles[0] = skinHost + "skins/Aero/winAero.css"; 
	skinFiles[1] = skinHost + "skins/Classic/winClassic.css"; 
	skinFiles[2] = skinHost + "skins/Luna/winLuna.css"; 
	skinFiles[3] = skinHost + "skins/btnz.css"; 
	skinFiles[4] = skinHost + "skins/texts.css"; 
	var cssEmbedPatch = "";
	for (i in skinFiles){
		cssEmbedPatch = cssEmbedPatch + "<link href=\"" + skinFiles[i] + "\" rel=\"stylesheet\" type=\"text/css\"/>";
	}
	tgt[0].innerHTML = tgt.innerHTML + cssEmbedPatch;
}

//display info texts
function displayMSG(msg){
	alert(msg);
}

//display credits
function Credz () {
	var creds = "Windows HTML/CSS3 Skins
	\nBy: ETXAlienRobot201
	\n © ETXAlienRobot201 2014
	\n\n
	Additional Credits:
	\nMicrosoft, for the Windows OS and its various themes through the year
	/*the guy who made xp aero skin i decompiled, if reply...*/
	";
	
	displayMSG(credz);
}

function classWarning () {
	var _warn = "WARNING:
	\nYou will want to avoid elements with the following
	\n\n
	\nCLASSES:
	Aero,Aero-title,btnWrapper,btntxt,btn-Aero,btn-Classic,btnz,Classic,\n
	Classic-title,Luna,Luna-title,windowTXT
	\n\n
	\nID\'s:
	Luna-Olive,Luna-Silver,Luna-title-black,Classic-Standard,
	\n\n
	\n
	These could cause conflicts,as every one of them is used by the
	\nwindows Skins.
	";
	
	displayMSG(_warn);
}

//display documentation [WIP]
function _windowsSkinDocu () {
	var _docu = "
	Windows HTML Skins
	\nVersion:
	\n\n
	Features:
	\n[1]Web Content Wrappers styled to look as much like Windows OS message boxes as possble
	\n[2]Web buttons to styled to look like Windows Buttons
	\n[3]Support for all default Windows themes, Classic-8
	\n[4]Easily customizable
	/*\n[5]TONS of icons*/
	\n\n
	\nUsage:
	\n\n
	\n[01]Installation:
	\n[1]Embed: embed the necesarry css files directly from a URL (see readme)
	\n[2]Auto-installer: call the auto-installer function to install the css for you (see readme)
	
	
	
	
	";
	
	displayMSG(credz);

} 