/**
*	Image Brightness Rotate 0.0
*
*	Ken Frederick
*	ken.frederick@gmx.de
*
*	http://kennethfrederick.de/
*	http://blog.kennethfrederick.de/
*
*/


// ------------------------------------------------------------------------
// Libraries
// ------------------------------------------------------------------------
include('../../libraries/frederickkScript/frederickkScript.js');



// ------------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------------


// load frederickkScript
var f = frederickkScript;

// document properties
var groupHolder = new Group();

// values
var values = {
	// ------------------------------------
	// rasterize
	// ------------------------------------
	rasterWidth:		0,
	rasterHeight:		0,

	// ------------------------------------
	// lines
	// ------------------------------------
	xres:				9,
	yres:				10,
	height:				7,
	weight:				0.5,

	// ------------------------------------
	// colors
	// ------------------------------------
	limit:				5

};

// gui components
var components = {
	// ------------------------------------
	// projection
	// ------------------------------------
	rasterWidth: {
		type: 'number',
		label: 'Raster Width',
		units: 'point',
		steppers: true,
		increment: 10,
		enabled: true
	},

	rasterHeight: {
		type: 'number',
		label: 'Raster Height',
		units: 'point',
		steppers: true,
		increment: 10,
		enabled: true
	},

	// ------------------------------------
	// Invocation
	// ------------------------------------
	raster: { 
		type: 'button', 
		value: 'Rasterize',
		enabled: true,
		fullSize: true,
		onClick: function() {
			//rasterValid = false;
			RasterSetup();
		}
	},

	rasterRule: { 
		type: 'ruler',
		fullSize: true,
	},


	// ------------------------------------
	// lines
	// ------------------------------------
	xres: {
		type: 'number',
		label: 'X Resolution',
		units: 'point',
		steppers: true,
		increment: 0.1,
		enabled: true
	},
	yres: {
		type: 'number',
		label: 'Y Resolution',
		units: 'point',
		steppers: true,
		increment: 0.5,
		enabled: true
	},
	weight: {
		type: 'number',
		label: 'Stroke weight',
		units: 'point',
		steppers: true,
		increment: 1,
		enabled: true
	},

	lineRule: { 
		type: 'ruler',
		fullSize: true,
	},

	// ------------------------------------
	// colors
	// ------------------------------------
	colors: {
		type: 'checkbox',
		label: 'Colors from image',
		units: 'none',
		enabled: true
	},
	limit: {
		type: 'number',
		label: 'Grayscale Levels',
		units: 'none',
		steppers: true,
		increment: 1,
		fractionDigits: 0,
		enabled: true
	},

	grayRule: { 
		type: 'ruler',
		fullSize: true,
	},

	// ------------------------------------
	// Invocation
	// ------------------------------------
	submit: { 
		type: 'button', 
		value: 'Apply',
		fullSize: true,
		onClick: function() {
			Draw();
		}
	}

};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// get rasters
	RasterSetup();

	// palette
	var palette = new Palette('Brightness Rotate 0.0', components, values);
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
	//clear group contents
	groupHolder.removeChildren();
	groupHolder = new Group();

	if( raster != null ) {
		//rendering
		for(var y=0; y<raster.height; y+=values.yres) {
			for(var x=0; x<raster.width; x+=values.xres) {
				var col = raster.getPixel( new Point(x,y) );
				LineRotate(x,y, col);
			}
		}
	
		groupHolder.position = raster.position;
		groupHolder.moveAbove(raster);
	}
};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function LineRotate(x,y, col) {
	var groupBlock = new Group();

	//grab colors from image
	var bright = raster.getPixel( new Point(x,y) ).gray;

	//calculate rotation
	var deg = 360 * bright;
	deg = f.snap(deg, (360/values.limit));


	var line = new Path.Line( x,0-(y-(values.yres*0.5)), 
							  x,0-(y+(values.yres*0.5)) );
	line.strokeWidth = values.weight;
	if(values.colors) line.strokeColor = col;
	else line.strokeColor = new CMYKColor(1,1,1,1);
	line.fillColor = null;
	line.rotate( f.radians(deg) );

	//add to group
	groupBlock.appendTop(line);

	groupHolder.appendTop( groupBlock );
};





// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Animate(false);
// Draw();








