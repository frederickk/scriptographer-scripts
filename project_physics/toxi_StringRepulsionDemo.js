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
var artboard = activeDocument.activeArtboard.bounds;
var palette;

var mouseLocation;

// physics
var physics;
var VerletPhysics2D = toxi.physics2d.VerletPhysics2D;
var VerletParticle2D = toxi.physics2d.VerletParticle2D;
var VerletSpring2D = toxi.physics2d.VerletSpring2D;

var Vec2D = toxi.Vec2D;
var ParticleString2D = toxi.physics2d.ParticleString2D;
var GravityBehavior = toxi.physics2d.GravityBehavior;




//values
var values = {
	STRING_RES:			20,

	BALL_RES:			10,
	BALL_RADIUS:		30

};

//components
var components = {
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
	//sel = sel(Path.sortDistanceFromCenter);


	// setup physics
	initPhysics()
}

function initPhysics() {
	physics = new VerletPhysics2D();
	physics.setWorldBounds( new toxi.Rect(0,0, artboard.width,artboard.height) );
	physics.addBehavior(new GravityBehavior(new Vec2D(0,0.1)));

	//var delta = artboard.width/(values.STRING_RES-1);
	var delta;

	for(var i=0; i<values.STRING_RES; i++) {
 		delta = Math.sqrt(sel[i].bounds.width * sel[i].bounds.height);
		var p = new VerletParticle2D(i*delta,artboard.height/2);
		physics.addParticle(p);

		// define a repulsion field around each particle
		// this is used to push the ball away
		physics.addBehavior(new toxi.physics2d.AttractionBehavior(p,delta*1.5,-20));

		// connect each particle to its previous neighbour
		if (i>0) {
			var q = physics.particles[i-1];
			var s = new toxi.physics2d.VerletSpring2D(p,q, delta*0.5, 0.1);
			physics.addSpring(s);
		}
	}

	//physics.particles[0].lock();
	//physics.particles[physics.particles.length-1].lock();
	 
	/*
	// create ball
	// first create a particle as the ball centre
	var c = new VerletParticle2D(artboard.width/2,100);
	physics.addParticle(c);

	var cparts = [];
	for(var i=0; i<values.BALL_RES; i++) {
		var pos = Vec2D.fromTheta(i*(Math.PI*2)/values.BALL_RES).scaleSelf(values.BALL_RADIUS).addSelf(c);

		var p = new VerletParticle2D(pos);
		cparts.push(p);
		physics.addParticle(p);

		physics.addSpring(new VerletSpring2D(c,p,values.BALL_RADIUS,0.01));

		if (i>0) {
			var q = cparts[i-1];
			physics.addSpring(new VerletSpring2D(p,q,p.distanceTo(q),1));
		}
	}

	var p = cparts[0];
	var q = cparts[values.BALL_RES-1];
	physics.addSpring(new VerletSpring2D(p,q,p.distanceTo(q),1));
	*/
}





// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
	Draw();
	physics.update();
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
