/**
 *	Osram Strahl 0.0
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
var group = new Group();

// values
var values = {
	// ------------------------------------
	// sizes
	// ------------------------------------
	radius:	100,

	// ------------------------------------
	// rotation
	// ------------------------------------
	rotation: 360,
	rotationSta: 0,
	steps: 1,

	// ------------------------------------
	// color
	// ------------------------------------
	colSta: new CMYKColor(0,0,0,0),
	colEnd: new CMYKColor(1,1,1,1)

};

// gui components
var components = {
	// ------------------------------------
	// sizes
	// ------------------------------------
	radius: {
		type: 'number',
		label: 'Radius',
		units: 'point'
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
		units: 'degree'
	},
	rotationSta: {
		type: 'number',
		label: 'Rotation starting\nangle',
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
	}
	
}


// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	var dialog = new Dialog.prompt('Osram Strahl 0.0', components, values);
	//var palette = new Palette('Osram Strahl 0.0', components, values);
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
	var rotation = values.rotationSta + values.rotation;

	for(var angle = values.rotationSta; angle<rotation; angle+=values.steps) {
		var x = Math.cos( radians(angle) ) * values.radius;
		var y = Math.sin( radians(angle) ) * values.radius;
		var pt = pointAdd( origin, new Point(x,y) );
		var sz = new Size(100,10)
		
		var colSta = values.colSta; //new CMYKColor(1,0,0,0);
		var colEnd = values.colEnd //new CMYKColor(0,1,0,0);
		
		var col = lerpColor(colSta,colEnd, norm(angle, 0,rotation));
		
		//draw line
		var strahl = Path.Line( origin, pt );
		strahl.fillColor = null;
		strahl.strokeColor = col;

		//add to our group
		group.appendTop( strahl );
	
	}

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


// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
Draw();



