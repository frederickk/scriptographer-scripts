/**
 *	Josef Müller Brockmann Grid Calculator 0.0
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 *	A tool to create "modernist" grids according
 *	to the genius that Josef Müller Brockmann
 *	grid divisions relate directly to typographic
 *	decision, resulting layout harmony
 *
 *	read on:
 *	http://www.amazon.com/Systems-Graphic-Systeme-Visuele-Gestaltung/dp/3721201450/
 *
 *	TODO:
 *	- support all units
 *	- support row/column gutter
 *
 */


// ------------------------------------------------------------------------
// Libraries
// ------------------------------------------------------------------------
include('./libraries/folio/scriptographer.folio.js');



// ------------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------------
// load folio
var f = folio,
	fio = f.FIO;


// document properties
var dialog;


// values
var text = 'By means of analysis, the Transcendental Deduction has nothing to do with, irrespective of all empirical conditions, natural reason, and our experience, in the study of the transcendental unity of apperception, should only be used as a canon for the transcendental unity of apperception. As is proven in the ontological manuals, our judgements (and Aristotle tells us that this is the case) are a representation of our knowledge. As I have shown elsewhere, metaphysics is the clue to the discovery of the phenomena, because of our necessary ignorance of the conditions. As will easily be shown in the next section, let us suppose that, so far as regards the architectonic of natural reason and the objects in space and time, necessity has nothing to do with the Categories, but necessity, with the sole exception of our experience, can be treated like our ampliative judgements. Let us suppose that the things in themselves exclude the possibility of, therefore, the noumena, by virtue of natural reason. The phenomena, therefore, can never, as a whole, furnish a true and demonstrated science, because, like the architectonic of human reason, they prove the validity of deductive principles. Natural causes, in particular, should only be used as a canon for the transcendental unity of apperception, as we have already seen. As is shown in the writings of Aristotle, the never-ending regress in the series of empirical conditions would be falsified. Because of the relation between human reason and the paralogisms of practical reason, time is just as necessary as, for example, reason, and the employment of philosophy, as far as I know, occupies part of the sphere of our knowledge concerning the existence of the Antinomies in general. By means of analytic unity, the Categories have nothing to do with, as I have shown elsewhere, necessity, but philosophy, certainly, should only be used as a canon for the noumena. Aristotle tells us that, in so far as this expounds the necessary rules of the Transcendental Deduction, our faculties should only be used as a canon for the objects in space and time, but natural causes prove the validity of, then, the objects in space and time. Therefore, our experience depends on, in respect of the intelligible character, necessity. Metaphysics excludes the possibility of, therefore, the transcendental aesthetic. Necessity exists in our ideas. Thus, it is obvious that space, on the contrary, has nothing to do with the Antinomies, as is proven in the ontological manuals. There can be no doubt that, then, our judgements, in the case of our knowledge, are the mere results of the power of the discipline of natural reason, a blind but indispensable function of the soul, but the Categories prove the validity of, in reference to ends, the Categories. Since knowledge of the objects in space and time is a posteriori, the objects in space and time can not take account of, consequently, the phenomena. The noumena can never, as a whole, furnish a true and demonstrated science, because, like metaphysics, they exclude the possibility of speculative principles. Therefore, the thing in itself may not contradict itself, but it is still possible that it may be in contradiction with the paralogisms. As any dedicated reader can clearly see, what we have alone been able to show is that the noumena can be treated like our a priori concepts.';
var settings = '.brockmannGrid.cpValues'; // this is a hidden file
var values = {
	// default unit of measure
	unit:			'point',
	conversionAmt:	1, //6*FConversions.MM_TO_POINT,

	// Baseline
	// typeface:	null,
	// typeSize:	this.conversionAmt,
	typeLeading:	this.conversionAmt,

	// Margins
	marginTop:		this.conversionAmt,
	marginBottom:	this.conversionAmt,
	marginLeft:		this.conversionAmt,
	marginRight:	this.conversionAmt,

	// Rows
	rows:			this.conversionAmt,
	rowGutter:		this.conversionAmt,

	// Columns
	cols:			this.conversionAmt,
	colGutter:		this.conversionAmt
};

//components
var components = {
	//
	// Flyout Menu
	//
	bMmUnit: {
		type:		'menu-entry',
		value:		'millimeter',
		onSelect: function() {
			values.unit = 'millimeter';
			values.conversionAmt = 6*FConversions.MM_TO_POINT;
			updateUnits(values.unit, values.conversionAmt);
		}
	},
	bInUnit: {
		type:		'menu-entry',
		value:		'inch',
		onSelect: function() {
			values.unit = 'inch';
			values.conversionAmt = 0.5*FConversions.INCH_TO_POINT;
			updateUnits(values.unit, values.conversionAmt);
		}
	},
	bPiUnit: {
		type:		'menu-entry',
		value:		'pica',
		onSelect: function() {
			values.unit = 'pica';
			values.conversionAmt = 3*FConversions.PICA_TO_POINT;
			updateUnits(values.unit, values.conversionAmt);
		}
	},
	bPtUnit: {
		type:		'menu-entry',
		value:		'point/pixel',
		onSelect: function() {
			values.unit = 'point';
			values.conversionAmt = 36;
			updateUnits(values.unit, values.conversionAmt);
		}
	},


	//
	// Baseline
	//
	typeRule: {
		type:			'ruler',
		label:			'Typography Base',
		fullSize:		true,
	},

	// typeSize: {
	//	type:			'number',
	//	label:			'Size',
	//	units:			values.unit,
	//	steppers:		true,
	//	fractionDigits:	1,
	// },
	typeLeading: {
		type:			'list',
		label:			'Leading',
		options:		paper.divisor( activeDocument.activeArtboard.bounds.height ),
		width:			60,
		onChange: function(val) {
			Update();
		}
	},


	//
	// Margins
	//
	marginRule: {
		type:			'ruler',
		label:			'Margins',
		fullSize:		true,
	},

	marginTop: {
		type:			'number',
		label:			'Top',
		units:			values.unit,
		steppers:		true,
		fractionDigits:	2,
		onChange: function(val) {
			Update();
		}
	},
	marginBottom: {
		type:			'number',
		label:			'Bottom',
		units:			values.unit,
		steppers:		true,
		fractionDigits:	2,
		onChange: function(val) {
			Update();
		}
	},
	marginLeft: {
		type:			'number',
		label:			'Left',
		units:			values.unit,
		steppers:		true,
		fractionDigits:	2,
		onChange: function(val) {
			Update();
		}
	},
	marginRight: {
		type:			'number',
		label:			'Right',
		units:			values.unit,
		steppers:		true,
		fractionDigits:	2,
		onChange: function(val) {
			Update();
		}
	},


	//
	// Rows
	//
	rowRule: {
		type:			'ruler',
		label:			'Rows',
		fullSize:		true,
	},

	rows: {
		type:			'list',
		label:			'Number',
		options:		null,
		width:			60
	},


	//
	// Columns
	//
	colRule: {
		type:			'ruler',
		label:			'Columns',
		fullSize:		true,
	},

	cols: {
		type:			'list',
		label:			'Number',
		options:		paper.divisor( activeDocument.activeArtboard.bounds.width ),
		width:			60
	},

	//
	// Invocation
	//
	applyRule: {
		type:			'ruler',
		fullSize:		true,
	},

	submit: {
		type: 'button',
		value: 'Generate',
		fullSize: true,
		onClick: function() {
			saveSettings(settings);
			Draw();
		}
	}
};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	values = values || loadSettings(settings);

	dialog = new Palette('Brockmann Grid', components, values);
	Update();

	saveSettings(settings);
};



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {

	// update components
	var activeSize = getActiveSize( activeDocument.activeArtboard, {
		left:	values.marginLeft,
		right:	values.marginRight,
		top:	values.marginTop,
		bottom:	values.marginBottom
	});
	dialog.getComponent('rows').options = paper.divisor( Math.floor( (activeSize.height+values.typeLeading) / values.typeLeading) );
	dialog.getComponent('cols').options = paper.divisor( activeSize.width );

};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	// set layers
	var layer = setLayer('_grid_');

	// calculate the grid and draw guides
	var grid = calculateGrid( layer );

	// draw type definitions
	// define body copy size
	var body = new AreaText( new Rectangle(
		values.marginLeft, values.marginTop,
		grid.width, activeDocument.activeArtboard.bounds.height-values.marginTop-values.marginBottom
	));
	body.characterStyle.leading = values.typeLeading;
	body.characterStyle.fontSize = (values.typeLeading >= 8)
		? values.typeLeading-3
		: values.typeLeading-1;
	body.characterStyle.font = app.fonts['Helvetica'];
	body.content = text;
	// body.trimToFit();

	// define head copy size
	var head = body.clone();
	head.translate( new Point(grid.width+values.typeLeading,0) );
	head.characterStyle.leading *= 1.5;
	head.characterStyle.fontSize = (values.typeLeading*1.5)-3;
	// head.trimToFit();

	// define display copy size
	var disp = body.clone();
	disp.translate( new Point((grid.width*2)+(values.typeLeading*2),0) );
	disp.characterStyle.leading *= 3;
	disp.characterStyle.fontSize = (values.typeLeading*3)-3;
	// disp.trimToFit();

};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function loadSettings(settings) {
	if(fio.checkFile(settings)) return fio.openFile(settings);
};
function saveSettings(settings) {
	fio.saveFile(values, settings);
};

// ------------------------------------------------------------------------
function calculateGrid(layer) {
	//
	// 0
	// Determine base leading
	//

	//
	// 1
	// Define ideal margins
	// Re-asseess margins, based on base leading
	//
	if( values.marginTop % values.typeLeading != 0 ) {
		dialog.getComponent('marginTop').value = paper.roundMultiple( values.marginTop, values.typeLeading );
	}
	if( values.marginBottom % values.typeLeading != 0 ) {
		dialog.getComponent('marginBottom').value = paper.roundMultiple( values.marginBottom, values.typeLeading );
	}
	// if( values.marginLeft % values.typeLeading != 0 ) {
	//	dialog.getComponent('marginTop').value = paper.roundMultiple( values.marginTop, values.typeLeading );
	// }
	// if( values.marginRight % values.typeLeading != 0 ) {
	//	dialog.getComponent('marginBottom').value = paper.roundMultiple( values.marginBottom, values.typeLeading );
	// }

	var margins = {
		top:	values.marginTop,
		right:	values.marginRight,
		bottom:	values.marginBottom,
		left:	values.marginLeft
	};
	layer.appendTop( createMargins( activeDocument.activeArtboard, margins ) );

	//
	// 2
	// Determine divisors of active area height (http://en.wikipedia.org/wiki/Divisor)
	// these are valid leading increments for the base body size
	//
	var activeSize = getActiveSize( activeDocument.activeArtboard, margins );

	//
	// 3
	// Determine baseline grid
	//
	var baseline = {
		spacing: values.typeLeading
	};
	layer.appendTop( createBaselineGrid( activeDocument.activeArtboard, margins, baseline ) );

	//
	// 4
	// Determine total line depth
	//

	//
	// 5
	// Determine possible/valid row count
	// Determine row height (based on line height)
	//
	var rows = createRows( activeDocument.activeArtboard, margins, {
		number: values.rows,
		gutter:	values.typeLeading
	});
	layer.appendTop( rows.group );

	//
	// 6
	// Determine possible/valid column count
	// Determine column width
	//
	var columns = createColumns( activeDocument.activeArtboard, margins, {
		number: values.cols,
		gutter:	values.typeLeading
	});
	layer.appendTop( columns.group );


	return {
		linedepth: 	rows.linedepth,
		height:		rows.height,
		width:		columns.width
	}
};

// ------------------------------------------------------------------------
/**
 * Set layer
 *
 * @param {String} name
 *
 * @return {Layer}
 */
function setLayer(name) {
	var layer = activeDocument.layers[name] || new Layer();
	layer.removeChildren();
	layer.name = name;
	return layer;
};

// ------------------------------------------------------------------------
/**
 * Get active size (Satzspiegel)
 *
 * @param  {Artboard} artboard	target artboard
 * @param  {Array} margins		dimensions of the margins: top, bottom, left, right
 *
 * @return {Size}				the width,height of the active area (inside the margins)
 */
function getActiveSize(artboard, margins) {
	var margins = margins || { top: 0, right: 0, bottom: 0, left: 0 };
	return new Size(
		artboard.bounds.width - (margins.left + margins.right),
		artboard.bounds.height - (margins.top + margins.bottom)
	);
};

/**
 * Create margins
 *
 * @param  {Artboard} artboard	target artboard
 * @param  {Array} margins		dimensions of the margins: top, bottom, left, right
 *
 * @return {Group}				the margins as a group
 */
function createMargins(artboard, margins) {
	var b = new Point(
		artboard.bounds.x - artboard.bounds.x,
		artboard.bounds.y - artboard.bounds.y
	);

	var groupMargins = new Group();

	var top	= new Path.Line(
		new Point(b.x, b.y+(artboard.bounds.height-margins.top)),
		new Point(b.x+artboard.bounds.width, b.y+(artboard.bounds.height-margins.top))
	);
	top.guide = true;
	groupMargins.appendTop(top);

	var bottom	= new Path.Line(
		new Point(b.x, b.y+margins.bottom),
		new Point(b.x+artboard.bounds.width, b.y+margins.bottom)
	);
	bottom.guide = true;
	groupMargins.appendTop(bottom);

	var left	= new Path.Line(
		new Point(b.x+margins.left, b.y),
		new Point(b.x+margins.left, b.y+artboard.bounds.height)
	);
	left.guide = true;
	groupMargins.appendTop(left);

	var right	= new Path.Line(
		new Point(b.x+(artboard.bounds.width-margins.right), b.y),
		new Point(b.x+(artboard.bounds.width-margins.right), b.y+artboard.bounds.height)
	);
	right.guide = true;
	groupMargins.appendTop(right);

	groupMargins.name = 'margins';
	return groupMargins;
};

// ------------------------------------------------------------------------
/**
 * Create columns
 *
 * @param  {Artboard} artboard	target artboard
 * @param  {Array} margins		dimensions of the margins: top, bottom, left, right
 * @param  {Array} dimensions	dimensions of the columns: number, gutter
 *
 * @return {Group}				the columns as a group
 */
function createColumns(artboard, margins, dimensions) {
	var activeSize = getActiveSize(artboard, margins);
	var b = new Point(
		artboard.bounds.x - artboard.bounds.x,
		artboard.bounds.y - artboard.bounds.y
	);

	var groupColumns = new Group();
	var dimensions = dimensions || { number: 1, gutter: 0 };
	if( dimensions.number > 0 ) {
		var colGutterCombined = Math.abs( dimensions.gutter*(dimensions.number-1) );
		activeSize.width -= colGutterCombined;
		activeSize.width /= dimensions.number;

		var x = margins.left;
		for(var i=0; i<dimensions.number-1; i++) {
			x += activeSize.width;
			var gutterLeft = new Path.Line(
				new Point(b.x+x, b.y),
				new Point(b.x+x,b.y+artboard.bounds.height)
			);
			gutterLeft.guide = true;
			groupColumns.appendTop(gutterLeft);

			x += dimensions.gutter;
			var gutterRight = new Path.Line(
				new Point(b.x+x, b.y),
				new Point(b.x+x,b.y+artboard.bounds.height)
			);
			gutterRight.guide = true;
			groupColumns.appendTop(gutterRight);
		}
	}

	groupColumns.name = 'columns';
	return {
		group: 	groupColumns,
		width: 	activeSize.width
	}
};

// ------------------------------------------------------------------------
/**
 * Create rows
 *
 * @param  {Artboard} artboard	target artboard
 * @param  {Array} margins		dimensions of the margins: top, bottom, left, right
 * @param  {Array} dimensions	dimensions of the rows: number, gutter
 *
 * @return {Group}				the rows as a group
 */
function createRows(artboard, margins, dimensions) {
	var activeSize = getActiveSize(artboard, margins);
	var b = new Point(
		artboard.bounds.x - artboard.bounds.x,
		artboard.bounds.y - artboard.bounds.y
	);

	var groupRows = new Group();
	var dimensions = dimensions || { number: 1, gutter: 0 };
	if( dimensions.number > 0 ) {
		var linedepth = Math.floor(activeSize.height / dimensions.gutter);
		var rowLinedepth = Math.floor( (linedepth-(dimensions.number-1))/dimensions.number );
		var height = rowLinedepth*dimensions.gutter;

		var y = margins.top;
		for(var i=0; i<dimensions.number-1; i++) {
			y += height;
			var gutterTop = new Path.Line(
				new Point(b.x, b.y+y),
				new Point(b.x+artboard.bounds.width, b.y+y)
			);
			gutterTop.guide = true;
			groupRows.appendTop(gutterTop);

			y += dimensions.gutter;
			var gutterBottom = new Path.Line(
				new Point(b.x, b.y+y),
				new Point(b.x+artboard.bounds.width, b.y+y)
			);
			gutterBottom.guide = true;
			groupRows.appendTop(gutterBottom);
		}
	}

	groupRows.name = 'rows';
	return {
		group: 		groupRows,
		height: 	height,
		linedepth:	linedepth
	}
};

// ------------------------------------------------------------------------
/**
 * Create baseline grid
 *
 * @param  {Artboard} artboard	target artboard
 * @param  {Array} margins		dimensions of the margins: top, bottom, left, right
 * @param  {Array} dimensions	dimensions of the baseline grid: spacing
 *
 * @return {Group}				the baseline grid as a group
 */
function createBaselineGrid(artboard, margins, dimensions) {
	var activeSize = getActiveSize(artboard, margins);
	var b = new Point(
		artboard.bounds.x - artboard.bounds.x,
		artboard.bounds.y - artboard.bounds.y
	);

	var groupBaseline = new Group();
	var dimensions = dimensions || { spacing: 10 };
	for(var y=margins.top; y<=margins.top+activeSize.height; y+=dimensions.spacing) {
		var baseline = new Path.Line(
			new Point(b.x, b.y+y),
			new Point(b.x+artboard.bounds.width, b.y+y)
		);
		baseline.guide = true;
		groupBaseline.appendTop(baseline);
	}

	groupBaseline.name = 'baseline';
	return groupBaseline;
};

// ------------------------------------------------------------------------
// function updateComponent(component, property, propertyVal) {
//	dialog.getComponent(component)[property] = propertyVal;
// };

function updateUnits(propertyVal, val) {
	// unit
	// dialog.getComponent('typeSize').units = propertyVal;
	// dialog.getComponent('typeLeading').units = propertyVal;

	// dialog.getComponent('marginTop').units = propertyVal;
	// dialog.getComponent('marginBottom').units = propertyVal;
	// dialog.getComponent('marginLeft').units = propertyVal;
	// dialog.getComponent('marginRight').units = propertyVal;

	// dialog.getComponent('gutter').units = propertyVal;
	// dialog.getComponent('colGutter').units = propertyVal;

	// value
	// dialog.getComponent('typeSize').value = val;
	// dialog.getComponent('typeLeading').value = val;

	// dialog.getComponent('marginTop').value = val;
	// dialog.getComponent('marginBottom').value = val;
	// dialog.getComponent('marginLeft').value = val;
	// dialog.getComponent('marginRight').value = val;

	// dialog.getComponent('gutter').value = val;
	// dialog.getComponent('colGutter').value = val;
};



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------




// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Animate(false);
// Draw();


