/**
 *	FChain Example
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://cargocollective.com/kenfrederick/
 *	http://kenfrederick.blogspot.com/
 *
 *	
 *	An example of FChain
 *
 */


// ------------------------------------------------------------------------
// Libraries
// ------------------------------------------------------------------------
include('../libraries/frederickkScript/frederickkScript.js');



// ------------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------------

/**
 *	Note from the Scriptographer.org Team
 *	
 *	In Scriptographer 2.9, we switched to a top-down coordinate system and
 *	degrees for angle units as an easier alternative to radians.
 *	
 *	For backward compatibility we offer the possibility to still use the old
 *	bottom-up coordinate system and radians for angle units, by setting the two
 *	values bellow. Read more about this transition on our website:
 *	http://scriptographer.org/news/version-2.9.064-arrived/
 */

script.coordinateSystem = 'top-down';
script.angleUnits = 'radians';

// load frederickkScript
var f = frederickkScript;

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
// Update
// ------------------------------------------------------------------------
function Update(event) {
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {

	if( sel.length >= 2 ) {
		for( var i=1; i<sel.length; i+=2 ) {
			var obj1 = sel[i-1];
			var obj2 = sel[i];

			var chain = new Path.FChain( obj1, obj2 );
			chain.fillColor = obj1.fillColor;

			console.log( chain );
		}
	}
	else {
		var alert = new Dialog.alert('Error', 'More than 2 Items (Circles) must be selected');
	}

};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Animate(false);
Draw();

