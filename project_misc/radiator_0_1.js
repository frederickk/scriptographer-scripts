/**
 *	Radiator 0.1
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
var origin = new Point(0,0);
var spectrum = new Array();
	spectrum[0] = new CMYKColor(0,1,1,0);	//red
	spectrum[1] = new CMYKColor(0,0,1,0);	//yellow
	spectrum[2] = new CMYKColor(0.4,0,1,0);	//green
	spectrum[3] = new CMYKColor(1,0,0,0);	//cyan
	spectrum[4] = new CMYKColor(1,1,0,0);	//indigo
	spectrum[5] = new CMYKColor(0,1,0,0);	//purple
	spectrum[6] = new CMYKColor(0,1,1,0);	//red

// values
var values = {
	// ------------------------------------
	// sizes
	// ------------------------------------
	radiusIn: 0,
	radiusOut: 100,
	originOff: 0,

	// ------------------------------------
	// rotation
	// ------------------------------------
	rotation: 360,
	rotationSta: 0,
	steps: 1,

	// ------------------------------------
	// color
	// ------------------------------------
	colSta: new CMYKColor(0.5,0.5,0.5,0.5),
	colEnd: new CMYKColor(1,1,1,1),
	b_colRainbow: false,
	b_colMid: true,
	colMid: new CMYKColor(0,0,0,0)

};

// gui components
var components = {
	// ------------------------------------
	// sizes
	// ------------------------------------
	radiusIn: {
		type: 'number',
		label: 'Radius inner',
		units: 'point',
		increment: 10 
	},
	radiusOut: {
		type: 'number',
		label: 'Radius outer',
		units: 'point',
		increment: 10 
	},
	originOff: {
		type: 'number',
		label: 'Center offset',
		units: 'point',
		increment: 10 
	},

	radiusRule: { 
		type: 'ruler',
		fullSize: true,
	},

	// ------------------------------------
	// rotation
	// ------------------------------------
	rotation: {
		type: 'number',
		label: 'Rotation',
		units: 'degree',
		min: 0,
		max: 720
	},
	rotationSta: {
		type: 'number',
		label: 'Rotation starting angle',
		units: 'degree'
	},
	steps: {
		type: 'number',
		label: 'Rotation increments',
		units: 'degree'
	},
	
	rotationRule: { 
		type: 'ruler',
		fullSize: true,
	},
	
	// ------------------------------------
	// color
	// ------------------------------------
	colSta: {
		type: 'color',
		label: 'Color start'
	},
	colEnd: {
		type: 'color',
		label: 'Color end'
	},

	b_colRainbow: {
		type: 'checkbox',
		label: 'Rainbow',
		onChange: function(value) {
			components.rotation.enabled = !value;
			components.rotationSta.enabled = !value;
			components.colSta.enabled = !value;
			components.colEnd.enabled = !value;
		}
	},

	colorRule: { 
		type: 'ruler',
		fullSize: true,
	},


	b_colMid: {
		type: 'checkbox',
		label: 'Color center'
	},
	colMid: {
		type: 'color',
	}
	
}


// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	//var dialog = new Dialog.prompt('Radiator 0.1', components, values);
	var palette = new Palette('Radiator 0.1', components, values);
}


// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
}

// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	var group = new Group();
	var rotation = values.rotationSta + values.rotation;
	var originOff = new Point(values.originOff,values.originOff);

	for(var angle = values.rotationSta; angle<rotation; angle+=values.steps) {
		//make the points
		var x1 = Math.cos( radians(angle) ) * values.radiusIn;
		var y1 = Math.sin( radians(angle) ) * values.radiusIn;

		var x2 = Math.cos( radians(angle) ) * values.radiusOut;
		var y2 = Math.sin( radians(angle) ) * values.radiusOut;

		var pt1 = pointAdd( origin, new Point(x1,y1) );
		var pt2 = pointAdd( origin, new Point(x2,y2) );

		//size
		var sz = new Size(100,10)

		//colors
		var colSta = values.colSta;
		var colEnd = values.colEnd;
		
		var col = lerpColor(colSta,colEnd, norm(angle, 0,rotation));
		var colGrad = new GradientColor( gradient(values.colMid,col), pt1,pt2 );

		//draw line
		var strahl = Path.Line( pointAdd(pt1,originOff), pt2 );
		strahl.fillColor = null;
		if(!values.b_colMid) strahl.strokeColor = col;
		else strahl.strokeColor = colGrad;

		//add to our group
		group.appendTop( strahl );
	
	}

}


function Rainbow() {
	var group = new Group();
	var originOff = new Point(values.originOff,values.originOff);

	for(var index=0; index<6; index++) {
		var rotation = index*60 + 60;

		for(var angle=index*60; angle<rotation; angle+=values.steps) {
			//make the points
			var x1 = Math.cos( radians(angle) ) * values.radiusIn;
			var y1 = Math.sin( radians(angle) ) * values.radiusIn;

			var x2 = Math.cos( radians(angle) ) * values.radiusOut;
			var y2 = Math.sin( radians(angle) ) * values.radiusOut;

			var pt1 = pointAdd( origin, new Point(x1,y1) );
			var pt2 = pointAdd( origin, new Point(x2,y2) );

			//colors
			var colSta = spectrum[index];
			var colEnd = spectrum[index+1];

			n = norm(angle, index*60,rotation);

			var col = lerpColor(colSta,colEnd, n);
			var colGrad = new GradientColor( gradient(values.colMid,col), pt1,pt2 );

			//draw line
			var strahl = Path.Line( pointAdd(pt1,originOff), pt2 );
			strahl.fillColor = null;
			if(!values.b_colMid) strahl.strokeColor = col;
			else strahl.strokeColor = colGrad;

			//add to our group
			group.appendTop( strahl );
		}

	}

}




// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	origin = event.point;

	if(values.b_colRainbow) Rainbow();
	else Draw();
}

function onMouseDrag(event) {
}

function onMouseUp(event) {
}

// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function random(minr, maxr) {
	return minr + Math.random() * (maxr - minr);
}

function norm(val,start,stop) {
	return (val - start) / (stop - start);
}

/*
 * amt	float: between 0.0 and 1.0
 */
function lerp(start, stop, amt) {
    return start + (stop-start) * amt;
}


function degrees(val) {
	return val * (180/Math.PI);
}

function radians(val) {
	return val * (Math.PI/180);
}

function lerpColor(c1,c2, amt) {
	var c = lerp(c1.cyan,	 c2.cyan,	 amt);
	var m = lerp(c1.magenta, c2.magenta, amt);
	var y = lerp(c1.yellow,	 c2.yellow,	 amt);
	var k = lerp(c1.black,	 c2.black,	 amt);
	
	var col = new CMYKColor(c,m,y,k);
	return col;
}

function pointAdd(pt1,pt2) {
	return new Point( pt1.x + pt2.x, pt1.y + pt2.y);
}

function gradient(c1,c2) {
	var grad = new Gradient();
	grad.type = 'linear';
	grad.stops = [ new GradientStop(c1, 0), new GradientStop(c2, 1) ];

	return grad;
}


// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
//Draw();



