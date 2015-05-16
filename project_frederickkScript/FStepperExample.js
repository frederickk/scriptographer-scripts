/**
 *	FStepper Example 0.0
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://cargocollective.com/kenfrederick/
 *	http://kenfrederick.blogspot.com/
 *
 *	
 *	An example of lerping points, sunrise, sunset
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

script.coordinateSystem = 'bottom-up';
script.angleUnits = 'radians';

// load frederickkScript
var f = frederickkScript;

// load FSteper
var ftime = f.FTime;

// document properties

// Stepper for animations
var move;
var blend;
var ball;
// holder for ball's points
var points = [];
// holder for ball's colors
var colors = [];

var background;



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// Setup background
	background = new Path.Rectangle( artboard.bounds.topLeft, artboard.bounds.bottomRight );
	background.strokeColor = null;


	// initiate move FStepper
	move = new ftime.FStepper();
	// Set the time length to 9 seconds
	move.setSeconds( 9 );

	// start point
	points[0] = artboard.bounds.topLeft;
	// points[0].y += artboard.bounds.height;
	// end point
	points[1] = artboard.bounds.bottomRight;
	// points[1].y += artboard.bounds.height;

	// initiate blend FStepper
	blend = new ftime.FStepper();
	// Set the time length to 18000 milliseconds (== 18 seconds)
	blend.setMillis( 18000 );

	// swap colors
	colors[0] = new RGBColor(95/255, 56/255, 102/255);
	colors[1] = new RGBColor(241/255, 93/255, 94/255);

	// this is the ball we'll animate with the stepper
	ball = new Path.Circle( points[0], 60 );
	ball.fillColor = new RGBColor(1.0, 1.0, 1.0);
	ball.strokeColor = null;

	// start the FSteppers
	move.toggle();
	blend.toggle();

};



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
	// required to keep the stepper in sync with our script
	move.update( event.time );
	blend.update( event.time );

	// when the stepper has reach it's end within the
	// time alotted, it's done
	if( move.isDone() ) {
		// tell the stepper to start counting again
		move.toggle();
	}
	// when the stepper has reach it's end within the
	// time alotted, it's done
	if( blend.isDone() ) {
		// tell the stepper to start counting again
		blend.toggle();
	}

	// redraw to update scene
	Draw();
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	background.fillColor = colors[1];

	// in order to animate the ball, we'll lerp from
	// point1 to point2
	var pos = points[0].lerp(
		points[1],
		move.delta
	);
	var col = colors[0].lerp(
		new RGBColor(1.0, 1.0, 1.0),
		blend.delta
	);
	// blend the colors from one to the other
	ball.fillColor = col;

	// move the ball on an arc
	pos.x *= Math.cos(move.delta);
	pos.y *= -Math.sin(move.delta)*2;
	ball.position = pos;
	ball.translate( new Point(0, artboard.bounds.height) );

};




// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------




// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onResize(event) {
	artboard.size = event.size;
};


// ------------------------------------------------------------------------
function onMouseUp(event) {
};

// ------------------------------------------------------------------------
function onMouseDown(event) {
};

// ------------------------------------------------------------------------
function onMouseMove(event) {
};

// ------------------------------------------------------------------------
function onMouseDrag(event) {
};


// ------------------------------------------------------------------------
function onKeyDown(event) {
	// when any key is pressed the colors swap
	temp = colors[0];
	colors[0] = colors[1];
	colors[1] = temp;
};

// ------------------------------------------------------------------------
function onKeyUp(event) {
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Animate(true);
Draw();

