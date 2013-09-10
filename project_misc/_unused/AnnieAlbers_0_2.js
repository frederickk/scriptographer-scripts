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
// libraries
// ------------------------------------------------------------------------
//include('../libraries/poly2tri-javascript/src/js/poly2tri_sc.js');
include('../libraries/delaunay/delaunay.js');

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

script.coordinateSystem = 'bottom-up';
script.angleUnits = 'radians';

// document properties
var sel;
var origin = new Point(0,0);
var coords = new Array();
var holes = new Array();
var nodes = new Group();



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
}



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
	for(i in coords) {
	}

}



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	print('coords.length', coords.length);

	//if(nodes.hasChildren()) nodes.removeChildren();

	var triangles = Triangulate( coords );
	print('triangles', triangles.length);
	var face = new Path();
	for( i in triangles ) {
		var triangle = triangles[i];
		/*
		var edge0 = new Segment( triangle.v0.x, triangle.v0.y );
		var edge1 = new Segment( triangle.v1.x, triangle.v1.y );
		var edge2 = new Segment( triangle.v2.x, triangle.v2.y );
		*/
		face = new Path.Circle(new Point(triangle.v0.x, triangle.v0.y), 3);
		face.fillColor = new CMYKColor(1, norm(i,0,triangles.length),0,0);
		face.strokeColor = null;

		/*
		face = new Path.Circle(new Point(triangle.v1.x, triangle.v1.y), 3);
		face.fillColor = new CMYKColor(1, norm(i,0,triangles.length),0,0);
		face.strokeColor = null;

		face = new Path.Circle(new Point(triangle.v2.x, triangle.v2.y), 3);
		face.fillColor = new CMYKColor(1, norm(i,0,triangles.length),0,0);
		face.strokeColor = null;

		/*
		face.segments = [edge0, edge1, edge2];
		face.closed = true;
		face.fillColor = null;
		face.strokeColor = new CMYKColor(0,1,0,0);
		*/
	}


}



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	if(Key.isDown('shift') && event.item) {
		for(i in coords) {
			if(event.item.position == coords[i]) {
				coords.splice(i,1);
				break;
			}
		}
		event.item.remove();
	}

}

var path = new Path();
function onMouseDrag(event) {
	origin = event.point;
	path = Path.Circle(origin, 3);
	path.fillColor = new CMYKColor(1,0,0,0);
	path.strokeColor = null;
}

function onMouseUp(event) {
	coords.push(origin);
	Draw();
}



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function triangulate() {

}

// ------------------------------------------------------------------------
function random(minr, maxr) { return minr + Math.random() * (maxr - minr); }

function norm(val,start,stop) { return (val - start) / (stop - start); }
function lerp(start, stop, amt) { return start + (stop-start) * amt; }
function map(value, istart, istop, ostart, ostop) { return ostart + (ostop - ostart) * ((value - istart) / (istop - istart)); }

function degrees(val) { return val * (180/Math.PI); }
function radians(val) { return val * (Math.PI/180); }



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
//Draw();
