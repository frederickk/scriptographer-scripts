/**
 *	Object Grid Clone 0.0
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
script.angleUnits = 'radians';


// document properties
var sel = activeDocument.getItems({
		types: [Group, Path],
		selected: true
});
var obj = sel[0];

// values
var values = {
	rows:			parseInt(Math.sqrt(sel.length)),
	cols:			parseInt(Math.sqrt(sel.length)),
	dist:			(obj.bounds.width + obj.bounds.height)/2,

	bKeepSelect:	true
};

// components
var components = {
	dist: {
		type: 'number',
		label: 'space between items (pt)'
	},
	rows: {
		type: 'number',
		label: 'Column height (pt)'
	},
	cols: {
		type: 'number',
		label: 'Row height (pt)'
	},


	generalRule: { 
		type: 'ruler',
		fullSize: true,
	},
	bKeepSelect: {
		type: 'checkbox',
		label: 'keep selected'
	}
}


// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// initialize the dialog box
	var dialog = new Dialog.prompt('Object Grid Clone 0.0 ' + sel.length + ' items', components, values);
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
	var group = new Group();

	// organize objects into rows and cols
	var index = 0;
	var rows = values.rows/obj.bounds.height;
	var cols = values.cols/obj.bounds.width;
	for(var x=0; x<rows; x++) {
		for(var y=0; y<cols; y++) {
			var objClone = obj.clone();
			objClone.position = new Point(x*values.dist, y*values.dist);
			group.appendTop( objClone );
		}
	}

	group.bounds.point = obj.bounds.point;
	group.selected = values.bKeepSelect;
	obj.remove();
}


// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function random(minr, maxr) {
	return minr + Math.random() * (maxr - minr);
}
function map(value, istart, istop, ostart, ostop) {
	return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
Draw();
