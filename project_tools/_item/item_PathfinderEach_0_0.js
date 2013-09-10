/**
 *	Pathfinder Each 0.0
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

//document properties
var sel;



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	//sel = activeDocument.getItems(Path, {
	sel = activeDocument.getItems({
		selected: true
	}); 
};


// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	for( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];
		
		var united = Pathfinder.unite( obj.children );
		
		obj.remove();
	}

};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Draw();
