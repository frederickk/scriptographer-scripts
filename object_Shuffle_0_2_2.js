/**
 *	ObjectShuffle 0.2.2
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
var coords = new Array();
var temp = new Array();

//values
var values = {
	bCenter:	true,
	bCopy:		false
};

//components
var components = {
	bCenter: {
		type: 'checkbox',
		label: 'center?'
	},
	bCopy: {
		type: 'checkbox',
		label: 'duplicate first\ndelete second'
	}
};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// initialize the dialog box
	var dialog = new Dialog.prompt('Object Shuffle 0.2.2', components, values);
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
	// selection
	//sel = document.selectedItems.reverse();
	sel = activeDocument.getItems({
			//type: 'TextItem',
			selected: true
	});

	for(var i=0; i<sel.length; i++) {
		obj = sel[i];
		if(values.bCenter) coords[i] = obj.position;
		else coords[i] = obj.bounds.point;
		temp[i] = i;
	}

	if(sel.length == 2) moveFlip();
	else moveRandom();
};


// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function moveFlip() {
	if(values.bCenter) {
		//swap by centers
		if(values.bCopy) {
			var copied = sel[1].clone();
			copied.position = coords[0];
			sel[0].remove();
		} else {
			sel[0].position = coords[1];
			sel[1].position = coords[0];
		}

	} else {
		//swap by corners
		if(values.bCopy) {
			var copied = sel[1].clone();
			copied.bounds.point = coords[0];
			sel[0].remove();
		} else {
			sel[0].bounds.point = coords[1];
			sel[1].bounds.point = coords[0];
		}

	}
	
};

// ------------------------------------------------------------------------
function moveRandom() {
	for (var i=0; i<sel.length; i++) {
		obj = sel[i];
		z = temp[parseInt(Math.random()*temp.length)]; //get random coordinate

		if(values.bCenter) {
			obj.position = coords[z];
		} else {
			obj.bounds.point = coords[z];
		}
		temp.splice(temp.indexOf(z), 1);
	}
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Draw();

