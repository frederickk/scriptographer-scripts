/**
 *	Stroke Draw Thickness
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

var weights = [];
var mouseX;// = [];
var offset = 0;
var diff;

var desc;
var descPos;




// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems(Path, { selected: true }); 

	for(var i=0; i < sel.length; i++) {
		var obj = sel[i];
		weights[i] = obj.strokeWidth;
	}

	print("------------------------------------------------------------------------");
	print("widths of selection captured");
	print("sort: " + sortMaxV(weights) );

	diff = sortMaxV(weights)[0] / sortMaxV(weights)[1];
	print("diff: " + diff);

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
};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function NumSort(a,b) { 
	return a-b;
}

function sortMaxV(v) { 
	var holder = new Array(); 
	holder = v.sort(NumSort); 

	var vMax = holder[holder.length-1];
	var vMin = holder[0];
	
	var sortedV = new Array(); 
	sortedV[0] = vMax;
	sortedV[1] = vMin;
	
	return sortedV;
};




// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	offset = event.point.x;

	descPos = new Point( 0,0 );
	desc = new PointText(descPos);
	desc.characterStyle.fontSize = 30;
};

function onMouseDrag(event) {
	mouseX = (event.point.x - offset) * 0.05;
	for(var i=0; i < sel.length; i++) {
		obj = sel[i];
		weights[i] = obj.strokeWidth;

		obj.strokeWidth = weights[i] + (diff * mouseX);
	}

	//show how much we're adding
	descPos.x = event.point.x;
	descPos.y = event.point.y + desc.characterStyle.fontSize;
	desc.point = descPos;
	desc.content = mouseX;
};

function onMouseUp(event) {
	desc.remove();
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Draw();
