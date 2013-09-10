/**
 *	Lissajous 0.1
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 */


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

// script.coordinateSystem = 'bottom-up';
script.coordinateSystem = 'top-down';
script.angleUnits = 'radians';

var frameRate = 12;

// document properties
var palette;


// lissajous
var lb;
var factor = new Point();
var frequency = new Point();
var frequencyTemp = new Point();

var bAnimate = false;

// values
var values = {
	bAlternate:		false,
	bBlend:			true,

	phaseShift:	22.5,

	frequencyX:		41.5,
	frequencyY:		25,

	widthSta:		1,
	widthEnd:		6,
	strokeCap:		'round',
	strokeJoin:		'round',

	colSta:			new RGBColor(0.0, 1.0, 0.7),
	colEnd:			new RGBColor(1.0, 0.0, 0.7),

	opacSta:		100.0,
	opacEnd:		61.8,
	opacBlend:		'normal',

	width:			activeDocument.activeArtboard.bounds.width/4,
	height:			activeDocument.activeArtboard.bounds.height/4
};

// components
var components = {
	// ------------------------------------
	// flyout menu
	// ------------------------------------
	fAlternate: {
		type:		'menu-entry',
		value:		'Alternate',
		onSelect: function() {
			values.bAlternate = true;
			values.bBlend = false;

			setParameters();
			Draw();
		}
	},
	fBlend: {
		type:		'menu-entry',
		value:		'Blend',
		onSelect: function() {
			values.bAlternate = false;
			values.bBlend = true;

			setParameters();
			Draw();
		}
	},

	// ------------------------------------
	phaseShift: {
		type: 'number',
		label: 'Phase Shift',
		units: 'degree',
		min: 0,
		max: 360,
		increment: 15,
		onChange: function(value) { 
			setParameters();
			Draw();
		}
	},
	// increment: {
	//	type: 'number',
	//	label: 'Angle Increment',
	//	units: 'degree',
	// },
	incrementRule: { 
		type: 'ruler',
		fullSize: true,
	},

	// ------------------------------------
	frequencyX: {
		type: 'number',
		label: 'Frequency X',
		onChange: function(value) { 
			setParameters();
			Draw();
		}
	},
	frequencyY: {
		type: 'number',
		label: 'Frequency Y',
		onChange: function(value) { 
			setParameters();
			Draw();
		}
	},

	frequencyRule: { 
		type: 'ruler',
		fullSize: true,
	},

	// ------------------------------------
	width: {
		type: 'number',
		label: 'Width',
		units: 'point',
		onChange: function(value) { 
			setParameters();
			Draw();
		}
	},
	height: {
		type: 'number',
		label: 'Height',
		units: 'point',
		onChange: function(value) { 
			setParameters();
			Draw();
		}
	},

	sizeRule: { 
		type: 'ruler',
		fullSize: true,
	},

	// ------------------------------------
	widthSta: {
		type: 'number',
		label: 'Stroke Weight Start',
		units: 'point',
		increment: 1,
		onChange: function(value) { 
			setParameters();
			Draw();
		}
	},
	widthEnd: {
		type: 'number',
		label: 'Stroke Weight End',
		units: 'point',
		increment: 1,
		onChange: function(value) { 
			setParameters();
			Draw();
		}
	},
	strokeCap: {
		options: ['butt', 'round', 'square'],
		label: 'Cap',
		fullSize: true,
		onChange: function(value) { 
			setParameters();
			Draw();
		}
	},
	strokeJoin: {
		options: ['miter', 'round', 'bevel'],
		label: 'Join',
		fullSize: true,
		onChange: function(value) { 
			setParameters();
			Draw();
		}
	},

	widthRule: { 
		type: 'ruler',
		fullSize: true,
	},

	// ------------------------------------
	colSta: {
		type: 'color',
		label: 'Color Start',
		onChange: function(value) { 
			setParameters();
			Draw();
		}
	},
	colEnd: {
		type: 'color',
		label: 'Color End',
		onChange: function(value) { 
			setParameters();
			Draw();
		}
	},

	colorRule: { 
		type: 'ruler',
		fullSize: true,
	},

	// ------------------------------------
	opacSta: {
		type: 'number',
		label: 'Opacity Start',
		units: 'percent',
		onChange: function(value) { 
			setParameters();
			Draw();
		}
	},
	opacEnd: {
		type: 'number',
		label: 'Opacity End',
		units: 'percent',
		onChange: function(value) { 
			setParameters();
			Draw();
		}
	},
	opacBlend: {
		options: ['normal', 'multiply', 'screen', 'overlay', 'soft-light', 'hard-light', 'color-dodge', 'color-burn', 'darken', 'lighten', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'],
		label: 'Blend',
		fullSize: true,
		onChange: function(value) { 
			setParameters();
			Draw();
		}
	},

	opacRule: { 
		type: 'ruler',
		fullSize: true,
	},

	// ------------------------------------
	submit: { 
		type: 'button', 
		value: 'Apply',
		fullSize: true,
		onClick: function() {
			setParameters();
			Draw();
		}
	}
};


// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// initialize the palette window
	palette = new Palette('Lissajous 0.1', components, values);

	// parameters
	setParameters();

	// draw initial empty curve
	// kinda hacky... whatever
	lb = new lissajousBezier();
};



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
	if(bAnimate) {
		values.phaseShift += 1;

		values.frequencyX += 0.05;
		values.frequencyY += 0.5;

		values.widthSta += 0.05;
		values.widthEnd += 0.5;

		Draw();
	}
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	// remove previous curve
	lb.remove();


	// lissajous curve
	lb = new lissajousBezier(frequency, factor, radians(values.phaseShift));
	lb.translate( new Point(
		activeDocument.activeArtboard.bounds.width/2,
		activeDocument.activeArtboard.bounds.height/2)
	);


	// parameters of current iteration
	// for future repeatability
	var text = new PointText( new Point(lb.bounds.bottomLeft.x, lb.bounds.bottomLeft.y+30) );
	// text.point = new Point(lb.bounds.bottomLeft.x, lb.bounds.bottomLeft.y+21);
	text.characterStyle.font = app.fonts['helvetica'];
	text.characterStyle.fontSize = 12;
	text.characterStyle.leading = 15;
	text.fillColor = null;
	text.content = 'Frequency\t' + round(frequency.x,3) + ' / ' + round(frequency.y,3) + '\r';
	text.content += 'Size\t\t' + round(factor.x,3) + ' / ' + round(factor.y,3) + '\r';
	text.content += 'Phase Shift\t' + values.phaseShift;
	// being fussy about formatting
	text.range.words[0].characterStyle.font = app.fonts['helvetica']['bold'];
	text.range.words[4].characterStyle.font = app.fonts['helvetica']['bold'];
	text.range.words[8].characterStyle.font = app.fonts['helvetica']['bold'];
	text.range.words[9].characterStyle.font = app.fonts['helvetica']['bold'];
	// group text with curve
	lb.appendTop(text);
};



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
};

function onMouseDrag(event) {
	if(Key.isDown('shift')) {
		values.phaseShift = parseInt(event.point.x/activeDocument.activeArtboard.bounds.width * 360);
	}
	else {
		frequency.x = (event.point.x/activeDocument.activeArtboard.bounds.width * values.frequencyX);
		frequency.y = (event.point.y/activeDocument.activeArtboard.bounds.height * values.frequencyY);
	}

	Draw();
};

function onMouseUp(event) {
};

// ------------------------------------------------------------------------
function onKeyDown(event) {
	if(event.character == '\r') bAnimate =! bAnimate;
};




// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function setParameters() {
	// set frequency
	// update the current iteration
	if(frequency.x != frequencyTemp.x) frequency.x = frequency.x;
	else frequency.x = values.frequencyX;
	if(frequency.y != frequencyTemp.y) frequency.y = frequency.y;
	else frequency.y = values.frequencyY;

	frequencyTemp.x = values.frequencyX;
	frequencyTemp.y = values.frequencyY;

	// set size
	factor.x = values.width;
	factor.y = values.height;
};

// ------------------------------------------------------------------------
var lissajousBezier = function(frequency, scale, phaseShiftRads, stepRads) {
	/*
	 *	set defaults
	 */
	frequency		= (frequency === undefined) ? new Point(1,2) : frequency;
	scale			= (scale === undefined) ? new Point(activeDocument.activeArtboard.bounds.width,activeDocument.activeArtboard.bounds.height) : scale;
	stepRads		= (stepRads === undefined) ? radians(0.5) : stepRads;
	phaseShiftRads = (phaseShiftRads === undefined) ? 180 : phaseShiftRads;


	/*
	 *	group of paths
	 */
	var group = new Group();


	/*
	 *	coordinates for creating curve
	 */
	var p1 = new Point(0,0);
	var p2 = new Point(1,1);
	var d1 = (frequency === undefined) ? new Point(0,0) : frequency;
	var d2 = new Point(0,0);

	for(var angle=stepRads; angle<=(radians(360) + stepRads); angle+=stepRads) {
		var from = p2.clone();
		from *= scale;

		p2.x = Math.sin( angle*frequency.x + phaseShiftRads );
		p2.y = Math.sin( angle*frequency.y );

		d2.x = frequency.x * Math.cos( angle*frequency.x + phaseShiftRads );
		d2.y = frequency.y * Math.cos( angle*frequency.y );

		var delta = d1.cross(d2); 


		/*
		 *	path segment of curve
		 */
		var lpath = new Path();
		lpath.strokeCap = values.strokeCap;
		lpath.strokeJoin = values.strokeJoin;
		lpath.add(from);

		// handle
		var handle = new Point(
			( ( p2.cross(d2) ) * d1.x-( p1.cross(d1) ) * d2.x ) / delta,
			( ( p2.cross(d2) ) * d1.y-( p1.cross(d1) ) * d2.y ) / delta
		);
		handle *= scale;

		// next point (to)
		var to = p2.clone();
		to *= scale;

		// tolerance of allowance for handles
		// hack to control a glitch in handle calculation
		var tolerance = scale.clone();
		tolerance *= 0.1;
		if( Math.abs(delta) > 0.1 && boundsCheck(handle, scale, tolerance) ) {
			lpath.quadraticCurveTo(handle, to);
		}
		else {
			lpath.add(to);
		}

		p1 = p2.clone();
		d1 = d2.clone();


		/*
		 *	apply style parameters
		 */
		var n = norm(angle, stepRads,(radians(360) + stepRads));

		// stroke width
		var lweight = lerp( values.widthSta, values.widthEnd, n );
		lpath.strokeWidth = lweight;

		// stroke color
		if( values.bBlend ) {
			var lcol = lerpColor( values.colSta, values.colEnd, n );
			lpath.strokeColor = lcol;
		}
		if( values.bAlternate) {
			if( parseInt(n*100) % 2 == 0 ) lpath.strokeColor = values.colSta;
			else lpath.strokeColor = values.colEnd;
		}
		lpath.fillColor = null;

		// stroke opacity
		var lopacity = lerp( values.opacSta, values.opacEnd, n );
		lpath.opacity = lopacity/100;
		lpath.blendMode = values.opacBlend;


		/*
		 *	add path to group
		 */
		group.appendBottom(lpath);
	}
	if(group.children[0] != undefined) group.children[0].remove();


	return group;
};

// ------------------------------------------------------------------------
function boundsCheck(pt1, pt2, tolerance) {
	var brect = new Rectangle( 
		new Point(-(pt2.x+tolerance.x), -(pt2.y+tolerance.y)),
		new Point(pt2.x+tolerance.x, pt2.y+tolerance.y)
	);
	return pt1.isInside(brect);
};



// ------------------------------------------------------------------------
function radians(val) {
	return val * (Math.PI/180);
};

// ------------------------------------------------------------------------
function norm(val,start,stop) {
	return (val - start) / (stop - start);
};
function round(val, deci) {
	var multi = Math.pow(10,deci);
	return Math.round(val * multi)/multi;
};

// ------------------------------------------------------------------------
function lerp(start, stop, amt) {
	return start + (stop-start) * amt;
};
function lerpColor(c1,c2, amt) {
	var arg0 = lerp(c1.red,		c2.red,		amt);
	var arg1 = lerp(c1.green,	c2.green,	amt);
	var arg2 = lerp(c1.blue,	c2.blue,	amt);
	return new RGBColor(arg0, arg1, arg2);
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();

// set a timer that runs the Update(event) function
// every milisecond
var timer = setInterval(Update, 1000/frameRate);

Draw();