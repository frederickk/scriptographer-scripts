/**
 *	SnapTo
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
	bItem:		true,
	increment:	3,
	bRound:		false
};

// components
var components = {
	bItem: {
		type: 'checkbox',
		label: 'Entire Item/Each points of Item',
	},

	increment: {
		type: 'number',
		label: 'Increment to snap objects to',
		units: 'point'
	},
	bRound: {
		type: 'checkbox',
		label: 'Round coordinates to whole numbers',
	}

};

// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	var palette = new Dialog.prompt('Snap To', components, values);

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

		if(values.bItem) {
			//Item
			if(values.bRound) {
				x = snap( roundDecimal(obj.position.x,0), values.increment);
				y = snap( roundDecimal(obj.position.y,0), values.increment);
			} else {
				x = snap( obj.position.x, values.increment);
				y = snap( obj.position.y, values.increment);
			}
			obj.position = new Point(x,y);

		} else {
			//Each Point
			for(j in obj.segments) {
				var seg = obj.segments[j];

				if(values.bRound) {
					x = snap( roundDecimal(seg.point.x,0), values.increment);
					y = snap( roundDecimal(seg.point.y,0), values.increment);
				} else {
					x = snap( seg.point.x, values.increment);
					y = snap( seg.point.y, values.increment);
				}
			
				seg.point.x = x;
				seg.point.y = y;
			}
		}

	}

	//check if objects are on top of each other
	/*
	for(var j in sel) {
		var extra = sel[j];
		var hit = obj.intersects(extra);
		if(hit) extra.remove();
	}
	*/

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



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Draw();


