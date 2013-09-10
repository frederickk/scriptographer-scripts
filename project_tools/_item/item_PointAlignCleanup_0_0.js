/**
 *	Point Align & Cleanup 0.0
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

//document properties
var sel;
var palette;

// values
var values = {
	bSegments: false
};

// gui components
var components = {
	bSegments: { 
		type: 'checkbox',
		label: 'Include Segments'
	}
}



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems({
		type: Path,
		selected: true
	});

	palette = new Dialog.prompt('Point Align & Cleanup 0.0', components, values);
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
	for( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];

		if(obj.strokeWidth == 0 || obj.strokeWidth == null) {
			obj.remove();
		} else {
			obj.bounds.topLeft.round();
			
			if(values.bSegments) {
				// go through segments and round point values
				for(var j=0; j<obj.segments.length; j++) {
					var seg = obj.segments[j];
					seg.point = seg.point.round();
					seg.handleIn = seg.handleIn.round();
					seg.handleOut = seg.handleOut.round();
				}
			}
		}

	}
}



// ------------------------------------------------------------------------
// Method
// ------------------------------------------------------------------------
// Point.prototype.roundDec = function(deci) {
// 	var multi = Math.pow(10,deci);
// 	var x = Math.round(this.x * multi)/multi;
// 	var y = Math.round(this.y * multi)/multi;
// 
// 	print('x: ' + x + ' y: ' + y);
// 	return new Point(x,y);
// }

function roundDecimal(orig, deci) {
	var multi = Math.pow(10,deci);
	return Math.round(orig * multi)/multi;
}



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
Draw();
