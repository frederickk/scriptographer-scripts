/**
 *	pointsPushPullTool 0.0
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


var sel;
var marker;

// values
var values = {
	thresh:		500,
	av:			0.5
};

// gui components
var components = {
	thresh: {
		type: 'number',
		label: 'distance threshold',
		increment: 5,
		steppers: true
	},
	av: {
		type: 'number',
		label: 'acceleration',
		increment: 0.5,
		steppers: true
	}
}


// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// initialize the palette window
	var dialog = new Palette('points push/pull 0.0', components, values);
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
function random(minr, maxr) {
	return minr + Math.random() * (maxr - minr);
}

function comparePoints(pt1,pt2) {
	if( dist(pt1,pt2) >= 0 && dist(pt1,pt2) <= values.thresh ) {
		return true;
	} else {
		return false;
	}
}

function dist(pt1, pt2) {
	var dx = pt1.x - pt2.x;
	var dy = pt1.y - pt2.y;
	return Math.sqrt(dx*dx + dy*dy);
}

// The infamous keepdist routine. Essentially relaxation.
// http://processing.org/discourse/yabb2/YaBB.pl?num=1270733327
function keepDist(pt1, pt2, dist) {
	var dx = pt2.x - pt1.x;
	var dy = pt2.y - pt1.y;
	var L = sqrt(dx*dx + dy*dy);
	L = 0.5*(1-(D/L));
	var lx = L*dx;
	var ly = L*dy;

	pt1.x += lx;
	pt1.y += ly;
	pt2.x -= lx;
	pt2.y -= ly;
} 

// ------------------------------------------------------------------------
function movePoints(event, obj) {
	//print(obj);
	
	for( j in obj.segments ) {
		var segPt = obj.segments[j].point;

		var a = Math.atan2( segPt.y - event.point.y, segPt.x - event.point.x );
		var d = dist(event.point, segPt);
		var m = values.thresh - d;
	
		//if( comparePoints(event.point, segPt) ) {
		if( d < values.thresh ) {
			segPt.x += m * Math.cos(a) * values.av;
			segPt.y += m * Math.sin(a) * values.av;
		}
	}
}

// ------------------------------------------------------------------------
function digger(event, digObj) {
	for(var k=0; k<digObj.children.length; k++) {
		movePoints(event, digObj.children[k]);
		// if(digObj.children[k].children.length > 1) {
			digger(digObj.children[k]);
		// }
	}
}



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	sel = document.selectedItems.reverse();
	marker = new Path.Circle( event.point, values.thresh );
}

function onMouseDrag(event) {
	marker.position = event.point;

	for( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];
		if( obj.hasChildren() ) {
			digger( event, obj[i] );
		} else {	
			movePoints(event, obj);
		}
	}
}

function onMouseUp(event) {
	marker.remove();
}

// ------------------------------------------------------------------------
function onKeyDown(event) {
	if(event.character == '[') values.thresh -= 5;
	if(event.character == ']') values.thresh += 5;
	if(event.character == '{') values.av -= 0.5;
	if(event.character == '}') values.av += 0.5;
}


// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
Draw();