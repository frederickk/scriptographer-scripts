/**
 *	Triangulate Selected 0.2
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
include('../libraries/frederickk/Triangulate.js');



// ------------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------------

// document properties
var sel;
var palette;

// triangulate properties
var triangulation;
var triangles;
var points;
var groupFaces;


// values
var values = {
	/*
	 *	points
	 */
	bConnectRandom:	false,
	noiseAmt:		20.0,

	/*
	 *	fills
	 */
	fillType:		'None',
	opacity:		61.8,

	// lines
	limit:			10,
	densityMax:		20,

	// colors
	bGradient:		false,

	/*
	 *	raster
	 */
	rasterWidth:	0,
	rasterHeight:	0

};

// gui components
var components = {
	/*
	 *	points
	 */
	bConnectRandom: {
		type:	'checkbox',
		label:	'Random Connections'
	},
	noiseAmt: {
		type:	'number',
		label:	'Noise Amount',
		units:	'percent'
	},
	addRandom: {
		type: 'button', 
		value: 'Add Noise',
		fullSize: true,
		onClick: function() {
			var amt = (artboard.bounds.width/2*artboard.bounds.height/2);
			console.log( amt );
			console.log( parseInt((values.noiseAmt/100000)*amt) );
			// addNoise( parseInt((values.noiseAmt/100000)*amt) );
		}
	},
	addCenters: {
		type: 'button', 
		value: 'Add Centers',
		fullSize: true,
		onClick: function() {
			addCenters();
		}
	},

	pRule: { 
		type: 'ruler',
		fullSize: true,
	},


	/*
	 *	fills
	 */
	fillType: {
		options: ['Lines', 'Colors', 'None'],
		label: 'Fill Type',
		fullSize: true,
	},

	opacity: {
		type: 'number',
		label: 'Opacity',
		units: 'percent',
		steppers: true,
		increment: 1,
		onChange: function() {
			drawFaces(triangles);
		}
	},

	// lines
	limit: {
		type: 'number',
		label: 'Grayscale levels',
		units: 'none',
		minimum: 1,
		steppers: true,
		increment: 1,
		fractionDigits: 0,
		onChange: function() {
			Draw();
		}
	},
	densityMax: {
		type: 'number',
		label: 'Max line density',
		units: 'none',
		minimum: 1,
		steppers: true,
		increment: 1,
		fractionDigits: 0,
		onChange: function() {
			Draw();
		}
	},

	// colors
	bGradient: {
		type:	'checkbox',
		label:	'Gradient',
		onChange: function() {
			drawFaces(triangles);
		}
	},

	// triangulate
	triangulate: { 
		type: 'button', 
		value: 'Triangulate',
		fullSize: true,
		onClick: function() {
			var items = activeDocument.getItems({
				type: Item,
				selected: true
			});
			addPoints(items);
		}
	},
	
	tRule: { 
		type: 'ruler',
		fullSize: true,
	},


	// triangulate
	clear: { 
		type: 'button', 
		value: 'Clear All',
		fullSize: true,
		onClick: function() {
			init();
		}
	},
	
	cRule: { 
		type: 'ruler',
		fullSize: true,
	},


	/*
	 *	raster
	 */
	rasterWidth: {
		type: 'number',
		label: 'Raster width',
		units: 'point',
		steppers: true,
		increment: 10,
	},

	rasterHeight: {
		type: 'number',
		label: 'Raster height',
		units: 'point',
		steppers: true,
		increment: 10,
	},
	
	raster: { 
		type: 'button', 
		value: 'Redefine source image',
		fullSize: true,
		onClick: function() {
			//isRasterValid = false;
			RasterSetup();
		}
	}

};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// define selected items
	sel = activeDocument.getItems({
		type: Item,
		selected: true
	});

	// initialize rasters
	// RasterSetup();

	// open palette
	palette = new Palette('Triangulate Selected 0.2', components, values);

	// initialize Triangulation 
	init();

	// initial triangulation of selection
	// addPoints(sel);
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
};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function init() {
	// initialize arrays
	triangles = [];
	points = [];

	// initiate group for faces
	groupFaces = new Group();

	// initialize Triangulate
	triangulation = new Triangulate();
};


// ------------------------------------------------------------------------
/*
 *
 *	Triangulation Support
 *
 */
function addPoints(items) {
	for(var i=0; i<items.length; i++) {
		if(values.bConnectRandom) {
			var rand = parseInt( Math.random()*2 );
			if( rand == 0) {
				points.push( items[i].bounds.point );
			}
		}
		else {
			points.push( items[i].bounds.point );
		}

		// items[i].selected = false;
	}

	// check for duplicates
	// points = points.unique();

	// triangulate
	triangulation.add( points );
	triangulation.calculate();
	triangles = triangulation.get();

	// update drawn faces
	Draw();
	// drawFaces(triangles);
};

// ------------------------------------------------------------------------
function addNoise(amt) {
	for( var i=0; i<amt; i++ ) {
		var pt = new Point(
			Math.random() * artboard.bounds.width,
			Math.random() * artboard.bounds.height
		);
		points.push( pt );
	}

	// check for duplicates
	// points = points.unique();

	// triangulate
	triangulation.add( points );
	triangulation.calculate();
	triangles = triangulation.get();

	// update drawn faces
	Draw();
	// drawFaces(triangles);
};

// ------------------------------------------------------------------------
function addCenters() {
	for( var i=0; i<triangles.length; i++ ) {
		var triangle = triangles[i];
		if( triangle != undefined ) {
			points.push( triangle.getCentroid() );
		}

	}

	// check for duplicates
	// points = points.unique();

	// triangulate
	var triangulation = new Triangulate( points );
	triangulation.add( points );
	triangulation.calculate();
	triangles = triangulation.get();

	// update drawn faces
	Draw();
	// drawFaces(triangles);
};



/*
 *
 *	Fill Support
 *
 */
function averageColor(pt, size) {
	var avgR = [];
	var avgG = [];
	var avgB = [];

	for(var y=pt.y-size.height; y<pt.y+size.height; y++) {
		for(var x=pt.x-size.width; x<pt.x+size.height; x++) {
			if( raster.getPixel(new Point(x,y)) != null ) {
				var r = (raster.getPixel(new Point(x,y)).red != null) ? raster.getPixel(new Point(x,y)).red : 0.0;
				var g = (raster.getPixel(new Point(x,y)).green != null) ? raster.getPixel(new Point(x,y)).green : 0.0;
				var b = (raster.getPixel(new Point(x,y)).blue != null) ? raster.getPixel(new Point(x,y)).blue : 0.0;

				avgR.push( r );
				avgG.push( g );
				avgB.push( b );
			}
		}
	}

	return new RGBColor( median(avgR), median(avgG), median(avgB) );
};

// ------------------------------------------------------------------------
function averageBrightness(pt, size) {
	var avg = [];
	var index = 0;
	for(var y=pt.y-size.height; y<pt.y+size.height; y++) {
		for(var x=pt.x-size.width; x<pt.x+size.height; x++) {
			avg += raster.getPixel( new Point(x,y) ).gray;
			index++;
		}
	}

	var bright = snap( avg/index, 1/values.limit );
	return new GrayColor( bright );
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
Draw();





