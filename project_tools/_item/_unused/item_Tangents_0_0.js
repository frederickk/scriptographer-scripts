/**
 *	Item Tangents 0.0
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
// script.coordinateSystem = 'top-down';
script.angleUnits = 'radians';

// document properties
var sel;

var group = new Group();
var obj;

var keyObj;
var keyStyle;

// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	group.removeChildren();
	
	var keySegs = keyObj.segments;
	for(var i=0; i<obj.segments.length; i++) {
		var j = parseInt( map(i, 0,obj.segments.length, 0,keySegs.length) );
		
		var path = new Path.Line(obj.segments[i].point, keySegs[j].point);
		path.strokeColor = new RGBColor(1,0,0);

		group.appendTop(path);
	}
	
	// if(keyObj != null) {
	// 	keyObj.strokeColor = new RGBColor(1,0,0);
	// }
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function reset() {
	print('reset()');
	keyObj.style = keyStyle;
};



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	if(Key.isDown('option')) {
		if(keyObj != null) reset();

		keyObj = event.item;
		keyStyle = keyObj.style;
		keyObj. fillColor = new RGBColor(1,0,0);
	}
	else {
		obj = event.item;
	}

};

function onMouseDrag(event) {
	if(obj != null) {
		obj.bounds.center = event.point;
	}
	if(keyObj != null && obj != null) {
		Setup();
	}
};

function onMouseUp(event) {
	obj = null;
};


// ------------------------------------------------------------------------
function onKeyDown(event) {
	if(event.keyCode == 'r') {
		reset();
	}
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
// Setup();
// Draw();



// // ------------------------------------------------------------------------
// // Draw
// // ------------------------------------------------------------------------
// function main() {
// 
// 	sel = activeDocument.getItems({
// 		type: Item,
// 		selected: true
// 	});
// 	
// 	
// 	var j,k,
// 	var seg;
// 	var tgt = [];
// 	for( var i=0; i<sel.length; i++ ) {
// 		seg = sel[i].segments;
// 		for(j=0; j<seg.length; j++) {
// 			k = parseIndex(seg, j+1);
// 			if(k<0) break;
// 
// 			if(sideSelection(seg, j,k) && isNotStraightSide(seg, j,k)) {
// 				tgt.push( new Bezier(seg, j,k) );
// 			}
// 
// 		}
// 	}
// 
// 	if (tgt.length<2) {
// 		var alert = new Dialog.alert('Please select at least 2 curved paths');
// 		return;
// 	}
// 	
// 	var comTan = commonTangent(tgt);
// 
// 	if(comTan.length>0) {
// 		var tanGroup = new Group();
// 		for(var i=0; i<comTan.length; i++) {
// 			var path = new Path.Line(comTan[i][0], comTan[i][1]);
// 			path.strokeColor = new GrayColor(0);
// 			tanGroup.appendTop( path );
// 		}
// 	} else {
// 		var alert = new Dialog.alert('No common tangents found');
// 	}
// }
// 
// 
// 
// // ------------------------------------------------------------------------
// // Methods
// // ------------------------------------------------------------------------
// function commonTangent(tgt) {
// 	/**
// 	 *	settings
// 	 */
// 	var conf = {};
// 	conf.kgs = 0.00001; // y-intercept torelance
// 	conf.tgs = 0.0001;	// bezier curve parameter torelance
// 
// 	var b1,b2;
// 	var len;
// 	var comTan = [];
// 	for(i=0; i<tgt.length-1; i++) {
// 		for(j=i+1; j<tgt.length;j++) {
// 			b1 = tgt[i];
// 			b2 = tgt[j];
// 			len = comTan.length+2;
// 		if(b1.p.parent == b2.p.parent) continue;
// 			comTan = findTangent(b1,b2, 0,0, conf, comTan);
// 			if(len>comTan.length) comTan = findTangent(b1,b2, 3,3, conf, comTan);
// 			if(len>comTan.length) comTan = findTangent(b1,b2, 0,3, conf, comTan);
// 			if(len>comTan.length) comTan = findTangent(b1,b2, 3,0, conf, comTan);
// 		}
// 	}
// 	return comTan;
// }
// 
// 
// // ------------------------------------------------------------------------
// function findTangent(b1,b2, idx1, idx2, conf, comTan) {
// 	var p1 = b1.q[idx1].slice(0);
// 	var p2 = b2.q[idx2].slice(0);
// 	var s, t1, t2;
// 	var rotFlg = 1;
// 
// 	for(var i=0; i<8; i++) { // set retry times
// 		s = slope(p1,p2);
// 		if (s == null || Math.abs(s)>10000) {
// 			// if the line is almost vertical, reverse x and y, then retry.
// 			b1.xyRot();
// 			b2.xyRot();
// 			
// 			p1.reverse();
// 			p2.reverse();
// 			
// 			rotFlg *= -1;
// 			continue;
// 		}
// 		t1 = tBySlope(b1, s, idx1, conf.tgs);
// 		if(t1<0) break;
// 		
// 		t2 = tBySlope(b2, s, idx2, conf.tgs);
// 		if(t2<0) break;
// 		
// 		p1 = b1.pnt(t1);
// 		p2 = b2.pnt(t2);
// 		
// 		if (Math.abs(getDc(p1,b1,t1)-getDc(p2,b2,t2)) < conf.kgs) {
// 			if(t1<0) p1 = b1.pnt(0);
// 			else if(t1>1) p1 = b1.pnt(1);
// 			if(t2<0) p2 = b2.pnt(0);
// 			else if(t2>1) p2 = b2.pnt(1);
// 			if(rotFlg<0) {
// 				b1.xyRot();
// 				b2.xyRot();
// 				p1.reverse();
// 				p2.reverse();
// 				rotFlg = 1;
// 			}
// 			if (overlapChk([p1,p2],comTan)) comTan.push([p1,p2]);
// 			return comTan;
// 		}
// 	}
// 
// 	if(rotFlg<0) { 
// 		b1.xyRot();
// 		b2.xyRot();
// 	}
// 
// 	return comTan;
// }
// 
// 
// 
// // ------------------------------------------------------------------------
// /**
//  *	return pathpoint's index. when the argument is out of bounds,
//  *	fixes it if the path is closed (ex. next of last index is 0),
//  *	or return -1 if the path is not closed.
//  */
// function parseIndex(p, n){ // PathPoints, number for index
// 	var len = p.length;
// 	if(p.parent.closed){
// 		return n>=0 ? n % len : len - Math.abs(n % len);
// 	} else {
// 		return (n<0 || n>len-1) ? -1 : n;
// 	}
// }