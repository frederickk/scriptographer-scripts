/**
 *	Shape Convert
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 */


// ------------------------------------------------------------------------
// Libraries
// ------------------------------------------------------------------------
include('../libraries/frederickkScript/frederickkScript.js');



// ------------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------------


// load frederickkScript
var f = frederickkScript;

var convert = f.FConversions;

// document properties
var sel;
var palette;
var shapeArray = new Array(4);
var shapeCustom;


// default unit of measure
var unit = 'millimeter';
var valDef = 6*convert.mmToPt;



// values
var values = {
	// ------------------------------------
	// Shapes
	// ------------------------------------
	bSquare:			false,
	bTriangle:			false,
	bCircle:			true,
	bCross:				false,
	bCustom:			false,


	// ------------------------------------
	// Settings
	// ------------------------------------
	res:				20,
	bRotate:			false,
	bScale:				false,
	bColor:				true,
	colorDkPct:			0.3,


	// ------------------------------------
	// Options
	// ------------------------------------
	globalScalar:		100.0,
	globalRotation:		0.0,
	bEach:				false,
	
	crossWeight:		20*0.618,
	bCrossFit:			true,
	crossCap:			'round',

	customOrder:		'in order',

	// ------------------------------------
	// Rasterize
	// ------------------------------------
	rasterValid:		false,
};



// gui components
var components = {
	// ------------------------------------
	// shapes
	// ------------------------------------
	//console.log('∎☓✚■□▵△▲◦●○✕');
	shapesRule: { 
		type:		'ruler',
		label:		'Shapes',
		fullSize:	true,
	},


	// | |
	bSquare: {
		type:		'checkbox',
		label:		'Square',
	},


	// O
	bCircle: {
		type:		'checkbox',
		label:		'Circle',
	},


	// /\
	bTriangle: {
		type:		'checkbox',
		label:		'Triangle',
	},


	// X
	crossRule: { 
		type:		'ruler',
		fullSize:	true,
	},
	bCross: {
		type:		'checkbox',
		label:		'Cross',
		onChange: function(value) {
			components.crossWeight.enabled = value;
			components.bCrossFit.enabled = value;
			components.crossCap.enabled = value;
		}
	},

	crossWeight: {
		type:		'number',
		label:		'Cross Weight',
		units:		'point',
		steppers:	true,
		increment:	1.0,
		enabled:	false
	},
	bCrossFit: {
		type:		'checkbox',
		label:		'Cross Weight\nCompensate',
		enabled:	false
	},
	crossCap: { 
		type:		'list',
		label:		'Cross Cap',
		options:	[ 'butt', 'round', 'square' ],
		enabled:	false
	},


	// ~
	customRule: { 
		type:		'ruler',
		fullSize:	true,
	},
	bCustom: {
		type:		'checkbox',
		label:		'Custom',
	},

	customOrder: {
		type:		'list',
		label:		'Iterate through\ncustom shape items',
		options:	[ 'in order', 'randomly' ],
		enabled:	false
	},
	bCustomColor: {
		type:		'checkbox',
		label:		'Cross Weight\nCompensate',
		enabled:	false
	},



	// ------------------------------------
	// Settings
	// ------------------------------------
	sepRule: { 
		type:		'ruler',
		fullSize:	true,
	},

	settingsRule: { 
		type:		'ruler',
		label:		'Settings',
		fullSize:	true,
	},

	res: {
		type:		'number',
		label:		'Resolution',
		units:		'point',
		steppers:	true,
		increment:	1,
		enabled:	true
	},

	bRotate: {
		type:		'checkbox',
		label:		'Rotate',
		fullSize:	true
	},

	bScale: {
		type:		'checkbox',
		label:		'Scale',
		fullSize:	true
	},

	bColor: {
		type:		'checkbox',
		label:		'Color',
		fullSize:	true
	},



	// ------------------------------------
	// options
	// ------------------------------------
	optionsRule: { 
		type:		'ruler',
		label:		'Options',
		fullSize:	true,
	},

	globalRotate: {
		type:		'number',
		label:		'Global Rotation',
		units:		'degree',
		steppers:		true,
		increment:		1.0,
		enabled:		true
	},
	globalScalar: {
		type:		'number',
		label:		'Global Scalar',
		units:		'percent',
		steppers:		true,
		increment:		1.0,
		enabled:		true
	},

	bEach: {
		type:		'checkbox',
		label:		'Apply to each\nelement seperately',
	},




	// ------------------------------------
	// Invocation
	// ------------------------------------
	applyRule: { 
		type:		'ruler',
		fullSize:	true,
	},

	submit: { 
		type:		'button', 
		value:		'Generate',
		fullSize:	true,
		onClick: function() {
			Draw();
		}
	}

};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	setShapeArray();

	RasterSelection();

	// initialize the palette window
	palette = new Palette('Shape Converter', components, values);
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
	setShapeArray();


	var size = new Size(values.res, values.res);
	var groupTemp = new Group();
	var index = 0;
	
	for(var y=values.res; y<raster.height; y+=values.res) {
		for(var x=values.res; x<raster.width; x+=values.res) {
			var pixelRGB		= raster.getPixel( new Point(x,y) );
			var pixelRGBDark	= pixelRGB.darken(values.colorDkPct);
			var pixelGray		= pixelRGB.gray;
			
			
			// random
			var rand = parseInt( Math.random()*5 );
			if(shapeArray[rand] == 0) {
				while(shapeArray[rand] == 0) {
					rand = parseInt( Math.random()*5 );
				}
			}


			// shapes
			var form;
			var cwidth,cheight;
			if(values.bSquare && rand == 0) {
				form = new Path.Rectangle(new Point(0,0), size);
			}

			else if(values.bTriangle && rand == 1) {
				form = new Path.RegularPolygon(new Point(0,0), 3, (size.height/2)*1.33);
			}

			else if(values.bCircle && rand == 2) {
				form = new Path.Circle(0,0, size.width/2);
			}

			else if(values.bCross && rand == 3) {
				if(values.bCrossFit) {
					cwidth = (size.width/2) - values.crossWeight;
					cheight = (size.height/2) - values.crossWeight;
				}
				else {
					cwidth = size.width/2;
					cheight = size.height/2;
				}
				form = Cross(new Point(0,0), new Size(cwidth,cheight));
			}

			else if(values.bCustom && rand == 4) {
				if(shapeCustom.hasChildren()) {
					if(values.customOrder == 'in order') form = shapeCustom.children[index%shapeCustom.children.length].clone();
					else form = shapeCustom.children[ parseInt( Math.random()*shapeCustom.children.length ) ].clone();
					index++;
				}
				else {
					form = shapeCustom.clone();
				}

				var ratio = new Size( size.width/form.bounds.width, size.height/form.bounds.height );
				if(form.bounds.height > form.bounds.width) {
					form.scale(ratio.height, form.position);
				}
				else {
					form.scale(ratio.width, form.position);
				}
			}

			form.position = new Point(x,y);
			form.fillColor = null;
			form.strokeColor = null;


			// scale
			//console.log( (values.globalScalar/100) );
			form.scale( (values.globalScalar/100), form.position );
			if(values.bScale) {
				form.scale( norm(pixelGray,0.0,1.0), form.position );
			}


			// rotation
			form.rotate( radians(values.globalRotate), form.position );
			if(values.bRotate) {
				form.rotate( radians(norm(pixelGray,0.0,1.0)*360), form.position );
			}


			// color
			if(values.bCross && rand == 3) {
				form.children[0].strokeWidth = values.crossWeight;
				form.children[1].strokeWidth = values.crossWeight;
			}

			if(values.bColor) {
				if(values.bCross && rand == 3) {
					form.children[0].strokeColor = pixelRGB;
					form.children[1].strokeColor = pixelRGBDark;
				}
				else {
					// form.fillColor = gradientColor;
					form.fillColor = pixelRGB;
				}
			}
			else {
				if(values.bCross && rand == 3) {
					form.children[0].strokeColor = new RGBColor(0,0,0);
					form.children[1].strokeColor = new RGBColor(0,0,0);
				}
				else {
					form.fillColor = new RGBColor(0,0,0);
				}
			}

			if(values.bCross && rand == 3) {
				form.children[0].strokeCap = values.crossCap;
				form.children[1].strokeCap = values.crossCap;
			}


			// gradient overlay
			// if(!values.bCross) {
			// 				var groupForm = new Group();
			// 				groupForm.appendTop(form);
			// 				groupForm.appendTop(GradientOverlay(form,values.colorDkPct));
			// 			
			// 				var mask = form.clone();
			// 				groupForm.appendTop(mask);
			// 				groupForm.clipped = true;
			// 				mask.clipMask = true;
			// 			
			// 				groupTemp.appendTop(groupForm);
			// 			} else {
				groupTemp.appendTop(form);
			// }

		}
	}
	groupTemp.translate( raster.bounds.point );

};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function setShapeArray() {
	shapeArray[0] = boolToInt( values.bSquare );
	shapeArray[1] = boolToInt( values.bTriangle );
	shapeArray[2] = boolToInt( values.bCircle );
	shapeArray[3] = boolToInt( values.bCross) ;
	shapeArray[4] = boolToInt( values.bCustom );
};



// ------------------------------------------------------------------------
/*
 *	cross
 */
function Cross(point, size) {
	var crossGroup = new Group();
	line1 = new Path.Line(point.x + size.width, point.y - size.height, point.x - size.width, point.y + size.height);
	line2 = new Path.Line(point.x + size.width, point.y + size.height, point.x - size.width, point.y - size.height);
	
	crossGroup.appendTop(line1);
	crossGroup.appendTop(line2);
	crossGroup.fillColor = null;
	
	return crossGroup;
};


// ------------------------------------------------------------------------
/*
 *	gradient overlay
 *
 *	bootleg hack until i figure out the error:
 *	"cannot set gradient stop"
 *	has to do with the input color?
 */
function GradientOverlay(obj, pct) {
	var gradient = new Gradient() {
		type: 'linear',
		stops: [
			new GradientStop(new GrayColor(0.0), 0),
			new GradientStop(new GrayColor(pct), 1)]
	};
	var origin			= new Point(obj.position.x, obj.position.y);
	var destination		= new Point(obj.position.x, obj.position.y);
	var gradientColor	= new GradientColor(gradient, origin, destination);

	var overlay = new Path.Rectangle( new Point(obj.bounds.x,obj.bounds.y), obj.bounds.size );
	overlay.fillColor = null;
	overlay.strokeColor = null;
	overlay.fillColor = gradientColor;
	overlay.blendMode = 'multiply';

	return overlay;
};




// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Animate(false);
//Draw();

