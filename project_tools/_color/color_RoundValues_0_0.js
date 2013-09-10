/**
 *	Color Round Values 0.1
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
var sel;

// values
var values = {
	deci: 				2,
	snap:				1,

	colorMode:			'RGB',

	bDetails: 			false
};

// gui components
var components = {
	deci: { 
		type:			'number',
		label:			'Decimal places',
		units:			'none',
		steppers:		true
	},

	snap: {
		type:			'number',
		label:			'Snap Value',
		units:			'none',
		steppers:		true
	},

	// ------------------------------------
	modeRule: { 
		type:			'ruler',
		fullSize:		true,
	},
	colorMode: {
		label:			'Color Mode',
		options:		['RGB', 'Gray', 'CMYK'],
	},

	// ------------------------------------
	detailsRule: { 
		type:			'ruler',
		fullSize:		true,
	},
	bDetails: { 
		type:			'checkbox',
		label:			'Show details in Console'
	}

};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems({
		type: Item,
		selected: true
	});

	// initialize the dialog
	var dialog = Dialog.prompt('Color Value Round 0.1', components, values);

	values.snap /= 100;
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
	for( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];
		var col;
	
		//fill
		if(obj.fillColor != null) {
			if(values.colorMode == 'RGB') col = roundRGB( obj.fillColor );
			if(values.colorMode == 'Gray') col = roundGray( obj.fillColor );
			if(values.colorMode == 'CMYK') col = roundCMYK( obj.fillColor );
			obj.fillColor = col;
		}
	
		//stroke
		if(obj.strokeColor != null) {
			if(values.colorMode == 'RGB') col = roundRGB( obj.strokeColor );
			if(values.colorMode == 'Gray') col = roundGray( obj.strokeColor );
			if(values.colorMode == 'CMYK') col = roundCMYK( obj.strokeColor );
			obj.strokeColor = col;
		}
	}

};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function roundCMYK(col) {
	col.convert('cmyk');

	var arg0 = roundDecimal( col.cyan,		values.deci );
	var arg1 = roundDecimal( col.magenta,	values.deci );
	var arg2 = roundDecimal( col.yellow,	values.deci );
	var arg3 = roundDecimal( col.black,		values.deci );

	arg0 = snap( arg0, values.snap );
	arg1 = snap( arg1, values.snap );
	arg2 = snap( arg2, values.snap );
	arg3 = snap( arg3, values.snap );

	if( values.bDetails ) {
		console.log( type );
		console.log( 'c:\t' + arg0 + ' m:\t' + arg1 + ' y:\t' + arg2 + ' k:\t' + arg3 );
	}

	return new CMYKColor( arg0, arg1, arg2, arg3 );
};

// ------------------------------------------------------------------------
function roundRGB(col) {
	col.convert('rgb');

	var arg0 = roundDecimal( col.red,		values.deci );
	var arg1 = roundDecimal( col.green,		values.deci );
	var arg2 = roundDecimal( col.blue,		values.deci );

	arg0 = snap( arg0, values.snap );
	arg1 = snap( arg1, values.snap );
	arg2 = snap( arg2, values.snap );

	if( values.bDetails ) {
		console.log( type );
		console.log( 'r:\t' + arg0 + ' g:\t' + arg1 + ' b:\t' + arg2 );
	}

	return new RGBColor( arg0, arg1, arg2 );
};

// ------------------------------------------------------------------------
function roundGray(col) {
	col.convert('gray');

	var arg0 = roundDecimal( col.gray,		values.deci );
	arg0 = snap( arg0, values.snap );

	if( values.bDetails ) {
		console.log( type );
		console.log( 'gray:\t' + arg0 );
	}

	return new GrayColor( arg0 );
};

// ------------------------------------------------------------------------
function roundDecimal(orig, deci) {
	var multi = Math.pow(10,deci);
	return num = Math.round(orig * multi)/multi;
};

// ------------------------------------------------------------------------
function snap(value, gridSize, roundFunction) {
	if (roundFunction === undefined) roundFunction = Math.round;
	return gridSize * roundFunction(value / gridSize);
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
Draw();