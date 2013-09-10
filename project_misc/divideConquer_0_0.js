/**
*	Divide & Conquer 0.0
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
var groupHolder = new Group();
var sel;
var palette;
var layer = activeDocument.activeLayer;

var primary = new Array(
	new RGBColor( 0.95,0.25,0.23 ), // red
	new RGBColor( 0.97,0.92,0.19 ), // blue
	new RGBColor( 0.16,0.21,0.56 )  // yellow
);


// values
var values = {
	numSteps:		4,
	bColor:			false
};

//components
var components = {
	numSteps: {
		type: 'number',
		label: 'Number of Iterations',
		fractionDigits: 0,
	},
	
	bColor: {
		type: 'checkbox',
		label: 'Colorize'
	}
};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems({
		type: [Item, Path, TextItem, Raster],
		selected: true
	});

	palette = new Dialog.prompt('Fibonnaci Sequence', components, values);
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	
	var groupSel = new Group();
	groupSel.appendTop(sel[0]);

	var objA = groupSel;
	//var objB = objA.clone().expand('text');
	var objB = objA.clone();
	var scaleFactor;

	// first transformation
	objB.translate( new Point(objA.bounds.width,0) );
	//groupHolder.appendTop(objB);


	// begin repeat
	for(var i=0; i<values.numSteps; i++) {
		var objN = objB.clone();

		if(i%4 == 0) {
			scaleFactor = (objA.bounds.width + objB.bounds.width)/objN.bounds.width;
			objN.translate( new Point(0,objB.bounds.height) );
			objN.scale( scaleFactor, objN.bounds.bottomRight );
		}
		else if(i%4 == 1) {
			scaleFactor = (objA.bounds.height + objB.bounds.height)/objN.bounds.height;
			objN.translate( new Point(-objB.bounds.width,0) );
			objN.scale( scaleFactor, objN.bounds.topRight );
		}
		else if(i%4 == 2) {
			scaleFactor = (objA.bounds.width + objB.bounds.width)/objN.bounds.width;
			objN.translate( new Point(0,-objB.bounds.height) );
			objN.scale( scaleFactor, objN.bounds.topLeft );
		}
		else if(i%4 == 3) {
			scaleFactor = (objA.bounds.height + objB.bounds.height)/objN.bounds.height;
			objN.translate( new Point(objB.bounds.width,0) );
			objN.scale( scaleFactor, objN.bounds.bottomLeft );
		}

		if(values.bColorize) objN.fillColor = primary[i%3];
		//groupHolder.appendTop(objN);

		objA = objB;
		objB = objN;
	}


};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
/**
 *	http://www.scriptol.com/programming/fibonacci.php
 */
function fibo(n) {
	if (n < 2) return 1;
	return fibo(n-2) + fibo(n-1);
};


function fibonnaci(sel, step) {

};


/**
 *	division function taken from
 *	http://paperjs.org/examples/division-raster/
 */
function Split(event) {
	for (var i=0; i<layer.children.length; i++) {
		var child = layer.children[i];
		var bounds = child.bounds;

		if (bounds.contains(event.point)) {
			// If the mouse position intersects with the bounding
			// box of the path, we're going to split it into two paths:

			var size = bounds.size;
			// var isLandscape = size.width > size.height;
			// 
			// // If the path is in landscape orientation, we're going to
			// // split the path horizontally, otherwise vertically:
			// if (isLandscape) {
				size /= 2;
			// } else {
			// 	size /= 2;
			// }

			var topLeft = bounds.topLeft.floor();
			path = child.clone();
			path.bounds.size = size.ceil();
			path.moveBelow(child);

			var secondPath = path.clone();
			size = size.floor();
			// secondPath.position += isLandscape ? [size.width, 0] : [0, size.height];
			secondPath.position += [size.width, 0];
			secondPath.moveBelow(path);

			var thirdPath = path.clone();
			size = size.floor();
			thirdPath.position +=  [0, size.height];
			thirdPath.moveBelow(path);

			var fourthPath = path.clone();
			size = size.floor();
			fourthPath.position +=  [size.width, size.height];
			fourthPath.moveBelow(path);


			// Remove the path which was split:
			child.remove();

			// Avoid continuing looping through the rest of the items:
			return;
		}
	}	
};



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	Split(event);
};

function onMouseDrag(event) {
	// Each drag event, iterate through the children of group:
	Split(event);
};


// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Draw();


