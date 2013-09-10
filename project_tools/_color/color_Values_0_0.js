/**
 *	Color Values 0.0
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


// document properties
//var sel = activeDocument.selectedItems;
var sel;

// values
var values = {
	mode:	'RGB',
	numDec: 2,	
	
	bText: true,
	bVerbose: false
};

// gui components
var components = {
	mode: { 
		label: 'Color Mode',
		options: ['RGB', 'CMYK'],
	},

	numDec: {
		type: 'number',
		label: 'Decimal Precision',
		increment: 1 
	},

/*
	boolRule: { 
		type: 'ruler',
		fullSize: true
	},*/

	bText: {
		type: 'checkbox',
		label: 'Create Text'
	},

	bVerbose: {
		type: 'checkbox',
		label: 'Verbose'
	}
};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// initialize the dialog
	var dialog = Dialog.prompt('Color Values 0.0', components, values);


	// document properties
	sel = activeDocument.getItems({
		type: Item,
		selected: true
	});
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
		obj = sel[i];
		var colorFill = obj.fillColor;
		var colorStroke = obj.strokeColor;

		var c,m,y,k;
		var r,g,b;
		if(values.mode == 'CMYK') {
			if(colorFill != null) {
				//fill
				c = roundDecimal(colorFill.cyan, values.numDec);
				m = roundDecimal(colorFill.magenta, values.numDec);
				y = roundDecimal(colorFill.yellow, values.numDec);
				k = roundDecimal(colorFill.black, values.numDec)
			} else {
				//stroke
				c = roundDecimal(colorStroke.cyan, values.numDec);
				m = roundDecimal(colorStroke.magenta, values.numDec);
				y = roundDecimal(colorStroke.yellow, values.numDec);
				k = roundDecimal(colorStroke.black, values.numDec)
			}
			if(values.bVerbose) verbosePrint(i, c,m,y,k);
			if(values.bText) textLabel(obj, c,m,y,k);

		} else if(values.mode == 'RGB') {
			if(colorFill != null) {
				//fill
				r = roundDecimal(colorFill.red*255, values.numDec);
				g = roundDecimal(colorFill.green*255, values.numDec);
				b = roundDecimal(colorFill.blue*255, values.numDec);
			} else {
				//stroke
				r = roundDecimal(colorStroke.red*255, values.numDec);
				g = roundDecimal(colorStroke.green*255, values.numDec);
				b = roundDecimal(colorStroke.blue*255, values.numDec);
			}
			if(values.bVerbose) verbosePrint(i, r,g,b);
			if(values.bText) textLabel(obj, r,g,b);
		}

	}

}


// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function roundDecimal(orig,deci) {
	var multi = Math.pow(10,deci);
	return num = Math.round(orig * multi)/multi;
}


function textLabel(obj, v1,v2,v3,v4) {
	var modeArray = new Array('r','g','b','', 'c','m','y','k');
	var index;
	if(values.mode == 'RGB') index = 0;
	else index = 4;

	var ptText = new PointText( obj.bounds.center );
	ptText.content = modeArray[index++] + '\t' + v1 + '\r';
	ptText.content += modeArray[index++] + '\t' + v2 + '\r';
	ptText.content += modeArray[index++] + '\t' + v3 + '\r';
	if(v4 != null) ptText.content += modeArray[index++] + '\t' + v4;

	return ptText;
}

function verbosePrint(i, v1,v2,v3,v4) {
	print(values.mode);
	print( '[' + i + ']');
	print(v1);
	print(v2);
	print(v3);
	print(v4);
	print('---------------------------');
}


// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
Draw();