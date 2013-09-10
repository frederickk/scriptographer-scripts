/**
 *	Object Shrink 0.0
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

//values
var values = {
	width:		0,
	height:		0,

	bCenter:	true
};

//components
var components = {
	title: {
		type: 'text',
		label: 'Subtract from selection\n(+ grow/-shrink)',
	},

	width: {
		type: 'number',
		label: 'Width',
		units: 'point',
	},
	height: {
		type: 'number',
		label: 'Height',
		units: 'point',
	},


	centerRule: {
		type: 'ruler',
		fullSize: true,
	},


	bCenter: {
		type: 'checkbox',
		label: 'Center',
	}


};


// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// initialize the dialog box
	var dialog = new Dialog.prompt('Object Shrink 0.0', components, values);
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
	sel = activeDocument.getItems(Path, { selected: true });

	for ( var i=0; i<sel.length; i++ ) {
		obj = sel[i];
		resize(obj);
	}
}


// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function roundDecimal(orig, deci) {
	var multi = Math.pow(10,deci);
	return Math.round(orig * multi)/multi;
}

function resize(obj) {
	print(obj.bounds.height);

	var pos = obj.position;
	var width = obj.bounds.width + values.width;
	var height = obj.bounds.height + values.height;


	obj.bounds.width = width;
	obj.bounds.height = height;

	if(values.bCenter) obj.position = pos;

	digger(obj);
}

// ------------------------------------------------------------------------
function digger(digObj) {
	for(var k=0; k<digObj.children.length; k++) {
		resize(digObj.children[k]);

		//if(digObj.children[k].children.length > 1) {
			digger(digObj.children[k]);
		//}
	}
}


// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
Draw();
