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
// Properties
// ------------------------------------------------------------------------


// document properties
var sel;


//colors
var Red = 		new RGBColor(189/255,	39/255,		51/255); 
var Orange =	new RGBColor(255/255,	151/255,	5/255);
var Gold =		new RGBColor(191/255,	187/255,	152/255);
var Yellow =	new RGBColor(235/255,	230/255,	77/255);
var Green =		new RGBColor(51/255,	150/255,	83/255);
var Cyan =		new RGBColor(7/255,		98/255,		142/255);
var Blue =		new RGBColor(21/255,	78/255,		191/255);
var Tan =		new RGBColor(147/255,	155/255,	134/255);
var Black =		new RGBColor(40/255,	40/255,		40/255);
var DkGray =	new RGBColor(107/255,	116/255,	111/255);
var LtGray =	new RGBColor(184/255,	205/255,	226/255);
var White =		new RGBColor(242/255,	241/255,	239/255);
var All = new Array( Red,Orange,Gold,Yellow,Green,Cyan,Blue,Tan,Black,DkGray,LtGray,White );

// values
var values = {
	// ------------------------------------
	// settings
	// ------------------------------------
	width:			500,
	cols:			32,
	rows:			64,
	rotation:		180,

	// ------------------------------------
	// mode
	// ------------------------------------
	modus:			'Second Movement', //'Triangulate Composition',
	modusColor:		'Black/White'
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
	},
	cols: {
		type: 'number',
		label: 'Columns',
		units: 'none',
	},
	rows: {
		type: 'number',
		label: 'Rows',
		units: 'none',
	},

	rotation: {
		type: 'number',
		label: 'Rotation increment',
		units: 'degree',
	},

	settingsRule: { 
		type: 'ruler',
		fullSize: true,
	},
	

	// ------------------------------------
	// mode
	// ------------------------------------
	modus: {
		label: 'Mode',
		options: ['Triangulate Composition', 'Second Movement']
	},

	modusColor: {
		label: 'Color Palettes',
		options: ['Red/Blue', 'Red/Cyan', 'Green/Tan/Light Gray', 'Black/White', 'Black/Gold', 'Yellow/Dark Gray/White', 'Orange/Black', 'Black/Blue']
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
		onClick: function() {
			Draw();
		}
	}

};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	var palette = new Palette('Annie Albers', components, values);
}


// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
}

// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	if(values.modus == 'Triangulate Composition') {
		TriangulatedComp();
	} else if(values.modus == 'Second Movement') {
		SecondMovement();
	}
}



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function TriangulatedComp() {
	/**
	 *	http://cs.nga.gov.au/Detail.cfm?IRN=116537
	 */

	var group = new Group();
	var size = new Size( values.width/values.cols, values.width/values.cols );
	var num = 0;
	var angle = snap(random(360), values.rotation);

	for(var y=0; y<values.rows; y++) {
		for(var x=0; x<values.cols; x++) {
			var point = new Point( x*size.width, y*size.height * 0.5 );
			point += new Point(size.width * 0.5,0);

			//create form
			var triangle = new FTriangle(point, size, FTriangle.EQUILATERAL);


			//determine rotation
			if(num % 5 != 0) {
				angle += 180;
			} else if(num % 5 == 4) {
				angle = angle;
			} else {
				angle = snap(random(360), values.rotation);
				num = 0;
			}
			triangle.rotate( radians(angle) );


			//add OR remove
			//if( y > 0 && parseInt(random(values.cols+4)) == 0 ) {
			if( parseInt(random(values.cols+4)) == 0 ) {
				//remove elements
				triangle.remove();
			} else {
				//add to our group
				triangle.strokeColor = null;
				triangle.fillColor = randomPaletteColor();
				group.appendTop( triangle );
				num++;
			}

		}
	}

	//create background
	var background = new Path.Rectangle(-size.width,-size.width, (size.width*2)+values.width, (size.width*2)+values.rows*size.height * 0.5 );
	background.fillColor = Palettes()[0]; //new CMYKColor(0,0,0.08,0.1);
	group.appendBottom( background );
	group.position = activeDocument.activeArtboard.position;

}


// ------------------------------------------------------------------------
function SecondMovement() {
	/**
	 *	http://cs.nga.gov.au/Detail.cfm?IRN=128416
	 */
	var group = new Group();
	var size = new Size( values.width/values.cols, values.width/values.cols );
	var num = 0;
	var numMods = 4;
	var angle = -90; //snap(random(360), values.rotation);

	for(var y=0; y<numMods; y++) {
		for(var x=0; x<numMods; x++) {
			var module = SecondMovementModule( angle, numMods, All[ (y*numMods+x) % All.length] );
			module.translate( new Point(x*module.bounds.width, y*module.bounds.height) );

			var text = new PointText( new Point(x*module.bounds.width, y*module.bounds.height) );
			text.content = num + " " + num%4;

			if(num%4 == 0) {
				angle += 90;
				num = 0;
			}
			num++;
			angle -= 180;
		}
		//angle += 180;
	}
	
	/*create background
	var background = new Path.Rectangle(-size.width,-size.width, (size.width*2)+values.width, (size.width*2)+values.rows*size.height * 0.5 );
	background.fillColor = Palettes()[0]; //new CMYKColor(0,0,0.08,0.1);
	group.appendBottom( background );
	*/
}

/*
	20 21 22 23 24
	15 16 17 18 19
	10 11 12 13 14
	5  6  7  8  9
	0  1  2  3  4

	-12 -13 -14 -15
	--8 *-9 *10 -11
	--4 *-5 *-6 --7
	--0 --1 --2 --3
*/


function SecondMovementModule( angle, numMods, color ) {
	var group = new Group();
	var size = new Size( values.width/values.cols, values.width/values.cols );
	var num = 0;

	var cols = values.cols/numMods;
	var rows = values.rows/numMods * 0.5;
	
	for(var y=0; y<rows; y++) {
		for(var x=0; x<cols; x++) {
			var point = new Point( x*size.width, y*size.height );
			point += new Point(size.width * 0.5,0);


			//create form
			var triangle = new FTriangle(point, size, FTriangle.RIGHT);


			//determine rotation
			if(num % 2 != 0) {
				angle = angle;
			} else {
				angle += 180; //snap(random(360), values.rotation);
				num = 0;
			}
			triangle.rotate( radians(angle) );

			triangle.strokeColor = null;
			triangle.fillColor = color;
			group.appendTop( triangle );
			num++;
			
		}
	}

	return group;
}


// ------------------------------------------------------------------------
function Palettes() {
	var palette = new Array();

	if(values.modusColor == 'Red/Blue') {
		palette[0] = Red;
		palette[1] = Blue;

	} else if(values.modusColor == 'Red/Cyan') {
		palette[0] = Red;
		palette[1] = Cyan;

	} else if(values.modusColor == 'Yellow/Dark Gray/White') {
		palette[0] = Yellow;
		palette[1] = DkGray;
		palette[2] = White;

	} else if(values.modusColor == 'Orange/Black') {
		palette[0] = Orange;
		palette[1] = Black;

	} else if(values.modusColor == 'Green/Tan/Light Gray') {
		palette[0] = Green;
		palette[1] = Tan;
		palette[2] = LtGray;

	} else if(values.modusColor == 'Black/Gold') {
		palette[0] = Black;
		palette[1] = Gold;

	} else if(values.modusColor == 'Black/Blue') {
		palette[0] = Black;
		palette[1] = Blue;

	} else {
		//Black/White is default
		palette[0] = Black;
		palette[1] = White;
	}


	return palette;
}

function randomPaletteColor() {
	var colArray = Palettes();
	var sel = parseInt(random(colArray.length));
	//print("colArray[sel]", colArray[sel]);
	return colArray[sel];
}


// ------------------------------------------------------------------------
/**
 *	snap function from:
 *	http://stackoverflow.com/questions/4507784/snap-to-grid-functionality-using-javascript
 */
function snap(value, gridSize, roundFunction) {
    if (roundFunction === undefined) roundFunction = Math.round;
    return gridSize * roundFunction(value / gridSize);
}


function random(minr, maxr) { return minr + Math.random() * (maxr - minr); }
function random(maxr) { return 0 + Math.random() * (maxr - 0); }

function norm(val,start,stop) { return (val - start) / (stop - start); }
function lerp(start, stop, amt) { return start + (stop-start) * amt; }
function map(value, istart, istop, ostart, ostop) { return ostart + (ostop - ostart) * ((value - istart) / (istop - istart)); }

function degrees(val) { return val * (180/Math.PI); }
function radians(val) { return val * (Math.PI/180); }



// ------------------------------------------------------------------------
// Classes
// ------------------------------------------------------------------------


/**
 *
 *	FTriangle
 *
 */

// ------------------------------------
// inheritance
// ------------------------------------
FTriangle.prototype = new Path();
FTriangle.prototype.constructor = FTriangle;


//constants
FTriangle.RIGHT = 0;
FTriangle.EQUILATERAL = 1;
var EPSILON = 1.0e-6;


// ------------------------------------
//constructor
// ------------------------------------
function FTriangle( pt, sz, type ) {
	Path.call(this);
	
	//properties
	this.pt = pt;
	this.sz = sz;
	this.type = type;
	this.circle;

	//determine shape
	if(type == 0) this.Right();
	else if(type == 1) this.Equilateral();
	else if(type === undefined) this.Equilateral();
	//this.circle = this.Circumcenter();

	//draw the shape
	this.path = new Path();
	this.path.segments.add( new Segment(this.v0) );
	this.path.segments.add( new Segment(this.v1) );
	this.path.segments.add( new Segment(this.v2) );
	this.path.closed = true;

	//this.path.position = this.Centroid();

	return this.path;
}


// ------------------------------------
// methods
// ------------------------------------
FTriangle.prototype.Right = function() {
	this.v0 = new Point(this.pt.x-this.sz.width * 0.5, this.pt.y+this.sz.height * 0.5); 
	this.v1 = new Point(this.pt.x+this.sz.width * 0.5, this.pt.y+this.sz.height * 0.5);
	this.v2 = new Point(this.pt.x+this.sz.width * 0.5, this.pt.y-this.sz.height * 0.5);
}
FTriangle.prototype.Equilateral = function() {
	this.v0 = new Point(this.pt.x-this.sz.width * 0.5, this.pt.y+this.sz.height * 0.5);
	this.v1 = new Point(this.pt.x+this.sz.width * 0.5, this.pt.y+this.sz.height * 0.5);
	this.v2 = new Point(this.pt.x,this.pt.y);
}

FTriangle.prototype.rotate = function(ang) {
	this.path.rotate(ang, this.centroid);
}

/**
 *	return a Point of the centroid center
 *
 *	http://www.mathwords.com/c/centroid_formula.htm
 */
FTriangle.prototype.Centroid = function() {
	var x = (this.v0.x + this.v1.x + this.v2.x)/3;
	var y = (this.v0.y + this.v1.y + this.v2.y)/3;
	return new Point(x,y);
}


/**
 *	return a Center of the circumcircle
 *
 *	http://www.mathwords.com/c/centroid_formula.htm
 */
FTriangle.prototype.Circumcenter = function() {
	var x,y;
	var m1,m2;
	var mx1,mx2;
	var my1,my2;

	if ( Math.abs(this.v1.y-this.v0.y) < EPSILON ) {
		m2 = - (this.v2.x-this.v1.x) / (this.v2.y-this.v1.y);
		mx2 = (this.v1.x + this.v2.x) / 2.0;
		my2 = (this.v1.y + this.v2.y) / 2.0;
		x = (this.v1.x + this.v0.x) / 2.0;
		y = m2 * (x - mx2) + my2;

	} else if ( Math.abs(this.v2.y-this.v1.y) < EPSILON ) {
		m1 = - (this.v1.x-this.v0.x) / (this.v1.y-this.v0.y);
		mx1 = (this.v0.x + this.v1.x) / 2.0;
		my1 = (this.v0.y + this.v1.y) / 2.0;
		x = (this.v2.x + this.v1.x) / 2.0;
		y = m1 * (x - mx1) + my1;	

	} else {
		m1 = - (this.v1.x-this.v0.x) / (this.v1.y-this.v0.y);
		m2 = - (this.v2.x-this.v1.x) / (this.v2.y-this.v1.y);
		mx1 = (this.v0.x + this.v1.x) / 2.0;
		mx2 = (this.v1.x + this.v2.x) / 2.0;
		my1 = (this.v0.y + this.v1.y) / 2.0;
		my2 = (this.v1.y + this.v2.y) / 2.0;
		x = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
		y = m1 * (x - mx1) + my1;
	}
	
	return new Point(x,y);
}



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
//Draw();



