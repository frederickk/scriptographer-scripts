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
// libraries
// ------------------------------------------------------------------------
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

//script.coordinateSystem = 'bottom-up';
script.coordinateSystem = 'top-down';
script.angleUnits = 'radians';

// document properties
var sel;
var paths = new Array();
var pfad = new Path();

var NUM_PARTICLES = 10;
var physics;

var mouseAttractor;
var mousePos;

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

	//
	sel = activeDocument.getItems({
		type: TextItem,
		selected: true
	});
	
	for(var i in sel) {
		var outline = sel[i].createOutline();
		sel[i].remove();
		
		for(var j in outline.children) {
			var child = outline.children[j];
			addParticle( (child.bounds.width+child.bounds.height)/2 );
			paths.push( child );
		}
	}
}


// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update() {
	physics.update();
	//pfad.remove();
	if(paths.length > 20) {
		//paths[0].remove();
		//paths.remove(0);
	}
	if (physics.particles.length < NUM_PARTICLES) {
		addParticle();
	}
}


// ------------------------------------------------------------------------
// Main
// ------------------------------------------------------------------------
function Main() {
	Update();

	for (var i in paths) {
	//for (var i=0; i<physics.particles.length; i++) {
		var p = physics.particles[i];
		paths[i].position = new Point( p.x, p.y );
	}

	//print('index', index);
	//print('paths.length', paths.length);
}



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	//addParticle();
	mousePos = new toxi.Vec2D(event.point.x, event.point.y);

	// create a new positive attraction force field around the mouse position (radius = 250px)
	mouseAttractor = new toxi.physics2d.AttractionBehavior(mousePos, 250, 0.9);
	physics.addBehavior(mouseAttractor);
}

function onMouseDrag(event) {
	// update mouse attraction focal point
	mousePos.set(event.point.x, event.point.y);
}

function onMouseUp(event) {
	// remove the mouse attraction when button has been released
	physics.removeBehavior(mouseAttractor);
}



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function norm(val,start,stop) { return (val - start) / (stop - start); }

// ------------------------------------------------------------------------
function addParticle(dist) {
	var randLoc = toxi.Vec2D.randomVector().scale(5).addSelf(activeDocument.bounds.width / 2, 0);
	var p = new toxi.physics2d.VerletParticle2D(randLoc);
	physics.addParticle(p);

	// add a negative attraction force field around the new particle
	physics.addBehavior(new toxi.physics2d.AttractionBehavior(p, dist, -1.2, 0.01));
}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};


// ------------------------------------------------------------------------
// Execution
// ------------------------------------------------------------------------
Setup();

// set a timer that runs the Main() function 
// every milisecond
var timer = setInterval(Main, 1);

// Update();
// Main();
