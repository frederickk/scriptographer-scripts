/**
 *	Draw Points
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 *	this idea is 100% ripped off from jonathan puckey
 *	http://www.jonathanpuckey.com/projects/delaunay-raster/
 *
 *	i just modified his oroginal idea to use lines instead of fills
 *
 *	the code is mine and libraries used have been modified
 *	specifically for use with scriptographer (see notes)
 *	
 */



// ------------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------------

// document properties
var sel;





// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems({
		type: Item,
		selected: true
	});
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
	var points = [];

	for(var i=0; i<sel.length; i++) {
		var obj = sel[i];
		var osegs = obj.segments;

		// pull points from segments
		if(osegs != undefined) {
			for(var n=0; n<osegs.length; n++) {
				var os = osegs[n];
				
				points.push( os.point );
				// console.log( os.point.x );
			}
		}

		// nested objects?
		if(obj.children.length != null) {
			for(var j=0; j<obj.children.length; j++) {
				var kid = obj.children[j];
				var ksegs = kid.segments;

				// pull points from segments
				if(ksegs != undefined) {
					// pull points from segments
					for(var k=0; k<ksegs.length; k++) {
						var ks = ksegs[k];
						points.push( ks.point );
						// console.log( ks.point.x );
					}
				}

			}
		}

		obj.remove();
	}

	points = unique(points);

	for(var i=0; i<points.length; i++) {
		if(getType( points[i] ) == 'Point') {
			var path = new Path();
			path.add( points[i] );
		}
	}

};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function unique(arr) {
	var r = new Array();
	o:for(var i = 0, n = arr.length; i < n; i++) {
		for(var x = 0, y = r.length; x < y; x++) {
			if(r[x] == arr[i]) {
				continue o;
			}
		}
		r[r.length] = arr[i];
	}
	return r;
};

function getType(object) {
	if (object instanceof Point) return 'Point';
	else if (object instanceof Size) return 'Size';
	else if (object instanceof Rectangle) return 'Rectangle';
	else if (object instanceof Group) return 'Group';
	else if (object instanceof PlacedItem) return 'PlacedItem';
	else if (object instanceof Raster) return 'Raster';
	else if (object instanceof PlacedSymbol) return 'PlacedSymbol';
	else if (object instanceof Path) return 'Path';
	else if (object instanceof CompoundPath) return 'CompoundPath';
	else if (object instanceof Symbol) return 'Symbol';
	else if (object instanceof TextItem) return 'TextItem';
	else return 'undefined'
};


// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();

// set a timer that runs the Update(event) function
// every milisecond
// var timer = setInterval(Update, 1000/frameRate);

Draw();