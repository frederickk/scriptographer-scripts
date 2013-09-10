/**
 *	Stroke Round Values 0.0
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 *	
 *	An example of lerping points, sunrise, sunset
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

// script.coordinateSystem = 'top-down';
script.angleUnits = 'radians';

var sel;

// values
var values = {
	deci: 2
};

// components
var components = {
	deci: { 
		type: 'number',
		label: 'decimal places)'
	}
};


// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.selectedItems;

	var dialog = new Dialog.prompt('Stroke Value Rounding', components, values);

	for (var i=0; i < sel.length; i++) {
		var obj = sel[i];
		obj.strokeWidth = roundDecimal(obj.strokeWidth, values.deci);
	}

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
};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function roundDecimal(orig,deci) {
	var multi = Math.pow(10,deci);
	var num = Math.round(orig * multi)/multi;
	return num;
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Draw();




