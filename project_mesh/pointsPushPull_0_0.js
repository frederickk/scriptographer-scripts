/**
 *	pointsPush/Pull 0.0
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
var objects;
var pointsCurr = new Array();

// values
var values = {
	thresh:	5,
	random:	0
};

// gui components
var components = {
	thresh: {
		type: 'number',
		label: 'distance threshold',
		increment: 5,
		steppers: true
	},
	random: {
		type: 'number',
		label: 'random movement',
		increment: 5,
		steppers: true
	},

	// ------------------------------------
	// Invocation
	// ------------------------------------
	submit: { 
		type: 'button', 
		value: 'Apply',
		onClick: function() {
			Draw();
		}
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
	// document properties
	//objects = activeDocument.getItems( { type: Item, selected: true } );
	objects = document.selectedItems.reverse();

	//gather points
	for(var i=0; i<objects.length; i++) {
		var obj = objects[i];
		
		if( obj.hasChildren() ) {
			for(var k=0; k<obj.children.length; k++) {
				gatherPoints( obj.children[k] );
			}
		} else {	
			gatherPoints(obj);
		}
	}

	//ammend points with new values
	redefinePoints();
	
	//redistribute points
	var index = 0;
	for(var i=0; i<objects.length; i++) {
		var obj = objects[i];
		
		if( obj.hasChildren() ) {
			for(var k=0; k<obj.children.length; k++) {
				updatePoints( obj.children[k] );
			}

		} else {
			updatePoints(obj);
			/*
			for(var j=0; j<obj.segments.length; j++) {
				obj.segments[j].point = pointsCurr[index];
				index++;
				//pointsCurr.push( pt );
			}
			*/
		}

	}


}


// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function random(minr, maxr) {
	return minr + Math.random() * (maxr - minr);
}

function comparePoints(pt1, pt2) {
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

function gatherPoints(obj) {
	for(var j=0; j<obj.segments.length; j++) {
		var pt = obj.segments[j].point;
		print(j + '\t' + obj.segments.length + '\t' + pt);
		pointsCurr.push( pt );
	}
}

function redefinePoints() {
	for(var i=0; i<pointsCurr.length; i++) {
		var ptOld = pointsCurr[i];
		var ptNew = new Point( ptOld.x + random(-values.random,values.random), ptOld.y + random(-values.random,values.random) );

		for(var j=0; j<pointsCurr.length; j++) {
			var d = dist(ptOld, pointsCurr[j]);
			if( comparePoints(ptOld, pointsCurr[j]) ) {
			//if( d < values.thresh ) {
				pointsCurr[j] = ptNew;
			}
		}
	}
	
}

function updatePoints(obj) {
	for(var j=0; j<obj.segments.length; j++) {
		print('pointsCurr.length', pointsCurr.length);
		print(j + '\t' + pointsCurr.length % j);
		//obj.segments[j].point = pointsCurr[ pointsCurr.length % j ];
	}
}


// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
//Draw();