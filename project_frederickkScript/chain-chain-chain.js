/**
 *	FColor Example
 *	Chain-Chain-Chain
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://cargocollective.com/kenfrederick/
 *	http://kenfrederick.blogspot.com/
 *
 *	
 *	An example lerping colors and connecting dots
 *	with the Travelling Salesman Problem
 *
 */

// ------------------------------------------------------------------------
// libraries
// ------------------------------------------------------------------------
include('../libraries/frederickkScript/frederickkScript.js');
include('../libraries/frederickk/TSP.js');



// ------------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------------
// load frederickkScript
var f = frederickkScript;

// document properties
var sel;

// dots
var dots;

// tsp
var RouteStep = 0;
var tsp = new TSP();




// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems({
		type: Item,
		selected: true
	});

	// create group of dots
	dots = new Group();

	// // adds segments (first one)
	// for( var i=0; i<sel.length; i++ ) {
	// 	var obj = sel[i];

	// 	if( obj.segments != undefined ) {
	// 		var pt = obj.segments[0].point;
	// 		var path = new Path.Circle(pt, obj.strokeWidth);
	// 		path.fillColor = 'white';

	// 		dots.appendTop(path);
		
	// 		obj.remove();
	// 	}
	// }

	// adds objects
	for( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];

		console.log( obj );
		dots.appendTop( obj );
		// obj.remove();
	}

	
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
	tsp.calculate( dots.children, 1000);
	tsp.draw();
	tsp.getTangents().moveBelow( dots );
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

