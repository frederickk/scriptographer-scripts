/**
 *	Random Rotate Multi-Angle 0.1
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

script.coordinateSystem = 'bottom-up';
script.angleUnits = 'degrees';

// document properties
var sel;
var degrees;

// values
var values = {
	deg: 0,

	bCenter: true,
	bGroup: false,
	bRandom: true,

	bSnape: true
};

// gui components
var components = {
	deg: {
		type: 'string',
		label: 'Rotation angle(s)',
	},
	degRule: { 
		type: 'ruler',
		label: 'Title',
		fullSize: true,
	},
	

	bCenter: {
		type: 'checkbox',
		label: 'Center'
	},
	bGroup: {
		type: 'checkbox',
		label: 'Each item in group'
	},
	bRandom: {
		type: 'checkbox',
		label: 'Random'
	},

	settingsRule: { 
		type: 'ruler',
		label: 'Title',
		fullSize: true,
	},

	bSnap: {
		type: 'checkbox',
		label: 'Snap to rotation angle'
	}

};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems({
		type: Item,
		selected: true
	});


	var dialog = new Dialog.prompt('Random Rotate 0.1', components, values);
};




// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	degrees = values.deg.split(',');

	for( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];

		if(values.bGroup) digger(obj);
		else rot(obj);
	}

};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function digger(item) {
	for(var k=0; k<item.children.length; k++) {
		rot(item.children[k]);
		digger(item.children[k]);
	}
}

// ------------------------------------------------------------------------
function rot(item) {
	var choice = parseInt(Math.random()*degrees.length); 

	var pivot;
	if(values.bCenter) pivot = item.bounds.center;
	else pivot = item.bounds;

	if(parseInt( Math.random()*2) == 0 && values.bRandom) item.rotate( degrees[choice], pivot );
	else item.rotate( degrees[choice], pivot );
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Draw();