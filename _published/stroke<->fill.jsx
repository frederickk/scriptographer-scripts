/**
 *	Stroke <-> Fill
 *	Adobe Illustrator
 *	ExtendScript
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 *
 */


var sel = app.activeDocument.selection;


for( var i=0; i<sel.length; i++ ) {
	var obj = sel[i];

	// grouped
	if( obj.pathItems != undefined ) {
		for( var j=0; j<obj.pathItems.length; j++ ) {
			swapStrokeFill( obj.pathItems[j] );
		}
	}
	// singular
	else {
		swapStrokeFill( obj );
	}
}


function swapStrokeFill(obj) {
	var tempStrokeColor = obj.strokeColor
	var tempFillColor = obj.fillColor

	if(obj.strokeColor != null && obj.fillColor == null) {
		obj.fillColor = tempStrokeColor;
		obj.strokeColor = null;
	}
	else if(obj.strokeColor == null && obj.fillColor != null) {
		obj.strokeColor = tempFillColor;
		obj.fillColor = null;
	}
	else if(obj.fillColor != null && obj.strokeColor != null) {
		obj.strokeColor = tempFillColor;
		obj.fillColor = tempStrokeColor;
	}
};