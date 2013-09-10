// ------------------------------------------------------------------------
// libraries
// ------------------------------------------------------------------------
include('../libraries/box2d/box2d.js');
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

//script.coordinateSystem = 'bottom-up';
script.coordinateSystem = 'top-down';
script.angleUnits = 'radians';


// document properties
var sel;
var paths = new Array();
var circles = new Array();
var mousePos;

// physics
var cWidth = activeDocument.bounds.width;
var cHeight = activeDocument.bounds.height;
var world;



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// setup world
	var worldAABB = new b2AABB();
	worldAABB.lowerBound.Set(-1000.0, -1000.0)
	worldAABB.upperBound.Set(1000.0, 1000.0)

	var gravity = new b2Vec2(0, 300);
	world = new b2World(worldAABB, gravity, true);


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



	addCircle(cWidth/2,cHeight/2, 20);
}



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
	print('Update(event)');
	var timeStep = 1.0/60;
	var iteration = 1;
	world.Step(timeStep, iteration);


	for(var i in paths){
		var form = paths[i].form;
		var body = paths[i].body;
		var t = body.body.m_xf;
		var pos = new Point(t.position.x,t.position.y);

		/*
		var circle = new Path.Circle(pos, body.shapeDef.radius);
		circle.rotate( body.body.GetAngle() );
		circle.fillColor = new RGBColor(1.0, 1.0, 0.0);
		circle.strokeColor = null;
		*/
		
		//group.appendTop(circle);
	}
}



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	addCircle(event.point.x, event.point.y, 20);
}



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------



// ------------------------------------------------------------------------
// Methods
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

	var path = new Path.Circle(x,y, r);
	path.fillColor = new RGBColor(0,1.0,0);
	path.strokeColor = null;

	var particleGroup = {
		form: path,
		body: Circle
	};
	paths.push( particleGroup )
}


// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();

// set a timer that runs the Update(event) function 
// every milisecond
var timer = setInterval(Update, 1);

//Update(event);
//Draw();
