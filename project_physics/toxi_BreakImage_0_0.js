/**
*	Image Mask Grid 0.0
*
*	Ken Frederick
*	ken.frederick@gmx.de
*
*	http://kennethfrederick.de/
*	http://blog.kennethfrederick.de/
*
*	Kyle Phillips
*	kyle@haptic-data.com/
*
*	http://haptic-data.com/
*
*/


// ------------------------------------------------------------------------
// libraries
// ------------------------------------------------------------------------
include('build/toxiclibs.js');


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
var rasters;
var shapeCustom;

var groupParticle;
var paths = new Array();

// physics
var physics;
var mouseAttractor;
var mousePos;
var bSetupIsDone = false;


//values
var values = {
	// cols & rows
	cols:			5,
	rows:			5,

	// shapes
	shapes:			'square',
	polygonNum:		3

};

//components
var components = {
	// ------------------------------------
	// cols & rows
	// ------------------------------------
	colsRowsRule: { 
		type:			'ruler',
		label:			'Division',
		fullSize:		true,
	},

	cols: { 
		type:			'number',
		label:			'Columns',
		steppers:		true,
		increment:		1,
		fullSize:		true,
	},
	rows: { 
		type:			'number',
		label:			'Rows',
		steppers:		true,
		increment:		1,
		fullSize:		true,
	},



	// ------------------------------------
	// shapes
	// ------------------------------------
	shapesRule: { 
		type:			'ruler',
		label:			'Shapes',
		fullSize:		true,
	},

	shapes: {
		type:			'list',
		//label:		'Shapes',
		options:		['square', 'circle', 'polygon', 'custom'],
		enabled:		true,
		fullSize:		true,
		onChange: function(value) {
			if(value == 'polygon')
				components.polygonNum.enabled = true;
			else 
				components.polygonNum.enabled = false;
		}
	},
	polygonNum: {
		type:			'number',
		label:			'Number of Sides',
		enabled:		false
	},



	// ------------------------------------
	// Invocation
	// ------------------------------------
	applyRule: { 
		type:			'ruler',
		fullSize:		true,
	},

	submit: { 
		type:			'button', 
		value:			'Go!',
		fullSize:		true,
		onClick: function() {
			Draw();
		}
	}


};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// setup physics with 10% drag
	physics = new toxi.physics2d.VerletPhysics2D();
	physics.setDrag(0.05);
	physics.setWorldBounds(new toxi.Rect(0, 0, activeDocument.bounds.width, activeDocument.bounds.height));

	// the NEW way to add gravity to the simulation, using behaviors
	//physics.addBehavior(new toxi.physics2d.GravityBehavior(new toxi.Vec2D(0, 0.15)));
	groupParticle = new Group();

	// initialize the dialog box
	var dialog = new Palette('Image Mask Grid 0.0', components, values);


	// how many images/rasters
	rasters = document.getItems({
		type: [Raster, PlacedFile],
		selected: true
	});

	// how many "others"
	sel = activeDocument.getItems({
		type: Path,
		selected: true
	});
}



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
	if(bSetupIsDone) {
		//print('Update(event)', groupParticle.children.length);
		//print('physics.particles', physics.particles.length);
		physics.update();


		for ( var i=0; i<paths.length; i++ ) {
		//for (var i=0; i<physics.particles.length; i++) {
			var p = physics.particles[i];
			paths[i].position = new Point(p.x, p.y);
		}

		/*
		for(var i in groupParticle.children) {
			print(i);
		}

		/*
		for( var i=0; i<sel.length; i++ ) {
		}
		*/
	}
}



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	for(var i in rasters) {
		var img = rasters[i];
		groupParticle.appendBottom( SlideDice(img) );
	}

	/*
	for( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];

		if(sel[i].layer.name == 'custom') {
			shapeCustom = obj.clone();
			obj.selected = false;
		}

		SlideDice(obj);
	}
	*/

	bSetupIsDone = true;
	print('physics.particles', physics.particles.length);
}



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function SlideDice(object) {
	var objectGroup = new Group();
	
	var width = object.width/values.cols;
	var height = object.height/values.rows;

	for(var y=object.bounds.y; y<object.bounds.y+object.height; y+=height) {
		for(var x=object.bounds.x; x<object.bounds.x+object.width; x+=width) {
			// slices
			var form;

			if(values.shapes == 'square') {
				// square
				form = new Path.Rectangle( new Point(0,0), new Size(width,height) );
			} 
			else if(values.shapes == 'circle') {
				// circle
				form = new Path.Circle(0,0, width/2);
				//form = new Path.Oval( 0,0, width,height );
			}
			else if(values.shapes == 'polygon') {
				// polygon
				form = new Path.RegularPolygon(new Point(0,0), values.polygonNum, width);
				form.width = width;
				form.height = height;
			}
			else if(values.shapes == 'custom') {
				// custom
				form = shapeCustom.clone();
			}
			
			form.position = new Point(x,y);
			var objectClone = object.clone();
			
			// create mask
			var group = new Group();
			group.appendTop( objectClone );
			group.appendTop( form );
			group.clipped = true;
			form.clipMask = true;

			objectGroup.appendTop( group );
			

			// for each "slice" add a particle
			//var loc = toxi.Vec2D.randomVector().scale(1).addSelf(object.bounds.x,object.bounds.y);
			var loc = toxi.Vec2D.randomVector().scale(0).addSelf(object.position.x, object.position.y);
			var p = new toxi.physics2d.VerletParticle2D(loc);
			physics.addParticle(p);

			var dist = (object.bounds.width+object.bounds.height)/2;
			physics.addBehavior(new toxi.physics2d.AttractionBehavior(p, dist, 1.0, 0.1));
			paths.push( group );
		}
	}

	object.selected = false;
	objectGroup.selected = true;
	
	return objectGroup;
}



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	mousePos = new toxi.Vec2D(event.point.x, event.point.y);

	// create a new positive attraction force field around the mouse position (radius = 250px)
	mouseAttractor = new toxi.physics2d.AttractionBehavior(mousePos, 250, 0.9);
	physics.addBehavior(mouseAttractor);
}

function onMouseDrag(event) {
	// update mouse attraction focal point
	mousePos.set(event.point.x, event.point.y);
}

function onMouseUp(event) {
	// remove the mouse attraction when button has been released
	physics.removeBehavior(mouseAttractor);
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
