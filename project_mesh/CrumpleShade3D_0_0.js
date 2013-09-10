/**
*	Crumple Shade 0.0
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

/**
*  Note from the Scriptographer.org Team
*  
*  In Scriptographer 2.9, we switched to a top-down coordinate system and
*  degrees for angle units as an easier alternative to radians.
*  
*  For backward compatibility we offer the possibility to still use the old
*  bottom-up coordinate system and radians for angle units, by setting the two
*  values bellow. Read more about this transition on our website:
*  http://scriptographer.org/news/version-2.9.064-arrived/
*/

//script.coordinateSystem = 'top-down';
script.coordinateSystem = 'bottom-up';
script.angleUnits = 'radians';


// document properties
var cam;
var coords;

var raster;
var rasterEdge;
var rasterValid;

var groupHolder = new Group();

var marker;
var markerAngle = (1/160);
var cursor;


// values
var setupValues = {
	// ------------------------------------
	// 3D projection
	// ------------------------------------
	distToViewplane:	activeDocument.bounds.width,
	distToCoord:		activeDocument.bounds.height,

	// ------------------------------------
	// mode
	// ------------------------------------
	mode:				'Edge Detect',

	// ------------------------------------
	// edges
	// ------------------------------------
	threshold:			1.0,
	density:			6,

	lo:					0.1,
	hi:					0.7
};

var values = {
	// ------------------------------------
	// 3D rotation
	// ------------------------------------
	rotx:				0, //180,
	roty:				0, //35,
	rotz:				0, //-180,

	// ------------------------------------
	// depth
	// ------------------------------------
	zMultiplier:		0,

};


// gui components
var setupComponents = {
	// ------------------------------------
	// 3D projection
	// ------------------------------------
	/*
	distToViewplane: {
		type: 'number',
		label: 'Distance To Viewplane',
		units: 'point',
		steppers: true,
		increment: 10
	},

	distToCoord: {
		type: 'number',
		label: 'Distance To Coord',
		units: 'point',
		steppers: true,
		increment: 10
	},

	projRule: { 
		type: 'ruler',
		fullSize: true,
	},
	*/

	mode: {
		options: ['Grid','Edge Detect','Phyllotactic']
	},
	
	// ------------------------------------
	// edges
	// ------------------------------------
	threshold: {
		type: 'number',
		label: 'Threshold',
	},
	density: {
		type: 'number',
		label: 'Density',
	},
	
	projRule: { 
		type: 'ruler',
		fullSize: true,
	},

	lo: {
		type: 'number',
		label: 'Sensitivity Low',
	},
	hi: {
		type: 'number',
		label: 'Sensitivity High',
	}
};


var components = {
	// ------------------------------------
	// 3D rotation
	// ------------------------------------
	//	X
	rotx: {
		type: 'number',
		label: 'X Rotation',
		fractionDigits: 2,
		steppers: true,
		increment: 1,
		onChange: function(value) {
			Draw();
		}
	},

	//	Y
	roty: {
		type: 'number',
		label: 'Y Rotation',
		fractionDigits: 2,
		steppers: true,
		increment: 1,
		onChange: function(value) {
			Draw();
		}
	},

	//	z
	rotz: {
		type: 'number',
		label: 'Z Rotation',
		fractionDigits: 2,
		steppers: true,
		increment: 1,
		onChange: function(value) {
			Draw();
		}
	},

	rotRule: { 
		type: 'ruler',
		fullSize: true,
	},

	// ------------------------------------
	// depth
	// ------------------------------------
	zMultiplier: {
		type: 'number',
		label: 'Z Depth Multiplier',
		units: 'none',
		steppers: true,
		increment: 1,
		onChange: function(value) {
			Draw();
		}
	}

};





// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	var dialog = new Dialog.prompt('Crumple Shade Setup', setupComponents, setupValues);

	//projection setup
	cam = new Cam(activeDocument.bounds.width, activeDocument.bounds.height);
	setupValues.distToViewplane = cam.C[1]*2;
	setupValues.distToCoord = cam.C[1]*2;

	//gather raster info
	RasterSetup();

	var palette = new Palette('Crumple Shade 0.0', components, values);
	Draw();
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
	cam.SetRotationXYZ( values.rotx, values.roty, values.rotz );
	groupHolder.removeChildren();
	
	Render();
}



// ------------------------------------------------------------------------
// events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	//marker = new PointText( event.point ); 
	//marker.characterStyle.fontSize = 72; 
	cursor = new Path.Circle(new Point(0,0), 5);;
}

function onMouseDrag(event) {
	/*
	if(event.modifiers.option) {
		for (var i in coords.array) {
			var distance = event.point.getDistance(coords.array[i].point3D);
			//print( i + ' -- ' + distance );

			if(distance > -2 && distance < 2) {
				//print( cursor );
				//coords.addCoord( event.point.x, event.point.y, 0 );
				coords.AddCoord( random(-100,100),random(-100,100),random(-100,100) );
				//cursor.bounds.point = coords.array[i].point3D;
				//coords.array[i].point3D = new Point(0,0); //event.point;
			}
		}

		print('coords.array', coords.array.length);
	}
	*/
	
	if (Key.isDown('x')) values.rotx = markerAngle;  //X
	if (Key.isDown('y')) values.roty = markerAngle;  //y
	if (Key.isDown('z')) values.rotz = markerAngle;  //z
	if (event.modifiers.shift) values.zMultiplier = event.point.y;
}

function onMouseUp(event) {
	cursor.remove();
	//marker.remove();
	Draw();
}



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function random(minr, maxr) {
	return minr + Math.random() * (maxr - minr);
}

function norm(val,start,stop) {
	return (val - start) / (stop - start);
}

function roundDecimal(orig,deci) {
	var multi = Math.pow(10,deci);
	return num = Math.round(orig * multi)/multi;
}

function degrees(val) {
	return val * (180/Math.PI);
}
function radians(val) {
	return val * (Math.PI/180);
}
function getAngle(event) {
	return Math.atan2(event.point.y - 0, event.point.x - 0);
}


// ------------------------------------------------------------------------
function RasterSetup() {
	var rasters = document.getItems( { type: [Raster, PlacedFile], selected: true } );

	if (rasters.length > 0) {
		raster = rasters.first;
		if (raster instanceof PlacedFile && !raster.eps) {
			raster = raster.embed(false);
		}
		rasterValid = true;

		coords = new Coordinates();
		//grid
		if(setupValues.mode == 'Grid') {
			coords.FindEdges(raster, setupValues.density, 0.0,1.0);
		}

		//edge detection
		if(setupValues.mode == 'Edge Detect') {
			rasterEdge = new EdgeDetect(raster);
			rasterEdge.Process(setupValues.threshold);
			coords.FindEdges(rasterEdge.edges, setupValues.density, setupValues.lo,setupValues.hi);
		}

		//phyllotactic

		raster.selected = false;
	} else {
		rasterValid = false;
		Dialog.alert('Please choose or create a valid raster image');
	}

}



// ------------------------------------------------------------------------
function Render() {

	var pathLines = new Path();
	for (var i in coords.array) {
		var alpha = coords.array[i].z;
		coords.array[i].point3D = new Point3D( coords.array[i].x,coords.array[i].y, alpha*values.zMultiplier);

		//node
		//var node = new Path.Circle( coords.array[i].point3D, setupValues.density*2 );
		//node.fillColor = raster.getPixel( coords.array[i].point );
		//node.strokeColor = null;
		//node.scale(alpha);	
		//groupHolder.appendTop( node );
	}

	//mesh faces
	var triangles = Triangulate( coords.array );
	for (var i in triangles) {
		var triangle = triangles[i];

		if(triangle != undefined) {
			//print(triangle);

			//face
			var container = new Group();

			var face = new Path();
			face.moveTo( triangle.v0.x, triangle.v0.y );
			face.lineTo( triangle.v1.x, triangle.v1.y );
			face.lineTo( triangle.v2.x, triangle.v2.y );
			face.closed = true;
			face.strokeColor = null;

			var image = raster.clone();
			image.position = rasterEdge.edges.position;
			image.position = ( face.position ); 

			container.appendTop(image);
			container.appendTop(face);
			container.clipped = true;
			face.clipMask = true;

			//get color
			face.fillColor = raster.getPixel( triangle.raw.point );
			//container.opacity = 1-triangle.raw.z;


			//shadow
			var shadow = new Path();
			shadow.moveTo( triangle.v0.x, triangle.v0.y );
			shadow.lineTo( triangle.v1.x, triangle.v1.y );
			shadow.lineTo( triangle.v2.x, triangle.v2.y );
			shadow.closed = true;
			shadow.strokeColor = null;
			shadow.fillColor = new CMYKColor(0.0, 0.0, 0.0, 1.0);
			shadow.opacity = 1-norm(triangle.raw.z*values.zMultiplier, 0,values.zMultiplier);
			shadow.blendMode = 'multiply';
			container.appendTop(shadow);
		
			//add to group
			groupHolder.appendTop( container );
		}
	}

	//groupHolder.bounds = raster.bounds;
	
}



// ------------------------------------------------------------------------
// 3D classes/methods
// ------------------------------------------------------------------------

/**
*
*	3D Camera
*	Bernhard Häussner
*	amoebe@abwesend.de
*
*	http://bernhardhaeussner.de/blog/83_3D-Perspektive_mit_einer_kurzen_Formel
*	
*	Modifications for specific use with Scriptographer, Ken Frederick
*	http://kennethfrederick.de/
*	http://blog.kennethfrederick.de/
*
*/
function Cam(distToViewplane,distToCoord) {
	this.distToViewplane = distToViewplane;
	this.distToCoord = distToCoord;
	this.C = [];

	this.SetProjection(distToViewplane,distToCoord);
}
Cam.prototype = {
	SetProjection: function(distToViewplane,distToCoord) {
		this.C = [distToViewplane,distToCoord];
		this.rotx = 0;
		this.roty = 0;
		this.rotz = 0;
	},
	CalcPicpoint: function(vec) {
		vec = [ vec[0] - this.C[0]*0.5, vec[1] - this.C[1]*0.5, -vec[2] ];
		vec = this.RotateX(vec, radians(this.rotx) );
		vec = this.RotateY(vec, radians(this.roty) );
		vec = this.RotateZ(vec, radians(this.rotz) );
		return [ this.ApplyStr(vec[0],vec[2]), this.ApplyStr(vec[1],vec[2]) ];
	},
	ApplyStr: function(cor,z) {
		return ( cor * this.distToViewplane ) / ( z + this.distToCoord );
	},

	SetRotationXYZ: function(degx,degy,degz) {
		this.rotx = degx;
		this.roty = degy;
		this.rotz = degz;
	},

	/**
	*	3D rotation formulas as taken from
	*	http://www.siggraph.org/education/materials/HyperGraph/modeling/mod_tran/3drota.htm
	*/
	RotateX: function(vec, degBog) {
		var x = vec[0];
		var y = Math.cos(degBog) * vec[1] - Math.sin(degBog) * vec[2];
		var z = Math.sin(degBog) * vec[1] + Math.cos(degBog) * vec[2];
		return [ x,y,z ];
	},
	 RotateY: function(vec, degBog) {
		var x = Math.sin(degBog) * vec[2] + Math.cos(degBog) * vec[0];
		var y = vec[1];
		var z = Math.cos(degBog) * vec[2] - Math.sin(degBog) * vec[0];
		return [ x,y,z ];
	},
	 RotateZ: function(vec, degBog) {
		var x = Math.cos(degBog) * vec[0] - Math.sin(degBog) * vec[1];
		var y = Math.sin(degBog) * vec[0] + Math.cos(degBog) * vec[1];
		var z = vec[2];
		return [ x,y,z ];
	}
}



/**
*
*	Ken Frederick
*	ken.frederick@gmx.de
*
*	simple 3D point class
*	Cam class is required
*
*/

function Point3D(x,y,z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.To2D(x,y,z);
}
Point3D.prototype = {
	To2D: function(x,y,z) {
		var Vector3D = [x,y,z];
		var lfrom = cam.CalcPicpoint(Vector3D);
		//return new Point(cam.C[0]/2 + lfrom[0], cam.C[1]/2 + lfrom[1]);
		this.x = cam.C[0]/2 + lfrom[0];
		this.y = cam.C[1]/2 + lfrom[1];
	}
}

function Coordinates() {
	this.array = new Array();
}
Coordinates.prototype = {
	Corners: function(_raster) {
		var temp = new Array();
		temp[0] = new Point(0,0);
		temp[1] = new Point(_raster.width,0);
		temp[2] = new Point(_raster.width,_raster.height);
		temp[3] = new Point(0,_raster.height);
	
		for(var i in temp) {
			this.AddCoord(temp[i].x,temp[i].y,0);
		}
	}, //end Corners

	FindEdges: function(_raster, _density,_low,_high) {
		this.array.clear();
		this.Corners(_raster);
		for (var x=1; x<_raster.width-1; x+=_density) {
			for (var y=1; y<_raster.height-1; y+=_density) {
				var b = _raster.getPixel( new Point(x,y) ).gray;
				if ( b > _low && b < _high ) {
					this.AddCoord(x,y, b);
				}
			}
		}

	}, // end FindEdges

	AddCoord: function(x,y,z) {
		this.array.push({
			x:			x,
			y:			y,
			z:			z,
			point:		new Point(x,y),
			point3D:	new Point(x,y) //new Point3D(x,y,z)
		});
	} // end AddCoord

}

function Phyllotactic() {
	var rotation = 137.51;
	var num = values.dotNumber;
	var x,y;
	
	coords.array.clear();
	for(var i=1; i<=num; i++) {
		//location
		var radius = _density * Math.sqrt(i);
		var theta = i * radians( rotation );

		x = radius * Math.cos(theta);
		y = radius * Math.sin(theta);

		//add to our coords
		coords.AddCoord(x,y,0);
		//new Point(origin.x + x,origin.y + y);
		
	}

}




// ------------------------------------------------------------------------
// edge detection classes/methods
// ------------------------------------------------------------------------

/**
*
*	Ken Frederick
*	ken.frederick@gmx.de
*
*	edge detection class with some inspired from
*	http://processing.org/learning/topics/edgedetection.html
*
*/

function EdgeDetect(_raster) {
	//properties
	//this.coords = new Coordinates();
	this.kernel = [[ -1, -1, -1 ],
				   [ -1,  1, -1 ],
				   [ -1, -1, -1 ]];

	this.edges = _raster.clone();
}

EdgeDetect.prototype = {
	Process: function(_threshold) {
		this.kernel[1][1] = _threshold;
		for (var y=1; y<this.edges.height-1; y++) {
			for (var x=1; x<this.edges.width-1; x++) {

				var sum = 0; // Kernel sum for this pixel
				for (var ky = -1; ky <= 1; ky++) {
					for (var kx = -1; kx <= 1; kx++) {
						var pos = new Point( (x + kx), (y + ky) );
						var val = roundDecimal(this.edges.getPixel(pos).gray*255, 0);
						sum += (this.kernel[ky+1][kx+1] * val)/255;
					}
				}
				
				this.edges.setPixel( new Point(x,y), new GrayColor(sum) );
			}
		}
	}, //end Process

}



// ------------------------------------------------------------------------
// triangulation classes/methods
// ------------------------------------------------------------------------

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
function Triangle( v0, v1, v2, raw ) {
	this.v0 = v0;
	this.v1 = v1;
	this.v2 = v2;
	this.raw = raw;
	this.CalcCircumcircle();
	
} // Triangle

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
}; // end CalcCircumcircle

Triangle.prototype.InCircumcircle = function( v ) {
	var dx = this.center.x - v.x;
	var dy = this.center.y - v.y;
	var dist_squared = dx * dx + dy * dy;
	return ( dist_squared <= this.radius_squared );
}; // end InCircumcircle


// ------------------------------------------------------------------------
// Edge class
// ------------------------------------------------------------------------
function Edge( v0, v1 ) {
	this.v0 = v0;
	this.v1 = v1;
} // end Edge


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
	
} // end Triangulate


// Internal: create a triangle that bounds the given vertices, with room to spare
function CreateBoundingTriangle( vertices ) {
	// NOTE: There's a bit of a heuristic here. If the bounding triangle 
	// is too large and you see overflow/underflow errors. If it is too small 
	// you end up with a non-convex hull.
	
	var minx, miny, maxx, maxy;
	for( var i in vertices ) {
		var vertex = vertices[i].point3D;
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
	
} // end CreateBoundingTriangle


// Internal: update triangulation with a vertex 
function AddVertex( vertex, triangles ) {
	var edges = [];
	
	// Remove triangles with circumcircles containing the vertex
	var i;
	for( i in triangles ) {
		var triangle = triangles[i];

		if( triangle.InCircumcircle( vertex.point3D ) ) {
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
		triangles.push( new Triangle( edge.v0, edge.v1, vertex.point3D, vertex ) );
	}	
} // end AddVertex


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
} // end UniqueEdges



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
//Draw();








