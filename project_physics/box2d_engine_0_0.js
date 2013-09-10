/**
 *	Box2D Engine 0.0
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 *	packs selected items into the center of the screen
 *	add items by clicking them with the scriptographer tool
 *
 */


// ------------------------------------------------------------------------
// Libraries
// ------------------------------------------------------------------------
include('../libraries/box2d/box2d.js');
include('../libraries/frederickkScript/frederickkScript.js');



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

// load frederickkScript
var f = frederickkScript;

// document properties
var sel;
var palette;

var mousePos = new Point();

// box2d
var cWidth = artboard.bounds.width;
var cHeight = artboard.bounds.height;
var world;

var group = new Group();
var bodies = new Array();



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// setup world
	world = createWorld();

	// sel = activeDocument.getItems({
	// 	type: Item,
	// 	selected: true
	// });

	// palette = new Palette("CirclePack 0.2", components, values);
};



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
	worldUpdate(event);
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {

	for( var i=0; i<bodies.length; i++ ){
		var shape = bodies[i];
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
		poly.fillColor = randomColor();
		poly.strokeColor = null;
		
		group.appendTop(poly);
	}

};



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	var obj = event.item;
	
	addPolygon( event.point.x,event.point.y );

	// add individual group items
	// if(Key.isDown('option')) {
	// 	if(obj.characterStyle != null) {
	// 		obj = BreakText(obj);
	// 	}
	// 
	// 	// groups
	// 	if(obj.hasChildren()) {
	// 		for(var i=0; i<obj.children.length; i++) {
	// 			var child = obj.children[i];
	// 			circles.push( CompoundToPath(obj) );
	// 		}
	// 	}
	// }
	// 
	// // add item to pack
	// else {
	// 	if(obj != null || obj.bounds.center != null) {
	// 		circles.push( CompoundToPath(obj) );
	// 	}
	// }
};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------

/**
 *	Box2Djs 
 *
 *	Ando Yasushi
 *	andyjpn@gmail.com
 *
 *	http://d.hatena.ne.jp/technohippy/
 *
 *	Methods taken from Box2Djs included demos
 *
 */
function createWorld() {
	print('creating box2d world...');


	// setup world
	var worldAABB = new b2AABB();
	worldAABB.minVertex.Set(-cWidth, -1000);
	worldAABB.maxVertex.Set(cWidth, 1000);

	var gravity = new b2Vec2(0, 300);
	var world = new b2World(worldAABB, gravity, true);

	// setup ground
	// x = vertical start point of ground, y = horizontal start point of ground
	var groundPoint = new Point(-100, cHeight);
	// width = ground width, height = thickness of ground
	var groundSize = new Size(cWidth+Math.abs(groundPoint.x*2),2);

	var groundShapeDef = new b2BoxDef();
	groundShapeDef.extents.Set(groundSize.width,groundSize.height);
	groundShapeDef.restitution = 0.5;
	groundShapeDef.friction = 0.5;

	var groundBodyDef = new b2BodyDef();
	groundBodyDef.AddShape(groundShapeDef);
	groundBodyDef.position.Set(groundPoint.x,groundPoint.y);


	// setup walls
	var wallPoint = {
		left:	new Point(0,0),
		right:	new Point(cWidth-2,0)
	};
	var wallSize = {
		left:	new Size(2,cHeight),
		right:	new Size(2,cHeight)
	};


	// add ground + walls to world
	// world.CreateBody(groundBodyDef);
	addBox(world, wallPoint.left.x,wallPoint.left.y,
				  wallSize.left.width,wallSize.left.height);
	addBox(world, wallPoint.right.x,wallPoint.right.y,
				  wallSize.right.width,wallSize.right.height);


	// draw ground and walls
	var wallLeft = new Path.Rectangle( wallPoint.left, wallSize.left );			wallLeft.fillColor = new RgbColor(1,1,1);
	var wallRight = new Path.Rectangle( wallPoint.right, wallSize.right );		wallRight.fillColor = new RgbColor(1,1,1);
	var groundPath = new Path.Rectangle( groundPoint, groundSize );				groundPath.fillColor = new RgbColor(1,1,1);


	return world;
};

function worldUpdate(event) {
	// var timeStep = 1.0/60;
	// var iteration = 1;
	// world.Step(timeStep, iteration);
};


/*
 *	Box Bodies
 */
function addBox(x, y, width, height, fixed) {
	// if(bVerbose) console.log('addBox(' + x + ',' + y + ', ' + width + ',' + height + ')');

	var Box = {
		bodyDef:	new b2BodyDef(),
		shapeDef:	new b2BoxDef(),
		body:		null,
		path:		new Path()
	};

	if (typeof(fixed) == 'undefined') fixed = true;
	if (!fixed) Box.shapeDef.density = 1.0;
	Box.shapeDef.restitution = 0.1;
	Box.shapeDef.friction = 0.7;
	Box.shapeDef.extents.Set(width, height);

	Box.bodyDef.AddShape(Box.shapeDef);
	Box.bodyDef.position.Set(x,y);

	Box.body = world.CreateBody(Box.bodyDef);

	return Box; //world.CreateBody(boxBd)
};


/*
 *	Polygon Bodies
 */
function addPolygon(x, y, pts) {
	var sides = parseInt( random(3,9) );
	var width = 100;
	var height = 100;

	var Triangle = {
		bodyDef:	new b2BodyDef(),
		shapeDef:	new b2PolyDef(),
		body:		null,
		path:		new Path()
	};

	// if (typeof(fixed) == 'undefined') fixed = true;
	// if (!fixed) Triangle.shapeDef.density = 1.0;
	Triangle.shapeDef.restitution = 0.1;
	Triangle.shapeDef.friction = 0.7;
	Triangle.shapeDef.vertexCount = sides;
	for(var i=0; i<sides; i++) {
		var _y = (height*0.6 * Math.cos(i * 2 * Math.PI / sides));
		var _x = (width*0.6 * Math.sin(i * 2 * Math.PI / sides));
		Triangle.shapeDef.vertices[i].Set(_x,_y);
	}

	Triangle.bodyDef.AddShape(Triangle.shapeDef);
	Triangle.bodyDef.position.Set(x,y);

	Triangle.body = world.CreateBody(Triangle.bodyDef);

	return Triangle;
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Animate(true);
Draw();
