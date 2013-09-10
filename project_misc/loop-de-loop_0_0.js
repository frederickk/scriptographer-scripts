/**
 *	Loop-de-Loop 0.1
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 *	draw a looping line based on AS3 code by:
 *
 *	Zack Ensign
 *	contact@zen-sign.com
 *
 *	http://www.zen-sign.com/cubic-bezier-looping-lines/
 *
 */


// ------------------------------------------------------------------------
// libraries
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
var sel;

var eventPtStart;
var eventPtEnd;
var eventDistance;


//values
var values = {
	loopDirection:		'Random',
	bLoopSmooth:		true,

	loopLength:			100,
	loopStep:			50,

	loopSize:			160,
	bLoopSizeRandom:	false
};

//components
var components = {
	loopDirection: {
		label: 'Direction',
		options: ['Up', 'Down', 'Random']
	},
	bLoopSmooth: {
		type: 'checkbox',
		label: 'Smooth Lines'
	},


	lengthRule: { 
		type: 'ruler',
		fullSize: true,
	},

	loopLength: {
		type: 'number',
		label: 'Length',
		units: 'point',
		steppers: true,
		fractionDigits: 0.1,
		fullSize: true,
	},
	loopStep: {
		type: 'number',
		label: 'Step',
		steppers: true,
		fractionDigits: 0.1,
		fullSize: true,
	},


	sizeRule: { 
		type: 'ruler',
		fullSize: true,
	},

	loopSize: {
		type: 'number',
		label: 'Radius',
		units: 'point',
		steppers: true,
		fractionDigits: 0.1,
		fullSize: true,
	},
	bLoopSizeRandom: {
		type: 'checkbox',
		label: 'Random Radius\r(+/- 50% Radius)'
	},
	
	
	submitRule: { 
		type: 'ruler',
		fullSize: true,
	},

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
// setup
// ------------------------------------------------------------------------
function Setup() {
	palette = new Palette("Loop-de-Loop", components, values);
};



// ------------------------------------------------------------------------
// update
// ------------------------------------------------------------------------
function Update(event) {
};



// ------------------------------------------------------------------------
// main
// ------------------------------------------------------------------------
function Draw() {
	createLoopingLine( values.loopLength );
};



// ------------------------------------------------------------------------
// methods
// ------------------------------------------------------------------------
function createLoopingLine(distance) {
	var currentDistance = 0;
	var step = values.loopStep;
	
	var xDis, yDis;
	xDis = 0;
	yDis = artboard.bounds.height * 0.5;

	var iterations = Math.round(distance/step);
	var bWasLastLoop = true;
	var loopSize;

	// add start point
	var loopPath = new Path();
	loopPath.add(new Point(xDis, yDis));

	// loop through and create random looping points to span total distance
	for (var i = 0; i < iterations; i++) {

		// if last segment of line was a loop, make it straight
		if (!bWasLastLoop) {
			var direction;
			var loopSize;

			if(values.loopDirection == 'Up') direction = 1.0;
			else if(values.loopDirection == 'Down') direction = 0.0;
			else if(values.loopDirection == 'Random') direction = Math.random();
			
			if (direction > 0.5) {
				// loop up
				if(values.bLoopSizeRandom) loopSize = f.random( values.loopSize - (values.loopSize * 0.5), values.loopSize + (values.loopSize * 0.5) );
				else loopSize = values.loopSize * 0.5;

				// left point of loop
				loopPath.add(new Point(xDis + (loopSize * 0.5), yDis - (loopSize * 0.5)));
				// top point of loop
				loopPath.add(new Point(xDis, yDis - loopSize));
				// right point of loop
				loopPath.add(new Point(xDis - (loopSize * 0.5), yDis - (loopSize * 0.5)));
				// bottom point of loop, origin point
				loopPath.add(new Point(xDis, yDis));
			}
			else {
				// loop down
				if(values.bLoopSizeRandom) loopSize = f.random( -(values.loopSize - (values.loopSize * 0.5)), -(values.loopSize + (values.loopSize * 0.5)) );
				else loopSize = -values.loopSize * 0.5;
				
				// left point of loop
				loopPath.add(new Point(xDis - (loopSize * 0.5), yDis - (loopSize * 0.5)));
				// top point of loop
				loopPath.add(new Point(xDis, yDis - loopSize));
				// right point of loop
				loopPath.add(new Point(xDis + (loopSize * 0.5), yDis - (loopSize * 0.5)));
				// bottom point of loop, origin point
				loopPath.add(new Point(xDis, yDis));
			}
			// last points were a loop
			bWasLastLoop = true;
		}

		else {
			// continue to step through
			xDis = currentDistance + 100;
			if(values.bLoopSizeRandom) loopPath.add(new Point( xDis, yDis + f.random(values.loopSize - (values.loopSize * 0.5), values.loopSize + (values.loopSize * 0.5)) ));
			else loopPath.add(new Point(xDis, yDis + values.loopSize * 0.5));
			bWasLastLoop = false;
		}
		// add to distance traveled
		currentDistance = xDis;
	}
	// add end point
	loopPath.add(new Point(currentDistance + 200, artboard.bounds.height * 0.5));


	if(values.bLoopSmooth) loopPath.smooth();
}

// ------------------------------------------------------------------------
function cleanupAndAdd() {
	// var stamp:Sprite;
	// var thisPoint = new Point();
	// var nextPoint = new Point();
	// var bezier:BezierSegment;
	// 
	// for (i = 0; i < lastPt - 1; i++) {
	// 	// create a BezierSegment from point, following point, and 2 control points generated above
	// 	bezier = new BezierSegment(p[i], controlPts[i][1], controlPts[i + 1][0], p[i + 1]);
	// 
	// 	for (var t = .01; t < 1.01; t += 0.15) {
	// 		// get point to position stamp
	// 		thisPoint = bezier.getValue(t);
	// 		// get next point, this is used to calculate rotation
	// 		nextPoint = bezier.getValue(t + 0.15);
	// 	
	// 		// position stamp and set rotation 
	// 		stamp = new Stamp()
	// 		stamp.x = thisPoint.x,
	// 		stamp.y = thisPoint.y;
	// 		stamp.rotation = Math.round(Math.atan2(nextPoint.y - thisPoint.y, nextPoint.x - thisPoint.x) * (180 / Math.PI));
	// 	
	// 		// add the stamp to the container
	// 		container.addChild(stamp);
	// 	}
	// }
}



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	eventPtStart = event.point;
};

function onMouseUp(event) {
	eventPtEnd = event.point;
	eventDistance = eventPtStart.getDistance(eventPtEnd);

	values.loopLength = eventDistance;
	// values.loopStep = eventDistance*0.5;
	Draw();
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Animate(false);
Draw();

