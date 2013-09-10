/**
 *	concentricForms 0.0
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


// values
var values = {
	formCir:		true,
	formRect:		false,
	formSel:		false,

	stepsNum:		10,
	stepsDist:		1, //default is 1pt
	stepsAngle:		360, //default is 1pt

	sizeW:			50,
	sizeH:			50
};

// gui components
var components = {
	// ------------------------------------
	// forms
	// ------------------------------------
	formCir: { 
		type: 'checkbox',
		label: 'Circle',
		onChange: function(value) {
			components.formRect.value = false;
			components.formSel.value = false;
		}
	},
	formRect: { 
		type: 'checkbox',
		label: 'Rectangle',
		onChange: function(value) {
			components.formCir.value = false;
			components.formSel.value = false;
		}
	},
	formSel: { 
		type: 'checkbox',
		label: 'Selection',
		onChange: function(value) {
			components.formCir.value = false;
			components.formRect.value = false;
		}
	},

	formRule: { 
		type: 			'ruler',
		fullSize: 		true,
	},

	// ------------------------------------
	// steps
	// ------------------------------------
	stepsNum: {
		type: 'number',
		label: 'Number of Steps'
		//steppers: true,
	},
	stepsDist: {
		type: 'number',
		label: 'Distance Between Steps'
		//steppers: true,
	},
	stepsAngle: {
		type: 'number',
		label: 'Rotation Angle'
		//steppers: true,
	},

	// ------------------------------------
	// sizes
	// ------------------------------------
	sizeW: {
		type: 'number',
		label: 'Width'
		//steppers: true,
	},
	sizeH: {
		type: 'number',
		label: 'Height'
		//steppers: true,
	},


	// ------------------------------------
	// Invocation
	// ------------------------------------
	applyRule: { 
		type: 			'ruler',
		fullSize: 		true,
	},

	submit: { 
		type: 'button', 
		value: 'Go Go Go',
		fullSize: true,
		onClick: function() {
			Draw();
		}
	}
};

// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// initialize the palette
	var palette = new Palette('Concentric Form 0.0', components, values);
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
	for(var i=0; i<values.stepsNum; i++) {
		var path;
		var sz = new Size(values.sizeW - (i*values.stepsDist), values.sizeH - (i*values.stepsDist));
		
		//adjust point to center
		var pt = new Point(0 - sz.width/2, 0 - sz.height/2);

		
		if(values.formCir) {
			var rect = new Rectangle(pt, sz);
			path = new Path.Oval(rect);
		
		} else if(values.formRect) {
			path = new Path.Rectangle(pt, sz);

		} else if(values.formSel) {
			path = GetSelForm().clone();

		} else {
			print('No Form');
		}

		var ang = lerp(0,360, norm(i,0,values.stepsNum) );
		print('ang', ang);
		// path.rotate( radians(ang) );
		path.rotate( radians(ang/values.stepsNum) );
		

	}

} //end Draw()



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function GetSelForm() {
	// document properties
	sel = activeDocument.getItems( { type: Item, selected: true } );

	//will get to this laters
	print('gather points from selection');
	
	return sel[0];
}

// ------------------------------------------------------------------------
function norm(val,start,stop) { return (val - start) / (stop - start); }
function lerp(start, stop, amt) { return start + (stop-start) * amt; }
function degrees(val) { return val * (180/Math.PI); }
function radians(val) { return val * (Math.PI/180); }



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
/*
 * no need to edit, these function give scriptographer a processing like feel
 */
Setup();
Update(event);
// Draw();

