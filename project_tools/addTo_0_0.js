/**
 *	Add to 0.0
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
var bDone = false;


// values
var values = {
	bStroke: false,
	bTransparency: true,
	bMultiplyBy: true,

	increase: 5
};

// gui components
var components = {
	// ------------------------------------
	// stroke
	// ------------------------------------
	bStroke: { 
		type: 'checkbox',
		label: 'Stroke Width',
		onChange: function(value) {
			if( !values.bMultiplyBy ) components.increase.units = 'point';
			values.bTransparency = false;
		}
	},

	// ------------------------------------
	// trans
	// ------------------------------------
	bTransparency: { 
		type: 'checkbox',
		label: 'Transparency',
		onChange: function(value) {
			if( !values.bMultiplyBy ) components.increase.units = 'none';
			values.bStroke = false;
		}
	},

	transRule: { 
		type: 'ruler',
		fullSize: true,
	},

	// ------------------------------------
	// value
	// ------------------------------------
	bMultiplyBy: { 
		type: 'checkbox',
		label: 'Multiply by',
		onChange: function(value) {
			components.increase.units = 'percent';
			//components.increase.min: 0,
			// values.increase = 100;
		}
	},

	increase: { 
		type: 'number',
		label: 'Amount of Change',
		// units: 'percent',
		steppers: true,
		increment: 10,
		//min: -100,
		//max: 100
	},

	increaseRule: { 
		type: 'ruler',
		fullSize: true,
	},

	// ------------------------------------
	// Invocation
	// ------------------------------------
	submit: { 
		type: 'button', 
		value: 'Apply',
		onClick: function() {
			Draw();
		}
	}
};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// initialize the palette window
	var palette = new Palette('Add to 0.0', components, values);
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
	// document properties
	sel = activeDocument.getItems({
		type: Item,
		selected: true
	});

	//print(sel.length);
	for( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];

		if( obj.hasChildren() ) {
			//grouped
			recursive(obj);
		} 
		else {
			//singular
			addTo( obj );
		}
	}

};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function recursive(obj) {
	if( obj.hasChildren() ) {
		for( j in obj.children ) recursive(obj.children[j]);
	}
	else {
		addTo( obj );
	}
};

// ------------------------------------------------------------------------
function addTo(obj) {
	//stroke
	if( values.bStroke && !bDone) {
		//if(obj.fillColor != null && obj.strokeColor != null) {
		if(obj.strokeColor != null) {
			print( (values.increase/100) );
			if( values.bMultiplyBy ) obj.strokeWidth += (values.increase/100);
			else obj.strokeWidth += values.increase;
			
		}
		else {
			//bDone = true;
			//Dialog.alert('Stroke and/or Fill is a spot color\nplease convert to RGB or CMYK');
		}
	}

	//trans
	if( values.bTransparency && !bDone ) {
		if( values.bMultiplyBy ) obj.opacity *= (values.increase/100);
		else obj.opacity += values.increase;
	}
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
//Draw();


