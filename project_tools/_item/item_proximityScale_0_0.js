/**
 *	Proximity Scale
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 */


// ------------------------------------------------------------------------
// libraries
// ------------------------------------------------------------------------
include('../../libraries/toxi/toxiclibs.js');
include('../../libraries/frederickk.js');



// ------------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------------



// document properties
var sel;
var artboard = activeDocument.activeArtboard.bounds;
var palette;
var afflicted = [];

var mouseLocation;
var mousePoint = new Point();
var bRunning = false;

// physics
var physics;
var VerletPhysics2D = toxi.physics2d.VerletPhysics2D;
var VerletParticle2D = toxi.physics2d.VerletParticle2D;
var VerletSpring2D = toxi.physics2d.VerletSpring2D;

var Vec2D = toxi.Vec2D;
var ParticleString2D = toxi.physics2d.ParticleString2D;
var GravityBehavior = toxi.physics2d.GravityBehavior;


// conversions
var ptToMm = 0.352777778;
var mmToPt = 2.83464567;

var ptToIn = 0.0138888889;
var inToPt = 72;

var ptToPi = 0.0833333333;
var piToPt = 12;

// default unit of measure
var unit = 'point';



// values
var values = {
	threshold:			50,
	growFactor:			2.0,

	bObject:			true,
	bStroke:			true,
};


// gui components
var components = {
	// ------------------------------------
	// flyout menu
	// ------------------------------------
	bMmUnit: {
		type:		'menu-entry',
		value:		'millimeter',
		onSelect: function() {v
			unit = 'millimeter';
			valDef = values.growFactor; //*mmToPt;
			updatePalette('growFactor', unit, valDef);
		}
	},
	bInUnit: {
		type:		'menu-entry',
		value:		'inch',
		onSelect: function() {
			unit = 'inch';
			valDef = values.growFactor; //*inToPt;
			updatePalette('growFactor', unit, valDef);
		}
	},
	bPiUnit: {
		type:		'menu-entry',
		value:		'pica',
		onSelect: function() {
			unit = 'pica';
			valDef = values.growFactor; //*piToPt;
			updatePalette('growFactor', unit, valDef);
		}
	},
	bPtUnit: {
		type:		'menu-entry',
		value:		'point/pixel',
		onSelect: function() {
			unit = 'point';
			valDef = values.growFactor; //;
			updatePalette('growFactor', unit, valDef);
		}
	},
	

	// ------------------------------------
	// settings
	// ------------------------------------
	threshold: {
		type:			'number',
		label:			'Distance Threshold',
		steppers:		true,
		increment:		10,
		onChange: function(value) {
			mouseLocation.width = value;
			mouseLocation.height = value;
		}
	},

	growFactor: {
		type:			'number',
		label:			'Maximum Scale Factor',
		steppers:		true,
		increment:		1.0,
		units:			'point'
	},

	optionsRule: { 
		type:			'ruler',
		fullSize:		true,
	},

	bObject: {
		type:		'checkbox',
		label:		'Scale Path/Object'
	},
	bStroke: {
		type:		'checkbox',
		label:		'Scale Stroke'
	}

};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems({
		type: Item,
		hidden: false 
	});
	print('sel', sel.length);

	palette = new Palette('Proximity Scale 0.0', components, values);

	// setup physics
	initPhysics();
	for(var i=0; i<sel.length; i++) {
		//addParticle(sel[i]);
	}
	print('physics.particles', physics.particles.length);

}



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
	//Draw();
	//physics.update();
}



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
var g = new Group();
function Draw() {
	for(var i=0; i<sel.length; i++) {
		var obj = sel[i];
		//var p = physics.particles[i];

		if(bRunning) {
			var dist = obj.position.getDistance(mouseLocation.position)
			if(dist > 0 && dist < values.threshold) {
				var resize = map(dist, 0,values.threshold, values.growFactor,0.0);
			
				// scale object
				if(values.bObject && obj.fillColor != null) {
					obj.bounds.width += resize;
					obj.bounds.height += resize;
					obj.position -= new Point(resize/2,resize/2);
				}
			
				//updateParticle(obj.index);
			
				// scale stroke
				if(values.bStroke && obj.strokeColor != null) {
					obj.strokeWidth += resize;
				}
		
		
				if(g.children.length > 0) {
					for(var j=0; j<g.children.length; j++) {
						objj = g.children[j];
						// print(objj.index + ' != ' + obj.index);
						if(objj.index != obj.index) {
							g.appendTop(obj);
							addParticle(obj)
						}
					}
				}
				else {
					g.appendTop(obj);
					addParticle(obj)
				}
				g.fillColor = new RGBColor(1.0,1.0,0.0);
		
		
				//obj.scale( map(dist, 0,values.threshold, values.growFactor/100,1.0), obj.position );
			}
		}// end bRunning

	}
	updatePhysics();
}



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	bRunning = true;
	mouseLocation = new Path.Circle( event.point, values.threshold);
	mousePoint = event.point;
}

function onMouseDrag(event) {
	mouseLocation.position = event.point;
	mousePoint = event.point;
	Draw();
}

function onMouseUp(event) {
	bRunning = false;
	mouseLocation.remove();
	mousePoint = event.point;

	g.children.sort(sortDistanceFromMouse);
	print(g.children.length);
	g.children[0].fillColor = new RGBColor(1.0,0.0,0.0);
	g.children[g.children.length-1].fillColor = new RGBColor(0.0,0.0,1.0);
}



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function initPhysics() {
	physics = new VerletPhysics2D();
	physics.setWorldBounds( new toxi.Rect(0,0, artboard.width,artboard.height) );
	physics.addBehavior(new GravityBehavior(new Vec2D(0,0.1)));
}
function updatePhysics() {
	//physics.particles[0].lock();
	//physics.particles[physics.particles.length-1].lock();
}


function updateParticle(num) {
	var p = physics.particles[num];
	var obj = sel[num];
	
	var size = Math.sqrt(obj.bounds.width * obj.bounds.height);
	physics.addBehavior(new toxi.physics2d.AttractionBehavior(p, size*1.5, -2.0));

	// define a repulsion field around each particle
	// this is used to push the object away
	if ((physics.particles.length-2) > 0) {
		var q = physics.particles[physics.particles.length-2];
		var s = new toxi.physics2d.VerletSpring2D(p,q, size*0.5, 0.01);
		physics.addSpring(s);
	}
}

function addParticle(obj) {
	var size = Math.sqrt(obj.bounds.width * obj.bounds.height);

	// create and add particle
	var p = new VerletParticle2D(obj.position.x,obj.position.y);
	physics.addParticle(p);

	var size = Math.sqrt(obj.bounds.width * obj.bounds.height);
	physics.addBehavior(new toxi.physics2d.AttractionBehavior(p, size*1.5, -2.0));

	// define a repulsion field around each particle
	// this is used to push the object away
	if ((physics.particles.length-2) > 0) {
		var q = physics.particles[physics.particles.length-2];
		var s = new toxi.physics2d.VerletSpring2D(p,q, size*0.5, 0.01);
		physics.addSpring(s);
	}
}


// ------------------------------------------------------------------------
function updatePalette(componentName, theUnit, theValDef) {
	palette.getComponent(componentName).units = theUnit;
	if(theValDef !== undefined) palette.getComponent(componentName).value = theValDef;
}


/**
 *
 *	Extend Path with some additional Methods
 *	Necessary for CirclePack()
 *
 */
function sortDistanceFromMouse(a, b) {
	print('a', a);
	var valueA = a.distanceFromMouse();
	var valueB = b.distanceFromMouse();
	var comparisonValue = 0;
	
	if(valueA > valueB) comparisonValue = -1;
	else if(valueA < valueB) comparisonValue = 1;
	
	return comparisonValue;
}
Path.prototype.distanceFromMouse = function() {
	var distance = this.position.getDistance(mousePoint);
	// print('distanceFromMouse', distance);
	return distance;
}



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();

// set a timer that runs the Update(event) function 
// every milisecond
var timer = setInterval(Update, 1);

//Update(event);
//Draw();