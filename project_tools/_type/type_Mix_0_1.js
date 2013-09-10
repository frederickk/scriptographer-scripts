/**
*	Type Mix 0.1
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

//script.coordinateSystem = 'top-down';
script.coordinateSystem = 'bottom-up';
script.angleUnits = 'radians';


// document properties
var sel;


//values
var values = {
	num:					1,
	min:					60,
	max:					60,
	bRandomCap:				false,
	bCurrentTypeface:		true,
	bRandomTypeface:		true,

	bReplace: 				false, 
};

//components
var components = {
	num: {
		type: 'number',
		label: 'Iterations'
	},
	min: {
		type: 'number',
		label: 'Size Min.'
	},
	max: {
		type: 'number',
		label: 'Size Max.'
	},

	attributeRule: { 
		type: 'ruler',
		fullSize: true,
	},

	bRandomCap: {
		type: 'checkbox',
		label: 'Random capitalization'
	},
	bCurrentTypeface: {
		type: 'checkbox',
		label: 'Same typeface, random style'
	},
	bRandomTypeface: {
		type: 'checkbox',
		label: 'Random typeface & style'
	},
	bReplace: {
		type: 'checkbox',
		label: 'Replace selection (only 1 iteration)'
	}

};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	var dialog = new Dialog.prompt("Type Mix 0.1", components, values);
}


// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
}


// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Draw() {
	var sel = activeDocument.getItems({
		type: TextItem,
		selected: true
	});

	if( values.bReplace ) values.num = 1;

	for(var z=0; z!=values.num; z++) {
		var group = new Group();
		for(var i=0; i!=sel.length; i++) {
			obj = sel[i];

			// replace selected type
			var ptText;
			if( values.bReplace ) {
				ptText = obj;
			} else {
				ptText = new PointText( new Point(obj.bounds.x,obj.bounds.y - (50*z) - 50) );
			}

			// generate random face and style
			var type;
			if(values.bCurrentTypeface) {
				type = obj.characterStyle.font.family.name;
			} else {
				type = randomTypeFamily();
			}
			var style = randomTypeStyle(type);

			for(t=0; t != obj.content.length; t++) {
				ptText.content += obj.content[t];
			}

			for(t=0; t != ptText.range.characters.length; t++) {
				if( values.bRandomCap && randomInt(0,2) == 0) {
					ptText.range.characters[t].changeCase('upper');
				}

				if( values.bRandomTypeface && !values.bCurrentTypeface) {
					ptText.range.characters[t].characterStyle = bRandomTypeface();
				} else if( values.bRandomTypeface && values.bCurrentTypeface) {
					style = randomTypeStyle(type);
					ptText.range.characters[t].characterStyle.font = fonts[ type ][ style ];
				} else {
					ptText.range.characters[t].characterStyle.font = fonts[ type ][ style ];
				}

				// random size
				if( !values.bReplace ) ptText.range.characters[t].characterStyle.fontSize = randomInt(values.min,values.max);
			}
			
			// add to group
			group.appendTop( ptText );

		}
	}

}



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function random(minr, maxr) {
	return minr + Math.random() * (maxr - minr);
}
function randomInt(minr, maxr) {
	return parseInt( random(minr,maxr) );
}


// ------------------------------------------------------------------------
function bRandomTypeface() {
	var typefaceChoice = new CharacterStyle();
	var typefaceName = randomTypeFamily();
	var styleName = randomTypeStyle(typefaceName);
	typefaceChoice.font = fonts[typefaceName][styleName];
	return typefaceChoice;
}

function randomTypeFamily() {
	var typfaceNum = parseInt(Math.random()*fonts.length);
	var typefaceName = new String(fonts[typfaceNum].name);
	return typefaceName;
}

function randomTypeStyle(typefaceName) {
	var styleNum;
	var styleName;

	//for(var j=0; j != fonts[typefaceName].length; j++) {
		styleNum = parseInt(Math.random()*fonts[typefaceName].length);
		styleName = new String(fonts[typefaceName][styleNum].name);
	//}
	
	return styleName;
}



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
Draw();

