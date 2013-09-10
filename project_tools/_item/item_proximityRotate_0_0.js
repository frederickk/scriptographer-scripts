/**
 *	Proximity Rotate
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
include('../../libraries/frederickkScript/frederickkScript.js');



// ------------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------------



// load frederickkScript
var f = frederickkScript;

// document properties
var sel;
var selDist = [];
var palette;

var angleHolder;

var mouseLocation;
var mousePoint = new Point();


// values
var values = {
	threshold:			50,
	bThreshold:			false,

	maxAngle:			10.0,

	bSnap:				false,
	snapAngle:			45
};


// gui components
var components = {
	// ------------------------------------
	// settings
	// ------------------------------------
	bThreshold: {
		type:		'checkbox',
		label:		'Enable Threshold',
		onChange: function(value) {
			components.threshold.enabled = value;
		}
	},
	threshold: {
		type:			'number',
		label:			'Distance Threshold',
		steppers:		true,
		increment:		10,
		enabled: 		false,
		onChange: function(value) {
			mouseLocation.width = value;
			mouseLocation.height = value;
		}
	},

	optionsRule: { 
		type:			'ruler',
		fullSize:		true,
	},


	maxAngle: {
		type:			'number',
		label:			'Maximum Rotation',
		steppers:		true,
		increment:		1.0,
		units:			'degree'
	},

	bSnap: {
		type:		'checkbox',
		label:		'Enable Snap',
		onChange: function(value) {
			components.snapAngle.enabled = value;
		}
	},
	snapAngle: {
		type:			'number',
		label:			'Snap Angle',
		steppers:		true,
		increment:		1.0,
		units:			'degree',
		enabled: 		false,
	},

};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	init();
	palette = new Palette('Proximity Rotate 0.0', components, values);
};



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	var maxDist = selDist[0].position.getDistance(mouseLocation.position);
	var minDist = selDist[sel.length-1].position.getDistance(mouseLocation.position);

	for(var i=0; i<sel.length; i++) {
		var obj = sel[i];
		var dist = obj.position.getDistance(mouseLocation.position)

		var angle;
		if(values.bThreshold && dist > 0 && dist < values.threshold) {
			angle = f.map(dist, 0,values.threshold, 0.0,values.maxAngle);
		}
		else {
			angle = f.map(dist, minDist,maxDist, 0,values.maxAngle);
		}

		// save rotated angle
		angleHolder[i] += angle;

		// // var nangle = obj.position.angle;
		var nangle = angle - angleHolder[i];
		
		if(values.bSnap) nangle = f.snap(nangle, values.snapAngle);
		
		// rotate object
		obj.rotate( f.radians(nangle),obj.position );
		// obj.position.angle -= f.radians(nangle);

	}

};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function init() {
	sel = activeDocument.getItems({
		type: Item,
		hidden: false,
		selected: true 
	});
	selDist = sel;

	angleHolder = new Array(sel.length);
	for(var i=0; i<sel.length; i++) {
		angleHolder[i] = 0.0;
	}
};

// ------------------------------------------------------------------------
function updatePalette(componentName, theUnit, theValDef) {
	palette.getComponent(componentName).units = theUnit;
	if(theValDef !== undefined) palette.getComponent(componentName).value = theValDef;
};

// ------------------------------------------------------------------------
function reset() {
	for(var i=0; i<sel.length; i++) {
		var obj = sel[i];
		// print('angleHolder[' + i + ']: ' + angleHolder[i])
		obj.rotate( -f.radians(angleHolder[i]),obj.position );
	}	
};


/**
 *
 *	Extend Path with some additional Methods
 *
 */
function sortDistanceFromMouse(a, b) {
	var valueA = a.distanceFromMouse();
	var valueB = b.distanceFromMouse();
	var comparisonValue = 0;
	
	if(valueA > valueB) comparisonValue = -1;
	else if(valueA < valueB) comparisonValue = 1;
	
	return comparisonValue;
};

Item.prototype.distanceFromMouse = function() {
	var distance = this.position.getDistance(mousePoint);
	return distance;
};



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	mouseLocation = new Path.Circle( event.point, values.threshold);
	mousePoint = event.point;
	// Draw();
};

function onMouseDrag(event) {
	mouseLocation.position = event.point;
	mousePoint = event.point;
	Draw();
};

function onMouseUp(event) {
	mouseLocation.remove();
	mousePoint = event.point;

	selDist.sort(sortDistanceFromMouse);
};

// ------------------------------------------------------------------------
function onKeyDown(event) {
	if(Key.isDown('space')) {
		reset();
	}

	if(Key.isDown('open-bracket')) {
		values.threshold--;
	}
	if(Key.isDown('close-bracket')) {
		values.threshold++;
	}
};


// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Animate(false);
// Draw();
