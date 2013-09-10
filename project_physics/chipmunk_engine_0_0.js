/**
 *	Chipmunk Engine 0.0
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 *	an engine which applies physics to items
 *
 */


// ------------------------------------------------------------------------
// libraries
// ------------------------------------------------------------------------
include('../libraries/chipmunk/cp_scriptographer.js');
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
// script.coordinateSystem = 'top-down';
script.angleUnits = 'radians';

// load frederickkScript
var f = frederickkScript;
var fio = f.FIO;

// document properties
var docWidth = activeDocument.bounds.width;
var docHeight = activeDocument.bounds.height;
var sel;

var palette;

//values
var settingsFile = 'chipmunk_engine_0_0.values';
var values = {
	bPause:		false
};

//components
var components = {
	pauseButton: { 
		type: 'button', 
		value: 'Pause',
		fullSize: true,
		onClick: function() {
			values.bPause = !values.bPause;
			if(values.bPause) this.value = 'Play';
			else this.value = 'Pause';
		}
	},

	packText: {
		type: 'string',
		value: 'Shift+Click:\rselected item static\r\rOpt+Click:\rselected item active',
		enabled: false,
		// rows: 5,
 		//multiline: true,
		fullSize: true,
	},

	resetButton: { 
		type: 'button', 
		value: 'Redefine Globals',
		fullSize: true,
		onClick: function() {
			chipmunkSettings();
			saveSettings();
		}
	}
};


/**
 *	chipmunk
 */
var cpDialog;
var cpSpace;

// holds all of the cpSpace paths in a group
// on update it's cleared out and re-populated
// within the Update(event) method
var group = new Group();



//values
var cpSettingsFile = '.chipmunk_engine_0_0.values';
var cpValues = {
	updates:		15,

	width:			docWidth,
	height:			docHeight,

	gravityX:		0,
	gravityY:		-100,

	friction:		0.5,
	elasticity:		0.2,

	bUseSettings:	false
};

//components
var cpComponents = {
	updates: {
		type: 'number',
		label: 'Updates per Second',
		steppers: true,
		enabled: true
	},

	// ------------------------------------
	// bounds
	// ------------------------------------
	boundsRule: {
		type: 'ruler',
		fullSize: true,
	},

	width: {
		type: 'number',
		label: 'Space Width',
		units: 'point',
		steppers: true,
		enabled: true
	},
	height: {
		type: 'number',
		label: 'Space Height',
		units: 'point',
		steppers: true,
		enabled: true
	},

	// ------------------------------------
	// gravity
	// ------------------------------------
	gravityX: {
		type: 'number',
		label: 'Gravity Horizontal',
	},
	gravityY: {
		type: 'number',
		label: 'Gravity Vertical',
	},

	// ------------------------------------
	// additional
	// ------------------------------------
	addlRule: {
		type: 'ruler',
		fullSize: true,
	},
	friction: {
		type: 'number',
		label: 'Global Friction',
		steppers: true,
	},
	elasticity: {
		type: 'number',
		label: 'Global Elasticity',
		steppers: true,
	},


	settingsRule: {
		type: 'ruler',
		fullSize: true,
	},
	bUseSettings: {
		type: 'checkbox',
		label: 'Use Saved Settings',
	},

};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	loadSettings();


	/**
	 *	setup chipmunk space
	 */
	if(!cpValues.bUseSettings) cpDialog = new Dialog.prompt("Chipmunk Setup", cpComponents, cpValues);
	cpSpace = createSpace(cpValues.width, cpValues.height);


	/**
	 *	main palette
	 */
	palette = new Palette("Chipmunk", components, values);


	saveSettings();
	cpComponents.width.enabled = false;
	cpComponents.height.enabled = false;
};



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
	if(!values.bPause) {
		var updatesPerSecond = cpValues.updates;
		var timeStep = 1 / updatesPerSecond;
		cpSpace.step( timeStep );

		group.removeChildren();
		cpSpace.eachShape( 
			function(shape) {
				group.appendTop( shape.draw() );
			}
		);
	}
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	sel = activeDocument.getItems({
		type: Item,
		selected: true
	});

	for( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];
		addBox(obj);
	}
};



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
var eventValues = {
	bodyType:	'box',
	bStatic:	false
};
var eventComponents = {
	bodyType: {
		type: 'list',
		options: ['box', 'ball', 'polygon'],
		fullSize: true,
	},
	bStatic: {
		type: 'checkbox',
		label: 'Static'
	}
};


function onMouseDown(event) {
	var obj = event.item;
	
	// set selected to a type/static
	if(Key.isDown('option')) {
		eventValues.bStatic = false;
	}
	else if(Key.isDown('shift')) {
		eventValues.bStatic = true;
	}
	else {
		var eventDialog = new Dialog.prompt('Add Item', eventComponents, eventValues);
	}

	// add selected to physics world
	if(eventValues.bodyType == 'box') {
		addBox(obj, eventValues.bStatic);
	}
	else if(eventValues.bodyType == 'ball') {
		addBall(obj, eventValues.bStatic);
	}
	else {
		addPolygon(obj, eventValues.bStatic);
	}
};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function loadSettings() {
	if(fio.checkFile(cpSettingsFile)) cpValues = fio.openFile(cpSettingsFile);
	if(fio.checkFile(settingsFile)) values = fio.openFile(settingsFile);
};

function saveSettings() {
	fio.saveFile(cpValues, cpSettingsFile);
	fio.saveFile(values, settingsFile);
};



/**
 *	Chipmunk.js
 *
 *	A port of the Chipmunk Physics library to Javascript
 *	http://chipmunk-physics.net/
 *
 *	http://dl.dropbox.com/u/2494815/demo/
 *	https://github.com/josephg/Chipmunk-js
 *
 *	Joseph Gentle
 *	
 *	http://josephg.com/
 *
 *
 *	moderately modified for Scriptographer/PaperJS by
 *	cp_scriptographer.js
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 */



// dialog box
function chipmunkSettings() {
	// cpDialog = new Dialog.prompt("Chipmunk Setup", cpComponents, cpValues);
};


// ------------------------------------------------------------------------
var createSpace = function(width, height) {
	// properties
	this.width = width;
	this.height = height;
	this.cpSpace = new Space();
	this.cpSpace.gravity = new cp.v(cpValues.gravityX, cpValues.gravityY); 

	var friction = cpValues.friction;		// friction we'll use for all shapes here.
	var elasticity = cpValues.elasticity;


	// create a segment line as floor
	var floor = this.cpSpace.addShape( 
		new cp.SegmentShape(
			this.cpSpace.staticBody,	// static body = infinite mass and should not move -> (ignores gravity)
			cp.v(0, 0),					// first endpoint in the lower left corner
			cp.v(this.width, 0),		// second endpoint in the lower right corner
			0							// height/width of shape
		)
	);
	floor.setElasticity(0.2);
	floor.setFriction(1.0);
	

	// create one wall on the left side 
	var wall1 = this.cpSpace.addShape(
		new cp.SegmentShape(
			this.cpSpace.staticBody,
			cp.v(0, 0),
			cp.v(0, this.height),
			0
		)
	);
	wall1.setElasticity(0.2);
	wall1.setFriction(1.0);


	// create one wall on the right side
	var wall2 = this.cpSpace.addShape(
		new cp.SegmentShape(
			this.cpSpace.staticBody,
			cp.v(this.width, 0),
			cp.v(this.width, this.height),
			0
		)
	);
	wall2.setElasticity(0.2);
	wall2.setFriction(1.0);


	// return cpSpace
	return this.cpSpace;
};


// ------------------------------------------------------------------------
function addBox(path, bStatic) {
	var gp = new Group();
	gp.appendTop(path);

	var pos = cp.v(gp.bounds.center.x, gp.bounds.center.y);
	var width = gp.bounds.width;
	var height = gp.bounds.height;
	var mass = width*height;
	
	if(!bStatic || bStatic == null) {
		var body = cpSpace.addBody(
			new cp.Body(
				mass,
				cp.momentForBox(mass, width,height)
			)
		);
		body.setPos(pos);
	
		var box = cpSpace.addShape(
			new cp.BoxShape(
				body,
				width,
				height,
				gp
			)
		);
	}
	else {
		// pos = cp.v(gp.bounds.center.x-width/2, gp.bounds.center.y-height/2);
		var box = cpSpace.addShape(
			// new cp.SegmentShape(
			// 	this.cpSpace.staticBody,
			// 	pos,
			// 	pos2,
			// 	0,
			// 	gp
			// )
			new cp.BoxShape(
				this.cpSpace.staticBody,
				width/2,
				height/2,
				gp
			)
		);
	}
	//box.setPos(pos);
	// box.setElasticity(0.8);
	// box.setFriction(1);
	box.setElasticity(cpValues.elasticity);
	box.setFriction(cpValues.friction);
};


// ------------------------------------------------------------------------
function addBall(path, bStatic) {
	var gp = new Group();
	gp.appendTop(path);

	var pos = cp.v(gp.bounds.center.x, gp.bounds.center.y);
	var radius = gp.bounds.width/2;
	var mass = radius*radius;

	if(!bStatic || bStatic == null) {
		var body = cpSpace.addBody(
			new cp.Body(
				mass,
				cp.momentForCircle(mass, 0, radius, cp.v(0, 0))
			)
		);
		body.setPos(pos);

		var circle = cpSpace.addShape(
			new cp.CircleShape(
				body,
				radius,
				cp.v(0, 0),
				gp
			)
		);
	}
	else {
		pos = cp.v(gp.bounds.point.x, gp.bounds.point.y);
		var circle = cpSpace.addShape(
			new cp.CircleShape(
				this.cpSpace.staticBody,
				radius,
				pos,
				gp
			)
		);
	}
	// circle.setElasticity(0.8);
	circle.setFriction(1);
	circle.setElasticity(cpValues.elasticity);
	// circle.setFriction(cpValues.friction);
};


// ------------------------------------------------------------------------
function addPolygon(path, bStatic) {
	if(!bStatic || bStatic == null) {
		addBox(path, false);
	}
	else {
		addBox(path, true);
	}
// 	var pts = [];
// 	var obj;
// 	
// 	print( 'getType(path)', getType(path) );
// 	var copy;
// 	if(getType(path) == 'CompoundPath') {
// 		copy = path.lastChild;
// 		copy.fillColor = randomRGBColor();
// 
// 		// if(getType(copy) == 'CompoundPath')
// 		// 	obj = copy.simplify();
// 		// else 
// 		obj = copy.lastChild;
// 	}
// 	else if(getType(path) == 'Group') {
// 		if(getType(path.lastChild) == 'CompoundPath') {
// 			obj = path.lastChild.lastChild;
// 		}
// 		else {
// 			obj = path.lastChild;
// 		}
// 	}
// 	else {
// 		obj = path;
// 	}
// 
// 	print('---OBJ---', obj);
// 	// pts = perimeterPoints(obj,10);
// 	pts = perimeterRect(obj);
// 	
// 	// obj.reverse();
// 	// for(var i in obj.segments) {
// 	// 	var segment = obj.segments[i];
// 	// 	
// 	// 	if( !obj.contains(segment.point) ) {
// 	// 		pts.push(segment.point.x);
// 	// 		pts.push(segment.point.y);
// 	// 	}
// 	// }
// 	var pos = cp.v(0,0);
// 
// 	var mass = obj.bounds.height*obj.bounds.width;
// 	var body = cpSpace.addBody(
// 		new cp.Body(mass, cp.momentForPoly(mass, pts, cp.v(0,0)))
// 	);
// 	body.setPos(pos);
// 	//body.p = vmult(frand_unit_circle(), 180);
// 	
// 	var shape = cpSpace.addShape(
// 		new cp.PolyShape(body, pts, cp.v(0,0))
// 	);
// 	shape.setElasticity(cpValues.elasticity);
// 	shape.setFriction(cpValues.friction);
// 
// 	// copy.remove();
// 	// obj.remove();
};


// ------------------------------------------------------------------------
function perimeterPoints(obj, tolerance) {
	var pts = [];
	var rect = new Rectangle(
		obj.bounds.topLeft + tolerance,
		obj.bounds.bottomRight - tolerance
	);
	for(var i in obj.segments) {
		var seg = obj.segments[i];
		var pt = seg.point;
		if( !pt.isInside(rect) && pt.isInside(obj.bounds) ) {
			pts.push(pt.x);
			pts.push(pt.y);
		}
	}
	return pts;
};
function perimeterRect(obj) {
	var pts = [];
	pts.push(obj.bounds.topLeft.x);
	pts.push(obj.bounds.topLeft.y);

	pts.push(obj.bounds.topRight.x);
	pts.push(obj.bounds.topRight.y);

	pts.push(obj.bounds.bottomRight.x);
	pts.push(obj.bounds.bottomRight.y);

	pts.push(obj.bounds.bottomLeft.x);
	pts.push(obj.bounds.bottomLeft.y);

	return pts;
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Animate(true);
Draw();
