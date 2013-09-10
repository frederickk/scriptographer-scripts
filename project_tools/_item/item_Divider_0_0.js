/**
*	Divider
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


// values
var values = {
};

//components
var components = {
};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
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
}



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function divide(obj) {
	/**
	 *	division function taken from
	 *	http://paperjs.org/examples/division-raster/
	 */

	var bounds = obj.bounds;
	var size = bounds.size;
	size /= 2;
	var topLeft = bounds.topLeft.floor();

	path = obj.clone();
	// path.bounds.size = size.ceil();
	path.bounds.size = size.floor();
	path.moveBelow(obj);

	var secondPath = path.clone();
	size = size.floor();
	secondPath.position += [size.width, 0];
	secondPath.moveBelow(path);

	var thirdPath = path.clone();
	size = size.floor();
	thirdPath.position += [0, size.height];
	thirdPath.moveBelow(path);

	var fourthPath = path.clone();
	size = size.floor();
	fourthPath.position += [size.width, size.height];
	fourthPath.moveBelow(path);

	// Remove the path which was split:
	obj.remove();
}


// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	for (var i=0; i<layer.children.length; i++) {
		var child = layer.children[i];
		var bounds = child.bounds;

		if (bounds.contains(event.point)) {
			divide(child);
			return;
		}
	}
}

function onMouseDrag(event) {
	for (var i=0; i<layer.children.length; i++) {
		var child = layer.children[i];
		var bounds = child.bounds;

		if (bounds.contains(event.point)) {
			divide(child);
			return;
		}
	}
}


// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
Draw();


