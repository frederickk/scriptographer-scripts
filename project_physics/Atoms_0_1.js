/**
 *	Atoms 0.1
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
// libraries
// ------------------------------------------------------------------------
include('../libraries/frederickkScript/frederickkScript.js');



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

script.coordinateSystem = 'top-down';
script.angleUnits = 'radians';


// load frederickkScript
var f = frederickkScript;

// document properties
var sel;
var atoms = [];

// interface
var dialog;
var palette;
tool.distanceThreshold = 20;

//values
var values = {
	bPause:		true,

	bSelected:	true,
	bLimited:	false,
	atoms:		1,

	atomSize:	3
};

//components
var dialogComponents = {
	// ------------------------------------
	// selected objects
	// ------------------------------------
	bSelected: {
		type: 'checkbox',
		label: 'One atom per item',
		onChange: function(value) {
			dialogComponents.bLimited.value = !value;
			if(dialogComponents.bLimited.value) {
				dialogComponents.atoms.enabled = true;
			}
			else {
				dialogComponents.atoms.enabled = false;
			}
		}
	},


	visRule: {
		type: 'ruler',
		fullSize: true,
	},


	// ------------------------------------
	// limited
	// ------------------------------------
	bLimited: {
		type: 'checkbox',
		label: 'Limited number of atoms',
		onChange: function(value) {
			dialogComponents.bSelected.value = !value;
			if(dialogComponents.bLimited.value) {
				dialogComponents.atoms.enabled = true;
			}
			else {
				dialogComponents.atoms.enabled = false;
			}
		}
	},

	atoms: {
		type: 'number',
		label: 'Number of atoms',
		enabled: values.bLimited
	},


	// ------------------------------------
	// Invocation
	// ------------------------------------
	aRule: { 
		type: 'ruler',
		fullSize: true,
	},

	atomSize: {
		type: 'number',
		label: 'Number of atoms',
		steppers: true,
		units: 'point'
	},


};

var paletteComponents = {
	pauseButton: { 
		type: 'button', 
		value: 'Play',
		fullSize: true,
		onClick: function() {
			values.bPause = !values.bPause;

			if (values.bPause) {
				this.value = 'Play';
			}
			else {
				this.value = 'Pause';
			}
		}
	}

	
};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems({
		type: 		Path,
		selected: 	true
	});
	// deselect all items
	// for( var i=0; i<sel.length; i++ ) sel[i].selected = false;

	// initialize
	dialog = new Dialog.prompt('Atoms 0.1', dialogComponents, values);
	init();


	// palette
	palette = new Palette('Atoms 0.1', paletteComponents, values);
};



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {

	if(!values.bPause) {
		for( var i=0; i<atoms.length; i++ ) {
			var p = atoms[i];
			// console.log( p.direction );
			p.update();
		}

		// redraw!
		Draw();
	}

};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {

	for( var j=0; j<atoms.length; j++ ) {
		// iterate through the atoms
		var p = atoms[j];

		// check the document to see if
		// the atoms hit any items
		var hitResult = activeDocument.hitTest( p.path.position );

		if( hitResult && hitResult.item.name != 'Atom' ) {
			// the hit item
			var item = hitResult.item;

			// break the item where the
			// item hits
			item = item.split( hitResult );

			// based on the force of the atom
			// push the point out
			item.segments.last.point += p.direction; //new Point(25,0);

			// since an item was hit
			// give it a new color
			var col = randomSwatch(3);

			// the item was hit, so
			// let's wound it
			try {
				item.fillColor = new GradientColor( 
					gradient( p.path.fillColor, col, 'radial' ), 
					p.path.position, item.position
				);
			}
			catch(err) {
				item.fillColor = col;
			}

			// set atom with new color
			p.path.fillColor = col;
		}

	}


};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function init() {
	// clear out all items
	// just incase re-initialized
	for( var i=0; i<atoms.length; i++ ) {
		var p = atoms[i];
		p.remove();
	}
	atoms = [];

	// how man atoms do we make
	var num;
	if(values.bSelected) {
		num = sel.length;
	}
	else {
		num = values.atoms;
	}

	// add the specific number of atoms
	for(var i=0; i<num; i++) {
		var p = new Atom( 
			new Point( artboard.bounds.width/2,artboard.bounds.height/2 ),
			new Size( values.atomSize, values.atomSize ),
			randomSwatch()
		); 
		p.path.index = i;
		atoms.push( p );

		// console.log( i + ' --- ' + p.path.index );
	}
};

// ------------------------------------------------------------------------
function randomSwatch(swatchStart) {
	swatchStart = (swatchStart === undefined) ? 2 : swatchStart;
	var swatchOut;
	var swatchList = activeDocument.swatches;
	var index = parseInt( f.random(swatchStart, swatchList.length) );
	var swatchSel = swatchList[index];

	//check if swatch is valid
	if (swatchSel != null && swatchSel.color != null) { 
		swatchOut = swatchSel.color;
	}
	else {
		swatchOut = randomSwatch(swatchStart, swatchList);
	}

	return swatchOut;
};


function gradient(color1, color2, type) {
	var grad = new Gradient();
	grad.type = type;
	grad.stops = [ 
		new GradientStop(color1, 0),
		new GradientStop(color2, 1)
	];
	return grad;
};



// ------------------------------------------------------------------------
/**
 *
 *	Atom class (i.e. bouncing ball)
 *
 *	@param {Point} point
 *					position of the projectile
 *	@param {Size} size
 *					size of the projectile
 *	@param {Color} color
 *					color of the projectile
 *
 */
var Atom = function( point, size, color ) {
	// ------------------------------------
	// Properties
	// ------------------------------------
	// private
	var mass = (size === undefined) ? new Size(3,3) : size;
	var speed = new Point(
		mass.width*f.random(-3.3, 3.3),
		mass.height*f.random(-3.3, 3.3)
	);
	color = (color === undefined) ? new RGBColor( 0.0, 1.0, 0.7 ) : color;

	// public
	var path;
	this.direction = point;



	// ------------------------------------
	// Methods
	// ------------------------------------
	// private
	function init() {
		// why is new Path.Circle not working?
		// path = new Path.Oval( point, size );
		path = new Path.Oval( new Rectangle(point, size) );

		path.fillColor = color;
		path.strokeColor = color;
		path.strokeWidth = 1;
		path.name = 'Atom';
	};
	init();

	// ------------------------------------
	// public
	function update() {
		// get previous position
		pposition = path.position.clone();

		// check horizontal boundaries
		var x = path.position.x+(mass.width/2);
		if (x > activeDocument.activeArtboard.bounds.width-(mass.width/2) || x < 0+(mass.width/2) ) {
			speed.x *= -1;
			// speed.x *= f.random(1.6,0.6);
		}
		// Check vertical boundaries
		var y = path.position.y+(mass.height/2);
		if (y > activeDocument.activeArtboard.bounds.height-(mass.height/2) || y < 0+(mass.height/2) ) {
			speed.y *= -1;
			// speed.y *= f.random(1.6,0.6);
		}

		// update speed
		path.position += speed;

		// get direction of projectile
		this.direction = new Point(
			pposition.x-path.position.x,
			pposition.y-path.position.y
		);

	};



	// ------------------------------------
	// gets
	// ------------------------------------
	// Reveal public pointers to
	// private functions and properties
	return {
		update: update,
		path: path,
		// direction: direction,
	};

};



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	// while one giveth
	if (event.modifiers.shift) {
		var p = new Atom( 
			event.point,
			new Size( values.atomSize, values.atomSize ),
			randomSwatch()
		); 
		atoms.push( p );
	}
};

function onMouseDrag(event) {
	// the other taketh
	// if (!event.modifiers.shift) {
	// 	var hitResult = activeDocument.hitTest(event.point, tool.distanceThreshold);
	// 	if( hitResult && hitResult.item.name == 'Atom' ) {
	// 		var p = hitResult.item;
	// 		atoms.slice( p.index, 1 );
	// 		p.remove();
	// 	}
	// }
};

function onMouseUp(event) {
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Animate(true);
// Draw();


