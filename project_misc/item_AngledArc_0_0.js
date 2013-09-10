/**
 *	Add to 0.0
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 */


// ------------------------------------------------------------------------
// libraries
// ------------------------------------------------------------------------
include('libraries/frederickk.js');



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

script.coordinateSystem = 'top-down';
script.angleUnits = 'degrees';

// document properties
var sel;



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems({
		type: Item,
		selected: true
	});
	// var palette = new Palette('Add to 0.0', components, values);
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
	// print(sel.length);
	for( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];
		
		// print(obj.segments.length);
		for(var j=1; j<obj.segments.length; j+=2) {
			var seg1 = obj.segments[j-1].point;
			var seg2 = obj.segments[j].point;
			var vector = seg2 - seg1;
			
			var dist = seg1.getDistance(seg2);
			var angle = seg1.getDirectedAngle(seg2);

			var curvePoints = generateCurve(seg1, seg2, dist*0.50, 5, false,false);
			// print('curvePoints', curvePoints);

			// var curvePoints = generateCurve(new Point(0,0), new Point(400, 400), 283, 15);

			
			var path = new Path();
			for(k in curvePoints) {
				path.add( new Segment(curvePoints[k]) );
			}
			path.strokeColor = '#ff00ff';
			path.smooth();
		}
		
		
		
		// var hmm = obj.clone();
		// hmm.strokeColor = '#000000';
		// hmm.selected = false;

		// var line = new Path();
		// line.strokeColor = '#000000';
		// line.add(obj.bounds.center - 10);
		// line.add(obj.bounds.center + 10);

	}
}



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
/**
 *	http://stackoverflow.com/questions/6641977/how-to-create-a-curve-between-2-points-in-2d-and-get-back-points-that-makes-that
 */
function GetAngle(point1,point2, R) {
	var cosa = (point1.x-point2.x)/R;
	var sina = (point1.y-point2.y)/R;
	var angle = Math.acos(cosa);
	return Math.sin(angle)*sina >= 0 ? angle : 2*Math.PI - angle;
}

// function generateCurve(pointFrom, pointTo, pRadius, curveRes) {
// 
// 	var pOutPut = [];
// 
// 	var dist = pointFrom.getDistance(pointTo);
// 	var h = Math.sqrt(pRadius * pRadius - (dist * dist / 4.0));
// 	var angleStep = curveRes/pRadius;
// 
// 	if(2*pRadius <= dist) {
// 		print('Radius is too small');
// 		return;
// 	}
// 
// 	//find center
// 	var x1 = pointFrom.x;
// 	var x2 = pointFrom.y;
// 	var y1 = pointTo.x;
// 	var y2 = pointTo.y;
// 
// 	var m1 = (x1+y1)/2;
// 	var m2 = (x2+y2)/2;
// 
// 	var u1 = -(y2-x2)/dist;
// 	var u2 = (y1-x1)/dist;
// 
// 	var o1 = m1 + h * u1;
// 	var o2 = m2 + h * u2;
// 	var o = new Point(o1, o2);
// 
// 	var startAngle = GetAngle(pointFrom, o, pRadius);
// 	var endAngle = GetAngle(pointTo, o, pRadius);
// 
// 	if(endAngle < startAngle)
// 		endAngle += 2 * Math.PI;
// 
// 	for(var a = startAngle; a < endAngle; a+=angleStep) {
// 		pOutPut.push( new Point(o1+pRadius*Math.cos(a), o2+pRadius*Math.sin(a)) );
// 	}
// 	pOutPut.push(pointTo);
// 
// 	return pOutPut;
// }


function generateCurve(pointFrom,pointTo, pRadius, curveRes, bShortest, side) {

	var pOutPut = [];

	var mPoint = new Point(pointFrom.x + pointTo.x, pointFrom.y + pointTo.y);
	mPoint.x /= 2.0;
	mPoint.y /= 2.0;

	var dist = pointFrom.getDistance(pointTo);
	if (pRadius * 2.0 < dist) {
		print('The radius is too small! The given points wont fall on the circle.');
		return;
	}


	// Calculate the middle of the expected curve.
	var factor = Math.sqrt( (pRadius * pRadius) / ((pointTo.x - pointFrom.x) * (pointTo.x - pointFrom.x) + (pointTo.y - pointFrom.y) * (pointTo.y - pointFrom.y)) - 0.25 );
	var circleMiddlePoint = new Point(0, 0);
	if (side) {
		circleMiddlePoint.x = 0.5 * (pointFrom.x + pointTo.x) + factor * (pointTo.y - pointFrom.y);
		circleMiddlePoint.y = 0.5 * (pointFrom.y + pointTo.y) + factor * (pointFrom.x - pointTo.x);
	} else {
		circleMiddlePoint.x = 0.5 * (pointFrom.x + pointTo.x) - factor * (pointTo.y - pointFrom.y);
		circleMiddlePoint.y = 0.5 * (pointFrom.y + pointTo.y) - factor * (pointFrom.x - pointTo.x);
	}


	// Calculate the two reference angles
	var angle1 = Math.atan2(pointFrom.y - circleMiddlePoint.y, pointFrom.x - circleMiddlePoint.x);
	var angle2 = Math.atan2(pointTo.y - circleMiddlePoint.y, pointTo.x - circleMiddlePoint.x);


	// Calculate the step.
	var step = curveRes / pRadius;


	// Swap them if needed
	if (angle1 > angle2) {
		var temp = angle1;
		angle1 = angle2;
		angle2 = temp;

	}
	var flipped = false;
	if (!bShortest) {
		if (angle2 - angle1 < Math.PI) {
			var temp = angle1;
			angle1 = angle2;
			angle2 = temp;
			angle2 += Math.PI * 2.0;
			flipped = true;
		}
	}
	for (var f = angle1; f < angle2; f += step) {
		var p = new Point(Math.cos(f) * pRadius + circleMiddlePoint.x, Math.sin(f) * pRadius + circleMiddlePoint.y);
		pOutPut.push(p);
	}
	if (flipped ^ side) {
		pOutPut.push(pointFrom);
	} else {
		pOutPut.push(pointTo);
	}

	return pOutPut;
}


// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
Draw();

