/**
 *	Stroke Scale 0.2.2
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
 

script.coordinateSystem = 'top-down';
script.angleUnits = 'radians';

//document properties
var sel;


// values
var values = {
	scale:		100
};

// gui components
var components = {
	scale: { 
		type: 'number',
		label: 'Scale',
		units: 'percent',
		steppers: true,
	}
};


// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	var dialog = new Dialog.prompt('Scale Stroke 0.0', components, values);

	sel = activeDocument.getItems(Item, { 
		selected: true
	}); 
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
	for ( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];

		// if( obj.hasChildren() ) {
		// 	recursive(obj);
		// }
		// else {
			scaleStroke(obj, values.scale);
		// }

	}
};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function scaleStroke(obj, val) {
	if( obj.strokeWidth == undefined ) {
		obj.remove();
	}
	else {
		obj.strokeColor = obj.strokeColor;
		obj.strokeWidth *= (val/100);
	}
};

function recursive(digObj) {
	for(var k=0; k<digObj.children.length; k++) {
		scaleStroke(digObj, values.scale);
		
		//if(digObj.children[k].children.length > 1) {
			recursive(digObj.children[k]);
		//}
	}
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Draw();
