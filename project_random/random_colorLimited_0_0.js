/**
 *	Random Color Limited 0.0
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
// Properties
// ------------------------------------------------------------------------


// document properties
var sel;
var colors;

// values
var values = {
	numColors:		5,
	typeColors:		'color'
};

// gui components
var components = {
	numColors: { 
		type: 'number',
		label: 'Number of\nRandom Colors',
		units: 'none',
		steppers: false
	},


	typeColors: {
		type: 'list',
		options: ['grayscale', 'color'],
		// fullSize: true
	}

};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	var dialog = new Dialog.prompt("Random Colors Limited", components, values);
	
	colors = generateColors();

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
		sel[i].fillColor = colors[ parseInt(Math.random()*colors.length) ];
	}
};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function generateColors() {
	var arr = new Array();
	for(var i=0; i<values.numColors; i++) {
		var col;
		if(values.typeColors == 'grayscale') {
			col = new GrayColor( (Math.random()*1.0) );
		}
		else {
			col = new RGBColor( (Math.random()*1.0), (Math.random()*1.0), (Math.random()*1.0) );
		}
		arr.push( col );
	}
	return arr;
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Draw();
