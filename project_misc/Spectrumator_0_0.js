/**
 *	Spectrumator 0.0
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
var spectrum = new Array();
	spectrum[0] = new CMYKColor(0,1,1,0);	//red
	spectrum[1] = new CMYKColor(0,0,1,0);	//yellow
	spectrum[2] = new CMYKColor(0.4,0,1,0);	//green
	spectrum[3] = new CMYKColor(1,0,0,0);	//cyan
	spectrum[4] = new CMYKColor(1,1,0,0);	//indigo
	spectrum[5] = new CMYKColor(0,1,0,0);	//purple

// values
var values = {
	// ------------------------------------
	// modus
	// ------------------------------------
	drawModus:			'Radiate',

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
	bSelItems: false,
	bColRainbow: false,
	bColMid: true,
	colMid: new CMYKColor(0,0,0,0)

};

// gui components
var components = {
	// ------------------------------------
	// mode
	// ------------------------------------
	drawModus: {
		label: 'Render Mode',
		options: ['Radiate', 'Straight'],
		onChange: function(value) {
			//print('drawing type', value);
			if(value == 'Radiate') {
				components.originOff.enabled = true;
				components.rotation.enabled = true;
				components.rotationSta.enabled = true;

			} else if(value == 'Straight') {
				components.originOff.enabled = false;
				components.rotation.enabled = false;
				components.rotationSta.enabled = false;
			}
		}
	},

	drawRule: { 
		type: 'ruler',
		fullSize: true,
	},

	// ------------------------------------
	// sizes
	// ------------------------------------
	radiusOut: {
		type: 'number',
		label: 'Radius outer/Length',
		units: 'point',
		increment: 10 
	},
	radiusIn: {
		type: 'number',
		label: 'Radius inner/Height',
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
		label: 'Rotation increments/Spacing',
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

	bSelItems: {
		type: 'checkbox',
		label: 'Selected items',
		onChange: function(value) {
			components.bColRainbow.value = false;

			components.rotation.enabled = !value;
			components.rotationSta.enabled = !value;
			components.colSta.enabled = !value;
			components.colEnd.enabled = !value;
		}
	},
	bColRainbow: {
		type: 'checkbox',
		label: 'Rainbow',
		onChange: function(value) {
			components.bSelItems.value = false;

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


	bColMid: {
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
	var palette = new Palette('Spectrumator 0.0', components, values);
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
	if(values.drawModus == 'Radiate') Radiate();
	else if(values.drawModus == 'Straight') Straight();
}


function colorWheel(arr) {
	var group = new Group();
	var originOff = new Point(values.originOff,values.originOff);
	var rotAngle = 360/arr.length;

	for(var index=0; index<arr.length; index++) {
		var rotation = index*rotAngle + rotAngle;

		for(var angle=index*rotAngle; angle<rotation; angle+=values.steps) {
			//make the points
			var x1 = Math.cos( radians(angle) ) * values.radiusIn;
			var y1 = Math.sin( radians(angle) ) * values.radiusIn;

			var x2 = Math.cos( radians(angle) ) * values.radiusOut;
			var y2 = Math.sin( radians(angle) ) * values.radiusOut;

			var pt1 = pointAdd( origin, new Point(x1,y1) );
			var pt2 = pointAdd( origin, new Point(x2,y2) );

			//colors
			var colSta = arr[index];
			var colEnd;
			
			if( index+1 < arr.length) colEnd = arr[index+1];
			else colEnd = arr[0];

			n = norm(angle, index*rotAngle,rotation);

			var col = lerpColor(colSta,colEnd, n);
			var colGrad = new GradientColor( gradient(values.colMid,col), pt1,pt2 );

			//draw line
			var strahl = Path.Line( pointAdd(pt1,originOff), pt2 );
			strahl.fillColor = null;
			if(!values.bColMid) strahl.strokeColor = col;
			else strahl.strokeColor = colGrad;

			//add to our group
			group.appendTop( strahl );
		}

	}

}


// ------------------------------------------------------------------------
function Radiate() {
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
		if(!values.bColMid) {
			strahl.fillColor = col;
			strahl.strokeColor = col;
		} else {
			strahl.fillColor = colGrad;
			strahl.strokeColor = colGrad;
		}

		//add to our group
		group.appendTop( strahl );
	
	}
}

// ------------------------------------------------------------------------
function Straight() {
	var group = new Group();

	for(var x=origin.x; x<origin.x + values.radiusOut; x+=values.steps) {
		//make the points
		var pt1 = new Point(x,origin.y);
		var pt2 = new Point(x,origin.y+values.radiusIn);

		//size
		var sz = new Size(100,10)

		//colors
		var colSta = values.colSta;
		var colEnd = values.colEnd;
		
		var col = lerpColor( colSta,colEnd, norm(x, origin.x,origin.x+values.radiusOut) );
		var colGrad = new GradientColor( gradient(values.colMid,col), pt1,pt2 );

		//draw line
		var strahl = Path.Line( pt1, pt2 );
		if(!values.bColMid) {
			strahl.fillColor = col;
			strahl.strokeColor = col;
		} else {
			strahl.fillColor = colGrad;
			strahl.strokeColor = colGrad;
		}

		//add to our group
		group.appendTop( strahl );
	}
}


// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	origin = event.point;

	if(values.bColRainbow) colorWheel( spectrum );
	else if(values.bSelItems) colorWheel( colorCollect() ); 
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
	
	return new CMYKColor(c,m,y,k);
}
function lerpColorRGB(c1,c2, amt) {
	var r = lerp(c1.red,	 c2.red,	 amt);
	var g = lerp(c1.green, c2.green, amt);
	var b = lerp(c1.blue,	 c2.blue,	 amt);
	
	return new RGBColor(r,g,b);
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

function colorCollect() {
	sel = activeDocument.getItems( { type: Item, selected: true } );
	var colArray = new Array();
	for(i in sel) colArray.push( sel[i].fillColor );

	return colArray;
}


// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
//Draw();



