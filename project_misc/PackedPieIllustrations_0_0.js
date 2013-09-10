/**
 *	Packed Pie Illustrations 0.0
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
// Libraries
// ------------------------------------------------------------------------
include('../libraries/frederickkScript/frederickkScript.js');
include('../libraries/frederickkScript/CirclePacker.js');



// ------------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------------


// load frederickkScript
var f = frederickkScript;

// document properties
var sel;
var palette;

// try to keep this framerate
// but be warned if you have over 50 items
// this is highly unlikely
// maybe try http://processing.org/ or http://paperjs.org/ instead
// framerate can be set via the 
// Animate() function below
var frameRate = 12;

// Oh... what to pack?
var packer;
var circles = [];


//values
var values = {
	// ------------------------------------
	// sizing
	// ------------------------------------
	minSize:		10,
	maxSize:		40,

	minPieces:		2,
	maxPieces:		20,

	// ------------------------------------
	// hole
	// ------------------------------------
	bHole:			false,
	holeRatio: 		0.618,
	holeColor:		new RGBColor(1,1,1),


	// ------------------------------------
	// control
	// ------------------------------------
	bPause:			true,

	padding: 0,
	iterations: 	11,


	// ------------------------------------
	// raster
	// ------------------------------------
	rasterWidth:	0,
	rasterHeight:	0,
};


//components
var components = {
	// ------------------------------------
	// sizing
	// ------------------------------------
	minSize: {
		type: 'number',
		label: 'Min. Size',
		range: [10, values.maxSize],
		steppers: true,
		increment: 1,
		units: 'point',
		onChange: function(val) {
			components.maxSize.range = [val, 100];
		}
	},
	maxSize: {
		type: 'number',
		label: 'Max. Size',
		range: [values.minSize, 100],
		steppers: true,
		increment: 1,
		units: 'point',
		onChange: function(val) {
			components.minSize.range = [10, val];
		}
	},

	minPieces: {
		type: 'number',
		label: 'Min. Pieces',
		range: [2, values.maxPieces],
		steppers: true,
		increment: 1,
		onChange: function(val) {
			components.maxPieces.range = [val, 20];
		}
	},
	maxPieces: {
		type: 'number',
		label: 'Max. Pieces',
		range: [values.minPieces, 20],
		steppers: true,
		increment: 1,
		onChange: function(val) {
			components.minPieces.range = [2, val];
		}
	},


	// ------------------------------------
	// hole
	// ------------------------------------
	holeRule: { 
		type: 'ruler',
		fullSize: true,
	},

	bHole: {
		type: 'checkbox',
		label: 'Hole',
	},
	holeRatio: {
		type: 'number',
		label: 'Size Ratio',
		steppers: true,
		range: [0.05, 0.95]
	},
	holeColor: {
		type: 'color',
		label: 'Color'
	},


	// ------------------------------------
	// control
	// ------------------------------------
	controlRule: { 
		type: 'ruler',
		fullSize: true,
	},

	packText: {
		type: 'string',
		value: 'Shift+Click:\radd group/path to packing group\r\rOpt+Click:\radd individual paths of group to packing group',
		enabled: false,
		rows: 5,
 		//multiline: true,
		fullSize: true,
	},

	padding: {
		type: 'number',
		label: 'Spacing',
		units: 'point',
		steppers: true,
		fullSize: true
	},

	pauseRule: { 
		type: 'ruler',
		fullSize: true
	},

	pauseButton: { 
		type: 'button', 
		value: 'Play',
		fullSize: true,
		onClick: function() {
			values.bPause = !values.bPause;

			if(values.bPause) this.value = 'Play';
			else this.value = 'Pause';
		}
	},


	// ------------------------------------
	// raster
	// ------------------------------------
	rasterRule: { 
		type: 'ruler',
		fullSize: true,
	},

	rasterWidth: {
		type: 'number',
		label: 'Raster width',
		units: 'point',
		steppers: true,
		increment: 10,
		enabled: true
	},

	rasterHeight: {
		type: 'number',
		label: 'Raster height',
		units: 'point',
		steppers: true,
		increment: 10,
		enabled: true
	},
	rRule: { 
		type: 'ruler',
		fullSize: true,
	},
	
	raster: { 
		type: 'button', 
		value: 'Redefine source image',
		fullSize: true,
		enabled: true,
		onClick: function() {
			//rasterValid = false;
			RasterSetup();
		}
	}
};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// setup rasters
	RasterSetup();
	// move raster to center (if there is one)
	if(raster != null) raster.position = artboard.bounds.center;

	// selected items
	sel = activeDocument.getItems({
		type: [Path, CompoundPath, TextItem],
		selected: true,
		// hidden: false 
	});


	// check for compound paths
	// because handling these is a pain
	// push everything into the circles array
	var index = 0;
	for( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];
		obj.name = 'cp'+index;

		// is this obj a TextItem
		if (obj.characterStyle != null) {
			obj = BreakText(obj);

			// add each item created to the circles group
			for( var j=0; j<obj.children.length; j++ ) {
				var child = obj.children[j];
				circles.push( child );
				index++;
			}
		}
		// seems to be a normal Path
		else {
			// obj.toGroup();
			// circles.push(obj);
			circles.push( CompoundPathToGroup(obj) );
			index++;
		}
	}

	// show pallete
	palette = new Palette('PackedPieIllustrations', components, values);

	// initiate circle packer
	packer = new CirclePacker(f, circles, values.iterations);
};



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
	if (!values.bPause) {
		packer.setPadding( values.padding );
		packer.update();
	}


	// // since there is an image, we'll map
	// // item position to color value
	// if(raster != null) {

	// 	for(var i=0; i<packer.getItems().length; i++) {
	// 		var obj = packer.getItem(i);
	// 		obj.fillColor = raster.getPixel( 
	// 			new Point( 
	// 				obj.position.x - raster.position.x + raster.width/2,
	// 				obj.position.y - raster.position.y + raster.height/2
	// 			)
	// 		);
	// 	}

	// }

};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
};



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	drawPies(event.point);

	// add item to pack
	if (Key.isDown('shift')) {
		var obj = event.item;
		if(obj != null || obj.bounds.center != null) {
			circlePack.add( obj );
		}
	}
};

function onMouseDrag(event) {
	drawPies(event.point);
};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function drawPies(point) {
	if( raster != null ) {
		var col;
		var brightness = raster.getPixel(point).gray;
		var radius = map(brightness, 0.0,1.0, values.minSize,values.maxSize);
		var pieces = map(brightness, 0.0,1.0, values.minPieces,values.maxPieces);

		// draw ring to get colors
		var colors = new ColorRing(point, radius, pieces);

		// draw chart at location
		var circle = new ColorPieChart(point, radius, colors);
		if(values.bHole) {
			circle.appendTop( circle.addHole(values.holeRatio * radius, values.holeColor) );
		}
	
		circles.push( circle );
	}
};

// ------------------------------------------------------------------------
/**
 *	ColorPieChart Class
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 *
 */

var ColorPieChart = function(_position, _radius, _colors) {
	// ------------------------------------------------------------------------
	// Properties
	// ------------------------------------------------------------------------
	this.position = _position;
	this.radius = _radius;
	this.bounds = new Rectangle( this.position, new Size(this.radius, this.radius) );
	this.colors = _colors;
	


	// ------------------------------------------------------------------------
	// Methods
	// ------------------------------------------------------------------------
	this.draw = function() {
		this.path = new Group();

		// draw a pie piece per color
		var total = this.colorArraySum();
		var sta = 0;
		var prevAng = 0;

		for (var i=0; i<this.colors.length; i++) {
			var colGray = this.colors[i].convert('gray');

			var val = map( colGray.gray, 0.0,total, 0.0,2*Math.PI );
			var end = sta + val; 
			var mid = sta + (end/2);

			var p1 = new Point(this.position.x + Math.cos(sta) * this.radius, this.position.y + Math.sin(sta) * this.radius);
			var p2 = new Point(this.position.x + Math.cos(mid) * this.radius, this.position.y + Math.sin(mid) * this.radius);
			var p3 = new Point(this.position.x + Math.cos(end) * this.radius, this.position.y + Math.sin(end) * this.radius);

			var piece = new Path.Arc(p1, p2, p3);
			piece.add( new Segment(this.position.x, this.position.y) );
			piece.closePath();
			piece.rotate(prevAng, this.position);

			// var colorsDark = this.colors[i].darken(values.colorDkPct);
			// var gradient = new Gradient() { 
			// 	type: 'linear', 
			// 	stops: [new GradientStop( this.colors[i], 0), 
			// 			new GradientStop( colorsDark, 1)]
			// };
			// var origin			= this.position;
			// var destination		= p2;
			// var gradientColor	= new GradientColor(gradient, origin, destination);

			piece.fillColor = this.colors[i];
			piece.strokeColor = null;

			prevAng += val;

			// add piece to group
			this.path.appendTop(piece);
		}

		// this.path.appendTop( GradientOverlay(this.path, values.colorDkPct) );

		return this.path;
	};

	// ------------------------------------------------------------------------
	this.colorArraySum = function() {
		var total = 0;
		for(var i=0; i<this.colors.length; i++) {
			var colGray = this.colors[i].convert('gray');
			total += colGray.gray;
		}

		return total;
	};

	// ------------------------------------------------------------------------
	distanceToCenter = function() {
		var dx = this.position.x - activeDocument.activeArtboard.bounds.center.x;
		var dy = this.position.y - activeDocument.activeArtboard.bounds.center.y;
		
		return dx*dx + dy*dy;
	};

	// ------------------------------------------------------------------------
	sortDistanceToCenter = function(a, b) {
		var distA = distanceToCenter(a);
		var distB = distanceToCenter(b);
		if (distA < distB) return 1;
		else if (distA > distB) return -1;
		else return 0;
	};

	return this.draw();
};

Group.prototype.addHole = function(holeRadius, holeColor) {
	this.holeRadius = holeRadius;
	this.holeColor = holeColor || new GrayColor(0.0);

	this.hole = new Path.Circle( this.position, this.holeRadius );
	this.hole.fillColor = this.holeColor;

	return this.hole;
};



// ------------------------------------------------------------------------
/**
 *	ColorRing Class
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 *
 */
var ColorRing = function(_position, _radius, _num) {
	// ------------------------------------------------------------------------
	// Properties
	// ------------------------------------------------------------------------
	this.position = _position;
	this.radius = _radius;
	this.bounds = new Rectangle( this.position, new Size(this.radius, this.radius) );
	this.num = _num;

	this.colors = [];


	// ------------------------------------------------------------------------
	// Methods
	// ------------------------------------------------------------------------
	this.gather = function() {
		var angle = 0;
		for (var i=0; i<this.num; i++) {
			var ax = this.position.x + Math.cos(angle) * this.radius;
			var ay = this.position.y + Math.sin(angle) * this.radius;
			var col;

			try {
				col = raster.getPixel( parseInt(ax), parseInt(ay) );
			} 
			catch(err) {
				col = new RGBColor(1,1,1);
			}
			this.colors.push( col );

			// var path = new Path.Circle( new Point(ax,ay), 5 );
			// path.fillColor = col;
			
			angle += 2*Math.PI/this.num;
		}
		
		this.colors = this.colors.sort(this.sortByBrightness);
		return this.colors;
	};

	// ------------------------------------------------------------------------
	function sortByBrightness(a, b) {
		var brightA = a.gray;
		var brightB = b.gray;
		if (brightA < brightB) return 1;
		else if (brightA > brightB) return -1;
		else return 0;
	};

	return this.gather();
};




// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Animate(true, frameRate);
Draw();
