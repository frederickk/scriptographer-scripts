/**
*	Travelling Salesman Problem
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
var layer = activeDocument.activeLayer;

var num = 10;


// tsp
var RouteStep = 0;
var nodeRoute;


// values
var values = {
	num:			9,
	spacing:		'Specified Steps',

	pathsNum:		1,
	iterations:		45000
};

//components
var components = {
	num: {
		type: 'number',
		fractionDigits: 0,
	},
	
	spacing: {
		type: 'list',
		label: 'Spacing',
		options: ['Specfied Distance', 'Specified Steps']
	},

	optionsRule: { 
		type: 'ruler',
		fullSize: true,
	},

	pathsNum: {
		type: 'number',
		label: 'Number of Paths',
		fractionDigits: 0,
		min: 1,
	},
	iterations: {
		type: 'number',
		label: 'Iterations',
		fractionDigits: 0,
	},
	

};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems({
		type: [Item, Path, TextItem],
		hidden: false,
		locked: false
		//selected: true
	});

	palette = new Dialog.prompt('Travelling Salesman Problem', components, values);

	OptimizePath(sel, values.iterations);
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

	// for(var i=0; i<values.pathsNum; i++) {
	// 	print('Optimzing Path:\t' + i);
	// 	print('Iterations:\t' + (values.iterations/(i+1)));
	// 	OptimizePath(sel, (values.iterations/(i+1)));

		var nodesNum = nodeRoute.length - 1;
		var groupTsp = new Group();
		for (var j=0; j<nodesNum; ++j) {
			var obj1 = sel[ nodeRoute[j] ];
			var obj2 = sel[ nodeRoute[j+1] ];

			var p1 = obj1.position;
			var p2 = obj2.position;

			if(values.spacing == 'Specified Steps') {
				steps = values.num;
			} else {
				var dist = p1.getDistance(p2);
				steps = parseInt(dist/values.num);
			}

			var pos = obj1.position;
			var col = obj1.fillColor;
			var sz = obj1.bounds.width;

			var groupHolder = new Group();
			for(var k=0; k<steps; k++) {
				col = lerpRGBColor(col, obj2.fillColor, k/steps);
				var kx = lerp(pos.x, obj2.position.x, k/steps);
				var ky = lerp(pos.y, obj2.position.y, k/steps);
				sz = lerp(sz, obj2.bounds.width, k/steps);
		
				var path = new Path.Circle(new Point(kx,ky), (sz/2));
				path.fillColor = col;
				groupHolder.appendTop(path);
			}
			groupTsp.appendTop( groupHolder );

			//var path = new Path.Line(p1.x, p1.y, p2.x, p2.y);
		}

	// }

}



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function random(minr, maxr) {
	return minr + Math.random() * (maxr - minr);
}
function randomInt(minr, maxr) {
	return parseInt( random(minr,maxr) );
}

/*
 * amt	float: between 0.0 and 1.0
 */
function lerp(start, stop, amt) {
	return start + (stop-start) * amt;
}
function lerpRGBColor(c1,c2, amt) {
	var r = lerp(c1.red,	 c2.red,	amt);
	var g = lerp(c1.green,	c2.green,	amt);
	var b = lerp(c1.blue,	 c2.blue,	amt);
	
	var col = new RGBColor(r,g,b);
	return col;
}



// ------------------------------------------------------------------------
function OptimizePath(sel, iterate) { 
	/**
	 *	Travelling Salesman Problem Algorithm
	 *
	 *	Taken from "SVG Stipple Generator, v 1.0"
	 *	Copyright (C) 2012 by Windell H. Oskay
	 *	
	 *	http://www.evilmadscientist.com
	 *	http://www.evilmadscientist.com/go/stipple
	 *  
	 *	Modified for Scriptographer/Javascript
	 *	Ken Frederick
	 *	ken.frederick@gmx.de
	 *
	 *	http://kennethfrederick.de/
	 *	http://blog.kennethfrederick.de/
	 *
	 */


	// create an empty array to hold the routing info
	nodeRoute = [];

	var temp;
	var p1;

	if(RouteStep == 0) {
		// Begin process of optimizing plotting route, by flagging nodes that will be shown.
		// print("Optimizing plotting path");
		var nodeRouteLength = 0;
		var nodeRouteTemp = new Array(sel.length);

		for(var i=0; i<sel.length; ++i) {

			nodeRouteTemp[i] = false;
			var px = sel[i].position.x;
			var py = sel[i].position.y;

			if((px >= activeDocument.bounds.width) || (py >= activeDocument.bounds.height) || (px < 0) || (py < 0)) {
				continue;
			}
			else {
				nodeRouteTemp[i] = true;
				nodeRouteLength++;
			}
		}

		// These are the ONLY points to be drawn in the tour.
		nodeRoute = new Array(nodeRouteLength);
		var tempCounter = 0;
		for(var i=0; i<sel.length; ++i) { 
			if(nodeRouteTemp[i]) {
				nodeRoute[tempCounter] = i;
				tempCounter++;
			}
		}
	}



	var nodesNum = nodeRoute.length - 1;

	if(RouteStep < (nodeRoute.length - 2))  { 
		// print('Nearest neighbor ("Simple, Greedy") algorithm path optimization:');
		// 1000 steps per frame displayed; you can edit this number!
		var StopPoint = RouteStep + 1000;

		if(StopPoint > nodesNum)
			StopPoint = nodesNum;

		for(var i=RouteStep; i<StopPoint; ++i) { 
			p1 = sel[nodeRoute[RouteStep]].position;
			var ClosestNode = 0; 
			var distMin = Number.MAX_VALUE;

			for(var j=RouteStep+1; j<nodesNum; ++j) { 
				var p2 = sel[ nodeRoute[j] ].position;

				var dx = p1.x - p2.x;
				var dy = p1.y - p2.y;
				var distance = (dx*dx+dy*dy);	// Only looking for closest; do not need sqrt factor!

				if(distance < distMin) {
					ClosestNode = j; 
					distMin = distance;
				}
			}	

			temp = nodeRoute[RouteStep + 1];
			//p1 = sel[nodeRoute[RouteStep + 1]];
			nodeRoute[RouteStep + 1] = nodeRoute[ClosestNode];
			nodeRoute[ClosestNode] = temp;

			if(RouteStep < (nodesNum)) {
				RouteStep++;
			} else {
				print("Now optimizing plot path" );
			}
		}
	
	} //else {
		// Initial routing is complete
		// print('2-opt heuristic optimization');
		// Identify a pair of edges that would become shorter by reversing part of the tour.

		// var groupPath = new Group();
		// 1000 tests per frame; you can edit this number.
		for(var i=0; i<iterate; ++i) {
			
			var indexA = Math.floor( random(0, nodesNum) );
			var indexB = Math.floor( random(0, nodesNum) );

			// print('indexA', indexA);
			// print('indexB', indexB);

			if(Math.abs(indexA - indexB) < 2)
				continue;
		
			if(indexB < indexA) {
				// swap A, B.
				temp = indexB;
				indexB = indexA;
				indexA = temp;
			}
		
			var a0 = sel[ nodeRoute[indexA] ].position;
			var a1 = sel[ nodeRoute[indexA + 1] ].position;
			var b0 = sel[ nodeRoute[indexB] ].position;
			var b1 = sel[ nodeRoute[indexB + 1] ].position;
		
			// Original distance:
			var dx = a0.x - a1.x;
			var dy = a0.y - a1.y;
			var distance = (dx*dx+dy*dy);	// Only a comparison; do not need sqrt factor! 
			dx = b0.x - b1.x;
			dy = b0.y - b1.y;
			distance += (dx*dx+dy*dy);	//	Only a comparison; do not need sqrt factor! 
		
			// Possible shorter distance?
			dx = a0.x - b0.x;
			dy = a0.y - b0.y;
			var distance2 = (dx*dx+dy*dy);	//	Only a comparison; do not need sqrt factor! 
			dx = a1.x - b1.x;
			dy = a1.y - b1.y;
			distance2 += (dx*dx+dy*dy);	// Only a comparison; do not need sqrt factor! 
		
			if(distance2 < distance) {
				// Reverse tour between a1 and b0.	 
		
				var indexhigh = indexB;
				var indexlow = indexA + 1;
		
				while (indexhigh > indexlow) {
					temp = nodeRoute[indexlow];
					nodeRoute[indexlow] = nodeRoute[indexhigh];
					nodeRoute[indexhigh] = temp;
		
					indexhigh--;
					indexlow++;
				}
			}

			// draw Path
			// groupPath.removeChildren();
			// for (var j=0; j<nodesNum; ++j) {
			// 	var obj1 = sel[ nodeRoute[j] ];
			// 	var obj2 = sel[ nodeRoute[j+1] ];
			// 
			// 	var p1 = obj1.position;
			// 	var p2 = obj2.position;
			// 
			// 	var path = new Path.Line(p1.x, p1.y, p2.x, p2.y);
			// 	groupPath.appendTop(path);
			// }

		}
	//}
	// groupPath.remove();

}


// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
// Update(event);
Draw();

