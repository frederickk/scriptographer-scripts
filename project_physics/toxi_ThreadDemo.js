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
include('../libraries/frederickk.js');



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
var palette;

var mouseLocation;

// physics
var VerletPhysics2D = toxi.physics2d.VerletPhysics2D;
var VerletParticle2D = toxi.physics2d.VerletParticle2D;
var Vec2D = toxi.Vec2D;
var ParticleString2D = toxi.physics2d.ParticleString2D;

var physics;
var head, tail;



//values
var values = {
	REST_LENGTH:		10,
	bTailLocked:		false
};

//components
var components = {
	bTailLocked: {
		type:		'checkbox',
		label:		'Lock Tail'
	}
};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// initialize the palette window
	palette = new Palette('Toxiclibs 0.0', components, values);


	// gather selections
	sel = activeDocument.getItems({
		hidden: false
	});
	print('sel', sel.length);


	// setup physics
	physics = new VerletPhysics2D();
	//physics.setDrag(0.05);
	//var stepDir = new Vec2D(1,1).normalizeTo(values.REST_LENGTH);

	//var s = new ParticleString2D(physics, new Vec2D(), stepDir, sel.length, 1, 0.1);
	sel = sel(Path.sortDistanceFromCenter);
	for( var i=0; i<sel.length; i++ ) {
		var dia = Math.sqrt(sel[i].bounds.width * sel[i].bounds.height);
		var stepDir = new Vec2D(1,1).normalizeTo(dia);
		var s = new ParticleString2D(physics, new Vec2D(), stepDir, 1, 1, 0.1);
	}

	head = s.getHead();
	head.lock();
	tail = s.getTail();


}



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
	Draw();

	physics.update();
	if (values.bTailLocked) {
		tail.lock();
	} else {
		tail.unlock();
	}
}



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	var partLen = physics.particles.length;
	for(i=0; i<partLen; i++) {
		var obj = sel[i];
		var p = physics.particles[i];
		
		obj.position = new Point(p.x,p.y);
	}
}



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	mouseLocation = new Path.Circle( event.point, 10 );
}

function onMouseDrag(event) {
	mouseLocation.position = event.point;
	head.set(event.point.x,event.point.y);
}

function onMouseUp(event) {
	mouseLocation.remove();
}



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
/**
 *
 *	Extend Path with some additional Methods
 *	Necessary for CirclePack()
 *
 */
/*
function sortDistanceFromCenter(a, b) {
	var valueA = a.distanceFromCenter();
	var valueB = b.distanceFromCenter();
	var comparisonValue = 0;

	if(valueA > valueB) comparisonValue = -1;
	else if(valueA < valueB) comparisonValue = 1;

	return comparisonValue;
}
*/
Path.prototype.sortDistanceFromCenter = function(a, b) {
	print('sorting');
	var valueA = a.distanceFromCenter();
	var valueB = b.distanceFromCenter();
	var comparisonValue = 0;
	
	if(valueA > valueB) comparisonValue = -1;
	else if(valueA < valueB) comparisonValue = 1;
	
	return comparisonValue;
}

Path.prototype.distanceFromCenter = function() {
	var distance = this.position.getDistance(artboard.center);
	return distance;
}



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();

// set a timer that runs the Update(event) function 
// every milisecond
var timer = setInterval(Update, 1);

// Update(event);
// Draw();
