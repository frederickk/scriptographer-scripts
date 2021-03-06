/**
 *	Item Rasterize Selection
 *
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
// Libraries
// ------------------------------------------------------------------------
include('../../libraries/frederickkScript/frederickkScript.js');



// ------------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------------


// load frederickkScript
var f = frederickkScript;

// document properties




// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	var sel = activeDocument.getItems( { type: Item, selected: true } );

	RasterSelection(sel);

};



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Animate(false);
Draw();

