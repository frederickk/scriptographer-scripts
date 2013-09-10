/**
 *	type style cycle 0.0
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
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

//script.coordinateSystem = 'bottom-up';
script.coordinateSystem = 'top-down';
script.angleUnits = 'radians';


// document properties



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	var hitResult = document.hitTest(event.point, 'all');

	if(hitResult) {
		var obj = hitResult.item;
		// print('obj', obj);

		if( obj.characterStyle ) {
			var type = obj.characterStyle.font.family.name;
			var style = obj.characterStyle.font.index;
			var length = obj.characterStyle.font.family.length;
			
			style++;
			if(style >= length) style = 0;

			var typeNext = obj.characterStyle;
			typeNext.font = app.fonts[type][style];
			obj.characterStyle = typeNext;
		}


	}
}


function onMouseUp(event) {
	activeDocument.redraw();
}



