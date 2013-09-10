/**
 *	Annie Albers
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 *	a generative script which mimics the work of Annie Albers
 *	as inspired by http://butdoesitfloat.com/1471122/Whoever-proves-her-point-and-demonstrates-the-prime-truth
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
var sel;
var annie = new Group();

//colors
var colors = {
	Red:		new RGBColor( 189/255,	39/255,		51/255 ),
	Orange:		new RGBColor( 255/255,	151/255,	5/255 ),
	Gold:		new RGBColor( 191/255,	187/255,	152/255 ),
	Yellow:		new RGBColor( 235/255,	230/255,	77/255 ),
	Green:		new RGBColor( 51/255,	150/255,	83/255 ),
	Cyan:		new RGBColor( 7/255,	98/255,		142/255 ),
	Blue:		new RGBColor( 21/255,	78/255,		191/255 ),
	Tan:		new RGBColor( 147/255,	155/255,	134/255 ),
	Black:		new RGBColor( 40/255,	40/255,		40/255),
	DarkGray:	new RGBColor( 107/255,	116/255,	111/255 ),
	LightGray:	new RGBColor( 184/255,	205/255,	226/255 ),
	White:		new RGBColor( 242/255,	241/255,	239/255 )
};

var paletteNames = ['Red/Blue', 'Red/Cyan', 'Yellow/Dark Gray/White', 'Orange/Black', 'Green/Tan/Light Gray', 'Black/Gold', 'Black/Blue', 'Black/White', 'Random'];
var palettes = {
	'Red/Blue':					[ colors.Red, colors.Blue ],
	'Red/Cyan':					[ colors.Red, colors.Cyan ],
	'Yellow/Dark Gray/White':	[ colors.Yellow, colors.DarkGray, colors.White ],
	'Orange/Black':				[ colors.Orange, colors.Black ],
	'Green/Tan/Light Gray':		[ colors.Green, colors.Tan, colors.LightGray ],
	'Black/Gold':				[ colors.Black, colors.Gold ],
	'Black/Blue':				[ colors.Black, colors.Blue ],
	'Black/White':				[ colors.Black, colors.White ],
	'Random':					[ colors.Red, colors.Orange, colors.Gold, colors.Yellow, colors.Green, colors.Cyan, colors.Blue, colors.Tan, colors.Black, colors.DarkGray, colors.LightGray, colors.White ]
};

// values
var values = {
	// ------------------------------------
	// settings
	// ------------------------------------
	width:			500,
	cols:			30,
	rotation:		90,

	// ------------------------------------
	// image
	// ------------------------------------
	bRasterValid:	false,
	bRaster:		false,

	// ------------------------------------
	// mode
	// ------------------------------------
	modus:			'Triangulate Composition',
	modusColor:		paletteNames[7], //'Black/White'
};

// gui components
var components = {
	// ------------------------------------
	// settings
	// ------------------------------------
	width: {
		type: 'number',
		label: 'Width',
		units: 'point',
		onChange: function() {
			Draw();
		}
	},
	cols: {
		type: 'number',
		label: 'Columns',
		units: 'none',
		onChange: function() {
			Draw();
		}
	},

	rotation: {
		type: 'number',
		label: 'Rotation increment',
		units: 'degree',
		onChange: function() {
			Draw();
		}
	},

	settingsRule: { 
		type: 'ruler',
		fullSize: true,
	},
	
	// ------------------------------------
	// image
	// ------------------------------------
	bRaster: {
		type: 'checkbox',
		label: 'Use Selected Image'
	},

	imageRule: { 
		type: 'ruler',
		fullSize: true,
	},


	// ------------------------------------
	// mode
	// ------------------------------------
	modus: {
		label: 'Mode',
		options: ['Triangulate Composition', 'Second Movement'],
		onChange: function() {
			Draw();
		}
	},

	modusColor: {
		label: 'Color Palettes',
		options: paletteNames,
		onChange: function() {
			Draw();
		}
	},

	modeRule: { 
		type: 'ruler',
		fullSize: true,
	},

	// ------------------------------------
	// Invocation
	// ------------------------------------
	submit: { 
		type: 'button', 
		value: 'Create',
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
	//RasterSetup();
	var palette = new Palette('Annie Albers', components, values);
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
	// if(values.bRaster) {
	// 	if(raster.width > raster.height) {
	// 		values.width = raster.width;
	// 	}
	// 	else {
	// 		values.width = raster.height;
	// 	}
	// }

	annie.removeChildren();
	annie = new Group();

	if(values.modus == 'Triangulate Composition') {
		annie = TriangulatedComp( values.modusColor );
	}
	else if(values.modus == 'Second Movement') {
		annie = SecondMovement( values.modusColor );
	}

	annie.position = artboard.bounds.center;
};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function TriangulatedComp(name) {
	/**
	 *	http://cs.nga.gov.au/Detail.cfm?IRN=116537
	 */
	var group = new Group();
	var size = new Size( values.width/values.cols, (values.width/values.cols) );
	var offset = new Point(0,0);
	
	if(values.bRaster) {
		//offset.x = raster.bounds.x;
		//offset.y = raster.bounds.y;
	}

	for(var y=0+offset.y; y<values.cols+offset.y; y++) {
		for(var x=0+offset.x; x<values.cols+offset.x; x++) {
			var point = new Point( x*size.width, y*size.height );

			var rectBg = new Path.Rectangle(point-size/2, size);
			rectBg.strokeColor = null;
			rectBg.fillColor = randomPaletteColor(name);

			//add to our group
			group.appendTop( rectBg );

			//draw forms1
			var triForm1 = TriangleEquilateral(point, size);
			var angle1 = f.snap( Math.random()*360, values.rotation);
			triForm1.rotate( f.radians(angle1), point );
			triForm1.strokeColor = null;
			if(values.bRaster) {
				triForm1.fillColor = raster.getPixel(point);
			}
			else {
				triForm1.fillColor = randomPaletteColor(name);
			}

			//add to our group
			group.appendTop( triForm1 );


			//draw forms1
			var triForm2 = TriangleEquilateral(point, size);
			var angle2 = f.snap( Math.random()*360, values.rotation);
			if(angle2 == angle1) angle2 += values.rotation;
			triForm2.rotate( f.radians(angle2), point );
			triForm2.strokeColor = null;
			if(values.bRaster) {
				triForm2.fillColor = raster.getPixel(point);
			}
			else {
				triForm2.fillColor = randomPaletteColor(name);
			}

			//add to our group
			group.appendTop( triForm2 );

		}
	}

	return group;
};

function SecondMovement(name) {
	/**
	 *	http://cs.nga.gov.au/Detail.cfm?IRN=128416
	 */
	var group = new Group();
	var size = size = new Size( values.width/values.cols,values.width/values.cols );

	for(var y=0; y<values.cols; y++) {
		for(var x=0; x<values.cols; x++) {
			var path;
			var point = new Point( x*size.width, y*size.height );
			var form = parseInt( Math.random()*4 );

			//draw forms					
			if(form == 0) {
				path = new Path.Rectangle(point-size/2, size);
				path.strokeColor = null;
				if(values.bRaster) path.fillColor = raster.getPixel(point);
				else path.fillColor = randomPaletteColor(name);

			}
			else if(form == 1 || form == 2) {
				path = TriangleRight(point, size);
				path.rotate( f.radians(f.snap( Math.random()*360, values.rotation )), point );
				path.strokeColor = null;
				if(values.bRaster) path.fillColor = raster.getPixel(point);
				else path.fillColor = randomPaletteColor(name);

			}
			else {
				path = new Path.Rectangle(point-size/2, size);
				path.strokeColor = null;
				path.fillColor = null;
			}

			//add to our group
			group.appendTop( path );
		}
	}

	return group;
};


// ------------------------------------------------------------------------
function TriangleRight(point, size) {
	var path = new Path.FTriangle(
		new Point(point.x-size.width/2, point.y+size.height/2),
		new Point(point.x+size.width/2, point.y+size.height/2),
		new Point(point.x+size.width/2, point.y-size.height/2)
	);
	return path;
};

function TriangleEquilateral(point, size) {
	var path = new Path.FTriangle(
		new Point(point.x-size.width/2, point.y+size.height/2),
		new Point(point.x+size.width/2, point.y+size.height/2),
		new Point(point.x, point.y)
	);
	return path;
};


// ------------------------------------------------------------------------
function randomPaletteColor(name) {
	// var name = paletteNames[ parseInt( Math.random()*paletteNames.length ) ];
	var sel = parseInt( Math.random()*palettes[ name ].length );
	return palettes[ name ][ sel ];
};





// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Animate(false);
Draw();



