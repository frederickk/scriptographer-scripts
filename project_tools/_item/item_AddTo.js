/**
 *	Item Add To 0.0
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

	bAddTo:			true,
	width:			0,
	height:			0,

	bArtboards:		false,
	bGroups:		false

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


	// ------------------------------------------------------------------------
	// add to
	// ------------------------------------------------------------------------
	bAddTo: {
		type: 'checkbox',
		label: 'Add To',
		onChange: function(value) {
			if(components.bAddTo.value) {
				components.width.enabled = true;
				components.height.enabled = true;
			} else {
				components.width.enabled = false;
				components.height.enabled = false;
			}
		}
	},

	width: { 
		type: 'number',
		label: 'Width',
		unit: 'pixel',
		steppers: true,
		increment: 1,
		enabled: values.bAddTo
	},
	height: { 
		type: 'number',
		label: 'Height',
		unit: 'pixel',
		steppers: true,
		increment: 1,
		enabled: values.bAddTo
	},

	addToRule: { 
		type: 'ruler',
		fullSize: true,
	},


	// ------------------------------------------------------------------------
	// artboards
	// ------------------------------------------------------------------------
	bArtboards: {
		type: 'checkbox',
		label: 'Include Artboards'
	},
	bGroups: {
		type: 'checkbox',
		label: 'Include Groups'
	}



};


// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// initialize the dialog box
	var dialog = new Dialog.prompt('Item AddTo 0.0', components, values);
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	//sel = activeDocument.getItems(Path, {
	sel = activeDocument.getItems({
		selected: true
	}); 

	//print(activeDocument.artboards.length);
	if (values.bArtboards) {
		for (var i in activeDocument.artboards) {
			artb = activeDocument.artboards[i];
			if(values.bAddTo) addTo(artb);
			roundSizes(artb);
		}		
	}

	for ( var i=0; i<sel.length; i++ ) {
		obj = sel[i];
		if(values.bAddTo) addTo(obj);
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

	if(obj.hasChildren && values.bGroups) digger(obj);
};


// ------------------------------------------------------------------------
function addTo(obj) {
	var center = obj.position;
	obj.bounds.width += values.width;
	obj.bounds.height += values.height;
	obj.position = center;
	
	if(obj.hasChildren && values.bGroups) digger(obj);
};


// ------------------------------------------------------------------------
function digger(digObj) {
	for(var k=0; k<digObj.children.length; k++) {
		if(values.bAddTo) addTo(digObj.children[k]);
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
