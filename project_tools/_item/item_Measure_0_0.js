/**
 *	Item Measure 0.0
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
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


// ------------------------------------------------------------------------
// document properties
// ------------------------------------------------------------------------
var sel;


// values
var values = {
	places:		2,
	unit:		'points'
};

// components
var components = {
	unit: {
		label: 'Measurement Unit',
		options: ['points', 'pixels', 'inches', 'milimeters', 'centimeters']
	}
};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	var dialog = new Dialog.prompt('Object Measure 0.0', components, values);
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	// selection
	sel = activeDocument.getItems(Path, {
		selected: true
	});


	for ( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];
		
		if(obj.hasChildren()) digger(obj);
		else Label(obj);
	}

};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function roundDecimal(orig, deci) {
	var multi = Math.pow(10,deci);
	return Math.round(orig * multi)/multi;
};

// ------------------------------------------------------------------------
function Label(obj) {
	var theGroup = new Group();

	var theLabel;
	theLabel = new PointText(obj.position);
	theLabel.paragraphStyle.justification = 'center';


	//color
	if (obj.fillColor != null) theLabel.characterStyle.fillColor = new CMYKColor(0, 0, 0, 0);
	else if (obj.fillColor == null && obj.strokeColor != null) theLabel.characterStyle.fillColor = obj.strokeColor;
	else theLabel.characterStyle.fillColor = new CMYKColor(0, 0, 0, 1);

	//content
	var theWidth, theHeight, theUnit;
	if (values.unit == 'centimeters') {
 		theWidth = roundDecimal( obj.bounds.width * 0.0352777778, values.places );
 		theHeight = roundDecimal( obj.bounds.height * 0.0352777778, values.places );
		theUnit = 'cm';
	}
	else if (values.unit == 'milimeters') {
 		theWidth = roundDecimal( obj.bounds.width * 0.352777778, values.places );
 		theHeight = roundDecimal( obj.bounds.height * 0.352777778, values.places );
		theUnit = 'mm';
	}
	else if (values.unit == 'inches') {
 		theWidth = roundDecimal( obj.bounds.width * 0.0138888889, values.places );
 		theHeight = roundDecimal( obj.bounds.height * 0.0138888889, values.places );
		theUnit = 'in';
	}
	else if (values.unit == 'pixels') {
 		theWidth = roundDecimal( obj.bounds.width, values.places );
 		theHeight = roundDecimal( obj.bounds.height, values.places );
		theUnit = 'px';
	}
	else {
 		theWidth = roundDecimal( obj.bounds.width, values.places );
 		theHeight = roundDecimal( obj.bounds.height, values.places );
		theUnit = 'pt';
	}

	theLabel.content = theWidth + ' x ' + theHeight + ' ' + theUnit;

	//grouping
	theGroup.appendTop(obj);
	theGroup.appendTop(theLabel);

};


// ------------------------------------------------------------------------
function digger(digObj) {
	for (var k = 0; k < digObj.children.length; k++) {
		Label(digObj.children[k]);
		// if(digObj.children[k].children.length > 1) {
		digger(digObj.children[k]);
		// }
	}
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Draw();