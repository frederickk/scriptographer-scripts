/**
 *	Type Sort & Label 0.0
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 */


// ------------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------------


// document properties
var sel;
var debug = false;

var typo = new Array();
var coord = new Array();



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	sel = activeDocument.getItems(TextItem, { selected: true }); 


	for( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];
		
		typo[i] = new Array();
		typo[i][0] = obj;
		typo[i][1] = obj.characterStyle.font.family.name;
		typo[i][2] = obj.characterStyle.font.name;
		coord[i] = new Point(obj.bounds.x, obj.bounds.y);
	
		if(debug) {
			print("orig " + i + ": " + typo[i][0]);
			print("orig " + i + ": " + coord[i]);
		}
	}

	if(debug) print("------------------------------------------------------------------------");

	var typoSort = new Array();
	typoSort = typo.sort();
	for(i=0; i<typoSort.length; i++) {
		if(debug) {
			print("sort: " + typoSort[i][1]);
			print("sort: " + typoSort[i][2]);
			print("sort: " + coord[i]);
		}
	
		var desc = new PointText(coord[i]);
		desc.characterStyle.fontSize = 8;
		desc.characterStyle.leading = 10.5;
		desc.content = typoSort[i][1] + "\r" + typoSort[i][2];
		desc.translate( new Point(0,-15) );
	
		typoSort[i][0].translate( coord[i].subtract( typoSort[i][0].bounds ) );
	}


};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Draw();
