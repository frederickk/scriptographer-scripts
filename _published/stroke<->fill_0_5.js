/**
 *	Stroke <-> Fill 0.5
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 *
 */


// ------------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------------
// document properties
var sel;



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems({
		type: Item,
		selected: true
	});
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	for( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];
		
		//grouped
		if( obj.hasChildren() ) {
			for( var j=0; j<obj.children.length; j++ ) {
				swapStrokeFill( obj.children[j] );
			}
		}
		//singular
		else {
			swapStrokeFill( obj );
		}
	}
};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function swapStrokeFill(obj) {
	var tempStrokeColor = obj.strokeColor
	var tempFillColor = obj.fillColor

	if(obj.strokeColor != null && obj.fillColor == null) {
		obj.fillColor = tempStrokeColor;
		obj.strokeColor = null;
	}
	else if(obj.strokeColor == null && obj.fillColor != null) {
		obj.strokeColor = tempFillColor;
		obj.fillColor = null;
	}
	else if(obj.fillColor != null && obj.strokeColor != null) {
		obj.strokeColor = tempFillColor;
		obj.fillColor = tempStrokeColor;
	}
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Draw();


