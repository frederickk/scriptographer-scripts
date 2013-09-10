/**
 *	Item Rotate 0.0
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

script.coordinateSystem = 'bottom-up';
// script.coordinateSystem = 'top-down';
script.angleUnits = 'radians';


// load frederickkScript
var f = frederickkScript;
var fio = f.FIO;

// document properties
var sel;

//values
var settingsFile = 'item_rotate_0_0.values';
var values = {
	angle:		90,
	copy:		false
};

//components
var components = {
	angle: {
		type: 'number',
		label: 'Angle',
		units: 'degree',
		steppers: false
	},

	copy: {
		type: 'checkbox',
		label: 'Copy'
	}
}


// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	loadSettings();

	sel = activeDocument.getItems({
		type: Item,
		selected: true
	});

	var dialog = new Dialog.prompt("Item Rotate", components, values);
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
	for( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];

		if(obj.segments.length > 2) {
			var alert = new Dialog.alert('This script works best for single line paths');
		}

		var pts = [];
		for(var j in obj.segments) {
			pts.push( obj.segments[j].point );
		}
		
		var angle = 0.0;
		for(var k=1; k<pts.length; k++) {
			// angle = f.radians(values.angle) - Math.atan2(pts[k].y - pts[k-1].y, pts[k].x - pts[k-1].x);
			angle += f.radians(values.angle) - Math.atan2(pts[k].y - pts[k-1].y, pts[k].x - pts[k-1].x);
		}
		var avg = pts.length/2;
		angle /= avg;
	
		print('Angle Degrees\t', f.degrees(angle) );
		// print('radians', angle );
		//31.69 deg

		if(values.copy) {
			var copy = obj.clone().rotate(angle);
			obj.selected = false;
		}
		else {
			obj.rotate(angle);
		}

	}
};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function loadSettings() {
	if(fio.checkFile(settingsFile)) values = fio.openFile(settingsFile);
};
function saveSettings() {
	fio.saveFile(values, settingsFile);
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Animate(false);
Draw();

