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

// document properties
var sel;
var paths = new Array();
var pfad = new Path();

var physics;
var mouseAttractor;
var mousePos;
var counter = 0;

//values
var values = {
	gravityX:				0,
	gravityY:				0.15,
	mouseAttractorRadius:	250,

	maxParticles:			25,

	bRandLock:				true,
	bLimit:					false,
};

//components
var components = {
	gravityX: {
		type: 'number',
		label: 'Gravity X'
	},
	gravityY: {
		type: 'number',
		label: 'Gravity Y'
	},

	
	// ------------------------------------
	gravityRule: { 
		type: 'ruler',
		fullSize: true,
	},

	mouseAttractorRadius: {
		type: 'number',
		label: 'Mouse Attraction Radius'
	},

	
	// ------------------------------------
	mouseRule: { 
		type: 'ruler',
		fullSize: true,
	},

	bRandLock: { 
		type: 'checkbox',
		label: 'Random Lock'
	},
	bLimit: { 
		type: 'checkbox',
		label: 'Limited Ammount'
	},


	
};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// initialize the palette window
	var palette = new Dialog.prompt('Toxiclibs 0.0', components, values);


	// setup physics with 
	physics = new toxi.physics2d.VerletPhysics2D();
	physics.setDrag(0.05);
	physics.setWorldBounds(new toxi.Rect(
		0, 0,
		artboard.bounds.width, artboard.bounds.height)
	);
	physics.addBehavior(new toxi.physics2d.GravityBehavior(
		new toxi.Vec2D(values.gravityX, values.gravityY)
	));


	// gather selections
	sel = activeDocument.getItems({
		selected: true
	});

	for ( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];
		
		if ( f.getType(obj) == 'TextItem' ) {
			//TextItem
			var outline = obj.createOutline();
			obj.remove();
		
			for ( var j=0; j<outline.children.length; j++ ) {
				var child = outline.children[j];
				addParticle( child, (child.bounds.width+child.bounds.height)/2 );
				paths.push( child );
			}
		
		}
		else {
			//Path
			addParticle( obj, (obj.bounds.width+obj.bounds.height)/2 );
			paths.push( obj );
		} 

		//if (counter >= values.maxParticles) break;
	}

	//print( counter + ' --vs-- ' + physics.particles.length);
};



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
	physics.update();
	Draw();
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	for ( var i=0; i<paths.length; i++ ) {
		var p = physics.particles[i];
		paths[i].position = new Point( p.x, p.y );
	}
};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function addParticle(obj, dist) {
	var loc = new toxi.Vec2D(obj.position.x,obj.position.y);
	var p = new toxi.physics2d.VerletParticle2D(loc);
	//p.bounds = new toxi.Rect(0, 0, 300, 300);
	if ( values.bRandLock && parseInt( Math.random()*2 ) == 0 ) p.lock();

	physics.addParticle(p);

	// add a negative attraction force field around the new particle
	physics.addBehavior(new toxi.physics2d.AttractionBehavior(p, dist, -1.2, 0.01));
	counter++;
};



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	mousePos = new toxi.Vec2D(event.point.x, event.point.y);
	mouseAttractor = new toxi.physics2d.AttractionBehavior(mousePos, values.mouseAttractorRadius, 0.95);
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
// Invocation
// ------------------------------------------------------------------------
Setup();
Animate(true);
// Draw();
