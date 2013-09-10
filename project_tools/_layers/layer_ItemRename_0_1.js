/**
 *	Name Layer/Item 0.1
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
var lay;
var str;

// values
var values = {
	strNew:		'Object_Name',
	bAll:		false
};

// gui components
var components = {
	strNew: {
		type: 'string',
		label: 'Desired Name'
	},
	bAll: {
		type: 'checkbox',
		label: 'Rename all instances of this item?'
	}
};


// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {	
	sel = document.selectedItems.reverse();
	lay = document.layers;

	values.strNew = sel[0].name;

	// initialize the palette window
	var dialog = new Dialog.prompt('Name Layer/Item 0.1', components, values);
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	// first what object are we looking for?
	for ( var i=0; i<sel.length; i++ ) {
		obj = sel[i];	

		// bootleg! found out our selected item was
		// a group or compound path so we're done.
		// move on.
		if(obj.hasChildren()) {
			str = obj.name;
			i = sel.length;
		}
		// single item
		str = obj.name;
	}


	if(!values.bAll) {
		if(sel.length == 1) {
			// Dialog.alert("Renaming only this instance of \"" + str + "\" to \"" + values.strNew + "\"");
			rename(obj);
		}
		else {
			// Dialog.alert("Renaming only these instances 	to \"" + values.strNew + "\"");
			for( var i=0; i<sel.length; i++ ) {
				obj = sel[i];
				rename(obj);
			}
		}

	}
	else {
		// Dialog.alert("Renaming all instances of \"" + str + "\" to \"" + values.strNew + "\"");

		for(var i=0; i<lay.length; i++){
			var objekt = lay[i].items;

			for(var j=0; j<objekt.length; j++) {
				if(objekt[j].name == str) { 
					rename(objekt[j]);
				}
			}
		}
	}

};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function rename(obj) {
	obj.name = values.strNew;
	obj.selected = false;
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Draw();
