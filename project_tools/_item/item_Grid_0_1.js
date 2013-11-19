/**
 *	Grid 0.1
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
// Libraries
// ------------------------------------------------------------------------
include('../../libraries/folio/scriptographer.folio.js');



// ------------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------------
script.coordinateSystem = 'bottom-up';

// document properties
var sel;
var group;

// the core folio namespace
var f = folio;
var ftime = f.FTime;

// easing
var ease = new ftime.Ease();
var easeNames = [];
for( var name in ease ) {
	if( name != 'spline' ) easeNames.push( name );
}

// values
var values = { 
	width:			activeDocument.activeArtboard.bounds.width,
	height:			activeDocument.activeArtboard.bounds.height,

	easing: 		'linear',
	horizontal: 	false,
	vertical: 		false,

	frequency: 		2,
	snap: 			true,

	spacingX: 		20,
	spacingY: 		20,

	overlap: 		true
};

// components
var components = {
	width: {
		type: 'number',
		steppers: true,
		units: 'point',
		label: 'Width'
	},
	height: {
		type: 'number',
		steppers: true,
		units: 'point',
		label: 'Height'
	},

	rule2: {
		type: 'ruler'
	},

	easing: {
		type: 'list',
		label: 'Easing Type',
		options: easeNames,
		fullSize: true
	},

	horizontal: {
		type: 'checkbox',
		label: 'Ease Horizontal'
	},
	vertical: {
		type: 'checkbox',
		label: 'Ease Vertical'
	},

	rule3: {
		type: 'ruler'
	},

	frequency: {
		type: 'number',
		steppers: true,
		label: 'Distribution Frequency'
	},
	snap: {
		type: 'checkbox',
		label: 'Snap'
	},

	rule4: {
		type: 'ruler'
	},

	spacingX: {
		type: 'number',
		steppers: true,
		units: 'point',
		label: 'Spacing X'
	},
	spacingY: {
		type: 'number',
		steppers: true,
		units: 'point',
		label: 'Spacing Y'
	},

	rule5: {
		type: 'ruler'
	},

	overlap: {
		type: 'checkbox',
		label: 'Overlap'
	},

	rule6: {
		type: 'ruler'
	},

	gogogo: {
		type: 'button',
		value: 'Go! Go! Go!',
		fullSize: true,
		onClick: function() {
			Draw();
		}
	}
};


// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	var palette = new Palette('Grid + Easing Example', components, values);

	// create initial group
	group = new Group();
};



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	// clean out previous iterations
	group.removeChildren();

	// gather selected items
	sel = activeDocument.getItems({
		type: Path,
		selected: true
	});

	// draw one grid per selection
	for( var i=0; i<sel.length; i++ ) {
		// draw grid
		var grid = Grid(
			new Size( values.width, values.height ),
			sel[i],
			{ 
				easing: ease[values.easing],
				horizontal: values.horizontal,
				vertical: values.vertical,
				// checkerboard: true
				frequency: values.frequency,
				snap: values.snap,
				spacing: [values.spacingX, values.spacingY],
				overlap: values.overlap
			}
		);

		// post grid work
		var origin = new Point(values.width/2, 0);
		for( var j=grid.children.length-1; j>0; --j ) {
			var item = grid.children[j];
			var distance = item.position.getDistance( origin );
			if( distance > values.height || 
				distance > values.width ) {
				// if item outside of desired radius
				// get rid of it
				item.remove();
			}
			else {
				// else keep it and fill it with random color
				item.fillColor = new CMYKColor(
					Math.random(),
					Math.random(),
					Math.random(),
					Math.random()
				);
				// scale it
				item.scale( map(distance, 0,values.width, 1.0,0.1) );
			}
		}

		group.appendTop( grid );
	}

};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
/**
 *	create a grid (requires folio.js)
 *	TODO: add to folio.js
 *
 *	@param {Size} size        size of the grid
 *	@param {Path} unit        path item to build grid with
 *	@param {Array} options    an array of options
 * 				easing:       {Funtion} easing function
 * 				horizontal:   {Boolean} apply easing fucintion to horizontal axis
 * 				vertical: 	  {Boolean} apply easing fucintion to vertical axis
 * 				checkerboard: {Boolean} create 'checkerboard' patthern (same as frequency: 2)
 * 				frequency:    {Number} frequency to draw a dot
 * 				snap:         {Boolean} snap x and y values to unit width and height (respectively)
 * 				spacing:      {Array} spacing between unit 
 * 				overlap:      {Boolean} allow overlap (default: false)
 *
 *	@return {Group} grid as group
 */
var Grid = function(size, unit, options) {
	var grid = new Group();
	var space = (options.spacing != null)
		? new Size(options.spacing)
		: (options.spacing.length == 1 || options.spacing.length == undefined
			? new Size(options.spacing,options.spacing)
			: new Size(0,0));
	var num = new Point(
		size.width/(unit.bounds.width+space.width),
		size.height/(unit.bounds.height+space.height)
	);
	var frequency = (options.checkerboard)
		? 2
		: (options.frequency != null
			? options.frequency
			: 1);

	for( var i=0; i<num.x; i++ ) {
		for( var j=0; j<num.y; j++ ) {
			var ex = (options.horizontal && options.easing != null)
				? options.easing(i/num.x)
				: i/num.x;
			var ey = (options.vertical && options.easing != null)
				? options.easing(j/num.y)
				: j/num.y;

			var center = new Point(
				(options.snap) 
					? snap( ex*(size.width), (unit.bounds.width) )+space.width
					: ex*(size.width+space.width),
				(options.snap)
					? snap( ey*(size.height), (unit.bounds.height) )+space.height
					: ey*(size.height+space.height)
			);

			if( (i+j) % frequency == 0 ) {
				var path = unit.clone();
				path.position = center;
				path.selected = false;
				grid.appendTop( path );
			}
		}
	}

	// clean up overlaps
	// Jonathan Puckey
	// http://scriptographer.org/Forum/Discussion/Gearwheels/
	// TODO: add to scriptographer.folio.js
	function pathsOverlap(path1, path2) {
		var shape1 = new java.awt.geom.Area(path1.toShape());
		var shape2 = new java.awt.geom.Area(path2.toShape());
		shape1.intersect(shape2);
		return !shape1.isEmpty();
	};

	// is there a better way?
	if(!options.overlap) {
		for( var i=grid.children.length-1; i>0; i-- ) {
			var ipath = grid.children[i];		
			for( var j=i-1; j>0; j-- ) {
				try {
					var jpath = grid.children[j];
					if( pathsOverlap(ipath, jpath) ) {
						jpath.remove();
					}
				}
				catch(err) {}
			}
		}
	}

	return grid;
};




// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Animate(false);
// Draw();