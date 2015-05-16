/**
 *	FTriangle Example
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://cargocollective.com/kenfrederick/
 *	http://kenfrederick.blogspot.com/
 *
 *	
 *	An example of FTriangle
 *
 */


// ------------------------------------------------------------------------
// Libraries
// ------------------------------------------------------------------------
include('../libraries/frederickkScript/frederickkScript.js');



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

script.coordinateSystem = 'top-down';
script.angleUnits = 'radians';

// load frederickkScript
var f = frederickkScript;

// document properties
var triangle;
var triangles;

var hitPath;
var hitSegment;
var hitOptions = {
	segments: true,
	fill: true,
	tolerance: 10
};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// Setup our holder group
	triangles = new Group();

	// create FTriangle
	triangle = new Path.FTriangle( 
		new Point( 100,100 ),
		new Point( artboard.bounds.width-100,artboard.bounds.height/2 ),
		new Point( 100, artboard.bounds.height-100 )
	);

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
	// workaround for clearing redraws	
	triangles.removeChildren();


	// triangle
	triangle.fillColor = new RGBColor( 0.98, 0.98, 0.98 );
	triangles.appendTop(triangle);


	/*
	 *
	 *	Draw the different triangle centers
	 *
	 */
	// triangle centroid
	var p = new Path.Circle( triangle.position, 6 );
	p.fillColor = new RGBColor( 0.0, 0.0, 0.0 );
	triangles.appendTop(p);

	// triangle centroid
	var c = new Path.Circle( triangle.getCentroid(), 6 );
	c.fillColor = new RGBColor( 1.0, 0.0, 0.0 );
	triangles.appendTop(c);


	// triangle orthocenter
	// var oc = new Path.Circle( triangle.getOrthocenter(), 6 );
	// oc.fillColor = new RGBColor( 1.0, 0.0, 0.7 );
	// triangles.appendTop(oc);

	
	// triangle Circumcenter
	var cc = new Path.Circle( triangle.getCircumCircle(), 6 );
	cc.fillColor = new RGBColor( 0.0, 1.0, 0.7 );
	triangles.appendTop(cc);

	// triangle CircumCircle radius
	var r = new Path.Circle( triangle.getCircumCircle(), triangle.radius );
	r.fillColor = new RGBColor( 0.0, 1.0, 0.7 );
	triangles.appendBottom(r);

};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
// function onMouseUp(event) {
// };

// function onMouseDown(event) {
// 	var hitResult = document.hitTest(event.point, hitOptions);

// 	if (hitResult) {
// 		hitPath = hitResult.item;
// 		if (hitResult.type == 'segment' || hitResult.type == 'curve') { // && hitPath.name == 'triangle') {
// 			hitSegment = hitResult.segment;
// 		}
// 	}
// };

// function onMouseMove(event) {
// 	var hitResult = document.hitTest(event.point, hitOptions);
// 	document.activeLayer.selected = false;
// 	if (hitResult && hitResult.item && hitResult.item.name == 'triangle') {
// 		hitResult.item.selected = true;
// 	}
// };

// function onMouseDrag(event) {
// 	if (hitSegment) {
// 		hitSegment.point = event.point;
// 		Draw();
// 	}
// };




// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Animate(false);
Draw();

