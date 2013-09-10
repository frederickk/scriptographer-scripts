/**
 *	Average
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

//script.coordinateSystem = 'bottom-up';
script.coordinateSystem = 'top-down';
script.angleUnits = 'radians';

// document properties
var sel;

// values
var values = {
	bAvgHoriz:	true,	
	bAvgVert:	false,

	increment:	3,
	bRound:		false,
	bSnap:		false
};

// components
var components = {
	bAvgVert: {
		type: 'checkbox',
		label: 'Vertical',
		onChange: function(value) {
			if(value) components.bAvgHoriz.value = false;
		}
	},
	bAvgHoriz: {
		type: 'checkbox',
		label: 'Horizontal',
		onChange: function(value) {
			if(value) components.bAvgVert.value = false;
		}
	},

	/*
	AvgRule: {
		type: 'ruler',
		fullSize: true,
	},

	increment: {
		type: 'number',
		label: 'Increment to snap objects to',
	},
	bRound: {
		type: 'checkbox',
		label: 'Round coordinates to whole numbers',
	}
	*/

};

// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	var palette = new Dialog.prompt('Average Points', components, values);

	sel = activeDocument.getItems({
		type: Path,
		selected: true
	});
	print('number of items selected:', sel.length)
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	
	for( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];
		var x,y;
		var dir;

		if(values.bAvgHoriz) dir = false;
		else dir = true;
		average(obj, dir)
	}
};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
/**
 *	snap function from:
 *	http://stackoverflow.com/questions/4507784/snap-to-grid-functionality-using-javascript
 */
function snap(value, gridSize, roundFunction) {
    if (roundFunction === undefined) roundFunction = Math.round;
    return gridSize * roundFunction(value / gridSize);
};

function roundDecimal(orig, deci) {
	var multi = Math.pow(10,deci);
	return Math.round(orig * multi)/multi;
};

function norm(val,start,stop) {
	return (val - start) / (stop - start);
};

function average(obj, dir) {
	var AvgX = 0;
	var AvgY = 0;
	for(j in obj.segments) {
		var seg = obj.segments[j];
		
		AvgX += seg.point.x;
		AvgY += seg.point.y;
	}

	AvgX /= obj.segments.length;
	AvgY /= obj.segments.length; 
	
	for(j in obj.segments) {
		var seg = obj.segments[j];
		if(dir) {
			// vertical
			seg.point.x = AvgX;
		} else if(!dir) {
			// horizontal
			seg.point.y = AvgY;
		}
	}
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Draw();
