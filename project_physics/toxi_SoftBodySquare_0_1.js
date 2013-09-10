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
var sel;
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
	physics.addBehavior(new toxi.physics2d.GravityBehavior( new toxi.Vec2D(0, 0.1)) );
	physics.setWorldBounds(new toxi.Rect(0, 0, activeDocument.bounds.width, activeDocument.bounds.height));

	// get selection
	sel = activeDocument.getItems({
		type: Path,
		selected: true
	});
	var obj = sel[0];

	SpringObj(obj);
	
	
	/*
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
	var s = new toxi.physics2d.VerletSpring2D(p, q, len, INNER_STRENGTH);
	physics.addSpring(s);

	p = physics.particles[DIM - 1];
	q = physics.particles[physics.particles.length - DIM];
	s = new toxi.physics2d.VerletSpring2D(p, q, len, INNER_STRENGTH);
	physics.addSpring(s);

	var headIdx = (DIM - 1) / 2;
	print('headIdx', headIdx);
	print('physics.springs', physics.springs.length)
	head = physics.particles[Math.floor(headIdx)];
	head.lock();
	*/
}



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
	group.remove();
	group = new Group();

	physics.update();
}



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	Update(event);

	var path = new Path();
	path.moveTo( physics.springs[0].a.x, physics.springs[0].a.y )
	path.lineTo( physics.springs[0].b.x, physics.springs[0].b.y )
	for (var i=2; i<physics.springs.length; i+=3) {
		var s1 = physics.springs[i-2];
		var s2 = physics.springs[i-1];
		var s3 = physics.springs[i];

		var segment1 = new Segment( new Point(s1.a.x,s1.a.y), new Point(0,0), new Point(0,0) );
		//var segment1 = new Segment( new Point(s1.a.x,s1.a.y), new Point(s2.a.x,s2.a.y), new Point(s3.a.x,s3.a.y) );
		//var segment2 = new Segment( new Point(s1.b.x,s1.b.y), new Point(s2.b.x,s2.b.y), new Point(s3.b.x,s3.b.y) );

		path.add( segment1 );
		//path.add( segment2 );
	}
	path.closed = true;
	path.fillColor = new CMYKColor( 0.0, 1.0, 0.0, 0.0 );

	group.appendTop(path);
}



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	mousePos = new toxi.Vec2D(event.point.x, event.point.y);
}

function onMouseDrag(event) {
	mousePos.set(event.point.x, event.point.y);
	head.set(mousePos.x, mousePos.y);
}

function onMouseUp(event) {
}



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function norm(val,start,stop) { return (val - start) / (stop - start); }

function dist(p0,p1) {
	var pt0 = new Point( p0.x, p0.y );
	var pt1 = new Point( p1.x, p1.y );
	return pt0.getDistance(pt1) * 0.5;
}


// ------------------------------------------------------------------------
function SpringObj(obj) {
	print('obj.segments.length', obj.segments.length);
	
	for(var i=1; i<obj.segments.length; i++) {
		var segment0 = obj.segments[i-1];
		var segment1 = obj.segments[i];
		
		//points
		//print('point: ' + segment0.point.x + ", " + segment0.point.y );
		var particle0 = new toxi.physics2d.VerletParticle2D( segment0.point.x,segment0.point.y );
		var particle1 = new toxi.physics2d.VerletParticle2D( segment1.point.x,segment1.point.y );
		physics.addParticle(particle0);

		//hanldes
		//print('handleIn: ' + segment0.handleIn.x + ", " + segment0.handleIn.y );
		var handleIn0 = new toxi.physics2d.VerletParticle2D( segment0.handleIn.x,segment0.handleIn.y );
		physics.addParticle(handleIn0);

		//print('handleOut: ' + segment0.handleOut.x + ", " + segment0.handleOut.y );
		var handleOut0 = new toxi.physics2d.VerletParticle2D( segment0.handleOut.x,segment0.handleOut.y );
		physics.addParticle(handleOut0);


		//springs
		//points
		var spring1 = new toxi.physics2d.VerletSpring2D(particle1, particle0, dist(particle0,particle1), STRENGTH);
		physics.addSpring(spring1);
		print('spring1.a: ' + spring1.a.x + ", " + spring1.a.y );
		print('spring1.b: ' + spring1.b.x + ", " + spring1.b.y );

		//handles
		var spring2 = new toxi.physics2d.VerletSpring2D(handleIn0, particle0, dist(handleIn0,particle0), STRENGTH);
		physics.addSpring(spring2);
		print('spring2.a: ' + spring2.a.x + ", " + spring2.a.y );
		print('spring2.b: ' + spring2.b.x + ", " + spring2.b.y );
		
		var spring3 = new toxi.physics2d.VerletSpring2D(handleOut0, particle0, dist(handleOut0,particle0), STRENGTH);
		physics.addSpring(spring3);
		print('spring3.a: ' + spring3.a.x + ", " + spring3.a.y );
		print('spring3.b: ' + spring3.b.x + ", " + spring3.b.y );

		/*
		if(i>0) {
			var last = physics.particles.length-1;
			var spring2 = new toxi.physics2d.VerletSpring2D(particle0, physics.particles[last], dist(particle0,physics.particles[last]), STRENGTH);
			physics.addSpring(spring2);
		}
		*/
	}

	/*
	var p = physics.particles[0];
	var q = physics.particles[physics.particles.length - 1];
	var base = (REST_LENGTH * (DIM - 1));
	var len = Math.sqrt( Math.pow(base,2)*2 );
	var s = new toxi.physics2d.VerletSpring2D(p, q, len, INNER_STRENGTH);
	physics.addSpring(s);

	p = physics.particles[DIM - 1];
	q = physics.particles[physics.particles.length - DIM];
	s = new toxi.physics2d.VerletSpring2D(p, q, len, INNER_STRENGTH);
	physics.addSpring(s);
	*/

	var headIdx = 0;
	print('headIdx', headIdx);
	print('physics.springs', physics.springs.length)
	head = physics.particles[Math.floor(headIdx)];
	head.lock();
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

