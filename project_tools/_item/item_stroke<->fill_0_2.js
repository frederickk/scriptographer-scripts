/**
 *	Stroke <-> Fill 0.4.2
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 *	0.1
 *	- initial release
 *	
 *	0.2
 *	- included stroke+fill flip 
 *	
 *	0.3
 *	- added random capability
 *
 *	0.3.2
 *	- updated to 2.5 api
 *
 *	0.4.2
 *	- updated to 2.9 api
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
	RANDOM: false
};

// gui components
var components = {
	RANDOM: { 
		type: 'checkbox',
		label: 'random'
	},

	// ------------------------------------
	// Invocation
	// ------------------------------------
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
	// document properties
	sel = activeDocument.getItems({
		type: Item,
		selected: true
	});

	//print(sel.length);
	for( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];
		
		if( obj.hasChildren() ) {
			//grouped
			for( j in obj.children ) flip( obj.children[j] );
		} else {
			//singular
			flip( obj );
		}
	}

}


// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function random(minr, maxr) {
	return minr + Math.random() * (maxr - minr);
}

function flip(obj) {
	if(values.RANDOM) {
		rand = parseInt(Math.random()*3);
	} else {
		rand = 0;
	}

	if(rand == 0) {
		//stroked!
		if(obj.strokeColor != null && obj.fillColor == null) {
			var s_color = obj.strokeColor

			obj.fillColor = s_color;
			obj.strokeColor = null;

		//filled!
		} else if(obj.strokeColor == null && obj.fillColor != null) {
			var f_color = obj.fillColor

			obj.strokeColor = f_color;
			obj.fillColor = null;

		//stroked + filled!
		} else if(obj.fillColor != null && obj.strokeColor != null) {
			var s_color = obj.strokeColor
			var f_color = obj.fillColor

			obj.strokeColor = f_color;
			obj.fillColor = s_color;
		}
	}
	
}


// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
//Draw();


