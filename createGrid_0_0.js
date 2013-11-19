/**
 *	Create Grid
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
include('libraries/folio/scriptographer.folio.js');



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
// script.coordinateSystem = 'bottom-up';
script.angleUnits = 'radians';


// load folio
var f = folio;

var fio = f.FIO;

// document properties
var group;
var groupMargins;
var groupRowsCols;
var palette;


// conversions
var ptToMm = 0.352777778;
var mmToPt = 2.83464567;

var ptToIn = 0.0138888889;
var inToPt = 72;

var ptToPi = 0.0833333333;
var piToPt = 12;


// values
var settingsFile = '.createGrid.cpValues'; // this is a hidden file
var values = {
	// default unit of measure
	unit:			'millimeter',
	valDef:			6*mmToPt,

	// sizes
	sizeWidth:		activeDocument.activeArtboard.bounds.width,
	sizeHeight:		activeDocument.activeArtboard.bounds.height,
	bUseArtBoard:	true,


	// margins
	marginTop:		this.valDef,
	marginBottom:	this.valDef,
	marginLeft:		this.valDef,
	marginRight:	this.valDef,


	// rows
	rows:			0,
	rowGutter:		this.valDef,


	// cols
	cols:			0,
	colGutter:		this.valDef,


	// options
	bRemoveExist:	false,
	bAllArtboards:	true,
};


// gui components
var components = {
	// ------------------------------------
	// flyout menu
	// ------------------------------------
	bMmUnit: {
		type:		'menu-entry',
		value:		'millimeter',
		onSelect: function() {
			values.unit = 'millimeter';
			values.valDef = 6*mmToPt;
			updatePalette(values.unit, values.valDef);
		}
	},
	bInUnit: {
		type:		'menu-entry',
		value:		'inch',
		onSelect: function() {
			values.unit = 'inch';
			values.valDef = 0.5*inToPt;
			updatePalette(values.unit, values.valDef);
		}
	},
	bPiUnit: {
		type:		'menu-entry',
		value:		'pica',
		onSelect: function() {
			values.unit = 'pica';
			values.valDef = 3*piToPt;
			updatePalette(values.unit, values.valDef);
		}
	},
	bPtUnit: {
		type:		'menu-entry',
		value:		'point/pixel',
		onSelect: function() {
			values.unit = 'point';
			values.valDef = 36;
			updatePalette(values.unit, values.valDef);
		}
	},


	// ------------------------------------
	// margins
	// ------------------------------------
	sizeRule: {
		type: 			'ruler',
		label: 			'Size',
		fullSize: 		true,
	},

	sizeWidth: {
		type:			'number',
		label:			'Width',
		units:			values.unit,
		steppers:		true,
		fractionDigits:	2,
		enabled: false
	},
	sizeHeight: {
		type:			'number',
		label:			'Height',
		units:			values.unit,
		steppers:		true,
		fractionDigits:	2,
		enabled: false
	},

	bUseArtBoard: {
		type:		'checkbox',
		label:		'Use Size\nof Artboard(s)',
		onChange: function(value) {
			components.sizeWidth.enabled = !value;
			components.sizeHeight.enabled = !value;
		}
	},


	// ------------------------------------
	// margins
	// ------------------------------------
	marginRule: {
		type: 			'ruler',
		label: 			'Margins',
		fullSize: 		true,
	},

	marginTop: {
		type:			'number',
		label:			'Top',
		units:			values.unit,
		steppers:		true,
		fractionDigits:	2,
	},
	marginBottom: {
		type:			'number',
		label:			'Bottom',
		units:			values.unit,
		steppers:		true,
		fractionDigits:	2,
	},
	marginLeft: {
		type:			'number',
		label:			'Left',
		units:			values.unit,
		steppers:		true,
		fractionDigits:	2,
	},
	marginRight: {
		type:			'number',
		label:			'Right',
		units:			values.unit,
		steppers:		true,
		fractionDigits:	2,
	},

	// ------------------------------------
	// rows
	// ------------------------------------
	rowRule: {
		type: 			'ruler',
		label: 			'Rows',
		fullSize: 		true,
	},

	rows: {
		type:			'number',
		label:			'Number',
		units:			'none',
		fractionDigits:	0,
	},
	rowGutter: {
		type:			'number',
		label:			'Gutter',
		units:			values.unit,
		fractionDigits:	2,
	},


	// ------------------------------------
	// cols
	// ------------------------------------
	colRule: {
		type: 			'ruler',
		label: 			'Columns',
		fullSize: 		true,
	},

	cols: {
		type:			'number',
		label:			'Number',
		units:			'none',
		fractionDigits:	0,
	},
	colGutter: {
		type:			'number',
		label:			'Gutter',
		units:			values.unit,
		fractionDigits:	2,
	},


	// ------------------------------------
	// options
	// ------------------------------------
	optionsRule: {
		type: 			'ruler',
		label: 			'Options',
		fullSize: 		true,
	},

	bRemoveExist: {
		type:		'checkbox',
		label:		'Remove Existing\nMargins/Grid',
	},

	bAllArtboards: {
		type:		'checkbox',
		label:		'All Artboards',
	},


	// ------------------------------------
	// Invocation
	// ------------------------------------
	applyRule: {
		type: 			'ruler',
		fullSize: 		true,
	},

	submit: {
		type: 'button',
		value: 'Generate',
		fullSize: true,
		onClick: function() {
			Draw();
			saveSettings();
		}
	}

};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	loadSettings();

	/*
	 *	main palette
	 */
	palette = new Palette('Create Grid', components, values);

	saveSettings();
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
	// create grid layer
	var layer;
	for(var i=0; i<activeDocument.layers.length; i++) {
		var l = activeDocument.layers[i];
		l.locked = false;

		if(l.name == '_grid_') {
			layer = l;
			if(values.bRemoveExist) {
				for(j in l.children) {
					try {
						if(l.children[j].name == '_created_grid_') l.children[j].remove();
					}
					catch(err) {
						print('err:', err);
					}
				}
			}
			//break;
		}

	}
	if(layer == null) {
		layer = new Layer();
		layer.name = '_grid_';
	}


	// create guides
	var theArtboard;
	group = new Group();
	group.name = '_created_grid_';

	if(values.bAllArtboards) {
		// across all artboards
		for(var i=0; i<activeDocument.artboards.length; i++) {
			// print('all artboards', i);
			theArtboard = activeDocument.artboards[i];
			group.appendTop( createMargins(theArtboard) );
			group.appendTop( createRowsCols(theArtboard) );
		}
	} else {
		// active artboard
		group.appendTop( createMargins(artboard) );
		group.appendTop( createRowsCols(artboard) );
	}
	layer.appendTop(group);
	layer.locked = true;
};



// ------------------------------------------------------------------------
// methods
// ------------------------------------------------------------------------
function loadSettings() {
	if(fio.checkFile(settingsFile)) values = fio.openFile(settingsFile);
};
function saveSettings() {
	fio.saveFile(values, settingsFile);
};

// ------------------------------------------------------------------------
function createMargins(theArtboard) {
	var bounds = theArtboard.bounds;

	var bw, bh;
	if(values.bUseArtBoard) {
		bw = bounds.width;
		bh = bounds.height;
	}
	else {
		bw = values.sizeWidth;
		bh = values.sizeHeight;
	}
	var bx = bounds.x - artboard.bounds.x;
	var by = bounds.y - artboard.bounds.y;


	// ------------------------------------
	// create margins
	// ------------------------------------

	groupMargins = new Group();


	/*
	 * top & bottom margins
	 */
	var mTop	= new Path.Line( new Point(bx, by+(bh-values.marginTop)), new Point(bx+bw, by+(bh-values.marginTop)) );
	mTop.guide = true;
	groupMargins.appendTop(mTop);

	var mBottom	= new Path.Line( new Point(bx, by+values.marginBottom), new Point(bx+bw, by+values.marginBottom) );
	mBottom.guide = true;
	groupMargins.appendTop(mBottom);


	/*
	 * left & right margins
	 */
	var mLeft	= new Path.Line( new Point(bx+values.marginLeft, by), new Point(bx+values.marginLeft, by+bh) );
	mLeft.guide = true;
	groupMargins.appendTop(mLeft);

	var mRight	= new Path.Line( new Point(bx+(bw-values.marginRight), by), new Point(bx+(bw-values.marginRight), by+bh) );
	mRight.guide = true;
	groupMargins.appendTop(mRight);

	return groupMargins;
};


// ------------------------------------------------------------------------
function createRowsCols(theArtboard) {
	var bounds = theArtboard.bounds;
	var active = activeDocument.activeArtboard;

	var bw, bh;
	if(values.bUseArtBoard) {
		bw = bounds.width;
		bh = bounds.height;
	}
	else {
		bw = values.sizeWidth;
		bh = values.sizeHeight;
	}
	var bx = bounds.x - active.bounds.x;
	var by = bounds.y - active.bounds.y;
	var activeSpace = new Point( bw-(values.marginLeft+values.marginRight), bh-(values.marginTop+values.marginBottom) );


	// ------------------------------------
	// create columns & rows
	// ------------------------------------
	groupRowsCols = new Group();


	/*
	 * cols
	 */
	if( values.cols > 0 ) {
		var colGutterCombined = Math.abs( values.colGutter*(values.cols-1) );
		activeSpace.x -= colGutterCombined;
		activeSpace.x /= values.cols;

		var x = values.marginLeft;
		for(var i=0; i<values.cols-1; i++) {
			x += activeSpace.x;
			var gutterLeft = new Path.Line( new Point(bx+x, by), new Point(bx+x,by+bh) );
			gutterLeft.guide = true;
			groupRowsCols.appendTop(gutterLeft);

			x += values.colGutter;
			var gutterRight = new Path.Line( new Point(bx+x, by), new Point(bx+x,by+bh) );
			gutterRight.guide = true;
			groupRowsCols.appendTop(gutterRight);
		}
	}


	/*
	 * rows
	 */
	if( values.rows > 0 ) {
		var rowGutterCombined = Math.abs( values.rowGutter*(values.rows-1) );
		activeSpace.y -= rowGutterCombined;
		activeSpace.y /= values.rows;

		var y = values.marginTop;
		for(var i=0; i<values.rows-1; i++) {
			y += activeSpace.y;
			var gutterTop = new Path.Line( new Point(bx, by+y), new Point(bx+bw, by+y) );
			gutterTop.guide = true;
			groupRowsCols.appendTop(gutterTop);

			y += values.rowGutter;
			var gutterBottom = new Path.Line( new Point(bx, by+y), new Point(bx+bw, by+y) );
			gutterBottom.guide = true;
			groupRowsCols.appendTop(gutterBottom);
		}
	}

	return groupRowsCols;
};


// ------------------------------------------------------------------------
function updatePalette(theUnit, theValDef) {
	// print('values.unit', theUnit);
	// print('val', theValDef);

	// unit
	palette.getComponent('sizeWidth').units = theUnit;
	palette.getComponent('sizeHeight').units = theUnit;

	palette.getComponent('marginTop').units = theUnit;
	palette.getComponent('marginBottom').units = theUnit;
	palette.getComponent('marginLeft').units = theUnit;
	palette.getComponent('marginRight').units = theUnit;

	palette.getComponent('rowGutter').units = theUnit;
	palette.getComponent('colGutter').units = theUnit;

	// value
	palette.getComponent('marginTop').value = theValDef;
	palette.getComponent('marginBottom').value = theValDef;
	palette.getComponent('marginLeft').value = theValDef;
	palette.getComponent('marginRight').value = theValDef;

	palette.getComponent('rowGutter').value = theValDef;
	palette.getComponent('colGutter').value = theValDef;

	// reset
	//palette.reset();
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Animate(false);
//Draw();

