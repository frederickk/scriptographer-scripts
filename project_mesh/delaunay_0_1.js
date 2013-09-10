/**
 *	delaunay 0.1
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 *	this idea is 100% ripped off from jonathan puckey
 *	http://www.jonathanpuckey.com/projects/delaunay-raster/
 *
 *	the code is mine and libraries used have been modified
 *	specifically for use with scriptographer (see notes)
 *	
 */



// ------------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------------

//document properties
var rasters;
var raster;

//mesh properties
var groupFaces = new Group();
var groupNodes = new Group();
var points = new Array();

var IMAGE = false;

// values
var values = {
	bNodes:			false,
	bDrag:			false,

	bGradient:		true,
	gOffX:			10,
	gOffY:			0,
	
	opacity:		0.5,
	
};

// gui components
var components = {
	bNodes: {
		type:	'checkbox',
		label:	'Draw Nodes?'
	},
	bDrag: {
		type:	'checkbox',
		label:	'Drag and Draw?'
	},

	nodesRul: { 
		type: 'ruler',
		fullSize: true,
	},

	bGradient: {
		type:	'checkbox',
		label:	'Gradient Fill'
	},
	gOffX: {
		type:	'number',
		label:	'Gradient Offset X',
		steppers:	true
	},
	gOffY: {
		type:	'number',
		label:	'Gradient Offset Y',
		steppers:	true
	},
	
	gradientRule: { 
		type: 'ruler',
		fullSize: true,
	},

	opacity: {
		type:	'number',
		label:	'Opacity',
		steppers:	true,
		units: 'percent',
		min:	0,
		max:	100,
		onChange: function(value) {
			try {
				groupFaces.opacity = (value/100);
			} catch(err) {
				print('draw something');
			}
		}
	}
	
};


// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	rasters = document.getItems({
		type: [Raster, PlacedFile],
		selected: true
	});

	//load our image
	if( rasters.length == 0 ) {
		IMAGE = false;
		Dialog.alert('you forgot to select an image\nplease select an image and restart script');
	} else {
		IMAGE = true;

		// initialize the palette window
		var palette = new Palette('delaunay 0.1', components, values);

		raster = rasters.first;
		if (raster instanceof PlacedFile && !raster.eps) {
			// Embed placed images so the raster script can access pixels
			raster = raster.embed(false);
		}
	}

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
	console.log( 'Draw()' );

	//clear group contents
	if( groupNodes.hasChildren() ) {
		groupNodes.removeChildren();
	}
	if( groupFaces.hasChildren() ) {
		groupFaces.removeChildren();
	}

	//connection nodes
	if( values.bNodes ) {
		for( i in points ) {
			var vertex = points[i];

			var node = new Path.Circle( new Point(vertex.x,vertex.y), 5);
			//node.fillColor = raster.getPixel(vertex.x, vertex.y);
			node.fillColor = new CMYKColor(0,1,0,0);
			node.strokeColor = null;
			groupNodes.appendTop(node);
		}
	}

	//mesh faces
	var triangles = Triangulate( points );
	for( var i=0; i<triangles.length; i++ ) {
		var triangle = triangles[i];

		//face
		face = new Path();
		face.moveTo( triangle.v0.x, triangle.v0.y );
		face.lineTo( triangle.v1.x, triangle.v1.y );
		face.lineTo( triangle.v2.x, triangle.v2.y );
		face.closed = true;
		face.strokeColor = null;

		//center point of face
		//get color
		var cenPt = face.position;
		var colPt = new Point( cenPt.x - raster.position.x + raster.width/2, 
							   cenPt.y - raster.position.y + raster.height/2 );
		var offPt = new Point( values.gOffX, values.gOffY );

		//gather colors
		var colImg = raster.getPixel( colPt );
		var colAvg = raster.getPixel( sub(colPt,offPt) );

		if( values.bGradient ) {
			var gradient = new Gradient() { 
				type: 'linear', 
				stops: [new GradientStop( colImg, 0), 
						new GradientStop( colAvg, 1)]
			};
			var gradientColor = new GradientColor( gradient, sub(cenPt,offPt) , add(cenPt,offPt) );
			face.fillColor = gradientColor;
		}
		else {
			face.fillColor = colImg;
		}
		
		
		//add to group
		groupFaces.appendTop(face);
	}
	groupFaces.opacity = (values.opacity/100);

};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function random(minr, maxr) {
	return minr + Math.random() * (maxr - minr);
};

function dist(pt1, pt2) {
	var dx = pt1.x - pt2.x;
	var dy = pt1.y - pt2.y;
	return Math.sqrt(dx*dx + dy*dy);
};

function add(pt1, pt2) {
	return new Point( pt1.x + pt2.x, pt1.y + pt2.y );
};

function sub(pt1, pt2) {
	return new Point( pt1.x - pt2.x, pt1.y - pt2.y );
};

// ------------------------------------------------------------------------
function DelaunayPoint( pt ) {
	console.log( pt );
	points.push( pt );
};



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	var pt = new Point( event.point );
	if( !values.bDrag && IMAGE ) {
		DelaunayPoint( pt );
		Draw();
	}
};

function onMouseDrag(event) {
	var pt = new Point( event.point );
	if( values.bDrag && IMAGE ) {
		// DelaunayPoint( pt );
		// Draw();
	}
};

function onMouseUp(event) {
};




// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
//Draw();




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
	this.CalcCircumcircle();
	
}; // Triangle

Triangle.prototype.CalcCircumcircle = function() {
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
}; // CalcCircumcircle

Triangle.prototype.InCircumcircle = function( v ) {
	var dx = this.center.x - v.x;
	var dy = this.center.y - v.y;
	var dist_squared = dx * dx + dy * dy;
	return ( dist_squared <= this.radius_squared );
}; // InCircumcircle


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

	//First, create a "supertriangle" that bounds all vertices
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



