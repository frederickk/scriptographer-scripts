/**
 *	randomStack 0.0
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
//var sel = activeDocument.selectedItems;
var sel;


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

	for( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];
		var objStack = sel[ parseInt( random(0,sel.length) ) ];
	
		objStack.moveAbove( obj ); 
	}
}


// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function random(minr, maxr) {
	return minr + Math.random() * (maxr - minr);
}

function digger(digObj) {
	for(var k=0; k<digObj.children.length; k++) {
		//rot(digObj.children[k]);
		digger(digObj.children[k]);
	}
}



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
Draw();