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

//script.coordinateSystem = 'bottom-up';
script.coordinateSystem = 'top-down';
script.angleUnits = 'radians';

// load frederickkScript
var f = frederickkScript;
var fio = f.FIO;

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

	saveSettings();
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
};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
var LineFill = function(width, height, brightness, angle) {
	/**
	 *	properties
	 */
	this.groupHolder = new Group();
	this.strokeColor = fillStrokeColor;
	this.brightness = brightness;
	this.angle = angle;
	var angleDeg = Math.abs(f.degrees(angle));

	this.width = width;
	this.height = height;



	/**
	 *	methods
	 */
	var linePt1 = new Point(0, 0);
	var linePt2;

	var bHoriz = true;
	// move horizontally
	if( angleDeg > 45 && angleDeg > 135 ) { 
		bHoriz = true;
		this.angle -= radians(90);
	}
	else if( angleDeg == 90) { 
		this.angle += radians(90);
		bHoriz = true;
	}
	// move vertically
	else {
		bHoriz = false;
	}

	print('this.height', this.height);
	if( bHoriz ) linePt2 = new Point(0, this.height);
	else linePt2 = new Point(this.width, 0);

	var density = Math.round(values.densityMax * this.brightness);
	var inc = Math.abs(this.width/density);
	
	if(inc < 1) inc = 1;
	for(var i=0; i<density; i++) {
		print('linePt1', linePt1);
		print('linePt2', linePt2);
		
		if(bHoriz) {
			linePt1.x += inc;
			linePt2.x += inc;
		}
		else {
			linePt1.y += inc;
			linePt2.y += inc;
		}

		var path = new Path.Line(linePt1, linePt2);
		path.strokeColor = fillStrokeColor;
		path.strokeWidth = values.strokeWidth;
		path.fillColor = null;
		path.rotate( this.angle );
		path.scale(1.5);

		this.groupHolder.appendTop(path);
	}

	/**
	 *	return
	 */
	return this.groupHolder;
};

// ------------------------------------------------------------------------
var doFill = function(obj, curve) {
	// get brightness
	var brightness = obj.fillColor.gray;
	var fillSegPath;

	if(curve == null) {
		// no curve selected? just grab first curve for fill angle
		var rand = 0; //parseInt( random(obj.curves.length) );
		curve = obj.curves[rand];
		fillSegPath = new Path.Line( curve.point1, curve.point2 );
	}

	// get angle
	fillSegPath = new Path.Line(curve.point1, curve.point2);
	var angle = getAngle(fillSegPath);
	// var dist = curve.length;
	var dist = new Size(
		Math.abs( curve.point1.x - curve.point2.x ),
		Math.abs( curve.point1.y - curve.point2.y )
	); 
	var dist2 = (dist.width*dist.height);
	if(dist2 == 0) dist2 = 1;

	fillSegPath.remove();

	// weight brightness based on expanded size
	brightness *= dist2/(obj.bounds.width*obj.bounds.height);
	
	var width = obj.bounds.width + dist.width;
	var height = obj.bounds.height + dist.height;
	
	// draw the lines
	var fillLines = LineFill(width,height, brightness, angle);
	fillLines.position = obj.position;

	// set mask for line fill
	fillLines.appendChild(obj)
	fillLines.clipped = true;
	obj.clipMask = true;
	obj.fillColor = new GrayColor(fillFillColor);
	
	return fillLines;
};

// ------------------------------------------------------------------------
function getAngle(line) {
	var angle = Math.atan2(
		line.segments[0].point.y - line.segments[1].point.y,
		line.segments[0].point.x - line.segments[1].point.x
	);
	return angle;
};

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
};

// ------------------------------------------------------------------------
function loadSettings() {
	if(fio.checkFile(settingsFile)) values = fio.openFile(settingsFile);
};
function saveSettings() {
	fio.saveFile(values, settingsFile);
};



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event){
	var hitResult = activeDocument.hitTest(event.point, 'paths', 20);

	if(hitResult) {
		var obj = hitResult.item;

		if(hitResult && hitResult.segment) {
			var cur = hitResult.curve;
			doFill(obj, cur);
		}
	}

};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Animate(false);
Draw();