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
var hold_point = 0;
var hold_handle = 0;

var xSeg1,ySeg1, xSeg2,ySeg2, dia;
var punktX,punktY;

// ------------------------------------------------------------------------
// funktionen
// ------------------------------------------------------------------------
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
			//hold_point = curve.point1;
		
			pSeg1 = curve.point1;
			hSeg1 = curve.handle1;

			pSeg2 = curveB.point2;
			hSeg2 = curveB.handle2;

			//print("hSeg1: " + hSeg1);
			//print("hSeg2: " + hSeg2);
			kopieren(pSeg1,pSeg2, hSeg1,hSeg2);

		}
}

function drawCurve(curve, hold_point,hold_handle) {
	if(hold_point !=0) {
		var pt1 = hold_point;
		var handle1 = hold_handle;
	} else {
		var pt1 = curve.point1;
		var handle1 = curve.handle1.add(pt1);
	}

	var pt2 = curve.point2;
	var handle2 = curve.handle2.add(pt2);
	
	kopieren(pt1,pt2, handle1,handle2);
}

function kopieren(point1,point2, handle1,handle2) {
	var ark = new Path();
	ark.moveTo(point1.x,point1.y);

	//print("move: " + point1.x + "," + point1.y + ", ");
	//print("arc: " + handle1.x + "," + handle1.y + ", ");  
	//print("arc: " + handle2.x + "," + handle2.y + ", ");
	//print("arc: " + point2.x + "," + point2.y);

	//ark.lineTo(point2.x,point2.y);
	//ark.curveTo(handle1.x,handle1.y, handle2.x,handle2.y, point2.x,point2.y);
	ark.curveTo(
		point1.x+50, point1.y, 
		point2.x, point2.y+50,
		point2.x, point2.y
	);
	
	ark.style.stroke.color = new CMYKColor(0,1.0,0,0);
	ark.style.stroke.width = 2;
	
	//return ark;
}

function drawKreis(x,y, size) {
	//var sizeP = new Point(size,size);
	//var rec = new Rectangle(point,point.add(sizeP));
	//rec.center = point;

	var kreis = activeDocument.createCircle(x,y, size/2);
	kreis.style.stroke.color = new CMYKColor(0.45,0.0,1.0,0);
	kreis.style.fill.color = null;

	//return kreis
}

// ------------------------------------------------------------------------
// magic!
// ------------------------------------------------------------------------
for(var i=0; i<sel.length; i++) {
	var auswahl = activeDocument.selectedItems[i];
	drawCurves(auswahl)
}