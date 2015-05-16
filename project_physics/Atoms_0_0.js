/**
 *	Atoms 0.0
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://cargocollective.com/kenfrederick/
 *	http://kenfrederick.blogspot.com/
 *
 *
 */


// ------------------------------------------------------------------------
// libraries
// ------------------------------------------------------------------------
//include('../libraries/toxi/toxiclibs.js');


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
var balls = new Array();
var bPause = false;

//values
var values = {
	bVisible:	true,
	bLimited:	false,
	atoms:		9
};

//components
var components = {
	// ------------------------------------
	// visible
	// ------------------------------------
	bVisible: {
		type: 'checkbox',
		label: 'One atom per item',
		onChange: function(value) {
			components.bLimited.value = !value;
			if(components.bLimited.value) {
				components.atoms.enabled = true;
			} else {
				components.atoms.enabled = false;
			}
		}
	},


	visRule: {
		type: 'ruler',
		fullSize: true,
	},


	// ------------------------------------
	// limited
	// ------------------------------------
	bLimited: {
		type: 'checkbox',
		label: 'Limited number of atoms',
		onChange: function(value) {
			components.bVisible.value = !value;
			if(components.bLimited.value) {
				components.atoms.enabled = true;
			} else {
				components.atoms.enabled = false;
			}
		}
	},
	atoms: {
		type: 'number',
		label: 'Number of atoms',
		enabled: values.bLimited
	},

	// ------------------------------------
	// apply that shit!
	// ------------------------------------
	submit: { 
		type: 'button', 
		value: 'Start',
		fullSize: true,
		onClick: function() {
			Timing();
		}
	},
	playPause: { 
		type: 'button', 
		value: 'Pause',
		fullSize: true,
		onClick: function() {
			bPause = !bPause;
			if(bPause) components.playPause.value = 'Play';
			else components.playPause.value = 'Pause';
		}
	}

	
};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems({
		type: 		Path,
		selected: 	true,
		//locked: 	false
	});

	var palette = new Palette('Atoms 0.0', components, values);
	
	if(values.bVisible) {
		// visible
		for( var i=0; i<sel.length; i++ ) {
			balls.push( new Projectile( activeDocument.bounds.center,1 ) );
		}
	
	}
	else if(values.bLimited) {
		// limited
		for(var i=0; i<values.atoms; i++) {
			balls.push( new Projectile( activeDocument.bounds.center,1 ) );
		}
	}
};



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update() {
	for( var i=0; i<balls.length; i++ ) {
		balls[i].update();
	}
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	//Update();

	if(!bPause) {
		Update();

		if(values.bVisible) {
			// visible
			for( var i=0; i<sel.length; i++ ) {
				var obj = sel[i];

				for( var j=0; j<balls.length; j++ ) {
					var hitResult = obj.hitTest(balls[j].position());

					if(hitResult) {
						obj.split(hitResult);
						obj.segments.last.point += new Point(5,0);

						var col = RandomSwatch(3);
						obj.fillColor = new GradientColor( gradient(balls[j].carrier,col, 'radial'), balls[j].position(),obj.position );
		
						//balls[j].fillColor( col );
						balls[j].carrier = col;
					}
				}
			}

		}
		else if(values.bLimited) {
			// limited
			// for( var i=0; i<sel.length; i++ ) {
			for( var i=0; i<balls.length; i++ ) {
				var obj = sel[i];

				var hitResult = obj.hitTest( balls[i].position() );

				if(hitResult) {
					obj.split(hitResult);
					obj.segments.last.point += new Point(5,0);

					var col = RandomSwatch(3);
					obj.fillColor = new GradientColor( gradient(balls[i].carrier,col, 'radial'), balls[i].position(),obj.position );
	
					//balls[i].fillColor( col );
					balls[i].carrier = col;
				}
			}
	
		}
		
	} // end bPause

}



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function random(minr, maxr) {
	return minr + Math.random() * (maxr - minr);
};

// ------------------------------------------------------------------------
function RandomSwatch(swatchStart) {
	var swatchOut;
	var swatchList = activeDocument.swatches;
	var index = parseInt( random(swatchStart, swatchList.length) );
	var swatchSel = swatchList[index];

	//check if swatch is valid
	if (swatchSel != null && swatchSel.color != null) { 
		swatchOut = swatchSel.color;
	}
	else {
		swatchOut = RandomSwatch(swatchStart, swatchList);
	}

	return swatchOut;
};


function gradient(c1,c2, type) {
	var grad = new Gradient();
	grad.type = type;
	grad.stops = [ new GradientStop(c1, 0), new GradientStop(c2, 1) ];

	return grad;
};



// ------------------------------------------------------------------------
// Classes
// ------------------------------------------------------------------------
function Projectile(pt,sz) {
	// ------------------------------------
	// Properties
	// ------------------------------------
	this.pt = pt;
	this.sz = sz;

	//this.carrier = new RGBColor(0.96, 0.0, 0.96);
	this.carrier = RandomSwatch(3);

	this.mass = new Point( random(0,5),0 );
    this.speed = new Point( this.mass.x,random(-10,10) );

	this.ball = new Path.Circle( this.pt, this.sz );
	this.ball.fillColor = new RGBColor(0.96, 0.96, 0.96);
	this.ball.strokeColor = this.carrier;
	this.ball.strokeWidth = 0.5;
	this.ball.name = 'Projectile';


	// ------------------------------------
	// Methods
	// ------------------------------------
	this.update = function() {
		this.ball.position += this.speed;
		// Check horizontal edges
		if (this.ball.position.x > activeDocument.bounds.width || this.ball.position.x < 0) {
			this.speed.x *= - 1;
			this.speed.x *= random(1.6,0.6);
		}
		//Check vertical edges
		if (this.ball.position.y > activeDocument.bounds.height || this.ball.position.y < 0) {
			this.speed.y *= - 1;
			this.speed.y *= random(1.6,0.6);
		}
	};

	this.position = function() {
		console.log( this.ball.position );
		return this.ball.position;
	};
	this.fillColor = function(col) {
		this.ball.fillColor = col;
	};
	
};



// ------------------------------------------------------------------------
// Execution
// ------------------------------------------------------------------------
Setup();
// Update();
// Draw();

// set a timer that runs the Draw() function 
// every milisecond
function Timing() {
	var timer = setInterval(Draw, 2);
};

