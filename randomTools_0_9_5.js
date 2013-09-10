/**
 *	randomTools 0.9.5
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 *	this script uses stuff borrowed from keegan's "rando-color.js"
 *	as well as from some other things i had written in processing
 *	
 *	0.8.2
 *	- updated to scriptographer 2.5 api let me know via email if there are any bugs
 *	
 *	0.9.2
 *	- an update of 0.8.2 that works with scriptographer version 2.7.037
 *	- adds feature to detect colormode, sliders will be CMYK or RGB respectively (not perfect, but functional)
 *	
 *	0.9.3
 *	- updated interface to scriptographer 2.9.070 api
 *	- added ability to customize range of random colors
 *	- optimized code in response to comments posted (see NOTES) http://scriptographer.org/scripts/general-scripts/randomtools/comments
 *	- global/spot/pantone/etc. swatches cannot be used, until this is addressed by the scriptographer team i suggest this work around http://scriptographer.org/forum/help/accessing-global-color-swatches/
 *	- correct english/german language mix in code
 *
 *	0.9.4
 *	- added random stacking
 *
 *	0.9.5
 *	- updated random delete as proposed/implemented by Jolin Masson http://jolinmasson.com/
 *
 */


// ------------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------------



// document properties
var sel;
var swatchList;

var palette;

// values
var values = {
	colorModeBounds:	100,  //default assumes activeDocument is cmyk 
	
	// ------------------------------------
	// delete
	// ------------------------------------
	b_delete:			false,
	val_deleteAmt:		2,

	// ------------------------------------
	// stroke
	// ------------------------------------
	b_stroke:			false,
	val_minStroke:		0.25,
	val_maxStroke:		48.0,

	// ------------------------------------
	// color
	// ------------------------------------
	b_swatchAll:		false,
	val_swatchStart:	2,

	b_color:			false,
	b_colorFills:		true,
	b_colorStroke:		false,
	b_colorSwatches:	true,
	val_color_c_min:	0,
	val_color_c_max:	0,
	val_color_m:		0,
	val_color_y:		0,
	val_color_k:		0,

	// ------------------------------------
	// trans properties
	// ------------------------------------
	b_trans:			false,
	val_minTrans:		25,
	val_maxTrans:		100,

	// ------------------------------------
	// stack properties
	// ------------------------------------
	b_stack:			false

};


// gui components
var components = {
	// ------------------------------------
	// delete
	// ------------------------------------
	b_delete: { 
		type: 'checkbox',
		label: 'Delete',
		onChange: function(value) {
			components.val_deleteAmt.enabled = value;
		}
	},

	val_deleteDisp: { 
		type: 'text',
		label: 'Percentage of\nSelected Items',
		units: 'percent',
		steppers: false,
		fullSize: true,
		enabled: false,
		value: values.val_deleteAmt
	},

	val_deleteAmt: { 
		type: 'slider',
		fullSize: true,
		range: [2, 100],
		enabled: false,
		onChange: function(value) { 
            components.val_deleteDisp.value = value;
        }
	},

	deleteRule: { 
		type: 'ruler',
		fullSize: true,
	},


	// ------------------------------------
	// stroke
	// ------------------------------------
	b_stroke: { 
		type: 'checkbox',
		label: 'Stroke',
		onChange: function(value) {
			components.val_minStroke.enabled = value;
			components.val_maxStroke.enabled = value;
		}
	},

	val_minStroke: {
		type: 'number',
		label: 'min',
		units: 'point',
		steppers: true,
		fractionDigits: 2,
		increment: 0.05,
		//value: values.val_minStroke,
		enabled: false
	},

	val_maxStroke: {
		type: 'number',
		label: 'max',
		units: 'point',
		steppers: true,
		fractionDigits: 2,
		increment: 0.05,
		//value: values.val_maxStroke,
		enabled: false
	},

	strokeRule: { 
		type: 'ruler',
		fullSize: true,
	},


	// ------------------------------------
	// color
	// ------------------------------------
	// flyout menu
	swatchAll: {
		type: 'menu-entry',
		value: 'Excluding First 2 Swatches',
		onSelect: function() {
			values.b_swatchAll = !values.b_swatchAll;
		}
	},

	b_color: { 
		type: 'checkbox',
		label: 'Color',
		onChange: function(value) {
			components.b_colorFills.enabled = value;
			components.b_colorStroke.enabled = value;
			components.b_colorSwatches.enabled = value;

			components.val_color_c_min.enabled = value;
			components.val_color_c_max.enabled = value;
			components.val_color_m_min.enabled = value;
			components.val_color_m_max.enabled = value;
			components.val_color_y_min.enabled = value;
			components.val_color_y_max.enabled = value;
			components.val_color_k_min.enabled = value;
			components.val_color_k_max.enabled = value;
		}
	},
	
	//fill
	b_colorFills: { 
		type: 'checkbox',
		label: 'Fills',
		enabled: false,
		onChange: function(value) {
		}
	},

	//stroke
	b_colorStroke: { 
		type: 'checkbox',
		label: 'Strokes',
		enabled: false,
		onChange: function(value) {
		}
	},

	//stroke
	b_colorSwatches: { 
		type: 'checkbox',
		label: 'Document\nSwatches',
		enabled: false,
		onChange: function(value) {
		}
	},

	//color sliders
	//color c
	val_color_c_min: { 
		type: 'slider',
		//label: 'Min. C',
		fullSize: true,
		//value: values.val_color_c_min,
		//range: [0, values.colorModeBounds],
		steppers: true,
		enabled: false
	},

	val_color_c_max: { 
		type: 'slider',
		//label: 'Max. C',
		fullSize: true,
		//value: values.val_color_c_max,
		//range: [0, values.colorModeBounds],
		steppers: true,
		enabled: false
	},


	//color m
	val_color_m_min: { 
		type: 'slider',
		//label: 'Min. M',
		fullSize: true,
		//value: values.val_color_m_min,
		//range: [0, values.colorModeBounds],
		steppers: true,
		enabled: false
	},

	val_color_m_max: { 
		type: 'slider',
		//label: 'Max. M',
		fullSize: true,
		//value: values.val_color_m_max,
		//range: [0, values.colorModeBounds],
		steppers: true,
		enabled: false
	},

	//color y
	val_color_y_min: { 
		type: 'slider',
		//label: 'Min. Y',
		fullSize: true,
		//value: values.val_color_y_min,
		//range: [0, values.colorModeBounds],
		steppers: true,
		enabled: false
	},

	val_color_y_max: { 
		type: 'slider',
		//label: 'Max. Y',
		fullSize: true,
		//value: values.val_color_y_max,
		//range: [0, values.colorModeBounds],
		steppers: true,
		enabled: false
	},

	//color k
	val_color_k_min: { 
		type: 'slider',
		//label: 'Min. K',
		fullSize: true,
		//value: values.val_color_k_min,
		//range: [0, values.colorModeBounds],
		steppers: true,
		enabled: false
	},

	val_color_k_max: { 
		type: 'slider',
		//label: 'Max. K',
		fullSize: true,
		//value: values.val_color_k_max,
		//range: [0, values.colorModeBounds],
		steppers: true,
		enabled: false
	},

	colorRule: { 
		type: 'ruler',
		fullSize: true,
	},


	// ------------------------------------
	// transparency
	// ------------------------------------
	b_trans: { 
		type: 'checkbox',
		label: 'Transparency',
		onChange: function(value) {
			components.val_minTrans.enabled = value;
			components.val_maxTrans.enabled = value;
		}
	},

	val_minTrans: {
		type: 'number',
		label: 'min',
		units: 'percent',
		steppers: true,
		//value: values.val_minTrans,
		enabled: false
	},

	val_maxTrans: {
		type: 'number',
		label: 'max',
		units: 'percent',
		steppers: true,
		//value: values.val_maxTrans,
		enabled: false
	},

	transRule: { 
		type: 'ruler',
		fullSize: true,
	},


	// ------------------------------------
	// transparency
	// ------------------------------------
	b_stack: { 
		type: 'checkbox',
		label: 'Stack',
	},

	stackRule: { 
		type: 'ruler',
		fullSize: true,
	},


	// ------------------------------------
	// Invocation
	// ------------------------------------
	submit: { 
		type: 'button', 
		value: 'Apply',
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
	// color space CMYK/RGB
	ColorSpaceSetup();

	// initialize the palette window
	palette = new Palette('Random Tools 0.9.5', components, values);
};



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	// document properties
	sel = activeDocument.getItems( { type: Item, selected: true } );
	swatchList = activeDocument.swatches;

	// check color space
	ColorSpaceSetup();

	// first two swatches are typically black and white should we exclude those?
	//print( values.b_swatchAll );
	if ( values.b_swatchAll ) {
		values.val_swatchStart = 0;
		components.swatchAll.value = 'Using All Swatches';
	}
	else {
		values.val_swatchStart = 2;
		components.swatchAll.value = 'Excluding First 2 Swatches';
	}

	// adjust delete range values based on selection number
	// components.val_deleteAmt.range = [0, sel.length-1];

	// loop through selected items
	for ( i in sel ) {
		var object = sel[i];

		if( object.isValid() ) {
			// ------------------------------------
			// delete
			// ------------------------------------
			if ( values.b_delete ) {
				// rand = parseInt( Math.random()*values.val_deleteAmt );
				// if (rand == 0) object.remove();
				if (Math.random() <= values.val_deleteAmt/100) object.remove();
			}


			// ------------------------------------
			// stroke
			// ------------------------------------
			if ( values.b_stroke ) {
				if (object.style.stroke.width != null) object.style.stroke.width = random( values.val_minStroke,values.val_maxStroke );
			}


			// ------------------------------------
			// color
			// ------------------------------------
			//print( values.b_color );
			if( values.b_color ) {
				var color;
			
				if( values.b_colorSwatches ) {
					color = RandomSwatch( values.val_swatchStart, swatchList );
				}
				else {
					var c = random( values.val_color_c_min, values.val_color_c_max )/values.colorModeBounds;
					var m = random( values.val_color_m_min, values.val_color_m_max )/values.colorModeBounds;
					var y = random( values.val_color_y_min, values.val_color_y_max )/values.colorModeBounds;
					var k = random( values.val_color_k_min, values.val_color_k_max )/values.colorModeBounds;

					//check color space and create appropriate color
					if ( ColorSpace() == 'cmyk') {
						color = new CMYKColor(c, m, y, k);
					}
					else if ( ColorSpace() == 'rgb') {
						color = new RGBColor(c, m, y);
					}
				}

				//print( values.b_colorFills );
				if ( values.b_colorFills ) {
					if (RandomSwatch( values.val_swatchStart, swatchList ) != null) object.style.fill.color = color;
					//print(object.style.fill.color);
				}
				//print( values.b_colorStroke );
				if ( values.b_colorStroke ) {
					if (RandomSwatch( values.val_swatchStart, swatchList ) != null) object.style.stroke.color = color;
					//print(object.style.stroke.color);
				}
			}
		

			// ------------------------------------
			// transparency
			// ------------------------------------
			if ( values.b_trans ) {
				object.opacity = random( values.val_minTrans, values.val_maxTrans )/100;
			}


			// ------------------------------------
			// stack
			// ------------------------------------
			if ( values.b_stack ) {
				var objStack = sel[ parseInt( random(0,sel.length) ) ];
				objStack.moveAbove( object ); 
			}

		} //end isValid()

	}
}; //end Draw()




// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function random(minr, maxr) {
	return minr + Math.random() * (maxr - minr);
};

// ------------------------------------------------------------------------
function RandomSwatch(_swatchStart, _swatchList) {
	var swatchOut;
	var index = parseInt( random(_swatchStart, swatchList.length) );
	var swatchSel = swatchList[index];

	/*
	// DEBUG
	print( '------------------------------------' );
	print(_swatchStart + ':' + swatchList.length + '\tindex\t' + index);
	print( index + '\tswatchSel:\t' + swatchSel );
 	print( index + '\tswatchSel.color.type:\t' + swatchSel.color.type );
 	print( index + '\tswatchSel.color:\t' + swatchSel.color );
 	*/

	if (swatchSel != null && swatchSel.color != null) { 
		//check if swatch is valid
		swatchOut = swatchSel.color;
	}
	else {
		//recursively search until we find a viable swatch
		swatchOut = RandomSwatch(_swatchStart, swatchList);
	}

	return swatchOut;
};

// ------------------------------------------------------------------------
function ColorSpace() {
	return activeDocument.swatches[0].color.type;
};

function ColorSpaceSetup() {
	//determine color space and adjust slider labels
	if ( ColorSpace() == 'cmyk' ) {
		values.colorModeBounds = 100;

		components.val_color_c_min.label = 'Min. C';
		components.val_color_c_max.label = 'Max. C';
		components.val_color_m_min.label = 'Min. M';
		components.val_color_m_max.label = 'Max. M';
		components.val_color_y_min.label = 'Min. Y';
		components.val_color_y_max.label = 'Max. Y';
		components.val_color_k_min.label = 'Min. K';
		components.val_color_k_max.label = 'Max. K';

		if( values.b_color ) {
			components.val_color_k_min.enabled = true;
			components.val_color_k_max.enabled = true;
		}
	}
	else if ( ColorSpace() == 'rgb' ) {
		values.colorModeBounds = 255;

		components.val_color_c_min.label = 'Min. R';
		components.val_color_c_max.label = 'Max. R';
		components.val_color_m_min.label = 'Min. G';
		components.val_color_m_max.label = 'Max. G';
		components.val_color_y_min.label = 'Min. B';
		components.val_color_y_max.label = 'Max. B';
		components.val_color_k_min.label = '-';
		components.val_color_k_max.label = '-';

		if( values.b_color ) {
			components.val_color_k_min.enabled = false;
			components.val_color_k_max.enabled = false;
		}
	}

	//adjust ranges of color sliders
	components.val_color_c_min.range = [0, values.colorModeBounds];
	components.val_color_c_max.range = [0, values.colorModeBounds];
	components.val_color_m_min.range = [0, values.colorModeBounds];
	components.val_color_m_max.range = [0, values.colorModeBounds];
	components.val_color_y_min.range = [0, values.colorModeBounds];
	components.val_color_y_max.range = [0, values.colorModeBounds];
	components.val_color_k_min.range = [0, values.colorModeBounds];
	components.val_color_k_max.range = [0, values.colorModeBounds];

};

// ------------------------------------------------------------------------
function digger(digObj) {
	for(var k=0; k<digObj.children.length; k++) {
		//rot(digObj.children[k]);
		digger(digObj.children[k]);
	}
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
// Draw();


