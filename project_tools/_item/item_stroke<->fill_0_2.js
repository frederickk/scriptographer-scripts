/**
 *	Stroke <-> Fill 0.5.1
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
var sel;

// values
var values = {
	bRandom: false
};

// gui components
var components = {
	bRandom: { 
		type: 'checkbox',
		label: 'random'
	},

	submit: { 
		type: 'button', 
		value: 'Apply',
		onClick: function() {
			Draw();
		}
	}
};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// initialize the palette window
	var palette = new Palette('Stroke <-> Fill 0.4.2', components, values);

	sel = activeDocument.getItems({
		type: Item,
		selected: true
	});
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	var rand = 0;

	for( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];
		
		rand = (values.bRandom) 
			? parseInt( Math.random()*2 )
			: 0;

		//grouped
		if( obj.hasChildren() ) {
			for( var j=0; j<obj.children.length; j++ ) {
				rand = (values.bRandom) 
					? parseInt( Math.random()*2 )
					: 0;
				if (rand == 0) swapStrokeFill( obj.children[j] );
			}
		}
		//singular
		else {
			if (rand == 0) swapStrokeFill( obj );
		}

	}
};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
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



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
// Update(event);
// Draw();


