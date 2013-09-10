/**
 *	Object Grid 0.0
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
//var sel;
var sel = activeDocument.getItems({
		types: [Group, Path],
		selected: true
});

// values
var values = {
	rows:			parseInt(Math.sqrt(sel.length)),
	cols:			parseInt(Math.sqrt(sel.length)),
	dist:			72,

	bCenter: 		true, 
	bCopy:			false,
	bKeepSelect:	true
};

// components
var components = {
	dist: {
		type: 'number',
		label: 'space between items (pt)'
	},
	cols: {
		type: 'number',
		label: 'items per column'
	},
	rows: {
		type: 'number',
		label: 'items per row'
	},


	generalRule: { 
		type: 'ruler',
		fullSize: true,
	},
	bCenter: {
		type: 'checkbox',
		label: 'use center point'
	},
	bCopy: {
		type: 'checkbox',
		label: 'copy items'
	},
	bKeepSelect: {
		type: 'checkbox',
		label: 'keep selected'
	}
};


// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// initialize the dialog box
	var dialog = new Dialog.prompt('Object Grid 0.0 ' + sel.length + ' items', components, values);
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	var coords = [];
	var group = new Group();

	var objWidth = 0;
	var objWidthAvg = 0;

	for( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];
		if(values.bCenter) coords[i] = obj.bounds.center;
		else coords[i] = new Point(obj.bounds.x, obj.bounds.y);
		objWidth += obj.bounds.width;
	}
	objWidthAvg = objWidth/sel.length;


	// organize objects into rows and cols
	var index = 0;
	for(var x=0; x<values.rows; x++) {
		for(var y=0; y<values.cols; y++) {
			if(index < sel.length) {
				var obj;
				var pt = new Point( x*(objWidthAvg + values.dist), y*(objWidthAvg + values.dist) );
				if(values.bCopy) obj = sel[index].clone();
				else obj = sel[index];

				obj.position = pt;
				group.appendTop( obj );
			}
			index++;

		}
	}

	group.position = new Point(activeDocument.bounds.width*0.5, activeDocument.bounds.height*0.5);
	group.selected = values.bKeepSelect;

};




// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Draw();
