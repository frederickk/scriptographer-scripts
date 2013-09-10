/**
*	Travelling Salesman Problem Isometric
*
*	Ken Frederick
*	ken.frederick@gmx.de
*
*	http://kennethfrederick.de/
*	http://blog.kennethfrederick.de/
*
*/



// ------------------------------------------------------------------------
// libraries
// ------------------------------------------------------------------------
include('../libraries/frederickkScript/frederickkScript.js');
include('../libraries/frederickkScript/TSP.js');



// ------------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------------



// load frederickkScript
var f = frederickkScript;

// document properties
var sel;

// iso grid
var gridSpacing = new Size(100, 100);
var gridIso = new Group();


// values
var values = {
	num:		9,
	spacing:	'Specified Steps',

	bRandom: 	false
};

//components
var components = {
	num: {
		type: 'number',
		fractionDigits: 0,
	},
	
	spacing: {
		type: 'list',
		label: 'Spacing',
		options: ['Specfied Distance', 'Specified Steps']
	},

	optionsRule: { 
		type: 'ruler',
		fullSize: true,
	},

	bRandom: {
		type: 'checkbox',
		label: 'Random placement'
	}

};




// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems({
		type: [Item, Path, TextItem],
		hidden: false,
		locked: false
		//selected: true
	});

	palette = new Dialog.prompt('Travelling Salesman Problem', components, values);

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

	var pt;

	// draw iso points
	for(var y=gridSpacing.height; y<artboard.bounds.height; y+=gridSpacing.height) {
		for(var x=gridSpacing.width; x<artboard.bounds.width; x+=gridSpacing.width) {
			if( values.bRandom ) {
				pt = new Point( 
					Math.random()*artboard.bounds.width,
					Math.random()*artboard.bounds.height
				);
			}
			else {
				pt = new Point(x,y);
			}

			var path = new Path.Circle(pt, 2);
			path.fillColor = new HSLColor( pt.y/artboard.bounds.height, 1.0, pt.x/artboard.bounds.width );
			path.strokeColor = null;
			path.snapIso( 2 );

			gridIso.appendTop( path );
		}
	}

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