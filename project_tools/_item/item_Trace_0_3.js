/**
 *	Item Trace 0.3
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

//document properties
var sel;

// values
var settingsFile = 'ItemTrace_0_0.values';
var values = {
	tracedWidth:			3,
	tracedColor:			new CMYKColor(1.0, 0, 0, 0)
};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems(Item, { selected: true }); 

};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	for( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];

		digger(obj);
		obj.remove();
	}

};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function breakApart(obj) {
	try {
		var curves = obj.curves;

		if( obj.hasChildren() ) {
			for( var k=0; k<obj.children.length; k++ )  digger( obj.children[k] );
		}
		else {
			for(var j=0; j<curves.length; j++) {
				var curve = curves[j];
			
				var path = new Path();
				path.add( curve.segment1 );
				path.add( curve.segment2 );
				path.style = obj.style;

				path.strokeColor = values.tracedColor;
				path.fillColor = null;
				console.log( obj.strokeWidth );
				path.strokeWidth = (obj.strokeWidth === null || obj.strokeWidth <= 1) ? 3 : obj.strokeWidth;
			}
		}
	}
	catch(err) {}

};

// ------------------------------------------------------------------------
function digger(obj) {
	for( var k=0; k<obj.children.length; k++ )  {
		breakApart( obj.children[k] );

		//if(obj.children[k].children.length > 1)
			digger( obj.children[k] );
	}
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Draw();
