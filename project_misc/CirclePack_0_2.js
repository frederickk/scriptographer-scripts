/**
 *	Circle Pack 0.2
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 *	packs selected items into the center of the screen
 *	add items by clicking them with the scriptographer tool
 *
 */


// ------------------------------------------------------------------------
// libraries
// ------------------------------------------------------------------------
include('../libraries/frederickkScript/frederickkScript.js');
include('../libraries/frederickkScript/CirclePacker.js');



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

//script.coordinateSystem = 'bottom-up';
script.coordinateSystem = 'top-down';
script.angleUnits = 'radians';


// load frederickkScript
var f = frederickkScript;

// document properties
var sel;
var palette;

// framerate can be set via the 
// Animate() function below
var frameRate = 30;

// Oh... what to pack?
var packer;
var circles = [];


//values
var values = {
	bPause: false,

	iterations: 11
};

//components
var components = {
	pauseButton: {
		type: 'button',
		value: 'Pause',
		fullSize: true,
		onClick: function() {
			values.bPause = !values.bPause;

			if (values.bPause) this.value = 'Play';
			else this.value = 'Pause';
		}
	}
};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems({
		type: Item,
		selected: true
	});

	// check for compound paths
	// because handling these is a pain
	// push everything into the circles array
	for( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];

		// is this obj a TextItem
		if (obj.characterStyle != null) {
			obj = BreakText(obj);

			// add each item created to the circles group
			for( var j=0; j<obj.children.length; j++ ) {
				var child = obj.children[j];
				circles.push( child );
			}
		}
		// seems to be a normal Path
		else {
			// obj.toGroup();
			// circles.push(obj);
			circles.push( CompoundPathToGroup(obj) );
		}
	}

	// palette
	palette = new Palette('CirclePack 0.2', components, values);


};



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
	if (!values.bPause) {
		packer.update();
	}
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
};



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	var obj = event.item;

	// add individual group items
	if (Key.isDown('option')) {
		if (obj.characterStyle != null) {
			obj = BreakText(obj);
		}

		// groups
		if (obj.hasChildren()) {
			for (var i = 0; i < obj.children.length; i++) {
				var child = obj.children[i];
				// child.toGroup();
				// circles.push( child );
				circles.push( CompoundPathToGroup(obj) );
			}
		}
	}

	// // add item to pack
	// else {
	// 	if (obj != null || obj.bounds.center != null) {
	// 		obj.toGroup();
	// 		// circles.push( obj );
	// 		circles.push( CompoundPathToGroup(obj) );
	// 	}
	// }
};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function CompoundPathToGroup(cp) {
	if (cp.getType == 'Compound Path') {
		var gp = new Group().appendTop(cp);
		return gp;
	}
	else {
		return cp;
	}
};

// ------------------------------------------------------------------------
/*
 *
 *	specific UI that for managing text items
 *	if included with in the selection
 *
 */
var BreakTextValues = {
	breakBy: 'characters',
	outline: true
};

var BreakTextComponents = {
	breakBy: {
		options: ['words', 'characters']
	},
	outline: {
		type: 'checkbox',
		label: 'Create Outlines'
	}
};


function BreakText(textObj) {
	var dialog = new Dialog.prompt('', BreakTextComponents, BreakTextValues);

	var words = textObj.words;
	var group = new Group();

	for ( var j=0; j<words.length; j++ ) {
		var word = words[j];

		// words
		if (BreakTextValues.breakBy == 'words') {
			var pText = new PointText(textObj.position);
			pText.content = word.content;
			pText.characterStyle = textObj.characterStyle;
			pText.paragraphStyle = textObj.paragraphStyle;

			if (BreakTextValues.outline) {
				var path = pText.createOutline();
				pText.remove();
				group.appendTop(path);
			}
			else {
				group.appendTop(pText);
			}
		}

		// characters
		else {
			var pText;
			for (var k = 0; k < word.content.length; k++) {
				pText = new PointText(textObj.position);
				pText.content = word.content[k];
				pText.characterStyle = textObj.characterStyle;
				pText.paragraphStyle = textObj.paragraphStyle;

				if (BreakTextValues.outline) {
					var path = pText.createOutline();
					group.appendTop(path);
				}
				else {
					group.appendTop(pText);
				}
			}
			pText.remove();
		}

	}
	textObj.remove();

	return group;
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Animate(true, frameRate); // frameRate can be set in here
Draw();
