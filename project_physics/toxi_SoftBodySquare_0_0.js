/**
 *	Soft Body Square
 *	http://haptic-data.com/toxiclibsjs/examples/SoftBodySquare_pjs.html
 *
 *	Kyle Phillips
 *	kyle@haptic-data.com/
 *
 *	http://haptic-data.com/
 *
 *	
 *	
 *	implemenation of toxiclibsjs softbody square in scriptographer by
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 *
 */


// ------------------------------------------------------------------------
// libraries
// ------------------------------------------------------------------------
include('build/toxiclibs.js');


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

//script.coordinateSystem = 'bottom-up';
script.coordinateSystem = 'top-down';
script.angleUnits = 'radians';


// document properties
var group = new Group();

var DIM = 3;
var REST_LENGTH = 20;
var STRENGTH = 0.125;
var INNER_STRENGTH = 0.13;

var physics;
var head, tail;

var mousePos;



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// setup physics
	physics = new toxi.physics2d.VerletPhysics2D();
	//physics.setDrag(0.05);
	physics.addBehavior(new toxi.physics2d.GravityBehavior( new toxi.Vec2D(0, 1)) );
	physics.setWorldBounds(new toxi.Rect(0, 0, activeDocument.bounds.width, activeDocument.bounds.height));

	// create grid
	for (var y=0, idx=0; y<DIM; y++) {
		for (var x=0; x <DIM; x++) {
			var p = new toxi.physics2d.VerletParticle2D(x * REST_LENGTH, y * REST_LENGTH);
			physics.addParticle(p);
			if (x > 0) {
				var s = new toxi.physics2d.VerletSpring2D(p, physics.particles[idx - 1], REST_LENGTH, STRENGTH);
				physics.addSpring(s);
			}
			if (y > 0) {
				var s = new toxi.physics2d.VerletSpring2D(p, physics.particles[idx - DIM], REST_LENGTH, STRENGTH);
				physics.addSpring(s);
			}
			idx++;
		}
	}

	var p = physics.particles[0];
	var q = physics.particles[physics.particles.length - 1];
	var base = (REST_LENGTH * (DIM - 1));
	var len = Math.sqrt( Math.pow(base,2)*2 );
	/*
	var s = new toxi.physics2d.VerletSpring2D(p, q, len, INNER_STRENGTH);
	physics.addSpring(s);
	*/

	p = physics.particles[DIM - 1];
	q = physics.particles[physics.particles.length - DIM];
	s = new toxi.physics2d.VerletSpring2D(p, q, len, INNER_STRENGTH);
	physics.addSpring(s);

	var headIdx = (DIM - 1) / 2;
	print('headIdx', headIdx);
	print('physics.springs', physics.springs.length)
	head = physics.particles[Math.floor(headIdx)];
	head.lock();
}



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
	group.remove();
	physics.update();
}



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	Update(event);
	//head.set(mousePos.x, mousePos.y);

	group = new Group();
	for (var i in physics.springs) {
		var s = physics.springs[i];
		var line = new Path.Line( new Point(s.a.x,s.a.y), new Point(s.b.x,s.b.y) );
		group.appendTop(line);
	}
}



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	mousePos = new toxi.Vec2D(event.point.x, event.point.y);
}

function onMouseDrag(event) {
	// update mouse attraction focal point
	mousePos.set(event.point.x, event.point.y);
	head.set(mousePos.x, mousePos.y);
}

function onMouseUp(event) {
	// remove the mouse attraction when button has been released
}



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function SpringObj(obj) {
	
}


// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();

// set a timer that runs the Draw() function 
// every milisecond
var timer = setInterval(Main, 1);

// Update(event);
// Draw();

