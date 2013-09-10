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


// document properties
var groupHolder = new Group();
var sel;

var rasterDefault = 'http://cache.krop.com/patrickhoelck-4a9d8c27f7870.jpg';
var counter = 0;


// values
var values = {
	num: 10,
	angle: 0,

	bTrans: false,
	bRings: false,
	bScale: false
};

// gui components
var components = {
	num: {
		type: 'number',
		label: 'Number of Rings',
		increment: 1
	},
	angle: {
		type: 'number',
		label: 'Rotation Angle',
		min: -360,
		max: 360,
		increment: 1
	},
	
	bTrans: {
		type: 'checkbox',
		label: 'Transparency'
	},
	bRings: {
		type: 'checkbox',
		label: 'Rings Only'
	},
	bScale: {
		type: 'checkbox',
		label: 'Scaling'
	},
	
	
};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	var palette = new Dialog.prompt('Spin 0.0', components, values);

	sel = activeDocument.getItems( { type: Item, selected: true } );
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
	if(sel.length > 1) {
		SpinAlternate( sel );
	} 
	else {
		Spin( sel[0] );
	}
}



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function radians(val) {
	return val * (Math.PI/180);
}

// ------------------------------------------------------------------------
function Spin(obj) {
	for(var i=0; i<values.num; i++) {
		var sz = i/(values.num);
		var circle = Path.Circle(obj.position, (obj.bounds.width*sz))
		var factor = circle.bounds.width / obj.bounds.width;

		var temp = obj.clone();
		var container = new Group();

		container.appendTop(temp);
		container.appendTop(circle);
		container.clipped = true;
		circle.clipMask = true;
		circle.fillColor = new CMYKColor(0.0,0.0,0.0,0.0);

		temp.rotate( radians(-values.angle*sz) );
		if(values.bScale == 'true') temp.scale( sz*2 ); //factor*2 );
		if(values.bTrans == 'true') temp.opacity = sz;

		groupHolder.appendBottom( container );
	}

	temp.remove();
	if(values.bRings == 'true') obj.remove();
	//groupHolder.appendBottom(obj);
}

// ------------------------------------------------------------------------
function SpinAlternate(obj) {
	var num = obj.length;
	for(var i=0; i<values.num; i++) {
		var sz = i/(values.num);
		var circle = Path.Circle(obj[0].position, (obj[0].bounds.width*sz));
		var factor = circle.bounds.width / obj[0].bounds.width;

		var temp = obj[i%num].clone();
		var container = new Group();

		container.appendTop(temp);
		container.appendTop(circle);
		container.clipped = true;
		circle.clipMask = true;
		circle.fillColor = new CMYKColor(0.0,0.0,0.0,0.0);

		temp.position = circle.position;
		temp.rotate( radians(-values.angle*sz) );
		if(values.bScale == 'true') temp.scale( sz*2 ); //factor*2 );
		if(values.bTrans == 'true') temp.opacity = sz;

		if(values.trans) container.opacity = sz;
		groupHolder.appendBottom( container );
	}

	temp.remove();
	if(values.bRings == 'true') obj[0].remove();
	//groupHolder.appendBottom(obj);
}



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
Draw();


