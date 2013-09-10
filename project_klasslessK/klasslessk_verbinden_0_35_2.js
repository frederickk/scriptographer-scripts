//	klasslessk_verbinden 0.3
//
//	Ken Frederick
//	ken.frederick@gmx.de
//
//	http://kennethfrederick.de/
//
//	klasslessk_verbinden 0.3 script and idea by Ken Frederick
//
//

// ------------------------------------------------------------------------
// variablen
// ------------------------------------------------------------------------
var sel = activeDocument.selectedItems;
var punkte = new Array();

var zufall = 50;
var z;

// ------------------------------------------------------------------------
// dialog
// ------------------------------------------------------------------------
/*
values = Dialog.prompt("klasslessk_connect 0.3", [
	{ value: zufall, description: "random", width: 50 }
]);

if (values != null ) {
	zufall = values[0];
}

z = zufall;
*/

// ------------------------------------------------------------------------
// funktionen
// ------------------------------------------------------------------------
function assignRandom(minr, maxr) {
	rand = minr + Math.random() * (maxr - minr);
	return rand;
}

function drawCurves(auswahl) {
	var l = auswahl.children.length;
	
	if(l) {
		//grouped items
		for(var i=0; i<l; i++) {
			drawCurves(auswahl.children[i])
		}

	} else {
		//individual items
		var curveL = auswahl.curves.length;
		var curve = auswahl.curves[0];
		var curveB = auswahl.curves[curveL-1];
	
		//connect!
		//var hold_point = curve.point2;
		//var hold_handle = curve.handle2;

		pSeg1 = curve.point1;
		hSeg1 = curve.handle1;

		pSeg2 = curveB.point2;
		hSeg2 = curveB.handle2;

		//print("hSeg1: " + hSeg1);
		//print("hSeg2: " + hSeg2);

		drawArk(
			pSeg1,pSeg2,
			hSeg1,hSeg2
		);

	}

	return curveB;
}

function drawArk(point1,point2, handle1,handle2) {
	var ark_p_1 = point1.clone();
	var ark_p_2 = point2.clone();
	var ark_h_1 = handle1.clone();//.add(point1);
	var ark_h_2 = handle2.clone();//.add(point2);

	var rand = assignRandom(-z,z);

	var ark = new Path();
	ark.moveTo(ark_p_1.x,ark_p_1.y);

	/*
	print("ark_p_2: " + ark_p_2.x + "," + ark_p_2.y + ", ");
	print("ark_p_2: " + ark_p_2.x + "," + ark_p_2.y + ", ");
	print("ark_h_1: " + ark_h_1.x + "," + ark_h_1.y + ", ");	
	print("ark_h_2: " + ark_h_2.x + "," + ark_h_2.y + ", ");
	*/

	ark.curveTo(
		ark_h_1.x + ark_p_1.x,
		ark_h_1.y + ark_p_1.y, 

		ark_h_2.x + ark_p_2.x,
		ark_h_2.y + ark_p_2.y,

		ark_p_2.x,
		ark_p_2.y
	);
	
	ark.style.stroke.color = new CMYKColor(0,1.0,0,0);
	ark.style.stroke.width = 1;
	
	//return ark;
}

function drawZahl(point, inhalt) {
	s_zahl = new CharacterStyle();
	s_zahl.fontSize = 9;

	zahl = new PointText(point);
	zahl.characterStyle = s_zahl;	
	zahl.paragraphStyle.justification = 2;
	zahl.content = inhalt;

	//return zahl;
}

// ------------------------------------------------------------------------
// magic!
// ------------------------------------------------------------------------
for(var i=0; i<sel.length; i++) {
	var auswahl = activeDocument.selectedItems[i];
	//drawCurves(auswahl);

	punkte[i] = drawCurves(auswahl);

	//print(i + "_b: " + drawCurves(auswahl));
	//drawZahl(auswahl.curves[0].point1, i + "a");
	//drawZahl(auswahl.curves[0].point2, i + "b");
	
	//auswahl.style.stroke.color = null;

}

for(var i=0; i<punkte.length; i++) {
	print(punkte[i]);
	drawArk(
		punkte[i].point1,punkte[i].point2,
		punkte[i].handle1,punkte[i].handle2
	);

//drawArk(point1,point2, handle1,handle2) 

}