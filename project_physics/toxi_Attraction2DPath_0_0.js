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

//script.coordinateSystem = 'bottom-up';
script.coordinateSystem = 'top-down';
script.angleUnits = 'radians';


// load frederickkScript
var f = frederickkScript;

// document properties
var sel;
var selIndex = 0;
var group = new Group();

var physics = new Array();
var head;

var mouseAttractor;
var mousePos;



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	//
	sel = activeDocument.getItems({
		type: Path,
		selected: true
	});

	
	// Particles
	for( var i=0; i<sel.length; i++ ) {
		// setup physics
		physics[i] = new toxi.physics2d.VerletPhysics2D();
		physics[i].setWorldBounds(new toxi.Rect(0, 0, activeDocument.bounds.width, activeDocument.bounds.height));

		// add gravity to the simulation, using behaviors
		physics[i].setDrag(0.1);
		physics[i].addBehavior( new toxi.physics2d.GravityBehavior(new toxi.Vec2D(0, 0.5)) );

		var obj = sel[i];
		var curves = obj.curves;

		for(j in curves) {
			var c = curves[j];

			//points
			var lock;
			if( j%2 == 0 ) lock = true;
			else lock = false;
			
			addParticle(i, c.point1, c.point1.getDistance(c.point2)/2, lock );
			addParticle(i, c.point2, c.point2.getDistance(c.point1)/2, lock );

			//handles
			addParticle(i, c.point1 + c.handle1, c.handle1.getDistance(c.point2)/2, false );
			addParticle(i, c.point2 + c.handle2, c.handle2.getDistance(c.point1)/2, false );
		}
		print('physics[i].particles.length', physics[i].particles.length);

		// Springs
		var s = new toxi.physics2d.VerletSpring2D(
			physics[i].particles[0],
			physics[i].particles[physics[i].particles.length-1],
			dist(physics[i].particles[0],physics[i].particles[physics[i].particles.length-1]),
			0.125
		);
		physics[i].addSpring(s);

		for(var j=1; j<physics[i].particles.length; j++) {
			var p0 = physics[i].particles[j-1];
			var p1 = physics[i].particles[j];
			s = new toxi.physics2d.VerletSpring2D(p0, p1, dist(p0,p1), 0.125);
			physics[i].addSpring(s);
		}
		print('physics[i].springs.length', physics[i].springs.length);

	}

	/*
	for(var i=0; i<physics.particles.length; i+=2) {
		var p0 = physics.particles[i];
		for(var j=1; j<physics.particles.length; j+=2) {
			var p1 = physics.particles[j];
			s = new toxi.physics2d.VerletSpring2D(p0, p1, dist(p0,p1), 0.125);
			physics.addSpring(s);
		}
	}
	*/

	/*
	var p = physics.particles[0];
	var q = physics.particles[physics.particles.length - 1];
	var base = (dist(p,q) * (parseInt(physics.particles.length/2) - 1));
	var len = Math.sqrt( Math.pow(base,2)*2 );
	var s = new toxi.physics2d.VerletSpring2D(p, q, len, 0.13);
	physics.addSpring(s);

	p = physics.particles[parseInt(physics.particles.length/2)];
	q = physics.particles[physics.particles.length - parseInt(physics.particles.length/2)];
	s = new toxi.physics2d.VerletSpring2D(p, q, len, 0.13);
	physics.addSpring(s);
	*/

	//head = physics.particles[0];
	//head.lock();
};


// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
	group.remove();
	group = new Group();
	
	for( var i=0; i<sel.length; i++ ) {
		physics[i].update();
	}

	Draw();
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	/*
	for(var i in physics.springs) {
		var s = physics.springs[i];
		var point1 = new Point(s.a.x,s.a.y);
		//var point2 = new Point(s.b.x,s.b.y);

		var circle1 = new Path.Circle( point1, 3 );
		circle1.fillColor = new CMYKColor( 1.0, 0.0, 0.0, 0.0 );
		group.appendTop(circle1);

		//var circle2 = new Path.Circle( point2, 3 );
		//circle2.fillColor = new CMYKColor( 0.0, 1.0, 0.0, 0.0 );
		//group.appendTop(circle2);
	}
	*/

	for( var i=0; i<sel.length; i++ ) {
		//var i = selIndex;
		var obj = sel[i];
		var curves = obj.curves;

		var index = 0;
		for(j in curves) {
			//curve
			var c = curves[j];
			
			//particles
			/*
			var ppt1 = physics[i].particles[index];
			var ppt2 = physics[i].particles[index+1];
			var ph1 = physics[i].particles[index+2];
			var ph2 = physics[i].particles[index+3];

			var point1 = new Point(ppt1.x,ppt1.y);
			var point2 = new Point(ppt2.x,ppt2.y);
			var handle1 = new Point(ph1.x,ph1.y);
			var handle2 = new Point(ph2.x,ph2.y);
			*/

			//springs
			var spt1 = physics[i].springs[index];
			var spt2 = physics[i].springs[index+1];
			var sh1 = physics[i].springs[index+2];
			var sh2 = physics[i].springs[index+3];

			var point1 = new Point(spt1.a.x,spt1.a.y);
			var point2 = new Point(spt2.a.x,spt2.a.y);
			var handle1 = new Point(sh1.a.x,sh1.a.y);
			var handle2 = new Point(sh2.a.x,sh2.a.y);

			c.point1 = point1;
			c.point2 = point2;
			//c.handle1 = handle1 - point1;
			//c.handle2 = handle2 - point2;
			
			/*
			var circle1 = new Path.Circle( point1, 3 );
			circle1.fillColor = new CMYKColor( 1.0, 0.0, 0.0, 0.0 );
			group.appendTop(circle1);

			var circle2 = new Path.Circle( point2, 3 );
			circle2.fillColor = new CMYKColor( 0.0, 1.0, 0.0, 0.0 );
			group.appendTop(circle2);

			var circle3 = new Path.Rectangle( handle1, new Size(3,3) );
			circle3.fillColor = new CMYKColor( 0.0, 0.0, 1.0, 0.0 );
			group.appendTop(circle3);

			var circle4 = new Path.Rectangle( handle2, new Size(3,3) );
			circle4.fillColor = new CMYKColor( 0.0, 0.0, 0.0, 1.0 );
			group.appendTop(circle4);
			*/

			index += 4;
		}
	}

};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function dist(p0, p1) {
	var pt0 = new Point( p0.x, p0.y );
	var pt1 = new Point( p1.x, p1.y );
	return pt0.getDistance(pt1);
};


// ------------------------------------------------------------------------
function stepper() {
	if(selIndex < sel.length) {
		selIndex++
		print(selIndex);
		return true;
	}
	else {
		print('stop script!');
		return false;
	}
};

// ------------------------------------------------------------------------
function addParticle(i, pt, dist, lock) {
	var pos = new toxi.Vec2D(pt.x,pt.y);
	var p = new toxi.physics2d.VerletParticle2D(pos);
	if(lock) p.lock();
	physics[i].addParticle(p);

	// add a negative attraction force field around the new particle
	//physics[i].addBehavior( new toxi.physics2d.AttractionBehavior(p, dist, 0) );
};



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	//addParticle();
	mousePos = new toxi.Vec2D(event.point.x, event.point.y);

	// create a new positive attraction force field around the mouse position (radius = 250px)
	//mouseAttractor = new toxi.physics2d.AttractionBehavior(mousePos, 250, 0.9);
	//physics.addBehavior(mouseAttractor);
};

function onMouseDrag(event) {
	// update mouse attraction focal point
	mousePos.set(event.point.x, event.point.y);
	head.set(mousePos.x, mousePos.y);
};

function onMouseUp(event) {
	// remove the mouse attraction when button has been released
	//physics.removeBehavior(mouseAttractor);
};







// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Animate(true);
Draw();

