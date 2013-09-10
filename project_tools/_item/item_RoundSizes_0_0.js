/**
 *	Item Round Sizes 0.0
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

//values
var values = {
	deci:			0,
	bSize:			true,
	bPos:			false,
	bArtboards:		false
};

//components
var components = {
	deci: {
		type: 'number',
		label: 'Number of Decimal Places',
		fractionDigits: 0,
		increment: 1
	},
	bSize: {
		type: 'checkbox',
		label: 'Length/Width'
	},
	bPos: {
		type: 'checkbox',
		label: 'Position'
	},

	adjRule: { 
		type: 'ruler',
		fullSize: true,
	},

	bArtboards: {
		type: 'checkbox',
		label: 'Include Artboards'
	}

};


// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems(Path, {
		selected: true
	}); 

	// initialize the dialog box
	var dialog = new Dialog.prompt('Object RoundSizes 0.0', components, values);
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	if (values.bArtboards) {
		for ( var i=0; i<activeDocument.artboards.length; i++ ) {
			artb = activeDocument.artboards[i];
			roundSizes(artb);
		}		
	}

	for ( var i=0; i<sel.length; i++ ) {
		obj = sel[i];
		roundSizes(obj);
	}
};


// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function roundDecimal(orig, deci) {
	var multi = Math.pow(10,deci);
	return Math.round(orig * multi)/multi;
};

function roundSizes(obj) {
	if(values.bSize) {
		var width = roundDecimal( obj.bounds.width, values.deci );
		var height = roundDecimal( obj.bounds.height, values.deci );

		obj.bounds.width = width;
		obj.bounds.height = height;
	}
	if(values.bPos) {
		var x = roundDecimal( obj.bounds.x, values.deci );
		var y = roundDecimal( obj.bounds.y, values.deci );

		obj.bounds.x = x;
		obj.bounds.y = y;
	}

	if(obj.hasChildren) digger(obj);
};

// ------------------------------------------------------------------------
function digger(digObj) {
	for(var k=0; k<digObj.children.length; k++) {
		roundSizes(digObj.children[k]);
		
		//if(digObj.children[k].children.length > 1) {
			digger(digObj.children[k]);
		//}
	}
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Draw();
