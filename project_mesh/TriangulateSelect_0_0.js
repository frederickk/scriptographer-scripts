/**
 *	Triangulate Selected 0.0
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

// mesh properties
var triangles = [];
var points = [];
var groupFaces;

// values
var values = {
	bRandom:			false
};

// gui components
var components = {
	bRandom: {
		type:	'checkbox',
		label:	'Random Connections?'
	}
};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems({
		selected: true
	});
	var palette = new Dialog.prompt('Triangulate Selected 0.0', components, values);

	groupFaces = new Group();
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
	for(var i=0; i<sel.length; i++) {
		if(values.bRandom) {
			var rand = parseInt( Math.random()*2 );
			if( rand == 0) {
				points.push( sel[i].bounds.point );
			}
		}
		else {
			points.push( sel[i].bounds.point );
		}
		console.log( points[points.length-1] );
	}
	console.log( 'triangulating ' + points.length );

	// triangulate
	triangles = Triangulate( points );
	drawFaces(triangles);
};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function drawFaces(triangles) {
	groupFaces.removeChildren();

	for( var i=0; i<triangles.length; i++ ) {
		var triangle = triangles[i];

		if( triangle != undefined) {
			face = new Path();
			face.add( triangle.v0 );
			face.add( triangle.v1 );
			face.add( triangle.v2 );
			face.closed = true;
			face.strokeWidth = 1;
			face.strokeColor = new RGBColor(0,0,0);
			face.fillColor = null;

			groupFaces.appendTop( face );
		}
	}
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



