/**
*	Item Spin Mask 0.0
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
*  Note from the Scriptographer.org Team
*  
*  In Scriptographer 2.9, we switched to a top-down coordinate system and
*  degrees for angle units as an easier alternative to radians.
*  
*  For backward compatibility we offer the possibility to still use the old
*  bottom-up coordinate system and radians for angle units, by setting the two
*  values bellow. Read more about this transition on our website:
*  http://scriptographer.org/news/version-2.9.064-arrived/
*/

//script.coordinateSystem = 'top-down';
script.coordinateSystem = 'bottom-up';
script.angleUnits = 'radians';


// document properties
var sel;
var object;
var rasterValid;
var pathValid;

var groupHolder = new Group();

// values
var values = {
	num:	10,
	angle:	360,

	trans:	false
};


var components = {
	num: {
		type: 'number',
		label: 'Number of Rings'
	},
	angle: {
		type: 'number',
		label: 'End Rotation (degrees)',
		units: 'degree'
	},

	seperatiob: { 
		type: 'ruler',
		fullSize: true,
	},

	trans: {
		type: 'checkbox',
		label: 'Fade',
	}

};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems(Path, {
		selected: true
	});

	var dialog = new Dialog.prompt('Raster/Object Circle Mask', components, values);

	//gather raster info
	RasterSetup();
	PathSetup();

	//nothing valid
	if(!rasterValid && !pathValid) {
		Dialog.alert('Please choose or create a valid object or raster image');
	}

};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	if(object.length > 1) {
		SpinAlternate( object );
	}
	else {
		Spin(object);
	}
};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function radians(val) {
	return val * (Math.PI/180);
};


// ------------------------------------------------------------------------
function RasterSetup() {
	var rasters = document.getItems({
		type: [Raster, PlacedFile],
		selected: true
	});

	if (rasters.length == 1) {
		object = rasters.first;
		if (object instanceof PlacedFile && !object.eps) {
			object = object.embed(false);
		}
		rasterValid = true;
		object.selected = false;

	}
	else if(rasters.length > 1) {
		object = new Array();
		for(var i in rasters) {
			object.push( rasters[i] );
			if (object[i] instanceof PlacedFile && !object[i].eps) {
				object[i] = object[i].embed(false);
			}
			object[i].selected = false;
		}
		rasterValid = true;

	}
	else {
		rasterValid = false;
	}

};

// ------------------------------------------------------------------------
function PathSetup() {
	//no rasters? valid paths
	if (sel.length > 0) {
		var temp = new Group();
		for( var i=0; i<sel.length; i++ ) {
			temp.appendTop( sel[i] );
		}
		pathValid = true;

		//add white background
		var bg = new Path.Rectangle(temp.position, new Size(temp.bounds.width,temp.bounds.height));
		bg.fillColor = new CMYKColor(0.0, 0.0, 0.0, 0.0);
		bg.strokeColor = null;
		bg.position = temp.position;
		temp.appendBottom( bg );

		object = temp;
	}
	else {
		pathValid = false;
	}
	
};


// ------------------------------------------------------------------------
function Spin(obj) {
	for(var i=0; i<values.num; i++) {
		var sz = i/values.num;
		var circle = Path.Circle(obj.position, (obj.bounds.width*sz)/2)
		var temp = obj.clone();
		temp.rotate( -radians(values.angle*sz) );
		
		var container = new Group();
		container.appendTop(temp);
		container.appendTop(circle);
		container.clipped = true;
		circle.clipMask = true;
		
		if(values.trans) container.opacity = sz;
		groupHolder.appendBottom( container );
	}
	//groupHolder.appendBottom(obj);
};

// ------------------------------------------------------------------------
function SpinAlternate(obj) {
	var num = obj.length;
	for(var i=0; i<values.num; i++) {
		var sz = i/values.num;
		//var circle = Path.Circle(obj[i%num].position, (obj[i%num].bounds.width*sz)/2);
		var circle = Path.Circle(obj[0].position, (obj[0].bounds.width*sz)/2);
		var temp = obj[i%num].clone();
		temp.position = circle.position;
		temp.rotate( -radians(values.angle*sz) );
		
		var container = new Group();
		container.appendTop(temp);
		container.appendTop(circle);
		container.clipped = true;
		circle.clipMask = true;
		
		if(values.trans) container.opacity = sz;
		groupHolder.appendBottom( container );
	}
	//groupHolder.appendBottom(obj);
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Draw();

