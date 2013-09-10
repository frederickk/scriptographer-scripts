/**
 *	Type Label 0.0
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
var debug = false;


var values = {
	size:	9
};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems({
		type: TextItem,
		selected: true,
	});

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
	for(var i=0; i<sel.length; i++) {
		var obj = sel[i];
		var offset = new Point( 0, obj.characterStyle.leading+(values.size*2+3) );

		var label = new PointText( obj.point+offset );
		label.fillColor = null;
		label.characterStyle = {
			font:		app.fonts['Akzidenz-Grotesk Next']['Bold'],
			fontSize:	values.size,
			leading:	values.size+3,
		};
		label.content = obj.characterStyle.font.family.name;
		var style = obj.characterStyle.font.name;
		label.content += '\r' + style;

		var group = new Group();
		group.appendTop(obj);
		group.appendTop(label);
	}
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
// Update(event);
Draw();
