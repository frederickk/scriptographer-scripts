/**
 *	Line Fill 0.0
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

// script.coordinateSystem = 'bottom-up';
script.coordinateSystem = 'top-down';
script.angleUnits = 'radians';

// document properties
var sel;
var palette;

var fillStrokeColor = new GrayColor(0.8); // can't save Color object 
var fillFillColor = new GrayColor(0.0); // can't save Color object 

// values
var settingsFile = 'LineFill_0_0.values';
var values = {
	densityMax:			100,
	strokeWidth:		3,
	// strokeColor:			new GrayColor(1),
	
	bFillSelected:		true
};

// components
var components = {
	densityMax: {
		type: 'number',
		label: 'Maximum No. Lines',
		steppers: false
	},
	
	strokeRule: {
		type: 'ruler',
		fullSize: true,	
	},
	strokeWidth: {
		type: 'number',
		label: 'Lines Stroke Width',
		units: 'point',
		steppers: true
	},
	
	// strokeColor: {
	// 	type: 'color',
	// 	label: 'Lines Stroke Color'
	// },

	selRule: {
		type: 'ruler',
		fullSize: true,
	},
	bFillSelected: {
		type: 'checkbox',
		label: 'Fill Selected on Start'
	},
	fillSelectedButton: { 
		type: 'button', 
		value: 'Fill Selected',
		fullSize: true,
		onClick: function() {
			Draw();
		}
	},

	buttonRule: {
		type: 'ruler',
		fullSize: true,
	},
	saveButton: { 
		type: 'button', 
		value: 'Save Settings',
		fullSize: true,
		onClick: function() {
			saveSettings();
		}
	}

};


// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	loadSettings();

	palette = new Palette("Line Fill", components, values);

	print( values );

	saveSettings();
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
	sel = activeDocument.getItems({
		type: Path,
		selected: true
	});

	for( var i=0; i<sel.length; i++ ) {
		var selGroup = new Group();
		var obj = sel[i];
		if ( obj.hasChildren() ) {
			obj = getGroupObj(obj);
			
			if ( obj.hasChildren() ) {
				obj = getGroupObj(obj);
			}
		}
		
		var filled = new doFill(obj);
		selGroup.appendTop(filled);
	}
}



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event){
	var hitResult = activeDocument.hitTest(event.point, 'paths', 20);

	if(hitResult) {
		var obj = hitResult.item;

		if(hitResult && hitResult.segment) {
			var curve = hitResult.curve;
			
			var copy = new Path.Line( curve.point1, curve.point2 );
			copy.strokeColor = randomRGBColor();
			copy.strokeWidth = 20;
			copy.scale(1.5);
			
			doFill(obj, curve);
		}
	}

}



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
var LineFill = function(obj, curve, brightness) {
	// ------------------------------------
	// properties
	// ------------------------------------
	this.groupHolder = new Group();
	this.brightness = brightness;

	this.width = obj.bounds.width;
	this.height = obj.bounds.height;

	// points
	var pts = new Array(
		curve.point1,
		curve.point2,

		obj.bounds.point,
		new Point(obj.bounds.point.x + this.width, obj.bounds.point.y + this.height) // top left
	);
	var diff = new Point(
		Math.abs(pts[0].x - pts[1].x),
		Math.abs(pts[0].y - pts[1].y)
	);


	// ------------------------------------
	// draw lines
	// ------------------------------------
	var density = Math.round(values.densityMax * this.brightness );
	for(var j=0; j<density; j++) {
		var ratio = (j/density);
		var linePt1 = new Point();
		var linePt2 = new Point();

		// vertical top-bottom

		// half triangle (bottom left -> top left)
		// linePt1.x = curve.point1.x + (pts[2].x - curve.point1.x) * ratio;
		// linePt1.y = curve.point1.y + (pts[2].y - curve.point1.y) * ratio;
		// 	linePt2.x = curve.point2.x + (pts[2].x - curve.point2.x) * ratio;
		// 	linePt2.y = curve.point2.y + (pts[2].y - curve.point2.y) * ratio;

		// whole triangle (bottom left -> top right)
		linePt1.x = curve.point2.x + (pts[2].x - curve.point2.x) * ratio;
		linePt1.y = curve.point2.y + (pts[2].y - curve.point2.y) * ratio;

		linePt2.x = pts[3].x + (pts[2].x - curve.point2.x) * ratio;
		linePt2.y = (pts[3].y + (pts[2].y - curve.point2.y) * ratio) - diff.y;
	
		var path = new Path.Line( linePt1, linePt2 );
		path.strokeColor = fillStrokeColor;
		path.strokeWidth = values.strokeWidth;
		path.fillColor = null;
		path.scale(1.5);
	
		this.groupHolder.appendTop( path );
	}


	// ------------------------------------
	// mask
	// ------------------------------------
	// this.groupHolder.appendChild(obj)
	// this.groupHolder.clipped = true;
	// obj.clipMask = true;
	// obj.fillColor = new GrayColor(fillFillColor);


	// ------------------------------------
	// add to group
	// ------------------------------------
	return this.groupHolder;
}


// ------------------------------------------------------------------------
var doFill = function(obj, curve) {
	// get brightness
	var brightness = obj.fillColor.gray;
	var fillSegPath;

	print(obj.curves.length);
	for(var k in obj.curves) {
		// if(curve == null) {
			// no curve selected? just grab first curve for fill angle
			var rand = k; //parseInt( random(obj.curves.length) );
			curve = obj.curves[rand];

			fillSegPath = new Path.Line( curve.point1, curve.point2 );
			fillSegPath.strokeWidth = 20;
			fillSegPath.strokeColor = new RGBColor(0,1,1);
			fillSegPath.fillColor = null;
		// }

		print('fuck');
		// get angle
		fillSegPath = new Path.Line(curve.point1, curve.point2);
		var angle = getAngle(fillSegPath);

		var text = new PointText(curve.point1); 
		text.content = 'r: ' + angle;
		text.content += '\rd: ' + degrees( angle );

		// // var dist = curve.length;
		// var dist = new Size(
		// 	Math.abs( curve.point1.x - curve.point2.x ),
		// 	Math.abs( curve.point1.y - curve.point2.y )
		// ); 
		// var dist2 = (dist.width*dist.height);
		// if(dist2 == 0) dist2 = 1;
	
		fillSegPath.remove();
	
		// // weight brightness based on expanded size
		// brightness *= dist2/(obj.bounds.width*obj.bounds.height);
	
		var width = obj.bounds.width; // + dist.width;
		var height = obj.bounds.height; // + dist.height;
	
		// draw the lines
		var fillLines = LineFill(obj, curve, brightness);
		// fillLines.position = obj.position;

		fillLines.appendTop( text );

		// set mask for line fill
		// fillLines.appendChild(obj)
		// fillLines.clipped = true;
		// obj.clipMask = true;
		// obj.fillColor = new GrayColor(fillFillColor);
	
		obj.selected = false;
		fillLines.selected = true;
	}

	return fillLines;
}

// ------------------------------------------------------------------------
function getAngle(line) {
	var angle = Math.atan2(
		line.segments[0].point.y - line.segments[1].point.y,
		line.segments[0].point.x - line.segments[1].point.x
	);
	return angle;
}
// function getAngle(curve) {
// 	var angle = Math.atan2(
// 		curve.point1.y - curve.point2.y,
// 		curve.point1.x - curve.point2.x
// 	);
// 	return angle;
// }

// ------------------------------------------------------------------------
function getGroupObj(digObj) {
	var objArr = [];
	var obj;

	if (!digObj.hasChildren()) {
		return digObj;
	}
	else {
		for (var i in digObj.children) {
			return digObj.children[i];
			getGroupObj( digObj.children[i] );
		}
	}
}

// ------------------------------------------------------------------------
function loadSettings() {
	if(checkFile(settingsFile)) values = openFile(settingsFile);
}
function saveSettings() {
	saveFile(values, settingsFile);
}



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();

// set a timer that runs the Update(event) function every milisecond
// var timer = setInterval(Update, 1);

Draw();