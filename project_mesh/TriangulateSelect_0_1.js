/**
 *	Triangulate Selected 0.1
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
// include('../libraries/frederickkScript/frederickkScript.js');



// ------------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------------

// document properties
var sel;
var palette;

// rasters
var raster;
var isRasterValid = false;


// mesh properties
var triangles = [];
var points = [];
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
			var amt = (activeDocument.activeArtboard.bounds.width/2*activeDocument.activeArtboard.bounds.height/2);
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
	
	fRule: { 
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

	// initial rasters
	RasterSetup();

	// initiate group for faces
	groupFaces = new Group();

	// open palette
	palette = new Palette('Triangulate Selected 0.1', components, values);

	// initial triangulation of selection
	addPoints(sel);
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
/*
 *
 *	Triangulation Support
 *
 */
function drawFaces(triangles) {
	groupFaces.removeChildren();

	// draw faces
	for( i=0; i<triangles.length; i++ ) {
		var triangle = triangles[i];

		// draw triangle
		if( triangle != undefined) {
			face = new Path();
			face.add( triangle.v0 );
			face.add( triangle.v1 );
			face.add( triangle.v2 );
			face.closed = true;


			// fill face
			if( values.fillType != 'None' && isRasterValid ) {
				// gather colors
				var cenPt = face.position;
				var colPt = new Point( cenPt.x - raster.position.x + raster.width*0.5, 
									   cenPt.y - raster.position.y + raster.height*0.5 );

				if( values.fillType == 'Lines' ) {
					// fill with lines

				}
				else if( values.fillType == 'Colors' ) {
					// fill with colors from image
					var colAvg = averageColor(colPt, new Size(3,3));
					face.fillColor = colAvg;
					face.strokeColor = null;
				}

			}
			else {
				// just connect, black stroke
				face.strokeWidth = 2;
				face.strokeColor = new RGBColor(0.0, 0.0, 0.0);
				face.fillColor = null;
			}
			face.opacity = values.opacity/100;

			// add to faces group
			groupFaces.appendTop( face );
		}
	}
};

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
	triangles = Triangulate( points );

	// update drawn faces
	drawFaces(triangles);
};

function addNoise(amt) {
	for( var i=0; i<amt; i++ ) {
		var pt = new Point(
			Math.random() * activeDocument.activeArtboard.bounds.width,
			Math.random() * activeDocument.activeArtboard.bounds.height
		);
		points.push( pt );
	}

	// check for duplicates
	// points = points.unique();

	// triangulate
	triangles = Triangulate( points );

	// update drawn faces
	drawFaces(triangles);
};

function addCenters() {
	for( var i=0; i<triangles.length; i++ ) {
		var triangle = triangles[i];
		if( triangle != undefined) {
			points.push( triangle.centroid() );
		}

	}

	// check for duplicates
	// points = points.unique();

	// triangulate
	triangles = Triangulate( points );

	// update drawn faces
	drawFaces(triangles);
};


// ------------------------------------------------------------------------
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
/*
 *
 *	Raster Support
 *
 */
function RasterSetup() {
	var rasters = document.getItems({
		type: [Raster, PlacedFile],
		selected: true
	});

	if(rasters.length > 0) {
		raster = rasters.first;
		isRasterValid = true;
		if (raster instanceof PlacedFile && !raster.eps) {
			raster = raster.embed(false);
		}
	}
	else {
		isRasterValid = false;
		// RasterSelection();
	}
	
	// no image selected or created
	if(isRasterValid) {
		values.fillType  = 'Colors';
		raster.selected = false;
	}
	else {
		console.log( 'Please select a valid image' );
	}

};

function RasterSelection() {
	var items = activeDocument.getItems({
		type: Item,
		selected: true
	});
	var groupSel = new Group();
	for( var i=0; i<items.length; i++ ) {
		var obj = items[i].clone();
		groupSel.appendTop( obj );
		items[i].selected = false;
	}

	// set background
	var rect = new Path.Rectangle( groupSel.bounds );
	rect.bounds.width += values.rasterWidth;
	rect.bounds.height += values.rasterHeight;
	rect.position = groupSel.position;
	rect.fillColor = new RGBColor(1.0, 1.0, 1.0);
	groupSel.appendBottom( rect );

	// rasterize
	raster = groupSel.rasterize('rgb', 72,0); 
	raster.selected = false;
	isRasterValid = true;

	// remove cloned items
	groupSel.remove();
};



// ------------------------------------------------------------------------
/*
 *
 *	Array Support
 *
 */
function median(arr) {
	var median = 0;
	arr.sort();
	if (arr.length % 2 === 0) {
		median = (arr[arr.length / 2 - 1] + arr[arr.length / 2]) / 2;
	} else {
		median = arr[(arr.length - 1) / 2];
	}
	return median;
};
function unique(arr) {
	var u = [];
	o:for(var i=0, n=arr.length; i<n; i++) {
		for(var x=0, y=u.length; x<y; x++) {
			if(u[x] == arr[i]) {
				continue o;
			}
		}
		u[u.length] = arr[i];
	}
	return u;
};


// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
Draw();




/**
 *	
 *	Delaunay Triangulation
 *	Joshua Bell
 *	inexorabletash@hotmail.com
 *
 *	http://www.travellermap.com/
 *	Inspired by: http://www.codeguru.com/cpp/data/mfc_database/misc/article.php/c8901/
 * 
 *	Modifications for specific use with Scriptographer, Ken Frederick
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 *	Validated with JSLint, http://www.jslint.com
 *
 *	This work is hereby released into the Public Domain. To view a copy of the public 
 *	domain dedication, visit http://creativecommons.org/licenses/publicdomain/ or send 
 *	a letter to Creative Commons, 171 Second Street, Suite 300, San Francisco, 
 *	California, 94105, USA.
 *	
 */


var EPSILON = 1.0e-6;

// ------------------------------------------------------------------------
// Triangle class
// ------------------------------------------------------------------------
function Triangle( v0, v1, v2 ) {
	this.v0 = v0;
	this.v1 = v1;
	this.v2 = v2;
	
	this.center;

	this.CalcCircumcircle = function() {
		// From: http://www.exaflop.org/docs/cgafaq/cga1.html

		var A = this.v1.x - this.v0.x; 
		var B = this.v1.y - this.v0.y; 
		var C = this.v2.x - this.v0.x; 
		var D = this.v2.y - this.v0.y; 

		var E = A*(this.v0.x + this.v1.x) + B*(this.v0.y + this.v1.y); 
		var F = C*(this.v0.x + this.v2.x) + D*(this.v0.y + this.v2.y); 

		var G = 2.0*(A*(this.v2.y - this.v1.y)-B*(this.v2.x - this.v1.x)); 
	
		var dx, dy;
	
		if( Math.abs(G) < EPSILON ) {
			// Collinear - find extremes and use the midpoint

			function max3( a, b, c ) { return ( a >= b && a >= c ) ? a : ( b >= a && b >= c ) ? b : c; }
			function min3( a, b, c ) { return ( a <= b && a <= c ) ? a : ( b <= a && b <= c ) ? b : c; }

			var minx = min3( this.v0.x, this.v1.x, this.v2.x );
			var miny = min3( this.v0.y, this.v1.y, this.v2.y );
			var maxx = max3( this.v0.x, this.v1.x, this.v2.x );
			var maxy = max3( this.v0.y, this.v1.y, this.v2.y );

			this.center = new Point( ( minx + maxx ) / 2, ( miny + maxy ) / 2 );

			dx = this.center.x - minx;
			dy = this.center.y - miny;
	
		} else {
			var cx = (D*E - B*F) / G; 
			var cy = (A*F - C*E) / G;

			this.center = new Point( cx, cy );

			dx = this.center.x - this.v0.x;
			dy = this.center.y - this.v0.y;
		}

		this.radius_squared = dx * dx + dy * dy;
		this.radius = Math.sqrt( this.radius_squared );
	};

	this.InCircumcircle = function( v ) {
		var dx = this.center.x - v.x;
		var dy = this.center.y - v.y;
		var dist_squared = dx * dx + dy * dy;
		return ( dist_squared <= this.radius_squared );
	};

	this.centroid = function() {
		return new Point(
			(this.v0.x + this.v1.x + this.v2.x)/3,
			(this.v0.y + this.v1.y + this.v2.y)/3
		);
	};


	this.CalcCircumcircle();
};


// ------------------------------------------------------------------------
// Edge class
// ------------------------------------------------------------------------
function Edge( v0, v1 ) {
	this.v0 = v0;
	this.v1 = v1;
}; // Edge



/**
 *	Triangulate
 *	Perform the Delaunay Triangulation of a set of vertices.
 *
 *	vertices: Array of Point objects
 *	returns: Array of Triangles
 *
 */
function Triangulate( vertices ) {
	var triangles = [];

	// First, create a "supertriangle" that bounds all vertices
	var st = CreateBoundingTriangle( vertices );

	triangles.push( st );

	// Next, begin the triangulation one vertex at a time
	var i;
	for( i in vertices ) {
		// NOTE: This is O(n^2) - can be optimized by sorting vertices
		// along the x-axis and only considering triangles that have 
		// potentially overlapping circumcircles

		var vertex = vertices[i];
		AddVertex( vertex, triangles );
	}

	// Remove triangles that shared edges with "supertriangle"
	for( i in triangles ) {
		var triangle = triangles[i];

		if( triangle.v0 == st.v0 || triangle.v0 == st.v1 || triangle.v0 == st.v2 ||
			triangle.v1 == st.v0 || triangle.v1 == st.v1 || triangle.v1 == st.v2 ||
			triangle.v2 == st.v0 || triangle.v2 == st.v1 || triangle.v2 == st.v2 ) {
			delete triangles[i];
		}
	}

	return triangles;
	
}; // Triangulate


// Internal: create a triangle that bounds the given vertices, with room to spare
function CreateBoundingTriangle( vertices ) {
	// NOTE: There's a bit of a heuristic here. If the bounding triangle 
	// is too large and you see overflow/underflow errors. If it is too small 
	// you end up with a non-convex hull.
	
	var minx, miny, maxx, maxy;
	for( var i in vertices ) {
		var vertex = vertices[i];

		if( minx === undefined || vertex.x < minx ) { minx = vertex.x; }
		if( miny === undefined || vertex.y < miny ) { miny = vertex.y; }
		if( maxx === undefined || vertex.x > maxx ) { maxx = vertex.x; }
		if( maxy === undefined || vertex.y > maxy ) { maxy = vertex.y; }
	}

	var dx = ( maxx - minx ) * 10;
	var dy = ( maxy - miny ) * 10;
	
	var stv0 = new Point( minx - dx,   miny - dy*3 );
	var stv1 = new Point( minx - dx,   maxy + dy   );
	var stv2 = new Point( maxx + dx*3, maxy + dy   );

	return new Triangle( stv0, stv1, stv2 );
	
}; // CreateBoundingTriangle


// Internal: update triangulation with a vertex 
function AddVertex( vertex, triangles ) {
	var edges = [];
	
	// Remove triangles with circumcircles containing the vertex
	var i;
	for( i in triangles ) {
		var triangle = triangles[i];

		if( triangle.InCircumcircle( vertex ) ) {
			edges.push( new Edge( triangle.v0, triangle.v1 ) );
			edges.push( new Edge( triangle.v1, triangle.v2 ) );
			edges.push( new Edge( triangle.v2, triangle.v0 ) );
			delete triangles[i];
		}
	}

	edges = UniqueEdges( edges );

	// Create new triangles from the unique edges and new vertex
	for( i in edges ) {
		var edge = edges[i];
		triangles.push( new Triangle( edge.v0, edge.v1, vertex ) );
	}	
}; // AddVertex


// Internal: remove duplicate edges from an array
function UniqueEdges( edges ) {
	// TODO: This is O(n^2), make it O(n) with a hash or some such
	var uniqueEdges = [];
	for( var i in edges ) {
		var edge1 = edges[i];
		var unique = true;

		for( var j in edges ) {
			if( i != j ) {
				var edge2 = edges[j];
				if( ( edge1.v0 == edge2.v0 && edge1.v1 == edge2.v1 ) ||
					( edge1.v0 == edge2.v1 && edge1.v1 == edge2.v0 ) ) {
					unique = false;
					break;
				}
			}
		}
		
		if( unique ) {
			uniqueEdges.push( edge1 );
		}
	}

	return uniqueEdges;
}; // UniqueEdges



