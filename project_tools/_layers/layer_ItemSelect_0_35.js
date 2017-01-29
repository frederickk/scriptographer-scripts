/**
 *	Select by Object 0.35
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
var layers;


// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
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
	sel = document.selectedItems.reverse();
	layers = document.layers;
	var str;

	// first what object are we looking for?
	for ( var i=0; i<sel.length; i++ ) {
		obj = sel[i];	

		if(obj.firstChild != null) {
			// bootleg! found out our selected item was
			// a group or compound path so we're done.
			// move on.
			str = obj.name;
			i = sel.length;
		}

		str = obj.name;
		// print("looking for " + str);
	}

	Dialog.alert("Selecting all of the Layers/Items called \n\"" + str + "\"");

	// now let's go through all of the layers and find it
	for(var i=0; i<layers.length; i++){
		var objLayer = layers[i].items;

		// level 1
		for(var j=0; j<objLayer.length; j++) {
			var objName = objLayer[j].name;

			if(objName == str) {
				objLayer[j].selected = true;

				// dig it
				// print(objLayer[j].children.length);
				// if(objLayer[j].children.length) {
					digger(objLayer[j]);
				// }
				// dig it end

			}
		}
		// level 1 end
	}

};


// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function digger(digObj) {
	for(var k=0; k<digObj.children.length; k++) {
		digObj.children[k].selected = true;
		
		// if(digObj.children[k].children.length > 1) {
			digger(digObj.children[k]);
		// }
	}
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Draw();
