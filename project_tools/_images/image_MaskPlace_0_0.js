/**
*	Image Mask Place 0.0
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

script.coordinateSystem = 'bottom-up';
script.angleUnits = 'radians';


// document properties
var sel;

//values
var values = {
	scale:			false
};

//components
var components = {
	scale: { 
		type: 'checkbox',
		label: 'Scale image to selection'
	}
};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// initialize the dialog box
	var dialog = new Dialog.prompt('Image Mask Place 0.0', components, values);
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	sel = activeDocument.getItems({
		type: Path,
		selected: true
	});

	for( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];

		// place the photo
		var file = Dialog.fileOpen();
		var image = new PlacedFile(file);

		// scale image to object
		if (values.scale) {
			var imageRatio;
			if (image.bounds.height > image.bounds.width) {
				imageRatio = image.bounds.height/image.bounds.width;
			}
			else {
				imageRatio = image.bounds.width/image.bounds.height;
			}

			if (obj.bounds.height > obj.bounds.width) {
				image.bounds.height = obj.bounds.height;
				image.bounds.width = obj.bounds.height*imageRatio;
			}
			else {
				image.bounds.height = obj.bounds.width*imageRatio;
				image.bounds.width = obj.bounds.width;
			}
		}
		image.position = obj.position;

		// create a mask from obj (!Raster, !PlacedFile)
		var group = new Group();
		group.appendTop( image );
		group.appendTop( obj );
		group.clipped = true;
		obj.clipMask = true;
	}
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Draw();
