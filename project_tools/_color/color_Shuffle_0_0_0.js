/**
 *	ColorShuffle 0.0.0
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


// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// initialize the dialog box
	//var dialog = new Dialog.prompt('Object Shuffle 0.2.2', components, values);
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
	var sel = document.selectedItems.reverse();

	for( var i=0; i<sel.length; i++ ) {
		var obj1 = sel[i];

		for( var j=0; j<sel.length; j++ ) {
			if( i != j) {
				var obj2 = sel[j];
				if(obj1.opacity == obj2.opacity) {
					swap(obj1, obj2);				
					break;	
				}
			}
		}
	
	}

			

}


function swap(obj1, obj2) {
	var fill1 = obj1.fillColor;
	var stroke1 = obj1.strokeColor;
	
	var fill2 = obj2.fillColor;
	var stroke2 = obj2.strokeColor;

	//swap colors
	if( fill2 != null )	obj1.fillColor = fill2;
	if( stroke2 != null )	obj1.strokeColor = stroke2;

	if( fill1 != null )	obj2.fillColor = fill1;
	if( stroke1 != null )	obj2.strokeColor = stroke1;
}



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
/*
function brightness(what) {
    Color.RGBtoHSB((what >> 16) & 0xff, (what >> 8) & 0xff,
                   what & 0xff, cacheHsbValue);
    cacheHsbKey = what;
  }
  return cacheHsbValue[2] * colorModeZ;
}
*/


/*
// ------------------------------------------------------------------------
// magic!
// ------------------------------------------------------------------------
//gather the info
for (var i=0; i < sel.length; i++) {
	auswahl = sel[i];
	temp[i] = i;

	if(auswahl.hasChildren) {
		//print(i + ": proud parent");
		//i++;
	}
}

if(sel.length <= 2) mischenFlip();
else mischenZufall();

//move shit
function mischenFlip() {
	//print( sel[0].fillColor.type );
	colorFill_0 = sel[0].fillColor;
	colorStroke_0 = sel[0].strokeColor;

	colorFill_1 = sel[1].fillColor;
	colorStroke_1 = sel[1].strokeColor;

	sel[0].fillColor = colorFill_1;
	sel[0].strokeColor = colorStroke_1;

	sel[1].fillColor = colorFill_0;
	sel[1].strokeColor = colorStroke_0;
}

function mischenZufall() {
	for (var i=0; i < sel.length; i++) {
		auswahl = sel[i];
		z = temp[parseInt(random(0,temp.length))];

		if(auswahl.hasChildren) {
		}

		colorFill = sel[z].fillColor;
		colorStroke = sel[z].strokeColor;

		auswahl.fillColor = colorFill;
		auswahl.strokeColor = colorStroke;
		temp.splice(temp.indexOf(z), 1);
	}
}
*/


// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
Draw();


