/**
 *	Type Holder Convert 0.0
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

script.coordinateSystem = 'bottom-up';
script.angleUnits = 'radians';

// document properties
var sel;

//values
var values = {
	// ------------------------------------
	// replace
	// ------------------------------------
	bAreaText:			false,
	areaWidth:			210,
	areaHeight:			297,

	bPointText:			true,
	bRemove:			true
};

var components = {
	// ------------------------------------
	// area text
	// ------------------------------------
	bAreaText: {
		type: 'checkbox',
		label: 'Area Text',
		onChange: function(value) {
			components.bPointText.value = !value;
			if(components.bAreaText.value) {
				components.areaWidth.enabled = true;
				components.areaHeight.enabled = true;
			}
		}
	},

	areaWidth: {
		type: 'number',
		label: 'width',
		enabled: values.bAreaText
	},
	areaHeight: {
		type: 'number',
		label: 'height',
		enabled: values.bAreaText
	},


	areaRule: {
		type: 'ruler',
		fullSize: true,
	},


	// ------------------------------------
	// point text
	// ------------------------------------
	bPointText: {
		type: 'checkbox',
		label: 'Point Text',
		onChange: function(value) {
			components.bAreaText.value = !value;
			if(components.bPointText.value) {
				components.areaWidth.enabled = false;
				components.areaHeight.enabled = false;
			}
		}
	},

	pointRule: {
		type: 'ruler',
		fullSize: true,
	},


	// ------------------------------------
	// general
	// ------------------------------------
	bRemove: {
		type: 'checkbox',
		label: 'Delete Selection',
	}

};


// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems({
		type: TextItem,
		selected: true
	});
	if( sel[0] instanceof PointText || sel[0] instanceof PathText ) {
		bAreaText = true;
		bPointText = false;
		components.bPointText.onChange(false);
		components.bAreaText.onChange(true);
	}
	else {
		bAreaText = false;
		bPointText = true;
		components.bPointText.onChange(true);
		components.bAreaText.onChange(false);
	}
	
	var palette = new Dialog.prompt('Text Holder Convert 0.0', components, values);
};


// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	for( var i=0; i<sel.length; i++ ) {
		object = sel[i];

		var theText;
		var placePt;
		if(values.bAreaText) {
			placePt = new Point(object.bounds.x, object.bounds.y - values.areaHeight);
			theText = new AreaText( new Rectangle(placePt, new Size(values.areaWidth,values.areaHeight) ) );
		}
		else if(values.bPointText) {
			placePt = new Point(object.bounds.point);
			theText = new PointText(placePt);
		}
		theText.content = object.content;
		theText.characterStyle = object.characterStyle;
		theText.paragraphStyle = object.paragraphStyle;
		
		if(values.bRemove) object.remove();
	}

};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function get_type(thing){
    if(thing === null)return "[object Null]";
    return Object.prototype.toString.call(thing);
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Draw();
