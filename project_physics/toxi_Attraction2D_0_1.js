/**
 *	Attraction 2D 
 *	http://haptic-data.com/toxiclibsjs/examples/Attraction2D_pjs.html
 *
 *	Kyle Phillips
 *	kyle@haptic-data.com/
 *
 *	http://haptic-data.com/
 *
 *	This example demonstrates how to use the behavior handling
 *	(new since toxiclibs-0020 release) and specifically the attraction
 *	behavior to create forces around the current locations of particles
 *	in order to attract (or deflect) other particles nearby.
 *
 *	Behaviors can be added and removed dynamically on both a
 *	global level (for the entire physics simulation) as well as for
 *	individual particles only.
 *	
 *	Click and drag mouse to attract particles
 *	
 *	
 *	implemenation of toxiclibsjs particles in scriptographer by
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
// Libraries
// ------------------------------------------------------------------------
include('../libraries/frederickkScript/frederickkScript.js');
include('../libraries/toxi/toxiclibs.js');



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
var palette;

// physics
var NUM_PARTICLES = 80;
var paths = [];
var physics;

// interaction
var mouseAttractor;
var mousePos;

//values
var values = {
	bPause: false
};

//components
var components = {
	pauseButton: {
		type: 'button',
		value: 'Pause',
		fullSize: true,
		onClick: function() {
			values.bPause = !values.bPause;

			if (values.bPause) this.value = 'Play';
			else this.value = 'Pause';
		}
	}
};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// setup physics with 10% drag
	physics = new toxi.physics2d.VerletPhysics2D();
	physics.setDrag(0.05);
	physics.setWorldBounds(new toxi.Rect(0, 0, activeDocument.bounds.width, activeDocument.bounds.height));

	// the NEW way to add gravity to the simulation, using behaviors
	physics.addBehavior(new toxi.physics2d.GravityBehavior(new toxi.Vec2D(0, 0.15)));

	// create an array to hold Paths
	for (var i=0; i<NUM_PARTICLES; i++) paths[i] = new Path.Circle(0,0, 5);


	// palette
	palette = new Palette('toxiclibs 0.1', components, values);

};



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
	if (!values.bPause) {
		physics.update();

		if (physics.particles.length < NUM_PARTICLES) {
			addParticle();
		}

		Draw();
	}
};



// ------------------------------------------------------------------------
// Main
// ------------------------------------------------------------------------
function Draw() {
	for (var i=0; i<physics.particles.length; i++) {
		var p = physics.particles[i];
		paths[i].position = new Point(p.x, p.y);
		paths[i].fillColor = new CMYKColor( 0.8, f.norm(i, 0,physics.particles.length), 0.0, 0.0);
	}
};



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	//addParticle();
	mousePos = new toxi.Vec2D(event.point.x, event.point.y);

	// create a new positive attraction force field around the mouse position (radius=250px)
	mouseAttractor = new toxi.physics2d.AttractionBehavior(mousePos, 250, 0.9);
	physics.addBehavior(mouseAttractor);
	
};

function onMouseDrag(event) {
	// update mouse attraction focal point
	mousePos.set(event.point.x, event.point.y);
};

function onMouseUp(event) {
	// remove the mouse attraction when button has been released
	physics.removeBehavior(mouseAttractor);
};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function addParticle() {
	var randLoc = toxi.Vec2D.randomVector().scale(5).addSelf(activeDocument.bounds.width / 2, 0);
	var p = new toxi.physics2d.VerletParticle2D(randLoc);
	physics.addParticle(p);

	// add a negative attraction force field around the new particle
	physics.addBehavior(new toxi.physics2d.AttractionBehavior(p, 20, -1.2, 0.01));
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Animate(true);
// Draw();
