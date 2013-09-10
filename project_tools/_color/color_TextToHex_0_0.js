/**
 *	textToHex 0.0
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


var sel;
var marker;


// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
}

// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
}

// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	// document properties
	sel = activeDocument.getItems({
		type: Item,
		selected: true
	});

	for(var i=0; i<sel.length; i++) {
		obj = sel[i];
		
		var text = obj.content;
		var red = obj.words[0].content;
		var green = obj.words[1].content;
		var blue = obj.words[2].content;

		//print( red + "," + green + "," + blue );

		var node = new Path.Circle( obj.point, 15);
		node.fillColor = new RGBColor(red/255,green/255,blue/255);
		node.strokeColor = null;
	}

}

// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function random(minr, maxr) {
	return minr + Math.random() * (maxr - minr);
}


// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
Draw();