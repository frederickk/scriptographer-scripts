/**
 *	Attraction 2D 
 *	http://haptic-data.com/toxiclibsjs/examples/Attraction2D_pjs.html
 *
 *	Kyle Phillips
 *	kyle@haptic-data.com/
 *
 *	http://haptic-data.com/
 *
 *	This example demonstrates how to use the behavior handling
 *	(new since toxiclibs-0020 release) and specifically the attraction
 *	behavior to create forces around the current locations of particles
 *	in order to attract (or deflect) other particles nearby.
 *
 *	Behaviors can be added and removed dynamically on both a
 *	global level (for the entire physics simulation) as well as for
 *	individual particles only.
 *	
 *	Click and drag mouse to attract particles
 *	
 *	
 *	implemenation of toxiclibsjs particles in scriptographer by
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
// libraries
// ------------------------------------------------------------------------
include('lib/box2d/box2d.js');
include('lib/extend.js');
include('../libraries/frederickkScript/frederickkScript.js')


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
//script.coordinateSystem = 'top-down';
script.angleUnits = 'radians';

// document properties
var sel;
var group = new Group();
var mousePos;

var cWidth = activeDocument.bounds.width;
var cHeight = activeDocument.bounds.height;
var world;

var boxes = new Array();
var circles = new Array();
var triangles = new Array();

var bodies = new Array();
var explosionParticles = new Array();


// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// setup world
	var worldAABB = new b2AABB()
	worldAABB.lowerBound.Set(-1000.0, -1000.0)
	worldAABB.upperBound.Set(1000.0, 1000.0)

	var gravity = new b2Vec2(0.0, -100.0)
	world = new b2World(worldAABB, gravity, true)

	// setup ground
	var groundBodyDef = new b2BodyDef();
	groundBodyDef.position.Set(cWidth/2.0, 0.0);

	var groundShapeDef = new b2PolygonDef();
	groundShapeDef.restitution = 0.0;
	groundShapeDef.friction = 0.5;
	groundShapeDef.density = 1.0;

	var groundBody = world.CreateBody(groundBodyDef);
	groundBody.w = cWidth;
	groundBody.h = 10.0
	groundShapeDef.SetAsBox(groundBody.w, groundBody.h);
	groundBody.CreateShape(groundShapeDef);
	groundBody.SynchronizeShapes();


	// selection
	sel = activeDocument.getItems({
		type: Path,
		selected: true
	});
	print('number of items selected:', sel.length)

	/*
	for( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];
		var segs = obj.segments;
	}
	*/
	print('number of bodies:', bodies.length)
}


// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
	group.remove();
	group = new Group();

	var timeStep = 1.0/60;
	var iteration = 1;
	world.Step(timeStep, iteration);
}


// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	Update(event);

	// draw boxes
	for(var i in boxes){
		var shape = boxes[i];
		var t = shape.body.m_xf;
		var pos = new Point(t.position.x - shape.body.w/2, t.position.y - shape.body.h/2);

		var box = new Path.Rectangle(pos, new Size(shape.body.w,shape.body.h) );
		box.rotate( shape.body.GetAngle() );
		box.fillColor = new RGBColor(0.0, 0.0, 1.0);
		box.strokeColor = null;
		
		group.appendTop(box);
	}
	
	
	// draw circles
	for(var i in circles){
		var shape = circles[i];
		var t = shape.body.m_xf;
		var pos = new Point(t.position.x,t.position.y);

		var circle = new Path.Circle(pos, shape.shapeDef.radius);
		circle.rotate( shape.body.GetAngle() );
		circle.fillColor = new RGBColor(1.0, 1.0, 0.0);
		circle.strokeColor = null;
		
		group.appendTop(circle);
	}


	// draw triangles/polygons
	for(var i in triangles){
		var shape = triangles[i];
		var t = shape.body.m_xf;
		var pos = new Point(t.position.x,t.position.y);

		var test = new Path.Circle(pos, 20);
		test.fillColor = new RGBColor(0.0, 0.0, 0.0);
		group.appendTop(test);

		var poly = new Path();
		poly.moveTo( new Point(shape.shapeDef.vertices[0].x,shape.shapeDef.vertices[0].y) );
		for(var i=0; i<shape.shapeDef.vertexCount; i++) {
			var vertex = new Point(shape.shapeDef.vertices[i].x,shape.shapeDef.vertices[i].y);
			poly.lineTo( vertex );
		}
		poly.closePath();
		poly.translate(pos);
		poly.rotate( shape.body.GetAngle() );
		poly.fillColor = new RGBColor(1.0, 0.0, 0.0);
		poly.strokeColor = null;
		
		group.appendTop(poly);
	}

	/*
	for(var i in explosionParticles){
		var body = explosionParticles[i];
		var t = body.m_xf;
		
		var circle = new Path.Circle( new Point(t.position.x, t.position.y), 0.25 );
		circle.fillColor = new CMYKColor(0.0, 1.0, 0.0, 0.0);
		circle.strokeColor = null;

		group.appendTop(circle);
	}
	*/
}



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
var shape = 0;
function onMouseDown(event) {
	//explode(event.point.x, event.point.y);

	//addBox(cWidth/2,cHeight, 300,3);
	//addPolygon(event.point.x, event.point.y);

	
	if(shape%2 == 1) {
		//addBox(event.point.x, event.point.y, random(20,100),random(20,100));
		addBox(event.point.x, event.point.y, 300,3);
	} else if(shape%2 == 0) {
		addCircle(event.point.x, event.point.y, 20);
	} else if(shape%3 == 2) {
		//addTriangle(event.point.x, event.point.y, random(20,100));
		//addPolygon(event.point.x, event.point.y);
	}
	

	/*
	var pts = [];
	for( var i in sel[0].segments ) {
		var pt = new Point( parseInt(sel[0].segments[i].point.x),parseInt(sel[0].segments[i].point.y) );
		pts.push( pt );
	}
	
	addPolygon(event.point.x, event.point.y, pts);
	*/
	shape++
}

/*
function onMouseDrag(event) {
}

function onMouseUp(event) {
}
*/



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function norm(val,start,stop) { return (val - start) / (stop - start); }



// ------------------------------------------------------------------------
function addBox(x,y, w,h) {
	var Box = {
		bodyDef:	new b2BodyDef(),
		shapeDef:	new b2PolygonDef(),
		body:		null
	};
	Box.bodyDef.position.Set(x,y);

	Box.shapeDef.SetAsBox(w*0.5,h*0.5);
	Box.shapeDef.restitution = 0.0;
	Box.shapeDef.density = 100.0;
	Box.shapeDef.friction = 0.1;

	Box.body = world.CreateBody(Box.bodyDef);
	Box.body.w = w;
	Box.body.h = h;
	Box.body.CreateShape(Box.shapeDef);
	Box.body.SetMassFromShapes();

	//push out to array
	boxes.push(Box);
}


// ------------------------------------------------------------------------
function addCircle(x,y, r) {
	var Circle = {
		bodyDef:	new b2BodyDef(),
		shapeDef:	new b2CircleDef(),
		body:		null
	};
	Circle.bodyDef.position.Set(x,y);

	Circle.shapeDef.radius = r;
	Circle.shapeDef.restitution = 0.0;
	Circle.shapeDef.density = 100.0;
	Circle.shapeDef.friction = 0.1;

	Circle.body = world.CreateBody(Circle.bodyDef);
	Circle.body.w = 1.0;
	Circle.body.h = 1.0;
	Circle.body.CreateShape(Circle.shapeDef);
	Circle.body.SetMassFromShapes();

	//push out to array
	circles.push(Circle);
}

// ------------------------------------------------------------------------
function addTriangle(x,y, scale) {
	var points = [
		new b2Vec2( x+scale*0.866 , y+scale*0.5),
		new b2Vec2( x+scale*-0.866, y+scale*0.5),
		new b2Vec2( x, y+scale*-1),
	];

	var Triangle = {
		bodyDef:	new b2BodyDef(),
		shapeDef:	new b2PolygonDef(),
		body:		null
	};
	Triangle.bodyDef.position.Set(x,y)
	//Triangle.bodyDef.type = b2Body.b2_dynamicBody;

	Triangle.shapeDef.restitution = 0.0;
	Triangle.shapeDef.density = 50.0;
	Triangle.shapeDef.friction = 0.1;
	Triangle.shapeDef.vertexCount = points.length;
	for(var i in points) {
		Triangle.shapeDef.vertices[i].Set( points[i].x,points[i].y );
	}
	
	Triangle.body = world.CreateBody(Triangle.bodyDef);
	Triangle.body.CreateShape(Triangle.shapeDef);
	Triangle.body.SetMassFromShapes();

	//push out to array
	triangles.push(Triangle);
}

function addPolygon(x, y, pts) {
	var points = [];
	for(var i in pts) {
		//points.push( new Point(pts[i].x*100,pts[i].y*100) );
		points.push( new Point( random(-100,100), pts[i].y) );
	}

	var Polygon = {
		bodyDef:	new b2BodyDef(),
		shapeDef:	new b2PolygonDef(),
		body:		null
	};
	Polygon.bodyDef.position.Set(x,y);
	Polygon.bodyDef.angle = 0;

	Polygon.shapeDef.vertexCount = points.length;
	for(var i in points) {
		Polygon.shapeDef.vertices[i].Set( points[i].x,points[i].y);
	}
	Polygon.shapeDef.density = 10.0;
	Polygon.shapeDef.friction = 0.1;
	Polygon.shapeDef.restitution = 0.0;

	Polygon.body = world.CreateBody(Polygon.bodyDef);
	Polygon.body.CreateShape(Polygon.shapeDef);
	Polygon.body.SetMassFromShapes();

	//push out to array
	triangles.push(Polygon);
}

/*
function addPolygon(x, y) {
	print('addPolygon(x,y)');
	var points = [];
	for(var i=0; i<randomInt(3,9); i++) {
		points.push( new Point( random(-30,30), random(-30,30)) );
	}

	var Polygon = {
		bodyDef:	new b2BodyDef(),
		shapeDef:	new b2PolygonDef(),
		body:		null
	};
	Polygon.bodyDef.position.Set(x,y);
	Polygon.bodyDef.angle = 0;

	Polygon.shapeDef.vertexCount = points.length;
	for(var i in points) {
		Polygon.shapeDef.vertices[i].Set( points[i].x,points[i].y);
	}
	Polygon.shapeDef.density = 10.0;
	Polygon.shapeDef.friction = 0.1;
	Polygon.shapeDef.restitution = 0.0;

	Polygon.body = world.CreateBody(Polygon.bodyDef);
	Polygon.body.CreateShape(Polygon.shapeDef);
	Polygon.body.SetMassFromShapes();

	//push out to array
	triangles.push(Polygon);
}
*/


// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
// Update(event);
// Draw();

// set a timer that runs the Draw() function 
// every milisecond
var timer = setInterval(Main, 1);


