/**
 *	Phyllotactic Spiral 0.1
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


// document properties
var sel;
var origin = new Point(0,0);
var groupDot;

// values
var values = {
	// ------------------------------------
	// general
	// ------------------------------------
	dotSpacing:		2,
	dotSize:		0.5,
	bAutoSize:		false,

	// ------------------------------------
	// modes
	// ------------------------------------
	drawModus:			'Circles',
	drawType:			'Concentric Rings',

	// ------------------------------------
	// concentric
	// ------------------------------------
	ringNum:		50,
	ringSpacing:	3,
	ringAngle:		90,

	// ------------------------------------
	// phyllotactic
	// ------------------------------------
	dotNumber:		1600

};


// gui components
var components = {
	// ------------------------------------
	// general
	// ------------------------------------
	dotSpacing: {
		type: 'number',
		label: 'Dot spacing',
		units: 'point',
		increment: 0.5,
		min: 0.1
	},
	dotSize: {
		type: 'number',
		label: 'Size',
		units: 'point',
		increment: 0.5,
		min: 0.1
	},
	bAutoSize: {
		type: 'checkbox',
		label: 'Auto sizing',
	},

	generalRule: { 
		type: 'ruler',
		fullSize: true,
	},


	// ------------------------------------
	// mode
	// ------------------------------------
	drawModus: {
		label: 'Drawing Mode',
		options: ['Circles', 'Points', 'Lines']
	},

	drawType: {
		label: 'Drawing Type',
		options: ['Concentric Rings', 'Phyllotactic Spiral'],
		onChange: function(value) {
			//print('drawing type', value);
			if(value == 'Concentric Rings') {
				components.ringNum.enabled = true;
				components.ringSpacing.enabled = true;
				components.ringAngle.enabled = true;
				components.dotNumber.enabled = false;

			} else if(value == 'Phyllotactic Spiral') {
				components.ringNum.enabled = false;
				components.ringSpacing.enabled = false;
				components.ringAngle.enabled = false;
				components.dotNumber.enabled = true;
			}
		}

	},

	modeRule: { 
		type: 'ruler',
		fullSize: true,
	},


	// ------------------------------------
	// concentric
	// ------------------------------------
	ringNum: {
		type: 'number',
		label: 'Number of rings',
		units: 'none',
		increment: 1,
		min: 1,
 	},
	ringSpacing: {
		type: 'number',
		label: 'Ring spacing',
		units: 'point',
		increment: 0.5,
		min: 0.5,
	},
	ringAngle: {
		type: 'number',
		label: 'Ring rotation',
		units: 'degree',
		increment: 0.5,
		min: 0,
		max: 720,
	},
	concentricRule: { 
		type: 'ruler',
		fullSize: true,
	},


	// ------------------------------------
	// phyllotactic
	// ------------------------------------
	dotNumber: {
		type: 'number',
		label: 'Number of points',
		units: 'none',
		increment: 1,
		min: 1,
	}
};


// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	var palette = new Palette('Phyllotactic Spiral 0.1', components, values);
	components.dotNumber.enabled = false;
};


// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	var ringNum = values.ringNum;
	var ringSpacing = values.ringSpacing;

	if(values.drawType == 'Concentric Rings') {
		//print( "Concentric();" );
		for(var j=0; j<ringNum; j++) {
			var ang = lerp(0,values.ringAngle, j/ringNum);
			Concentric( (j*ringSpacing), ang );
		}

	}
	else if(values.drawType == 'Phyllotactic Spiral') {
		//print( "Phyllotactic()" );
		Phyllotactic();
	}

};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function Concentric(radius,ang) {
	groupDot = new Group();

	var x,y;
	var numDot = 360/radius;

	if(values.drawModus == 'Lines') {
		var dot = new Path();
	}

	for(var i=0; i<360; i+=numDot/2) {
		//location
		var theta = radians( i );
		x = radius * Math.cos(theta);
		y = radius * Math.sin(theta);

		//size		
		var r;
		if(values.bAutoSize) {
			r = map(ang, 0,values.ringAngle, 0.1,values.dotSize);
		}
		else {
			r = values.dotSize;
		}
		
		//draw
		if(values.drawModus == 'Points') {
			if(values.drawModus != 'Lines') var dot = new Path();
			dot.add( new Point(origin.x + x,origin.y + y) );
			dot.strokeColor = new CMYKColor(1,1,1,1);
			dot.fillColor = null;

		}
		else if(values.drawModus == 'Lines') {
			dot.add( new Point(origin.x + x,origin.y + y) );
			dot.strokeColor = new CMYKColor(1,1,1,1);
			dot.fillColor = null;

		}
		else {
			var dot = Path.Circle( new Point(origin.x + x,origin.y + y), r );
			dot.strokeColor = null;
			dot.fillColor = new CMYKColor(1,1,1,1);
		}
		
		//add to our group
		groupDot.appendTop( dot );
	}
	
	//debug
	/*
	var rect = new Path.Rectangle( origin, new Size(radius,radius) );
	groupDot.appendTop( rect );
	*/
	groupDot.rotate( radians(ang) );

};


// ------------------------------------------------------------------------
function Phyllotactic() {
	var group = new Group();

	var rotation = 137.51;
	var spacing = values.dotSpacing;
	var num = values.dotNumber;
	var x,y;
	
	if(values.drawModus == 'Lines') {
		var dot = new Path();
	}
	for(var i=1; i<=num; i++) {
		//location
		var radius = spacing * Math.sqrt(i);
		var theta = i * radians( rotation );

		x = radius * Math.cos(theta);
		y = radius * Math.sin(theta);

		//size		
		var r;
		if(values.bAutoSize) {
			r = map(i, 0,num, 0.1,values.dotSize);
		}
		else {
			r = values.dotSize;
		}

		//draw
		if(values.drawModus == 'Points') {
			var dot = new Path();
			dot.add( new Point(origin.x + x,origin.y + y) );
			dot.strokeColor = new CMYKColor(1,1,1,1);
			dot.fillColor = null;

		}
		else if(values.drawModus == 'Lines') {
			dot.add( new Point(origin.x + x,origin.y + y) );
			dot.strokeColor = new CMYKColor(1,1,1,1);
			dot.fillColor = null;

		}
		else if(values.drawModus == 'Circles') {
			var dot = Path.Circle( new Point(origin.x + x,origin.y + y), r );
			dot.strokeColor = null;
			dot.fillColor = new CMYKColor(1,1,1,1);
		}
		
		//add to our group
		group.appendTop( dot );
	}

};

// ------------------------------------------------------------------------
function lerp(start, stop, amt) {
	return start + (stop-start) * amt;
};

function map(value, istart, istop, ostart, ostop) { 
	return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
};

function radians(val) { 
	return val * (Math.PI/180);
};



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	origin = event.point;
	Draw();
};

function onMouseDrag(event) {
};

function onMouseUp(event) {
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
//Draw();



